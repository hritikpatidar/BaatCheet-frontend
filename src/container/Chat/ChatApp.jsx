import { useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatArea from './ChatArea';


const ChatApp = () => {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="flex h-screen font-sans bg-gray-100 ">
      <>
        <ChatSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      </>
      <ChatArea showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
    </div >
  );
};

export default ChatApp;

