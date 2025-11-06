"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BackButton from "@/components/ui/BackButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AdvisorLoginPage() {
  const [advisorEmail, setAdvisorEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const timerRef = useRef(null);

  // Prefetch หน้า Home + เพจที่ต้องไปหลังล็อกอิน + หน้า OTP
  useEffect(() => {
    if (router.prefetch) {
      router.prefetch("/");
      router.prefetch("/auth/advisor/dashboard");
      router.prefetch("/auth/advisor/change-password");
      router.prefetch("/auth/advisor/forgot_password");
      // ✅ เพิ่มพาธบังคับเปลี่ยนรหัสผ่านครั้งแรก
      router.prefetch("/advisor/must_change_password");
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [router]);

  // ✅ เข้าสู่ระบบอาจารย์
  const loginAdvisor = async () => {
    if (!advisorEmail || !password) {
      alert("กรุณากรอกอีเมลอาจารย์และรหัสผ่าน");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/advisor/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: advisorEmail,
          password,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg =
          err?.error ||
          err?.message ||
          (res.status === 401
            ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
            : `เข้าสู่ระบบไม่สำเร็จ (HTTP ${res.status})`);
        alert(msg);
        return;
      }

      const data = await res.json();
      const { token, must_change_password } = data || {};

      if (!token) {
        alert("ไม่พบโทเคนจากระบบ โปรดลองใหม่อีกครั้ง");
        return;
      }

      // ✅ เก็บ token + email ไว้ใช้ในหน้าเปลี่ยนรหัส
      localStorage.setItem("advisor_token", token);
      localStorage.setItem("advisor_email", advisorEmail);

      // ✅ ถ้าล็อกอินครั้งแรก/ยังไม่เคยเปลี่ยนรหัส → ส่งไป /teach/must_change_password
      if (must_change_password === true) {
        router.replace(`/advisor/must_change_password?first=1&email=${encodeURIComponent(advisorEmail)}`);
      } else {
        router.replace("/advisor/dashboard");
      }
    } catch (e) {
      console.error("advisor login error:", e);
      alert("มีข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  const goBackHome = () => router.push("/");

  return (
    <div className="login-container">
      <img src="/logo/IT_logo.png" alt="Logo" className="logo" />

      <h1 className="page-title">
        เข้าใช้งานระบบจัดการข้อมูลสหกิจและปัญหาพิเศษ (สำหรับอาจารย์)
      </h1>

      <div className="form-group">
        <label>อีเมลอาจารย์</label>
        <div className="input-group">
          {/* ไอคอนผู้ใช้ */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="#00a77f"
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
          </svg>
          <input
            type="email"
            value={advisorEmail}
            onChange={(e) => setAdvisorEmail(e.target.value)}
            placeholder="กรอกอีเมลอาจารย์"
            style={{ paddingLeft: "35px" }}
          />
        </div>
      </div>

      <div className="form-group">
        <label>รหัสผ่าน</label>
        <div className="input-group">
          {/* ไอคอนกุญแจ */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="#00a77f"
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <path d="M12 17a2 2 0 0 0 2-2v-2a2 2 0 1 0-4 0v2a 2 2 0 0 0 2 2zm6-7h-1V7c0-2.8-2.2-5-5-5s-5 2.2-5 5v3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2z" />
          </svg>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="กรอกรหัสผ่าน"
            style={{ paddingLeft: "35px" }}
          />
        </div>

        {/* ปุ่มลืมรหัสผ่าน (คง UI/พาธเดิมตามที่คุณตั้งไว้) */}
        <Link className="forgot" href="/teacher/forgot_password">
          ลืมรหัสผ่าน
        </Link>
      </div>

      <button onClick={loginAdvisor} className="login-btn">
        เข้าสู่ระบบ
      </button>

      {/* ปุ่ม ‘ย้อนกลับ’ */}
      <div className="page-root">
        <BackButton onClick={goBackHome} />
        <div className="login-container"></div>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Kanit', sans-serif; }
        body {
          display: flex; justify-content: center; align-items: center;
          height: 100vh; width: 100vw; background-color: #fff; overflow: hidden;
        }
        .login-container {
          height: 90%; width: 90%; max-width: 650px; max-height: 600px;
          display: flex; flex-direction: column; justify-content: space-between;
          align-items: center; text-align: center;
        }
        .logo { width: 20%; max-width: 120px; height: auto; }

        .page-title {
          font-weight: 600;
          color: #006B5A;
          font-size: clamp(16px, 1.2vw + 14px, 28px);
          line-height: 1.3;
          margin-bottom: 1rem;
          white-space: nowrap;
          text-align: center;   
        }

        .form-group { width: 100%; margin-bottom: 0.6rem; position: relative; }
        .form-group label { display: block; text-align: left; font-size: clamp(0.9rem, 2vh, 1.05rem); color: #333; margin-bottom: 0.15rem; }
        .input-group { display: flex; align-items: center; position: relative; width: 100%; }
        .input-group input {
          width: 100%; padding: 0.6rem 0.8rem 0.6rem 2.5rem;
          font-size: clamp(0.9rem, 1.5vh, 1.1rem);
          border: 2px solid #ddd; border-radius: 10px;
        }

        .forgot {
          position: absolute; left: 0.8rem; bottom: -1.6rem;
          font-size: clamp(0.75rem, 1.5vh, 0.95rem);
          color: #2B7FFF; cursor: pointer; text-decoration: none;
        }

        .login-btn {
          width: 100%; padding: 0.8rem;
          font-size: clamp(0.9rem, 2vh, 1.1rem);
          border-radius: 10px; border: 2px solid #00a77f;
          background-color: #fff; color: #00a77f;
          cursor: pointer; transition: 0.3s; margin-top: 2.5rem;
        }
        .login-btn:hover { background-color: #00a77f; color: #fff; }
      `}</style>
    </div>
  );
}
