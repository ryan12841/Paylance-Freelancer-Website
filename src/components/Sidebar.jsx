import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FaBars,
  FaHome,
  FaUsers,
  FaProjectDiagram,
  FaFileInvoiceDollar,
} from "react-icons/fa";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

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
        background: "#111",
        color: "#fff",
        transition: "0.3s",
      }}
    >
      {/* TOGGLE BUTTON */}
      <div className="d-flex justify-content-between align-items-center p-3">
        {!collapsed && <h5>💼 Paylance</h5>}
        <FaBars
          style={{ cursor: "pointer" }}
          onClick={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* MENU */}
      <ul className="nav flex-column px-2">
        {menu.map((item, index) => (
          <li key={index} className="nav-item mb-2">
            <NavLink
              to={item.path}
              className="nav-link text-white d-flex align-items-center"
              style={({ isActive }) => ({
                background: isActive ? "#333" : "transparent",
                borderRadius: "8px",
                padding: "10px",
                transition: "0.3s",
              })}
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>

              {!collapsed && (
                <span style={{ marginLeft: "10px" }}>
                  {item.name}
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}