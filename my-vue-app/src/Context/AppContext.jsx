import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { socket } from "../socket/socket"; 


export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  console.log("AppContext initialized, backend URL:", backendUrl);

  // ✅ Load auth state safely from localStorage
  const [isLoggedin, setIsLoggedin] = useState(!!localStorage.getItem("token"));
  const [chatMessages, setChatMessages] = useState([]);


  const [userData, setUserData] = useState(() => {
  try {
    const storedUser = localStorage.getItem("user");
    console.log("Retrieved user from localStorage:", storedUser); // ✅ Debug log

    if (!storedUser) return null;

    const parsedUser = JSON.parse(storedUser);
    
    if (!parsedUser.id && parsedUser._id) {
      parsedUser.id = parsedUser._id; // ✅ Ensure `id` is present
    }

    console.log("Parsed user data:", parsedUser); // ✅ Debug log
    return parsedUser;
  } catch (error) {
    console.error("Error parsing userData from localStorage:", error);
    localStorage.removeItem("user");
    return null;
  }
});



  // ✅ Establish Socket Connection when user logs in
  useEffect(() => {
    if (userData) {
      socket.connect();
      console.log("Socket connected");
  
      console.log("Emitting joinGroup event:", userData);
      socket.emit("joinGroup", { userId: userData?.name, groupId: "travel-group" });
  
      // Fetch old messages when joining
      axios.get(`${backendUrl}/api/messages/travel-group`)
        .then(({ data }) => {
          if (data.success) {
            setChatMessages(data.messages); // ✅ Store chat history in state
          }
        })
        .catch((err) => console.error("Error fetching messages:", err));
  
      socket.on("receiveMessage", (newMessage) => {
        setChatMessages((prev) => [...prev, newMessage]); // ✅ Append new messages
      });
  
      return () => {
        socket.disconnect();
        console.log("Socket disconnected");
      };
    }
  }, [userData]);
  
  

  // ✅ Fetch User Data (Only if missing)
  const getUserData = async () => {
    if (userData) return;

    console.log("Fetching user data...");
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.userData);
        localStorage.setItem("user", JSON.stringify(data.userData));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user data");
    }
  };

  // ✅ Check Authentication on Mount (Once)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/data`); // Will check authentication via cookie
        if (data.success) {
          setIsLoggedin(true);
          setUserData(data.userData);
        } else {
          setIsLoggedin(false);
          setUserData(null);
        }
      } catch (error) {
        setIsLoggedin(false);
        setUserData(null);
      }
    };
  
    checkAuth();
  }, []);
  
  

  // ✅ Signup Function
  const signup = async (name, email, password, navigate) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password });

      if (data.success && data.user && data.token) {
        console.log("Signup successful, storing token:", data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setIsLoggedin(true);
        setUserData(data.user);
        toast.success("Signup successful!");
        navigate("/");
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  // ✅ Login Function
  const login = async (email, password, navigate) => {

    console.log("Login function called!");

    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/login`, { email, password });
  
      if (data.success && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); // ✅ Ensure this includes 'id'
        setIsLoggedin(true);
        setUserData(data.user);
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };
  
  

  // ✅ Logout Function (Clear State First)
  const logout = async () => {
    try {
        await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true }); // ✅ Ensure cookies are included

        // ✅ Clear stored authentication data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        console.log("Token:", localStorage.getItem("token"));
console.log("User:", localStorage.getItem("user"));
console.log("Session Token:", sessionStorage.getItem("token"));
console.log("Session User:", sessionStorage.getItem("user"));


        // ✅ Reset authentication state
        setIsLoggedin(false);
        setUserData(null);

        toast.success("Logged out successfully!");
        window.location.reload(); // ✅ Ensure UI updates
    } catch (error) {
        console.error("Logout Error:", error);
        toast.error(error.response?.data?.message || "Logout failed");
    }
};

  

  return (
    <AppContext.Provider
      value={{
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData,
        signup,
        login,
        logout,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
