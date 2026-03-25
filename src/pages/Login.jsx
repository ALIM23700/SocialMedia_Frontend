// pages/Login.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/Auth/Authslice';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      const loggedInUser = result.payload.user;
      const isProfileComplete = loggedInUser.bio && loggedInUser.profileImage;

      if (!isProfileComplete) {
        navigate('/update'); 
      } else {
        navigate('/'); 
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-0 md:px-4">
      {/* Container: Mobile-e full screen white, Desktop-e max-w-md card */}
      <div className="bg-white w-full max-w-md min-h-screen md:min-h-fit md:rounded-3xl shadow-none md:shadow-2xl p-6 md:p-10 flex flex-col justify-center transition-all">
        
        {/* Logo & Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-indigo-600 mb-2 tracking-tight">SocialPust</h2>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">Log in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl mb-6 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm md:text-base transition-all"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm md:text-base transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-indigo-600 text-white p-4 rounded-2xl font-bold hover:bg-indigo-700 active:scale-[0.97] transition-all shadow-lg shadow-indigo-100 disabled:opacity-70"
            disabled={loading}
          >
            {loading ? (
               <span className="flex items-center justify-center gap-2">
                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                 Logging in...
               </span>
            ) : 'Login'}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-bold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;