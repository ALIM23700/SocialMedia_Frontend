// pages/Story.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStories, viewStory } from "../features/story/Storyslice";
import StoryViewer from "./StoryViewer";
import { useParams } from "react-router-dom";

const Story = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); 
  const { stories = [], loading } = useSelector((state) => state.story); // default empty array
  const { user: currentUser } = useSelector((state) => state.auth);

  const [activeStory, setActiveStory] = useState(null);

  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  // Notification theke ID ashle auto-view
  useEffect(() => {
    if (id && stories.length > 0) {
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
  };

  if (loading) return (
    <div className="flex gap-4 p-4">
      {[1, 2, 3].map(i => <div key={i} className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />)}
    </div>
  );

  // --- LOGIC FIX START ---
  // 1. Amader following list theke shudhu ID gulo string akare ber kori
  const followingIds = currentUser?.following?.map((f) => 
    typeof f === "object" ? f._id?.toString() : f?.toString()
  ) || [];

  // 2. Filter stories: Nijer ta OR following list-e thaka user-er ta
  const filteredStories = stories.filter((s) => {
    const storyUserId = s.user?._id?.toString();
    const currentUserId = currentUser?._id?.toString();
    
    return storyUserId === currentUserId || followingIds.includes(storyUserId);
  });
  // --- LOGIC FIX END ---

  return (
    <div className="w-full bg-white">
      <div className="flex overflow-x-auto no-scrollbar space-x-4 p-4">
        {/* Nijer Story / Create Section First */}
        {filteredStories.map((s) => (
          <div key={s._id} className="flex flex-col items-center shrink-0 cursor-pointer" onClick={() => handleView(s)}>
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full p-[2px] 
              ${s.viewers?.includes(currentUser?._id) ? "border-2 border-gray-300" : "border-2 border-pink-500"}`}
            >
              <div className="w-full h-full bg-white rounded-full p-[1px] overflow-hidden">
                {s.mediaType === "image" ? (
                  <img src={s.mediaUrl} className="w-full h-full object-cover rounded-full" alt="s" />
                ) : (
                  <video src={s.mediaUrl} className="w-full h-full object-cover rounded-full" />
                )}
              </div>
            </div>
            <span className="text-[10px] mt-1 truncate max-w-[64px]">
              {s.user?._id === currentUser?._id ? "Your Story" : s.user?.username}
            </span>
          </div>
        ))}

        {/* Jodi list ekdom faka thake (Except common users) */}
        {filteredStories.length === 0 && (
          <p className="text-xs text-gray-400">No stories to show</p>
        )}
      </div>

      {activeStory && (
        <div className="fixed inset-0 z-[1000] bg-black">
          <StoryViewer story={activeStory} onClose={handleClose} />
        </div>
      )}
    </div>
  );
};

export default Story;