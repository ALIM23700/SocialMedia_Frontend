// pages/Alluser.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleFollow } from "../features/Auth/Authslice";
import SideBar from "../Components/SideBar"; // Sidebar add kora holo layout thik rakhte

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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar logic */}
      <SideBar />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 pb-20 md:pb-0">
        
        {/* Mobile Header (SocialPust Logo) */}
        <div className="md:hidden w-full bg-black text-white px-4 py-3 flex justify-center items-center sticky top-0 z-50">
          <span className="text-xl font-bold italic text-purple-500">SocialPust</span>
        </div>

        <div className="p-4 md:p-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6">
            <h2 className="font-bold text-xl md:text-2xl mb-6 text-gray-800 border-b pb-4">
              Suggested for you
            </h2>
            
            <div className="space-y-4">
              {suggestedUsers.length > 0 ? (
                suggestedUsers.map((u) => (
                  <div key={u._id} className="flex items-center justify-between group p-2 hover:bg-gray-50 rounded-lg transition-all">
                    <div className="flex items-center gap-3 md:gap-4">
                      {u.profileImage ? (
                        <img
                          src={u.profileImage}
                          alt={u.username}
                          className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg border border-purple-200">
                          {u.username[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-gray-900 block hover:underline cursor-pointer">
                          {u.username}
                        </span>
                        <span className="text-xs text-gray-500">Suggested for you</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleFollow(u._id)}
                      className="px-5 py-1.5 md:px-6 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm transition-colors shadow-sm"
                    >
                      Follow
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 italic">No new suggestions for you right now.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alluser;