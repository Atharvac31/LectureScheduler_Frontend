import React, { useState } from "react";
import API from "../api";

export default function CourseForm({ onCreated }) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState(null);

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    setImageFile(file || null);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("level", level);
      formData.append("description", description);
      if (imageFile) formData.append("image", imageFile);

      const res = await API.post("/admin/course", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({ type: "success", text: "Course created" });
      setName("");
      setLevel("");
      setDescription("");
      setImageFile(null);
      setPreviewUrl(null);

      if (onCreated) onCreated(res.data.course);
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err.message,
      });
    }
  }

  return (
    <div className="card">
      <h2>Add Course</h2>
      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Level
          <input
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label>
          Image
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        {previewUrl && (
          <div style={{ marginBottom: 8 }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: 150, borderRadius: 4 }}
            />
          </div>
        )}

        <button type="submit">Create Course</button>
      </form>
    </div>
  );
}
