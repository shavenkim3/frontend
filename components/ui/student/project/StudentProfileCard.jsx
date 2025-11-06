"use client";

import React, { useEffect, useState } from "react";
import { User } from "lucide-react";

export default function StudentProfileCard() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    if (typeof window === "undefined") return "";
    return (
      localStorage.getItem("student_token") ||
      localStorage.getItem("token") ||
      ""
    );
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setError("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/student/project/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((resData) => {
        console.log("📦 โหลดข้อมูลโปรไฟล์:", resData);
        if (!resData || resData.error) {
          setError(resData.error || "ไม่สามารถโหลดข้อมูลได้");
          return;
        }
        setData(resData);
      })
      .catch((err) => {
        console.error("load error:", err);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center p-6">กำลังโหลดข้อมูล...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!data) return <p className="text-center">ไม่พบข้อมูลนิสิต</p>;

  // ✅ เตรียมค่า
  const name = `${data.prefix || ""}${data.first_name || ""} ${data.last_name || ""}`;
  const email = data.email || "-";
  const studentId = data.student_id || "-";
  const termType = data.program_type || "ไม่ระบุ";
  const phone = data.phone || "-";
  const projectTitle = data.project_name || "ยังไม่ระบุชื่อโครงงาน";
  const advisor = data.advisor_name || "ยังไม่ระบุอาจารย์ที่ปรึกษา";
  const description = data.detail || "ไม่มีรายละเอียดเพิ่มเติม";



  return (
    <section className="profile-section">
      <div className="profile-card">
        {/* Header */}
        <div className="profile-header">
          <div>
            <div className="profile-name">{name}</div>
            <div className="profile-email">{email}</div>
          </div>
        </div>


        <hr className="divider" />

        {/* Student info */}
        <div className="info-group">
          <div className="info-item">
            <span className="label">รหัสนิสิต</span>
            <span className="value">{studentId}</span>
          </div>
          <div className="info-item">
            <span className="label">ภาค</span>
            <span className="value">{termType}</span>
          </div>
          <div className="info-item">
            <span className="label">เบอร์โทร</span>
            <span className="value">{phone}</span>
          </div>
          <div className="info-item">
            <span className="label">Email</span>
            <span className="value">{email}</span>
          </div>
        </div>

        <hr className="divider" />

        {/* Project info */}
        <div className="info-group">
          <div className="info-item">
            <span className="label">ชื่อโครงงาน</span>
            <span className="value">{projectTitle}</span>
          </div>
          <div className="info-item">
            <span className="label">อาจารย์ที่ปรึกษา</span>
            <span className="value">{advisor}</span>
          </div>
          <div className="info-item detail">
            <span className="label">รายละเอียดเพิ่มเติม</span>
            <p className="detail-text">{description}</p>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .profile-section {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 40px 20px;
          background: #ffffff;
        }

        .profile-card {
          width: 100%;
          max-width: 600px;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          padding: 28px 32px;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 10px;
        }

        .avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #e6fff1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: #222;
        }
        .profile-email {
          color: #666;
          font-size: 0.9rem;
        }

        .divider {
          border: none;
          border-top: 1px solid #e6e6e6;
          margin: 18px 0;
        }

        .status-box {
          margin: 10px 0 8px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .status-label {
          font-weight: 500;
          color: #555;
        }
        .status {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          background: #e6fff4;
          color: #03a96b;
        }

        .info-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.95rem;
          border-bottom: 1px solid #f2f2f2;
          padding-bottom: 6px;
        }
        .info-item.detail {
          flex-direction: column;
          align-items: flex-start;
          border-bottom: none;
        }
        .label {
          color: #555;
          font-weight: 500;
        }
        .value {
          color: #111;
          font-weight: 600;
        }
        .detail-text {
          margin-top: 6px;
          background: #fafafa;
          padding: 10px 14px;
          border-radius: 8px;
          color: #444;
          line-height: 1.6;
          font-weight: 400;
        }
      `}</style>
    </section>
  );
}
