import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    if (email === "admin@gmail.com" && password === "1234") {
      localStorage.setItem("token", "fake-token");
      window.location.href = "/";
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>

      <input
        className="form-control my-2"
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="form-control my-2"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />

      <button className="btn btn-primary" onClick={login}>
        Login
      </button>
    </div>
  );
}