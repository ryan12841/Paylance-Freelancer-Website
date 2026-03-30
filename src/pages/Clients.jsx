import { useState, useEffect } from "react";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("clients")) || [];
    setClients(data);
  }, []);

  const saveData = (data) => {
    localStorage.setItem("clients", JSON.stringify(data));
    setClients(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.email) {
      alert("Name and Email are required!");
      return;
    }

    if (editId) {
      const updated = clients.map(c =>
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
  };

  const handleDelete = (id) => {
    const updated = clients.filter(c => c.id !== id);
    saveData(updated);
  };

  return (
    <div>
      <h2>Clients</h2>

      {/* FORM */}
      <div className="card p-4 mb-4 shadow">
        <h5>{editId ? "Edit Client" : "Add Client"}</h5>

        <div className="row">
          <div className="col-md-6">
            <input
              name="name"
              className="form-control mb-2"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <input
              name="email"
              className="form-control mb-2"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <input
              name="phone"
              className="form-control mb-2"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <input
              name="company"
              className="form-control mb-2"
              placeholder="Company Name"
              value={form.company}
              onChange={handleChange}
            />
          </div>
        </div>

        <button className="btn btn-primary mt-2" onClick={handleSubmit}>
          {editId ? "Update Client" : "Add Client"}
        </button>
      </div>

      {/* TABLE */}
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {clients.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.company}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(c)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(c.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {clients.length === 0 && <p>No clients added yet.</p>}
    </div>
  );
}