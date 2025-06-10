import { useState } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "universal-cookie";
import APIService from "../src/api/API";
import {images} from "../constant";
import ForgotPasswordModal from "../src/components/ForgotPasswordModal";

const cookies = new Cookies();
const api = new APIService();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgetModal, setShowForgetModal] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    if (!email || !password) {
      toast.error("Please enter both email and password!");
      return;
    }

    setLoading(true); // Start loading

    const payload = {
      email: email,
      password: password,
    };

    api
      .login(payload)
      .then((res) => {
        console.log(res.token);
        toast.success("Login Successful!");
        let token = res.token;
        let adminDetails = JSON.stringify(res.admin); // Save admin details
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1); // Cookie expires in 1 day
        cookies.set("user_token", token, {
          path: "/",
          secure: true,
          sameSite: "Strict",
          expires: expirationDate,
        });
        cookies.set("user_info", adminDetails, {
          path: "/",
          secure: true,
          sameSite: "Strict",
          expires: expirationDate,
        });
        router.push("/dashboard");
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          error.response?.data?.error || "Login failed. Please try again."
        );
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 bg-white"
    >
      <div
        className="card p-4 shadow-sm rounded"
        style={{ width: "480px"}}
      >
        <h1 className="text-center fw-bold mb-4 text-dark-pink">
          Clubby Admin Panel
        </h1>

        <div className="mb-3">
          <label className="form-label fw-semibold">Email / Phone</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email or phone"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Password</label>
          <div className="input-group position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control pe-5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
            <button
              className="eye-button"
              onClick={togglePasswordVisibility}
            >
              <img
                src={showPassword ? images.eye.default.src : images.eye_off.default.src}
                alt="Toggle Password Visibility"
                className="img-25"
              />
            </button>
          </div>
          <div className="text-end mt-1">
            <a href="#" className="text-primary text-decoration-none fw-semibold" onClick={() => setShowForgetModal(true)}>
              Forgot Password
            </a>
          </div>
        </div>

        <button
          className="btn w-100 fw-bold d-flex justify-content-center align-items-center rounded"
          onClick={handleLogin}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </div>
      {showForgetModal &&
        <ForgotPasswordModal
          show={showForgetModal}
          onHide={() => setShowForgetModal(false)}
        />
      }
    </div>
  );
};

export default Login;
