import express from "express";
import Message from "../models/messageModels.js";

const router = express.Router();

// Fetch chat messages for a group
router.get("/messages/:groupId", async (req, res) => {
  try {
    const messages = await Message.find({ groupId: req.params.groupId }).sort({ createdAt: 1 });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
});

export default router;
