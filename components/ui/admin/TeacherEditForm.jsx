"use client";

import React, { useState, useEffect } from "react";

export default function TeacherEditForm({ teacher, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    students: "",
    status: "",
    code: "",
  });

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name || "",
        email: teacher.email || "",
        phone: teacher.phone || "",
        department: teacher.department || "",
        students: teacher.students || "",
        status: teacher.status || "",
        code: teacher.code || "",
      });
    }
  }, [teacher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(formData);
  };

  if (!teacher) {
    return <div className="no-teacher">❌ ไม่พบข้อมูลอาจารย์ที่ต้องการแก้ไข</div>;
  }

  return (
    <section className="teacher-edit-form">
      <form onSubmit={handleSubmit}>
        {/* 🔹 แถว 1: ชื่อ - นามสกุล / อีเมล */}
        <div className="form-grid two-col">
          <div className="form-group">
            <label>ชื่อ - นามสกุล</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>อีเมล</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* 🔹 แถว 2: เบอร์โทร / ภาควิชา / จำนวนนิสิตในความดูแล */}
        <div className="form-grid three-col">
          <div className="form-group">
            <label>เบอร์โทรศัพท์</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>ภาควิชา</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>จำนวนนิสิตในความดูแล</label>
            <input
              type="number"
              name="students"
              value={formData.students}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        </div>

        {/* 🔹 แถว 3: สถานะ / รหัสอาจารย์ */}
        <div className="form-grid two-col">
          <div className="form-group">
            <label>สถานะ</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="เปิดรับที่ปรึกษา">เปิดรับที่ปรึกษา</option>
              <option value="เต็มโควตา">เต็มโควตา</option>
            </select>
          </div>
          <div className="form-group">
            <label>รหัสอาจารย์</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* 🔹 ปุ่ม */}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => onCancel && onCancel()}
          >
            ยกเลิก
          </button>
          <button type="submit" className="save-btn">
            บันทึก
          </button>
        </div>
      </form>

      {/* 🎨 CSS */}
      <style jsx>{`
        .teacher-edit-form {
          background: #fff;
          padding: 32px 48px;
          border-radius: 16px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
          margin: 32px auto;
          max-width: 1200px; /* ✅ อยู่กลางหน้าจอ */
          font-family: "Kanit", sans-serif;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .form-grid {
          display: grid;
          gap: 20px;
          width: 100%;
        }

        /* ✅ สร้าง layout ให้แน่นอน */
        .form-grid.two-col {
          grid-template-columns: repeat(2, 1fr);
        }

        .form-grid.three-col {
          grid-template-columns: repeat(3, 1fr);
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        label {
          font-weight: 600;
          color: #222;
          margin-bottom: 6px;
        }

        input,
        select {
          padding: 10px 14px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 0.95rem;
          outline: none;
        }

        input:focus,
        select:focus {
          border-color: #03a96b;
          box-shadow: 0 0 0 2px rgba(3, 169, 107, 0.2);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 10px;
        }

        .cancel-btn,
        .save-btn {
          font-family: "Kanit", sans-serif;
          font-weight: 600;
          padding: 10px 22px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
        }

        .cancel-btn {
          background: #f3f3f3;
          color: #333;
        }

        .save-btn {
          background: #2463eb;
          color: #fff;
        }

        .save-btn:hover {
          background: #1d4fd8;
        }

        /* ✅ Responsive */
        @media (max-width: 1024px) {
          .form-grid.two-col,
          .form-grid.three-col {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
