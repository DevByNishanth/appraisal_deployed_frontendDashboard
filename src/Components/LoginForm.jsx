import bg from "../assets/login_illustration.svg";
import logo from "../assets/logo.svg";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
function LoginForm({ setIsLoggedIn, setUserData }) {
  const API = import.meta.env.VITE_API;
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({ email: "", password: "" });

  const navigate = useNavigate();

  const handleLogin = async () => {
    const newErrors = { email: "", password: "" };
    let hasError = false;

    const emailLower = email.toLowerCase().trim();

    // Email validation
    if (!emailLower) {
      newErrors.email = "Email is required.";
      hasError = true;
    } else if (
      !(
        emailLower.endsWith("@sece.ac.in") &&
        (emailLower.startsWith("hod") ||
          emailLower.toLowerCase() == "siamaladevi.s@sece.ac.in" ||
          emailLower.toLowerCase() == "rajanbabu.w@sece.ac.in" ||
          emailLower.startsWith("dean") ||
          emailLower.startsWith("hr"))
      )
    ) {
      newErrors.email = "Only HOD, Dean, or HR accounts can log in.";
      hasError = true;
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required.";
      hasError = true;
    } else if (password.length < 5) {
      newErrors.password = "Password must be at least 5 characters.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const { data, status } = await axios.post(
        `${import.meta.env.VITE_API}/api/employee-login`,
        { email, password },
      );

      if (status === 200) {
        const token = data.token;

        localStorage.setItem("appraisal_token", token);
        localStorage.setItem("appraisal_loggedIn", "true");

        if (setUserData) setUserData(data.employee);

        setIsLoggedIn(true);

        const decoded = jwtDecode(token);
        console.log("Decoded Token:", decoded);

        if (decoded.designation?.toLowerCase() === "hr") {
          navigate("/hr_dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message || "Login failed. Please try again.";

      setErrors({ email: "", password: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-[100%] login-bg absolute top-0 right-0 bottom-0 left-0 h-[100vh] z-100">
      <div className="main-container flex w-[70%] h-[500px] bg-white rounded-xl absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%]">
        {/* Left Section */}
        <div className="container-1 hidden md:flex w-[50%] bg-[#318179] rounded-l-xl relative p-5">
          <header className="mt-8">
            <h1 className="text-xl text-white">Sri Eshwar Appraisal System</h1>
            <h1 className="mt-2 text-sm text-white">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry
            </h1>
          </header>
          <div className="img-container absolute w-[100%] bottom-10 left-[50%] translate-x-[-50%]">
            <img src={bg} className="w-[90%] m-auto" />
          </div>
        </div>

        {/* Right Section */}
        <div className="md:w-[50%] border w-[100%] relative">
          <div className="content-container absolute top-[50%] translate-y-[-50%] left-[2%] w-[90%]">
            <img src={logo} alt="logo" />
            <div className="input-container ml-2 w-[100%]">
              <h1 className="text-lg font-semibold">Login to your Account</h1>

              {/* Email */}
              <div className="mb-5 mt-4">
                <label className="block text-lg font-medium mb-2">
                  E-mail Id
                </label>
                <input
                  type="email"
                  placeholder="Enter your email-Id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-2 focus:border-gray-700"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="mb-5">
                <label className="block text-lg font-medium mb-2">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-2 focus:border-gray-700"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
                <button
                  type="button"
                  className="text-sm text-blue-600 mt-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide Password" : "Show Password"}
                </button>
              </div>

              {/* Button */}
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-[#0E8474] cursor-pointer hover:bg-teal-800 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {isLoading ? "Logging in..." : "LOGIN"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginForm;
