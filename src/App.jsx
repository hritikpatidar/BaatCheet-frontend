import { SocketProvider } from './context/SocketContext';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChatApp from './container/Chat/ChatApp';
import { PublicRoute } from './PublicRoute';
import { PrivateRoute } from './PrivateRoute';
import NotFound from './components/NotFound';
import LoginPage from './container/AuthPages/LoginPage';
import { SignupForm } from './container/AuthPages/SignupForm';

export default function App() { 
  return (
    <Router>
      <SocketProvider>
        <Routes>
          <Route element={<PublicRoute />}>
             <Route path="/login" element={<LoginPage />} />
              <Route path="/sign-up" element={<SignupForm />} /> 
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<ChatApp />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SocketProvider>
    </Router>
  );
}