import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:1234/users/login', {
        username,
        password,
      });
      console.log(response.data);

      // Handle successful login here
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);

      // Redirect or update state
    } catch (error) {
      // Error handling remains the same
      console.error('Login error:', error);
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: '0 auto', padding: '50px 0' }}>
      <Typography.Title level={2} style={{ textAlign: 'center' }}>
        Sign In
      </Typography.Title>
      <Form onFinish={handleSubmit} style={{ marginTop: 16 }}>
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default LoginPage;
