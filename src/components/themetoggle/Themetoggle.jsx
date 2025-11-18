import React, { useEffect, useState } from "react";
import { SunMedium } from "lucide-react";


const Themetoggle = () => {
  const [theme, settheme] = useState(localStorage.getItem("theme"));
  const themetoggle = () => {
    settheme(theme === "dark" ? "light" : "dark");
  };
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  return (
    <div className="cursor-pointer " onClick={themetoggle}>
      <SunMedium className="w-5 h-5" />
    </div>
  );
};

export default Themetoggle;
