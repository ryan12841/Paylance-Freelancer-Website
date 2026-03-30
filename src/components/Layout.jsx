import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="d-flex">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div
        className="w-100"
        style={{
          marginLeft: "250px", // 👈 match sidebar width
          background: "#f5f6fa",
          minHeight: "100vh",
        }}
      >
        <Navbar />

        {/* REMOVE container */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}