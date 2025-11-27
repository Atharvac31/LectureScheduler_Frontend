// src/components/LectureList.jsx
import React, { useEffect, useState } from "react";
import API from "../api";

export default function LectureList({ courseId, refreshKey }) {
  const [lectures, setLectures] = useState([]);
  const [error, setError] = useState(null);

  // load lectures
  useEffect(() => {
    if (!courseId) return;

    (async () => {
      try {
        const res = await API.get(`/admin/course/${courseId}/lectures`);
        setLectures(res.data.lectures || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.error || err?.message);
      }
    })();
  }, [courseId, refreshKey]); // 👈 include refreshKey

  // delete lecture by id
  async function handleDelete(id) {
    const ok = window.confirm("Are you sure you want to delete this lecture?");
    if (!ok) return;

    try {
      await API.delete(`/admin/lecture/${id}`);
      // remove from local state
      setLectures((prev) => prev.filter((lec) => lec._id !== id));
    } catch (err) {
      console.error(err);
      alert(
        "Failed to delete lecture: " +
          (err?.response?.data?.error || err.message)
      );
    }
  }

  if (!courseId) {
    return (
      <div className="card">
        <em>Select a course to view lectures</em>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Lectures for course</h3>
      {error && <div className="message error">{error}</div>}
      <ul className="list">
        {lectures.map((l) => (
          <li
            key={l._id}
            className="list-item"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div>
              <strong>{l.courseId?.name || "Course"}</strong>
              <div>Date: {new Date(l.date).toLocaleDateString()}</div>
              <div>Instructor: {l.instructorId?.name || l.instructorId}</div>
            </div>

            <button
              onClick={() => handleDelete(l._id)}
              style={{
                background: "#e74c3c",
                color: "#fff",
                border: "none",
                padding: "6px 10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </li>
        ))}
        {lectures.length === 0 && <li>No lectures</li>}
      </ul>
    </div>
  );
}
