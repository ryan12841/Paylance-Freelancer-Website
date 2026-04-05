import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { FaUsers, FaProjectDiagram, FaRupeeSign, FaClock } from "react-icons/fa";

const rupeeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

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

  // Calculations
  const totalIncome = invoices
    .filter(i => i.status === "Paid")
    .reduce((sum, i) => sum + i.total, 0);

  const pendingAmount = invoices
    .filter(i => i.status === "Unpaid")
    .reduce((sum, i) => sum + i.total, 0);

  // Monthly Income Data
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

  // Pie Data
  const pieData = [
    { name: "Paid", value: totalIncome },
    { name: "Unpaid", value: pendingAmount },
  ];

  const COLORS = ["#4caf50", "#f44336"];

  const cards = [
    { title: "Clients", value: clients.length, icon: <FaUsers size={28} />, color: "linear-gradient(45deg, #667eea, #764ba2)" },
    { title: "Projects", value: projects.length, icon: <FaProjectDiagram size={28} />, color: "linear-gradient(45deg, #43cea2, #185a9d)" },
    { title: "Income", value: rupeeFormatter.format(totalIncome), icon: <FaRupeeSign size={28} />, color: "linear-gradient(45deg, #11998e, #38ef7d)" },
    { title: "Pending", value: rupeeFormatter.format(pendingAmount), icon: <FaClock size={28} />, color: "linear-gradient(45deg, #ff416c, #ff4b2b)" },
  ];

  return (
    <div className="container mt-4">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🚀 Dashboard Analytics
      </motion.h2>

      {/* CARDS */}
      <div className="row mt-4 g-4">
        {cards.map((card, i) => (
          <div className="col-md-3" key={i}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 text-white rounded-4 shadow d-flex flex-column align-items-center justify-content-center"
              style={{ background: card.color, minHeight: "130px", cursor: "default" }}
            >
              <div>{card.icon}</div>
              <h6 className="mt-3 mb-1">{card.title}</h6>
              <h3>{card.value}</h3>
            </motion.div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="row mt-5 g-4">
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
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}