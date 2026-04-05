import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("clients")) || [];
    setClients(data);
  }, []);

  const saveData = (data) => {
    localStorage.setItem("clients", JSON.stringify(data));
    setClients(data);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email.trim())
    )
      errs.email = "Invalid email address";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    if (editId) {
      const updated = clients.map((c) =>
        c.id === editId ? { ...c, ...form } : c
      );
      saveData(updated);
      setEditId(null);
    } else {
      const newClient = { id: Date.now(), ...form };
      saveData([...clients, newClient]);
    }

    setForm({ name: "", email: "", phone: "", company: "" });
  };

  const handleEdit = (client) => {
    setForm(client);
    setEditId(client.id);
    setErrors({});
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      const updated = clients.filter((c) => c.id !== id);
      saveData(updated);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Clients</h2>

      {/* FORM CARD */}
      <div className="card shadow-sm p-4 mb-5" style={{ borderRadius: "12px" }}>
        <h5 className="mb-4">{editId ? "Edit Client" : "Add Client"}</h5>

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Full Name *</label>
            <input
              name="name"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              placeholder="Enter full name"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Email *</label>
            <input
              name="email"
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="Enter email address"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Phone Number</label>
            <input
              name="phone"
              className="form-control"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Company</label>
            <input
              name="company"
              className="form-control"
              placeholder="Enter company name"
              value={form.company}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          className="btn btn-primary mt-4 px-4"
          onClick={handleSubmit}
          type="button"
        >
          {editId ? "Update Client" : "Add Client"}
        </button>
      </div>

      {/* CLIENTS TABLE */}
      {clients.length > 0 ? (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th style={{ width: "130px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.company}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-warning me-2"
                      onClick={() => handleEdit(c)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(c.id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center mt-5 text-muted">
          <p>No clients added yet.</p>
          <small>Use the form above to add new clients.</small>
        </div>
      )}
    </div>
  );
}