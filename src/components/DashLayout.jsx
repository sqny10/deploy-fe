import {Outlet} from "react-router-dom";
import DashHeader from "./DashHeader";
import DashFooter from "./DashFooter";

function DashLayout() {
    return (
        <>
            <DashHeader/>
            <section className="container">
                <Outlet/>
            </section>
            <DashFooter/>
        </>
    )
}

export default DashLayout