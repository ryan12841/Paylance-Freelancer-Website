import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="d-flex">
      
      {/* SIDEBAR */}
      <div
        style={{
          width: collapsed ? "80px" : "250px",
          transition: "0.3s",
          position: "fixed",
          height: "100vh",
          background: "#111827",
        }}
      >
        <Sidebar collapsed={collapsed} />
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          marginLeft: collapsed ? "80px" : "250px",
          width: "100%",
          background: "#f9fafb",
          minHeight: "100vh",
          transition: "0.3s",
        }}
      >
        {/* NAVBAR */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            background: "#fff",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Navbar toggleSidebar={() => setCollapsed(!collapsed)} />
        </div>

        {/* CONTENT */}
        <div style={{ padding: "24px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}