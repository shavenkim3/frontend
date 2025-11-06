"use client";

import React, { useState, useCallback, useEffect } from "react";
import SidebarAdmin from "@/components/ui/admin/SidebarAdmin";
import HeaderBarAdmin_Problem from "@/components/ui/admin/HeaderBarAdmin_Problem";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getAdminToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token") ||
    ""
  );
}

export default function CompanyCreateUserPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const MOBILE_BP = 799;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setErr("");
    try {
      const token = getAdminToken();
      const res = await fetch(`${API_URL}/company-users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ไม่สามารถสร้างบัญชีได้");

      setMsg(data.message || "สร้างบัญชีสำเร็จ");
      setEmail("");
    } catch (e) {
      console.error("create user error:", e);
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <SidebarAdmin
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Header */}
      <HeaderBarAdmin_Problem
        title="สร้างบัญชีผู้ใช้บริษัท"
        isMobile={isMobile}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content */}
      <main
        className="main"
        style={{
          marginLeft: collapsed ? "70px" : "230px",
          paddingTop: "80px",
        }}
      >
        <div className="form-wrapper">
          <h2>สร้างบัญชีผู้ใช้บริษัท</h2>
          <form onSubmit={handleSubmit}>
            <label>อีเมลผู้ติดต่อบริษัท</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@company.com"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "กำลังสร้าง..." : "สร้างบัญชี"}
            </button>
          </form>

          {msg && <p className="msg success">{msg}</p>}
          {err && <p className="msg error">{err}</p>}
        </div>

        <style jsx>{`
          .main {
            background: #f7f8fa;
            min-height: 100vh;
          }

          .form-wrapper {
            background: #fff;
            max-width: 480px;
            margin: 50px auto;
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
            font-family: "Kanit", sans-serif;
          }

          h2 {
            font-size: 1.3rem;
            color: #026b45;
            font-weight: 600;
            margin-bottom: 20px;
          }

          label {
            display: block;
            font-weight: 500;
            margin-bottom: 8px;
          }

          input {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #ccc;
            border-radius: 8px;
            margin-bottom: 16px;
            font-size: 1rem;
          }

          button {
            width: 100%;
            background: #03a96b;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
          }

          button:disabled {
            opacity: 0.6;
          }

          .msg {
            margin-top: 12px;
            font-weight: 500;
          }

          .success {
            color: #028a58;
          }

          .error {
            color: #c0392b;
          }
        `}</style>
      </main>
    </div>
  );
}
