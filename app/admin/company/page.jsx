"use client";

import React, { useState, useCallback, useEffect } from "react";
import SidebarAdmin from "@/components/ui/admin/SidebarAdmin";
import HeaderBarAdmin_Problem from "@/components/ui/admin/HeaderBarAdmin_Problem";
import CompanyManagement from "@/components/ui/admin/CompanyManagement";

export default function AdminCompanyPage() {
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
    ${collapsed ? "collapsed" : ""}
    ${isMobile ? "mobile" : ""}
  `;

  // ✅ ความสูงของ Header (ใช้ตรง padding-top)
  const HEADER_HEIGHT = 72;

  return (
    <div className={rootClass}>
      {/* ✅ Sidebar */}
      <SidebarAdmin
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* ✅ Header (ลอยบนสุด) */}
      <header
        className="header-wrapper"
        style={{
          left: collapsed ? "70px" : "230px",
          width: collapsed ? "calc(100% - 70px)" : "calc(100% - 230px)",
        }}
      >
        <HeaderBarAdmin_Problem
          title="จัดการข้อมูลบริษัท"
          isMobile={isMobile}
          setMobileOpen={setMobileOpen}
        />
      </header>

      {/* ✅ เนื้อหาหลัก */}
      <main
        className="main-content"
        style={{
          marginLeft: collapsed ? "70px" : "230px",
          paddingTop: `${HEADER_HEIGHT}px`,
        }}
      >
        <CompanyManagement />
      </main>

      <style jsx>{`
        .layout {
          display: flex;
          flex-direction: row;
          min-height: 100vh;
          background: #f7f8fa;
        }

        /* Header: ลอยค้างไว้บนสุด */
        .header-wrapper {
          position: fixed;
          top: 0;
          height: ${HEADER_HEIGHT}px;
          z-index: 1000;
          background: #ffffff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        /* ส่วนเนื้อหา */
        .main-content {
          flex: 1;
          overflow-y: auto;
          transition: all 0.3s ease;
        }

        @media (max-width: 799px) {
          .header-wrapper {
            left: 0 !important;
            width: 100% !important;
          }
          .main-content {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
