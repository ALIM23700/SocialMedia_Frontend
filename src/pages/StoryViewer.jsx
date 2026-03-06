import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { viewStory, likeStory, commentStory } from "../features/story/Storyslice";

const StoryViewer = ({ story, onClose }) => {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [showLikes, setShowLikes] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showViews, setShowViews] = useState(false);

  // Automatically mark story as viewed when opened
  useEffect(() => {
    if (story?._id) {
      dispatch(viewStory(story._id));
    }
  }, [dispatch, story?._id]);

  const handleLike = () => {
    if (story?._id) dispatch(likeStory(story._id));
  };

  const handleReply = () => {
    if (!text.trim()) return;
    dispatch(commentStory({ id: story._id, text }));
    setText("");
  };

  if (!story) return null; // safety

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="text-white absolute top-5 right-5 text-2xl font-bold"
      >
        ✕
      </button>

      {/* Story Media */}
      {story.mediaType === "image" ? (
        <img
          src={story.mediaUrl}
          alt="story"
          className="max-h-[50vh] rounded"
        />
      ) : (
        <video
          src={story.mediaUrl}
          autoPlay
          controls
          className="max-h-[50vh] rounded"
        />
      )}

      {/* Actions Section */}
      <div className="w-full max-w-md mt-3 px-3 flex flex-col items-center gap-2">
        {/* Buttons Row */}
        <div className="flex gap-4 justify-center w-full">
          {/* Like */}
          <button
            onClick={handleLike}
            className="text-white font-semibold flex items-center gap-1"
          >
            ❤️ {story.likes?.length || 0}
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-white flex items-center gap-1"
          >
            💬 {story.comments?.length || 0}
          </button>

          {/* Views */}
          <button
            onClick={() => setShowViews(!showViews)}
            className="text-white flex items-center gap-1"
          >
            👁 {story.viewers?.length || 0}
          </button>
        </div>

        {/* Likes List */}
        {showLikes && story.likes && story.likes.length > 0 && (
          <div className="text-white text-sm max-h-24 overflow-y-auto p-2 bg-gray-800 rounded mt-1 w-full">
            <p className="font-semibold">Liked by:</p>
            {story.likes.map((u) => (
              <p key={u._id || u}>• {u.username || "Unknown"}</p>
            ))}
          </div>
        )}

        {/* Comments List */}
        {showComments && story.comments && story.comments.length > 0 && (
          <div className="text-white text-sm max-h-24 overflow-y-auto p-2 bg-gray-800 rounded mt-1 w-full">
            {story.comments.map((c, i) => (
              <p key={i}>
                <span className="font-semibold">
                  {c.user?.username || "Unknown"}:
                </span>{" "}
                {c.text}
              </p>
            ))}
          </div>
        )}

        {/* Viewers List */}
        {showViews && story.viewers && story.viewers.length > 0 && (
          <div className="text-white text-sm max-h-24 overflow-y-auto p-2 bg-gray-800 rounded mt-1 w-full">
            <p className="font-semibold">Viewed by:</p>
            {story.viewers.map((u) => (
              <p key={u._id || u}>• {u.username || "Unknown"}</p>
            ))}
          </div>
        )}

        {/* Reply Input */}
        <div className="flex mt-2 gap-2 w-full">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 px-2 py-1 rounded text-black"
            placeholder="Reply..."
          />
          <button
            onClick={handleReply}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;