import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaBell, FaMoon, FaSun } from "react-icons/fa";

export default function Navbar({ toggleSidebar }) {
  const { dark, toggleTheme } = useContext(ThemeContext);

  return (
    <div
      style={{
        height: "64px",
        padding: "0 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: dark ? "#111827" : "#ffffff",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      {/* LEFT */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        
        {/* SIDEBAR TOGGLE */}
        <button
          onClick={toggleSidebar}
          style={{
            border: "none",
            background: "transparent",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ☰
        </button>

        <h5 style={{ margin: 0, fontWeight: 600 }}>
          Dashboard
        </h5>
      </div>

      {/* RIGHT */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>

        {/* THEME TOGGLE */}
        <div
          onClick={toggleTheme}
          style={{
            cursor: "pointer",
            padding: "8px",
            borderRadius: "8px",
            transition: "0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "#f3f4f6")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          {dark ? <FaSun size={16} /> : <FaMoon size={16} />}
        </div>

        {/* NOTIFICATIONS */}
        <div
          style={{
            position: "relative",
            cursor: "pointer",
            padding: "8px",
            borderRadius: "8px",
          }}
        >
          <FaBell size={16} />
          <span
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              height: "8px",
              width: "8px",
              background: "#ef4444",
              borderRadius: "50%",
            }}
          />
        </div>

        {/* PROFILE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            padding: "6px 10px",
            borderRadius: "8px",
          }}
        >
          {/* AVATAR */}
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "#6366f1",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            S
          </div>

          <span style={{ fontSize: "14px", fontWeight: 500 }}>
            Sunny
          </span>
        </div>

        {/* LOGOUT (SUBTLE STYLE) */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          style={{
            border: "1px solid #e5e7eb",
            background: "transparent",
            padding: "6px 12px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}