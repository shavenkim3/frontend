"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Container from "@/components/Container";
import Card from "@/components/Card";
import { InputGroup } from "@/components/InputGroup";

export default function LinkStudentPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // ✅ ต้องเป็นตัวเลข 10 หลัก
  const pattern = useMemo(() => /^\d{10}$/, []);
  const trimmed = studentId.trim();
  const isValid = pattern.test(trimmed);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { router.replace("/student/login_student"); return; }

        const meReg = await api.getMyReg(token);
        if (!meReg?.isLinked) return;

        if (meReg?.isLinked && meReg?.reg_type == null) {
          router.replace("/student/registration"); return;
        }
        if (meReg?.isLinked && meReg?.reg_type) {
          router.replace("/student/dashboard"); return;
        }
      } catch (e) {
        if (e?.status === 401 || e?.status === 403) {
          router.replace("/student/login_student");
        } else {
          setErr("ไม่สามารถตรวจสอบสถานะได้ ลองใหม่อีกครั้ง");
        }
      }
    })();
  }, [router]);

  // ✅ จำกัดให้กรอกเฉพาะตัวเลข และยาวไม่เกิน 10
  const handleChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setStudentId(onlyDigits);
    if (err) setErr("");
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (!isValid || loading) return;
    setErr("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) { router.replace("/student/login_student"); return; }

      // เคลมรหัสนิสิต
      await api.claimStudent(trimmed, token);

      // เช็คสถานะใหม่ด้วย /api/me/registration
      let meReg = await api.getMyReg(token);
      if (!meReg?.isLinked) {
        await new Promise(r => setTimeout(r, 400)); // กัน latency เขียน DB
        meReg = await api.getMyReg(token);
      }

      if (meReg?.isLinked && meReg?.reg_type == null) {
        router.replace("/student/registration"); return;
      }
      if (meReg?.isLinked && meReg?.reg_type) {
        router.replace("/student/dashboard"); return;
      }

      setErr("ผูกสำเร็จแล้ว แต่สถานะยังไม่อัปเดต ลองรีเฟรชหน้าอีกครั้ง");
    } catch (e) {
      setErr(e?.message || "claim ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Card>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-2xl shadow">
            🎓
          </div>
          <h1 className="text-2xl font-bold text-emerald-800 mt-4">กรอกรหัสนิสิต</h1>
          <p className="text-sm text-gray-500 mt-1">กรอกรหัสนิสิตครั้งแรก เพื่อยืนยันตัวตน</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="student_id" className="block text-sm font-medium text-gray-700 mb-2">
              รหัสนิสิต
            </label>
            <InputGroup
              id="student_id"
              value={studentId}
              onChange={handleChange} 
              placeholder="เช่น 652165xxxx"
            />
          </div>

          {err && (
            <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg p-2">
              {err}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium shadow
                       hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !isValid}
          >
            {loading ? "กำลังผูก..." : "ยืนยัน"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-4 text-[11px] text-center text-gray-500">
          หากมีปัญหาในการผูกบัญชี โปรดติดต่อเจ้าหน้าที่ภาควิชา
        </p>
      </Card>
    </Container>
  );
}
