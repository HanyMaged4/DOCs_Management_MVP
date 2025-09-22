import React from 'react';
import SearchBar from './SearchBar/SearchBar';
import './Header.css';

const Header: React.FC = () => {
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
        {/* You can use a profile picture or a generic user icon */}
        <span className="profile-pic">👤</span>
      </div>
    </header>
  );
};

export default Header;