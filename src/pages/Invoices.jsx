import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Invoices() {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [items, setItems] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [invoice, setInvoice] = useState({
    clientId: "",
    projectId: "",
    tax: 0,
  });

  useEffect(() => {
    setClients(JSON.parse(localStorage.getItem("clients")) || []);
    setProjects(JSON.parse(localStorage.getItem("projects")) || []);
    setInvoices(JSON.parse(localStorage.getItem("invoices")) || []);
  }, []);

  const saveInvoices = (data) => {
    localStorage.setItem("invoices", JSON.stringify(data));
    setInvoices(data);
    window.dispatchEvent(new Event("focus"));
  };

  const addItem = () => {
    setItems([...items, { name: "", price: 0, qty: 1 }]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const getTotal = () => {
    let total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    return total + (total * invoice.tax) / 100;
  };

  const handleSave = () => {
    if (!invoice.clientId || items.length === 0) {
      alert("Fill all fields!");
      return;
    }

    const newInvoice = {
      id: Date.now(),
      ...invoice,
      items,
      total: getTotal(),
      status: "Unpaid",
      date: new Date().toLocaleDateString(),
    };

    saveInvoices([...invoices, newInvoice]);
    setItems([]);
    setInvoice({ clientId: "", projectId: "", tax: 0 });
  };

  const markPaid = (id) => {
    const updated = invoices.map(inv =>
      inv.id === id ? { ...inv, status: "Paid" } : inv
    );
    saveInvoices(updated);
  };

  // 🔍 SEARCH + FILTER
  const filteredInvoices = invoices.filter(inv => {
    const matchSearch = inv.id.toString().includes(search);
    const matchFilter =
      filter === "All" ? true : inv.status === filter;
    return matchSearch && matchFilter;
  });

  // 📄 PDF DOWNLOAD
  const downloadPDF = async (id) => {
    const element = document.getElementById(`invoice-${id}`);
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(data, "PNG", 10, 10, 180, 0);
    pdf.save(`invoice-${id}.pdf`);
  };

  return (
    <div>
      <h2>Invoices</h2>

      {/* SEARCH + FILTER */}
      <div className="d-flex gap-2 mb-3">
        <input
          placeholder="Search by ID"
          className="form-control"
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="form-control"
          onChange={e => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Paid</option>
          <option>Unpaid</option>
        </select>
      </div>

      {/* FORM */}
      <div className="card p-4 mb-4 shadow">
        <h5>Create Invoice</h5>

        <select
          className="form-control mb-2"
          onChange={e => setInvoice({ ...invoice, clientId: e.target.value })}
        >
          <option>Select Client</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          className="form-control mb-2"
          onChange={e => setInvoice({ ...invoice, projectId: e.target.value })}
        >
          <option>Select Project</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>

        <button className="btn btn-success mb-2" onClick={addItem}>
          Add Item
        </button>

        {items.map((item, index) => (
          <div key={index} className="d-flex gap-2 mb-2">
            <input
              placeholder="Service"
              className="form-control"
              onChange={e => updateItem(index, "name", e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              className="form-control"
              onChange={e => updateItem(index, "price", +e.target.value)}
            />
            <input
              type="number"
              placeholder="Qty"
              className="form-control"
              onChange={e => updateItem(index, "qty", +e.target.value)}
            />
          </div>
        ))}

        <input
          type="number"
          placeholder="Tax %"
          className="form-control mb-2"
          onChange={e => setInvoice({ ...invoice, tax: +e.target.value })}
        />

        <h5>Total: ₹{getTotal()}</h5>

        <button className="btn btn-primary" onClick={handleSave}>
          Save Invoice
        </button>
      </div>

      {/* TABLE */}
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredInvoices.map(inv => (
            <tr key={inv.id}>
              <td>{inv.id}</td>
              <td>{inv.date}</td>
              <td>₹{inv.total}</td>
              <td>{inv.status}</td>
              <td>
                {inv.status === "Unpaid" && (
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => markPaid(inv.id)}
                  >
                    Pay
                  </button>
                )}

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => downloadPDF(inv.id)}
                >
                  PDF
                </button>
              </td>

              {/* Hidden PDF content */}
              <td style={{ display: "none" }}>
                <div id={`invoice-${inv.id}`}>
                  <h3>Invoice #{inv.id}</h3>
                  <p>Date: {inv.date}</p>
                  <p>Total: ₹{inv.total}</p>
                  <p>Status: {inv.status}</p>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}