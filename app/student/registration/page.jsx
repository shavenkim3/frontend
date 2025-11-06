"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const OPTIONS = {
  special_problem: { code: "project", path: "/student/project/Special_Problem" },
  coop: { code: "coop", path: "/student/coop/coop_problem" },
};
const CODE_TO_PATH = {
  project: "/student/project/Special_Problem",
  coop: "/student/coop/coop_problem",
};

export default function ChooseType() {
  const router = useRouter();
  const navigatedRef = useRef(false);
  const navigateOnce = (path) => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    router.replace(path);
  };

  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // ✅ เก็บคะแนนสอบไว้เพื่อตัดสินใจ
  const [examScore, setExamScore] = useState(null);
  const scoreKnown = Number.isFinite(examScore);
  const isScoreInsufficient = scoreKnown && examScore < 50;
  const canChooseCoop = scoreKnown ? examScore >= 50 : true; // ถ้าไม่รู้คะแนน อนุโลมเลือกได้ก่อน

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { navigateOnce("/student/login_student"); return; }

        const meReg = await api.getMyReg(token);

        // ✅ เก็บคะแนน
        if (alive) setExamScore(
          meReg?.exam_score != null ? Number(meReg.exam_score) : null
        );

        // flow next
        if (meReg?.next === "onboarding") { navigateOnce("/student/onboarding"); return; }
        if (meReg?.next === "claim") { navigateOnce("/student/claim"); return; }

        // ผูกแล้ว + มี reg_type แล้ว -> เข้าหน้าปลายทาง
        if (meReg?.isLinked && meReg?.reg_type && CODE_TO_PATH[meReg.reg_type]) {
          navigateOnce(CODE_TO_PATH[meReg.reg_type]); return;
        }
      } catch (e) {
        if (e?.status === 401) { navigateOnce("/student/login_student"); return; }
        setErr("โหลดข้อมูลไม่สำเร็จ ลองรีเฟรชหรือเลือกตัวเลือกใหม่");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [router]);

  // ✅ กันตั้งแต่ตอนเลือกการ์ด
  const handleChoose = (type) => {
    if (saving) return;
    setErr("");
    if (type === "coop" && !canChooseCoop) {
      setSelected(null);
      setErr("คะแนนคุณไม่ถึงเกณฑ์สำหรับสหกิจ");
      return;
    }
    setSelected(type);
  };

  async function confirmSelection() {
    try {
      if (saving || navigatedRef.current) return;
      if (!selected) { setErr("กรุณาเลือกตัวเลือกก่อน"); return; }

      // ✅ กันอีกชั้นตอนยืนยัน
      if (selected === "coop" && !canChooseCoop) {
        setErr("คะแนนไม่ถึงเกณฑ์สำหรับสหกิจ (ต้อง ≥ 50)");
        return;
      }

      setErr("");
      setSaving(true);

      const token = localStorage.getItem("token");
      if (!token) { navigateOnce("/student/login_student"); return; }

      const opt = OPTIONS[selected];
      if (!opt) throw new Error("ตัวเลือกไม่ถูกต้อง");

      await api.saveMyReg(opt.code, token);

      const meReg = await api.getMyReg(token).catch(() => null);
      const finalCode = meReg?.reg_type || opt.code;

      navigateOnce(CODE_TO_PATH[finalCode] || opt.path);
    } catch (e) {
      setErr(e?.message || "บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  const isHovered = (type) => hovered === type;
  const isSelected = (type) => selected === type;

  const cardBase = (type) => {
    const locked = type === "coop" && !canChooseCoop;
    return {
      ...styles.card,
      backgroundColor: isHovered(type) ? "#0C6D68" : "#fff",
      opacity: saving ? 0.6 : (locked ? 0.6 : 1),
      pointerEvents: saving ? "none" : "auto",
      borderColor: isSelected(type) ? "#0C6D68" : "#0C6D68",
      boxShadow: isSelected(type)
        ? "0 8px 22px rgba(12,109,104,0.25)"
        : "0 6px 18px rgba(0,0,0,0.06)",
      transform: isSelected(type) ? "translateY(-2px)" : "none",
      outline: isSelected(type) ? "4px solid rgba(12,109,104,0.15)" : "none",
      position: "relative",
      ...(locked ? { cursor: "not-allowed" } : {}),
    };
  };

  if (loading) {
    return (
      <main style={styles.body}>
        <div>กำลังโหลด...</div>
      </main>
    );
  }

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        {/* ปัญหาพิเศษ */}
        <div
          role="button"
          tabIndex={0}
          aria-label="เลือก ปัญหาพิเศษ"
          aria-pressed={isSelected("special_problem")}
          style={cardBase("special_problem")}
          onClick={() => handleChoose("special_problem")}
          onMouseEnter={() => setHovered("special_problem")}
          onMouseLeave={() => setHovered(null)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleChoose("special_problem"); }
            if (e.key === "ArrowRight") handleChoose("coop");
          }}
        >
          <div
            style={{
              ...styles.cardTitle,
              color: isHovered("special_problem") ? "#fff" : "#0C6D68",
              borderBottomColor: isHovered("special_problem") ? "#fff" : "#0C6D68",
            }}
          >
            ปัญหาพิเศษ
            {isSelected("special_problem") && (
              <span style={styles.badge}>เลือกแล้ว</span>
            )}
            <svg
              style={{ ...styles.cardIcon, fill: isHovered("special_problem") ? "#fff" : "#0C6D68" }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M9 21h6v-1H9v1zm3-20C7.48 1 4 4.48 4 9c0 3.93 2.64 7.21 6.13 7.91V19h3.74v-2.09C17.36 16.21 20 12.93 20 9c0-4.52-3.48-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-3.31 2.69-6 6-6s6 2.69 6 6c0 3.31-2.69 6-6 6z"/>
            </svg>
          </div>
          <div style={{ ...styles.cardDescription, color: isHovered("special_problem") ? "#fff" : "#555" }}>
            เปิดให้ลงเทอมต้น<br />จำนวนหน่วยกิต 3 หน่วย
          </div>
        </div>

        {/* สหกิจศึกษา */}
        <div
          role="button"
          tabIndex={0}
          aria-label="เลือก สหกิจศึกษา"
          aria-pressed={isSelected("coop")}
          aria-disabled={!canChooseCoop}
          style={{ ...cardBase("coop"), ...styles.coopCard }}
          onClick={() => handleChoose("coop")}
          onMouseEnter={() => setHovered("coop")}
          onMouseLeave={() => setHovered(null)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleChoose("coop"); }
            if (e.key === "ArrowLeft") handleChoose("special_problem");
          }}
          title={!canChooseCoop ? "ต้องมีคะแนนสอบ ≥ 50 จึงจะเลือกสหกิจได้" : undefined}
        >
          <div
            style={{
              ...styles.cardTitle,
              color: isHovered("coop") ? "#fff" : "#0C6D68",
              borderBottomColor: isHovered("coop") ? "#fff" : "#0C6D68",
            }}
          >
            สหกิจศึกษา
            {isSelected("coop") && <span style={styles.badge}>เลือกแล้ว</span>}
            {!canChooseCoop && (
              <span style={{ ...styles.lockBadge }}>
                ล็อก
              </span>
            )}
            <svg
              style={{ ...styles.cardIcon, fill: isHovered("coop") ? "#fff" : "#0C6D68" }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2zm0 7.3l-7-3.18v-.03l7-3.17 7 3.17v.03l-7 3.18zM5 13v5h14v-5l-7 3.18L5 13z"/>
            </svg>
          </div>
          <div style={{ ...styles.cardDescription, color: isHovered("coop") ? "#fff" : "#555" }}>
            เปิดให้ลงเทอมปลาย<br />จำนวนหน่วยกิต 6 หน่วย<br />
            <span style={{ ...styles.redText, color: isHovered("coop") ? "#FF9D00" : "red" }}>
              *ต้องสอบผ่านสหกิจในภาคเรียนที่ 2 ปี 3 เทอมปลาย ถึงสามารถลงฝึกสหกิจศึกษาได้
            </span>
            {!canChooseCoop && (
              <div style={{ marginTop: 8, fontSize: "0.95rem", color: isHovered("coop") ? "#fff" : "#b00020" }}>
                คะแนนคุณ {scoreKnown ? examScore : "-"} / ต้อง ≥ 50
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ปุ่มยืนยัน */}
      <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button
          type="button"
          disabled={!selected || saving || (selected === "coop" && !canChooseCoop)}
          onClick={confirmSelection}
          style={{
            ...styles.button,
            ...((!selected || saving || (selected === "coop" && !canChooseCoop)) ? styles.buttonDisabled : {}),
          }}
        >
          {saving ? "กำลังบันทึก..." : "ยืนยันตัวเลือก"}
        </button>
        <button
          type="button"
          onClick={() => { setSelected(null); setErr(""); }}
          disabled={saving}
          style={{ ...styles.ghostButton }}
        >
          ล้างการเลือก
        </button>
      </div>

      {err && <div style={{ marginTop: 12, color: "crimson", textAlign: "center" }}>{err}</div>}
    </div>
  );
}

