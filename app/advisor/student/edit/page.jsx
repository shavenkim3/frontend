"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ===== ใช้คอมโพเนนต์ที่มีอยู่ในโปรเจกต์ ===== */
import SidebarTeacher from "@/components/ui/teacher/SidebarTeacher";
import NavbarTeacher from "@/components/ui/teacher/NavbarTeacher";
import TeacherStudentEditHeader from "@/components/ui/teacher/TeacherStudentEditHeader";
import TeacherStudentSearchBar from "@/components/ui/teacher/TeacherStudentSearchBar";

export default function StudentEditPage() {
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const MOBILE_BP = 800;

  const toggleSidebar = () => {
    if (isMobile) setMobileOpen((v) => !v);
    else setCollapsed((v) => !v);
  };

  const handleLogout = () => router.push("/student/login_student");
  const goto = (path) => (e) => {
    e?.preventDefault?.();
    router.push(path);
    if (isMobile) setMobileOpen(false);
  };

  // ===== Prefetch เส้นทางที่ใช้บ่อย =====
  useEffect(() => {
    router.prefetch?.("/admin/student_data");
    router.prefetch?.("/admin/dashboard");
  }, [router]);

  // ===== Resize =====
  const handleResize = useCallback(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1920;
    const mobile = w < MOBILE_BP;
    setIsMobile(mobile);
    if (mobile) {
      setCollapsed(true);
    } else {
      setMobileOpen(false);
      setCollapsed(false);
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // กัน scroll พื้นหลังเมื่อเปิด Drawer
  useEffect(() => {
    if (!(isMobile && mobileOpen)) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobile, mobileOpen]);

  // ปิด Drawer ด้วย ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const sidebarCollapsed = isMobile ? false : collapsed;

  /* =========================
   * 🔎 ค้นหานิสิต
   * ========================= */
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    searchNow("");
  }, []);

  const fetchStudents = async (query) => {
    const url = `/api/students/search?q=${encodeURIComponent(query || "")}`;
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`ค้นหาล้มเหลว (${res.status})`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : data?.items ?? []);
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const searchNow = (query) => fetchStudents(query);

  const onChangeQ = (e) => {
    const v = e.target.value;
    setQ(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchNow(v.trim());
    }, 400);
  };

  const onSubmitSearch = (e) => {
    e.preventDefault();
    searchNow(q.trim());
  };

  const total = results?.length ?? 0;

  return (
    <div
      className={`page-root ${isMobile && mobileOpen ? "mobile-open" : ""}`}
    >
      {/* ===== global fonts ===== */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Kanit:wght@400;600;700&display=swap");
        html,
        body {
          height: 100%;
        }
        body {
          background: #f5f5f5;
          margin: 0;
          font-family: "Kanit", sans-serif;
        }

        /* ===== Sidebar ===== */
        .sidebar {
          position: fixed !important;
          top: 0;
          left: 0;
          height: 100dvh;
          overflow: hidden;
          background: #1a1a1a;
          z-index: 2000;
        }

        /* ===== NavbarAdmin เดิม ยืด/ขยับตาม Sidebar ===== */
        :global(.navbar-admin) {
          position: fixed;
          top: 0;
          height: 72px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          z-index: 1900;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.3s ease;
          padding: 0 20px;
          left: ${collapsed ? "60px" : "220px"};
          width: calc(100% - ${collapsed ? "60px" : "220px"});
        }

        /* ===== Main Area ===== */
        .main {
          margin-left: ${collapsed ? "60px" : "220px"};
          padding: 16px 18px;
          margin-top: 72px;
          transition: margin-left 0.3s ease;
          min-height: 100vh;
          background: #f5f5f5;
        }

        .card {
          background: #fff;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
        }
        .meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          color: #666;
          font-size: 0.95rem;
        }
        .error-text {
          color: #d33;
        }
        .table-wrap {
          margin-top: 12px;
          overflow: auto;
          border: 1px solid #eee;
          border-radius: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        thead th {
          text-align: left;
          background: #f7faf9;
          border-bottom: 1px solid #eee;
          padding: 10px 12px;
          font-weight: 700;
          position: sticky;
          top: 0;
        }
        tbody td {
          border-bottom: 1px solid #f1f1f1;
          padding: 10px 12px;
          vertical-align: top;
        }
        tbody tr:hover {
          background: #fcfffd;
        }
        .pill {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 0.85rem;
          border: 1px solid #e5e5e5;
          background: #fafafa;
        }
        .link {
          color: #2ca26e;
          cursor: pointer;
          text-decoration: underline;
        }
        .search-section {
          margin-top: 30px;
        }

        @media (max-width: 799px) {
          :global(.navbar-admin) {
            left: 0 !important;
            width: 100% !important;
          }

          .main {
            margin-left: 0 !important;
            padding: 84px 16px 16px;
            margin-top: 0;
          }

          :global(.sidebar) {
            width: 280px !important;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 2200 !important;
          }
          .mobile-open :global(.sidebar) {
            transform: translateX(0);
          }

          .drawer-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.38);
            z-index: 2100;
          }
        }
      `}</style>

      {/* ===== Navbar ใช้คอมโพเนนต์เดิม (ไม่ห่อ div) ===== */}
<NavbarTeacher
  collapsed={collapsed}
  isMobile={isMobile}
  onToggle={toggleSidebar}
  onLogout={handleLogout}
  username="Admin username"
/>


      {/* Backdrop สำหรับ Drawer */}
      {isMobile && mobileOpen && (
        <div
          className="drawer-backdrop"
          onClick={() => setMobileOpen(false)}
          role="button"
          aria-label="ปิดเมนู"
        />
      )}

      {/* ===== Sidebar ===== */}
      <SidebarTeacher
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        goto={goto}
      />

      {/* ===== Main ===== */}
      <main className="main">
        <TeacherStudentEditHeader title="แก้ไขข้อมูลนิสิต" />
        <div className="search-section">
          <div className="card">
            <TeacherStudentSearchBar
              value={q}
              onChange={onChangeQ}
              onSubmit={onSubmitSearch}
              loading={loading}
            />
            <div className="meta">
              <span>
                ผลลัพธ์: <b>{total}</b> รายการ
              </span>
              {loading ? (
                <span>กำลังค้นหา...</span>
              ) : error ? (
                <span className="error-text">ผิดพลาด: {error}</span>
              ) : (
                <span />
              )}
            </div>

            <div className="table-wrap" aria-live="polite">
              {loading && (
                <div style={{ padding: 12, color: "#666" }}>
                  กำลังโหลดข้อมูล...
                </div>
              )}

              {!loading && total === 0 && (
                <div style={{ padding: 16, color: "#777" }}>
                  ไม่พบบันทึกนิสิตที่ตรงกับคำค้น
                  {q ? "" : " (ยังไม่พิมพ์คำค้นหรือระบบไม่มีข้อมูล)"}
                </div>
              )}

              {!loading && total > 0 && (
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: 140 }}>รหัสนิสิต</th>
                      <th>ชื่อ-นามสกุล</th>
                      <th style={{ width: 120 }}>ภาค</th>
                      <th style={{ width: 160 }}>อาจารย์ที่ปรึกษา</th>
                      <th style={{ width: 140 }}>หัวข้อ</th>
                      <th style={{ width: 120 }}>สถานะ</th>
                      <th style={{ width: 110 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((s) => (
                      <tr key={s.id ?? s.studentId}>
                        <td>{s.studentId || "-"}</td>
                        <td>{s.fullName || s.name || "-"}</td>
                        <td>
                          <span className="pill">
                            {s.program || s.section || "-"}
                          </span>
                        </td>
                        <td>{s.advisor || "-"}</td>
                        <td>{s.topic || "-"}</td>
                        <td>
                          <span className="pill">
                            {s.status || "-"}
                          </span>
                        </td>
                        <td>
                          <span
                            className="link"
                            onClick={() => {
                              const id = s.id ?? s.studentId;
                              if (id)
                                router.push(
                                  `/admin/student_data/edit/${encodeURIComponent(
                                    id
                                  )}`
                                );
                            }}
                          >
                            แก้ไข
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
