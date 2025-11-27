// src/pages/InstructorPage.jsx
import React, { useEffect, useState } from "react";
import API from "../api";
import InstructorRegisterForm from "../components/InstructorRegisterForm";

export default function InstructorPage() {
  const [lectures, setLectures] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // reuse for Refresh button
  async function loadLectures() {
    try {
      const res = await API.get("/instructor/lectures");
      setLectures(res.data);
    } catch (err) {
      console.error(err);
      alert(
        "Failed to load lectures: " +
          (err?.response?.data?.error || err.message)
      );
    }
  }

  // auto-load lectures when token is present
  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    const fetchLectures = async () => {
      try {
        const res = await API.get("/instructor/lectures");
        if (!cancelled) setLectures(res.data);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          alert(
            "Failed to load lectures: " +
              (err?.response?.data?.error || err.message)
          );
        }
      }
    };

    fetchLectures();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function login(e) {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  }

  return (
    <div>
      {!token ? (
        <div className="grid">
          {/* Login card */}
          <div className="card">
            <h2>Instructor Login</h2>
            <form onSubmit={login}>
              <label>
                Email
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Login</button>
            </form>
            <p>Login with credentials created via registration form.</p>
          </div>

          {/* Register card */}
          <InstructorRegisterForm
            onCreated={(user) => {
              // convenience: pre-fill login email after registration
              if (user?.email) setEmail(user.email);
            }}
          />
        </div>
      ) : (
        <div className="card">
          <h2>Your Lectures</h2>
          <button onClick={loadLectures}>Refresh</button>
          <ul className="list">
            {lectures.map((l) => (
              <li key={l._id} className="list-item">
                <div>
                  {l.courseId?.name} —{" "}
                  {new Date(l.date).toLocaleDateString()}
                </div>
              </li>
            ))}
            {lectures.length === 0 && <li>No lectures assigned</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
