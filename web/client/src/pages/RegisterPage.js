import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Typography } from 'antd';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');

  const handleSubmit = async (values) => {
    try {
      // Send the username, email, password, and adminCode to your backend
      const response = await axios.post('http://localhost:1234/users/register', {
        username: values.username,
        email: values.email,
        password: values.password,
        adminCode: values.adminCode, // Assuming your backend handles this
      });
      console.log(response.data); // Handle the response from the server here
    } catch (error) {
      console.error('Registration failed:', error.response.data); // Error handling
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: 'auto', paddingTop: '50px' }}>
      <Typography.Title level={2} style={{ textAlign: 'center', color: 'blue' }}>
        Create Account
      </Typography.Title>
      <Form onFinish={handleSubmit}>
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input
            placeholder="Username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input
            placeholder="Email Address"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            placeholder="Password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="adminCode"
        >
          <Input
            placeholder="Admin Code (Optional)"
            autoComplete="off"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: 'blue' }}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default RegisterPage;
