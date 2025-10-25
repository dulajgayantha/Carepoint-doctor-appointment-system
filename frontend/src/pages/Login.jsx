import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [mode, setMode] = useState('Sign Up'); // 'Sign Up' or 'Login'
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Reset form fields
  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
  };

  useEffect(() => {
    resetForm();
  }, [mode]);

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;

      if (mode === 'Sign Up') {
        response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
      } else {
        response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
      }

      const data = response.data;

      if (data.success) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        toast.success(mode === 'Sign Up' ? 'Account created successfully!' : 'Login successful!');
      } else {
        toast.error(data.message || 'Authentication failed.');
      }
    } catch (error) {
      console.error('Auth error:', error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('Something went wrong. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg min-w-[340px] sm:min-w-[400px] flex flex-col gap-4 text-zinc-700"
      >
        <h2 className="text-2xl font-semibold">
          {mode === 'Sign Up' ? 'Create an Account' : 'Login'}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Please {mode === 'Sign Up' ? 'sign up' : 'log in'} to continue
        </p>

        {mode === 'Sign Up' && (
          <div className="flex flex-col mb-2">
            <label className="mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border border-zinc-300 rounded p-2 focus:outline-none focus:border-primary"
            />
          </div>
        )}

        <div className="flex flex-col mb-2">
          <label className="mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-zinc-300 rounded p-2 focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col mb-4">
          <label className="mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-zinc-300 rounded p-2 focus:outline-none focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 rounded-md text-white bg-primary ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'
          }`}
        >
          {isLoading ? 'Loading...' : mode === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>

        <p className="text-center text-sm text-gray-500 mt-3">
          {mode === 'Sign Up' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            onClick={() => setMode(mode === 'Sign Up' ? 'Login' : 'Sign Up')}
            className="text-primary cursor-pointer font-medium hover:underline"
          >
            {mode === 'Sign Up' ? 'Login' : 'Sign Up'}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
