"use client";

import React, { useState, useEffect, useCallback } from "react";
import SidebarProject from "@/components/ui/student/project/SidebarProject";
import HeaderBarStudent_Problem from "@/components/ui/student/project/HeaderBarStudent_Problem";
import WelcomeSectionStudent_search from "@/components/ui/student/project/WelcomeSectionStudent_search";
import SearchStudentProject from "@/components/ui/student/SearchStudentProject"; // ✅ เพิ่ม component ใหม่

export default function StudentProjectPage() {
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
      <SidebarProject
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
        <HeaderBarStudent_Problem
          isMobile={isMobile}
          setMobileOpen={setMobileOpen}
          title="ระบบจัดการข้อมูลปัญหาพิเศษ"
          showUser={true}
        />

        {/* ส่วนต้อนรับ (คงไว้เหมือนเดิม) */}
        <WelcomeSectionStudent_search />

        {/* ✅ ส่วนค้นหาข้อมูล (Component ใหม่) */}
        <div className="search-section">
          <SearchStudentProject />
        </div>
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

        .main {
          flex: 1;
          background: #fff;
          min-height: 100vh;
          margin-left: 230px;
          transition: margin-left 0.3s ease;
        }
        .is-collapsed .main {
          margin-left: 70px;
        }

        .search-section {
          padding: 0 24px 24px;
          background: #fff;
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

        .mobile-username-bar {
          background-color: #02975f;
          color: white;
          text-align: center;
          font-size: 0.95rem;
          font-weight: 500;
          padding: 8px 0;
        }

        /* ===== Welcome Section ===== */
        .welcome {
          background: #f9f9f9;
          padding: 20px 28px;
        }
        .time {
          color: #03a96b;
        }
      `}</style>
    </div>
  );
}
