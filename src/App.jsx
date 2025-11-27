import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import InstructorPage from "./pages/InstructorPage";
import { getToken, logout } from "./auth";

export default function App(){
  const token = getToken();
  return (
    <div className="app">
      <header className="topbar">
        <h1>Lecture Scheduler</h1>
        <nav>
          <Link to="/admin">Admin</Link>
          <Link to="/instructor">Instructor</Link>
          {token ? <button onClick={() => { logout(); window.location.reload(); }}>Logout</button> : null}
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<AdminPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/instructor" element={<InstructorPage />} />
        </Routes>
      </main>
    </div>
  );
}
