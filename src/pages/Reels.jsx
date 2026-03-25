import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReels,
  likeReel,
  commentReel,
  createReel,
  viewReel,
} from "../features/reels/reelSlice";

const Reels = () => {
  const dispatch = useDispatch();
  const { reels, loading } = useSelector((state) => state.reel);

  const [open, setOpen] = useState(false);
  const [video, setVideo] = useState(null);
  const [caption, setCaption] = useState("");
  const [selectedReel, setSelectedReel] = useState(null);
  const [commentText, setCommentText] = useState("");

  const containerRef = useRef(null);

  useEffect(() => {
    dispatch(fetchReels());
  }, [dispatch]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!video) return;
    const formData = new FormData();
    formData.append("media", video);
    formData.append("caption", caption);
    
    await dispatch(createReel(formData));
    dispatch(fetchReels()); 
    
    setVideo(null);
    setCaption("");
    setOpen(false);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedReel) return;
    dispatch(commentReel({ id: selectedReel._id, text: commentText }));
    setCommentText("");
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-gray-400">Loading reels...</div>;

  return (
    <div
      ref={containerRef}
      className="h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory bg-black md:bg-gray-100"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* CREATE BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="fixed z-50 md:left-80 md:top-3 right-4 top-3 bg-white text-black text-2xl w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform"
      >
        +
      </button>

      {/* REELS CARDS */}
      {reels.map((reel) => (
        <div 
          key={reel._id} 
          className="h-[100dvh] w-full snap-start flex flex-col justify-start items-center"
        >
          {/* Card Container: Height set back to 90vh like before, but Top-aligned */}
          <div className="bg-white md:rounded-xl shadow-2xl overflow-hidden w-full max-w-md border border-gray-200 h-full max-h-[90vh] md:max-h-[850px] grid grid-rows-[auto_1fr_auto]">
            
            {/* 1. Header */}
            <div className="flex items-center gap-3 p-3 shrink-0 border-b bg-white z-10">
              <img src={reel.user?.profileImage || "/default-profile.png"} className="w-8 h-8 rounded-full object-cover border" alt="u" />
              <span className="font-bold text-sm text-gray-800">{reel.user?.username || "Unknown"}</span>
            </div>

            {/* 2. Video Section */}
            <div className="bg-black flex items-center justify-center relative overflow-hidden h-full">
              {reel.videoUrl && (
                <video
                  src={reel.videoUrl}
                  controls
                  loop
                  className="w-full h-full object-contain"
                  onPlay={() => dispatch(viewReel(reel._id))}
                />
              )}
            </div>

            {/* 3. Footer Section (Actions) */}
            <div className="shrink-0 bg-white flex flex-col border-t">
              <div className="px-4 py-3 pb-6 md:pb-4"> {/* Added extra bottom padding for mobile safety */}
                {reel.caption && <p className="text-xs md:text-sm text-gray-700 font-medium line-clamp-1 mb-2">{reel.caption}</p>}
                
                <div className="flex items-center gap-8">
                  <button
                    onClick={() => dispatch(likeReel(reel._id))}
                    className="text-red-500 flex items-center gap-1.5 active:scale-125 transition-transform"
                  >
                    <span className="text-xl">❤️</span>
                    <span className="text-xs font-bold text-gray-600">{reel.likes?.length || 0}</span>
                  </button>
                  <button 
                    onClick={() => setSelectedReel(reel)}
                    className="text-blue-500 flex items-center gap-1.5 active:scale-110 transition-transform"
                  >
                    <span className="text-xl">💬</span>
                    <span className="text-xs font-bold text-gray-600">{reel.comments?.length || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* COMMENT MODAL */}
      {selectedReel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl h-[450px] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold">Comments</h3>
              <button onClick={() => setSelectedReel(null)} className="text-red-500 font-bold">Close</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedReel.comments?.map((c, i) => (
                <div key={i} className="text-xs bg-gray-50 p-2 rounded-lg">
                  <span className="font-bold mr-2">{c.user?.username}:</span>
                  <span className="text-gray-700">{c.text}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleCommentSubmit} className="p-3 border-t bg-gray-50">
              <div className="flex gap-2">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Type comment..."
                  className="flex-1 border p-2 rounded-xl text-xs outline-none"
                />
                <button className="bg-blue-600 text-white px-4 rounded-xl text-xs font-bold">Post</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[110] p-4">
          <div className="bg-white p-6 rounded-2xl flex flex-col gap-3 w-full max-w-sm">
            <h2 className="text-lg font-bold">Create Reel</h2>
            <form onSubmit={handleUpload} className="flex flex-col gap-3">
              <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} required className="text-xs border p-2 rounded-lg" />
              <input type="text" placeholder="Caption..." value={caption} onChange={(e) => setCaption(e.target.value)} className="border p-2 rounded-xl text-sm" />
              <button className="bg-blue-600 text-white py-2 rounded-xl font-bold">Upload</button>
            </form>
            <button onClick={() => setOpen(false)} className="text-red-500 text-sm mt-1">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reels;