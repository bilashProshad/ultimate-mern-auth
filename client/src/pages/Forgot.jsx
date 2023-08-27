import { useState } from "react";
import Layout from "../components/Layout";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const Forgot = () => {
  const [values, setValues] = useState({
    email: "",
    buttonText: "Submit",
  });

  const { email, buttonText } = values;

  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setValues({ ...values, buttonText: "Submitting..." });
      const { data } = await axios.put(
        `${import.meta.env.VITE_APP_API}/password/forgot`,
        { email }
      );

      toast.success(data.message);
      setValues({ ...values, buttonText: "Submited" });
    } catch (error) {
      console.error("FORGOT PASSWORD ERROR!!!", error.response.data);
      toast.error(error.response.data.message);
      setValues({ ...values, buttonText: "Submit" });
    }
  };

  const passwordForgotForm = (
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

      <div className="mt-3">
        <button className="btn btn-primary">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        <h1 className="pt-5 pb-2 text-center">Forgot Password</h1>
        {passwordForgotForm}
      </div>
    </Layout>
  );
};

export default Forgot;
