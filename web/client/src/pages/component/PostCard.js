import React, { useState } from 'react';
import { Card, Typography, Button, Input, Space } from 'antd';
import { EditOutlined, SaveOutlined, DeleteOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';
import CommentSection from './CommentSection';
import axios from 'axios';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

const API_BASE_URL = 'http://localhost:1234';

export const PostCard = ({
  post,
  handlePostUpdate,
  handlePostDelete,
  currentUser,
  isAdmin,
  refreshPosts,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);

  const updatePostAndExitEditMode = async () => {
    await handlePostUpdate(post._id, editedTitle, editedContent);
    setEditMode(false);
   // Exit edit mode right after updating
  };
  const convertContentToHTML = (content) => {
    try {
      const rawContent = JSON.parse(content);
      const contentState = convertFromRaw(rawContent);
      return stateToHTML(contentState);
    } catch (e) {
      
      return ''; // Fallback to empty string if parsing fails
    }
  };
  const calculateVoteCount = () => {
    return (post.votes || []).reduce((total, vote) => total + vote.value, 0);
  };

  const handleVote = async (voteType) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_BASE_URL}/post/${post._id}/${voteType}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshPosts();
    } catch (error) {
      console.error(`Error ${voteType} post:`, error);
    }
  };

  let actions = [
    <Button icon={<UpOutlined />} onClick={() => handleVote('upvote')}>Upvote</Button>,
    <Typography.Text>{calculateVoteCount()}</Typography.Text>,
    <Button icon={<DownOutlined />} onClick={() => handleVote('downvote')}>Downvote</Button>,
  ];

  if (editMode) {
    actions.push(
      <Button icon={<SaveOutlined />} onClick={updatePostAndExitEditMode}>Save</Button>
    );
  } else if (currentUser === post.author.username || isAdmin) {
    actions.push(
      <Button icon={<EditOutlined />} onClick={() => setEditMode(true)}>Edit</Button>,
      <Button icon={<DeleteOutlined />} onClick={() => handlePostDelete(post._id)} danger>Delete</Button>
    );
  }

  return (
    <Card hoverable style={{ marginBottom: 16 }} actions={actions}>
      {editMode ? (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} placeholder="Title" />
          <Input.TextArea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} rows={4} placeholder="Content" />
        </Space>
      ) : (
        <>
          <Typography.Title level={4}>{post.title}</Typography.Title>
          <Typography.Paragraph>
  <div dangerouslySetInnerHTML={{ __html: convertContentToHTML(post.content) }} />
</Typography.Paragraph>
          <Typography.Text type="secondary">
            {`Posted by ${post.author.username} on ${new Date(post.createdAt).toLocaleDateString()}`}
          </Typography.Text>
          <CommentSection postId={post._id} token={localStorage.getItem('token')} />
        </>
      )}
    </Card>
  );
};
