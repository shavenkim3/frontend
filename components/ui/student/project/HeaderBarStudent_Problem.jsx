"use client";

import React from "react";
import { Menu, Bell, LogOut } from "lucide-react";
import { useStudentMe } from "@/hooks/useStudentMe";
import { useLogout } from "@/hooks/useLogout";

export default function HeaderBarStudent_Problem({
  title = "ระบบจัดการข้อมูลปัญหาพิเศษ",
  isMobile,
  setMobileOpen,
  showUser = true,
}) {
  const { me, loading, err } = useStudentMe();
  const { logout, loading: loggingOut } = useLogout();

  const fullName = me
    ? `${me.first_name || ""} ${me.last_name || ""}`.trim()
    : "";
  const studentId = me?.student_id || "";

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <header className="header">
        {/* ✅ ปุ่มเมนู (ซ้ายสุด) */}
        {isMobile && (
          <button
            className="menu-btn"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <Menu size={24} />
          </button>
        )}

        {/* ✅ title อยู่ตรงกลางแน่นอน */}
        <div className="header-center-fixed">
          <h1>{title}</h1>
        </div>

        {/* ✅ user info (อยู่ขวาเหมือนเดิม) */}
        {showUser && (
          <div className="user-info">
            <Bell size={22} />
            {loading ? (
              <span className="loading">กำลังโหลด...</span>
            ) : err ? (
              <span className="error">โหลดข้อมูลล้มเหลว</span>
            ) : (
              me && (
                <>
                  <span className="id">{studentId}</span>
                  <span className="name">{fullName}</span>
                </>
              )
            )}
            <button
              className="logout"
              onClick={() => logout("/student/login_student")}
              disabled={loggingOut}
              title={loggingOut ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}
            >
              <LogOut size={22} />
            </button>
          </div>
        )}
      </header>

      {isMobile && me && !loading && (
        <div className="mobile-username-bar">
          {studentId} {fullName}
        </div>
      )}

      {/* ---------- STYLES ---------- */}
      <style jsx>{`
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
          justify-content: space-between;
          padding: 18px 24px;
          z-index: 1100;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .menu-btn {
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ✅ fix title อยู่กลางแน่นอน */
        .header-center-fixed {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          pointer-events: none;
        }

        .header-center-fixed h1 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
          white-space: nowrap;
        }

        /* ✅ user info อยู่ขวาเหมือนเดิม */
        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-left: auto;
        }

        .id,
        .name,
        .loading,
        .error {
          font-weight: 500;
          font-size: 0.95rem;
        }

        .error {
          color: #ffeb3b;
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

        .logout[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
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
