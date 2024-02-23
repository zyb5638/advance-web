import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Input, Button, Card, Space } from 'antd';
import { SendOutlined, EditOutlined, SaveOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text, Title } = Typography;

const CommentSection = ({ postId, token }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const refreshComments = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:1234/post/${postId}/comments`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        // Enhance each comment with voteCount property
        const formattedComments = data.map(comment => ({
          ...comment,
          isEditing: false,
          editedContent: comment.content,
          voteCount: calculateVoteCount(comment.votes) // Calculate vote count here
        }));
        setComments(formattedComments);
      } else {
        console.error('Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [postId, token]);

  // Function to calculate total votes
  const calculateVoteCount = (votes) => {
    return votes.reduce((total, vote) => total + vote.value, 0);
  };

  useEffect(() => {
    refreshComments();
  }, [refreshComments]);

  const handleVote = async (commentId, vote) => {
    try {
      await fetch(`http://localhost:1234/post/comments/${commentId}/${vote}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      refreshComments();
    } catch (error) {
      console.error(`Error ${vote} comment:`, error);
    }
  };


  const handleCommentSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:1234/post/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment })
      });

      if (response.ok) {
        setNewComment('');
        refreshComments(); // Refresh comments after successfully adding a new one
      } else {
        console.error('Failed to submit comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const toggleEdit = (commentId) => {
    setComments(
      comments.map(comment =>
        comment._id === commentId
          ? { ...comment, isEditing: !comment.isEditing }
          : comment
      )
    );
  };

  const handleEditChange = (commentId, content) => {
    setComments(
      comments.map(comment =>
        comment._id === commentId
          ? { ...comment, editedContent: content }
          : comment
      )
    );
  };

  const handleSaveEdit = async (commentId) => {
    const editedComment = comments.find(comment => comment._id === commentId);
    try {
      const response = await fetch(`http://localhost:1234/post/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editedComment.editedContent })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedComment = await response.json();
      setComments(
        comments.map(comment =>
          comment._id === commentId
            ? { ...comment, ...updatedComment, isEditing: false }
            : comment
        )
      );
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  return (
    <div>
      <Title level={4}>Comments:</Title>
      {comments.map(comment => (
        <Card
          key={comment._id}
          style={{ marginBottom: 16 }}
          actions={[
            <Button icon={<LikeOutlined />} onClick={() => handleVote(comment._id, 'upvote')}>Upvote</Button>,
            <Button icon={<DislikeOutlined />} onClick={() => handleVote(comment._id, 'downvote')}>Downvote</Button>,
            <Typography.Text>{comment.voteCount || 0}</Typography.Text>, // Display the vote count here
            comment.isEditing ? 
              <Button icon={<SaveOutlined />} onClick={() => handleSaveEdit(comment._id)}>Save</Button> :
              <Button icon={<EditOutlined />} onClick={() => toggleEdit(comment._id)}>Edit</Button>
          ]}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {comment.isEditing ? (
              <TextArea
                value={comment.editedContent}
                onChange={e => handleEditChange(comment._id, e.target.value)}
                autoSize={{ minRows: 2, maxRows: 6 }}
              />
            ) : (
              <Text>
                {comment.author ? `${comment.author.username}: ${comment.content}` : `Unknown user: ${comment.content}`}
              </Text>
            )}
          </Space>
        </Card>
      ))}
      <TextArea
        value={newComment}
        onChange={e => setNewComment(e.target.value)}
        placeholder="Write a comment..."
        autoSize={{ minRows: 3 }}
        style={{ marginBottom: 16 }}
      />
      <Button icon={<SendOutlined />} onClick={handleCommentSubmit} type="primary">
        Post Comment
      </Button>
    </div>
  );
};

export default CommentSection;