"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react"; // ✅ ใช้ icon จาก lucide-react

import SidebarCompany from "@/components/ui/company/SidebarCompany";
import NavbarCompany from "@/components/ui/company/NavbarCompany";
import CompanyHeader from "@/components/ui/company/AddCompanyHeader";

export default function DashboardPage() {
  const router = useRouter();

  const MOBILE_BP = 800;
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ เก็บชื่อไฟล์ที่อัปโหลด
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  /* ===== Responsive Resize ===== */
  const handleResize = useCallback(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1920;
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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (!(isMobile && mobileOpen)) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [isMobile, mobileOpen]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = () => router.push("/company/login_company");
  const sidebarCollapsed = isMobile ? false : collapsed;

  // ✅ คลิกกล่อง → เปิด File Picker
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // ✅ เมื่อเลือกไฟล์
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("ขนาดไฟล์เกิน 5MB ❌");
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
    }
  };

  return (
    <div
      className={`page-root ${isMobile && mobileOpen ? "mobile-open" : ""}`}
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
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: geometricPrecision;
        }
        .sidebar {
          position: fixed !important;
          top: 0;
          left: 0;
          height: 100dvh;
          background: #2f3337;
          z-index: 1100;
        }
        .drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.38);
          z-index: 1500;
        }
      `}</style>

      <style jsx>{`
        .main {
          margin-left: ${collapsed ? "60px" : "220px"};
          padding: 70px 20px 20px;
          transition: margin-left 0.3s ease;
          min-height: 100vh;
        }

        .container-wide {
          width: 100%;
          max-width: none;
          margin-left: 0;
          margin-right: 0;
          padding: 0 10px;
        }

        .welcome {
          margin-bottom: 14px;
          text-align: left;
        }

        @media (max-width: 799px) {
          .main {
            margin-left: 0 !important;
            padding: 84px 16px 16px;
          }
          :global(.sidebar) {
            width: 280px !important;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 2000 !important;
          }
          .mobile-open :global(.sidebar) {
            transform: translateX(0);
          }
        }
      `}</style>

      {/* Navbar */}
      <NavbarCompany
        collapsed={collapsed}
        username="Admin username"
        onLogout={handleLogout}
        onMenuClick={() =>
          isMobile ? setMobileOpen((v) => !v) : setCollapsed((v) => !v)
        }
        onToggleSidebar={() =>
          isMobile ? setMobileOpen((v) => !v) : setCollapsed((v) => !v)
        }
      />

      {/* Mobile Drawer */}
      {isMobile && mobileOpen && (
        <div
          className="drawer-backdrop"
          onClick={() => setMobileOpen(false)}
          role="button"
          aria-label="Close menu backdrop"
        />
      )}

      {/* Sidebar */}
      <SidebarCompany
        collapsed={sidebarCollapsed}
        onToggle={() =>
          isMobile ? setMobileOpen((v) => !v) : setCollapsed((v) => !v)
        }
        goto={(path) => (e) => {
          e.preventDefault();
          router.push(path);
          if (isMobile) setMobileOpen(false);
        }}
      />

      {/* Main Content */}
      <main className="main">
        <div className="container-wide">
          <div className="welcome">
            {/* ✅ หัวข้อ */}
            <CompanyHeader />

            {/* ✅ ส่วนอัปโหลดไฟล์ */}
            <div className="upload-section" onClick={handleBrowseClick}>
              <div className="upload-box">
                <div className="upload-row">
                  <Upload className="upload-icon" size={28} strokeWidth={2.5} />
                  <div className="upload-text">
                    <strong>Browse to upload</strong>
                  </div>
                </div>

                <div className="upload-sub">
                  Max 5MB • Allowed: PDF, PNG, JPG, JPEG, MP4, PPT, PPTX, DOC,
                  DOCX
                </div>

                {selectedFile && (
                  <div className="file-info">
                    📎 <strong>{selectedFile.name}</strong>
                    <span className="file-size">
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept=".pdf,.png,.jpg,.jpeg,.mp4,.ppt,.pptx,.doc,.docx"
              />
            </div>
          </div>
        </div>
      </main>

      {/* ✅ CSS รวมทั้งหมด */}
      <style jsx>{`
        .upload-section {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 40px;
        }

        .upload-box {
          width: 100%;
          max-width: 640px;
          background: #ffffff;
          border: 2px dashed #2563eb;
          border-radius: 14px;
          text-align: center;
          padding: 50px 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
        }

        .upload-box:hover {
          background: #f8fafc;
          border-color: #1e40af;
          transform: translateY(-2px);
        }

        /* ✅ จัด icon กับข้อความให้อยู่กลางแนวนอน */
        .upload-row {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .upload-icon {
          color: #2563eb;
        }

        .upload-text {
          font-size: 17px;
          font-weight: 700;
          color: #111827;
        }

        .upload-sub {
          font-size: 13.5px;
          color: #6b7280;
          margin-top: 4px;
        }

        .file-info {
          margin-top: 18px;
          background: #f3f4f6;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 14px;
          color: #111827;
          display: inline-block;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
        }

        .file-size {
          margin-left: 6px;
          color: #64748b;
        }

        @media (max-width: 799px) {
          .upload-box {
            padding: 40px 16px;
            font-size: 14px;
          }
          .upload-row {
            gap: 6px;
          }
        }
      `}</style>
    </div>
  );
}
