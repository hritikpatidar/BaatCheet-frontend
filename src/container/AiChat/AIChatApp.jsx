import { useState } from 'react';
import AIChatSidebar from './AIChatSidebar';
import AIChatArea from './AiChatArea';


const AIChatApp = () => {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="flex h-screen font-sans bg-gray-100 ">
      <>
        <AIChatSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      </>
      <AIChatArea showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
    </div >
  );
};

export default AIChatApp;

