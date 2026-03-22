// pages/VisitorProfile.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile, toggleFollow } from "../features/Auth/Authslice";
import { fetchPosts } from "../features/Post/PostSlice";
import { fetchReels } from "../features/reels/reelSlice";
import { useParams, useNavigate } from "react-router-dom";

const VisitorProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams(); // visitor userId
  const { viewedUser, allUsers, user: currentUser, loading: userLoading } = useSelector((state) => state.auth);
  const { posts, loading: postsLoading } = useSelector((state) => state.post);
  const { reels, loading: reelsLoading } = useSelector((state) => state.reel);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // followers / following
  const [activeTab, setActiveTab] = useState("photos");
  const [showLikes, setShowLikes] = useState({});
  const [showComments, setShowComments] = useState({});

  // Fetch visitor profile
  useEffect(() => {
    if (userId) dispatch(fetchProfile(userId));
    dispatch(fetchPosts());
    dispatch(fetchReels());
  }, [userId, dispatch]);

  if (userLoading || postsLoading || reelsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!viewedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">User not found</p>
      </div>
    );
  }

  const userPosts = posts.filter((post) => post.user?._id === viewedUser._id);
  const userPhotos = userPosts.filter((post) => post.mediaType === "image");
  const userReels = reels.filter((r) => r.user?._id === viewedUser._id);

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleFollowClick = () => {
    dispatch(toggleFollow(viewedUser._id));
  };

  const handleMessageClick = () => {
    // Navigate to Message page and pass receiver id
    navigate(`/message/${viewedUser._id}`, { state: { receiver: viewedUser } });
  };

  const modalUsers =
    modalType === "followers"
      ? allUsers.filter((u) => viewedUser.followers?.includes(u._id))
      : allUsers.filter((u) => viewedUser.following?.includes(u._id));

  const renderCard = (item, type) => (
    <div className="w-28 h-28 rounded overflow-hidden relative" key={item._id}>
      {item.mediaType === "image" || type === "photos" ? (
        <img
          src={item.mediaUrl || "/default-post.png"}
          alt={item.caption || "media"}
          className="w-full h-full object-cover"
        />
      ) : (
        <video src={item.videoUrl || item.mediaUrl} controls className="w-full h-full object-cover" />
      )}

      <div className="absolute bottom-0 left-0 w-full bg-black/30 text-white p-1 text-xs flex justify-between">
        <span
          className="cursor-pointer"
          onClick={() => setShowLikes({ ...showLikes, [item._id]: !showLikes[item._id] })}
        >
          ❤️ {item.likes?.length || 0}
        </span>
        <span
          className="cursor-pointer"
          onClick={() => setShowComments({ ...showComments, [item._id]: !showComments[item._id] })}
        >
          💬 {item.comments?.length || 0}
        </span>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    const items = activeTab === "photos" ? userPhotos : activeTab === "posts" ? userPosts : userReels;
    return items.length > 0 ? (
      <div className="flex flex-wrap gap-2 justify-center mt-4">{items.map((item) => renderCard(item, activeTab))}</div>
    ) : (
      <p className="text-gray-500 text-center mt-4">
        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} not available
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10 w-full">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md flex flex-col items-center">
        <img
          src={viewedUser.profileImage || "/default-profile.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-800">{viewedUser.username}</h1>
        {viewedUser.bio && <p className="text-gray-600 mt-2 text-center">{viewedUser.bio}</p>}

        <div className="flex gap-4 mt-4">
          {currentUser?._id !== viewedUser._id && (
            <>
              <button
                onClick={handleFollowClick}
                className={`px-4 py-1 rounded text-white ${
                  currentUser?.following?.includes(viewedUser._id) ? "bg-blue-500" : "bg-green-500"
                }`}
              >
                {currentUser?.following?.includes(viewedUser._id) ? "Following" : "Follow"}
              </button>
              <button
                onClick={handleMessageClick}
                className="px-4 py-1 rounded bg-gray-800 text-white"
              >
                Message
              </button>
            </>
          )}
        </div>

        <div className="flex gap-6 mt-4">
          <div className="text-center cursor-pointer" onClick={() => openModal("followers")}>
            <p className="font-semibold">{viewedUser.followers?.length || 0}</p>
            <p className="text-gray-500 text-sm">Followers</p>
          </div>
          <div className="text-center cursor-pointer" onClick={() => openModal("following")}>
            <p className="font-semibold">{viewedUser.following?.length || 0}</p>
            <p className="text-gray-500 text-sm">Following</p>
          </div>
        </div>

        <div className="flex gap-4 mt-6 border-b w-full justify-center">
          {["photos", "posts", "reels"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 ${activeTab === tab ? "border-b-2 border-blue-500 font-semibold" : "text-gray-500"}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="w-full max-w-2xl">{renderActiveTab()}</div>

      {/* Followers/Following Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-3">
              {modalType === "followers" ? "Followers" : "Following"}
            </h2>
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
              {modalUsers.length > 0 ? (
                modalUsers.map((u) => (
                  <div key={u._id} className="flex items-center gap-3">
                    <img
                      src={u.profileImage || "/default-profile.png"}
                      alt={u.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium">{u.username}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No users found</p>
              )}
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-3 px-3 py-1 bg-blue-500 text-white rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorProfile;