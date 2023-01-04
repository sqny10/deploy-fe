import {Link} from "react-router-dom";
import {useRef, useEffect} from "react";

function DashHeader() {
    const menuListRef = useRef();
    const menuButtonRef = useRef();
    const menuRef = useRef();

    const onMenuButtonClicked = () => {
        menuListRef.current.classList.toggle("open");
        if(menuButtonRef.current.getAttribute("aria-expanded") === "false" && menuListRef.current.classList.contains("open")){
            menuButtonRef.current.setAttribute("aria-expanded", "true");
        }else{
            menuButtonRef.current.setAttribute("aria-expanded", "false");
        }
    }

    const closeMenu = () => {
        menuButtonRef.current.setAttribute("aria-expanded", "false");
        menuListRef.current.classList.remove("open");
    }

    useEffect(() => {
        const onOutsideClick = (e) => {
            if(!menuRef.current.contains(e.target)){
                closeMenu();
            }
        }

        document.body.addEventListener("click", onOutsideClick);

        return () => document.body.removeEventListener("click", onOutsideClick);
    }, []);


    return (
        <header className="dash-header">
            <Link to="/dash"><h1>Company Inventory</h1></Link>
            <nav ref={menuRef} className="site-nav">
                <button 
                    onClick={onMenuButtonClicked} 
                    className="menu-toggle" 
                    aria-controls="primary-navigation" 
                    aria-expanded="false"
                    ref={menuButtonRef}
                >
                    <span className="visually-hidden nowrap">Menu</span>
                    <div className="hamburger" aria-hidden="true"></div>
                </button>
                <ul ref={menuListRef} id="primary-navigation" className="menu-list">
                    <li className="menu-list-item">
                        <Link onClick={closeMenu} to="/dash">Home</Link>
                    </li>
                    <li className="menu-list-item">
                        <Link onClick={closeMenu} to="/dash/products">All Products</Link>
                    </li>
                    <li className="menu-list-item">
                        <Link onClick={closeMenu} to="/dash/products/new">New Product</Link>
                    </li>
                    <li className="menu-list-item">
                        <Link onClick={closeMenu} to="/dash/users">User Settings</Link>
                    </li>
                    <li className="menu-list-item">
                        <Link onClick={closeMenu} to="/dash/users/new">New User</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default DashHeader