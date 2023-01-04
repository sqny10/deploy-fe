import {useGetUsersQuery} from "./usersApiSlice";
import User from "./User";
import Spinner from "../../components/Spinner";
import useTitle from "../../hooks/useTitle";

function UsersList() {
    useTitle("Inventory Management | Users");

    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery("usersList", {
        pollingInterval: 60 * 1000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    let content;

    if(isLoading) content = <Spinner/>;

    if(isError) content = <p className="err-msg">{error?.data?.message}</p>;

    if(isSuccess){
        const {ids} = users;

        const tableBody = ids?.length && ids.map(userId => <User userId={userId} key={userId}/>)

        content = (
            <>
                <div className="header-container">
                    <h2>User Settings</h2>
                </div>
                <table className="list-table">
                    <thead>
                        <tr>
                            <th className="nowrap">Username</th>
                            <th className="nowrap">Roles</th>
                            <th className="nowrap">Active</th>
                            <th className="nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableBody}
                    </tbody>
                </table>
            </>
        );
    }

    return content
}

export default UsersList