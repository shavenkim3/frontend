"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  // steps: 1=กรอกอีเมล/ส่ง OTP, 2=กรอก OTP, 3=ตั้งรหัสผ่านใหม่
  const [step, setStep] = useState(1);

  // ข้อมูลฟอร์ม
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(180);
  const timerRef = useRef(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (router.prefetch) {
      router.prefetch("/student/login_student");
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [router]);

  // ส่ง OTP
  const sendOTP = () => {
    if (!email || !email.includes("@")) {
      alert("กรุณากรอกอีเมลให้ถูกต้อง");
      return;
    }
    // เรียก API ส่ง OTP จริงได้ที่นี่
    alert(`ส่งรหัส OTP ไปยังอีเมล: ${email} แล้ว`);
    setStep(2);
    startTimer();
  };

  // ตัวจับเวลา OTP
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(180);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev > 0) return prev - 1;
        if (timerRef.current) clearInterval(timerRef.current);
        alert("รหัส OTP หมดอายุ กรุณาส่งใหม่");
        setStep(1);
        return 0;
      });
    }, 1000);
  };

  // ยืนยัน OTP
  const verifyOTP = () => {
    if (otp.length === 4) {
      // ตรวจ OTP จริงกับ backend ที่นี่
      if (timerRef.current) clearInterval(timerRef.current);
      setStep(3);
    } else {
      alert("กรุณากรอกรหัส OTP ให้ครบ 4 หลัก");
    }
  };

  // ตั้งรหัสผ่านใหม่
  const resetPassword = () => {
    if (!newPassword || !confirmPassword) {
      alert("กรุณากรอกทั้งสองช่อง");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("รหัสผ่านทั้งสองช่องไม่ตรงกัน");
      return;
    }
    // เรียก API ตั้งรหัสผ่านจริงได้ที่นี่
    alert("ตั้งรหัสผ่านใหม่เรียบร้อย");
    router.push("/student/login_student");
  };

  // กลับหน้า Login
  const backToLogin = () => router.push("/student/login_student");

  return (
    <div className="fp-container">
      <div className="fp-card">
        <h2 className="fp-title">ลืมรหัสผ่าน</h2>

        {step === 1 && (
          <section className="fp-section">
            <label className="fp-label">อีเมล</label>
            <input
              className="fp-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="กรอกอีเมลสำหรับรับรหัส OTP"
            />
            <button className="fp-btn" onClick={sendOTP}>
              ส่งรหัส OTP
            </button>
            <button className="fp-btn fp-ghost" onClick={backToLogin}>
              กลับไปหน้าเข้าสู่ระบบ
            </button>
          </section>
        )}

        {step === 2 && (
          <section className="fp-section">
            <label className="fp-label">กรอกรหัส OTP</label>
            <input
              className="fp-input"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="กรอกรหัส 4 หลัก"
              maxLength={4}
            />
            <div className="fp-timer">
              {`เวลาหมดอายุ: ${String(Math.floor(timer / 60)).padStart(
                2,
                "0"
              )}:${String(timer % 60).padStart(2, "0")}`}
            </div>
            <button className="fp-btn" onClick={verifyOTP}>
              ยืนยัน OTP
            </button>
            <button
              className="fp-btn fp-ghost"
              onClick={() => {
                setStep(1);
                if (timerRef.current) clearInterval(timerRef.current);
              }}
            >
              ส่ง OTP ใหม่
            </button>
          </section>
        )}

        {step === 3 && (
          <section className="fp-section">
            <label className="fp-label">รหัสผ่านใหม่</label>
            <input
              className="fp-input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="รหัสผ่านใหม่"
            />
            <label className="fp-label">ยืนยันรหัสผ่านใหม่</label>
            <input
              className="fp-input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="ยืนยันรหัสผ่านใหม่"
            />
            <button className="fp-btn" onClick={resetPassword}>
              ยืนยัน
            </button>
            <button className="fp-btn fp-ghost" onClick={backToLogin}>
              กลับไปหน้าเข้าสู่ระบบ
            </button>
          </section>
        )}
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Kanit', sans-serif; }
        .fp-container {
          min-height: 100vh; width: 100vw;
          display: grid; place-items: center; background: #f7faf9; padding: 16px;
        }
        .fp-card {
          width: 100%; max-width: 440px; background: #fff;
          border: 1px solid #e6e6e6; border-radius: 14px;
          box-shadow: 0 6px 28px rgba(0,0,0,0.06);
          padding: 20px 18px;
        }
        .fp-title {
          font-size: clamp(20px, 1.2vw + 16px, 28px);
          color: #006B5A; font-weight: 700; margin-bottom: 12px; text-align: center;
        }
        .fp-section { display: flex; flex-direction: column; gap: 10px; margin-top: 6px; }
        .fp-label { font-size: 14px; color: #333; }
        .fp-input {
          width: 100%; padding: 10px 12px; border: 2px solid #e9e9e9; border-radius: 10px;
          font-size: 16px; outline: none;
        }
        .fp-input:focus { border-color: #00a77f; }
        .fp-btn {
          width: 100%; padding: 12px; border: none; border-radius: 10px;
          background: #00a77f; color: #fff; font-size: 16px; cursor: pointer;
        }
        .fp-btn:hover { filter: brightness(0.95); }
        .fp-ghost {
          background: #fff; color: #00a77f; border: 2px solid #00a77f; margin-top: 4px;
        }
        .fp-ghost:hover { background: #00a77f; color: #fff; }
        .fp-timer { font-size: 14px; color: #555; text-align: center; }
      `}</style>
    </div>
  );
}
