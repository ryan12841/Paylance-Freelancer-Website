import { useState, useEffect } from "react";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    title: "",
    clientId: "",
    status: "Pending",
    deadline: "",
  });
  const [editId, setEditId] = useState(null);

  // 🔥 Load data
  useEffect(() => {
    const loadData = () => {
      const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
      const storedClients = JSON.parse(localStorage.getItem("clients")) || [];

      setProjects(storedProjects);
      setClients(storedClients);
    };

    loadData();

    // 🔥 refresh when switching tabs/pages
    window.addEventListener("focus", loadData);

    return () => window.removeEventListener("focus", loadData);
  }, []);

  // 🔥 Save data
  const saveData = (data) => {
    localStorage.setItem("projects", JSON.stringify(data));
    setProjects(data);

    // 🔥 notify dashboard to update
    window.dispatchEvent(new Event("focus"));
  };

  // 🔥 Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Submit
  const handleSubmit = () => {
    if (!form.title || !form.clientId) {
      alert("Please fill all required fields!");
      return;
    }

    if (editId) {
      const updated = projects.map(p =>
        p.id === editId ? { ...p, ...form } : p
      );
      saveData(updated);
      setEditId(null);
    } else {
      const newProject = { id: Date.now(), ...form };
      saveData([...projects, newProject]);
    }

    setForm({
      title: "",
      clientId: "",
      status: "Pending",
      deadline: "",
    });
  };

  // 🔥 Edit
  const handleEdit = (project) => {
    setForm(project);
    setEditId(project.id);
  };

  // 🔥 Delete
  const handleDelete = (id) => {
    const updated = projects.filter(p => p.id !== id);
    saveData(updated);
  };

  // 🔥 FIXED: Get Client Name
  const getClientName = (id) => {
    const client = clients.find(c => Number(c.id) === Number(id));
    return client ? client.name : "No Client";
  };

  return (
    <div>
      <h2>Projects</h2>

      {/* FORM */}
      <div className="card p-4 mb-4 shadow">
        <h5>{editId ? "Edit Project" : "Add Project"}</h5>

        <input
          name="title"
          className="form-control mb-2"
          placeholder="Project Title"
          value={form.title}
          onChange={handleChange}
        />

        {/* CLIENT DROPDOWN */}
        <select
          name="clientId"
          className="form-control mb-2"
          value={form.clientId}
          onChange={handleChange}
        >
          <option value="">Select Client</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* STATUS */}
        <select
          name="status"
          className="form-control mb-2"
          value={form.status}
          onChange={handleChange}
        >
          <option>Pending</option>
          <option>Completed</option>
        </select>

        {/* DEADLINE */}
        <input
          type="date"
          name="deadline"
          className="form-control mb-2"
          value={form.deadline}
          onChange={handleChange}
        />

        <button className="btn btn-primary" onClick={handleSubmit}>
          {editId ? "Update Project" : "Add Project"}
        </button>
      </div>

      {/* TABLE */}
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Client</th>
            <th>Status</th>
            <th>Deadline</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {projects.map(p => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{getClientName(p.clientId)}</td>
              <td>{p.status}</td>
              <td>{p.deadline}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(p)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {projects.length === 0 && <p>No projects yet.</p>}
    </div>
  );
}