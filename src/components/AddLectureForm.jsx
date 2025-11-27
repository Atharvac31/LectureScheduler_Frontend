// src/components/AddLectureForm.jsx
import React, { useState } from "react";
import API from "../api";

/**
 * Props:
 *  - course: selected course object (must have _id)
 *  - instructors: array of instructors [{_id, name, email}]
 *  - onCreated: callback when lecture successfully created
 */
export default function AddLectureForm({ course, instructors, onCreated }) {
  const [instructorId, setInstructorId] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState(null);

  if (!course) {
    return (
      <div className="card">
        <em>Select a course to add lectures</em>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!instructorId || !date) {
      setMessage({ type: "error", text: "Instructor and date are required" });
      return;
    }
    try {
      const res = await API.post(`/admin/course/${course._id}/lecture`, {
        instructorId,
        date
      });
      setMessage({ type: "success", text: "Lecture added" });
      setInstructorId("");
      setDate("");
      if (onCreated) onCreated(res.data.lecture || null);
    } catch (err) {
      console.error(err);
      const txt =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message;
      setMessage({ type: "error", text: txt });
    }
  }

  return (
    <div className="card">
      <h3>Add Lecture for: {course.name}</h3>
      {message && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit}>
        <label>
          Instructor
          <select
            value={instructorId}
            onChange={(e) => setInstructorId(e.target.value)}
            required
          >
            <option value="">Select instructor</option>
            {instructors.map((ins) => (
              <option key={ins._id} value={ins._id}>
                {ins.name} ({ins.email})
              </option>
            ))}
          </select>
        </label>

        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        <button type="submit" style={{ marginTop: 8 }}>
          Add Lecture
        </button>
      </form>

      <small>
        Clash rule: an instructor can’t have more than one lecture on the same
        date.
      </small>
    </div>
  );
}
