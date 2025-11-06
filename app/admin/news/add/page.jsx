"use client";

import React, { useState, useEffect, useCallback } from "react";
import SidebarAdmin from "@/components/ui/admin/SidebarAdmin";
import HeaderBarAdmin_Problem from "@/components/ui/admin/HeaderBarAdmin_Problem";
import WelcomeSectionAdmin_newsAdd from "@/components/ui/admin/WelcomeSectionAdmin_newsAdd";
import AdminNewsAddForm from "@/components/ui/admin/AdminNewsAddForm"; // ✅ นำเข้าฟอร์ม

export default function AdminNewsAddPage() {
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

  // ✅ mock save function
  const handleSave = (formData) => {
    alert("✅ (Mock) บันทึกข่าวเรียบร้อย!\n\n" + JSON.stringify(formData, null, 2));
    window.history.back();
  };

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

        {/* ส่วน Welcome เดิม (ยังอยู่) */}
        <WelcomeSectionAdmin_newsAdd />

        {/* ✅ ส่วนฟอร์มเพิ่มข่าว */}
        <section className="news-add-section">
          <AdminNewsAddForm
            onCancel={() => window.history.back()}
            onSave={handleSave}
          />
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
          padding-bottom: 40px;
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

        /* ✅ ปรับขนาดฟอนต์หัวข้อแบบ responsive */
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

        /* ✅ ฟอร์มข่าว */
        .news-add-section {
          padding: 30px 50px;       /* เพิ่ม padding ด้านข้าง */
          max-width: 1500px;        /* ✅ ขยายฟอร์มให้ใหญ่ขึ้น */
          width: 100%;
          margin: 0 auto;
        }


        .section-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #03a96b;
          margin-bottom: 16px;
          border-left: 5px solid #03a96b;
          padding-left: 10px;
        }
      `}</style>
    </div>
  );
}
