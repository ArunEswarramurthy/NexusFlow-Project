import React from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import WorkingChat from '../components/chat/WorkingChat';

const ChatPage = () => {
  return (
    <AdminLayout>
      <WorkingChat />
    </AdminLayout>
  );
};

export default ChatPage;