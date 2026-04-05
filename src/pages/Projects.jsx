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

  // Load data
  useEffect(() => {
    const loadData = () => {
      setProjects(JSON.parse(localStorage.getItem("projects")) || []);
      setClients(JSON.parse(localStorage.getItem("clients")) || []);
    };
    loadData();
    window.addEventListener("focus", loadData);
    return () => window.removeEventListener("focus", loadData);
  }, []);

  const saveData = (data) => {
    localStorage.setItem("projects", JSON.stringify(data));
    setProjects(data);
    window.dispatchEvent(new Event("focus")); // refresh dashboard
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.title || !form.clientId) {
      alert("Title and Client are required!");
      return;
    }

    if (editId) {
      const updated = projects.map((p) =>
        p.id === editId ? { ...p, ...form } : p
      );
      saveData(updated);
      setEditId(null);
    } else {
      saveData([...projects, { id: Date.now(), ...form }]);
    }

    setForm({ title: "", clientId: "", status: "Pending", deadline: "" });
  };

  const handleEdit = (project) => {
    setForm(project);
    setEditId(project.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      saveData(projects.filter((p) => p.id !== id));
    }
  };

  const getClientName = (id) =>
    clients.find((c) => Number(c.id) === Number(id))?.name || "No Client";

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "");

  return (
    <div>
      <h2 className="mb-4">Projects</h2>

      {/* FORM */}
      <div className="card p-4 mb-5 shadow-sm">
        <h5 className="mb-3">{editId ? "Edit Project" : "Add Project"}</h5>

        <div className="mb-3">
          <input
            name="title"
            className="form-control"
            placeholder="Project Title"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <select
            name="clientId"
            className="form-select"
            value={form.clientId}
            onChange={handleChange}
          >
            <option value="">Select Client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <select
            name="status"
            className="form-select"
            value={form.status}
            onChange={handleChange}
          >
            <option>Pending</option>
            <option>Completed</option>
          </select>
        </div>

        <div className="mb-3">
          <input
            type="date"
            name="deadline"
            className="form-control"
            value={form.deadline}
            onChange={handleChange}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!form.title || !form.clientId}
          title={
            !form.title || !form.clientId
              ? "Fill required fields to save"
              : editId
              ? "Update Project"
              : "Add Project"
          }
        >
          {editId ? "Update Project" : "Add Project"}
        </button>
      </div>

      {/* TABLE */}
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
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
            {projects.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">
                  No projects yet.
                </td>
              </tr>
            )}

            {projects.map((p) => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>{getClientName(p.clientId)}</td>
                <td>
                  <span
                    className={`badge ${
                      p.status === "Completed" ? "bg-success" : "bg-warning text-dark"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td>{formatDate(p.deadline)}</td>
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
      </div>
    </div>
  );
}