"use client";

import React from "react";
import { Menu, Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeaderBarAdvisor_Problem({
  title = "ระบบจัดการข้อมูลปัญหาพิเศษและสหกิจศึกษา",
  isMobile,
  setMobileOpen,
  showUser = true,
}) {
  const router = useRouter();

  return (
    <>
      {/* โหลดฟอนต์ Kanit */}
      <link
        href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <header className="header">
        {/* ปุ่มเปิด Sidebar สำหรับมือถือ */}
        {isMobile && (
          <button className="menu-btn" onClick={() => setMobileOpen((v) => !v)}>
            <Menu size={24} />
          </button>
        )}

        {/* หัวข้อของหน้า */}
        <div className="header-center">
          <h1>{title}</h1>
        </div>

        {/* ส่วนข้อมูลผู้ใช้ */}
        {showUser && (
          <div className="user-info">
            <Bell size={22} />
            {!isMobile && (
              <>
                <span className="id">6521653555</span>
                <span className="name">ไชยพร</span>
              </>
            )}
            <button
              className="logout"
              onClick={() => router.push("/student/login")}
            >
              <LogOut size={22} />
            </button>
          </div>
        )}
      </header>

      {/* แถบชื่อผู้ใช้ (เฉพาะมือถือ) */}
      {isMobile && <div className="mobile-username-bar">6521653555 ไชยพร</div>}

      {/* ---------- STYLES ---------- */}
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap");

        * {
          font-family: "Kanit", sans-serif !important;
        }

        .header {
          position: sticky;
          top: 0;
          background-color: #03a96b;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center; /* ✅ ให้อยู่ตรงกลางเสมอ */
          padding: 18px 24px;
          z-index: 1100;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        /* ทำให้ปุ่มและ user-info ไม่ดันข้อความ */
        .menu-btn,
        .user-info {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
        }

        .menu-btn {
          left: 16px;
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
        }

        .user-info {
          right: 16px;
          gap: 10px;
        }

        .header-center h1 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 500;
          letter-spacing: 0.3px;
          text-align: center;
        }

        .id,
        .name {
          font-weight: 500;
          font-size: 0.95rem;
        }

        .logout {
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: opacity 0.2s ease;
        }

        .logout:hover {
          opacity: 0.8;
        }

        .mobile-username-bar {
          background-color: #02975f;
          color: white;
          text-align: center;
          font-size: 0.95rem;
          font-weight: 500;
          padding: 8px 0;
        }
      `}</style>
    </>
  );
}
