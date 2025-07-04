import axios from "axios";
import { clearLocalStorage, getItemLocalStorage } from "../Utils/browserServices";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = getItemLocalStorage("token");
  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
      responseType: 'arraybuffer'
    };
  }
  return config;
});

axiosInstance.interceptors.response.use(undefined, (error) => {
  if (error.message === "Network Error" && !error.response) {
    console.log("Network error - make sure API is running!");
  }
  if (error.response) {
    const { status } = error.response;
    if (status === 404) {
      console.log("Not Found");
    }
    if (status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/";
        clearLocalStorage();
        console.log("Your session has expired, please login again");
      }
    }
    return error.response;
  } else {
    console.log("error", error);
    return error;
  }
});

export default axiosInstance;
