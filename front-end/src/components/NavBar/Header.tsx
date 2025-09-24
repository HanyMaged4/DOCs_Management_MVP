import React from 'react';
import SearchBar from './SearchBar/SearchBar';
import './Header.css';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
    const { logout } = useAuth();
  
  return (
    <header className="docs-header">
      <div className="left-section">
        <span className="menu-icon">☰</span>
        <div className="docs-logo">
          {/* You can replace this with an actual image or SVG icon */}
          <span style={{ fontSize: '2rem' }}>📄</span>
          Docs
        </div>
      </div>
      <div className="center-section">
        <SearchBar />
      </div>
      <div className="right-section">
        {/* on click logout */}
        <span className="profile-pic" onClick={logout}>👤</span>
      </div>
    </header>
  );
};

export default Header;