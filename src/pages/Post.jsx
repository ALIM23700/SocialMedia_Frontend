import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, likePost, commentPost } from "../features/Post/PostSlice";
import { toggleFollow } from "../features/Auth/Authslice";

const Post = () => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.post);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [replyText, setReplyText] = useState({});
  const [showLikes, setShowLikes] = useState({});
  const [showComments, setShowComments] = useState({});

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleLike = (id) => {
    dispatch(likePost(id));
  };

  const handleReply = (id) => {
    if (!replyText[id]?.trim()) return;
    dispatch(commentPost({ id, text: replyText[id] }));
    setReplyText({ ...replyText, [id]: "" });
    setShowComments({ ...showComments, [id]: true });
  };

  const handleFollow = (userId) => {
    console.log("Toggling follow for user:", userId);
    dispatch(toggleFollow(userId));
  };

  if (loading) return <div>Loading posts...</div>;

  return (
    <div className="flex flex-col space-y-6 mt-4">
      {posts.map((p) => (
        <div key={p._id} className="bg-white rounded shadow max-w-md w-full mx-auto">
          {/* User info */}
          <div className="flex items-center gap-3 p-3 border-b justify-between">
            <div className="flex items-center gap-3">
              <img
                src={p.user?.profileImage || "/default-profile.png"}
                alt={p.user?.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-semibold">{p.user?.username || "Unknown"}</span>
            </div>

            {/* Follow/Unfollow Button */}
            {currentUser?._id !== p.user?._id && (
              <button
                onClick={() => handleFollow(p.user._id)}
                className={`px-3 py-1 rounded text-white ${
                  currentUser?.following?.includes(p.user._id)
                    ? "bg-gray-500"
                    : "bg-blue-500"
                }`}
              >
                {currentUser?.following?.includes(p.user._id) ? "Following" : "Follow"}
              </button>
            )}
          </div>

          {/* Media */}
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

          {/* Actions */}
          <div className="px-3 py-2 flex items-center gap-4">
            <button onClick={() => handleLike(p._id)} className="font-semibold text-red-500">
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

          {/* Likes list */}
          {showLikes[p._id] && p.likes?.length > 0 && (
            <div className="px-3 py-2 border-t border-gray-200 max-h-32 overflow-y-auto">
              <p className="font-semibold mb-1">Liked by:</p>
              {p.likes.map((u, i) => (
                <p key={i}>• {u.username || "Unknown"}</p>
              ))}
            </div>
          )}

          {/* Comments list */}
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

              {/* Add Comment */}
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
      ))}
    </div>
  );
};

export default Post;