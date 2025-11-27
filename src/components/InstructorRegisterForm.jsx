// src/components/InstructorRegisterForm.jsx
import React, { useState } from "react";
import API from "../api";

export default function InstructorRegisterForm({ onCreated }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", { name, email, password });
      setMsg({ type: "success", text: "Instructor registered" });
      setName("");
      setEmail("");
      setPassword("");
      if (onCreated) onCreated(res.data.user);
    } catch (err) {
      console.error(err);
      const txt =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message;
      setMsg({ type: "error", text: txt });
    }
  }

  return (
    <div className="card">
      <h3>Register Instructor</h3>
      {msg && <div className={`message ${msg.type}`}>{msg.text}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </label>
        <label>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
