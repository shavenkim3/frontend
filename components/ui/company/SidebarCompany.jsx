"use client";

import { usePathname } from "next/navigation";
import {
  Menu,
  LayoutDashboard,
  Building2,
  ClipboardCheck,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";

/* ===== ลิงก์หลัก ===== */
const LINKS = {
  dashboard: {
    href: "/company/dashboard",
    label: "ภาพรวม",
    icon: LayoutDashboard,
  },
};

/* ===== utils ===== */
function normalizePath(p = "") {
  try {
    const noQ = p.split("?")[0].split("#")[0];
    return noQ !== "/" ? noQ.replace(/\/+$/, "") : "/";
  } catch {
    return p || "/";
  }
}
function isActivePath(currentPath, baseHref) {
  const cur = normalizePath(currentPath);
  const base = normalizePath(baseHref);
  if (cur === base) return true;
  return cur.startsWith(base + "/");
}

export default function SidebarCompany({
  collapsed = false,
  onToggle = () => {},
  goto = () => () => {},
}) {
  const pathname = usePathname();

  const companyBase = "/company/company_data";
  const evaluationBase = "/company/evaluation";

  const isCompanyActive = isActivePath(pathname, companyBase);
  const isEvaluationActive = isActivePath(pathname, evaluationBase);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <style jsx>{`
        .sidebar {
          position: fixed;
          inset: 0 auto 0 0;
          width: ${collapsed ? "60px" : "220px"};
          background: #2f3337;
          color: #ccc;
          height: 100dvh;
          display: flex;
          flex-direction: column;
          z-index: 1100;
          transition: width 0.3s ease;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
        }
        .scroll {
          flex: 1 1 auto;
          overflow-y: auto;
          padding: 0 0 16px 0;
          scrollbar-width: none;
        }
        .scroll::-webkit-scrollbar {
          display: none;
        }
        .item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          cursor: pointer;
          color: #ccc;
          text-decoration: none;
          white-space: nowrap;
          position: relative;
          border-radius: 4px;
          transition: background 0.25s, color 0.25s;
        }
        .item:hover {
          background: #444;
          color: #fff;
        }
        .active {
          background: #2ca26e;
          color: #fff;
        }
        .active:hover {
          background: #2ca26e !important;
          color: #fff !important;
          cursor: default;
        }
        .text {
          flex: 1;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .collapsed .text {
          display: none;
        }
        .collapsed .item {
          justify-content: center;
        }
        .tooltip {
          visibility: hidden;
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
          position: absolute;
          left: 60px;
          top: 50%;
          transform: translateY(-50%);
          background: #2ca26e;
          color: #fff;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.85rem;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .collapsed .item:hover .tooltip {
          visibility: visible;
          opacity: 1;
        }
        .menu-button {
          margin: 4px 8px 18px;
          background: transparent;
          border: none;
          text-align: left;
        }
        .menu-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 0 8px;
        }
        @media (max-width: 799px) {
          .sidebar {
            width: 280px !important;
          }
          .collapsed .text {
            display: block !important;
          }
          .collapsed .item {
            justify-content: flex-start !important;
          }
          .collapsed .item:hover .tooltip,
          .tooltip {
            display: none !important;
          }
        }
      `}</style>

      {/* ปุ่มเมนู */}
      <button
        type="button"
        className="item menu-button"
        onClick={onToggle}
        title="เมนู"
      >
        <Menu size={20} />
        <span className="text">เมนู</span>
        <span className="tooltip">เมนู</span>
      </button>

      <div className="scroll">
        <nav className="menu-list">
          {/* ภาพรวม */}
          {(() => {
            const { href, label, icon: Icon } = LINKS.dashboard;
            const isExactActive = normalizePath(pathname) === normalizePath(href);
            return (
              <a
                key={href}
                href={href}
                onClick={(e) => {
                  const same = normalizePath(pathname) === normalizePath(href);
                  if (same) {
                    e.preventDefault();
                    return;
                  }
                  return goto(href)(e);
                }}
                className={`item ${isExactActive ? "active disabled" : ""}`}
                title={label}
              >
                <Icon size={20} />
                <span className="text">{label}</span>
                <span className="tooltip">{label}</span>
              </a>
            );
          })()}

          {/* ข้อมูลนิสิต */}
          <a
            href={companyBase}
            onClick={(e) => {
              const same = normalizePath(pathname) === normalizePath(companyBase);
              if (same) {
                e.preventDefault();
                return;
              }
              return goto(companyBase)(e);
            }}
            className={`item ${isCompanyActive ? "active disabled" : ""}`}
            title="ข้อมูลนิสิต"
          >
            <Building2 size={20} />
            <span className="text">ข้อมูลนิสิต</span>
            <span className="tooltip">ข้อมูลนิสิต</span>
          </a>

          {/* การประเมินผล */}
          <a
            href={evaluationBase}
            onClick={(e) => {
              const same = normalizePath(pathname) === normalizePath(evaluationBase);
              if (same) {
                e.preventDefault();
                return;
              }
              return goto(evaluationBase)(e);
            }}
            className={`item ${isEvaluationActive ? "active disabled" : ""}`}
            title="การประเมินผล"
          >
            <ClipboardCheck size={20} />
            <span className="text">การประเมินผล</span>
            <span className="tooltip">การประเมินผล</span>
          </a>
        </nav>
      </div>
    </aside>
  );
}
