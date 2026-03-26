import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SideBar from "../Components/SideBar";
import StoryUpload from "./Uploadstory";
import Story from "./Story";
import Post from "./Post";
import { fetchAllUsers, toggleFollow } from "../features/Auth/Authslice";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser, allUsers } = useSelector((state) => state.auth);
  const storyRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleFollow = (userId) => {
    dispatch(toggleFollow(userId));
  };

 
  const goToProfile = (userId) => {
    if (userId === currentUser?._id) {
      navigate("/profile"); 
    } else {
      navigate(`/visitor/${userId}`);
    }
  };

  const scrollStories = (direction) => {
    if (storyRef.current) {
      const { scrollLeft, clientWidth } = storyRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      storyRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const suggestedUsers = allUsers.filter(
    (u) => u._id !== currentUser?._id && !currentUser?.following?.includes(u._id)
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />

      <div className="flex-1 flex flex-col md:ml-64 pb-20 md:pb-0 overflow-x-hidden">
      
        <div className="md:hidden w-full bg-black text-white px-4 py-3 flex justify-center items-center sticky top-0 z-50">
          <span className="text-xl font-bold italic tracking-wider text-purple-500">SocialPust</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 p-2 md:p-6 justify-center">
          
          <div className="w-full max-w-[600px]">
         
            <div className="relative group bg-white md:border border-gray-200 md:rounded-lg mb-4 p-4">
               <button onClick={() => scrollStories('left')} className="absolute left-1 top-1/2 z-10 bg-white/80 rounded-full p-1 shadow hidden group-hover:block border">
                 <FaChevronLeft className="text-gray-600" />
               </button>
               <div ref={storyRef} className="flex items-center space-x-4 overflow-x-auto no-scrollbar">
                  <StoryUpload />
                  <Story />
               </div>
               <button onClick={() => scrollStories('right')} className="absolute right-1 top-1/2 z-10 bg-white/80 rounded-full p-1 shadow hidden group-hover:block border">
                 <FaChevronRight className="text-gray-600" />
               </button>
            </div>
            <div className="md:hidden bg-white border border-gray-200 rounded-lg mb-4 p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-sm text-gray-500">People You May Know</h2>
                <button onClick={() => navigate("/alluser")} className="text-blue-500 text-xs font-bold">See All</button>
              </div>
              <div className="flex space-x-4 overflow-x-auto no-scrollbar py-2">
                {suggestedUsers.slice(0, 8).map((u) => (
                  <div key={u._id} className="min-w-[140px] border rounded-xl p-3 flex flex-col items-center bg-gray-50">
                    
                  
                    <div className="cursor-pointer" onClick={() => goToProfile(u._id)}>
                      {u.profileImage ? (
                        <img src={u.profileImage} className="w-14 h-14 rounded-full object-cover mb-2 border border-gray-200" alt=""/>
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg mb-2 border border-purple-200">
                          {u.username[0].toUpperCase()}
                        </div>
                      )}
                    </div>

                 
                    <span 
                      onClick={() => goToProfile(u._id)}
                      className="text-xs font-bold truncate w-full text-center cursor-pointer hover:underline"
                    >
                      {u.username}
                    </span>
                    
                    <button onClick={() => handleFollow(u._id)} className="mt-2 bg-blue-500 text-white text-[10px] px-4 py-1 rounded-md font-bold w-full active:scale-95 transition-transform">Follow</button>
                  </div>
                ))}
              </div>
            </div>

            <Post />
          </div>

      
          <div className="hidden lg:block w-80 sticky top-6 h-fit bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-500">Suggested for you</h2>
              <button onClick={() => navigate("/alluser")} className="text-blue-500 text-xs font-bold hover:underline">See All</button>
            </div>
            <div className="space-y-4">
              {suggestedUsers.slice(0, 5).map((u) => (
                <div key={u._id} className="flex items-center justify-between">
               
                  <div className="flex items-center gap-3 cursor-pointer group" onClick={() => goToProfile(u._id)}>
                    {u.profileImage ? (
                      <img src={u.profileImage} className="w-10 h-10 rounded-full object-cover border border-gray-100" alt=""/>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm border border-purple-200">
                        {u.username[0].toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-semibold group-hover:underline">{u.username}</span>
                  </div>
                  <button onClick={() => handleFollow(u._id)} className="text-blue-500 text-xs font-bold hover:underline">Follow</button>
                </div>
              ))}
            </div>
            <div className="mt-10 text-[11px] text-gray-400 border-t pt-4 text-center">
                <p>© 2026 Developed by Md. Abdul Alim</p>
                <p>Department of CSE, PUST</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;