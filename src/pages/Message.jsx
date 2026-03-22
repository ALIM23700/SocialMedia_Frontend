import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { socket } from "../Components/Socket";

const API_URL = "http://localhost:4000/api/v1";

const Message = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const location = useLocation();
  const { userId: receiverIdFromRoute } = useParams();
  const receiverFromNav = location.state?.receiver;

  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(
    receiverFromNav || receiverIdFromRoute || null
  );
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  if (!currentUser) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // ✅ Fetch conversations
  const fetchConversations = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/message/conversations/${currentUser._id}`
      );
      setConversations(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Fetch messages
  const fetchMessages = async (receiverId) => {
    if (!receiverId) return;
    try {
      const res = await axios.get(
        `${API_URL}/message/${currentUser._id}/${receiverId}`
      );
      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [currentUser?._id]);

  useEffect(() => {
    if (!activeChat) return;

    const receiverId =
      typeof activeChat === "object" ? activeChat._id : activeChat;

    fetchMessages(receiverId);
  }, [activeChat]);

  // ✅ Socket real-time
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      const receiverId =
        typeof activeChat === "object" ? activeChat?._id : activeChat;

      if (receiverId && msg.senderId === receiverId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [activeChat]);

  // ✅ Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !activeChat) return;

    const receiverId =
      typeof activeChat === "object" ? activeChat._id : activeChat;

    const msg = {
      senderId: currentUser._id,
      receiverId,
      text: newMessage,
    };

    try {
      await axios.post(`${API_URL}/message`, msg);
      socket.emit("sendMessage", msg);

      setMessages((prev) => [...prev, msg]);
      setNewMessage("");

      fetchConversations();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="ml-64 flex justify-center bg-gray-100 min-h-screen">
      {/* Main container */}
      <div className="w-full max-w-5xl flex bg-white mt-6 rounded-lg shadow overflow-hidden">

        {/* LEFT: Inbox */}
        <div className="w-1/3 border-r border-gray-300 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Inbox</h2>

          {conversations.length > 0 ? (
            conversations.map((conv) => (
              <div
                key={conv?._id}
                className={`p-2 rounded mb-2 cursor-pointer ${
                  (typeof activeChat === "object"
                    ? activeChat?._id
                    : activeChat) === conv?._id
                    ? "bg-blue-200"
                    : "bg-white"
                }`}
                onClick={() => setActiveChat(conv)}
              >
                <p className="font-semibold">
                  {conv?.username || "User"}
                </p>
                <p className="text-sm text-gray-500">
                  {conv?.lastMessage?.text || "Say hi!"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No chats yet</p>
          )}
        </div>

        {/* RIGHT: Chat */}
        <div className="flex-1 flex flex-col">
          {activeChat ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-300 font-semibold">
                {typeof activeChat === "object"
                  ? activeChat?.username
                  : "Chat"}
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`max-w-xs p-2 rounded ${
                      m?.senderId === currentUser?._id
                        ? "bg-blue-500 text-white self-end"
                        : "bg-gray-300 self-start"
                    }`}
                  >
                    {m?.text}
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 flex gap-2 border-t border-gray-300">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSend}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;