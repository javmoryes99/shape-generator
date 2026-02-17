import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

function Theme() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  function toggleTheme() {
    const newIsDark = !isDarkMode;
    setIsDarkMode(newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center
           text-white rounded-lg cursor-pointer
           hover:bg-gray-700 transition-colors duration-300
           w-12 h-10"
    >
      <span
        className={`absolute flex items-center justify-center transition-all duration-500 transform
          ${isDarkMode ? "rotate-0 opacity-100" : "rotate-180 opacity-0"}`}
      >
        <Icon icon="material-symbols:sunny-rounded" width="24" height="24" />
      </span>
      <span
        className={`absolute flex items-center justify-center transition-all duration-500 transform
          ${!isDarkMode ? "rotate-0 opacity-100" : "-rotate-180 opacity-0"}`}
      >
        <Icon icon="material-symbols:moon-stars-rounded" width="24" height="24" />
      </span>
    </button>
  );
}

export default Theme;