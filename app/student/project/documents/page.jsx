"use client";

import React, { useState, useEffect, useCallback } from "react";
import SidebarProject from "@/components/ui/student/project/SidebarProject";
import HeaderBarStudent_Problem from "@/components/ui/student/project/HeaderBarStudent_Problem";
import WelcomeSectionStudent_info from "@/components/ui/student/project/WelcomeSectionStudent_info";
import { FileText, Eye, Download } from "lucide-react";

export default function StudentDocumentsPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const MOBILE_BP = 799;

  // จำลองรายการเอกสาร (ในอนาคตสามารถเชื่อมต่อ API ได้)
  const documents = [
    {
      id: 1,
      title: "แบบฟอร์มขอสอบปัญหาพิเศษ",
      type: "DOCX",
      size: "1.1 MB",
      uploadedBy: "อ.ดร. สมชาย ใจดี",
      date: "15 ตุลาคม 2568",
      fileUrl: "#",
    },
    {
      id: 2,
      title: "แบบรายงานความก้าวหน้าฉบับที่ 1",
      type: "PDF",
      size: "2.4 MB",
      uploadedBy: "นายธนกฤต สายใจ",
      date: "18 ตุลาคม 2568",
      fileUrl: "#",
    },
    {
      id: 3,
      title: "รายงานปัญหาพิเศษฉบับสมบูรณ์",
      type: "PDF",
      size: "3.9 MB",
      uploadedBy: "นายธนกฤต สายใจ",
      date: "25 ตุลาคม 2568",
      fileUrl: "#",
    },
  ];

  // ✅ ตรวจขนาดหน้าจอ
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
      {/* โหลดฟอนต์ */}
      <link
        href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Sidebar */}
      <SidebarProject
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
        <HeaderBarStudent_Problem
          isMobile={isMobile}
          setMobileOpen={setMobileOpen}
          title="ระบบจัดการข้อมูลปัญหาพิเศษ"
          showUser={true}
        />

        {/* ส่วน Welcome (ห้ามแตะ) */}
        <WelcomeSectionStudent_info />

        {/* ส่วนแสดงเอกสาร */}
        <section className="documents-section">
          <div className="documents-card">
            <h2 className="documents-title">รายการเอกสารทั้งหมด</h2>
            <p className="documents-desc">
              รวมเอกสารที่เกี่ยวข้องกับปัญหาพิเศษของคุณ เช่น แบบฟอร์ม รายงานความก้าวหน้า และรายงานฉบับสมบูรณ์
            </p>

            <div className="document-list">
              {documents.map((doc) => (
                <div key={doc.id} className="document-item">
                  <div className="document-icon">
                    <FileText size={28} color="#03a96b" />
                  </div>
                  <div className="document-info">
                    <div className="document-title">{doc.title}</div>
                    <div className="document-meta">
                      <span>{doc.type}</span> • <span>{doc.size}</span> •{" "}
                      <span>อัปโหลดโดย {doc.uploadedBy}</span> •{" "}
                      <span>{doc.date}</span>
                    </div>
                  </div>
                  <div className="document-actions">
                    <button className="view-btn">
                      <Eye size={18} />
                      <span>ดูตัวอย่าง</span>
                    </button>
                    <button
                      className="download-btn"
                      onClick={() => window.open(doc.fileUrl, "_blank")}
                    >
                      <Download size={18} />
                      <span>ดาวน์โหลด</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ===== CSS ===== */}
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
          color: #03a96b;
        }

        /* ===== Documents Section ===== */
        .documents-section {
          display: flex;
          justify-content: center;
          padding: 50px 20px 70px;
          background: #fff;
        }

        .documents-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          padding: 40px 40px 32px;
          width: 100%;
          max-width: 1000px;
        }

        .documents-title {
          color: #03a96b;
          font-weight: 600;
          font-size: 1.3rem;
          margin-bottom: 8px;
        }

        .documents-desc {
          color: #666;
          font-size: 0.95rem;
          margin-bottom: 28px;
        }

        .document-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .document-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f9fefb;
          border: 1px solid #d9f4e3;
          border-radius: 12px;
          padding: 20px 24px;
          transition: all 0.3s ease;
        }

        .document-item:hover {
          background: #edfff4;
          border-color: #03a96b;
        }

        .document-info {
          flex: 1;
          margin-left: 12px;
        }

        .document-title {
          font-weight: 600;
          font-size: 1rem;
          color: #333;
        }

        .document-meta {
          font-size: 0.85rem;
          color: #666;
        }

        .document-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .view-btn,
        .download-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }

        .view-btn {
          background: #eaf7f1;
          color: #03a96b;
        }

        .view-btn:hover {
          background: #d9f4e3;
        }

        .download-btn {
          background: #03a96b;
          color: #fff;
        }

        .download-btn:hover {
          background: #02965f;
        }
      `}</style>
    </div>
  );
}
