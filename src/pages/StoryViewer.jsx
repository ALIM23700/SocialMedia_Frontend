import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { viewStory, likeStory, commentStory } from "../features/story/Storyslice";

const StoryViewer = ({ story, onClose }) => {
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  useEffect(() => {
    if (story?._id) {
      dispatch(viewStory(story._id)); // view auto add
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

  if (!story) return null; // safety check

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
      <button
        onClick={onClose}
        className="text-white absolute top-5 right-5 text-2xl font-bold"
      >
        ✕
      </button>

      {story.mediaType === "image" ? (
        <img src={story.mediaUrl} alt="story" className="max-h-[80vh] rounded" />
      ) : (
        <video
          src={story.mediaUrl}
          autoPlay
          controls
          className="max-h-[80vh] rounded"
        />
      )}

      {/* Actions */}
      <div className="w-full max-w-md mt-3 px-3">
        <button
          onClick={handleLike}
          className="text-white mb-2 font-semibold"
        >
          ❤️ {story.likes?.length || 0}
        </button>

        {/* Comments */}
        <div className="text-white text-sm max-h-24 overflow-y-auto mb-2">
          {story.comments && story.comments.length > 0 ? (
            story.comments.map((c, i) => <p key={i}>• {c.text}</p>)
          ) : (
            <p className="text-gray-400">No comments yet</p>
          )}
        </div>

        {/* Reply */}
        <div className="flex gap-2">
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
