import Layout from "../components/Layout";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as jose from "jose"; // new version of "jsonwebtoken". old version is not working anymore

const Activate = () => {
  const [name, setName] = useState("");
  const [show, setShow] = useState(true);

  const { token } = useParams();

  useEffect(() => {
    let { name } = jose.decodeJwt(token);
    if (token) {
      setName(name);
    }
  }, [token]);

  const submitHandler = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API}/account-activation`,
        { token }
      );
      console.log("ACCOUNT ACTIVITION");
      setShow(false);
      toast.success(data.message);
    } catch (error) {
      console.log("ACCOUNT ACTIVITION ERROR!!!", error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  const activationLink = (
    <div className="text-center">
      <h1 className="p-5 text-center">
        Hey {name}, Ready to activate your account?
      </h1>
      <button className="btn btn-outline-primary" onClick={submitHandler}>
        Activate Account
      </button>
    </div>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        {activationLink}
      </div>
    </Layout>
  );
};

export default Activate;
