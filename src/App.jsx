import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import Invoices from "./pages/Invoices";
import ThemeProvider from "./context/ThemeContext.jsx"

export default function App() {
  return (
    <ThemeProvider> {}
      <BrowserRouter>
        <Routes>

          {/* PUBLIC ROUTE */}
          <Route path="/login" element={<Login />} />

          {/* PROTECTED ROUTES */}
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/clients" element={<Layout><Clients /></Layout>} />
          <Route path="/projects" element={<Layout><Projects /></Layout>} />
          <Route path="/invoices" element={<Layout><Invoices /></Layout>} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}