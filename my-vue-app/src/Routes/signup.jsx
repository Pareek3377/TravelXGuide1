import React, { useContext, useState } from "react";
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

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting form...");
      console.log("State:", state);
      console.log("Email:", email);
      console.log("Password:", password);
  
      axios.defaults.withCredentials = true;
  
      let response;
      if (state === "Sign Up") {
        console.log("Sending sign-up request...");
        response = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
        });
  
        const { data } = response;
        console.log("Response received:", data);
  
        if (data.success) {
          console.log("Token received on signup:", data.token);
  
          // Store token for verification or future use (but don't log in automatically)
          localStorage.setItem("signupToken", data.token);
  
          toast.success("Registration successful! Please log in.");
          setState("Login"); // Redirect to login form instead of logging in directly
          return;
        }
      } else {
      
        response = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });
  
        const { data } = response;
        console.log("Response received:", data);
  
        if (data.success) {
          console.log("Token received on login:", data.token);
          localStorage.setItem("token", data.token);
          console.log("Stored token:", localStorage.getItem("token"));
  
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log("Stored user:", localStorage.getItem("user"));
  
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
        {/* Decorative header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">
            {state === "Sign Up" ? "Welcome Aboard" : "Welcome Back"}
          </h1>
          <p className="text-indigo-100 mt-2">
            {state === "Sign Up" ? "Create your account in seconds" : "Login to access your dashboard"}
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={onSubmitHandler} className="space-y-6">
            {state === "Sign Up" && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  type="text"
                  placeholder="Full Name"
                  required
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                type="email"
                placeholder="Email address"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                type="password"
                placeholder="Password"
                required
              />
            </div>

            {state === "Login" && (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/reset-password")}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              {state === "Sign Up" ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create Account
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {state === "Sign Up" ? "Already have an account?" : "New to our platform?"}
                </span>
              </div>
            </div>

            <button
              onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")}
              className="mt-6 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              {state === "Sign Up" ? "Sign in instead" : "Create new account"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 rounded-b-2xl text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;