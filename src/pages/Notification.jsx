// pages/Notification.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAsRead } from "../features/Notification/NotificationSlice";
import { useNavigate } from "react-router-dom";
import moment from "moment"; 

const Notification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, loading } = useSelector((state) => state.notification);

  useEffect(() => {
    const fetchAndMark = async () => {
      const action = await dispatch(fetchNotifications());
      if (action.payload) {
        action.payload
          .filter((n) => !n.isRead)
          .forEach((n) => dispatch(markAsRead(n._id)));
      }
    };
    fetchAndMark();
  }, [dispatch]);

  const handleClick = (n) => {
    if (n.post) {
      navigate(`/post/${n.post._id}`);
      setTimeout(() => {
        const commentSection = document.getElementById("comments");
        if (commentSection) commentSection.scrollIntoView({ behavior: "smooth" });
      }, 100); 
    } else if (n.reel) navigate(`/reels/${n.reel._id}`);
    else if (n.story) navigate(`/story/${n.story._id}`);
    else navigate(`/profile/${n.sender._id}`);
  };

  return (
    <div className="p-4 md:p-6 flex flex-col items-center min-h-screen bg-white md:bg-gray-50">
      {/* Header - Fixed on top for mobile if needed, but here kept simple */}
      <div className="w-full max-w-lg flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Notifications</h2>
        <span className="text-xs bg-gray-200 px-2 py-1 rounded-full font-medium">
          {notifications.filter(n => !n.isRead).length} New
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center mt-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-400 text-sm">No notifications yet</p>
        </div>
      ) : (
        <ul className="space-y-3 w-full max-w-lg">
          {notifications.map((n) => (
            <li
              key={n._id}
              onClick={() => handleClick(n)}
              className={`flex items-start gap-3 p-3 md:p-4 rounded-xl transition-all active:scale-[0.98] cursor-pointer
                ${!n.isRead 
                  ? "bg-red-50/60 border-l-4 border-red-500 shadow-sm" 
                  : "bg-white border border-gray-100 md:border-gray-200"}`}
            >
              {/* Sender Image */}
              <img
                src={n.sender?.profileImage || "/default-avatar.png"}
                alt="profile"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border shrink-0"
              />

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] md:text-sm text-gray-800 leading-snug">
                  <span className="font-bold">{n.sender?.username || "Someone"}</span>{" "}
                  <span className="text-gray-600">
                    {n.type === "like" && "liked your"}
                    {n.type === "comment" && "commented on your"}
                    {n.type === "follow" && "started following you"}
                    {n.type !== "follow" && (n.post ? " post" : n.reel ? " reel" : n.story ? " story" : " profile")}
                  </span>
                </p>

                {/* Time ago */}
                <p className="text-[10px] md:text-xs text-gray-400 mt-1">
                  {moment(n.createdAt).fromNow()}
                </p>
              </div>

              {/* Unread Dot (Mobile Friendly) */}
              {!n.isRead && (
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 shrink-0 animate-pulse"></div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;