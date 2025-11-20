import React from 'react'
import { clearLocalStorage, getItemLocalStorage, setItemLocalStorage } from '../Utils/browserServices';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LogOutModal = ({ setIsLogoutModalOpen, loading, setLoading }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSignOut = () => {
        setLoading(true);
        setTimeout(() => {
            const fcmToken = getItemLocalStorage("fcm_token");
            const theme = getItemLocalStorage("theme");
            clearLocalStorage();
            if (fcmToken) {
                setItemLocalStorage("fcm_token", fcmToken);
            }
            if (theme) {
                setItemLocalStorage("theme", theme);
            }
            dispatch({ type: "RESET" });
            navigate("/login");
        }, 2000);
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center 
    bg-black/30 dark:bg-black/60 backdrop-blur-sm px-4 sm:px-0"
        >
            <div
                className="bg-gray-100 dark:bg-gray-800 
        border border-gray-300 dark:border-gray-700 
        shadow-2xl rounded-xl 
        w-full max-w-sm sm:max-w-md 
        p-5 sm:p-6 
        transition-all duration-300"
            >
                <h2 className="text-lg sm:text-xl font-semibold 
            text-gray-800 dark:text-gray-100 mb-2"
                >
                    Are you sure you want to logout?
                </h2>

                <p className="text-sm sm:text-base 
            text-gray-600 dark:text-gray-300 mb-6"
                >
                    Your session will end immediately.
                </p>

                <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                    <button
                        onClick={() => setIsLogoutModalOpen(false)}
                        className="w-full sm:w-auto px-4 py-2 rounded-md 
                    border border-gray-400 dark:border-gray-600 
                    text-gray-800 dark:text-gray-200
                    hover:bg-gray-200 dark:hover:bg-gray-700 
                    transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSignOut}
                        disabled={loading}
                        className={`w-full sm:w-auto px-4 py-2 rounded-md 
                    bg-red-600 dark:bg-red-700 
                    text-white 
                    hover:bg-red-700 dark:hover:bg-red-800 
                    transition 
                    ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Logging out..." : "Logout"}
                    </button>
                </div>
            </div>
        </div>

    )
}

export default LogOutModal
