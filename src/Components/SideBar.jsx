import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/Auth/Authslice";
import {
  FaHome,
  FaSearch,
  FaVideo,
  FaFacebookMessenger,
  FaBell,
  FaPlusSquare,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

const SideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // user from redux
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    { icon: <FaHome />, label: "Home", path: "/" },
    { icon: <FaSearch />, label: "Explore", path: "/explore" },
    { icon: <FaVideo />, label: "Reels", path: "/reels" },
    { icon: <FaFacebookMessenger />, label: "Messages", path: "/messages" },
    { icon: <FaBell />, label: "Notifications", path: "/notification" },
    { icon: <FaPlusSquare />, label: "Create", path: "/create" },
    {
      icon: <FaUser />,
      label: "Profile",
      path: `/profile/${user?._id}`,
    },
  ];

  return (
    <div
      className="
        h-screen w-64 bg-black text-white fixed left-0 top-0
        border-r border-gray-800
        shadow-2xl shadow-black/50
      "
    >
      {/* Logo */}
      <div className="p-6 text-2xl font-bold tracking-wide">
        Instagram
      </div>

      {/* Menu */}
      <ul className="px-4 space-y-2">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 rounded-lg transition-all duration-200
              ${
                isActive
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-purple-600 hover:text-white"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-base">{item.label}</span>
          </NavLink>
        ))}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="
            w-full flex items-center gap-4 p-3 rounded-lg
            text-gray-300 hover:bg-purple-600 hover:text-white
            transition-all duration-200
          "
        >
          <FaSignOutAlt className="text-xl" />
          <span>Logout</span>
        </button>
      </ul>
    </div>
  );
};

export default SideBar;
