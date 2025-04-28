import { useEffect, useState, useContext, useRef } from "react";
import { AppContext } from "../Context/AppContext.jsx";
import { socket } from "../socket/socket";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPaperPlane, FaSmile, FaArrowLeft, FaEllipsisV } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert2';

export default function Community() {
  const { userData, backendUrl } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const navigate = useNavigate();
  const groupId = "travel-group";
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  let typingTimeout = useRef(null);

  useEffect(() => {
    if (!userData) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You must be logged in to access the community chat",
        confirmButtonText: "Go to Login",
        background: "#1a1a2e",
        color: "#ffffff",
        confirmButtonColor: "#4f46e5",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/signup");
        }
      });
      return;
    }

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/messages/${groupId}`);
        if (data.success) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Failed to fetch messages", error);
        toast.error("Failed to load chat history", {
          position: "top-right",
          theme: "colored",
        });
      }
    };

    fetchMessages();

    // Track online users
    socket.on("onlineUsers", (count) => {
      setOnlineUsers(count);
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, [backendUrl, userData, navigate]);

  useEffect(() => {
    if (!userData) return;

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => {
        const isDuplicate = prev.some(m => m.createdAt === msg.createdAt && m.senderId === msg.senderId);
        return isDuplicate ? prev : [...prev, msg];
      });
      scrollToBottom();
    });
    
    socket.on("userTyping", ({ userName, isTyping }) => {
      if (userName !== userData?.name) {
        setIsTyping(isTyping);
        if (isTyping) {
          clearTimeout(typingTimeout.current);
          typingTimeout.current = setTimeout(() => setIsTyping(false), 2000);
        }
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("userTyping");
    };
  }, [userData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    if (!userData) {
      toast.error("Please login to send messages", {
        position: "top-right",
        theme: "colored",
      });
      return;
    }
    setMessage(e.target.value);
    socket.emit("typing", { 
      groupId, 
      userName: userData.name,
      isTyping: e.target.value.length > 0
    });
  };

  const sendMessage = () => {
    if (!userData) {
      toast.error("Please login to send messages", {
        position: "top-right",
        theme: "colored",
      });
      return;
    }
    if (!message.trim()) return;
  
    const newMessage = {
      senderId: userData.id,
      senderName: userData.name,
      senderAvatar: userData.avatar,
      message,
      createdAt: new Date().toISOString(),
    };
  
    socket.emit("sendMessage", { groupId, ...newMessage });
    setMessage("");
    setShowEmojiPicker(false);
    socket.emit("typing", { 
      groupId, 
      userName: userData.name,
      isTyping: false
    });
    inputRef.current.focus();
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage(prev => prev + emojiObject.emoji);
    inputRef.current.focus();
  };

  return (
    <div className="flex h-screen bg-gray-100 mt-20">
      {/* Sidebar - Can be toggled in mobile view */}
      <div className="hidden md:block w-80 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Community Chat</h2>
          <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
            {onlineUsers} online
          </span>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
            Group Info
          </h3>
          <div className="bg-indigo-50 p-3 rounded-lg">
            <h4 className="font-medium text-indigo-700">Travel Enthusiasts</h4>
            <p className="text-sm text-gray-600 mt-1">
              Connect with fellow travelers and share your experiences
            </p>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
            Guidelines
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              Be respectful to all members
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              No spam or self-promotion
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              Keep conversations relevant
            </li>
          </ul>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="md:hidden mr-4 text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft className="text-lg" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">Travel Community</h1>
              <div className="flex items-center">
                {isTyping ? (
                  <p className="text-xs text-gray-500 italic">typing...</p>
                ) : (
                  <p className="text-xs text-gray-500">
                    {onlineUsers} {onlineUsers === 1 ? 'person' : 'people'} online
                  </p>
                )}
              </div>
            </div>
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <FaEllipsisV />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="bg-white p-6 rounded-xl shadow-sm text-center max-w-md">
                <h3 className="text-lg font-medium mb-2">Welcome to the community!</h3>
                <p className="text-sm">Be the first to start the conversation</p>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex mb-4 ${msg.senderId === userData?.id ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-xs lg:max-w-md ${msg.senderId === userData?.id ? "flex-row-reverse" : ""}`}>
                {msg.senderAvatar ? (
  <img 
    src={msg.senderAvatar} 
    alt={msg.senderName || 'User'} 
    className="w-8 h-8 rounded-full mt-1 mx-2"
    onError={(e) => {
      e.target.style.display = 'none';
    }}
  />
) : (
  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mt-1 mx-2">
    <span className="text-indigo-600 text-xs font-medium">
      {(msg.senderName || '?').charAt(0).toUpperCase()}
    </span>
  </div>
)}
                  <div>
                    <div className={`px-4 py-2 rounded-2xl ${msg.senderId === userData?.id ? 
                      "bg-indigo-600 text-white rounded-tr-none" : 
                      "bg-white text-gray-800 rounded-tl-none shadow-sm"}`}
                    >
                      {msg.senderId !== userData?.id && (
                        <p className="text-xs font-semibold text-indigo-600 mb-1">{msg.senderName}</p>
                      )}
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${msg.senderId === userData?.id ? "text-right" : "text-left"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4 relative">
          {showEmojiPicker && (
            <div className="absolute bottom-16 left-0 right-0 md:left-auto md:right-4">
              <EmojiPicker 
                width="100%"
                height={350}
                onEmojiClick={handleEmojiClick}
                searchDisabled
                skinTonesDisabled
                previewConfig={{ showPreview: false }}
              />
            </div>
          )}
          <div className="flex items-center">
            <button
              onClick={() => userData ? setShowEmojiPicker(!showEmojiPicker) : toast.error("Please login to use emojis")}
              className="mr-3 text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <FaSmile className="text-xl" />
            </button>
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              className="flex-1 py-3 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              value={message}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={!userData}
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className={`ml-3 p-3 rounded-full transition-colors ${message.trim() ? 
                "bg-indigo-600 text-white hover:bg-indigo-700" : 
                "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
            >
              <IoMdSend className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}