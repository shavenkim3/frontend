"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import BackButton from "@/components/ui/BackButton";

export default function RegisterEmailOtpPage() {
  const router = useRouter();

  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  // เช็คอีเมลตั้งแต่ Step 1
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // timer สำหรับ OTP
  const [timer, setTimer] = useState(180);
  const timerRef = useRef(null);

  const isEmailValid = /\S+@\S+\.\S+/.test(email.trim());
  const isOtpValid = /^\d{4,6}$/.test(otp); // 4–6 ตัวเลข
  const isPwValid = password.length >= 8 && password === confirm;

  const cleanOtp = (s) => s.replace(/\D/g, "").slice(0, 6);


  const goBackHome = () => {
    router.push("/student/login_student");
  };

  // ✅ เช็คอีเมลอัตโนมัติเมื่อกรอกครบ (debounce)
  useEffect(() => {
    const trimmed = email.trim();

    // reset flags เมื่อพิมพ์ไม่ครบหรือรูปแบบไม่ถูก
    if (!isEmailValid) {
      setEmailExists(false);
      setCheckingEmail(false);
      return;
    }

    setCheckingEmail(true);
    const t = setTimeout(async () => {
      try {
        const res = await api.checkEmail(trimmed);
        setEmailExists(res?.exists === true);
      } catch {
        setEmailExists(false);
      } finally {
        setCheckingEmail(false);
      }
    }, 500);

    return () => clearTimeout(t);
  }, [email, isEmailValid]);

  // เริ่มจับเวลาเมื่อเข้าสู่ Step 2
  useEffect(() => {
    if (step === 2) {
      setTimer(30);
      if (timerRef.current) {
       clearInterval(timerRef.current);
       timerRef.current = null;
     }
      timerRef.current = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            if (timerRef.current) {
             clearInterval(timerRef.current);
             timerRef.current = null;
           }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => {
       if (timerRef.current) {
                 clearInterval(timerRef.current);
         timerRef.current = null;
       }
     };
    }
  }, [step]);

  // STEP 1: ส่ง OTP ไปอีเมล
  const sendOtp = async (e) => {
    e?.preventDefault();
    if (!isEmailValid || loading || checkingEmail || emailExists) return;

    setErr(""); setOk(""); setLoading(true);
    try {
      // กันเคสที่ state ยังไม่ทันอัปเดต
      const chk = await api.checkEmail(email.trim());
      if (chk?.exists) {
        setEmailExists(true);
        setErr("อีเมลนี้มีบัญชีอยู่แล้ว กรุณาเข้าสู่ระบบหรือกดลืมรหัสผ่าน");
        return;
      }

      await api.requestOtp(email.trim(), "signup");
      setOk("ส่งรหัส OTP ไปที่อีเมลแล้ว โปรดตรวจสอบกล่องข้อความ/สแปม");
      setStep(2);
    } catch (error) {
      setErr(error?.message || "ส่ง OTP ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (timer > 0 || loading) return;
    setOk(""); setErr("");
    await sendOtp();
  };

  // STEP 3: ตั้งรหัสผ่าน + ยืนยันกับแบ็กเอนด์ (สมัคร)
  const submitPassword = async (e) => {
    e.preventDefault();
    if (!isOtpValid || !isPwValid || loading) return;

    setErr(""); setOk(""); setLoading(true);
    try {
      await api.registerWithOtp({ email: email.trim(), otp: otp.trim(), password });
      setOk("สมัครสำเร็จ! กำลังพาไปหน้าเข้าสู่ระบบ…");
      setTimeout(() => router.replace("/student/login_student"), 800);
    } catch (error) {
      setErr(error?.message || "ตั้งรหัสผ่านไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <h1 className="page-title">สร้างบัญชีผู้ใช้</h1>

      <div className="page-root">
        <BackButton onClick={goBackHome} />
        <div className="login-container" />
      </div>

      {/* STEP 1: ใส่อีเมล */}
      {step === 1 && (
        <form className="register-form" onSubmit={sendOtp} noValidate>
          <div className="form-row">
            <label htmlFor="email">อีเมล</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErr(""); setOk("");
              }}
              required
              autoComplete="email"
              aria-invalid={!!(isEmailValid && emailExists)}
            />
            <small className="hint">เราจะส่ง OTP เพื่อยืนยันอีเมลของคุณ</small>
            {isEmailValid && checkingEmail && (
              <small className="hint">กำลังตรวจสอบอีเมล…</small>
            )}
            {isEmailValid && !checkingEmail && emailExists && (
              <small className="error">
                อีเมลนี้มีบัญชีอยู่แล้ว กรุณา{" "}
                <a href="/student/login_student" className="register-hint-link">เข้าสู่ระบบ</a>{" "}
                หรือกดลืมรหัสผ่าน
              </small>
            )}
          </div>

          {err && <div className="alert error">{err}</div>}
          {ok && <div className="alert success">{ok}</div>}

          <button
            className="submit-btn"
            disabled={!isEmailValid || loading || checkingEmail || emailExists}
          >
            {loading
              ? "กำลังส่ง OTP…"
              : checkingEmail
              ? "กำลังตรวจสอบอีเมล…"
              : emailExists
              ? "อีเมลนี้มีบัญชีอยู่แล้ว"
              : "ส่ง OTP"}
          </button>

          <div className="register-hint-container">
            <p className="register-hint-text">
              มีบัญชีอยู่แล้ว?
              <a href="/student/login_student" className="register-hint-link"> เข้าสู่ระบบ</a>
            </p>
          </div>
        </form>
      )}

      {/* STEP 2: ใส่ OTP */}
      {step === 2 && (
        <form
          className="register-form"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!isOtpValid || loading) return;
            setErr(""); setOk(""); setLoading(true);
            try {
              await api.verifyOtp(email.trim(), otp.trim(), "signup");
              setOk("ยืนยัน OTP สำเร็จ");
              setStep(3);
            } catch (error) {
              setErr(error?.message || "OTP ไม่ถูกต้องหรือหมดอายุ");
            } finally {
              setLoading(false);
            }
          }}
          noValidate
        >
          <div className="form-row">
            <label htmlFor="otp">รหัส OTP</label>
            <input
              id="otp"
              type="text"
              placeholder="กรอกรหัส 4–6 หลัก"
              value={otp}
              onChange={(e) => setOtp(cleanOtp(e.target.value))}
              inputMode="numeric"
              autoComplete="one-time-code"
              required
            />
            <div className="otp-actions">
              <span className="hint">
                {timer > 0 ? `ขอรหัสใหม่ได้ใน ${timer}s` : "ขอรหัสใหม่ได้แล้ว"}
              </span>
              <button
                type="button"
                className="link-inline"
                disabled={timer > 0 || loading}
                onClick={resendOtp}
              >
                ส่ง OTP อีกครั้ง
              </button>
            </div>
            <p className="hint">กำลังยืนยันอีเมล: <b>{email.trim()}</b></p>
          </div>

          {err && <div className="alert error">{err}</div>}
          {ok && <div className="alert success">{ok}</div>}

          <div className="grid-2">
            <button type="button" className="secondary-btn" onClick={() => setStep(1)}>
              ย้อนกลับ
            </button>
            <button className="submit-btn" disabled={!isOtpValid || loading}>
              ต่อไป
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: ตั้งรหัสผ่าน */}
      {step === 3 && (
        <form className="register-form" onSubmit={submitPassword} noValidate>
          <div className="form-row">
            <label htmlFor="password">ตั้งรหัสผ่าน</label>
            <input
              id="password"
              type="password"
              placeholder="อย่างน้อย 8 ตัวอักษร"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <small className="hint">ควรผสมตัวอักษรและตัวเลข</small>
          </div>

          <div className="form-row">
            <label htmlFor="confirm">ยืนยันรหัสผ่าน</label>
            <input
              id="confirm"
              type="password"
              placeholder="พิมพ์ซ้ำอีกครั้ง"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
            {confirm.length > 0 && confirm !== password && (
              <small className="error">รหัสผ่านไม่ตรงกัน</small>
            )}
          </div>

          {err && <div className="alert error">{err}</div>}
          {ok && <div className="alert success">{ok}</div>}

          <div className="grid-2">
            <button type="button" className="secondary-btn" onClick={() => setStep(2)}>
              ย้อนกลับ
            </button>
            <button className="submit-btn" disabled={!isPwValid || loading}>
              สร้างบัญชี
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
