// pages/Alluser.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleFollow } from "../features/Auth/Authslice";

const Alluser = () => {
  const dispatch = useDispatch();
  const { user: currentUser, allUsers } = useSelector((state) => state.auth);

  const handleFollow = (userId) => {
    dispatch(toggleFollow(userId));
  };

  const suggestedUsers = allUsers.filter(
    (u) =>
      u._id !== currentUser?._id &&
      !currentUser?.following?.includes(u._id)
  );

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="font-semibold text-xl mb-4">People You May Know</h2>
      {suggestedUsers.length > 0 ? (
        suggestedUsers.map((u) => (
          <div key={u._id} className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {u.profileImage ? (
                <img
                  src={u.profileImage}
                  alt={u.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold">
                  {u.username[0].toUpperCase()}
                </div>
              )}
              <span className="font-medium">{u.username}</span>
            </div>
            <button
              onClick={() => handleFollow(u._id)}
              className="px-3 py-1 rounded bg-blue-500 text-white"
            >
              Follow
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No suggestions available</p>
      )}
    </div>
  );
};

export default Alluser;