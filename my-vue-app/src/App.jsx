import Navbar from "./components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom"; // ⬅️ add useLocation
import Tours from "./Routes/Tours";
import Guide from "./Routes/Guide";
import Community from "./Routes/Community";
import Home from "./Routes/Home";
import TripPlan from "./viewTrip/Tripplan";
import Signup from "./Routes/signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const location = useLocation(); // ⬅️ get current URL

  // List of paths where you don't want Navbar
  const hideNavbarPaths = ["/community"];

  // Check if current path matches any of them
  const hideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <div className="text-center font-poppins color-black">
      {/* Only show Navbar if hideNavbar is false */}
      {!hideNavbar && <Navbar />}

      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/community" element={<Community />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/trip-plan/:destination/:days/:budget/:traveler" element={<TripPlan />} />
      </Routes>
    </div>
  );
}

export default App;
