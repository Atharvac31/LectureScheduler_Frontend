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

  // Initial load + dynamic search (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses(q);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [q]);

  return (
    <div className="card">
      <h2>Courses</h2>

      <div style={{ marginBottom: 8 }}>
        <input
          placeholder="Search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {/* Optional: you can remove this button now */}
        <button onClick={() => fetchCourses(q)}>Search</button>
      </div>

      <ul className="list">
        {courses.map((c) => {
          const hasImage = Boolean(c.image);
          const imageUrl = hasImage
            ? `${import.meta.env.VITE_API_URL}/${c.image}`
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
              <div style={{ position: "relative" }}>
                {hasImage && (
                  <img
                    src={imageUrl}
                    alt={c.name}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                    style={{
                      width: "72px",
                      height: "72px",
                      objectFit: "cover",
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
