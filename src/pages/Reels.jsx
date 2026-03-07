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
  const [replyText, setReplyText] = useState({});

  const containerRef = useRef(null);

  useEffect(() => {
    dispatch(fetchReels());
  }, [dispatch]);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!video) return;

    const formData = new FormData();
    formData.append("media", video);
    formData.append("caption", caption);

    dispatch(createReel(formData));
    setVideo(null);
    setCaption("");
    setOpen(false);
  };

  const handleReply = (id) => {
    if (!replyText[id]?.trim()) return;
    dispatch(commentReel({ id, text: replyText[id] }));
    setReplyText({ ...replyText, [id]: "" });
  };

  if (loading) return <div>Loading reels...</div>;

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* CREATE BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="absolute left-80 top-5 bg-white text-black text-2xl w-12 h-12 rounded-full shadow-md flex items-center justify-center z-50"
      >
        +
      </button>

      {/* CREATE MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[350px] flex flex-col gap-3">
            <h2 className="text-lg font-bold">Create Reel</h2>
            <form onSubmit={handleUpload} className="flex flex-col gap-2">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files[0])}
                required
              />
              <input
                type="text"
                placeholder="Caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="border p-2 rounded"
              />
              <button className="bg-blue-500 text-white py-2 rounded">Upload</button>
            </form>
            <button
              onClick={() => setOpen(false)}
              className="text-red-500 mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* REELS CARDS */}
      {reels.map((reel) => (
        <div
          key={reel._id}
          className="h-screen w-full snap-start flex flex-col justify-center items-center bg-gray-100 p-4"
        >
          <div className="bg-white rounded-lg shadow-md w-full max-w-md overflow-hidden flex flex-col">
            {/* User info */}
            <div className="flex items-center gap-3 p-3">
              <img
                src={reel.user?.profileImage || "/default-profile.png"}
                alt={reel.user?.username || "User"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-semibold">{reel.user?.username || "Unknown"}</span>
            </div>

            {/* Video */}
            {reel.videoUrl && (
              <video
                src={reel.videoUrl}
                controls
                className="w-full max-h-[500px] object-cover"
                onPlay={() => dispatch(viewReel(reel._id))}
              />
            )}

            {/* Caption */}
            {reel.caption && <p className="p-3">{reel.caption}</p>}

            {/* Actions */}
            <div className="flex items-center justify-between px-3 py-2">
              <button
                onClick={() => dispatch(likeReel(reel._id))}
                className="text-red-500 font-semibold"
              >
                ❤️ {reel.likes?.length || 0}
              </button>
              <button className="text-blue-500 font-semibold">
                💬 {reel.comments?.length || 0}
              </button>
            </div>

            {/* Comments */}
            <div className="px-3 py-2 max-h-32 overflow-y-auto">
              {reel.comments && reel.comments.length > 0 ? (
                reel.comments.map((c, i) => (
                  <p key={i}>
                    <span className="font-semibold">{c.user?.username || "Unknown"}:</span>{" "}
                    {c.text}
                  </p>
                ))
              ) : (
                <p className="text-gray-400">No comments yet</p>
              )}

              {/* Reply Input */}
              <div className="flex gap-2 mt-2">
                <input
                  value={replyText[reel._id] || ""}
                  onChange={(e) =>
                    setReplyText({ ...replyText, [reel._id]: e.target.value })
                  }
                  placeholder="Add a comment..."
                  className="flex-1 px-2 py-1 border rounded"
                />
                <button
                  onClick={() => handleReply(reel._id)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reels;