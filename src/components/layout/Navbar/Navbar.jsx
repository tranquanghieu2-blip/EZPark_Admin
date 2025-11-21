import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaBell, FaUserCircle } from 'react-icons/fa';
import { ROUTES } from '../../../constants';
import './Navbar.css';

const Navbar = ({ onMenuClick, user }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={onMenuClick}>
          <FaBars />
        </button>
        <h1 className="navbar-title">Quản lý bãi đỗ xe - Đà Nẵng</h1>
      </div>

      <div className="navbar-right">
        <button className="navbar-icon-btn">
          <FaBell />
          <span className="notification-badge">3</span>
        </button>

        <div 
          className="navbar-user"
          onClick={() => navigate(ROUTES.PROFILE)}
          style={{ cursor: 'pointer' }}
        >
          <FaUserCircle className="user-avatar" />
          <div className="user-info">
            <span className="user-name">{user?.name || 'Admin'}</span>
            <span className="user-role">{user?.role || 'Administrator'}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
