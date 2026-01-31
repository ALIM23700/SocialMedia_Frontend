import React from "react";
import SideBar from "../Components/SideBar";

const Home = () => {
  return (
    <div className="flex">
      <SideBar />

      {/* Main Content */}
      <div className="ml-64 flex-1 min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold">Home</h1>
      
      </div>
    </div>
  );
};

export default Home;
