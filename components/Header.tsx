import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../App';
import Button from './Button';

const Header: React.FC = () => {
  const { user, logout, loading } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold text-indigo-600 mb-4 sm:mb-0">
          ScholarSearch
        </NavLink>

        <nav className="flex flex-grow justify-center sm:justify-start space-x-4 mb-4 sm:mb-0">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-gray-700 hover:text-indigo-600 font-medium ${isActive ? 'text-indigo-600 border-b-2 border-indigo-600' : ''}`
            }
          >
            Search
          </NavLink>
          {user && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-gray-700 hover:text-indigo-600 font-medium ${isActive ? 'text-indigo-600 border-b-2 border-indigo-600' : ''}`
              }
            >
              Dashboard
            </NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-gray-700 hover:text-indigo-600 font-medium ${isActive ? 'text-indigo-600 border-b-2 border-indigo-600' : ''}`
              }
            >
              Admin
            </NavLink>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-700 text-sm md:text-base hidden sm:block">Welcome, {user.email}!</span>
              <Button onClick={handleLogout} variant="outline" size="sm" loading={loading}>
                Logout
              </Button>
            </>
          ) : (
            <NavLink to="/auth">
              <Button variant="primary" size="sm" loading={loading}>
                Login / Signup
              </Button>
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
