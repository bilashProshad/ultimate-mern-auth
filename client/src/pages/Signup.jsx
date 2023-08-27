import { useState } from "react";
import Layout from "../components/Layout";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { isAuth } from "../utils/helpers";
import { Link, Navigate } from "react-router-dom";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    buttonText: "Submit",
  });

  const { name, email, password, buttonText } = values;

  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setValues({ ...values, buttonText: "Submitting..." });
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API}/signup`,
        { name, email, password }
      );
      setValues({
        ...values,
        name: "",
        email: "",
        password: "",
        buttonText: "Submited",
      });
      toast.success(data.message);
    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data.message);
      setValues({ ...values, buttonText: "Submit" });
    }
  };

  const signupForm = (
    <form onSubmit={submitHandler}>
      <div className="form-group">
        <label htmlFor="" className="text-muted">
          Name
        </label>
        <input
          onChange={handleChange("name")}
          value={name}
          type="text"
          className="form-control"
        />
      </div>

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
        <h1 className="pt-5 pb-2 text-center">Signup</h1>
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

export default Signup;
