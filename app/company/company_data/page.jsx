"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import SidebarCompany from "@/components/ui/company/SidebarCompany";
import NavbarCompany from "@/components/ui/company/NavbarCompany";
import CompanyHeader from "@/components/ui/company/CompanyHeader";
import CompanySearchBox from "@/components/ui/company/CompanySearchBox";
import MentorStudentsTableDesktop from "@/components/ui/company/mentor/MentorStudentsTableDesktop";
import MentorStudentsListMobile from "@/components/ui/company/mentor/MentorStudentsListMobile";

import { fetchMentorStudents } from "@/lib/companyMentorApi";

export default function CompanyDataPage() {
  const router = useRouter();
  const MOBILE_BP = 800;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCompactTable, setIsCompactTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // === states สำหรับข้อมูลจริง ===
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const onResize = () => setIsCompactTable(window.innerWidth <= 1144);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ✅ โหลดข้อมูลจริงจาก backend
  async function loadStudents() {
    try {
      setLoading(true);
      setError("");
      const rows = await fetchMentorStudents({ q: searchTerm });

      const mapped = rows.map((r) => ({
        id: String(r.student_id),
        name: `${r.first_name || ""} ${r.last_name || ""}`.trim(),
        dept: r.department || r.program_type || "-",
        advisor: r.advisor_name || "-",
        topic: r.program_type === "coop" ? "สหกิจ" : "ปัญหาพิเศษ",
        result: r.status || "-",
      }));

      setStudents(mapped);
    } catch (e) {
      setError(e.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, [searchTerm]);

  const toggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < MOBILE_BP) {
      setMobileOpen((v) => !v);
    } else {
      setCollapsed((v) => !v);
    }
  };

  const handleLogout = () => router.push("/company/login_company");

  const handleEvaluate = (r) => router.push(`/company/evaluation?id=${r.id}`);
  const handleView = (r) => router.push(`/company/student_data/view?id=${r.id}`);

  return (
    <div className={`${mobileOpen ? "mobile-open" : ""}`}>
      <div className="layout">
        <aside className="sidebar-area">
          <SidebarCompany
            collapsed={collapsed}
            onToggle={toggleSidebar}
            goto={(path) => (e) => {
              e.preventDefault();
              router.push(path);
            }}
          />
        </aside>

        <header className="navbar-area">
          <NavbarCompany onLogout={handleLogout} onMenuClick={toggleSidebar} />
        </header>

        <main className="main-area">
          <div className="page-container">
            <div className="page-header">
              <CompanyHeader />
            </div>

            <div className="content-box">
              <CompanySearchBox
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />

              {error && (
                <div className="text-red-600 mb-3">⚠️ {error}</div>
              )}

              {loading ? (
                <div className="text-gray-500 p-6 text-center">
                  กำลังโหลดข้อมูล...
                </div>
              ) : isCompactTable ? (
                <MentorStudentsListMobile
                  rows={students}
                  onEvaluate={handleEvaluate}
                  onView={handleView}
                />
              ) : (
                <MentorStudentsTableDesktop
                  rows={students}
                  onEvaluate={handleEvaluate}
                  onView={handleView}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .layout {
          display: grid;
          grid-template-columns: ${collapsed ? "60px" : "220px"} 1fr;
          grid-template-rows: 56px 1fr;
          min-height: 100vh;
          background: #f5f5f5;
          transition: grid-template-columns 0.3s ease;
        }
        .sidebar-area {
          grid-column: 1/2;
          grid-row: 1/3;
          overflow: hidden;
        }
        .navbar-area {
          grid-column: 2/3;
          grid-row: 1/2;
        }
        .main-area {
          grid-column: 2/3;
          grid-row: 2/3;
          padding: 30px 20px 20px;
        }
        .page-container {
          width: 100%;
          margin: 0 auto;
          padding: 0 10px;
        }
        .content-box {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
          padding: 24px;
          margin-top: 16px;
        }
      `}</style>
    </div>
  );
}
