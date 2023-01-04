import {Link} from "react-router-dom";

function Public() {
    return (
        <section className="public">
            <header>
                <h1>Welcome to <span className="nowrap stand-out">Inventory Management</span></h1>
            </header>
            <main>
                <p className="main-p">This application was built on the purpose of the businesses have full control of their inventories</p>
                <div className="contact">
                    <p>In case of issues please contact us with the following ways</p>
                    <a href="mailto:support@inventorymanagement.com">Email</a>
                    <a href="tel:00905555555555">Phone</a>
                </div>
                <address className="address">
                    Inventory Management <br />
                    1st Foo Street <br />
                    Foo City / Foo Country <br />
                    Phone: +90 555 555 5555 <br />
                    Email: support@inventorymanagement.com
                </address>
            </main>
            <footer>
                <Link to="/login">Employee Login</Link>
            </footer>
        </section>
    )
}

export default Public