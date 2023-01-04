import {useRef, useState, useEffect} from "react";
import {useNavigate, Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setCredentials} from "./authSlice";
import {useLoginMutation} from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import Spinner from "../../components/Spinner";
import useTitle from "../../hooks/useTitle";

function Login() {
    useTitle("Inventory Management | Login");

    const userRef = useRef();
    const errRef = useRef();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [persist, setPersist] = usePersist();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, {isLoading}] = useLoginMutation();

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg("");
    }, [username, password]);
    
    const onUsernameChanged = (e) => setUsername(e.target.value);
    const onPasswordChanged = (e) => setPassword(e.target.value);
    const onPersistChanged = () => setPersist(prev => !prev);
    
    const onLoginClicked = async (e) => {
        e.preventDefault();
        try {
            const {accessToken} = await login({username, password}).unwrap();
            dispatch(setCredentials({accessToken}));
            setUsername("");
            setPassword("");
            navigate("/dash");
        } catch (error) {
            if(!error.status){
                setErrMsg("No server response");
            }else if(error.status === 400){
                setErrMsg("Please fill all the fields");
            }else if(error.status === 401){
                setErrMsg("Unauthorized");
            }else{
                setErrMsg(error?.data?.message);
            }

            errRef.current.focus();
        }
    }
    
    const errorClass = errMsg ? "err-msg" : "d-none";

    if(isLoading) return <Spinner/>;

    return (
        <section className="public">
            <header>
                <h1 className="nowrap stand-out">Inventory Management</h1>
            </header>
            <main className="adjustiable-container">
                <p ref={errRef} aria-live="assertive" className={errorClass}>{errMsg}</p>
                <form className="form">
                    <div className="header-container">
                        <h2>Login</h2>
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input 
                            className="form-input"
                            type="text"
                            id="username"
                            name="username"
                            autoComplete="off"
                            ref={userRef}
                            value={username}
                            onChange={onUsernameChanged}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            className="form-input"
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={onPasswordChanged}
                        />
                    </div>
                    <div className="form-group checkbox">
                    <label htmlFor="persist">
                        <input 
                            className="form-input"
                            type="checkbox"
                            id="persist"
                            name="persist"
                            checked={persist}
                            onChange={onPersistChanged}
                        />
                        Keep me logged in
                    </label>
                </div>
                    <button
                        className="form-button"
                        type="submit"  
                        onClick={onLoginClicked} 
                    >
                        Login
                    </button>
                </form>
            </main>
            <footer>
                <Link to="/">Back to Hone</Link>
            </footer>
        </section>
    )
}

export default Login