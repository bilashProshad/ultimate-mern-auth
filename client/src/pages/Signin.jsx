import { useState } from "react";
import Layout from "../components/Layout";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { authenticate, isAuth } from "../utils/helpers";
import { Link, Navigate, useNavigate } from "react-router-dom";
import GoogleLoginBtn from "../components/GoogleLoginBtn";

const Signin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    buttonText: "Submit",
  });

  const { email, password, buttonText } = values;

  const navigate = useNavigate();

  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };

  const informParent = (data) => {
    authenticate(data, () => {
      toast.success(`Hey ${data.user.name}, Welcome back!`);

      isAuth() && isAuth().role === "admin"
        ? navigate("/admin")
        : navigate("/private");
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setValues({ ...values, buttonText: "Submitting..." });
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API}/signin`,
        { email, password }
      );

      authenticate(data, () => {
        setValues({
          ...values,
          email: "",
          password: "",
          buttonText: "Submited",
        });
        toast.success(`Hey ${data.user.name}, Welcome back!`);

        isAuth() && isAuth().role === "admin"
          ? navigate("/admin")
          : navigate("/private");
      });
    } catch (error) {
      console.log("SIGNIN ERROR!!!", error.response.data);
      toast.error(error.response.data.message);
      setValues({ ...values, buttonText: "Submit" });
    }
  };

  const signupForm = (
    <form onSubmit={submitHandler}>
      <div className="form-group">
        <label htmlFor="" className="text-muted">
          Email
        </label>
        <input
          onChange={handleChange("email")}
          value={email}
          type="email"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label htmlFor="" className="text-muted">
          Password
        </label>
        <input
          onChange={handleChange("password")}
          value={password}
          type="password"
          className="form-control"
        />
      </div>

      <div className="mt-3">
        <button className="btn btn-primary">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        {isAuth() ? <Navigate to={"/"} /> : ""}
        <h1 className="pt-5 pb-2 text-center">Signin</h1>
        <GoogleLoginBtn informParent={informParent} />
        {signupForm}
        <br />
        <Link
          to={"/auth/password/forgot"}
          className="btn btn-sm btn-outline-danger"
        >
          Forgot Password
        </Link>
      </div>
    </Layout>
  );
};

export default Signin;
