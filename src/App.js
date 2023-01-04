import {Routes, Route} from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import UsersList from "./features/users/UsersList";
import ProductsList from "./features/products/ProductsList";
import ProductDetails from "./features/products/ProductDetails";
import NewProduct from "./features/products/NewProduct";
import NewUser from "./features/users/NewUser";
import ProductEdit from "./features/products/ProductEdit";
import UserEdit from "./features/users/UserEdit";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import useTitle from "./hooks/useTitle";

function App() {
  useTitle("Inventory Management");

  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Public/>}/>
        <Route path="login" element={<Login/>}/>

        <Route element={<PersistLogin/>}>
          <Route element={<RequireAuth allowedRoles={["Employee", "Manager", "Admin"]}/>}>
            <Route element={<Prefetch/>}>
              <Route path="dash" element={<DashLayout/>}>
                <Route index element={<Welcome/>}/>

                <Route path="users">
                  <Route index element={<UsersList/>}/>
                  <Route path="new" element={<NewUser/>}/>
                  <Route path="edit/:userId" element={<UserEdit/>}/>
                </Route>

                <Route path="products">
                  <Route index element={<ProductsList/>}/>
                  <Route path=":productId" element={<ProductDetails/>}/>
                  <Route path="new" element={<NewProduct/>}/>
                  <Route path="edit/:productId" element={<ProductEdit/>}/>
                </Route>

              </Route>
            </Route>
          </Route>
        </Route>

      </Route>
    </Routes>
  );
}

export default App;
