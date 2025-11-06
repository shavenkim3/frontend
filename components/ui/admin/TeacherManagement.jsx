"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Eye } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getAdminToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token") ||
    ""
  );
}

export default function TeacherManagement() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  /** 🔹 โหลดข้อมูลจาก backend */
  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        setLoading(true);
        setErr("");
        const token = getAdminToken();

        const res = await fetch(
          `${API_URL}/admin/advisors?q=${encodeURIComponent(search)}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setTeachers(data.items || []);
      } catch (e) {
        console.error("fetchAdvisors error:", e);
        setErr("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisors();
  }, [search]); // โหลดใหม่เมื่อ search เปลี่ยน

  const handleEdit = (id) => router.push(`/admin/teacher/edit/${id}`);
  const handleView = (id) => router.push(`/admin/teacher/view/${id}`);

  return (
    <section className="teacher-page">
      <div className="teacher-header">
        <input
          type="text"
          placeholder="ค้นหาชื่อ/อีเมล/เบอร์โทร..."
          className="search-box"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p>⏳ กำลังโหลดข้อมูล...</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}

      {!loading && !err && (
        <div className="teacher-table-wrapper">
          <table className="teacher-table">
            <thead>
              <tr>
                <th>Advisor ID</th>
                <th>ชื่ออาจารย์</th>
                <th>อีเมล</th>
                <th>เบอร์โทร</th>
                <th>ภาควิชา</th>
                <th>นิสิตที่ปรึกษา</th>
                <th>ดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t) => (
                <tr key={t.advisor_id}>
                  <td>{t.advisor_id || "-"}</td>
                  <td>{t.name || "-"}</td>
                  <td>{t.email || "-"}</td>
                  <td>{t.phone || "-"}</td>
                  <td>{t.department || "-"}</td>
                  <td>{t.students ?? 0}</td>
                  <td className="actions">
                    <button
                      className="icon-btn"
                      onClick={() => handleEdit(t.advisor_id)}
                      title="แก้ไข"
                    >
                      <Pencil size={18} color="#026B45" strokeWidth={2.3} />
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() => handleView(t.advisor_id)}
                      title="ดูรายละเอียด"
                    >
                      <Eye size={18} color="#026B45" strokeWidth={2.3} />
                    </button>
                  </td>
                </tr>
              ))}
              {teachers.length === 0 && (
                <tr>
                  <td colSpan={7}>ไม่พบข้อมูลอาจารย์</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .teacher-page {
          padding: 24px;
          background: #fff;
          font-family: "Kanit", sans-serif;
        }
        .teacher-header {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 16px;
        }
        .search-box {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 0.95rem;
        }
        table.teacher-table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          background: #2f3337;
          color: white;
          text-align: center;
          padding: 14px 10px;
          font-weight: 600;
          font-size: 0.95rem;
        }
        td {
          text-align: center;
          padding: 12px 10px;
          font-size: 0.95rem;
        }
        .actions {
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        .icon-btn {
          border: none;
          background: none;
          cursor: pointer;
        }
      `}</style>
    </section>
  );
}
