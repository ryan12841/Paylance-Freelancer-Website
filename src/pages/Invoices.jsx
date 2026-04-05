import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const rupeeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

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
    window.dispatchEvent(new Event("focus")); // Refresh other components if needed
  };

  const addItem = () => {
    setItems([...items, { name: "", price: 0, qty: 1 }]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    if (field === "price" || field === "qty") {
      value = Number(value);
      if (value < 0) value = 0;
    }
    updated[index][field] = value;
    setItems(updated);
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const getTotal = () => {
    let subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    return subtotal + (subtotal * invoice.tax) / 100;
  };

  const isFormValid = () => {
    return invoice.clientId && invoice.projectId && items.length > 0 && items.every(item => item.name.trim() && item.price > 0 && item.qty > 0);
  };

  const handleSave = () => {
    if (!isFormValid()) {
      alert("Please complete all fields and add valid items!");
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

  // Filter and Search logic
  const filteredInvoices = invoices.filter(inv => {
    const matchSearch = inv.id.toString().includes(search);
    const matchFilter = filter === "All" ? true : inv.status === filter;
    return matchSearch && matchFilter;
  });

  // PDF generation
  const downloadPDF = async (id) => {
    const element = document.getElementById(`invoice-${id}`);
    if (!element) return alert("Invoice not found for PDF generation.");

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice-${id}.pdf`);
  };

  return (
    <div>
      <h2 className="mb-4">Invoices</h2>

      {/* Search & Filter */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Invoice ID"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: "200px" }}
        />
        <select
          className="form-select"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ maxWidth: "150px" }}
        >
          <option value="All">All</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>

      {/* Invoice Form */}
      <div className="card p-4 mb-5 shadow-sm">
        <h5 className="mb-3">Create Invoice</h5>

        <div className="mb-3">
          <select
            className="form-select"
            value={invoice.clientId}
            onChange={e => setInvoice({ ...invoice, clientId: e.target.value })}
          >
            <option value="">Select Client</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <select
            className="form-select"
            value={invoice.projectId}
            onChange={e => setInvoice({ ...invoice, projectId: e.target.value })}
            disabled={!invoice.clientId}
          >
            <option value="">Select Project</option>
            {projects
              .filter(p => p.clientId === invoice.clientId)
              .map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
          </select>
        </div>

        <button className="btn btn-outline-success mb-3" onClick={addItem}>
          + Add Item
        </button>

        {items.length === 0 && <p className="text-muted">No items added yet.</p>}

        {items.map((item, index) => (
          <div key={index} className="d-flex gap-2 mb-3 align-items-center">
            <input
              type="text"
              className="form-control"
              placeholder="Service description"
              value={item.name}
              onChange={e => updateItem(index, "name", e.target.value)}
            />
            <input
              type="number"
              min="0"
              className="form-control"
              placeholder="Price"
              value={item.price}
              onChange={e => updateItem(index, "price", e.target.value)}
            />
            <input
              type="number"
              min="1"
              className="form-control"
              placeholder="Quantity"
              value={item.qty}
              onChange={e => updateItem(index, "qty", e.target.value)}
            />
            <button
              className="btn btn-outline-danger"
              onClick={() => removeItem(index)}
              title="Remove Item"
            >
              &times;
            </button>
          </div>
        ))}

        <div className="mb-3">
          <label htmlFor="taxInput" className="form-label">Tax %</label>
          <input
            id="taxInput"
            type="number"
            min="0"
            max="100"
            className="form-control"
            value={invoice.tax}
            onChange={e => setInvoice({ ...invoice, tax: Number(e.target.value) })}
          />
        </div>

        <h5>Total: {rupeeFormatter.format(getTotal())}</h5>

        <button
          className="btn btn-primary mt-3"
          onClick={handleSave}
          disabled={!isFormValid()}
          title={isFormValid() ? "Save Invoice" : "Complete the form to save"}
        >
          Save Invoice
        </button>
      </div>

      {/* Invoices Table */}
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th style={{ minWidth: "160px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">
                  No invoices found.
                </td>
              </tr>
            )}

            {filteredInvoices.map(inv => (
              <tr key={inv.id}>
                <td>{inv.id}</td>
                <td>{inv.date}</td>
                <td>{rupeeFormatter.format(inv.total)}</td>
                <td>
                  <span className={`badge ${inv.status === "Paid" ? "bg-success" : "bg-warning text-dark"}`}>
                    {inv.status}
                  </span>
                </td>
                <td>
                  {inv.status === "Unpaid" && (
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => markPaid(inv.id)}
                    >
                      Mark Paid
                    </button>
                  )}
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => downloadPDF(inv.id)}
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hidden Invoice for PDF Generation */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        {invoices.map(inv => (
          <div key={inv.id} id={`invoice-${inv.id}`} style={{ width: "210mm", padding: "20mm", backgroundColor: "#fff", color: "#000" }}>
            <h1 style={{ borderBottom: "2px solid #333", paddingBottom: "10px" }}>Invoice #{inv.id}</h1>
            <p><strong>Date:</strong> {inv.date}</p>
            <p><strong>Status:</strong> {inv.status}</p>
            <p><strong>Client:</strong> {clients.find(c => c.id === inv.clientId)?.name || "N/A"}</p>
            <p><strong>Project:</strong> {projects.find(p => p.id === inv.projectId)?.title || "N/A"}</p>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #333" }}>
                  <th style={{ textAlign: "left", padding: "8px" }}>Service</th>
                  <th style={{ textAlign: "right", padding: "8px" }}>Price</th>
                  <th style={{ textAlign: "right", padding: "8px" }}>Qty</th>
                  <th style={{ textAlign: "right", padding: "8px" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {inv.items.map((item, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #ccc" }}>
                    <td style={{ padding: "8px" }}>{item.name}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>{rupeeFormatter.format(item.price)}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>{item.qty}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>{rupeeFormatter.format(item.price * item.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 style={{ textAlign: "right", marginTop: "20px" }}>
              Tax ({inv.tax}%) + Total: {rupeeFormatter.format(inv.total)}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}