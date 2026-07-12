import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../store/authStore';
import { Leaf, Lock, Mail, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 text-center">
        <h3 className="text-lg font-semibold" style={{ color: '#2F2F2F' }}>Welcome Back</h3>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Sign in to your enterprise account.</p>
      </div>

      {localError && (
        <div
          className="mb-4 p-3 rounded-xl flex items-start border"
          style={{ background: '#E96A6A11', borderColor: '#E96A6A33' }}
        >
          <AlertCircle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" style={{ color: '#E96A6A' }} />
          <p className="text-sm" style={{ color: '#E96A6A' }}>{localError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2F2F2F' }} htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5" style={{ color: '#836A78' }} />
            </div>
            <input
              id="email"
              type="email"
              className="input-field pl-10"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2F2F2F' }} htmlFor="password">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5" style={{ color: '#836A78' }} />
            </div>
            <input
              id="password"
              type="password"
              className="input-field pl-10"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full btn-primary flex justify-center items-center py-3 mt-2"
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : null}
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
