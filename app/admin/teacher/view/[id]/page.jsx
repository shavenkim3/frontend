"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import SidebarAdmin from "@/components/ui/admin/SidebarAdmin";
import HeaderBarAdmin_Problem from "@/components/ui/admin/HeaderBarAdmin_Problem";
import WelcomeSectionAdmin_view from "@/components/ui/admin/WelcomeSectionAdmin_view";
import AdminStudentListPageView from "@/components/ui/admin/AdminStudentListPageView";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getAdminToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token") ||
    ""
  );
}

export default function AdminTeacherViewPage() {
  const { id } = useParams(); // advisor_id
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const MOBILE_BP = 900;

  // ✅ Responsive
  const handleResize = useCallback(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1920;
    const mobile = w <= MOBILE_BP;
    setIsMobile(mobile);
    if (mobile) setCollapsed(false);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const rootClass = `
    layout
    ${isMobile ? "" : collapsed ? "is-collapsed" : ""}
    ${isMobile && mobileOpen ? "mobile-open" : ""}
  `;

  // ✅ โหลดข้อมูลจริงจาก backend
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setErr("");
        const token = getAdminToken();

        const [infoRes, stuRes] = await Promise.all([
          fetch(`${API_URL}/admin/advisors/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/admin/advisors/${id}/students`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!infoRes.ok) throw new Error("โหลดข้อมูลอาจารย์ไม่สำเร็จ");
        if (!stuRes.ok) throw new Error("โหลดรายชื่อนิสิตไม่สำเร็จ");

        const infoData = await infoRes.json();
        const stuData = await stuRes.json();

        setTeacher(infoData);
        setStudents(stuData.items || []);
      } catch (e) {
        console.error("fetch error:", e);
        setErr("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ✅ แสดงผล
  if (loading) return <p className="p-5">⏳ กำลังโหลดข้อมูล...</p>;
  if (err) return <p className="p-5 text-red-600">{err}</p>;

  return (
    <div className={rootClass}>
      <link
        href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <SidebarAdmin
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {isMobile && mobileOpen && (
        <div className="drawer-backdrop" onClick={() => setMobileOpen(false)} />
      )}

      <main className="main">
        <HeaderBarAdmin_Problem
          isMobile={isMobile}
          setMobileOpen={setMobileOpen}
          title="ระบบจัดการข้อมูลปัญหาพิเศษและสหกิจศึกษา"
          showUser={true}
        />

        <WelcomeSectionAdmin_view />

        {/* ✅ หัวข้อชื่ออาจารย์ */}
        <div className="advisor-header">
          <div className="bar"></div>
          {teacher ? (
            <h2>
              นิสิตในที่ปรึกษาของ{" "}
              <span className="advisor-name">{teacher.name}</span>{" "}
              <span className="count">({students.length} รายการ)</span>
            </h2>
          ) : (
            <p>ไม่พบข้อมูลอาจารย์</p>
          )}
        </div>

        {/* ✅ ตารางนิสิต */}
        <section className="student-list-section">
          <AdminStudentListPageView studentsData={students} />
        </section>
      </main>

      {/* ✅ CSS */}
      <style jsx global>{`
        body {
          margin: 0;
          background: #fff;
          font-family: "Kanit", sans-serif;
        }
        .layout {
          display: flex;
          min-height: 100vh;
          width: 100%;
          overflow-x: hidden;
        }
        .main {
          flex: 1;
          background: #ffffff;
          min-height: 100vh;
          margin-left: 230px;
          transition: margin-left 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        .is-collapsed .main {
          margin-left: 70px;
        }
        .advisor-header {
          display: flex;
          align-items: center;
          padding: 14px 28px;
          margin-top: 10px;
        }
        .advisor-header .bar {
          width: 6px;
          height: 28px;
          background-color: #03a96b;
          border-radius: 4px;
          margin-right: 12px;
        }
        .advisor-header h2 {
          font-size: 1.05rem;
          font-weight: 600;
          color: #000;
        }
        .advisor-header .advisor-name {
          color: #03a96b;
        }
        @media (max-width: ${MOBILE_BP}px) {
          .main {
            margin-left: 0 !important;
          }
          .drawer-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.4);
            z-index: 1000;
          }
        }
      `}</style>
    </div>
  );
}
