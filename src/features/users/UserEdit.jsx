import {useGetUsersQuery} from "./usersApiSlice";
import {useParams} from "react-router-dom";
import UserEditForm from "./UserEditForm";
import useAuth from "../../hooks/useAuth";
import Spinner from "../../components/Spinner";
import useTitle from "../../hooks/useTitle";

function UserEdit() {
    useTitle("Inventory Management | Edit User");

    const {userId} = useParams();

    const {status, userId: loggedInUserId} = useAuth();

    const {user} = useGetUsersQuery("usersList", {
        selectFromResult: ({data}) => ({
            user: data?.entities[userId]
        })
    });

    // If try to reach unauthorized page via address line
    if(user
        && ((user.roles.includes("Admin") && status !== "Admin") 
        || (status === "Manager" && userId !== loggedInUserId && user.roles.includes("Manager")) 
        || (status === "Employee" && userId !== loggedInUserId))
    ){
        return <p className="err-msg">Not Authorized!</p>
    }

    return (user ? <UserEditForm user={user}/> : <Spinner/>)
}

export default UserEdit