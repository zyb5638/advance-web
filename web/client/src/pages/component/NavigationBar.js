import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar'; // Make sure this import path matches your file structure

const { Header } = Layout;

export const NavigationBar = ({ onSearchSubmit }) => {
  return (
    <Layout className="layout">
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 50px' }}>
        <div className="logo" style={{ width: '120px' }}>
          {/* Your logo here */}
        </div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ lineHeight: '64px' }}>
          <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
          <Menu.Item key="2"><Link to="/login">Login</Link></Menu.Item>
          <Menu.Item key="3"><Link to="/register">Register</Link></Menu.Item>
          <Menu.Item key="4"><Link to="/createpost">Create Post</Link></Menu.Item>
          {/* Add more Menu.Items as needed */}
        </Menu>
        <div style={{ lineHeight: '64px' }}>
          <SearchBar onSearch={onSearchSubmit} />
        </div>
      </Header>
    </Layout>
  );
};
