"use client";

import React, { useState, useEffect, useCallback } from "react";
import SidebarAdmin from "@/components/ui/admin/SidebarAdmin";
import HeaderBarAdmin_Problem from "@/components/ui/admin/HeaderBarAdmin_Problem";
import WelcomeSectionAdmin_teacher from "@/components/ui/admin/WelcomeSectionAdmin_teacher";
import TeacherManagement from "@/components/ui/admin/TeacherManagement";

export default function AdminTeacherPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const MOBILE_BP = 799;

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
      {/* ---------- โหลดฟอนต์ Kanit ---------- */}
      <link
        href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ---------- Sidebar ---------- */}
      <SidebarAdmin
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* ---------- Overlay Backdrop (มือถือ) ---------- */}
      {isMobile && mobileOpen && (
        <div className="drawer-backdrop" onClick={() => setMobileOpen(false)} />
      )}

      {/* ---------- Main ---------- */}
      <main className="main">
        <HeaderBarAdmin_Problem
          isMobile={isMobile}
          setMobileOpen={setMobileOpen}
          title="ระบบจัดการข้อมูลปัญหาพิเศษและสหกิจศึกษา"
          showUser={true}
        />

        {/* ✅ Welcome Section ของครู */}
        <WelcomeSectionAdmin_teacher />

        {/* ✅ แทรกหน้า TeacherManagement */}
        <section className="teacher-section">
          <TeacherManagement />
        </section>
      </main>

      {/* ---------- Global Styles ---------- */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap");

        * {
          box-sizing: border-box;
          font-family: "Kanit", sans-serif !important;
        }

        body {
          margin: 0;
          background: #f5f5f5;
          font-family: "Kanit", sans-serif;
        }

        .layout {
          display: flex;
          min-height: 100vh;
          width: 100%;
        }

        /* ===== Sidebar ===== */
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

        /* ===== Main ===== */
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

        /* ===== Responsive (มือถือ) ===== */
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
          margin-right: 10px;
        }

        .header-center {
          flex: 1;
          text-align: center;
        }

        .header h1 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          transition: font-size 0.3s ease;
        }

        @media (max-width: 700px) {
          .header h1 {
            font-size: 1.1rem;
          }
        }

        @media (max-width: 600px) {
          .header h1 {
            font-size: 1rem;
          }
        }

        @media (max-width: 550px) {
          .header h1 {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 450px) {
          .header h1 {
            font-size: 0.8rem;
          }
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logout {
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
        }

        /* ===== Welcome Section ===== */
        .welcome {
          background: #f9f9f9;
          padding: 20px 28px;
        }

        .time {
          color: #03a96b;
        }

        /* ===== Teacher Section ===== */
        .teacher-section {
          flex: 1;
          padding: 20px 28px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
          gap: 20px;
          transition: all 0.3s ease;
        }

        /* ===== Responsive Layout สำหรับจอเล็กกว่า 1400px ===== */
        @media (max-width: 1400px) {
          .teacher-section {
            grid-template-columns: 1fr; /* ✅ เปลี่ยนเป็นแนวตั้งเต็มความกว้าง */
            padding: 14px;
          }

          /* ปรับการ์ดให้พอดีจอ */
          .teacher-card {
            width: 100%;
            margin: 0 auto;
            border-radius: 10px;
          }
        }

        /* ===== ปรับโทนปุ่มและการ์ด ===== */
        .teacher-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 18px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          transition: box-shadow 0.2s ease;
        }

        .teacher-card:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
        }

        .teacher-status {
          display: inline-block;
          background: #03a96b;
          color: #fff;
          padding: 6px 16px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .teacher-card h3 {
          margin: 0 0 6px;
          font-size: 1.05rem;
          font-weight: 600;
        }

        .teacher-card p {
          margin: 2px 0;
          font-size: 0.9rem;
          color: #333;
        }

        .teacher-card .actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 10px;
        }

        .teacher-card .actions button {
          border-radius: 50%;
          width: 36px;
          height: 36px;
          border: 1px solid #d0d7de;
          background: #fff;
          cursor: pointer;
          transition: background 0.2s;
        }

        .teacher-card .actions button:hover {
          background: #e6f4ef;
        }
      `}</style>
    </div>
  );
}
