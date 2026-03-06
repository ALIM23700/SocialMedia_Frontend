import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStory, fetchStories } from "../features/story/Storyslice";

const StoryUpload = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
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
    if (!token) return alert("Login first to upload!");

    setLoading(true);
    const formData = new FormData();
    formData.append("media", file);

    try {
      await dispatch(createStory(formData)).unwrap();
      alert("Story uploaded!");
      setFile(null);
      dispatch(fetchStories());
    } catch (err) {
      alert(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mr-4 w-24">
      <div className="w-20 h-20 border-2 border-blue-500 rounded-full overflow-hidden flex items-center justify-center cursor-pointer bg-gray-100">
        <input
          type="file"
          onChange={handleFileChange}
          className="absolute w-20 h-20 opacity-0 cursor-pointer"
        />
        {!file && <span className="text-blue-500 font-bold text-2xl">+</span>}
        {file && file.type.startsWith("image") && (
          <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover rounded-full" />
        )}
        {file && file.type.startsWith("video") && (
          <video src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded-full" />
        )}
      </div>
      <span className="text-sm mt-1 text-center">Create Story</span>
      {file && (
        <button
          onClick={handleUpload}
          className={`mt-2 px-2 py-1 text-xs rounded bg-blue-500 text-white w-full ${loading ? "bg-gray-400" : "hover:bg-blue-600"}`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      )}
    </div>
  );
};

export default StoryUpload;