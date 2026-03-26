
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { viewStory, likeStory, commentStory } from "../features/story/Storyslice";

const StoryViewer = ({ story, onClose }) => {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [showLikes, setShowLikes] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showViews, setShowViews] = useState(false);

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

  if (!story) return null;

  return (
    <div
      key={story._id}
      className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-[500] p-4"
    >
     
      <button
        onClick={onClose}
        className="text-white absolute top-5 right-5 text-2xl font-bold p-2 z-[510]"
      >
        ✕
      </button>

    
      <div className="flex-1 flex items-center justify-center w-full">
        {story.mediaType === "image" ? (
          <img
            src={story.mediaUrl}
            alt="story"
            className="max-h-[60vh] md:max-h-[75vh] w-auto rounded object-contain"
          />
        ) : (
          <video
            src={story.mediaUrl}
            autoPlay
            controls
            className="max-h-[60vh] md:max-h-[75vh] w-auto rounded object-contain"
          />
        )}
      </div>

    
      <div className="w-full max-w-md mt-3 px-3 flex flex-col items-center gap-2 mb-4">
       
        <div className="flex gap-6 justify-center w-full">
          <button
            onClick={handleLike}
            className="text-white font-semibold flex items-center gap-1"
          >
            ❤️ {story.likes?.length || 0}
          </button>

          <button
            onClick={() => { setShowComments(!showComments); setShowViews(false); setShowLikes(false); }}
            className="text-white flex items-center gap-1"
          >
            💬 {story.comments?.length || 0}
          </button>

          <button
            onClick={() => { setShowViews(!showViews); setShowComments(false); setShowLikes(false); }}
            className="text-white flex items-center gap-1"
          >
            👁 {story.viewers?.length || 0}
          </button>
        </div>

      
        <div className="w-full">
          {(showComments || showViews) && (
            <div className="text-white text-sm max-h-32 overflow-y-auto p-2 bg-gray-800 rounded mt-1 w-full border border-gray-700">
              {showComments && story.comments?.map((c, i) => (
                <p key={i} className="mb-1 text-xs">
                  <span className="font-semibold text-purple-400">{c.user?.username || "Unknown"}:</span> {c.text}
                </p>
              ))}
              {showViews && story.viewers?.map((u, i) => (
                <p key={i} className="text-xs">• {u.username || "Unknown"}</p>
              ))}
            </div>
          )}
        </div>

        
        <div className="flex mt-2 gap-2 w-full items-center">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 min-w-0 px-3 py-2 rounded text-black text-sm focus:outline-none"
            placeholder="Reply..."
          />
          <button
            onClick={handleReply}
            className="flex-shrink-0 min-w-fit bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-bold text-sm transition-all active:scale-95"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;