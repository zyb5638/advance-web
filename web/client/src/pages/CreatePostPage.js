import React, { useState, useRef, useEffect } from 'react';
import { Layout, Form, Input, Button, Typography, Upload, message } from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { UploadOutlined } from '@ant-design/icons';
import './CreatePostPage.css'; // Assume you have a CSS file for additional styling
import { stateToHTML } from 'draft-js-export-html';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { convertFromRaw } from 'draft-js';
const { Content } = Layout;
const { Title } = Typography;

function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [selectedFile, setSelectedFile] = useState(null);
  const isMounted = useRef(true);
  const navigate = useNavigate(); 
  useEffect(() => () => (isMounted.current = false), []);

  const handleSubmit = async () => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
  // Stringify the raw content state to prepare it for HTTP submission
  const content = JSON.stringify(rawContentState);

    console.log("Title:", title);
    console.log("Content:", content);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      const response = await fetch('http://localhost:1234/post', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      navigate('/'); 
      if (isMounted.current) {
        console.log(result);
        navigate('/'); 
        message.success('Post created successfully');
      }
    } catch (error) {
      if (isMounted.current) {
        console.error('Error creating post:', error);
        message.error('Error creating post');
      }
    }
  };

  const handleFileChange = ({ file }) => {
    if (file.status === 'done') {
      setSelectedFile(file.originFileObj);
      message.success(`${file.name} file uploaded successfully`);
    } else if (file.status === 'error') {
      message.error(`${file.name} file upload failed.`);
    }
  };

  return (
    <Layout className="create-post-layout">
      <Content style={{ padding: '2rem' }}>
        <Form layout="vertical" onFinish={handleSubmit} className="create-post-form">
          <Title level={2} className="create-post-title">Create a New Post</Title>
          <Form.Item label="Title" className="post-title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter your post title here" />
          </Form.Item>
          <Form.Item label="Content" className="post-content">
            <div className="editor-container">
              <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
                wrapperClassName="wrapper-class"
                editorClassName="editor-class"
                toolbarClassName="toolbar-class"
              />
            </div>
          </Form.Item>
          <Form.Item label="Upload Image" className="upload-image">
            <Upload name="image" onChange={handleFileChange} action="/upload.do" listType="picture">
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
          <Button type="primary" htmlType="submit" className="submit-post-button">Submit Post</Button>
        </Form>
      </Content>
    </Layout>
  );
}

export default CreatePostPage;
