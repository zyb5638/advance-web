import React, { useState } from 'react';
import { Input } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import './SearchBar.css'; // This assumes you have a CSS file for the SearchBar styles

const { Search } = Input;

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = value => {
    onSearch(value);
  };

  return (
    <Search
      placeholder="input search text"
      enterButton="Search"
      size="large"
      suffix={<AudioOutlined />}
      onSearch={handleSearch}
      value={searchTerm}
      
      onChange={(e) => setSearchTerm(e.target.value)}
      className="search-bar" // Added a class for styling
    />
  );
};

export default SearchBar;
