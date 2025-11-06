"use client";

import React, { useState } from "react";
import { Loader2, Save, X } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * 📋 ฟอร์มเพิ่มข่าวสาร (เวอร์ชันปรับ UI ให้กรอกง่าย)
 */
export default function AdminNewsAddForm({ onCancel, onSave }) {
  const [form, setForm] = useState({
    title: "",
    body: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    link1: "",
    note: "",
    allDay: false,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  /** ===== Utils ===== */
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const isValidURL = (url) => {
    if (!url) return true;
    try {
      const u = new URL(url);
      return u.protocol.startsWith("http");
    } catch {
      return false;
    }
  };

  /** ===== Validation ===== */
  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "กรุณากรอกหัวข้อข่าว";
    if (!form.body.trim()) e.body = "กรุณากรอกเนื้อหา";

    if (form.link1 && !isValidURL(form.link1)) {
      e.link1 = "กรุณาใส่ลิงก์ให้ถูกต้อง (เช่น https://example.com)";
    }

    if ((form.startDate && !form.endDate) || (!form.startDate && form.endDate)) {
      e.startDate = "กรุณาระบุวันที่เริ่มต้นและสิ้นสุด";
    }

    if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
      e.endDate = "วันที่สิ้นสุดต้องไม่ก่อนวันที่เริ่มต้น";
    }

    if (!form.allDay && ((form.startTime && !form.endTime) || (!form.startTime && form.endTime))) {
      e.startTime = "กรุณาระบุเวลาเริ่มต้นและสิ้นสุดให้ครบ";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /** ===== Save ===== */
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      const payload = {
        title: form.title.trim(),
        content: form.body.trim(),
        start_date: form.startDate || null,
        end_date: form.endDate || null,
        start_time: form.allDay ? null : form.startTime || null,
        end_time: form.allDay ? null : form.endTime || null,
        is_all_day: form.allDay,
        link_main: form.link1 || null,
        note: form.note || null,
        created_by: 1, // ✅ mock, ถ้ามี token แนะนำดึงจาก JWT
      };

      const res = await fetch(`${API_URL}/admin/news`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("ไม่สามารถบันทึกข่าวได้");
      const data = await res.json();
      alert("✅ เพิ่มข่าวสำเร็จ!");
      onSave?.(data);
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  /** ===== UI ===== */
  return (
    <form className="news-form" onSubmit={handleSave}>
      <h2>📰 เพิ่มข่าวสารใหม่</h2>

      {/* หัวข้อ */}
      <div className="form-group">
        <label>
          หัวข้อข่าว <span className="required">*</span>
        </label>
        <input
          type="text"
          name="title"
          placeholder="เช่น ประกาศเปิดรับสมัครโครงการสหกิจศึกษา"
          value={form.title}
          onChange={onChange}
        />
        {errors.title && <small className="error">{errors.title}</small>}
      </div>

      {/* เนื้อหา */}
      <div className="form-group">
        <label>
          เนื้อหา / รายละเอียดข่าว <span className="required">*</span>
        </label>
        <textarea
          name="body"
          placeholder="ใส่รายละเอียด เช่น ขั้นตอนหรือข้อมูลเพิ่มเติม..."
          value={form.body}
          onChange={onChange}
          rows={4}
        />
        {errors.body && <small className="error">{errors.body}</small>}
      </div>

      {/* วันที่ */}
      <div className="row">
        <div className="form-group">
          <label>วันที่เริ่มต้น</label>
          <input type="date" name="startDate" value={form.startDate} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>วันที่สิ้นสุด</label>
          <input type="date" name="endDate" value={form.endDate} onChange={onChange} />
        </div>
      </div>

      {/* เวลา */}
      <div className="row">
        <div className="form-group">
          <label>เวลาเริ่มต้น</label>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={onChange}
            disabled={form.allDay}
          />
        </div>
        <div className="form-group">
          <label>เวลาสิ้นสุด</label>
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={onChange}
            disabled={form.allDay}
          />
        </div>
        <label className="checkbox">
          <input type="checkbox" name="allDay" checked={form.allDay} onChange={onChange} /> ตลอดวัน
        </label>
      </div>

      {/* ลิงก์ */}
      <div className="form-group">
        <label>ลิงก์เว็บไซต์ / แบบฟอร์ม (ถ้ามี)</label>
        <input
          type="url"
          name="link1"
          placeholder="https://example.com"
          value={form.link1}
          onChange={onChange}
        />
        {errors.link1 && <small className="error">{errors.link1}</small>}
      </div>

      {/* หมายเหตุ */}
      <div className="form-group">
        <label>หมายเหตุ</label>
        <textarea
          name="note"
          placeholder="เช่น สำหรับนิสิตชั้นปีสุดท้ายเท่านั้น"
          value={form.note}
          onChange={onChange}
          rows={2}
        />
      </div>

      {/* ปุ่ม */}
      <div className="actions">
        <button type="button" className="btn cancel" onClick={onCancel} disabled={saving}>
          <X size={18} /> ยกเลิก
        </button>
        <button type="submit" className="btn save" disabled={saving}>
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? "กำลังบันทึก..." : "บันทึกข่าว"}
        </button>
      </div>

      {/* ✅ CSS */}
      <style jsx>{`
        .news-form {
          background: #fff;
          border-radius: 16px;
          padding: 30px 40px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
          max-width: 800px;
          margin: 0 auto;
          font-family: "Kanit", sans-serif;
        }

        h2 {
          font-size: 1.4rem;
          font-weight: 600;
          color: #03a96b;
          margin-bottom: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
        }

        label {
          font-weight: 500;
          color: #333;
          margin-bottom: 6px;
        }

        .required {
          color: #e53935;
        }

        input,
        textarea {
          border: 1px solid #dcdcdc;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 0.95rem;
          transition: 0.2s border-color, 0.2s box-shadow;
        }

        input:focus,
        textarea:focus {
          border-color: #03a96b;
          box-shadow: 0 0 0 2px rgba(3, 169, 107, 0.15);
          outline: none;
        }

        textarea {
          resize: vertical;
        }

        .row {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .row .form-group {
          flex: 1;
        }

        .checkbox {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.95rem;
          color: #444;
          margin-top: 10px;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 10px 18px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .btn.cancel {
          background: #f1f1f1;
          color: #333;
        }
        .btn.cancel:hover {
          background: #e5e5e5;
        }

        .btn.save {
          background: #03a96b;
          color: white;
        }
        .btn.save:hover {
          background: #02975f;
        }

        .error {
          color: #e53935;
          font-size: 0.9rem;
          margin-top: 4px;
        }

        @media (max-width: 640px) {
          .news-form {
            padding: 20px;
          }
          .row {
            flex-direction: column;
          }
        }
      `}</style>
    </form>
  );
}
