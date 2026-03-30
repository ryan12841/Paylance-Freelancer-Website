import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaBell, FaMoon, FaSun, FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const { dark, toggleTheme } = useContext(ThemeContext);

  return (
    <div
      className="d-flex justify-content-between align-items-center px-4 py-3 shadow-sm"
      style={{
        background: dark ? "#2a2a40" : "#ffffff",
        transition: "0.3s",
      }}
    >
      {/* LEFT */}
      <h5 className="m-0 fw-bold">📊 Dashboard</h5>

      {/* RIGHT */}
      <div className="d-flex align-items-center gap-4">

        {/* THEME TOGGLE */}
        <div onClick={toggleTheme} style={{ cursor: "pointer" }}>
          {dark ? <FaSun size={18} /> : <FaMoon size={18} />}
        </div>

        {/* NOTIFICATIONS */}
        <div style={{ position: "relative", cursor: "pointer" }}>
          <FaBell size={18} />
          <span
            style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              background: "red",
              color: "#fff",
              borderRadius: "50%",
              fontSize: "10px",
              padding: "2px 6px",
            }}
          >
            3
          </span>
        </div>

        {/* PROFILE */}
        <div className="d-flex align-items-center gap-2">
          <FaUserCircle size={24} />
          <span>Sunny</span>
        </div>

        {/* LOGOUT */}
        <button
          className="btn btn-danger btn-sm"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>

      </div>
    </div>
  );
}