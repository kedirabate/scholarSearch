import React, { useState, useEffect, createContext } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import SearchPage from './components/SearchPage';
import AdminPanel from './components/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import { User, AuthContextType } from './types';
import { authService } from './services/authService';

// Create AuthContext
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  signup: async () => false,
  loginWithGoogle: async () => false,
  logout: () => {},
  loading: true,
});

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Initial loading state for auth

  // Simulate checking for a logged-in user on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    const loggedInUser = await authService.login(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const handleSignup = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    const newUser = await authService.signup(email, password);
    if (newUser) {
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const handleLoginWithGoogle = async (): Promise<boolean> => {
    setLoading(true);
    const googleUser = await authService.loginWithGoogle();
    if (googleUser) {
      setUser(googleUser);
      localStorage.setItem('currentUser', JSON.stringify(googleUser));
      setLoading(false);
      return true;
    }
    setLoading(false); // Ensure loading is set to false even if login fails
    return false;
  };

  const handleLogout = (): void => {
    setLoading(true);
    authService.logout().then(() => {
      setUser(null);
      localStorage.removeItem('currentUser');
      setLoading(false);
    });
  };

  const authContextValue: AuthContextType = {
    user,
    login: handleLogin,
    signup: handleSignup,
    loginWithGoogle: handleLoginWithGoogle,
    logout: handleLogout,
    loading,
  };

  return (
    <Router>
      <AuthContext.Provider value={authContextValue}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthContext.Provider>
    </Router>
  );
};

export default App;