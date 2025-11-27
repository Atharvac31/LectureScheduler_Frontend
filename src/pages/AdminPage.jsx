// src/pages/AdminPage.jsx
import React, { useState, useEffect } from "react";   // ⬅ add useEffect
import CourseForm from "../components/CourseForm";
import CourseList from "../components/CourseList";
import LectureList from "../components/LectureList";
import AddLectureForm from "../components/AddLectureForm";
import API from "../api";

export default function AdminPage() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [lectureRefreshKey, setLectureRefreshKey] = useState(0);

  async function fetchInstructors() {
    try {
      const res = await API.get("/admin/instructors");
      setInstructors(res.data);
    } catch (err) {
      console.error(err);
      setInstructors([]);
    }
  }

  // 🔥 auto-load instructors once when AdminPage mounts
  useEffect(() => {
    const id = setTimeout(() => {
      fetchInstructors();
    }, 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="grid">
      <div>
        <CourseForm onCreated={(c) => setSelectedCourse(c)} />

        <div className="card">
          <h3>Instructors</h3>
          <button onClick={fetchInstructors}>Reload Instructors</button>
          <ul>
            {instructors.map((i) => (
              <li key={i._id}>
                {i.name} — <small>{i._id}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <CourseList onSelect={(c) => setSelectedCourse(c)} />
        <LectureList
          courseId={selectedCourse?._id}
          refreshKey={lectureRefreshKey}
        />
        <AddLectureForm
          course={selectedCourse}
          instructors={instructors}
          onCreated={() => setLectureRefreshKey((k) => k + 1)}
        />
      </div>
    </div>
  );
}
