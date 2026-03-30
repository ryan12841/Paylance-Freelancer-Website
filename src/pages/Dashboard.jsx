import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

export default function Dashboard() {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const loadData = () => {
    setClients(JSON.parse(localStorage.getItem("clients")) || []);
    setProjects(JSON.parse(localStorage.getItem("projects")) || []);
    setInvoices(JSON.parse(localStorage.getItem("invoices")) || []);
  };

  useEffect(() => {
    loadData();
    window.addEventListener("focus", loadData);
    return () => window.removeEventListener("focus", loadData);
  }, []);

  // 💰 CALCULATIONS
  const totalIncome = invoices
    .filter(i => i.status === "Paid")
    .reduce((sum, i) => sum + i.total, 0);

  const pendingAmount = invoices
    .filter(i => i.status === "Unpaid")
    .reduce((sum, i) => sum + i.total, 0);

  // 📊 MONTHLY DATA
  const monthlyData = {};
  invoices.forEach(inv => {
    const month = new Date(inv.date).toLocaleString("default", { month: "short" });
    if (!monthlyData[month]) monthlyData[month] = 0;
    if (inv.status === "Paid") {
      monthlyData[month] += inv.total;
    }
  });

  const chartData = Object.keys(monthlyData).map(m => ({
    name: m,
    income: monthlyData[m],
  }));

  // 🥧 PIE DATA
  const pieData = [
    { name: "Paid", value: totalIncome },
    { name: "Unpaid", value: pendingAmount },
  ];

  const COLORS = ["#00C49F", "#FF4B2B"];

  return (
    <div className="container mt-4">
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        🚀 Dashboard Analytics
      </motion.h2>

      {/* CARDS */}
      <div className="row mt-4 g-4">
        {[
          { title: "Clients", value: clients.length, color: "#667eea" },
          { title: "Projects", value: projects.length, color: "#43cea2" },
          { title: "Income", value: `₹${totalIncome}`, color: "#11998e" },
          { title: "Pending", value: `₹${pendingAmount}`, color: "#ff416c" },
        ].map((card, i) => (
          <div className="col-md-3" key={i}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 text-white rounded-4 shadow text-center"
              style={{ background: card.color }}
            >
              <h6>{card.title}</h6>
              <h3>{card.value}</h3>
            </motion.div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="row mt-5">
        {/* BAR CHART */}
        <div className="col-md-6">
          <div className="card p-4 shadow rounded-4">
            <h5>📊 Monthly Income</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#667eea" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="col-md-6">
          <div className="card p-4 shadow rounded-4">
            <h5>💳 Payment Status</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}