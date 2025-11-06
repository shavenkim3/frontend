"use client";

import React, { useState, useEffect, useCallback } from "react";
import SidebarProject from "@/components/ui/student/project/SidebarProject";
import HeaderBarStudent_Problem from "@/components/ui/student/project/HeaderBarStudent_Problem";
import WelcomeSectionStudent_upload from "@/components/ui/student/project/WelcomeSectionStudent_upload";
import StudentUploadBox from "@/components/ui/student/project/StudentUploadBox";

export default function StudentProjectUploadPage() {
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
      <link
        href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <SidebarProject
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
        <HeaderBarStudent_Problem
          isMobile={isMobile}
          setMobileOpen={setMobileOpen}
          title="ระบบจัดการข้อมูลปัญหาพิเศษ"
          showUser={true}
        />

        {/* ส่วน Welcome ห้ามแตะ */}
        <WelcomeSectionStudent_upload />

        {/* ส่วนอัปโหลด (Component) */}
        <StudentUploadBox />
      </main>

      <style jsx global>{`
        * {
          box-sizing: border-box;
          font-family: "Kanit", sans-serif !important;
        }

        body {
          margin: 0;
          background: #f5f5f5;
        }

        .layout {
          display: flex;
          min-height: 100vh;
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

        .welcome {
          background: #f9f9f9;
          padding: 20px 28px;
        }

        .time {
          color: #03a96b; /* สีเขียวเหมือนเดิม */
        }
      `}</style>
    </div>
  );
}
