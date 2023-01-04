import {useState, useEffect} from "react";
import {useDeleteUserMutation, useUpdateUserMutation} from "./usersApiSlice";
import {useNavigate} from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const USER_REGEX = /^[A-z0-9]{4,20}$/;
const PASSWORD_REGEX = /^[A-z0-9!@#$%]{4,20}$/;

function UserEditForm({user}) {
    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation();

    const [deleteUser, {
        isSuccess: isDeleteSuccess,
        isError: isDeleteError,
        error: deleteError
    }] = useDeleteUserMutation();

    const [username, setUsername] = useState(user.username);
    const [validUsername, setValidUsername] = useState(false);
    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [password2, setPassword2] = useState("");
    const [manager, setManager] = useState(user.roles.includes("Manager"));
    const [active, setActive] = useState(user.active);

    const {userId, status, isManager, isAdmin} = useAuth();

    const navigate = useNavigate();

    // REGEX check for username
    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username]);

    // REGEX check for password
    useEffect(() => {
        setValidPassword(PASSWORD_REGEX.test(password))
    }, [password]);

    // If submitted or deleted successfully
    useEffect(() => {
        if(isSuccess || isDeleteSuccess){
            setUsername("");
            setPassword("");
            navigate("/dash/users");
        }
    }, [isSuccess, isDeleteSuccess, navigate]);

    const onUsernameChanged = (e) => setUsername(e.target.value);
    const onPasswordChanged = (e) => setPassword(e.target.value);
    const onPassword2Changed = (e) => setPassword2(e.target.value);
    const onActiveChanged = () => setActive(prev => !prev);
    const onManagerChanged = () => setManager(prev => !prev);

    // Checks for every field is valid
    let canSave;
    if(password){
        canSave = [validUsername, validPassword, password === password2].every(Boolean) && !isLoading;
    }else{
        canSave = [!password, validUsername].every(Boolean) && !isLoading;
    }

    const onSaveUserClicked = async (e) => {
        e.preventDefault();

        if(password && canSave){
            await updateUser({id: user.id, username, password, roles: manager ? ["Employee", "Manager"] : ["Employee"], active});
        }

        if(!password && canSave){
            await updateUser({id: user.id, username, roles: manager ? ["Employee", "Manager"] : ["Employee"], active});
        }
    }

    const onDeleteUserClicked = async (e) => {
        e.preventDefault();
        await deleteUser({id: user.id});
    }

    const errorClass = (isError || isDeleteError) ? "err-msg" : "d-none";
    const validUserClass = (username && !validUsername) ? "form-input form-error" : "form-input";
    const validpasswordClass = (password && !validPassword) ? "form-input form-error" : "form-input";

    const errMsg = (error?.data?.message || deleteError?.data?.message) ?? "";

    return (
        <section className="adjustiable-container">
            <p className={errorClass}>{errMsg}</p>
            <form className="form">
                <div className="header-container">
                    <h2>Edit User</h2>
                    {((isManager || isAdmin) && !user.roles.includes("Admin")) &&
                        <div className="button-container">
                            <button
                                className="list-button product"
                                onClick={onDeleteUserClicked}
                            >
                                Delete
                            </button>
                        </div>
                    }
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input 
                        className={validUserClass}
                        type="text"
                        id="username"
                        name="username"
                        autoComplete="off"
                        value={username}
                        onChange={onUsernameChanged}
                    />
                </div>
                {
                    (user.id === userId) && 
                    <>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                className={validpasswordClass}
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={onPasswordChanged}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password2">Confirm Password</label>
                            <input 
                                className="form-input"
                                type="password"
                                id="password2"
                                name="password2"
                                value={password2}
                                onChange={onPassword2Changed}
                            />
                        </div>
                    </>
                }
                {
                    (status === "Admin") &&
                    <div className="form-group checkbox">
                        <label htmlFor="manager">
                            <input 
                                className="form-input"
                                type="checkbox"
                                id="manager"
                                name="manager"
                                checked={manager}
                                onChange={onManagerChanged}
                            />
                            Manager
                        </label>
                    </div>
                }
                <div className="form-group checkbox">
                    <label htmlFor="active">
                        <input 
                            className="form-input"
                            type="checkbox"
                            id="active"
                            name="active"
                            checked={active}
                            onChange={onActiveChanged}
                        />
                        Active
                    </label>
                </div>
                <button
                    className="form-button"
                    type="submit"  
                    onClick={onSaveUserClicked} 
                    disabled={!canSave} 
                >
                    Save Changes
                </button>
            </form>
        </section>
    )
}

export default UserEditForm