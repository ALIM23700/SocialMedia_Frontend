// pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile } from "../features/Auth/Authslice";
import { fetchPosts, likePost, commentPost } from "../features/Post/PostSlice";
import { fetchReels } from "../features/reels/reelSlice";
import SideBar from "../Components/SideBar"; 

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading: userLoading, allUsers } = useSelector((state) => state.auth);
  const { posts, loading: postsLoading } = useSelector((state) => state.post);
  const { reels, loading: reelsLoading } = useSelector((state) => state.reel);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); 
  const [activeTab, setActiveTab] = useState("photos");

  const [replyText, setReplyText] = useState({});
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [currentCommentPost, setCurrentCommentPost] = useState(null);

  useEffect(() => {
    if (!user) dispatch(fetchProfile());
    dispatch(fetchPosts());
    dispatch(fetchReels());
  }, [user, dispatch]);

  if (userLoading || postsLoading || reelsLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white text-gray-500 font-medium">
        <p className="animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-white text-red-500">
        <p>User not found</p>
      </div>
    );
  }

  const userPosts = posts.filter((post) => post.user?._id === user._id);
  const userPhotos = userPosts.filter((post) => post.mediaType === "image");
  const userReels = reels.filter((r) => r.user?._id === user._id);

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const modalUsers =
    modalType === "followers"
      ? allUsers.filter((u) => user.followers?.includes(u._id))
      : allUsers.filter((u) => user.following?.includes(u._id));

  const handleLike = (postId) => {
    dispatch(likePost(postId));
  };

  const handleReply = (postId) => {
    const text = replyText[postId];
    if (!text?.trim()) return;
    dispatch(commentPost({ id: postId, text }));
    setReplyText({ ...replyText, [postId]: "" });
  };

  const renderCard = (item, type) => {
    const isLiked = item.likes?.some((u) => u._id === user._id);

    return (
      <div key={item._id} className="aspect-square w-full rounded overflow-hidden relative group border border-gray-100 bg-gray-50">
        {item.mediaType === "image" || type === "photos" ? (
          <img
            src={item.mediaUrl || "/default-post.png"}
            alt={item.caption || "media"}
            className="w-full h-full object-cover"
          />
        ) : (
          <video src={item.videoUrl || item.mediaUrl} className="w-full h-full object-cover" />
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-sm">
          <span className="cursor-pointer" onClick={() => handleLike(item._id)}>
            ❤️ {item.likes?.length || 0}
          </span>
          <span
            className="cursor-pointer"
            onClick={() => {
              setCurrentCommentPost(item);
              setShowCommentsModal(true);
            }}
          >
            💬 {item.comments?.length || 0}
          </span>
        </div>
      </div>
    );
  };

  const renderActiveTab = () => {
    const items =
      activeTab === "photos"
        ? userPhotos
        : activeTab === "posts"
        ? userPosts
        : userReels;

    return (
      <div className="w-full">
        {items.length > 0 ? (
          <div className="grid grid-cols-3 gap-0.5 md:gap-4 mt-4 px-0.5 md:px-0">
            {items.map((item) => renderCard(item, activeTab))}
          </div>
        ) : (
          <p className="text-gray-400 text-center mt-12 text-sm italic">
            No {activeTab} yet.
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <SideBar />

      {/* Main Container with corrected scroll and padding */}
      <div className="flex-1 h-full overflow-y-auto md:ml-64 scroll-smooth">
        
        {/* Mobile Top Header */}
        <div className="md:hidden w-full bg-black text-white px-4 py-3 flex justify-center items-center sticky top-0 z-[60] border-b border-gray-800">
          <span className="text-xl font-bold italic text-purple-500 tracking-wider uppercase">SocialPust</span>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Profile Header */}
          <div className="w-full px-4 pt-6 md:pt-10 flex flex-col md:flex-row items-center md:items-start md:gap-12 border-b pb-8 md:pb-12">
            <div className="relative shrink-0">
              <img
                src={user.profileImage || "/default-profile.png"}
                alt="Profile"
                className="w-24 h-24 md:w-40 md:h-40 rounded-full object-cover border-2 border-gray-100 p-1 shadow-sm"
              />
            </div>

            <div className="flex-1 mt-4 md:mt-0 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-xl md:text-2xl font-light text-gray-800">{user.username}</h1>
                <button className="bg-gray-100 hover:bg-gray-200 px-6 py-1.5 rounded-lg text-sm font-semibold transition-all">
                  Edit Profile
                </button>
              </div>

              <div className="flex gap-6 justify-center md:justify-start mb-4">
                <p className="text-sm md:text-base"><span className="font-bold">{userPosts.length}</span> posts</p>
                <div className="text-sm md:text-base cursor-pointer" onClick={() => openModal("followers")}>
                  <span className="font-bold">{user.followers?.length || 0}</span> followers
                </div>
                <div className="text-sm md:text-base cursor-pointer" onClick={() => openModal("following")}>
                  <span className="font-bold">{user.following?.length || 0}</span> following
                </div>
              </div>

              <div className="max-w-xs md:max-w-md">
                <p className="font-bold text-sm md:text-base">SocialPust User</p>
                {user.bio && <p className="text-gray-700 text-sm mt-1 whitespace-pre-wrap">{user.bio}</p>}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex w-full justify-center gap-10 md:gap-16 border-b md:border-none">
            {["photos", "posts", "reels"].map((tab) => (
              <button
                key={tab}
                className={`py-3 flex items-center gap-2 text-[10px] md:text-xs tracking-widest uppercase transition-all ${
                  activeTab === tab
                    ? "border-t-2 border-black text-black font-bold -mt-px md:border-t-2"
                    : "text-gray-400"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                <span className="inline">{tab}</span>
              </button>
            ))}
          </div>

          {/* Grid display */}
          <div className="w-full max-w-4xl min-h-[400px]">
            {renderActiveTab()}
          </div>
          
          {/* THE FIX: dedicated margin bottom spacer for mobile fixed sidebar */}
          <div className="h-[120px] md:h-20 w-full clear-both" />
        </div>
      </div>

      {/* Followers/Following Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[150] p-4">
          <div className="bg-white rounded-xl max-w-sm w-full overflow-hidden shadow-xl">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-center flex-1">{modalType === "followers" ? "Followers" : "Following"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-2xl leading-none">&times;</button>
            </div>
            <div className="p-2 max-h-80 overflow-y-auto">
              {modalUsers.length > 0 ? (
                modalUsers.map((u) => (
                  <div key={u._id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img src={u.profileImage || "/default-profile.png"} className="w-10 h-10 rounded-full object-cover" alt="" />
                      <span className="font-semibold text-sm">{u.username}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-6 text-sm">No users found</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {showCommentsModal && currentCommentPost && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[200] p-2">
          <div className="bg-white w-full max-w-md rounded-xl overflow-hidden flex flex-col max-h-[80vh] shadow-xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-bold text-gray-800">Comments</h2>
              <button onClick={() => setShowCommentsModal(false)} className="text-gray-400 font-bold">Close</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {currentCommentPost.comments?.length > 0 ? (
                currentCommentPost.comments.map((c, i) => (
                  <div key={i} className="flex gap-2 text-sm items-start">
                    <span className="font-bold text-purple-600 shrink-0">{c.user?.username || "User"}:</span>
                    <span className="text-gray-800 leading-snug">{c.text}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-10 text-sm">No comments yet</p>
              )}
            </div>
            <div className="p-4 border-t bg-white flex gap-2">
              <input
                type="text"
                value={replyText[currentCommentPost._id] || ""}
                onChange={(e) => setReplyText({ ...replyText, [currentCommentPost._id]: e.target.value })}
                className="flex-1 border border-gray-200 px-4 py-2 rounded-full text-sm focus:outline-none"
                placeholder="Write a comment..."
              />
              <button
                className="text-blue-500 font-bold text-sm px-2 disabled:text-gray-300"
                disabled={!replyText[currentCommentPost._id]?.trim()}
                onClick={() => handleReply(currentCommentPost._id)}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;