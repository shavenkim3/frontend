"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import SidebarCompany from "@/components/ui/company/SidebarCompany";
import NavbarCompany from "@/components/ui/company/NavbarCompany";
import CompanyHeader from "@/components/ui/company/AddCompanyHeader";

// === Sections ===
import InternshipForm from "@/components/ui/company/InternshipForm";
import CompanyInfoForm from "@/components/ui/company/CompanyInfoForm";
import EvaluationTable from "@/components/ui/company/EvaluationTable";
import SupervisorFeedback from "@/components/ui/company/SupervisorFeedback";

export default function CompanyEvaluationPage() {
  const router = useRouter();
  const MOBILE_BP = 800;

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ Handle window resize
  const handleResize = useCallback(() => {
    if (typeof window === "undefined") return;
    const w = window.innerWidth;
    const mobile = w < MOBILE_BP;
    setIsMobile(mobile);
    if (mobile) setCollapsed(true);
    else {
      setMobileOpen(false);
      setCollapsed(false);
    }
  }, []);

  useEffect(() => {
    handleResize();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize, { passive: true });
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [handleResize]);

  const handleLogout = () => router.push("/company/login_company");

  const toggleSidebar = () => {
    if (isMobile) setMobileOpen((v) => !v);
    else setCollapsed((v) => !v);
  };

  const sidebarCollapsed = isMobile ? false : collapsed;

  return (
    <div
      className={`evaluation-page page-root ${
        isMobile && mobileOpen ? "mobile-open" : ""
      } ${collapsed ? "collapsed" : "expanded"}`}
      style={{ fontFamily: "Kanit, sans-serif", background: "#f5f5f5" }}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Kanit:wght@400;600;700&display=swap");

        html,
        body,
        #__next {
          height: 100%;
          margin: 0;
          padding: 0;
          background: #f5f5f5;
        }

        * {
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
        }

        /* ===== SIDEBAR ===== */
        :global(.sidebar) {
          position: fixed !important;
          top: 0;
          left: 0;
          height: 100dvh;
          width: 220px;
          background: #2f3337;
          z-index: 1100;
          transition: width 0.3s ease;
        }
        .page-root.collapsed :global(.sidebar) {
          width: 60px;
        }

        /* ===== DRAWER BACKDROP ===== */
        .drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.38);
          z-index: 1500;
        }

        /* ===== MAIN CONTENT ===== */
        .main {
          padding: 80px 24px 40px;
          min-height: 100vh;
          transition: margin-left 0.3s ease, width 0.3s ease;
        }
        .page-root.expanded .main {
          margin-left: 220px;
          width: calc(100% - 220px);
        }
        .page-root.collapsed .main {
          margin-left: 60px;
          width: calc(100% - 60px);
        }

        /* ===== RESPONSIVE (MOBILE) ===== */
        @media (max-width: 799px) {
          .main {
            margin-left: 0 !important;
            width: 100% !important;
            padding: 84px 14px 20px;
          }
          :global(.sidebar) {
            width: 280px !important;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          .mobile-open :global(.sidebar) {
            transform: translateX(0);
          }
        }

        /* ===== SECTION WRAPPERS ===== */
        .section {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px 18px;
          margin-bottom: 20px;
        }
        .section-student-id {
          margin-top: 20px;
        }

        /* ===== TAB HEADER ===== */
        .tab-header {
          background: #059669;
          color: #ffffff;
          font-weight: 700;
          border-radius: 8px;
          padding: 10px 16px;
          margin: 20px 0 12px;
          font-size: 16px;
        }

        /* ===== INPUT FIELDS ===== */
        label {
          font-weight: 600;
          color: #374151;
          font-size: 15px;
          margin-bottom: 6px;
        }
        input,
        textarea,
        select {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 15px;
          background: #ffffff;
          font-family: "Kanit", sans-serif;
        }
        textarea {
          resize: none;
          height: 90px;
        }
        input:focus,
        textarea:focus {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
        }

        /* ===== STUDENT ID BOX ===== */
        .student-id-wrapper {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .student-id-wrapper label {
          font-weight: 700;
          color: #374151;
          font-size: 15px;
        }
        .student-id-box {
          width: 100%;
          background: transparent;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          padding: 10px 12px;
          font-size: 16px;
          color: #111827;
        }

        /* ===== TABLE ===== */
        .table-wrap {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
        }
        .table-scroller {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 720px;
          background: #fff;
          font-family: "Kanit", sans-serif;
        }
        th,
        td {
          border: 1px solid #d1d5db;
          padding: 10px 12px;
          text-align: center;
          font-size: 14px;
        }
        th {
          background: #059669;
          color: #fff;
          font-weight: 600;
        }
        td:first-child {
          text-align: left;
        }

        /* ===== BUTTONS ===== */
        .action-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 30px;
        }
        .btn {
          padding: 10px 24px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: 2px solid transparent;
        }
        .btn-save {
          background: #059669;
          color: #fff;
        }
        .btn-save:hover {
          background: #047857;
        }
        .btn-cancel {
          background: #fff;
          border-color: #10b981;
          color: #059669;
        }
        .btn-cancel:hover {
          background: #ecfdf5;
        }
        @media (max-width: 640px) {
          .action-buttons {
            flex-direction: column-reverse;
          }
          .btn {
            width: 100%;
          }
        }
      `}</style>

      {/* ---------- NAVBAR ---------- */}
      <NavbarCompany
        collapsed={collapsed}
        username="UserName"
        onLogout={handleLogout}
        onMenuClick={toggleSidebar}
        onToggleSidebar={toggleSidebar}
      />

      {isMobile && mobileOpen && (
        <div className="drawer-backdrop" onClick={() => setMobileOpen(false)} />
      )}

      {/* ---------- SIDEBAR ---------- */}
      <SidebarCompany
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        goto={(path) => (e) => {
          e.preventDefault();
          router.push(path);
          if (isMobile) setMobileOpen(false);
        }}
      />

      {/* ---------- MAIN CONTENT ---------- */}
      <main className="main">
        <CompanyHeader />

       

        <div className="tab-header">ข้อมูลการฝึกงาน</div>
        <div className="section">
          <InternshipForm />
        </div>

        <div className="tab-header">ข้อมูลบริษัท</div>
        <div className="section">
          <CompanyInfoForm />
        </div>

        <div className="tab-header">รายละเอียดการประเมิน</div>
        <div className="section table-wrap">
          <div className="table-scroller">
            <EvaluationTable />
          </div>
        </div>

        <div className="tab-header">ความคิดเห็นและข้อเสนอแนะของผู้ควบคุม</div>
        <div className="section">
          <SupervisorFeedback />
        </div>

        <div className="action-buttons">
          <button className="btn btn-cancel" onClick={() => router.back()}>
            ยกเลิก
          </button>
          <button className="btn btn-save">บันทึก</button>
        </div>
      </main>
    </div>
  );
}
