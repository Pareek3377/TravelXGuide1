import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  useEffect(() => {
    const strength = checkPasswordStrength(password);
    setPasswordStrength(strength);
  }, [password]);

  const checkPasswordStrength = (password) => {
    let strength = "Weak";
    const strongRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})"
    );

    if (strongRegex.test(password)) strength = "Strong";
    else if (password.length >= 6) strength = "Moderate";

    return strength;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (state === "Sign Up" && passwordStrength !== "Strong") {
      toast.error("Password must be strong to sign up.");
      return;
    }

    try {
      axios.defaults.withCredentials = true;

      let response;
      if (state === "Sign Up") {
        response = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
        });

        const { data } = response;

        if (data.success) {
          localStorage.setItem("signupToken", data.token);
          toast.success("Registration successful! Please log in.");
          setState("Login");
          return;
        }
      } else {
        response = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });

        const { data } = response;
        if (data.success) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setIsLoggedin(true);
          getUserData();
          navigate("/");
        }
      }

      toast.error(response.data.message);
    } catch (error) {
      console.error("Error in authentication:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 mt-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">
            {state === "Sign Up" ? "Welcome Aboard" : "Welcome Back"}
          </h1>
          <p className="text-indigo-100 mt-2">
            {state === "Sign Up"
              ? "Create your account in seconds"
              : "Login to access your dashboard"}
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={onSubmitHandler} className="space-y-6">
            {state === "Sign Up" && (
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                type="text"
                placeholder="Full Name"
                required
              />
            )}

            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              type="email"
              placeholder="Email address"
              required
            />

            <div>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                type="password"
                placeholder="Password"
                required
              />
              {state === "Sign Up" && (
                <p
                  className={`mt-1 text-sm font-medium ${
                    passwordStrength === "Strong"
                      ? "text-green-600"
                      : passwordStrength === "Moderate"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  Password strength: {passwordStrength}
                </p>
              )}
            </div>

            {state === "Login" && (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/reset-password")}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                state === "Sign Up" && passwordStrength !== "Strong"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
              disabled={state === "Sign Up" && passwordStrength !== "Strong"}
            >
              {state === "Sign Up" ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {state === "Sign Up"
                    ? "Already have an account?"
                    : "New to our platform?"}
                </span>
              </div>
            </div>

            <button
              onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")}
              className="mt-6 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              {state === "Sign Up" ? "Sign in instead" : "Create new account"}
            </button>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-6 rounded-b-2xl text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
