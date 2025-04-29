import { io } from "socket.io-client";

// Define your backend URL (live + localhost support)
const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://travelxguide1-1.onrender.com";

export const socket = io(backendUrl, {
  autoConnect: false,
  withCredentials: true, // ✅ Include cookies/credentials
  transports: ["websocket", "polling"], // ✅ Allow fallback (better for Render hosting)
});

console.log("🔌 Socket initialized with backend URL:", backendUrl);
