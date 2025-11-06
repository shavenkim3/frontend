// app/forgot-password/page.jsx
"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

/** 
 * แยกส่วนเนื้อหาที่ใช้ useSearchParams() ออกมาเป็น Client Component 
 * แล้วค่อยให้ Page หลักครอบด้วย <Suspense> อีกชั้น (ตามข้อกำหนด Next.js 14/15)
 */
function ForgotPasswordContent() {
  const router = useRouter();

  // ---------- state หลัก ----------
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [emailErr, setEmailErr] = useState("");
  const [otpErr, setOtpErr] = useState("");
  const [pwErr, setPwErr] = useState("");

  const [toast, setToast] = useState(null);
  const [msg, setMsg] = useState("");

  // ---------- query params ----------
  const searchParams = useSearchParams();
  const resetOk = searchParams.get("reset") === "success";
  const emailFromReset = searchParams.get("email") || "";

  // ---------- utils ----------
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const pwScore = useMemo(() => {
    let s = 0;
    if (newPassword.length >= 8) s++;
    if (/[A-Z]/.test(newPassword)) s++;
    if (/[a-z]/.test(newPassword)) s++;
    if (/[0-9]/.test(newPassword)) s++;
    if (/[^A-Za-z0-9]/.test(newPassword)) s++;
    return Math.min(s, 4);
  }, [newPassword]);

  const pwLabel = ["อ่อนมาก", "อ่อน", "ปานกลาง", "ดี", "ดีมาก"][pwScore];

  const showToast = (type, text, dur = 3000) => {
    setToast({ type, text });
    if (dur > 0) setTimeout(() => setToast(null), dur);
  };

  // ---------- effects ----------
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  useEffect(() => {
    if (!email) setEmailErr("");
    else if (!isEmail(email)) setEmailErr("รูปแบบอีเมลไม่ถูกต้อง");
    else setEmailErr("");
  }, [email]);

  useEffect(() => {
    if (!otp) setOtpErr("");
    else if (!/^\d{6}$/.test(otp)) setOtpErr("OTP ต้องเป็นตัวเลข 6 หลัก");
    else setOtpErr("");
  }, [otp]);

  useEffect(() => {
    if (!newPassword) setPwErr("");
    else if (newPassword.length < 6) setPwErr("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
    else setPwErr("");
  }, [newPassword]);

  // ตั้งค่า email จาก query string (ถ้ามี)
  useEffect(() => {
    if (emailFromReset) setEmail(emailFromReset);
  }, [emailFromReset]);

  // ---------- handlers ----------
  const handleSendOtp = async () => {
    if (!email) {
      setEmailErr("กรุณากรอกอีเมล");
      showToast("error", "กรุณากรอกอีเมล");
      return;
    }
    if (!isEmail(email)) {
      setEmailErr("รูปแบบอีเมลไม่ถูกต้อง");
      showToast("error", "อีเมลไม่ถูกต้อง");
      return;
    }
    try {
      setLoadingSend(true);
      await api.requestOtp(email, "reset");
      setMsg("ส่ง OTP แล้ว กรุณาตรวจสอบอีเมลของคุณ");
      showToast("success", "ส่ง OTP แล้ว");
      setCooldown(60);
    } catch (e) {
      const m = e?.message || "ส่ง OTP ไม่สำเร็จ";
      setMsg(m);
      showToast("error", m);
    } finally {
      setLoadingSend(false);
    }
  };

  const handleReset = async () => {
    let anyErr = false;

    if (!email) {
      setEmailErr("กรุณากรอกอีเมล");
      showToast("error", "กรุณากรอกอีเมล");
      anyErr = true;
    } else if (!isEmail(email)) {
      setEmailErr("รูปแบบอีเมลไม่ถูกต้อง");
      showToast("error", "อีเมลไม่ถูกต้อง");
      anyErr = true;
    }

    if (!otp) {
      setOtpErr("กรุณากรอก OTP");
      showToast("error", "กรุณากรอก OTP");
      anyErr = true;
    } else if (!/^\d{6}$/.test(otp)) {
      setOtpErr("OTP ต้องเป็นตัวเลข 6 หลัก");
      showToast("error", "OTP ต้องเป็นตัวเลข 6 หลัก");
      anyErr = true;
    }

    if (!newPassword) {
      setPwErr("กรุณาตั้งรหัสผ่านใหม่");
      showToast("error", "กรุณาตั้งรหัสผ่านใหม่");
      anyErr = true;
    } else if (newPassword.length < 6) {
      setPwErr("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      showToast("error", "รหัสผ่านสั้นเกินไป");
      anyErr = true;
    }

    if (anyErr) return;

    try {
      setLoadingReset(true);
      await api.resetPassword(email, otp, newPassword);
      setMsg("ตั้งรหัสผ่านสำเร็จ");
      showToast("success", "ตั้งรหัสผ่านสำเร็จ");

      // ส่งไปหน้า login พร้อมพารามิเตอร์แจ้งเตือน
      setTimeout(() => {
        router.push("/login_students?reset=success"); // ปรับ path ให้ตรงโปรเจกต์คุณ
      }, 800);
    } catch (e) {
      const m = e?.message || "รีเซ็ตรหัสผ่านไม่สำเร็จ";
      setMsg(m);
      showToast("error", m);
    } finally {
      setLoadingReset(false);
    }
  };

  // ---------- UI ----------
  return (
    <div className="relative">
      {/* Toast */}
      {toast && (
        <div
          className={[
            "fixed right-4 top-4 z-50 rounded-xl px-4 py-3 shadow-lg text-sm",
            toast.type === "success" && "bg-emerald-50 text-emerald-700 border border-emerald-200",
            toast.type === "error" && "bg-red-50 text-red-700 border border-red-200",
            toast.type === "info" && "bg-sky-50 text-sky-700 border border-sky-200",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {toast.text}
        </div>
      )}

      {/* แบนเนอร์หลังรีเซ็ตสำเร็จ */}
      {resetOk && (
        <div className="mx-auto mt-6 w-full max-w-4xl rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          รีเซ็ตรหัสผ่านเรียบร้อยแล้ว กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่ของคุณ
        </div>
      )}

      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">ลืมรหัสผ่าน</h1>

        {/* email + send otp */}
        <div className="space-y-2 mb-8">
          <input
            className={`border rounded px-3 py-2 w-full ${emailErr ? "border-red-400" : "border-slate-300"}`}
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => {
              if (!email) setEmailErr("กรุณากรอกอีเมล");
            }}
          />
          {emailErr && <p className="text-red-600 text-sm">{emailErr}</p>}

          <div className="flex items-center gap-3">
            <button
              className={`px-4 py-2 rounded text-white ${
                cooldown > 0 || loadingSend ? "bg-emerald-300 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
              }`}
              onClick={handleSendOtp}
              disabled={cooldown > 0 || loadingSend}
            >
              {loadingSend ? "กำลังส่ง..." : cooldown > 0 ? `ขอ OTP ใหม่ใน ${cooldown}s` : "ขอ OTP"}
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded border border-slate-300 hover:bg-slate-50"
              onClick={() => {
                setEmail("");
                setEmailErr("");
                showToast("info", "ล้างอีเมลแล้ว");
              }}
            >
              ล้างอีเมล
            </button>
          </div>
          <p className="text-xs text-slate-500">* จะสามารถขอ OTP ใหม่ได้หลังจาก {cooldown || 0} วินาที</p>
        </div>

        {/* otp + new password */}
        <div className="space-y-3">
          <input
            className={`border rounded px-3 py-2 w-full ${otpErr ? "border-red-400" : "border-slate-300"}`}
            placeholder="OTP (6 หลัก)"
            inputMode="numeric"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            onBlur={() => {
              if (!otp) setOtpErr("กรุณากรอก OTP");
            }}
          />
          {otpErr && <p className="text-red-600 text-sm">{otpErr}</p>}

          <div>
            <input
              className={`border rounded px-3 py-2 w-full ${pwErr ? "border-red-400" : "border-slate-300"}`}
              placeholder="รหัสผ่านใหม่"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onBlur={() => {
                if (!newPassword) setPwErr("กรุณาตั้งรหัสผ่านใหม่");
              }}
            />
            {pwErr && <p className="text-red-600 text-sm mt-1">{pwErr}</p>}

            {newPassword && (
              <div className="mt-2">
                <div className="h-2 bg-slate-200 rounded overflow-hidden">
                  <div
                    className={[
                      "h-full transition-all",
                      pwScore === 0 && "w-1/5",
                      pwScore === 1 && "w-2/5",
                      pwScore === 2 && "w-3/5",
                      pwScore === 3 && "w-4/5",
                      pwScore === 4 && "w-full",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    style={{
                      // ปล่อยสีตาม tailwind class ด้านบน (ถ้าต้องการคุมสีเองเพิ่ม class ได้)
                      backgroundColor:
                        pwScore <= 0
                          ? "rgb(239 68 68)" // red-500
                          : pwScore === 1
                          ? "rgb(249 115 22)" // orange-500
                          : pwScore === 2
                          ? "rgb(234 179 8)" // yellow-500
                          : pwScore === 3
                          ? "rgb(16 185 129)" // emerald-500
                          : "rgb(5 150 105)", // emerald-600
                    }}
                  />
                </div>
                <p className="text-xs text-slate-600 mt-1">ความแข็งแรงรหัสผ่าน: {pwLabel}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              className={`px-4 py-2 rounded text-white ${
                loadingReset ? "bg-emerald-300 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
              }`}
              onClick={handleReset}
              disabled={loadingReset}
            >
              {loadingReset ? "กำลังดำเนินการ..." : "ยืนยันรีเซ็ต"}
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded border border-slate-300 hover:bg-slate-50"
              onClick={() => {
                setOtp("");
                setNewPassword("");
                setOtpErr("");
                setPwErr("");
                showToast("info", "ล้างฟิลด์แล้ว");
              }}
            >
              ล้างฟิลด์
            </button>
          </div>
        </div>

        {msg && <p className="mt-4 text-sm text-slate-700">{msg}</p>}
      </div>
    </div>
  );
}

/**
 * Page หลัก: ครอบด้วย <Suspense> เพื่อรองรับ useSearchParams() ภายใน
 */
export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-600">กำลังโหลด...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
