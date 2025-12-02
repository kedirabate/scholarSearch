import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import Button from './Button';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const { user, login, signup, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/'); // Redirect to home if already logged in
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFormLoading(true);
    let success = false;
    if (isLogin) {
      success = await login(email, password);
    } else {
      success = await signup(email, password);
    }

    if (!success) {
      setError(isLogin ? 'Login failed. Invalid credentials.' : 'Signup failed. User might already exist.');
    }
    setFormLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setFormLoading(true);
    const success = await loginWithGoogle();
    if (!success) {
      setError('Google login failed. Please try again.');
    }
    setFormLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-px"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <div>
            <Button
              type="submit"
              className="w-full"
              loading={formLoading}
              disabled={formLoading}
            >
              {isLogin ? 'Sign in' : 'Sign up'}
            </Button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div>
          <Button
            onClick={handleGoogleLogin}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            loading={formLoading}
            disabled={formLoading}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12.483 10.027v3.085h6.632c-.328 1.956-2.126 3.447-4.542 3.447-3.663 0-6.643-2.981-6.643-6.645S8.36 3.27 12 3.27c2.046 0 3.618.825 4.88 2.041l2.404-2.38c-1.748-1.638-3.951-2.615-7.284-2.615C6.07 0 0 6.046 0 12c0 5.954 6.07 12 12 12c4.864 0 8.878-3.414 8.878-8.774 0-.967-.113-1.897-.318-2.776h-8.155z"
              ></path>
            </svg>
            Google
          </Button>
        </div>

        <div className="text-center text-sm">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            {isLogin ? 'Don\'t have an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
