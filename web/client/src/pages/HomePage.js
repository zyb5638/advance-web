import React, { useState, useEffect } from 'react';
import { PostCard } from './component/PostCard';
import { Box, Grid } from '@mui/material';

function HomePage({ searchResults, isSearching }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);


  const currentUser = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Assuming 'isAdmin' is stored as a string
  const [forceUpdate, setForceUpdate] = useState(0);

// Call this function to force a re-render
const forceRefresh = () => {
  setForceUpdate(prev => prev + 1);
};
  const refreshPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:1234/post?page=${page}&limit=10`);
      const data = await response.json();

      if (data.posts && Array.isArray(data.posts)) {
        setPosts(data.posts); // Directly set posts to fetched data
        setHasMore(data.currentPage < data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:1234/post?page=${page}&limit=10`);
        const data = await response.json();
        if (data.posts && data.posts.length > 0) {
          setPosts(prevPosts => [...prevPosts, ...data.posts]);
          setHasMore(data.currentPage < data.totalPages);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchPosts();
  }, [page]); 
  useEffect(() => {
    if (!isSearching) {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:1234/post?page=${page}&limit=10`);
        const data = await response.json();

        if (data.posts && Array.isArray(data.posts)) {
          const newUniquePosts = data.posts.filter(newPost => 
            !posts.some(existingPost => existingPost._id === newPost._id)
          );
          setPosts(prevPosts => {
            const combinedPosts = [...prevPosts, ...newUniquePosts];
            const uniquePostSet = new Set(combinedPosts.map(p => p._id));
            return Array.from(uniquePostSet).map(id => combinedPosts.find(p => p._id === id));
          });
          setHasMore(data.currentPage < data.totalPages);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (hasMore) {
      fetchPosts();
    }
  }}, [page, hasMore, posts]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 100 || isLoading) return;
      setPage(prevPage => prevPage + 1);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);
  
  
  const handlePostUpdate = async (postId, newTitle, newContent) => {
    try {
      const response = await fetch(`http://localhost:1234/post/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle, content: newContent })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Update the local post state
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, title: newTitle, content: newContent } : post
      ));
  
      // Force a re-render of the PostCard component
      forceRefresh();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };
  
  
  
  const handlePostDelete = async (postId) => {
    try {
      const response = await fetch(`http://localhost:1234/post/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      await refreshPosts(); // Refresh posts to reflect the deletion
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={8}>
          {(isSearching ? searchResults : posts).map(post => (
            <PostCard 
              key={post._id} 
              post={post} 
              handlePostUpdate={handlePostUpdate} 
              handlePostDelete={handlePostDelete}
              currentUser={currentUser}
              token={token}
              isAdmin={isAdmin} 
              refreshPosts={refreshPosts} 
            />
          ))}
        </Grid>
      </Grid>
    </Box>
  );
  
}

export default HomePage;
