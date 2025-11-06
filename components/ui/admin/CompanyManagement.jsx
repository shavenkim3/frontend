"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Eye, Building2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getAdminToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token") ||
    ""
  );
}

export default function CompanyManagement() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  /** 🔹 โหลดข้อมูลจาก backend */
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setErr("");
        const token = getAdminToken();

        const res = await fetch(
          `${API_URL}/admin/companies?q=${encodeURIComponent(search)}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setCompanies(data.items || []);
      } catch (e) {
        console.error("fetchCompanies error:", e);
        setErr("ไม่สามารถโหลดข้อมูลบริษัทได้");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [search]);

  const handleEdit = (id) => router.push(`/admin/company/edit/${id}`);
  const handleView = (id) => router.push(`/admin/company/view/${id}`);

  return (
    <section className="company-page">
      <div className="company-header">
        <div className="header-left">
          <Building2 size={26} color="#026B45" />
          <h2>จัดการข้อมูลบริษัท</h2>
        </div>
        <input
          type="text"
          placeholder="ค้นหาชื่อบริษัท / อีเมล / เบอร์โทร..."
          className="search-box"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p>⏳ กำลังโหลดข้อมูล...</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}

      {!loading && !err && (
        <div className="company-table-wrapper">
          <table className="company-table">
            <thead>
              <tr>
                <th>Company ID</th>
                <th>ชื่อบริษัท</th>
                <th>อีเมล</th>
                <th>เบอร์โทร</th>
                <th>เว็บไซต์</th>
                <th>จำนวนนิสิตที่ฝึกงาน</th>
                <th>ดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.company_id}>
                  <td>{c.company_id}</td>
                  <td>{c.name || "-"}</td>
                  <td>{c.email || "-"}</td>
                  <td>{c.phone_main || "-"}</td>
                  <td>
                    {c.website ? (
                      <a
                        href={c.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                      >
                        {c.website}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{c.internships_count ?? 0}</td>
                  <td className="actions">
                    <button
                      className="icon-btn"
                      onClick={() => handleEdit(c.company_id)}
                      title="แก้ไข"
                    >
                      <Pencil size={18} color="#026B45" strokeWidth={2.3} />
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() => handleView(c.company_id)}
                      title="ดูรายละเอียด"
                    >
                      <Eye size={18} color="#026B45" strokeWidth={2.3} />
                    </button>
                  </td>
                </tr>
              ))}
              {companies.length === 0 && (
                <tr>
                  <td colSpan={7}>ไม่พบข้อมูลบริษัท</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .company-page {
          padding: 24px;
          background: #fff;
          font-family: "Kanit", sans-serif;
        }

        .company-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        h2 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #026b45;
        }

        .search-box {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 0.95rem;
        }

        table.company-table {
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

        .link {
          color: #026b45;
          text-decoration: underline;
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
