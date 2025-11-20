import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { clearLocalStorage, getItemLocalStorage, setItemLocalStorage } from './Utils/browserServices.js';
import { Provider } from 'react-redux';
import store from './Redux/app/store.js';
import { Toaster } from 'react-hot-toast';

// Token validation function
const checkTokenValidity = (token) => {
  if (!token) return false;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (payload.exp && payload.exp < currentTime) {
      console.error("Token has expired");
      return false;
    }
    return true;
  } catch (error) {
    console.error("Invalid token format:", error.message);
    return false;
  }
};

const TokenValidationWrapper = ({ children }) => {
  useEffect(() => {
    const token = getItemLocalStorage("token");
    const theme = getItemLocalStorage("theme");
    const isValid = checkTokenValidity(token);
    debugger
    if (!isValid) {
      clearLocalStorage();
      if (theme) {
        setItemLocalStorage("theme", theme);
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    }
  }, []);

  return children;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      {/* loading={<div>Loading state...</div>} */}
      <TokenValidationWrapper>
        <App />
        <Toaster />
      </TokenValidationWrapper>
    </Provider>
  </StrictMode>,
)
