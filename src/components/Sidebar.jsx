import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaProjectDiagram,
  FaFileInvoiceDollar,
} from "react-icons/fa";

export default function Sidebar({ collapsed }) {
  const menu = [
    { name: "Dashboard", path: "/", icon: <FaHome /> },
    { name: "Clients", path: "/clients", icon: <FaUsers /> },
    { name: "Projects", path: "/projects", icon: <FaProjectDiagram /> },
    { name: "Invoices", path: "/invoices", icon: <FaFileInvoiceDollar /> },
  ];

  return (
    <div
      style={{
        width: collapsed ? "80px" : "250px",
        height: "100vh",
        position: "fixed",
        background: "#111827",
        color: "#fff",
        padding: "16px 12px",
        transition: "0.3s",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* LOGO */}
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        {!collapsed ? (
          <h5 style={{ margin: 0, fontWeight: "600" }}>
            💼 Paylance
          </h5>
        ) : (
          <span style={{ fontSize: "20px" }}>💼</span>
        )}
      </div>

      {/* MENU */}
      <div style={{ flex: 1 }}>
        {menu.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 12px",
              marginBottom: "6px",
              borderRadius: "10px",
              textDecoration: "none",
              color: isActive ? "#fff" : "#9ca3af",
              background: isActive ? "#4f46e5" : "transparent",
              transition: "0.2s",
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains("active")) {
                e.currentTarget.style.background = "#1f2937";
                e.currentTarget.style.color = "#fff";
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.classList.contains("active")) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#9ca3af";
              }
            }}
          >
            <span style={{ fontSize: "18px" }}>
              {item.icon}
            </span>

            {!collapsed && (
              <span style={{ fontSize: "14px", fontWeight: 500 }}>
                {item.name}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* FOOTER (OPTIONAL) */}
      {!collapsed && (
        <div
          style={{
            fontSize: "12px",
            color: "#6b7280",
            marginTop: "20px",
          }}
        >
          © 2026 Paylance
        </div>
      )}
    </div>
  );
}