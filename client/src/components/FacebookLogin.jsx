import axios from "axios";
import { useLogin } from "react-facebook";

const FacebookLogin = ({ informParent }) => {
  const { login, isLoading } = useLogin();

  async function handleLogin() {
    try {
      const response = await login({
        scope: "email",
      });

      console.log(response);
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API}/facebook-login`,
        {
          userID: response.authResponse.userID,
          accessToken: response.authResponse.accessToken,
        }
      );
      // informParent(data);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <>
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="btn btn-primary btn-block mt-2 mb-1"
        style={{ width: "100%" }}
      >
        <i className="fab fa-facebook pr-2"></i> Login via Facebook
      </button>
    </>
  );
};

export default FacebookLogin;
