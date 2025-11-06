"use client";

import React, { useState } from "react";
import { UploadCloud } from "lucide-react";

export default function AdminUploadPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [publish, setPublish] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  const handleClear = () => {
    setFile(null);
    setTitle("");
    setCategory("");
    setDescription("");
    setPublish(false);
  };

  const handleUpload = () => {
    alert("อัปโหลดสำเร็จ (mock)");
  };

  return (
    <div className="upload-page">
      {/* ซ้าย: ฟอร์มอัปโหลด */}
      <div className="upload-left">
        {/* กล่อง drag-and-drop */}
        <div className="upload-box">
          <label htmlFor="file-upload" className="upload-dropzone">
            <UploadCloud size={42} color="#03a96b" />
            <p className="upload-text">ลากแล้ววางไฟล์ที่นี่ หรือ คลิกเพื่อเลือก</p>
            <p className="upload-subtext">
              รองรับไฟล์: PDF, DOCX, JPG, PNG · ขนาดไม่เกิน 100MB
            </p>
            <input
              type="file"
              id="file-upload"
              accept=".pdf,.docx,.jpg,.jpeg,.png"
              hidden
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* ฟอร์มข้อมูล */}
        <div className="form-section">
          <div className="form-row">
            <div className="form-group half">
              <label>หัวข้อ (Title)</label>
              <input
                type="text"
                placeholder="ชื่อไฟล์หรือชื่อประกาศ"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="form-group half">
              <label>หมวดหมู่ (Category)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">เลือกหมวดหมู่...</option>
                <option>ประกาศทั่วไป</option>
                <option>แบบฟอร์ม</option>
                <option>ผลการเรียน</option>
              </select>
            </div>
          </div>

          <div className="form-group full">
            <label>คำอธิบาย (Optional)</label>
            <textarea
              placeholder="คำอธิบาย สำหรับผู้ใช้งาน"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* toggle เผยแพร่ */}
          <div className="toggle-row">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={publish}
                onChange={(e) => setPublish(e.target.checked)}
              />
              <span className="toggle-slider" />
              <span className="toggle-text">เผยแพร่ทันที</span>
            </label>
          </div>

          {/* ปุ่ม */}
          <div className="form-actions">
            <button className="btn-clear" onClick={handleClear}>
              ล้างค่า
            </button>
            <button className="btn-upload" onClick={handleUpload}>
              อัปโหลด
            </button>
          </div>
        </div>
      </div>

      {/* ขวา: รายการล่าสุด + คำแนะนำ */}
      <div className="upload-right">
        <div className="side-card">
          <h3>รายการไฟล์ล่าสุด</h3>
          <p>ยังไม่มีไฟล์</p>
        </div>

        <div className="side-card">
          <h3>คำแนะนำ</h3>
          <ul className="guide-list">
            <li>ตั้งชื่อและกำหนดประเภทให้ชัดเจน — ช่วยให้ผู้ใช้ค้นหาเจอง่ายขึ้น</li>
            <li>แนบหมวดหมู่ไฟล์ตามประกาศ</li>
            <li>ตรวจสอบขนาดและสกุลไฟล์ก่อนอัปโหลด</li>
          </ul>
        </div>
      </div>

      {/* ===== CSS ===== */}
      <style jsx>{`
        .upload-page {
          display: flex;
          gap: 24px;
          padding: 32px;
          background: #f5f5f5;
        }

        .upload-left {
          flex: 1;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          padding: 24px;
        }

        .upload-box {
          border: 2px dashed #03a96b;
          border-radius: 12px;
          padding: 40px 20px;
          text-align: center;
          background: #fafdfb;
          margin-bottom: 24px;
          transition: background 0.3s;
        }
        .upload-box:hover {
          background: #f0fff6;
        }
        .upload-text {
          font-weight: 600;
          color: #333;
        }
        .upload-subtext {
          color: #666;
          font-size: 0.9rem;
          margin-top: 4px;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-row {
          display: flex;
          gap: 16px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group.half {
          flex: 1;
        }
        .form-group.full textarea {
          resize: none;
        }

        input,
        select,
        textarea {
          border: 1px solid #d0d7de;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 0.95rem;
          outline: none;
          transition: border 0.2s;
        }
        input:focus,
        select:focus,
        textarea:focus {
          border-color: #03a96b;
        }

        .toggle-row {
          margin-top: 8px;
        }
        .toggle-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          position: relative;
        }
        .toggle-label input {
          display: none;
        }
        .toggle-slider {
          width: 42px;
          height: 22px;
          background: #ccc;
          border-radius: 999px;
          position: relative;
          transition: background 0.3s;
        }
        .toggle-slider::after {
          content: "";
          width: 18px;
          height: 18px;
          background: #fff;
          border-radius: 50%;
          position: absolute;
          top: 2px;
          left: 2px;
          transition: left 0.3s;
        }
        .toggle-label input:checked + .toggle-slider {
          background: #03a96b;
        }
        .toggle-label input:checked + .toggle-slider::after {
          left: 22px;
        }
        .toggle-text {
          color: #333;
          font-size: 0.95rem;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 12px;
        }
        .btn-clear {
          background: #f3f4f6;
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 600;
          color: #333;
          cursor: pointer;
        }
        .btn-upload {
          background: #03a96b;
          color: white;
          border: none;
          padding: 10px 22px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-upload:hover {
          background: #02985d;
        }

        .upload-right {
          width: 320px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .side-card {
          background: #fff;
          border-radius: 12px;
          padding: 16px 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .side-card h3 {
          margin: 0 0 8px;
          font-size: 1rem;
          font-weight: 600;
        }
        .side-card p {
          margin: 0;
          color: #555;
          font-size: 0.9rem;
        }

        .guide-list {
          margin: 0;
          padding-left: 18px;
          color: #555;
          font-size: 0.9rem;
        }

        @media (max-width: 1100px) {
          .upload-page {
            flex-direction: column;
          }
          .upload-right {
            width: 100%;
            flex-direction: row;
            gap: 12px;
          }
          .side-card {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}
