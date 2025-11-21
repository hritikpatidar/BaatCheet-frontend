import { SocketProvider } from './context/SocketContext';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChatApp from './container/Chat/ChatApp';
import { PublicRoute } from './PublicRoute';
import { PrivateRoute } from './PrivateRoute';
import NotFound from './components/NotFound';
import LoginPage from './container/AuthPages/LoginPage';
import { SignupForm } from './container/AuthPages/SignupForm';
import DashboardPage from './container/Dashboard/Dashboard';
import AIChatApp from './container/AiChat/AIChatApp';
import Profile from './container/Dashboard/profile';
// import { generateToken, messaging } from "./firebase";
// import { onMessage } from "firebase/messaging";
// import { useEffect } from 'react';

export default function App() {

  // useEffect(() => {
  //   generateToken();
  //   onMessage(messaging, (payload) => {
  //     console.log("payload", payload);
  //   });
  // }, []);

  return (
    <Router>
      <SocketProvider>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign-up" element={<SignupForm />} />

          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<ChatApp />} />
            <Route path="/ai-chat" element={<AIChatApp />} />
            {/* <Route path="/ai-chat" element={<AIChatPage />} /> */}
            {/* <Route path="/list" element={<ListPage />} /> */}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SocketProvider>
    </Router>
  );
}