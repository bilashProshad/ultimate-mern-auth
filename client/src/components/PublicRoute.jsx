import { Navigate, Outlet } from "react-router-dom";
import { isAuth } from "../utils/helpers";

const PublicRoute = () => {
  return !isAuth() ? <Outlet /> : <Navigate to={"/"} />;
};

export default PublicRoute;
