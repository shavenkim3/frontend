"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  FileText,
  Upload,
  User,
  ChevronDown,
  ChevronRight,
  Users,
  Home,
  FilePlus2,
  Building2,
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
  const [openSubmenu, setOpenSubmenu] = useState(""); // ← เก็บชื่อเมนูที่เปิดอยู่

  const goto = (path) => {
    router.push(path);
    if (isMobile) setMobileOpen(false);
  };

  /** ========= เมนูหลัก ========= */
  const menuItems = [
    { name: "ภาพรวม", icon: Home, path: "/admin/dashboard" },
    { name: "ข่าวสาร", icon: FileText, path: "/admin/news" },
    {
      name: "ข้อมูลนิสิต",
      icon: User,
      path: "/admin/student",
      subItems: [
        { name: "เพิ่มข้อมูลนิสิต", icon: FilePlus2, path: "/admin/student/add" },
      ],
    },
    {
      name: "ข้อมูลอาจารย์",
      icon: Users,
      path: "/admin/teacher",
      subItems: [
        {
          name: "สร้างผู้ใช้อาจารย์",
          icon: FilePlus2,
          path: "/admin/teacher/create-user",
        },
      ],
    },
    {
      name: "ข้อมูลบริษัท",
      icon: Building2,
      path: "/admin/company",
      subItems: [
        {
          name: "เพิ่มข้อมูลบริษัท",
          icon: FilePlus2,
          path: "/admin/company/create-user",
        },
      ],
    },
    { name: "อัปโหลดไฟล์", icon: Upload, path: "/admin/upload" },
  ];

  /** ✅ เปิดเมนูย่อยอัตโนมัติเมื่ออยู่ในหน้า add student / create-user / company */
  useEffect(() => {
    if (pathname.startsWith("/admin/student")) {
      setOpenSubmenu("ข้อมูลนิสิต");
    } else if (pathname.startsWith("/admin/teacher")) {
      setOpenSubmenu("ข้อมูลอาจารย์");
    } else if (pathname.startsWith("/admin/company")) {
      setOpenSubmenu("ข้อมูลบริษัท");
    } else {
      setOpenSubmenu("");
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
          const hasSubmenu = item.subItems && item.subItems.length > 0;
          const submenuOpen = openSubmenu === item.name;

          // ✅ ตรวจจับหน้า active แต่ละหมวด
          const isNewsActive =
            item.name === "ข่าวสาร" &&
            (pathname === "/admin/news" ||
              pathname.startsWith("/admin/news/add") ||
              pathname.startsWith("/admin/news/edit"));

          const isTeacherActive =
            item.name === "ข้อมูลอาจารย์" &&
            (pathname === "/admin/teacher" ||
              pathname.startsWith("/admin/teacher/view") ||
              pathname.startsWith("/admin/teacher/edit") ||
              pathname.startsWith("/admin/teacher/create-user"));

          const isStudentActive =
            item.name === "ข้อมูลนิสิต" &&
            (pathname === "/admin/student" ||
              pathname.startsWith("/admin/student/add"));

          const isCompanyActive =
            item.name === "ข้อมูลบริษัท" &&
            (pathname === "/admin/company" ||
              pathname.startsWith("/admin/company/add") ||
              pathname.startsWith("/admin/company/edit") ||
              pathname.startsWith("/admin/company/view"));

          const isActive =
            pathname === item.path ||
            pathname.startsWith(item.path) ||
            isNewsActive ||
            isTeacherActive ||
            isStudentActive ||
            isCompanyActive;

          return (
            <div key={item.name} className="menu-group">
              <div
                className={`menu-item ${isActive ? "active" : ""}`}
                onClick={() => {
                  if (hasSubmenu) {
                    goto(item.path);
                    setOpenSubmenu((prev) =>
                      prev === item.name ? "" : item.name
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

              {/* Submenu */}
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

      {/* ✅ CSS */}
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
