// src/components/CourseList.jsx
import React, { useEffect, useState } from "react";
import API from "../api";

export default function CourseList({ onSelect }) {
  const [courses, setCourses] = useState([]);
  const [q, setQ] = useState("");

  async function fetchCourses(query = "") {
    try {
      const res = await API.get("/admin/courses?q=" + encodeURIComponent(query));
      setCourses(res.data.courses || res.data);
    } catch (err) {
      console.error(err);
      setCourses([]);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => fetchCourses(q), 300); // dynamic search
    return () => clearTimeout(timer);
  }, [q]);

  const apiBase = import.meta.env.VITE_API_URL; // get API base URL

  return (
    <div className="card">
      <h2>Courses</h2>

      <div style={{ marginBottom: 8 }}>
        <input
          placeholder="Search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <ul className="list">
        {courses.map((c) => {
          const hasImage = Boolean(c.image);
          const imageUrl = hasImage
            ? `${apiBase}/uploads/${c.image}` // 👈 ALWAYS /uploads here
            : null;

          return (
            <li
              key={c._id}
              className="list-item"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {/* Thumbnail + placeholder */}
              <div style={{ position: "relative" }}>
                {hasImage && (
                  <img
                    src={imageUrl}
                    alt={c.name}
                    onError={(e) => {
                      // if the image URL fails (404 etc), hide img and show placeholder
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "10px",
                      border: "1px solid #d1d5db",
                    }}
                  />
                )}

                <div
                  className="placeholder"
                  style={{
                    width: "72px",
                    height: "72px",
                    display: hasImage ? "none" : "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "10px",
                    border: "1px solid #bfdbfe",
                    background:
                      "linear-gradient(135deg, #dbeafe, #eff6ff)",
                    fontWeight: 600,
                    color: "#1e3a8a",
                    fontSize: "18px",
                  }}
                >
                  {c.name ? c.name.substring(0, 2).toUpperCase() : "NO"}
                </div>
              </div>

              {/* Course info */}
              <div style={{ flex: 1 }}>
                <strong>{c.name}</strong> — <em>{c.level}</em>
                <div>{c.description}</div>
              </div>

              <div>
                <button onClick={() => onSelect && onSelect(c)}>
                  View Lectures
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
