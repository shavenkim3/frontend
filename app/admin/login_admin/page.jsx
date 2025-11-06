"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"
import { adminLogin, setAdminToken } from "@/lib/adminApi";
import BackButton from "@/components/ui/BackButton";

export default function LoginPage() {
  const [adminName, setAdminName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [err, setErr]           = useState("");
  const [credError, setCredError] = useState(false);
  const router = useRouter();

const loginAdmin = async () => {
  setErr("");
  setCredError(false);

  // กรอกไม่ครบ -> แดง + ข้อความ + แถบแจ้งเตือน
  if (!adminName.trim() || !password.trim()) {
    setCredError(true);
    setErr("กรุณากรอก รหัสผู้ดูแล และ รหัสผ่าน");
    return;
  }

  try {
    setLoading(true);
    const res = await adminLogin({ admin_name: adminName.trim(), password });
    setAdminToken(res.token);
    router.push("/admin/dashboard");
    
  } catch (error) {
  console.log("login error:", error?.message);

  // ไม่ต้องเช็กเงื่อนไขแล้ว — ทุก error จะถือว่า login ล้มเหลว
  setCredError(true);
  setErr("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
} finally {
  setLoading(false);
}

};
  // ปุ่ม “ย้อนกลับ” → กลับหน้าแรก
    const goBackHome = () => router.push("/");

  return (
    <div className="login-container">
      <img src="/logo/IT_logo.png" alt="Logo" className="logo" />

      {/* ✅ ข้อความหัวข้อใหม่ */}
      <h1 className="page-title">
        เข้าใช้งานระบบจัดการข้อมูลสหกิจและปัญหาพิเศษ (สำหรับแอดมิน)
      </h1>
      {err && (
  <div className="alert alert-error" role="alert">
    <span>{err}</span>
    <button
      type="button"
      className="alert-close"
      aria-label="close"
      onClick={() => setErr("")}
    >
      ×
    </button>
  </div>
)}


      <div className="form-group">
        <label>รหัสผู้ดูแลระบบ</label>
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
  type="text"
  value={adminName}
  onChange={(e) => { setAdminName(e.target.value); setCredError(false); }}
  placeholder="กรอกรหัสแอดมิน"
  style={{ paddingLeft: "35px" }}
  className={credError ? "invalid" : ""}
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
            <path d="M12 17a2 2 0 0 0 2-2v-2a2 2 0 1 0-4 0v2a2 2 0 0 0 2 2zm6-7h-1V7c0-2.8-2.2-5-5-5s-5 2.2-5 5v3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2z" />
          </svg>
          <input
  type="password"
  value={password}
  onChange={(e) => { setPassword(e.target.value); setCredError(false); }}
  placeholder="กรอกรหัสผ่าน"
  style={{ paddingLeft: "35px" }}
  className={credError ? "invalid" : ""}
/>



        </div>
      </div>

      <button type="button" onClick={loginAdmin} className="login-btn" disabled={loading}>
  เข้าสู่ระบบ
</button>



      {/* ปุ่ม ‘ย้อนกลับ’ */}
      <div className="page-root">
        <BackButton onClick={goBackHome} />
        <div className="login-container">

        </div>
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

        .login-btn {
          width: 100%; padding: 0.8rem;
          font-size: clamp(0.9rem, 2vh, 1.1rem);
          border-radius: 10px; border: 2px solid #00a77f;
          background-color: #fff; color: #00a77f;
          cursor: pointer; transition: 0.3s; margin-top: 2.5rem;
        }
        .login-btn:hover { background-color: #00a77f; color: #fff; }

        .admin-title-container { display: flex; align-items: center; width: 100%; margin-top: 0.5rem; }
        .admin-title-container::before,
        .admin-title-container::after { content: ""; flex: 1; height: 1px; background-color: #ccc; }
        .admin-title-btn {
          padding: 0 10px;
          font-size: clamp(0.75rem, 1.5vh, 0.95rem);
          color: #2B7FFF; background: transparent; border: 0; cursor: pointer; white-space: nowrap;
        }

        /* === Alert banner === */
.alert {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  margin: 8px 0 10px 0;
  font-size: 0.95rem;
  text-align: left;
}

.alert-error {
  background: #ffe9e9;
  border: 1px solid #ffc5c5;
  color: #b00020;
}

.alert-close {
  border: 0;
  background: transparent;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  color: inherit;
  padding: 2px 6px;
}
.alert-close:hover { opacity: 0.8; }

          
            
`}</style>
    </div>
  );
}



