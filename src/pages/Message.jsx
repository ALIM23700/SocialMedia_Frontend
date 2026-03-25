// pages/Message.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { socket } from "../Components/Socket";

import {
  fetchConversations,
  fetchMessages,
  setActiveChat,
  incrementUnread,
  addMessage,
} from "../features/Message/messageSlice";

const Message = () => {
  const dispatch = useDispatch();

  const { user: currentUser } = useSelector((state) => state.auth);
  const { conversations, messages, activeChat } = useSelector(
    (state) => state.message
  );

  const location = useLocation();
  const { userId: receiverIdFromRoute } = useParams();
  const receiverFromNav = location.state?.receiver;

  const [newMessage, setNewMessage] = useState("");

  if (!currentUser?._id)
    return <div className="text-center mt-10 font-medium text-gray-500">Loading...</div>;

  // ================= INIT CHAT =================
  useEffect(() => {
    if (receiverFromNav) dispatch(setActiveChat(receiverFromNav));
    else if (receiverIdFromRoute) dispatch(setActiveChat(receiverIdFromRoute));
  }, [receiverFromNav, receiverIdFromRoute, dispatch]);

  // ================= FETCH CONVERSATIONS =================
  useEffect(() => {
    dispatch(fetchConversations(currentUser._id));
  }, [currentUser._id, dispatch]);

  // ================= FETCH MESSAGES =================
  useEffect(() => {
    if (!activeChat) return;

    const receiverId =
      typeof activeChat === "object" ? activeChat._id : activeChat;

    if (receiverId) {
      dispatch(fetchMessages({ senderId: currentUser._id, receiverId }));
    }
  }, [activeChat, dispatch, currentUser._id]);

  // ================= SOCKET =================
  useEffect(() => {
    const handleReceive = (msg) => {
      if (msg.senderId !== currentUser._id) {
        dispatch(addMessage(msg));
        const activeId =
          typeof activeChat === "object" ? activeChat?._id : activeChat;
        if (msg.senderId !== activeId) {
          dispatch(incrementUnread(msg.senderId));
        }
      }
    };

    socket.on("receiveMessage", handleReceive);
    return () => socket.off("receiveMessage", handleReceive);
  }, [activeChat, dispatch, currentUser._id]);

  // ================= SEND =================
  const handleSend = () => {
    if (!newMessage.trim() || !activeChat) return;
    const receiverId =
      typeof activeChat === "object" ? activeChat._id : activeChat;
    if (!receiverId) return;
    const msg = {
      senderId: currentUser._id,
      receiverId,
      text: newMessage,
    };
    socket.emit("sendMessage", msg);
    dispatch(addMessage(msg));
    setNewMessage("");
  };

  return (
    <div className="md:ml-64 flex justify-center bg-gray-100 h-[100dvh] md:h-screen md:p-4 overflow-hidden">
      <div className="w-full md:max-w-5xl flex bg-white md:rounded-lg shadow overflow-hidden h-full">
        
        {/* LEFT - INBOX */}
        <div className={`w-full md:w-1/3 border-r p-4 flex flex-col ${activeChat ? "hidden md:flex" : "flex"}`}>
          <h2 className="text-xl font-bold mb-4 text-gray-800">Inbox</h2>
          <div className="flex-1 overflow-y-auto space-y-2">
            {conversations.length > 0 ? (
              conversations.map((conv) => (
                <div
                  key={conv?._id}
                  className={`flex items-center gap-3 p-3 md:p-2 rounded-lg cursor-pointer ${
                    (typeof activeChat === "object" ? activeChat?._id : activeChat) === conv?._id
                      ? "bg-blue-100"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => dispatch(setActiveChat(conv))}
                >
                  <img
                    src={conv?.profileImage || "/default-avatar.png"}
                    alt={conv?.username}
                    className="w-12 h-12 md:w-10 md:h-10 rounded-full object-cover shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{conv?.username}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {conv?.lastMessage?.text || "Say hi!"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 mt-4 italic text-sm">No chats yet</p>
            )}
          </div>
        </div>

        {/* RIGHT - CHAT AREA */}
        <div className={`flex-1 flex flex-col h-full bg-[#f8f9fa] ${!activeChat ? "hidden md:flex" : "flex"}`}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b font-semibold flex items-center gap-3 bg-white sticky top-0 shrink-0 z-10 shadow-sm">
                <button 
                  onClick={() => dispatch(setActiveChat(null))}
                  className="md:hidden text-blue-500 font-bold p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-gray-800">
                      {typeof activeChat === "object" ? activeChat?.username : "Chat"}
                    </span>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`max-w-[85%] md:max-w-xs p-3 px-4 rounded-2xl shadow-sm text-[15px] ${
                      m?.senderId === currentUser._id
                        ? "bg-blue-500 text-white self-end rounded-tr-none"
                        : "bg-white border border-gray-100 self-start rounded-tl-none text-gray-800"
                    }`}
                  >
                    {m?.text}
                  </div>
                ))}
              </div>

              {/* Input Area: PB-20 for Mobile, SVG Send Button Added */}
              <div className="p-3 md:p-4 bg-white border-t sticky bottom-0 shrink-0 pb-20 md:pb-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-2 max-w-4xl mx-auto">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-full outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-[16px]"
                    placeholder="Message..."
                  />
                  <button
                    onClick={handleSend}
                    className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 active:scale-90 transition-all shadow-md shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
              <div className="text-6xl mb-4 opacity-30">💬</div>
              <p className="font-medium">Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;