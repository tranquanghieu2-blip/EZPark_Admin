import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import { getCurrentUser } from '../../../services/authService';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = getCurrentUser();

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="layout-main">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} user={user} />
        
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
