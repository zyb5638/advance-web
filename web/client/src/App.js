import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CreatePostPage from './pages/CreatePostPage';
import { NavigationBar } from './pages/component/NavigationBar';
import { MyFooter } from './pages/component/Footer';
import { Container } from '@mui/material';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [posts, setPosts] = useState([]); // State to hold posts

  // Function to fetch posts from the backend
  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:1234/post'); // Adjust URL as needed
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPosts(data); // Update state with fetched posts
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Fetch posts on initial load
  useEffect(() => {
    fetchPosts();
  }, []);

  
  const handleSearchSubmit = async (searchTerm) => {
    try {
      const response = await fetch(`http://localhost:1234/post/search?query=${searchTerm}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError("Oops, we haven't got JSON!");
      }
      const data = await response.json();
      setSearchResults(data);
      // Do something with the data
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };
  
  return (
    <Router>
      <div className="App">
      <NavigationBar onSearchSubmit={handleSearchSubmit} />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1, backgroundColor: '#f5f5f5' }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<HomePage searchResults={searchResults} isSearching={!!searchTerm} />} />

            <Route path="/createpost" element={<CreatePostPage />} />
          </Routes>
        </Container>
        <MyFooter /> {/* Footer at the bottom of all pages */}
      </div>
    </Router>
  );
}

export default App;
