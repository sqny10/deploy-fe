import {useEffect} from "react";
import {store} from "../../app/store";
import {productsApiSlice} from "../products/productsApiSlice";
import {usersApiSlice} from "../users/usersApiSlice";
import {Outlet} from "react-router-dom";

function Prefetch() {
    useEffect(() => {
        store.dispatch(productsApiSlice.util.prefetch("getProducts", "productsList", {force: true}));
        store.dispatch(usersApiSlice.util.prefetch("getUsers", "usersList", {force: true}));
    }, []);

    return <Outlet/>
}

export default Prefetch