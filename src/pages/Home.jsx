import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/Auth/Authslice';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // go to login after logout
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Home</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
