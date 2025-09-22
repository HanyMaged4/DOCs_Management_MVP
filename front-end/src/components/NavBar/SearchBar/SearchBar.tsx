import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import './searchBar.css';

const SearchBar: React.FC = () => {
  // Use a type annotation for the state variable
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Explicitly type the event object for the input change
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  // Explicitly type the event object for the form submission
  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log('Searching for:', searchTerm);
    // Add your search logic here

    
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button type="submit" className="search-button">
          <span role="img" aria-label="search">🔍</span>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;