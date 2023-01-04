import {useState, useEffect} from "react";
import {useAddNewUserMutation} from "./usersApiSlice";
import {useNavigate} from "react-router-dom";
import useTitle from "../../hooks/useTitle";

const USER_REGEX = /^[A-z0-9]{4,20}$/;
const PASSWORD_REGEX = /^[A-z0-9!@#$%]{4,20}$/;

function NewUser() {
    useTitle("Inventory Management | New User");

    const [addNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation();

    const [username, setUsername] = useState("");
    const [validUsername, setValidUsername] = useState(false);
    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [password2, setPassword2] = useState("");

    const navigate = useNavigate();

    // REGEX check for username
    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username]);

    // REGEX check for password
    useEffect(() => {
        setValidPassword(PASSWORD_REGEX.test(password))
    }, [password]);

    // If submitted successfully
    useEffect(() => {
        if(isSuccess){
            setUsername("");
            setPassword("");
            setPassword2("");
            navigate("/dash/users")
        }
    }, [isSuccess, navigate]);
    
    const onUsernameChanged = (e) => setUsername(e.target.value);
    const onPasswordChanged = (e) => setPassword(e.target.value);
    const onPassword2Changed = (e) => setPassword2(e.target.value);
    
    // Checks for every field is valid
    const canSave = [validUsername, validPassword, password === password2].every(Boolean) && !isLoading;

    const onCreateUserClicked = async (e) => {
        e.preventDefault();

        if(canSave){
            await addNewUser({username, password})
        }
    }

    const errorClass = isError ? "err-msg" : "d-none";
    const validUserClass = (username && !validUsername) ? "form-input form-error" : "form-input";
    const validPasswordClass = (password && !validPassword) ? "form-input form-error" : "form-input";

    return (
        <section className="adjustiable-container">
            <p className={errorClass}>{error?.data?.message}</p>
            <form className="form">
                <div className="header-container">
                    <h2>Add New User</h2>
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
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        className={validPasswordClass}
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
                <button
                    className="form-button"
                    type="submit"  
                    onClick={onCreateUserClicked} 
                    disabled={!canSave} 
                >
                    Create User
                </button>
            </form>
        </section>
    )
}

export default NewUser