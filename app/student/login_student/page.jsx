"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import BackButton from "@/components/ui/BackButton";

// แมปค่าจากตาราง → เส้นทางหน้า
const OPTIONS = {
  special_problem: { code: "project", path: "/student/project/Special_Problem" },
  coop:            { code: "coop",    path: "/student/coop/coop_problem" },
};

const CODE_TO_PATH = {
  project: "/student/project/Special_Problem",
  coop:    "/student/coop/coop_problem",
};

function pathByReg(val) {
  const k = String(val ?? "").toLowerCase().trim();
  if (!k) return null;
  if (OPTIONS[k]?.path) return OPTIONS[k].path;                         // type → path
  if (OPTIONS[k]?.code && CODE_TO_PATH[OPTIONS[k].code])                // type → code → path
    return CODE_TO_PATH[OPTIONS[k].code];
  if (CODE_TO_PATH[k]) return CODE_TO_PATH[k];                          // code → path
  return null;
}

// helper เลือก path จาก reg_type/reg_code แบบกันเหนียว




const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function LoginPage() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const timerRef = useRef(null);
  const [err, setErr] = useState("");
  const [credError, setCredError] = useState(false);

  // Prefetch หน้า Home และหน้า Forgot Password ให้กดแล้วไวขึ้น
  useEffect(() => {
    if (router.prefetch) {
      router.prefetch("/");
      router.prefetch("/student/forgot_password");
      // ✅ เผื่อไว้ให้ไวขึ้น
      router.prefetch("/student/onboarding");
      router.prefetch("/student/registration");
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [router]);

  // (เรียก backend จริง)
const loginStudent = async () => {
  setErr("");
  setCredError(false);

  const email = studentId.trim();
  const pwd = password.trim();

  if (!email || !pwd) {
    setCredError(true);
    setErr("กรุณากรอกอีเมลและรหัสผ่าน");
    return;
  }

  const emailLike = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailLike.test(email)) {
    setCredError(true);
    setErr("รูปแบบอีเมลไม่ถูกต้อง");
    return;
  }

  setLoading(true);
  try {
    // ✅ api.loginStudent ต้องส่ง { email, password } ไป backend
    const res = await api.loginStudent(email, pwd);

    if (!res?.token) {
      setCredError(true);
      setErr("เข้าสู่ระบบไม่สำเร็จ");
      return;
    }

    localStorage.setItem("token", res.token);

    // ✅ ตรวจสถานะ registration จาก backend
    let nextPath = "/";
    try {
      const statusRes = await fetch(`${API_URL}/api/me/registration`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${res.token}`,
        },
      });

      // token ใช้ไม่ได้
      if (statusRes.status === 401 || statusRes.status === 403) {
        setCredError(true);
        setErr("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
        localStorage.removeItem("token");
        return;
      }

      // ❗ เปลี่ยนเงื่อนไข: ถ้า 404 หรือไม่ ok → ถือว่ายังไม่ผูก → ไป onboarding
      if (statusRes.status === 404 || !statusRes.ok) {
        nextPath = "/student/onboarding";
      } else {
        const data = await statusRes.json().catch(() => ({}));

        // อนุมานการผูกนิสิตให้รอบคอบ
        const isLinked =
          data?.isLinked ??
          Boolean(data?.student_id) ??
          Boolean(data?.linked || data?.linked_at);

        const regType = data?.reg_type ?? data?.type ?? null; // e.g., "special_problem"|"coop"|null
        const regCode = data?.reg_code ?? null;                // e.g., "project"|"coop"|null

        if (!isLinked) {
          nextPath = "/student/onboarding";
        } else if (regType === null && regCode === null) {
          nextPath = "/student/registration";
        } else {
          const regPath = pathByReg(regCode || regType);
          nextPath = regPath || "/student/dashboard";
        }
      }
    } catch {
      // เรียกสถานะพลาด → พาไป onboarding ให้ผู้ใช้ผูกก่อน
      nextPath = "/student/onboarding";
    }

    router.replace(nextPath);
    return;
  } catch (error) {
    console.log("login error:", error?.message);
    setCredError(true);
    if (error?.status === 401) {
      setErr("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } else if (error?.status === 428) {
      setErr("กรุณาผูกรหัสนิสิตก่อนใช้งานครั้งแรก");
    } else {
      setErr(error?.message || "เข้าสู่ระบบไม่สำเร็จ");
    }
  } finally {
    setLoading(false);
  }
};



  // ปุ่ม “ย้อนกลับ” → กลับหน้าแรก
  const goBackHome = (e) => {
    router.push("/");
  };

  return (
    <div className="login-container">
      <img src="/logo/IT_logo.png" alt="Logo" className="logo" />
      <h1 className="page-title">
        เข้าใช้งานระบบจัดการข้อมูลสหกิจและปัญหาพิเศษ  (สำหรับนิสิต)
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
        <label>รหัสนิสิต</label>
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
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="กรอกรหัสนิสิต"
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
            <path d="M12 17a2 2 0 0 0 2-2v-2a2 2 0 1 0-4 0v2a2 2 0 0 0 2 2zm6-7h-1V7c0-2.8-2.2-5-5-5s-5 2.2-5 5v3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2z" />
          </svg>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="กรอกรหัสผ่าน"
            style={{ paddingLeft: "35px" }}
          />
        </div>

        {/* ลิงก์ไปหน้าใหม่ */}
        <Link className="forgot" href="/student/forgot_password">
          ลืมรหัสผ่าน
        </Link>
      </div>

      <button onClick={loginStudent} className="login-btn" disabled={loading}>
        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>

      {/* ปุ่ม ‘ย้อนกลับ’ */}
      <div className="page-root">
        <BackButton onClick={goBackHome} />
        <div className="login-container">

        </div>
      </div>
      {/* ปุ่ม ‘ลงทะเบียน’ */}
      <div className="register-hint-container">
        <p className="register-hint-text">
          ยังไม่มีบัญชีผู้ใช้?{" "}
          <a href="/student/register" className="register-hint-link">
            ลงทะเบียนเลย
          </a>
        </p>
      </div>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Kanit', sans-serif; }
        body { display: flex; justify-content: center; align-items: center; height: 100vh; width: 100vw; background-color: #fff; overflow: hidden; }
        .login-container { height: 90%; width: 90%; max-width: 650px; max-height: 600px; display: flex; flex-direction: column; justify-content: space-between; align-items: center; text-align: center; }
        .logo { width: 20%; max-width: 120px; height: auto; }

        .page-title {
  font-weight: 600;
  color: #006B5A;
  font-size: clamp(1rem, 1.5vw + 0.8rem, 1.75rem); /* responsive text */
  line-height: 1.3;
  margin-bottom: 1rem;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: keep-all;
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

/* === Error border === */
.invalid {
  border-color: #e74c3c !important;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.08);
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
        .login-btn:disabled { opacity: .6; cursor: not-allowed; }
        .register-hint-container {

        display: flex;
        align-items: center;
       width: 100%;
       margin-top: 0.5rem;
      }

      .register-hint-container::before,
      .register-hint-container::after {
        content: "";
        flex: 1;
        height: 1px;
        background-color: #ccc;
      }

  /* ข้อความหลัก */
      .register-hint-text {
       margin: 0 0.75rem;
       font-size: 0.85rem; 
       color: #000;
       text-align: center;
      }

      /* ลิงก์ลงทะเบียน */
      .register-hint-link {
       color: #00a77f;
       text-decoration: none;
         font-weight: 600;
     transition: color 0.2s ease;
      }

      .register-hint-link:hover {
        color: #006a50;
        text-decoration: underline;
      }

      @media (max-width: 600px) {
  .page-title {
    white-space: normal;
    font-size: clamp(1rem, 3vw + 0.5rem, 1.5rem);
    margin-bottom: 0.75rem;
    padding: 0 0.5rem;
  }
}

/* ถ้าหน้าจอใหญ่ขึ้น (desktop) ก็ขยายเล็กน้อย */
@media (min-width: 1200px) {
  .page-title {
    font-size: clamp(1.5rem, 1vw + 1rem, 2rem);
  }
}
      `}</style>
    </div>
  );
}