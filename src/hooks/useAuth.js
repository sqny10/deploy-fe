import {useSelector} from "react-redux";
import {selectCurrentToken} from "../features/auth/authSlice";
import jwtDecode from "jwt-decode";

function useAuth() {
    const token = useSelector(selectCurrentToken);
    let isManager = false;
    let isAdmin = false;
    let status = "Employee";
    let isFirstLogin = false;

    if(token){
        const decoded = jwtDecode(token);
        const {username, roles, firstLogin, userId} = decoded.UserInfo;

        isManager = roles.includes("Manager");
        isAdmin = roles.includes("Admin");
        isFirstLogin = firstLogin;

        if(isManager) status = "Manager";
        if(isAdmin) status = "Admin";

        return {username, roles, status, isManager, isAdmin, isFirstLogin, userId}
    }

    return {username: "", roles: [], status, isManager, isAdmin, isFirstLogin, userId: ""}
}

export default useAuth