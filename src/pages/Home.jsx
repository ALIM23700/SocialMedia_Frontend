// pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SideBar from "../Components/SideBar";
import StoryUpload from "./Uploadstory";
import Story from "./Story";
import Post from "./Post";
import { fetchAllUsers, toggleFollow } from "../features/Auth/Authslice";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser, allUsers } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleFollow = (userId) => {
    dispatch(toggleFollow(userId));
  };

  // Filter users: exclude current user and already followed users
  const suggestedUsers = allUsers.filter(
    (u) =>
      u._id !== currentUser?._id &&
      !currentUser?.following?.includes(u._id)
  );

  const initialUsers = suggestedUsers.slice(0, 5); // only first 5 users

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64">
        <SideBar />
      </div>

      {/* Main Content + Right Sidebar */}
      <div className="flex flex-1 gap-4 p-4">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Stories Row */}
          <div className="flex items-center space-x-4 overflow-x-auto mb-4">
            <StoryUpload />
            <Story />
          </div>

          {/* Posts */}
          <Post />
        </div>

        {/* Right Sidebar: People You May Know */}
        <div className="w-80 p-4 rounded h-fit">
          <h2 className="font-semibold text-lg mb-3">People You May Know</h2>
          {initialUsers.length > 0 ? (
            <>
              {initialUsers.map((u) => (
                <div className="flex items-center justify-between mb-3">
  <div className="flex items-center gap-3">
    {u.profileImage ? (
      <img
        src={u.profileImage}
        alt={u.username}
        className="w-10 h-10 rounded-full object-cover"
      />
    ) : (
      <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold">
        {u.username[0].toUpperCase()}
      </div>
    )}
    <span className="font-medium">{u.username}</span>
  </div>
  <button
    onClick={() => handleFollow(u._id)}
    className="px-3 py-1 rounded bg-blue-500 text-white"
  >
    Follow
  </button>
</div>
              ))}
              {suggestedUsers.length > 5 && (
                <button
                  onClick={() => navigate("/alluser")}
                  className="text-blue-500 font-semibold mt-2"
                >
                  See All
                </button>
              )}
            </>
          ) : (
            <p className="text-gray-500">No suggestions available</p>
           
          )}
         <p className="mt-12">©Devloped by Md.Abdul Alim</p>
         <p>Deparment of CSE PUST</p>
        </div>
      </div>
    </div>
  );
};

export default Home;