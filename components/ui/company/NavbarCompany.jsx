"use client";

import { Menu, Bell, LogOut } from "lucide-react";
import useCompanyAuth from "@/hooks/useCompanyAuth";

export default function NavbarCompany({
  collapsed = false,
  title = "ระบบจัดการข้อมูลสหกิจของบริษัท",
  titleSize = "1.3rem",
  onMenuClick,
  onToggle,
  onToggleSidebar,
}) {
  const { me, loading, logout } = useCompanyAuth({ requireNoMCP: false });
  const handleToggle = onToggle || onMenuClick || onToggleSidebar || (() => {});

  // ✅ แสดงเฉพาะชื่อผู้ติดต่อ (หรือ email ถ้าไม่มี)
  const primaryContact = me?.contacts?.find?.((c) => c.is_primary);
  const displayName = loading
    ? "กำลังโหลด..."
    : primaryContact
    ? `${primaryContact.first_name || ""} ${primaryContact.last_name || ""}`.trim()
    : me?.email || "ไม่พบข้อมูล";

  return (
    <nav className="navbar">
      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: ${collapsed ? "60px" : "220px"};
          width: calc(100% - ${collapsed ? "60px" : "220px"});
          z-index: 1000;
          font-family: "Kanit", sans-serif;
          transition: all 0.3s ease;
        }

        .top-bar {
          background: #03a96b;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          position: relative;
          padding: 0 12px;
        }

        .left,
        .right {
          position: absolute;
          top: 0;
          height: 100%;
          display: flex;
          align-items: center;
        }

        .left {
          left: 12px;
          gap: 12px;
        }
        .right {
          right: 12px;
          gap: 14px;
        }

        .title {
          font-size: ${titleSize};
          font-weight: 400;
          letter-spacing: 0.2px;
          text-align: center;
        }

        .icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        .icon-btn:hover {
          opacity: 0.85;
        }

        .user-desktop {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          font-weight: 400;
          font-size: 0.95rem;
          white-space: nowrap;
        }

        .bottom-bar {
          display: none;
          background: #027a51;
          color: #fff;
          text-align: center;
          font-size: 0.9rem;
          font-weight: 400;
          padding: 6px 10px;
          margin: 0;
        }

        .menu-btn {
          display: none;
        }

        @media (min-width: 800px) {
          .user-desktop {
            display: flex;
          }
          .mobile-logout {
            display: none;
          }
        }

        @media (max-width: 799px) {
          .navbar {
            left: 0 !important;
            width: 100% !important;
          }
          .title {
            font-size: 1rem;
          }
          .user-desktop {
            display: none;
          }
          .bottom-bar {
            display: block;
          }
          .menu-btn {
            display: inline-flex;
          }
        }
      `}</style>

      {/* แถวบน */}
      <div className="top-bar">
        <div className="left">
          <button
            className="icon-btn menu-btn"
            onClick={handleToggle}
            style={{ background: "none", border: "none", color: "inherit" }}
          >
            <Menu size={22} color="#fff" />
          </button>
        </div>

        <div className="title">{title}</div>

        <div className="right">
          <span className="icon-btn" title="การแจ้งเตือน">
            <Bell size={20} color="#fff" />
          </span>

          {/* Desktop */}
          <div className="user-desktop">
            <span>{displayName}</span>
            <span className="icon-btn" onClick={logout}>
              <LogOut size={20} color="#fff" />
            </span>
          </div>

          {/* Mobile */}
          <span className="icon-btn mobile-logout" onClick={logout}>
            <LogOut size={20} color="#fff" />
          </span>
        </div>
      </div>

      {/* แถวล่าง (มือถือ) */}
      <div className="bottom-bar">{displayName}</div>
    </nav>
  );
}
