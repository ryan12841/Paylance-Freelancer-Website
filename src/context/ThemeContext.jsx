import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDark(true);
  }, []);

  // Apply theme to body
  useEffect(() => {
    document.body.style.background = dark ? "#1e1e2f" : "#f5f6fa";
    document.body.style.color = dark ? "#fff" : "#000";
  }, [dark]);

  const toggleTheme = () => {
    setDark(prev => {
      const newTheme = !prev;
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}