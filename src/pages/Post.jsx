// pages/Post.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, likePost, commentPost } from "../features/Post/PostSlice";
import { toggleFollow } from "../features/Auth/Authslice";
import { useParams, useNavigate } from "react-router-dom";

const Post = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ for navigation
  const { id } = useParams(); // dynamic post ID from URL
  const { posts, loading } = useSelector((state) => state.post);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [replyText, setReplyText] = useState({});
  const [showLikes, setShowLikes] = useState({});
  const [showComments, setShowComments] = useState({});

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleLike = (postId) => {
    dispatch(likePost(postId));
  };

  const handleReply = (postId) => {
    if (!replyText[postId]?.trim()) return;
    dispatch(commentPost({ id: postId, text: replyText[postId] }));
    setReplyText({ ...replyText, [postId]: "" });
    setShowComments({ ...showComments, [postId]: true });
  };

  const handleFollow = (userId) => {
    dispatch(toggleFollow(userId));
  };

  const goToProfile = (userId) => {
    if (userId === currentUser?._id) {
      navigate("/profile"); // logged-in user's profile
    } else {
      navigate(`/visitor/${userId}`); // visitor profile page
    }
  };

  if (loading) return <div>Loading posts...</div>;

  // Filter posts if dynamic ID is present
  let feedPosts = posts;
  if (id) {
    feedPosts = posts.filter((p) => p._id === id);
  } else if (currentUser?.following?.length > 0) {
    feedPosts = posts.filter((p) => currentUser.following.includes(p.user?._id));
  }

  return (
    <div className="flex flex-col space-y-6 mt-4">
      {!id && currentUser?.following?.length === 0 && (
        <h3 className="text-center text-gray-500">Suggested for you</h3>
      )}

      {feedPosts.map((p) => {
        const isLiked = p.likes?.some((u) => u._id === currentUser?._id);

        return (
          <div key={p._id} className="rounded max-w-md w-full mx-auto">
            {/* User Info Header */}
            <div className="flex items-center gap-3 p-3 border-b justify-between cursor-pointer" onClick={() => goToProfile(p.user?._id)}>
              <div className="flex items-center gap-3">
                <img
                  src={p.user?.profileImage || "/default-profile.png"}
                  alt={p.user?.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-semibold">{p.user?.username || "Unknown"}</span>
              </div>

              {currentUser?._id !== p.user?._id && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleFollow(p.user._id); }}
                  className={`px-3 py-1 rounded text-white bg-blue-500`}
                >
                  {currentUser?.following?.includes(p.user._id) ? "Following" : "Follow"}
                </button>
              )}
            </div>

            {/* Post Media */}
            <div className="w-full max-h-[500px] overflow-hidden">
              {p.mediaType === "image" ? (
                <img src={p.mediaUrl} alt="post" className="w-full object-cover" />
              ) : (
                <video src={p.mediaUrl} controls className="w-full object-cover" />
              )}
            </div>

            {/* Caption */}
            {p.caption && (
              <div className="px-3 py-2">
                <span className="font-semibold">{p.user?.username || "Unknown"}: </span>
                {p.caption}
              </div>
            )}

            {/* Like & Comment Controls */}
            <div className="px-3 py-2 flex items-center gap-4">
              <button
                onClick={() => handleLike(p._id)}
                className={`font-semibold ${isLiked ? "text-red-600" : "text-gray-400"}`}
              >
                ❤️
              </button>

              <span
                className="cursor-pointer text-sm text-gray-700"
                onClick={() =>
                  setShowLikes({ ...showLikes, [p._id]: !showLikes[p._id] })
                }
              >
                {p.likes?.length || 0} likes
              </span>

              <button
                onClick={() =>
                  setShowComments({ ...showComments, [p._id]: !showComments[p._id] })
                }
                className="font-semibold text-blue-500"
              >
                💬
              </button>

              <span
                className="cursor-pointer text-sm text-gray-700"
                onClick={() =>
                  setShowComments({ ...showComments, [p._id]: !showComments[p._id] })
                }
              >
                {p.comments?.length || 0} comments
              </span>
            </div>

            {/* Likes List */}
            {showLikes[p._id] && p.likes?.length > 0 && (
              <div className="px-3 py-2 border-t border-gray-200 max-h-32 overflow-y-auto">
                <p className="font-semibold mb-1">Liked by:</p>
                {p.likes.map((u, i) => (
                  <p key={i}>•{u.username || "Unknown"}</p>
                ))}
              </div>
            )}

            {/* Comments */}
            {showComments[p._id] && (
              <div className="px-3 py-2 border-t border-gray-200 max-h-40 overflow-y-auto">
                <p className="font-semibold mb-1">Comments:</p>
                {p.comments?.length > 0 ? (
                  p.comments.map((c, i) => (
                    <p key={i}>
                      <span className="font-semibold">{c.user?.username || "Unknown"}:</span>{" "}
                      {c.text}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-400">No comments yet</p>
                )}

                <div className="flex mt-2 gap-2">
                  <input
                    type="text"
                    value={replyText[p._id] || ""}
                    onChange={(e) =>
                      setReplyText({ ...replyText, [p._id]: e.target.value })
                    }
                    className="flex-1 px-2 py-1 border rounded"
                    placeholder="Add a comment..."
                  />
                  <button
                    onClick={() => handleReply(p._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default Post;