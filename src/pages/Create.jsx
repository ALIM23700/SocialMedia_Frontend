import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost, fetchPosts } from "../features/Post/PostSlice";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
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
    if (!file) return alert("Select a file first!");
    setLoading(true);
    const formData = new FormData();
    formData.append("media", file);
    formData.append("caption", caption);

    try {
      await dispatch(createPost(formData)).unwrap();
      setFile(null);
      setCaption("");
      dispatch(fetchPosts());
      alert("Post created!");
       navigate("/");
    } catch (err) {
      alert(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-full max-w-md bg-white shadow-black shadow-lg rounded-lg p-6">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={user?.profileImage || "/default-profile.png"}
            alt={user?.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-semibold">{user?.username || "Unknown"}</span>
        </div>

        {/* Caption */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full border p-2 rounded mb-3 resize-none"
        />

        {/* File Input */}
        <input type="file" onChange={handleFileChange} className="mb-3" />

        {/* Preview */}
        {file && (
          <div className="mb-3">
            {file.type.startsWith("image") ? (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-full max-h-60 object-cover rounded"
              />
            ) : (
              <video
                src={URL.createObjectURL(file)}
                controls
                className="w-full max-h-60 rounded"
              />
            )}
          </div>
        )}

        {/* Post Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;