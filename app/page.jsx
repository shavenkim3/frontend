"use client";

import React from "react";
import RoleCard from "@/components/RoleCard";
import { Kanit } from "next/font/google";
import { roles } from "@/config/roles.config"; 

const kanit = Kanit({ subsets: ["thai", "latin"], weight: ["400", "600", "700"] });

export default function HomePage() {
  return (
    <main className={`page-wrap ${kanit.className}`}>
      <div className="login-like-container">
        <img src="/logo/IT_logo.png" alt="Logo" className="logo" />
        <h1 className="page-title">เลือกวิธีเข้าสู่ระบบ</h1>

        <section className="grid">
          {roles.map((r) => (
            <RoleCard
              key={r.href}
              label={r.label}
              sub={r.sub}
              href={r.href}
              Icon={r.Icon}
            />
          ))}
        </section>

        <p className="helper">มีปัญหาการเข้าสู่ระบบ? ติดต่อผู้ดูแลระบบ</p>
      </div>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        .page-wrap {
          min-height: 100vh;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #ffffff;
          color: #0c1116;
          position: relative;
          overflow: hidden;
          padding: 24px;
        }
        .page-wrap::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: radial-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            radial-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px);
          background-size: 24px 24px, 48px 48px;
          background-position: 0 0, 12px 12px;
          mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.05) 40%, transparent);
        }
        .login-like-container {
          width: 90%;
          max-width: 1100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 20px;
          position: relative;
          z-index: 1;
          transform: translateY(-15px);
        }
        .logo {
          width: 20%;
          max-width: 120px;
          height: auto;
          object-fit: contain;
          margin-bottom: 8px;
        }
        .page-title {
          font-weight: 600;
          color: #006b5a;
          font-size: clamp(16px, 1.2vw + 14px, 28px);
          line-height: 1.2;
          margin-bottom: 8px;
        }
        .page-title::after {
          content: "คุณคือใคร";
          display: block;
          margin-top: 6px;
          font-size: clamp(12px, 1.6vw, 14px);
          color: #006b5a;
          font-weight: 500;
        }
        .grid {
          width: 100%;
          display: grid;
          gap: 22px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          align-items: stretch;
          margin-top: 12px;
        }
        @media (max-width: 880px) {
          .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 520px) {
          .grid { grid-template-columns: 1fr; }
          .logo { width: 28%; }
          .login-like-container { transform: translateY(-20px); }
        }
        .helper {
          margin-top: 6px;
          font-size: 14px;
          color: #6b6b6b;
        }
      `}</style>
    </main>
  );
}
