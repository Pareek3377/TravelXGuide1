import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io"; // ✅ Import socket.io correctly
import Message from "./models/messageModels.js";
import chatRouter from "./routes/chatRoutes.js";
import userModel from "./models/userModels.js"; 

import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;
connectDB();

// Allow frontend connection
const allowedOrigins = ["http://localhost:5173",
                        "https://travelxguide1-frontend1.onrender.com" ];
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Create HTTP server
const server = createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store online users
let onlineUsers = {};

// Handle socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinGroup", ({ userId, groupId }) => {
    socket.join(groupId);
    console.log(`User ${userId} joined group ${groupId}`);
  });



socket.on("sendMessage", async ({ groupId, senderId, message }) => {
  console.log(`Received message from ${senderId} in group ${groupId}: ${message}`);

  try {
    // ✅ Fetch sender's name from the database
    const sender = await userModel.findById(senderId); // ✅ Use correct variable

    const senderName = sender ? sender.name : "Unknown User";

    // ✅ Save message to database
    const newMessage = new Message({ groupId, senderId, senderName, message });
    await newMessage.save();

    console.log("Message saved to DB:", newMessage);

    // ✅ Emit message with sender's name
    io.to(groupId).emit("receiveMessage", {
      senderId,
      senderName, // ✅ Send name instead of ID
      message,
      createdAt: newMessage.createdAt,
    });
  } catch (error) {
    console.error("Error saving message:", error);
  }
});

  
  

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// API Endpoints
app.get("/", (req, res) => res.send("API Working"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api", chatRouter);


// Start server
server.listen(port, () => console.log(`Server started on PORT: ${port}`));
