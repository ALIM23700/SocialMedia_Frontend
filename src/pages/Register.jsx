// pages/Register.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/Auth/Authslice';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser({ username, email, password }));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-0 md:px-4">
      {/* Card: Mobile-e border-radius kom ar full width, Desktop-e max-w-md ar rounded */}
      <div className="bg-white w-full max-w-md min-h-screen md:min-h-fit md:rounded-3xl shadow-none md:shadow-2xl p-6 md:p-10 flex flex-col justify-center transition-all">
        
        {/* Logo/Brand Name for Mobile */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-indigo-600 mb-2">SocialPust</h2>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Create Account
          </h1>
          <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">Start your journey</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-6 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Input Group */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm md:text-base"
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm md:text-base"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm md:text-base"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-indigo-600 text-white p-4 rounded-2xl font-bold hover:bg-indigo-700 active:scale-[0.97] transition-all shadow-lg shadow-indigo-100 disabled:opacity-70"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;