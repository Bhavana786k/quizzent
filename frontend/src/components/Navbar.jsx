import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, PlusCircle, Search, HelpCircle, History, LayoutDashboard, User } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand-logo">
          ⚡ Quizzent <span className="brand-badge">Platform</span>
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/search" className={`nav-link ${isActive('/search') ? 'active' : ''}`}>
              <Search size={18} /> Explore
            </Link>
          </li>
          <li>
            <Link to="/help" className={`nav-link ${isActive('/help') ? 'active' : ''}`}>
              <HelpCircle size={18} /> Documentation
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link to="/create-quiz" className={`nav-link ${isActive('/create-quiz') ? 'active' : ''}`}>
                  <PlusCircle size={18} /> Create Quiz
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                  <LayoutDashboard size={18} /> My Quizzes
                </Link>
              </li>
              <li>
                <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>
                  <History size={18} /> History
                </Link>
              </li>
              <li>
                <span className="nav-link" style={{ cursor: 'default', color: 'var(--primary)', fontWeight: 600 }}>
                  <User size={18} /> {user?.fullName}
                </span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  <LogOut size={16} /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};
