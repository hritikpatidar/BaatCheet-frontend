import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, MessageSquareWarning } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen 
                bg-[#fdf7f2] dark:bg-gray-900 
                flex flex-col items-center justify-center 
                px-6 py-12 text-center relative overflow-hidden">

      <h1
        className="text-[42px] md:text-[56px] font-bold 
             text-[#242424] dark:text-white 
             mb-4 z-10 tracking-wide flex items-center gap-3"
      >
        Baatcheet
        <MessageSquare size={48} strokeWidth={1.5} className="text-[#242424] dark:text-white" />
      </h1>

      {/* BIG 404 BACKDROP */}
      <div className="absolute top-1/2 left-1/2 transform 
                  -translate-x-1/2 -translate-y-[55%] 
                  text-[#f2e8dc] dark:text-gray-700 
                  text-[180px] md:text-[240px] font-extrabold 
                  tracking-tight select-none z-0 pointer-events-none">
        404
      </div>

      <div className="z-10">
        <h2 className="text-2xl md:text-3xl font-semibold 
                   text-[#333] dark:text-white 
                   mb-4 flex items-center justify-center gap-2">
          <MessageSquareWarning className="w-7 h-7 text-[#b48b49]" />
          Oops! Page not found
        </h2>

        <p className="text-[#666] dark:text-gray-300 mb-6 
                  max-w-md mx-auto text-sm md:text-base">
          Lagta hai aap galat page par aa gaye ho. Yeh page exist nahi karta hai
          ya phir hata diya gaya hai.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-[#333] dark:bg-gray-700 
                 text-white px-6 py-3 rounded-full 
                 hover:bg-[#444] dark:hover:bg-gray-600 
                 transition duration-200 shadow"
        >
          Wapas Chat Pe Chalo
        </button>
      </div>
    </div>

  );
};

export default NotFound;
