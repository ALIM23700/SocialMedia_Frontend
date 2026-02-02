import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStories, viewStory, likeStory, commentStory } from "../features/story/Storyslice";

const Story = () => {
  const dispatch = useDispatch();
  const { stories, loading } = useSelector((state) => state.story);
  const [activeStory, setActiveStory] = useState(null); // for modal
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  const handleView = (story) => setActiveStory(story);
  const handleClose = () => setActiveStory(null);

  const handleLike = (id) => dispatch(likeStory(id));
  const handleReply = (id) => {
    if (!replyText) return;
    dispatch(commentStory({ id, text: replyText }));
    setReplyText("");
  };

  if (loading) return <div>Loading stories...</div>;

  return (
    <>
      {/* Story Thumbnails */}
      <div className="flex overflow-x-auto space-x-4 p-2 bg-gray-100 rounded">
        {stories.map((s) => (
          <div
            key={s._id}
            className="w-20 h-20 flex-shrink-0 cursor-pointer border-2 border-pink-500 p-[2px] rounded-full overflow-hidden"
            onClick={() => handleView(s)}
          >
            {s.mediaType === "image" ? (
              <img
                src={s.mediaUrl}
                alt="story"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <video
                src={s.mediaUrl}
                className="w-full h-full object-cover rounded-full"
              />
            )}
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
          <button
            onClick={handleClose}
            className="text-white absolute top-5 right-5 text-2xl"
          >
            ✕
          </button>

          {activeStory.mediaType === "image" ? (
            <img
              src={activeStory.mediaUrl}
              className="max-h-[80vh] rounded-lg"
              alt="story"
            />
          ) : (
            <video
              src={activeStory.mediaUrl}
              autoPlay
              controls
              className="max-h-[80vh] rounded-lg"
            />
          )}

          {/* Actions */}
          <div className="w-full max-w-md mt-3 px-3 flex flex-col gap-2">
            <button
              onClick={() => handleLike(activeStory._id)}
              className="text-white"
            >
              ❤️ {activeStory.likes.length}
            </button>

            {/* Comments */}
            <div className="text-white text-sm max-h-24 overflow-y-auto">
              {activeStory.comments.map((c, i) => (
                <p key={i}>• {c.text}</p>
              ))}
            </div>

            {/* Reply */}
            <div className="flex mt-2 gap-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 px-2 py-1 rounded"
                placeholder="Reply..."
              />
              <button
                onClick={() => handleReply(activeStory._id)}
                className="bg-green-500 text-white px-3 rounded"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Story;
