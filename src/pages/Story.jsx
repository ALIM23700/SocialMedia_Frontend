// pages/Story.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStories, viewStory } from "../features/story/Storyslice";
import StoryViewer from "./StoryViewer";
import { useParams } from "react-router-dom";

const Story = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // ✅ story ID from URL (notification)
  const { stories, loading } = useSelector((state) => state.story);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [activeStory, setActiveStory] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  useEffect(() => {
    if (id && stories.length > 0) {
      // Find the story with this ID
      const story = stories.find((s) => s._id === id);
      if (story) {
        dispatch(viewStory(story._id));
        setActiveStory(story);
      }
    }
  }, [id, stories, dispatch]);

  const handleView = (story) => {
    dispatch(viewStory(story._id));
    setActiveStory(story);
  };

  const handleClose = () => {
    setActiveStory(null);
    setReplyText("");
  };

  if (loading) return <div>Loading stories...</div>;

  // ✅ FOLLOWING + OWN STORY FILTER
  const followingIds = currentUser?.following?.map((f) =>
    typeof f === "object" ? f._id : f
  );

  const filteredStories = stories.filter(
    (s) =>
      s.user?._id === currentUser?._id || // own story
      followingIds?.includes(s.user?._id) // following users
  );

  return (
    <>
      {/* Stories list */}
      <div className="flex overflow-x-auto space-x-4 p-2 bg-gray-100 rounded">
        {filteredStories.map((s) => (
          <div
            key={s._id}
            className="w-20 h-20 flex-shrink-0 cursor-pointer rounded-full overflow-hidden border-2 border-pink-500 p-[2px]"
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
            <span className="text-xs text-center block mt-1">
              {s.user?.username || "User"}
            </span>
          </div>
        ))}
      </div>

      {/* Story Viewer */}
      {activeStory && (
        <StoryViewer
          key={activeStory._id} // ✅ Force remount for notification open
          story={activeStory}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default Story;