import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";
import * as jose from "jose";

const Reset = () => {
  const [values, setValues] = useState({
    name: "",
    token: "",
    newPassword: "",
    buttonText: "Submit",
  });

  const { name, newPassword, buttonText } = values;

  const { token } = useParams();

  useEffect(() => {
    const { name } = jose.decodeJwt(token);
    setValues((prev) => ({ ...prev, name }));
  }, [token]);

  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setValues({ ...values, buttonText: "Submitting..." });
      const { data } = await axios.put(
        `${import.meta.env.VITE_APP_API}/password/reset`,
        { resetPasswordToken: token, newPassword }
      );

      toast.success(data.message);
      setValues({ ...values, buttonText: "Done" });
    } catch (error) {
      console.error("RESET PASSWORD ERROR!!!", error.response.data);
      toast.error(error.response.data.message);
      setValues({ ...values, buttonText: "Submit" });
    }
  };

  const resetPasswordForm = (
    <form onSubmit={submitHandler}>
      <div className="form-group">
        <label htmlFor="" className="text-muted">
          New Password
        </label>
        <input
          onChange={handleChange("newPassword")}
          value={newPassword}
          type="password"
          className="form-control"
          placeholder="Type new password"
          required
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
        <h1 className="pt-5 pb-2 text-center">Reset Password</h1>
        <p className="text-center">
          Hey <span className="fw-bold">{name}</span>, Type your new password
        </p>
        {resetPasswordForm}
      </div>
    </Layout>
  );
};

export default Reset;
