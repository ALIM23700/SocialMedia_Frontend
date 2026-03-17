import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, likePost, commentPost } from "../features/Post/PostSlice";
import { toggleFollow } from "../features/Auth/Authslice";

const Explore = () => {
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
    dispatch(toggleFollow(userId));
  };

  if (loading) return <div>Loading...</div>;

  // ✅ MAIN LOGIC (Explore filter)
  const explorePosts = posts.filter(
    (p) =>
      p.user?._id !== currentUser?._id &&
      !currentUser?.following?.includes(p.user?._id)
  );

  return (
    <div className="flex flex-col space-y-6 mt-4">
      {explorePosts.map((p) => (
        <div key={p._id} className="bg-white rounded shadow max-w-md w-full mx-auto">
          
          {/* User */}
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-3">
              <img
                src={p.user?.profileImage || "/default-profile.png"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-semibold">{p.user?.username}</span>
            </div>

            <button
              onClick={() => handleFollow(p.user._id)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Follow
            </button>
          </div>

          {/* Media */}
          <div className="w-full max-h-[500px] overflow-hidden">
            {p.mediaType === "image" ? (
              <img src={p.mediaUrl} className="w-full object-cover" />
            ) : (
              <video src={p.mediaUrl} controls className="w-full object-cover" />
            )}
          </div>

          {/* Caption */}
          {p.caption && (
            <div className="px-3 py-2">
              <span className="font-semibold">{p.user?.username}: </span>
              {p.caption}
            </div>
          )}

          {/* Actions */}
          <div className="px-3 py-2 flex items-center gap-4">
            <button onClick={() => handleLike(p._id)} className="text-red-500">
              ❤️
            </button>

            <span
              onClick={() =>
                setShowLikes({ ...showLikes, [p._id]: !showLikes[p._id] })
              }
              className="cursor-pointer text-sm"
            >
              {p.likes?.length || 0} likes
            </span>

            <button
              onClick={() =>
                setShowComments({ ...showComments, [p._id]: !showComments[p._id] })
              }
              className="text-blue-500"
            >
              💬
            </button>

            <span className="text-sm">
              {p.comments?.length || 0} comments
            </span>
          </div>

          {/* Comments */}
          {showComments[p._id] && (
            <div className="px-3 py-2 border-t">
              {p.comments?.map((c, i) => (
                <p key={i}>
                  <b>{c.user?.username}:</b> {c.text}
                </p>
              ))}

              <div className="flex mt-2 gap-2">
                <input
                  value={replyText[p._id] || ""}
                  onChange={(e) =>
                    setReplyText({ ...replyText, [p._id]: e.target.value })
                  }
                  className="flex-1 border px-2 py-1"
                />
                <button
                  onClick={() => handleReply(p._id)}
                  className="bg-green-500 text-white px-2"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {explorePosts.length === 0 && (
        <p className="text-center text-gray-500">No suggestions</p>
      )}
    </div>
  );
};

export default Explore;