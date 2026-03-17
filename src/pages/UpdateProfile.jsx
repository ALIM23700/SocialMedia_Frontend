// pages/UpdateProfile.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile, fetchProfile } from "../features/Auth/Authslice";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(null);
  const [bio, setBio] = useState("");
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState("");

  // Fetch current profile if not loaded
  useEffect(() => {
    if (!user) {
      dispatch(fetchProfile());
    } else {
      setBio(user.bio || "");
      setPreview(user.profileImage || null);
    }
  }, [user, dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (profileImage) formData.append("profileImage", profileImage);
    formData.append("bio", bio);

    try {
      const resultAction = await dispatch(updateProfile(formData));
      if (updateProfile.fulfilled.match(resultAction)) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Update Your Profile
        </h1>

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-32 h-32 rounded-full object-cover mb-3"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 mb-3 flex items-center justify-center">
                <span className="text-gray-500">Preview</span>
              </div>
            )}
            <input
              type="file"
              name="profileImage"  // ✅ MUST have this for multer
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm"
            />
          </div>

          {/* Bio */}
          <textarea
            placeholder="Write a short bio..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-indigo-600 text-white p-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            disabled={loading}
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;