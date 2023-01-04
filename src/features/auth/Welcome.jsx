import useAuth from "../../hooks/useAuth";
import {Link} from "react-router-dom";
import useTitle from "../../hooks/useTitle";

function Welcome() {
    useTitle("Inventory Management | Home");
    const {username, isFirstLogin, userId} = useAuth();

    const date = new Date();
    const today = new Intl.DateTimeFormat("en-GB", {dateStyle: "full", timeStyle: "short"}).format(date);

    return (
        <section className="welcome">
            <p>{today}</p>
            <h2>Welcome {username}!</h2>
            {isFirstLogin && 
                <p className="first-login-warning">
                    Your password was set by who created the user. 
                    For prevent the further conflicts please change your password with the following link.
                    <br/>
                    <Link to={`/dash/users/edit/${userId}`}>Change Password</Link>
                </p>
            }
        </section>
    )
}

export default Welcome