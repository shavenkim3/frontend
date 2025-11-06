"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  FileText,
  Upload,
  Download,
  User,
  Edit3,
  ChevronDown,
  ChevronRight,
  File,
  Search, // ✅ เพิ่มไอคอนค้นหา
} from "lucide-react";

export default function SidebarProject({
  collapsed,
  setCollapsed,
  isMobile,
  mobileOpen,
  setMobileOpen,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState(false);

  const goto = (path) => {
    router.push(path);
    if (isMobile) setMobileOpen(false);
  };

  /** ✅ เมนูหลักทั้งหมด */
  const menuItems = [
    { name: "ข่าวสาร", icon: FileText, path: "/student/project/Special_Problem" },
    { name: "ค้นหาข้อมูล", icon: Search, path: "/student/project/search" }, // ✅ เพิ่มหัวข้อใหม่
    { name: "กรอกข้อมูลนิสิต", icon: Edit3, path: "/student/project/Student_Form" },
    {
      name: "ข้อมูลนิสิต",
      icon: User,
      path: "/student/project/info",
      subItems: [
        {
          name: "เอกสาร",
          icon: File,
          path: "/student/project/documents",
        },
      ],
    },
    { name: "อัปโหลดไฟล์", icon: Upload, path: "/student/project/upload" },
    { name: "ดาวน์โหลดไฟล์", icon: Download, path: "/student/project/download" },
  ];

  // ✅ เปิดเมนูย่อยอัตโนมัติเมื่ออยู่ในหน้า documents
  useEffect(() => {
    if (pathname.includes("/student/project/documents")) {
      setOpenSubmenu(true);
    }
  }, [pathname]);

  const sidebarClass = `
    sidebar-project
    ${!isMobile && collapsed ? "collapsed" : ""}
    ${isMobile && mobileOpen ? "open" : ""}
  `;

  return (
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
          const isActive = pathname === item.path;
          const hasSubmenu = item.subItems && item.subItems.length > 0;
          const submenuOpen = openSubmenu && item.name === "ข้อมูลนิสิต";

          const isParentActive =
            pathname.includes("/student/project/info") ||
            pathname.includes("/student/project/documents");

          return (
            <div key={item.name} className="menu-group">
              {/* เมนูหลัก */}
              <div
                className={`menu-item ${
                  isActive || (item.name === "ข้อมูลนิสิต" && isParentActive)
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  if (hasSubmenu) {
                    goto(item.path);
                    setOpenSubmenu((prev) =>
                      prev && item.name === "ข้อมูลนิสิต" ? false : true
                    );
                  } else {
                    goto(item.path);
                  }
                }}
              >
                <Icon size={20} />
                {!(!isMobile && collapsed) && <span>{item.name}</span>}
                {hasSubmenu &&
                  (!isMobile && !collapsed ? (
                    submenuOpen ? (
                      <ChevronDown size={18} className="submenu-arrow" />
                    ) : (
                      <ChevronRight size={18} className="submenu-arrow" />
                    )
                  ) : null)}
              </div>

              {/* เมนูย่อย */}
              {hasSubmenu && submenuOpen && !collapsed && (
                <div className="submenu-list">
                  {item.subItems.map((sub) => {
                    const SubIcon = sub.icon;
                    const subActive = pathname === sub.path;
                    return (
                      <div
                        key={sub.name}
                        className={`submenu-item ${subActive ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          goto(sub.path);
                        }}
                      >
                        <SubIcon size={18} />
                        <span>{sub.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Styles */}
      <style jsx>{`
        .sidebar-project {
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

        .sidebar-project.collapsed {
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

        .menu-group {
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
          position: relative;
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

        .submenu-arrow {
          margin-left: auto;
        }

        .submenu-list {
          display: flex;
          flex-direction: column;
          margin-left: 36px;
          border-left: 2px solid #03a96b;
          margin-top: 4px;
        }

        .submenu-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          color: #b0b3b8;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .submenu-item:hover {
          background-color: #3d4349;
          color: #fff;
        }

        .submenu-item.active {
          background-color: #03a96b;
          color: #fff;
          font-weight: 600;
        }

        @media (max-width: 799px) {
          .sidebar-project {
            width: 260px;
            transform: translateX(-100%);
          }

          .sidebar-project.open {
            transform: translateX(0);
          }

          .submenu-list {
            margin-left: 24px;
          }
        }
      `}</style>
    </aside>
  );
}
