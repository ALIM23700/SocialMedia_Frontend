import React from "react";
import SideBar from "../Components/SideBar";
import StoryUpload from "./Uploadstory";
import Story from "./Story";

const Home = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64">
        <SideBar />
      </div>

      <div className="flex-1 flex flex-col p-4">
        <StoryUpload />
        <Story />
        <main className="p-4 mt-4 bg-white rounded shadow">
          <h1 className="text-3xl font-bold mb-4">Home</h1>
          <p>Welcome to your Social Media app!</p>
        </main>
      </div>
    </div>
  );
};

export default Home;
