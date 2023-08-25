import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAuth, signout } from "../utils/helpers";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (location.pathname === path) {
      return "text-dark";
    }
    return "text-light";
  };

  const nav = (
    <ul className="nav nav-tabs bg-primary">
      <li className="nav-item">
        <Link to="/" className={`nav-link ${isActive("/")}`}>
          Home
        </Link>
      </li>
      {!isAuth() && (
        <>
          <li className="nav-item">
            <Link to="/signin" className={`nav-link ${isActive("/signin")}`}>
              Signin
            </Link>
          </li>
          <li className="nav-item ">
            <Link to="/signup" className={`nav-link ${isActive("/signup")}`}>
              Signup
            </Link>
          </li>
        </>
      )}
      {isAuth() && (
        <li className="nav-item">
          <span style={{ cursor: "pointer" }} className="nav-link text-light">
            {isAuth().name}
          </span>
        </li>
      )}
      {isAuth() && (
        <li className="nav-item">
          <span
            style={{ cursor: "pointer" }}
            className="nav-link text-light"
            onClick={() =>
              signout(() => {
                navigate("/");
              })
            }
          >
            Signout
          </span>
        </li>
      )}
    </ul>
  );
  return (
    <>
      {nav}
      <div className="container">{children}</div>
    </>
  );
};

export default Layout;
