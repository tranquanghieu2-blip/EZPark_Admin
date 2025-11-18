import React from 'react';
import { FaBars, FaBell, FaUserCircle } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ onMenuClick, user }) => {
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

        <div className="navbar-user">
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
