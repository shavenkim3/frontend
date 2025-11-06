"use client";

import Link from "next/link";
import { Kanit } from "next/font/google";
import { HelpCircle } from "lucide-react"; // ไอคอนเครื่องหมายคำถาม

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["400", "600", "700"],
});

export default function RoleCard({ label, sub, href, Icon, helpHref, onHelpClick }) {
  return (
    <Link href={href} aria-label={`เข้าสู่ระบบสำหรับ ${label}`}>
      <div className={`card ${kanit.className}`}>
        {/* ปุ่ม ? มุมขวาบน — ลอยทับ ไม่ดันเลย์เอาต์ */}
        <button
          type="button"
          className="help-btn"
          aria-label={`อ่านคู่มือของ ${label}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onHelpClick) onHelpClick();
            else if (helpHref) window.open(helpHref, "_blank", "noopener,noreferrer");
          }}
          title="อ่านคู่มือ"
        >
          <HelpCircle className="help-icon" />
        </button>

        <div className="content">
          <Icon className="icon" />
          <div className="label">
            <strong>{label}</strong>
            <small>{sub}</small>
          </div>
        </div>
        <div className="tooltip">คลิกเพื่อเข้าสู่ระบบ</div>
      </div>

      <style jsx>{`
        .card {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 16px;
          position: relative; /* สำคัญ: ให้ปุ่ม ? อ้างอิงตำแหน่งจากการ์ด */
          text-align: center;
          text-decoration: none;

          border-radius: 20px;
          padding: 40px 24px;
          min-height: 280px;
          width: 100%;

          background: #ffffff;
          border: 2px solid #00a77f;
          color: #00a77f;
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
          transition: all 0.25s ease;
          cursor: pointer;
        }

        .card:hover {
          background: #00a77f;
          color: #ffffff;
          transform: translateY(-6px);
          box-shadow: 0 12px 26px rgba(0, 167, 127, 0.45);
          border-color: #008f6c;
        }

        /* ปุ่ม ? ลอยทับ ไม่กระทบ flow เดิม */
        .help-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 30px;
          height: 30px;
          border-radius: 999px;
          border: none;
          background: rgba(0, 167, 127, 0.12);
          color: #00a77f;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
        }
        .help-btn:hover {
          background: #00a77f;
          color: #fff;
          transform: scale(1.06);
        }
        .help-icon { width: 18px; height: 18px; }

        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          height: 100%;
          width: 100%;
        }

        .icon {
          width: 80px;
          height: 80px;
          transition: transform 0.25s ease, color 0.25s ease;
          color: #00a77f;
        }
        .card:hover .icon {
          color: #ffffff;
          transform: scale(1.1);
        }
        
.card:hover .help-btn {
  background: rgba(255, 255, 255, 0.25);
  color: #ffffff;
  transform: scale(1.05);
}


        :global(.card .icon svg) {
          width: 80px;
          height: 80px;
          color: inherit;
          fill: currentColor !important;
          stroke: currentColor !important;
        }
        :global(.card .icon svg [fill]) { fill: currentColor !important; }
        :global(.card .icon svg [stroke]) { stroke: currentColor !important; }

        .label strong { font-size: 20px; font-weight: 600; display: block; }
        .label small { margin-top: 6px; font-size: 14px; display: block; opacity: 0.9; }

        .tooltip {
          opacity: 0;
          transform: translateY(8px);
          transition: all 0.25s ease;
          position: absolute;
          bottom: 14px;
          font-size: 13px;
          color: #00a77f;
          background: rgba(0, 167, 127, 0.1);
          padding: 4px 10px;
          border-radius: 8px;
          pointer-events: none;
        }
        .card:hover .tooltip {
          opacity: 1;
          transform: translateY(0);
          color: #ffffff;
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </Link>
  );
}
