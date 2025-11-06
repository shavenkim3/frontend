"use client";
import { useState } from "react";
import useCompanyAuth from "@/hooks/useCompanyAuth";
import { apiFetch, companyToken } from "@/lib/api";

export default function ChangePasswordPage() {
  const { me, loading } = useCompanyAuth({ requireNoMCP: false });
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading || !me) return <div style={{ padding: 24 }}>กำลังโหลด...</div>;

  const submit = async (e) => {
    e.preventDefault();
    setOk("");
    setErr("");

    if (!newPw || newPw.length < 8) {
      setErr("รหัสผ่านใหม่ต้องมีอย่างน้อย 8 อักขระ");
      return;
    }

    if (me.must_change_password && newPw !== confirmPw) {
      setErr("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    if (!me.must_change_password && !oldPw) {
      setErr("กรุณากรอกรหัสผ่านเดิม");
      return;
    }

    const body = me.must_change_password
      ? { old_password: oldPw, new_password: newPw }
      : { old_password: oldPw, new_password: newPw };

    try {
      setSubmitting(true);

      await apiFetch("/auth/company/change-password", {
        method: "POST",
        token: companyToken(),
        body,
      });

      setOk("เปลี่ยนรหัสผ่านสำเร็จ");
      setTimeout(() => {
        window.location.replace("/company/dashboard");
      }, 1200);
    } catch (e) {
      setErr(e.message || "เปลี่ยนรหัสผ่านไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        padding: 24,
        fontFamily: "Kanit, sans-serif",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <h1 style={{ fontSize: "1.4rem", marginBottom: 10 }}>ตั้งรหัสผ่านใหม่</h1>
        {me.must_change_password ? (
          <p style={{ color: "#555", marginBottom: 16 }}>
            ระบบกำหนดให้เปลี่ยนรหัสผ่านก่อนใช้งาน
            <br />
            โปรดกรอกรหัสผ่านที่ได้รับจากอีเมลในช่องแรก
          </p>
        ) : (
          <p style={{ color: "#555", marginBottom: 16 }}>
            กรอกรหัสผ่านเดิม และตั้งรหัสผ่านใหม่
          </p>
        )}

        <form onSubmit={submit}>
          {/* ✅ ถ้าเป็นครั้งแรก: ช่องแรก = รหัสจากอีเมล */}
          {me.must_change_password ? (
            <>
              <label>
                รหัสผ่านจากอีเมล (รหัสผ่านชั่วคราว)
                <span style={{ color: "red" }}> *</span>
              </label>
              <input
                type="password"
                placeholder="กรอกรหัสผ่านที่ได้รับทางอีเมล"
                value={oldPw}
                onChange={(e) => setOldPw(e.target.value)}
                autoComplete="off"
                style={{
                  display: "block",
                  width: "100%",
                  margin: "6px 0 12px",
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                }}
              />
            </>
          ) : (
            <>
              <label>
                รหัสผ่านเดิม <span style={{ color: "red" }}> *</span>
              </label>
              <input
                type="password"
                value={oldPw}
                onChange={(e) => setOldPw(e.target.value)}
                autoComplete="current-password"
                style={{
                  display: "block",
                  width: "100%",
                  margin: "6px 0 12px",
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                }}
              />
            </>
          )}

          <label>
            รหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร)
            <span style={{ color: "red" }}> *</span>
          </label>
          <input
            type="password"
            placeholder="ตั้งรหัสผ่านใหม่"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            autoComplete="new-password"
            style={{
              display: "block",
              width: "100%",
              margin: "6px 0 12px",
              padding: 10,
              border: "1px solid #ddd",
              borderRadius: 8,
            }}
          />

          {me.must_change_password && (
            <>
              <label>ยืนยันรหัสผ่านใหม่</label>
              <input
                type="password"
                placeholder="พิมพ์รหัสผ่านใหม่อีกครั้ง"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                autoComplete="new-password"
                style={{
                  display: "block",
                  width: "100%",
                  margin: "6px 0 12px",
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                }}
              />
            </>
          )}

          {err && (
            <div style={{ color: "#b00020", marginTop: 6, fontWeight: 500 }}>
              {err}
            </div>
          )}
          {ok && (
            <div style={{ color: "#0c6d68", marginTop: 6, fontWeight: 500 }}>
              {ok}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: 12,
              padding: "10px 14px",
              border: "none",
              background: submitting ? "#6abfa0" : "#03a96b",
              color: "#fff",
              borderRadius: 10,
              fontWeight: 600,
              width: "100%",
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </form>
      </div>
    </div>
  );
}
