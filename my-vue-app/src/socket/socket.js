import { io } from "socket.io-client";

const backendUrl = "https://travelxguide1.onrender.com";

export const socket = io(backendUrl, {
  autoConnect: false,
  withCredentials: true,
  transports: ["polling"], // 🚀 Only use polling (no WebSocket)
});

console.log("🔌 Socket initialized with backend URL:", backendUrl);
