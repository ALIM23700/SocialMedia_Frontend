import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { socket } from "../Components/Socket";
import {
  fetchConversations,
  fetchMessages,
  setActiveChat,
  addMessage,
  clearActiveChat,
  sendMessage
} from "../features/Message/messageSlice";

const Message = () => {
  const dispatch = useDispatch();
  const scrollRef = useRef();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { conversations, messages, activeChat, unreadCounts } = useSelector((state) => state.message);
  const location = useLocation();
  const { userId: receiverIdFromRoute } = useParams();
  const receiverFromNav = location.state?.receiver;
  const [newMessage, setNewMessage] = useState("");

  const activeChatDetails = conversations.find(c => c._id === activeChat);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(fetchConversations(currentUser._id));
      const savedChatId = localStorage.getItem("activeChat");
      if (savedChatId && !activeChat) dispatch(setActiveChat(savedChatId));
    }
  }, [dispatch, currentUser?._id]);

  useEffect(() => {
    if (receiverFromNav) dispatch(setActiveChat(receiverFromNav));
    else if (receiverIdFromRoute) dispatch(setActiveChat(receiverIdFromRoute));
  }, [receiverFromNav, receiverIdFromRoute, dispatch]);

  useEffect(() => {
    if (activeChat) {
      dispatch(fetchMessages({ senderId: currentUser._id, receiverId: activeChat }));
    }
  }, [activeChat, dispatch, currentUser?._id]);

  useEffect(() => {
    const handleReceive = (msg) => {
      // মেসেজ রিসিভ করলে অ্যাড করা (ব্যাজ লজিক স্লাইসের ভেতরেই আছে)
      if (msg.senderId !== currentUser._id) {
        dispatch(addMessage(msg));
      }
    };
    socket.on("receiveMessage", handleReceive);
    return () => socket.off("receiveMessage", handleReceive);
  }, [activeChat, dispatch, currentUser?._id]);

  const handleSend = () => {
    const text = newMessage.trim();
    if (!text || !activeChat) return;
    
    setNewMessage("");
    const tempMsg = {
      senderId: currentUser._id,
      receiverId: activeChat,
      text: text,
      tempId: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    dispatch(addMessage(tempMsg));
    socket.emit("sendMessage", tempMsg);
    dispatch(sendMessage(tempMsg));
  };

  if (!currentUser?._id) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="md:ml-64 flex justify-center bg-gray-50 h-[100dvh] md:h-screen md:p-4 overflow-hidden">
      <div className="w-full md:max-w-6xl flex bg-white shadow-sm overflow-hidden h-full md:rounded-xl border border-gray-200">
        
        {/* Inbox Sidebar */}
        <div className={`w-full md:w-1/3 border-r flex flex-col ${activeChat ? "hidden md:flex" : "flex"}`}>
          <div className="p-5 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Inbox</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => {
              const uCount = unreadCounts[conv?._id] || 0;
              const isActive = activeChat === conv?._id;
              
              return (
                <div 
                  key={conv?._id} 
                  onClick={() => dispatch(setActiveChat(conv))} 
                  className={`flex items-center gap-4 p-4 cursor-pointer transition-colors border-b border-gray-50 ${isActive ? "bg-gray-100" : "hover:bg-gray-50"}`}
                >
                  <div className="relative shrink-0">
                    <img src={conv?.profileImage || "/default-avatar.png"} className="w-12 h-12 rounded-full object-cover border border-gray-100" alt="" />
                    
                    {/* লাল ব্যাজ রেন্ডারিং */}
                    {uCount > 0 && !isActive && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] h-5 w-5 flex items-center justify-center rounded-full border-2 border-white font-bold shadow-sm">
                        {uCount > 9 ? "9+" : uCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className={`truncate text-[15px] ${uCount > 0 ? "font-bold text-gray-900" : "font-semibold text-gray-700"}`}>
                        {conv?.username}
                      </p>
                    </div>
                    <p className={`text-sm truncate ${uCount > 0 ? "text-blue-600 font-bold" : "text-gray-400"}`}>
                      {conv?.lastMessage?.text || "New message"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Main Area */}
        <div className={`flex-1 flex flex-col h-full bg-white ${!activeChat ? "hidden md:flex" : "flex"}`}>
          {activeChat ? (
            <>
              <div className="p-4 border-b flex items-center gap-3 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <button onClick={() => dispatch(clearActiveChat())} className="md:hidden text-gray-600 p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex items-center gap-3">
                  <img src={activeChatDetails?.profileImage || "/default-avatar.png"} className="w-10 h-10 rounded-full object-cover" alt="" />
                  <span className="font-bold text-gray-800">{activeChatDetails?.username || "Chat"}</span>
                </div>
              </div>
              
              <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-[#f0f2f5]">
                {messages.map((m, idx) => {
                  const isMe = m?.senderId === currentUser._id;
                  return (
                    <div 
                      key={m._id || m.tempId || idx} 
                      className={`max-w-[75%] p-3 px-4 rounded-2xl text-[15px] shadow-sm ${isMe ? "bg-blue-600 text-white self-end rounded-tr-none" : "bg-white text-gray-800 self-start rounded-tl-none"}`}
                    >
                      {m?.text || m?.message}
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-white border-t pb-24 md:pb-4">
                <div className="flex items-center gap-2 max-w-4xl mx-auto">
                  <input 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    onKeyDown={(e) => e.key === "Enter" && handleSend()} 
                    className="flex-1 px-5 py-3 border border-gray-200 rounded-full outline-none focus:border-blue-400 bg-gray-50 transition-colors" 
                    placeholder="Type a message..." 
                  />
                  <button 
                    onClick={handleSend} 
                    className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 active:scale-90 transition-all shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="font-medium">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;