import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/Auth/Authslice";
import { fetchNotifications } from "../features/Notification/NotificationSlice";
import { FaHome, FaSearch, FaVideo, FaFacebookMessenger, FaBell, FaPlusSquare, FaUser } from "react-icons/fa";

const SideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notification);
  const { unreadCounts } = useSelector((state) => state.message); // message unread counts

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Fetch notifications once
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const unreadNotifCount = notifications?.filter((n) => !n.isRead)?.length || 0;
  const unreadMsgCount = Object.values(unreadCounts || {}).reduce((total, count) => total + count, 0);

  const menuItems = [
    { icon: <FaHome />, label: "Home", path: "/" },
    { icon: <FaSearch />, label: "Explore", path: "/explore" },
    { icon: <FaVideo />, label: "Reels", path: "/reels" },
    { icon: <FaFacebookMessenger />, label: "Message", path: "/message", badge: unreadMsgCount },
    { icon: <FaBell />, label: "Notification", path: "/notification", badge: unreadNotifCount },
    { icon: <FaPlusSquare />, label: "Create", path: "/create" },
    { icon: <FaUser />, label: "Profile", path: `/profile/${user?._id}` },
  ];

  return (
    <div className="h-screen w-64 bg-black text-white fixed left-0 top-0 border-r border-gray-800 shadow-2xl shadow-black/50">
      <div className="p-6 text-2xl font-bold tracking-wide">SocialPust</div>

      <ul className="px-4 space-y-2">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 rounded-lg transition-all duration-200
               ${isActive ? "bg-purple-600 text-white" : "text-gray-300 hover:bg-purple-600 hover:text-white"}`
            }
          >
            <span className="text-xl relative">
              {item.icon}
              {item.badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </span>
            <span className="text-base">{item.label}</span>
          </NavLink>
        ))}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600 hover:text-white transition-all duration-200"
        >
          {user?.profileImage ? (
            <img src={user.profileImage} alt={user.username} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <FaUser className="text-xl" />
          )}
          <span>Logout</span>
        </button>
      </ul>
    </div>
  );
};

export default SideBar;
//alim ok indicate