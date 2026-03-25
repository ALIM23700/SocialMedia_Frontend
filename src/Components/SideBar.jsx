import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/Auth/Authslice";
import { fetchNotifications } from "../features/Notification/NotificationSlice";
import { 
  FaHome, FaSearch, FaVideo, FaFacebookMessenger, 
  FaBell, FaPlusSquare, FaUser, FaBars 
} from "react-icons/fa";

const SideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notification);
  const { unreadCounts } = useSelector((state) => state.message);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

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
    <>
      {/* --- DESKTOP SIDEBAR --- */}
      <div className="hidden md:flex h-screen w-64 bg-black text-white fixed left-0 top-0 border-r border-gray-800 flex-col py-6">
        <div className="p-6 text-2xl font-bold tracking-wide">SocialPust</div>
        <ul className="px-4 space-y-2 flex-1">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-lg transition-all ${isActive ? "bg-purple-600 text-white" : "text-gray-300 hover:bg-purple-600 hover:text-white"}`
              }
            >
              <span className="text-xl relative">
                {item.icon}
                {item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-xs w-5 h-5 rounded-full flex items-center justify-center font-normal">
                    {item.badge}
                  </span>
                )}
              </span>
              <span className="text-base">{item.label}</span>
            </NavLink>
          ))}
        </ul>
        
        <div className="px-4 mt-auto">
            <button onClick={handleLogout} className="w-full flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600 hover:text-white transition-all">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="" className="w-8 h-8 rounded-full object-cover border border-gray-700" />
                ) : (
                  <FaUser className="text-xl" />
                )}
                <span>Logout</span>
            </button>
        </div>
      </div>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-black border-t border-gray-800 flex justify-around items-center py-3 z-[100] text-white">
        <NavLink to="/" className={({ isActive }) => isActive ? "text-purple-500" : "text-gray-400"}><FaHome className="text-2xl" /></NavLink>
        <NavLink to="/explore" className={({ isActive }) => isActive ? "text-purple-500" : "text-gray-400"}><FaSearch className="text-2xl" /></NavLink>
        
        {/* Corrected Message Option */}
        <NavLink 
          to="/message" 
          className={({ isActive }) => `relative ${isActive ? "text-purple-500" : "text-gray-400"}`}
        >
          <FaFacebookMessenger className="text-2xl" />
          {unreadMsgCount > 0 && (
             <span className="absolute -top-2 -right-2 bg-red-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white font-bold">
               {unreadMsgCount}
             </span>
          )}
        </NavLink>
        
        <div className="relative">
          <button onClick={() => setShowMore(!showMore)} className="flex items-center p-2 focus:outline-none">
             <FaBars className={`text-2xl transition-colors ${showMore ? 'text-purple-500' : 'text-gray-400'}`} />
          </button>
          
          {showMore && (
            <div className="absolute bottom-14 right-[-10px] w-52 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden flex flex-col z-[110]">
                <NavLink to="/create" onClick={()=>setShowMore(false)} className="p-4 hover:bg-gray-800 flex items-center gap-3 text-sm border-b border-gray-800 text-gray-200">
                    <FaPlusSquare className="text-purple-500" /> Create Post
                </NavLink>

                <NavLink to="/reels" onClick={()=>setShowMore(false)} className="p-4 hover:bg-gray-800 flex items-center gap-3 text-sm border-b border-gray-800 text-gray-200">
                    <FaVideo className="text-purple-500" /> Reels
                </NavLink>

                <NavLink to="/notification" onClick={()=>setShowMore(false)} className="p-4 hover:bg-gray-800 flex items-center justify-between border-b border-gray-800 text-gray-200">
                    <div className="flex items-center gap-3"><FaBell className="text-purple-500" /> Notification</div>
                    {unreadNotifCount > 0 && <span className="bg-red-600 text-[10px] px-2 rounded-full">{unreadNotifCount}</span>}
                </NavLink>

                <NavLink to={`/profile/${user?._id}`} onClick={()=>setShowMore(false)} className="p-4 hover:bg-gray-800 flex items-center gap-3 text-sm border-b border-gray-800 text-gray-200">
                    <FaUser className="text-purple-500" /> Profile
                </NavLink>

                <button onClick={() => { handleLogout(); setShowMore(false); }} className="p-4 text-red-500 hover:bg-gray-800 flex items-center gap-3 text-sm text-left font-bold">
                    {user?.profileImage ? (
                      <img src={user.profileImage} className="w-6 h-6 rounded-full object-cover border border-gray-600" alt="" />
                    ) : (
                      <FaUser />
                    )}
                    Logout
                </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SideBar;