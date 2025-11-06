"use client";

import React, { useState, useEffect, useCallback } from "react";
import SidebarAdmin from "@/components/ui/admin/SidebarAdmin";
import HeaderBarAdmin_Problem from "@/components/ui/admin/HeaderBarAdmin_Problem";
import WelcomeSectionAdmin_student from "@/components/ui/admin/WelcomeSectionAdmin_student";
import AdminStudentListPage from "@/components/ui/admin/AdminStudentListPage";

export default function AdminStudentPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const MOBILE_BP = 900;

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

  return (
    <div className={rootClass}>
      {/* โหลดฟอนต์ Kanit */}
      <link
        href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Sidebar */}
      <SidebarAdmin
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Overlay มือถือ */}
      {isMobile && mobileOpen && (
        <div className="drawer-backdrop" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <main className="main">
        <HeaderBarAdmin_Problem
          isMobile={isMobile}
          setMobileOpen={setMobileOpen}
          title="ระบบจัดการข้อมูลปัญหาพิเศษและสหกิจศึกษา"
          showUser={true}
        />

        <WelcomeSectionAdmin_student />

        {/* ✅ ตารางนิสิต */}
        <section className="student-list-section">
          <AdminStudentListPage />
        </section>
      </main>

      {/* ✅ Global CSS */}
      <style jsx global>{`
        * {
          box-sizing: border-box;
          font-family: "Kanit", sans-serif !important;
        }

        body {
          margin: 0;
          background: #f5f5f5;
          font-family: "Kanit", sans-serif;
          overflow-x: hidden;
        }

        .layout {
          display: flex;
          min-height: 100vh;
          width: 100%;
          overflow-x: hidden;
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100dvh;
          width: 230px;
          background-color: #2f3337;
          color: #b0b3b8;
          transition: width 0.3s ease, transform 0.3s ease;
          z-index: 2000;
        }

        .sidebar.collapsed {
          width: 70px;
        }

        .main {
          flex: 1;
          background: #fff;
          min-height: 100vh;
          margin-left: 230px;
          transition: margin-left 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .is-collapsed .main {
          margin-left: 70px;
        }

        @media (max-width: ${MOBILE_BP}px) {
          .sidebar {
            width: 260px;
            transform: translateX(-100%);
          }
          .mobile-open .sidebar {
            transform: translateX(0);
          }
          .main {
            margin-left: 0 !important;
          }
          .drawer-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
            z-index: 1000;
          }
        }

        /* ===== Header ===== */
        .header {
          position: sticky;
          top: 0;
          background-color: #03a96b;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          z-index: 1100;
          flex-wrap: wrap;
        }

        .menu-btn {
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
        }

        .header-center {
          flex: 1;
          text-align: center;
        }

        .header h1 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        /* ===== Section Welcome ===== */
        .welcome {
          background: #f9f9f9;
          padding: 20px 28px;
        }

        .time {
          color: #03a96b;
        }

        /* ✅ Layout ส่วนตาราง + Filter (แก้ช่องว่างขวา) */
        .student-list-section {
          flex: 1;
          width: 100%;
          display: block; /* ✅ เปลี่ยนจาก flex เป็น block เพื่อป้องกันพื้นที่เหลือ */
          padding: 0;
          background: #f5f5f5;
          overflow-x: hidden;
        }

        /* ===== Responsive Filter Icon/Panel ===== */
        @media (max-width: 1350px) {
          .custom-filter\:hidden {
            display: none !important;
          }
          .custom-filter-icon\:flex {
            display: flex !important;
          }
          .student-list-section {
            display: block !important; /* ✅ block layout = ไม่มีช่องว่างขวา */
          }
        }

        /* ===== Table Responsive ===== */
        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          font-size: 0.9rem;
          padding: 8px;
        }

        @media (max-width: 768px) {
          th,
          td {
            font-size: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          table {
            display: block;
            overflow-x: auto;
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
}
