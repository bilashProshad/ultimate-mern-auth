import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Activate from "./pages/Activate";
import PrivateRoute from "./components/PrivateRoute";
import Private from "./pages/Private";
import AdminRoute from "./components/AdminRoute";
import Admin from "./pages/Admin";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import PublicRoute from "./components/PublicRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/auth/activate/:token" element={<Activate />} />
        <Route element={<PublicRoute />}>
          <Route path="/auth/password/forgot" element={<Forgot />} />
          <Route path="/auth/password/reset/:token" element={<Reset />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/private" element={<Private />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
