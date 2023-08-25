import { Navigate, Outlet } from "react-router-dom";
import { isAuth } from "../utils/helpers";

const AdminRoute = () => {
  return isAuth() && isAuth().role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to={"/"} />
  );
};

export default AdminRoute;
