import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStory, fetchStories } from "../features/story/Storyslice";

const StoryUpload = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth); // <-- use token directly
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (!selected.type.startsWith("image") && !selected.type.startsWith("video")) {
      return alert("Only image or video allowed!");
    }
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return alert("Select an image or video!");
    if (!token) return alert("Login first to upload!"); // <-- check token

    setLoading(true);
    const formData = new FormData();
    formData.append("media", file);

    try {
      await dispatch(createStory(formData)).unwrap();
      alert("Story uploaded!");
      setFile(null);
      dispatch(fetchStories()); // refresh stories after upload
    } catch (err) {
      alert(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-4 p-2 bg-white rounded shadow mb-4">
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Story"}
      </button>
    </div>
  );
};

export default StoryUpload;
