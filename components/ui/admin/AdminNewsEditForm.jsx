"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AdminNewsEditForm({ newsId, onCancel, onSaved }) {
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
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  /** ✅ โหลดข้อมูลข่าวเก่า */
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/news/${newsId}`);
        if (!res.ok) throw new Error("ไม่พบข้อมูลข่าว");
        const data = await res.json();

        setForm({
          title: data.title || "",
          body: data.content || "",
          startDate: data.start_date ? data.start_date.split("T")[0] : "",
          endDate: data.end_date ? data.end_date.split("T")[0] : "",
          startTime: data.start_time || "",
          endTime: data.end_time || "",
          link1: data.link_main || "",
          note: data.note || "",
          allDay: !!data.is_all_day,
        });
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [newsId]);

  /** ✅ utils */
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const isValidURL = (url) => {
    if (!url) return true;
    try {
      const u = new URL(url);
      return ["http:", "https:"].includes(u.protocol);
    } catch {
      return false;
    }
  };

  /** ✅ ตรวจสอบข้อมูลก่อนส่ง */
  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "กรุณากรอกหัวข้อ";
    if (!form.body.trim()) e.body = "กรุณากรอกเนื้อหา";
    if (form.link1 && !isValidURL(form.link1)) e.link1 = "ลิงก์ไม่ถูกต้อง (เช่น https://example.com)";
    if ((form.startDate && !form.endDate) || (!form.startDate && form.endDate)) {
      e.startDate = "กรุณาเลือกวันที่เริ่มต้นและสิ้นสุด";
    }
    if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
      e.endDate = "วันที่สิ้นสุดต้องไม่ก่อนวันที่เริ่มต้น";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /** ✅ ก่อนบันทึก */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setShowConfirm(true);
  };

  /** ✅ บันทึกลง backend */
  const confirmSave = async () => {
    setShowConfirm(false);
    setSaving(true);

    try {
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
      };

      const res = await fetch(`${API_URL}/admin/news/${newsId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // ถ้ามี token: Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("บันทึกข่าวไม่สำเร็จ");
      const data = await res.json();

      alert("✅ บันทึกการแก้ไขสำเร็จ");
      onSaved?.(data);
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-10 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> กำลังโหลดข้อมูลข่าว...
      </div>
    );

  return (
    <>
      <form className="news-form" onSubmit={handleSubmit}>
        <h2>✏️ แก้ไขข่าวสาร</h2>

        {/* หัวข้อ */}
        <div className="group">
          <label className="required">หัวข้อข่าว</label>
          <input type="text" name="title" value={form.title} onChange={onChange} />
          {errors.title && <small className="error">{errors.title}</small>}
        </div>

        {/* เนื้อหา */}
        <div className="group">
          <label className="required">เนื้อหา</label>
          <textarea name="body" value={form.body} onChange={onChange} rows={4} />
          {errors.body && <small className="error">{errors.body}</small>}
        </div>

        {/* วันที่ */}
        <div className="row">
          <div className="group">
            <label>วันที่เริ่มต้น</label>
            <input type="date" name="startDate" value={form.startDate} onChange={onChange} />
          </div>
          <div className="group">
            <label>วันที่สิ้นสุด</label>
            <input type="date" name="endDate" value={form.endDate} onChange={onChange} />
          </div>
        </div>

        {/* เวลา */}
        <div className="row">
          <div className="group">
            <label>เวลาเริ่มต้น</label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={onChange}
              disabled={form.allDay}
            />
          </div>
          <div className="group">
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
        <div className="group">
          <label>ลิงก์</label>
          <input type="text" name="link1" value={form.link1} onChange={onChange} />
          {errors.link1 && <small className="error">{errors.link1}</small>}
        </div>

        {/* หมายเหตุ */}
        <div className="group">
          <label>หมายเหตุ</label>
          <textarea name="note" value={form.note} onChange={onChange} rows={2} />
        </div>

        <div className="actions">
          <button className="btn cancel" type="button" onClick={onCancel}>
            ยกเลิก
          </button>
          <button className="btn primary" type="submit" disabled={saving}>
            {saving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
          </button>
        </div>
      </form>

      {/* 🔹 Modal ยืนยัน */}
      {showConfirm && (
        <>
          <div className="overlay" onClick={() => setShowConfirm(false)} />
          <div className="modal">
            <h3>ยืนยันการบันทึก</h3>
            <p>คุณต้องการบันทึกการแก้ไขข่าวนี้หรือไม่?</p>
            <div className="modal-actions">
              <button className="btn cancel" onClick={() => setShowConfirm(false)}>
                ยกเลิก
              </button>
              <button className="btn danger" onClick={confirmSave}>
                บันทึก
              </button>
            </div>
          </div>
        </>
      )}

      {/* CSS */}
      <style jsx>{`
        .news-form {
          background: #fff;
          border-radius: 12px;
          padding: 28px 36px;
          max-width: 800px;
          margin: 0 auto;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
          font-family: "Kanit", sans-serif;
        }
        h2 {
          color: #03a96b;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .group {
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
        }
        label {
          font-weight: 500;
          margin-bottom: 6px;
        }
        .required::after {
          content: " *";
          color: #e53935;
        }
        input,
        textarea {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 0.95rem;
        }
        input:focus,
        textarea:focus {
          border-color: #03a96b;
          box-shadow: 0 0 0 2px rgba(3, 169, 107, 0.15);
          outline: none;
        }
        .row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
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
          gap: 10px;
          margin-top: 24px;
        }
        .btn {
          border: none;
          border-radius: 8px;
          font-weight: 600;
          padding: 10px 18px;
          cursor: pointer;
        }
        .btn.cancel {
          background: #f1f1f1;
        }
        .btn.primary {
          background: #03a96b;
          color: #fff;
        }
        .btn.danger {
          background: #03a96b;
          color: #fff;
        }
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          z-index: 1000;
        }
        .modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #fff;
          padding: 28px 34px;
          border-radius: 10px;
          text-align: center;
          width: 360px;
          box-shadow: 0 5px 14px rgba(0, 0, 0, 0.2);
          z-index: 1001;
        }
        .modal h3 {
          color: #03a96b;
        }
        .modal-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 18px;
        }
      `}</style>
    </>
  );
}
