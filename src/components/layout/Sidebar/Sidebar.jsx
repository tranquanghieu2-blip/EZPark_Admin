import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout } from '../../../services/authService';
import { ROUTES } from '../../../constants';
import './Sidebar.css';
import { 
  FaTachometerAlt, 
  FaParking, 
  FaBan, 
  FaComments, 
  FaUsers,
  FaSignOutAlt 
} from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      await logout();
      toast.success('Đăng xuất thành công!');
      navigate(ROUTES.LOGIN);
    }
  };
  const menuItems = [
    {
      path: ROUTES.DASHBOARD,
      icon: <FaTachometerAlt />,
      label: 'Dashboard',
    },
    {
      path: ROUTES.PARKING_LIST,
      icon: <FaParking />,
      label: 'Bãi đỗ xe',
    },
    {
      path: ROUTES.RESTRICTED_LIST,
      icon: <FaBan />,
      label: 'Tuyến cấm',
    },
    {
      path: ROUTES.FEEDBACK_LIST,
      icon: <FaComments />,
      label: 'Feedback',
    },
    {
      path: ROUTES.USER_LIST,
      icon: <FaUsers />,
      label: 'Người dùng',
    },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">EZ</div>
            <div className="logo-text">
              <h2>EZPark</h2>
              <span>Admin Dashboard</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => 
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
