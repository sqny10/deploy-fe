import {useGetUsersQuery} from "./usersApiSlice";
import {useNavigate} from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {memo} from "react";

function User({userId}) {
    const {user} = useGetUsersQuery("usersList", {
        selectFromResult: ({data}) => ({
            user: data?.entities[userId]
        })
    });

    const {status, userId: loggedInUserId} = useAuth();

    const navigate = useNavigate();

    if(user){
        const handleEdit = () => navigate(`/dash/users/edit/${userId}`);

        let editButtonContent;
        if(status === "Admin" || (status === "Manager" && user.roles.length === 1) || userId === loggedInUserId){
            editButtonContent = (
                <button 
                    className="list-button"
                    onClick={handleEdit}
                >
                    Edit
                </button>
            );
        }

        const userRolesString = user.roles.toString().replaceAll(",", " | ");
        const isActive = user.active ? "Active" : "Inactive";
        const rowClass = user.active ? "row" : "row row-error";

        return (
            <tr className={rowClass}>
                <td className="nowrap">{user.username}</td>
                <td className="expand">{userRolesString}</td>
                <td className="nowrap">{isActive}</td>
                <td className="nowrap">{editButtonContent}</td>
            </tr>
        )
    }else return null
}

const memoizedUser = memo(User);

export default memoizedUser