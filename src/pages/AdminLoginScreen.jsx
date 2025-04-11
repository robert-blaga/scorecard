import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { adminSignIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminSignIn({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Authenticate with your email and password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-deep-purple focus:border-deep-purple"
              placeholder="email@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-deep-purple focus:border-deep-purple"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-deep-purple text-white rounded-lg px-4 py-3 
              hover:bg-deep-purple-600 transition-all
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Authenticating...' : 'Authenticate'}
          </button>
        </form>
      </div>
    </div>
  );
} 