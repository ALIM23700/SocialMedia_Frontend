// pages/Profile.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile } from "../features/Auth/Authslice";
import { fetchPosts } from "../features/Post/PostSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading: userLoading } = useSelector((state) => state.auth);
  const { posts, loading: postsLoading } = useSelector((state) => state.post);

  useEffect(() => {
    if (!user) {
      dispatch(fetchProfile());
    }
    dispatch(fetchPosts());
  }, [user, dispatch]);

  if (userLoading || postsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">User not found</p>
      </div>
    );
  }

  // Filter posts for current user
  const userPosts = posts.filter((post) => post.user?._id === user._id);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md flex flex-col items-center">
        <img
          src={user.profileImage || "/default-profile.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-800">{user.username}</h1>
        {user.bio && <p className="text-gray-600 mt-2 text-center">{user.bio}</p>}

        <div className="flex gap-6 mt-4">
          <div className="text-center">
            <p className="font-semibold">{user.followers?.length || 0}</p>
            <p className="text-gray-500 text-sm">Followers</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">{user.following?.length || 0}</p>
            <p className="text-gray-500 text-sm">Following</p>
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div className="mt-8 w-full max-w-md grid grid-cols-3 gap-2">
        {userPosts.length > 0 ? (
          userPosts.map((post, index) => (
            <div key={post._id || index} className="w-full h-24 overflow-hidden rounded">
              {post.mediaType === "image" ? (
                <img
                  src={post.mediaUrl || "/default-post.png"}
                  alt={`Post ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <video
                  src={post.mediaUrl}
                  controls
                  className="w-full h-full object-cover rounded"
                />
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-3">
            No posts yet
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;