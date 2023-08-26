import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { getCookie, isAuth, signout, updateUser } from "../utils/helpers";
import { useNavigate } from "react-router-dom";

const Private = () => {
  const [values, setValues] = useState({
    role: "",
    name: "",
    email: "",
    password: "",
    buttonText: "Submit",
  });

  const { role, name, email, password, buttonText } = values;

  const navigate = useNavigate();

  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const url = `${import.meta.env.VITE_APP_API}/user/${isAuth()._id}`;
        const token = getCookie("token");
        const { data } = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { name, role, email } = data.user;
        setValues((prev) => ({ ...prev, name, role, email }));
      } catch (error) {
        console.log(error.response.data.message);
        toast.error(error.response.data.message);
        if (error.response.status === 401) {
          signout(() => {
            navigate("/");
          });
        }
      }
    };

    loadProfile();
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setValues({ ...values, buttonText: "Submitting..." });
      const token = getCookie("token");

      const { data } = await axios.put(
        `${import.meta.env.VITE_APP_API}/user/update`,
        { name, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setValues({
        ...values,
        buttonText: "Submited",
      });

      updateUser(data, () => {
        toast.success("Private profile is updated successfully");
      });
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
          Role
        </label>
        <input
          value={role}
          type="text"
          className="form-control"
          readOnly
          disabled
        />
      </div>

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
          value={email}
          type="email"
          className="form-control"
          readOnly
          disabled
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
        <h1 className="pt-5 text-center">Private</h1>
        <p className="lead text-center">Profile Update</p>
        {signupForm}
      </div>
    </Layout>
  );
};

export default Private;
