"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import { apiFetch, setCompanyToken } from "@/lib/api";

export default function CompanyLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [fieldErr, setFieldErr] = useState({ email: "", password: "" });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");          // ข้อความ error รวม (โชว์ใน alert)
  const [showAlert, setShowAlert] = useState(false); // คุมการแสดง alert

  const router = useRouter();
  const timerRef = useRef(null);

  useEffect(() => {
    if (router.prefetch) {
      router.prefetch("/company/change-password");
      router.prefetch("/company/dashboard");
      router.prefetch("/");
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [router]);

  const validate = () => {
    const fe = { email: "", password: "" };
    if (!email.trim()) fe.email = "กรุณากรอกอีเมล";
    if (!password.trim()) fe.password = "กรุณากรอกรหัสผ่าน";
    setFieldErr(fe);
    return !fe.email && !fe.password;
  };

  const loginCompany = async () => {
    setErr("");
    setShowAlert(false);

    // touch ทั้งสองฟิลด์ก่อนตรวจ
    setTouched({ email: true, password: true });
    if (!validate()) {
      setErr("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      setShowAlert(true);
      return;
    }

    setLoading(true);
    try {
      // หมายเหตุ: endpoint ของคุณอาจเป็น /company/auth/login ถ้าแบ็กเอนด์ตั้งไว้แบบนั้น
      const res = await apiFetch("/auth/company/login", {
        method: "POST",
        body: { email: email.trim().toLowerCase(), password },
      });

      if (res?.token) setCompanyToken(res.token);

      if (res?.user?.must_change_password) {
        router.replace("/company/change-password");
      } else {
        router.replace("/company/dashboard");
      }
    } catch (e) {
      // map สถานะยอดฮิต -> ข้อความที่เข้าใจง่าย และไฮไลต์ช่องผิด
      if (e?.status === 401) {
   setErr("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
 } else if (e?.status === 429) {
        setErr("พยายามเข้าสู่ระบบบ่อยเกินไป กรุณาลองใหม่อีกครั้งภายหลัง");
      } else if (e?.status >= 500) {
        setErr("เซิร์ฟเวอร์ขัดข้อง กรุณาลองใหม่อีกครั้ง");
      } else {
        setErr(e.message || "เข้าสู่ระบบไม่สำเร็จ");
      }
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const goBackHome = () => router.push("/");

  return (
    <div className="login-container">
      
      <img src="/logo/IT_logo.png" alt="Logo" className="logo" />
      <h1 className="page-title">
        เข้าใช้งานระบบจัดการข้อมูลสหกิจและปัญหาพิเศษ (สำหรับหน่วยงานภายนอก)
      </h1>

      {/* Alert banner */}
      {showAlert && err && (
        <div className="alert alert-error" role="alert" aria-live="assertive">
          <span>{err}</span>
          <button
            className="alert-close"
            aria-label="ปิดข้อความแจ้งเตือน"
            onClick={() => setShowAlert(false)}
          >
            ×
          </button>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="company-email">อีเมล</label>
        <div className="input-group">
          {/* ไอคอนผู้ใช้ */}
          <svg
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            width="20" height="20" fill="#00a77f"
            style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }}
            aria-hidden="true"
          >
            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
          </svg>
          <input
            id="company-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (touched.email) setFieldErr((p) => ({ ...p, email: "" }));
            }}
            onBlur={() => setTouched((p) => ({ ...p, email: true }))}
            placeholder="กรอกอีเมลบริษัทของคุณ"
            style={{ paddingLeft: "35px" }}
            aria-invalid={touched.email && !!fieldErr.email}
            aria-describedby={fieldErr.email ? "email-error" : undefined}
          />
        </div>
        {touched.email && fieldErr.email && (
          <div id="email-error" style={{ color: "#b00020", marginTop: 6 }}>{fieldErr.email}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="company-password">รหัสผ่าน</label>
        <div className="input-group">
          {/* ไอคอนกุญแจ */}
          <svg
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            width="20" height="20" fill="#00a77f"
            style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }}
            aria-hidden="true"
          >
            <path d="M12 17a2 2 0 0 0 2-2v-2a2 2 0 1 0-4 0v2a2 2 0 0 0 2 2zm6-7h-1V7c0-2.8-2.2-5-5-5s-5 2.2-5 5v3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2z" />
          </svg>
          <input
            id="company-password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (touched.password) setFieldErr((p) => ({ ...p, password: "" }));
            }}
            onBlur={() => setTouched((p) => ({ ...p, password: true }))}
            placeholder="กรอกรหัสผ่าน"
            style={{ paddingLeft: "35px" }}
            aria-invalid={touched.password && !!fieldErr.password}
            aria-describedby={fieldErr.password ? "password-error" : undefined}
          />
        </div>
        {touched.password && fieldErr.password && (
          <div id="password-error" style={{ color: "#b00020", marginTop: 6 }}>{fieldErr.password}</div>
        )}

        
      </div>

      <button onClick={loginCompany} className="login-btn" disabled={loading}>
        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>


      <div className="page-root">
        <BackButton onClick={goBackHome} />
        <div className="login-container"></div>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Kanit', sans-serif; }
        body { display: flex; justify-content: center; align-items: center; height: 100vh; width: 100vw; background-color: #fff; overflow: hidden; }
        .login-container { height: 90%; width: 90%; max-width: 650px; max-height: 600px; display: flex; flex-direction: column; justify-content: space-between; align-items: center; text-align: center; }
        .logo { width: 20%; max-width: 120px; height: auto; }
        .page-title { font-weight: 600; color: #006B5A; font-size: clamp(16px, 1.2vw + 14px, 28px); line-height: 1.3; margin-bottom: 1rem; white-space: nowrap; text-align: center; }
        .form-group { width: 100%; margin-bottom: 0.6rem; position: relative; }
        .form-group label { display: block; text-align: left; font-size: clamp(0.9rem, 2vh, 1.05rem); color: #333; margin-bottom: 0.15rem; }
        .input-group { display: flex; align-items: center; position: relative; width: 100%; }
        .input-group input { width: 100%; padding: 0.6rem 0.8rem 0.6rem 2.5rem; font-size: clamp(0.9rem, 1.5vh, 1.1rem); border: 2px solid #ddd; border-radius: 10px; }
        .forgot { position: absolute; left: 0.8rem; bottom: -1.6rem; font-size: clamp(0.75rem, 1.5vh, 0.95rem); color: #2B7FFF; cursor: pointer; text-decoration: none; }
        .login-btn { width: 100%; padding: 0.8rem; font-size: clamp(0.9rem, 2vh, 1.1rem); border-radius: 10px; border: 2px solid #00a77f; background-color: #fff; color: #00a77f; cursor: pointer; transition: 0.3s; margin-top: 2.5rem; }
        .login-btn:hover { background-color: #00a77f; color: #fff; }
        .admin-title-container { display: flex; align-items: center; width: 100%; margin-top: 0.5rem; }
        .admin-title-container::before, .admin-title-container::after { content: ""; flex: 1; height: 1px; background-color: #ccc; }
        .admin-title-btn { padding: 0 10px; font-size: clamp(0.75rem, 1.5vh, 0.95rem); color: #2B7FFF; background: transparent; border: 0; cursor: pointer; white-space: nowrap; }
        /* ===== Alert (แบบในภาพ) ===== */
.alert {
  width: 100%;
  max-width: 640px;
  margin: 0 auto 14px;
  padding: 12px 14px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  font-size: 0.95rem;
}
.alert-error {
  background: #fee2e2;          /* แดงจาง */
  color: #991b1b;               /* ตัวอักษรแดงเข้ม */
  border: 1px solid #fecaca;    /* เส้นขอบแดงอ่อน */
}
.alert-close {
  position: absolute;
  right: 10px;
  top: 8px;
  border: 0;
  background: transparent;
  color: #991b1b;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

/* ===== invalid input ===== */
.input-group input.invalid {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

      `}</style>
    </div>
  );
}