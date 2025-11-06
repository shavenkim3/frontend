"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  FileText,
  Download,
  Upload,
  User,
  Edit3,
  Search,
} from "lucide-react";

export default function SidebarCoop({
  collapsed,
  setCollapsed,
  isMobile,
  mobileOpen,
  setMobileOpen,
}) {
  const router = useRouter();
  const pathname = usePathname();

  // ✅ ป้องกันการ push ซ้ำ path เดิม
  const goto = (path) => {
    if (pathname !== path) {
      router.push(path);
    }
    if (isMobile) setMobileOpen(false);
  };

  const menuItems = [
    { name: "ข่าวสาร", icon: FileText, path: "/student/coop/coop_problem" },
    { name: "ค้นหาข้อมูล", icon: Search, path: "/student/coop/search" },
    { name: "กรอกข้อมูลนิสิต", icon: Edit3, path: "/student/coop/Student_Form" },
    { name: "ข้อมูลนิสิต", icon: User, path: "/student/coop/info" },
    { name: "อัปโหลดไฟล์", icon: Upload, path: "/student/coop/upload" },
    { name: "ดาวน์โหลดไฟล์", icon: Download, path: "/student/coop/download" },
  ];

  const normalizePath = (p) => p?.replace(/\/+$/, "") || "";
  const currentPath = normalizePath(pathname);

  const sidebarClass = `
    sidebar-coop
    ${!isMobile && collapsed ? "collapsed" : ""}
    ${isMobile && mobileOpen ? "open" : ""}
  `;

  return (
    <>
      {/* Backdrop สำหรับ mobile */}
      {isMobile && mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      <aside className={sidebarClass}>
        {/* Header */}
        <div className="menu-header">
          {!isMobile && (
            <button
              className="menu-toggle"
              onClick={() => setCollapsed((v) => !v)}
              aria-label="Toggle sidebar"
            >
              <Menu size={22} />
            </button>
          )}
          {!(!isMobile && collapsed) && <h2 className="menu-title">เมนู</h2>}
        </div>

        {/* Menu List */}
        <nav className="menu-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const itemPath = normalizePath(item.path);
            const isActive =
              currentPath === itemPath ||
              currentPath.startsWith(itemPath + "/");

            return (
              <div key={item.name} className="menu-group">
                <div
                  className={`menu-item ${isActive ? "active" : ""}`}
                  onClick={() => goto(item.path)}
                >
                  <Icon size={20} />
                  {!(!isMobile && collapsed) && <span>{item.name}</span>}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* ===== Styles ===== */}
      <style jsx>{`
        .sidebar-coop {
          position: fixed;
          top: 0;
          left: 0;
          height: 100dvh;
          width: 230px;
          background-color: #2f3337;
          color: #b0b3b8;
          transition: width 0.3s ease, transform 0.3s ease;
          z-index: 2000;
          overflow-y: auto;
        }

        .sidebar-coop.collapsed {
          width: 70px;
        }

        .menu-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 1rem;
        }

        .menu-toggle {
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
        }

        .menu-title {
          font-size: 1.2rem;
          color: #fff;
          font-weight: 600;
        }

        .menu-list {
          margin-top: 30px;
          display: flex;
          flex-direction: column;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          color: #b0b3b8;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .menu-item.active {
          background-color: #03a96b;
          color: #fff;
          font-weight: 600;
        }

        .menu-item:hover:not(.active) {
          background-color: #3d4349;
          color: #fff;
        }

        /* ===== Mobile ===== */
        @media (max-width: 799px) {
          .sidebar-coop {
            width: 260px;
            transform: translateX(-100%);
          }
          .sidebar-coop.open {
            transform: translateX(0);
          }
          .sidebar-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.4);
            z-index: 1500;
          }
        }
      `}</style>
    </>
  );
}
