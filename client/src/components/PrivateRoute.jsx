import { Navigate, Outlet } from "react-router-dom";
import { isAuth } from "../utils/helpers";

const PrivateRoute = () => {
  return isAuth() ? <Outlet /> : <Navigate to={"/signin"} />;
};

export default PrivateRoute;
