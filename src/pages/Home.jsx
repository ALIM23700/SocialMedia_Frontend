import React from "react";
import SideBar from "../Components/SideBar";
import StoryUpload from "./Uploadstory";
import Story from "./Story";
import Post from "./Post";

const Home = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4">
        {/* Stories Row */}
        <div className="flex items-center space-x-4 overflow-x-auto mb-4">
          <StoryUpload />
          <Story />
        </div>

       
        <Post />

      
        
      </div>
    </div>
  );
};

export default Home;