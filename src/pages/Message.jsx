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
    return <div className="text-center mt-10">Loading...</div>;

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
      // Only add message if it's from another user
      if (msg.senderId !== currentUser._id) {
        dispatch(addMessage(msg));

        const activeId =
          typeof activeChat === "object" ? activeChat?._id : activeChat;

        // Increment unread only if sender is not current chat
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

    // Emit via socket only
    socket.emit("sendMessage", msg);

    // Add locally so sender sees instantly
    dispatch(addMessage(msg));

    setNewMessage("");
  };

  return (
    <div className="ml-64 flex justify-center bg-gray-100 min-h-screen p-4">
      <div className="w-full max-w-5xl flex bg-white rounded-lg shadow overflow-hidden">

        {/* LEFT */}
        <div className="w-1/3 border-r p-4 flex flex-col">
          <h2 className="text-xl font-bold mb-4">Inbox</h2>
          <div className="flex-1 overflow-y-auto space-y-2">
            {conversations.length > 0 ? (
              conversations.map((conv) => (
                <div
                  key={conv?._id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                    activeChat &&
                    ((typeof activeChat === "object"
                      ? activeChat._id
                      : activeChat) === conv?._id
                      ? "bg-blue-100"
                      : "hover:bg-gray-100")
                  }`}
                  onClick={() => dispatch(setActiveChat(conv))}
                >
                  <img
                    src={conv?.profileImage || "/default-avatar.png"}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{conv?.username}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {conv?.lastMessage?.text || "Say hi!"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No chats yet</p>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 flex flex-col">
          {activeChat ? (
            <>
              <div className="p-4 border-b font-semibold">
                {typeof activeChat === "object"
                  ? activeChat?.username
                  : "Chat"}
              </div>

              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`max-w-xs p-3 rounded-xl ${
                      m?.senderId === currentUser._id
                        ? "bg-blue-500 text-white self-end"
                        : "bg-gray-200 self-start"
                    }`}
                  >
                    {m?.text}
                  </div>
                ))}
              </div>

              <div className="p-4 flex gap-2 border-t">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-full"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSend}
                  className="bg-blue-500 text-white px-6 py-2 rounded-full"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">Select chat</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Message;
//alim ok indicate