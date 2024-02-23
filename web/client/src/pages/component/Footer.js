import React from 'react';
import { Layout, Typography } from 'antd';

const { Footer } = Layout;
const { Text } = Typography;

export const MyFooter = () => {
  return (
    <Footer style={{ padding: '24px', marginTop: 'auto', backgroundColor: '#f0f2f5' }}>
      <Text>My footer content here.</Text>
    </Footer>
  );
};
