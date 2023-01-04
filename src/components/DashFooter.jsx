import {useNavigate} from "react-router-dom";
import {useSendLogoutMutation} from "../features/auth/authApiSlice";
import {useEffect} from "react";
import useAuth from "../hooks/useAuth";
import Spinner from "./Spinner";

function DashFooter() {
    const {username, status} = useAuth();
    const navigate = useNavigate();

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation();

    useEffect(() => {
        if(isSuccess) navigate("/");
    }, [isSuccess, navigate]);

    if(isLoading) return <Spinner/>;

    if(isError) return <p className="err-msg">Error: {error?.data?.message}</p>;

    return (
        <footer className='dash-footer'>
            <div className="flex-container">
                <p>Current User: {username}</p>
                <p>Status: {status}</p>
            </div>
            <button
                className="text-button"
                onClick={sendLogout}
            >
                Logout
            </button>
        </footer>
    )
}

export default DashFooter