export const styles = {
  body: {
    display: "flex", justifyContent: "center", alignItems: "center",
    minHeight: "100vh", backgroundColor: "#f5f5f5", padding: "20px",
    fontFamily: "'Kanit', sans-serif"
  },
  container: { display: "flex", gap: "40px", flexWrap: "wrap", maxWidth: "1200px", justifyContent: "center" },
  card: {
    flex: "1 1 450px", border: "3px solid #0C6D68", borderRadius: "20px",
    padding: "60px 40px 80px 40px", cursor: "pointer", transition: "0.2s ease",
    display: "flex", flexDirection: "column", alignItems: "flex-start",
    minHeight: "400px", boxShadow: "0 6px 18px rgba(0,0,0,0.06)"
  },
  coopCard: {},
  cardTitle: {
    fontSize: "2rem", fontWeight: 600, borderBottom: "3px solid #0C6D68",
    paddingBottom: "12px", marginBottom: "25px", width: "100%", display: "flex",
    alignItems: "center", gap: "10px", transition: "0.2s ease", position: "relative"
  },
  cardIcon: { width: "40px", height: "40px", flexShrink: 0, marginLeft: "10px", transition: "0.2s ease" },
  cardDescription: { fontSize: "1.2rem", lineHeight: 1.8, transition: "0.2s ease" },
  redText: { fontWeight: 600, display: "inline", transition: "0.2s ease" },
  badge: {
    marginLeft: "auto",
    fontSize: "0.95rem",
    padding: "4px 10px",
    borderRadius: "999px",
    background: "rgba(12,109,104,0.12)",
    color: "#0C6D68",
    border: "1px solid rgba(12,109,104,0.35)"
  },
  lockBadge: {
    marginLeft: 8,
    fontSize: "0.85rem",
    padding: "2px 8px",
    borderRadius: "999px",
    background: "#eee",
    color: "#888",
    border: "1px solid #ddd"
  },
  button: {
    padding: "12px 20px",
    fontSize: "1rem",
    borderRadius: "12px",
    border: "none",
    background: "#0C6D68",
    color: "#fff",
    cursor: "pointer",
    minWidth: 180,
  },
  buttonDisabled: { opacity: 0.5, cursor: "not-allowed" },
  ghostButton: {
  padding: "12px 20px",
  fontSize: "1rem",
  borderRadius: "12px",
  border: "2px solid #0C6D68",   // ✅ แก้ตรงนี้
  background: "transparent",
  color: "#0C6D68",
  cursor: "pointer",
  minWidth: 140,
},
};
