import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const GoogleLoginBtn = ({ informParent }) => {
  const responseMessage = async (response) => {
    // console.log(response.credential);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API}/google-login`,
        {
          credential: response.credential,
        }
      );
      informParent(data);
    } catch (error) {
      console.log("GOOGLE SIGNIN ERROR: " + error.response.data);
    }
  };
  const errorMessage = (error) => {
    console.log("GOOGLE SIGNIN ERROR: " + error);
  };

  return (
    <GoogleLogin
      onSuccess={responseMessage}
      onError={errorMessage}
      containerProps={{ style: { width: "100% !important" } }}
    />
  );
};

export default GoogleLoginBtn;
