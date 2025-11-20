import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { getItemLocalStorage, setItemLocalStorage } from "../../Utils/browserServices";


const Themetoggle = () => {
  const [theme, setTheme] = useState(getItemLocalStorage("theme"));
  const themetoggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === "dark");
    setItemLocalStorage("theme", newTheme)
  };

  return (
    <div
      className="
    rounded-full p-2 shadow-md 
    shadow-teal-400 dark:shadow-teal-600 
    cursor-pointer 
    text-gray-600 dark:text-gray-200 
    hover:text-teal-400 dark:hover:text-teal-300 
    bg-white dark:bg-gray-800
    transition-all ease-in-out
  "
      onClick={themetoggle}
    >
      {theme == 'dark'
        ? <Sun className="w-5 h-5" />
        : <Moon className="w-5 h-5" />
      }
    </div>

  );
};

export default Themetoggle;
