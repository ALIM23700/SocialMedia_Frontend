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

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-pulse font-medium text-gray-500">Loading...</div>
    </div>
  );

  const explorePosts = posts.filter(
    (p) =>
      p.user?._id !== currentUser?._id &&
      !currentUser?.following?.includes(p.user?._id)
  );

  return (

    <div className="flex flex-col space-y-6 mt-4 px-2 md:px-0 pb-20 md:pb-10">
      {explorePosts.map((p) => (
        <div key={p._id} className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-md w-full mx-auto overflow-hidden">
          
      
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-3">
              <img
                src={p.user?.profileImage || "/default-profile.png"}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-gray-100"
                alt="user"
              />
              <span className="font-semibold text-sm md:text-base">{p.user?.username}</span>
            </div>

            <button
              onClick={() => handleFollow(p.user._id)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full text-xs md:text-sm font-medium transition-all"
            >
              Follow
            </button>
          </div>

     
          <div className="w-full bg-gray-50 flex items-center justify-center overflow-hidden">
            {p.mediaType === "image" ? (
              <img src={p.mediaUrl} className="w-full h-auto max-h-[500px] object-contain" alt="post" />
            ) : (
              <video src={p.mediaUrl} controls className="w-full max-h-[500px]" />
            )}
          </div>

      
          {p.caption && (
            <div className="px-4 py-2 text-sm">
              <span className="font-bold mr-2">{p.user?.username}</span>
              <span className="text-gray-800">{p.caption}</span>
            </div>
          )}

      
          <div className="px-4 py-3 flex items-center gap-5 border-t border-gray-50">
            <div className="flex items-center gap-1">
              <button onClick={() => handleLike(p._id)} className="text-xl active:scale-125 transition-transform">
                ❤️
              </button>
              <span
                onClick={() => setShowLikes({ ...showLikes, [p._id]: !showLikes[p._id] })}
                className="cursor-pointer text-xs font-semibold text-gray-600"
              >
                {p.likes?.length || 0}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowComments({ ...showComments, [p._id]: !showComments[p._id] })}
                className="text-xl active:scale-125 transition-transform"
              >
                💬
              </button>
              <span className="text-xs font-semibold text-gray-600">
                {p.comments?.length || 0}
              </span>
            </div>
          </div>

      
          {showComments[p._id] && (
            <div className="px-4 py-3 bg-gray-50 border-t space-y-2">
              <div className="max-h-32 overflow-y-auto space-y-1 custom-scrollbar">
                {p.comments?.map((c, i) => (
                  <p key={i} className="text-xs md:text-sm">
                    <b className="text-gray-900">{c.user?.username}:</b> <span className="text-gray-700">{c.text}</span>
                  </p>
                ))}
              </div>

              <div className="flex mt-3 gap-2 items-center">
                <input
                  value={replyText[p._id] || ""}
                  onChange={(e) =>
                    setReplyText({ ...replyText, [p._id]: e.target.value })
                  }
                  className="flex-1 min-w-0 border border-gray-200 rounded-full px-4 py-1.5 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
                  placeholder="Add a comment..."
                />
                <button
                  onClick={() => handleReply(p._id)}
                  disabled={!replyText[p._id]?.trim()}
                  className="flex-shrink-0 min-w-fit bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all whitespace-nowrap"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {explorePosts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-center text-gray-400 italic">No new suggestions for you</p>
        </div>
      )}
    </div>
  );
};

export default Explore;