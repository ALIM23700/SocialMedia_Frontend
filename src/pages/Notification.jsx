// pages/Notification.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAsRead } from "../features/Notification/NotificationSlice";
import { useNavigate } from "react-router-dom";
import moment from "moment"; // For time ago formatting

const Notification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, loading } = useSelector((state) => state.notification);

  useEffect(() => {
    const fetchAndMark = async () => {
      // Fetch notifications
      const action = await dispatch(fetchNotifications());

      // After fetching, mark all unread notifications as read
      if (action.payload) {
        action.payload
          .filter((n) => !n.isRead)
          .forEach((n) => dispatch(markAsRead(n._id)));
      }
    };

    fetchAndMark();
  }, [dispatch]);

  // Handle click on notification
  const handleClick = (n) => {
    if (n.post) {
      navigate(`/post/${n.post._id}`);
      // Scroll to comments automatically after navigation
      setTimeout(() => {
        const commentSection = document.getElementById("comments");
        if (commentSection) commentSection.scrollIntoView({ behavior: "smooth" });
      }, 100); 
    } else if (n.reel) navigate(`/reels/${n.reel._id}`);
    else if (n.story) navigate(`/story/${n.story._id}`);
    else navigate(`/profile/${n.sender._id}`);
  };

  return (
    <div className="p-6 flex flex-col items-center min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>

      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet</p>
      ) : (
        <ul className="space-y-4 w-full max-w-lg">
          {notifications.map((n) => (
            <li
              key={n._id}
              onClick={() => handleClick(n)}
              className={`flex justify-between items-center p-4 rounded-lg shadow-sm cursor-pointer transition-colors
                ${!n.isRead ? "bg-red-50 border-l-4 border-red-500" : "bg-white border border-gray-200"}`}
            >
              <div className="flex items-center gap-3">
              
              <img
                  src={n.sender.profileImage || "/default-avatar.png"}
                  alt={n.sender.username}
                  className="w-12 h-12 rounded-full object-cover border"
                />
                <div>
                  <p className="text-gray-800">
                    <span className="font-semibold">{n.sender?.username || "Unknown"}</span>{" "}
                    {n.type === "like" && "liked"}
                    {n.type === "comment" && "commented on"}
                    {n.type === "follow" && "started following"}{" "}
                    {n.post
                      ? "your post"
                      : n.reel
                      ? "your reel"
                      : n.story
                      ? "your story"
                      : "your profile"}
                  </p>

                  {/* Time ago */}
                  <p className="text-xs text-gray-500">{moment(n.createdAt).fromNow()}</p>
                </div>
              </div>

              {/* Optional: Mark as read button */}
              {!n.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering handleClick
                    dispatch(markAsRead(n._id));
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition-colors"
                >
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;