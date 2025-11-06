// frontend/hooks/useStudentMe.js
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth-token";

// ✅ ลอง /auth/student/me เป็นอันดับแรก
const CANDIDATE_ENDPOINTS = ["/auth/student/me", "/student/me", "/internships/me", "/auth/me"];

// ---- ตัวช่วย: คลี่ response หลายรูปแบบให้เป็น object เดียว ----
function unwrap(data) {
  if (!data) return null;

  // ยอดฮิต
  if (data.me && typeof data.me === "object") return data.me;
  if (data.data && typeof data.data === "object") return data.data;
  if (data.result && typeof data.result === "object") return data.result;

  // บาง backend ใส่ใน user
  if (data.user && typeof data.user === "object") return data.user;
  if (data.student && typeof data.student === "object") return data.student;

  // ถ้าเป็น array
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === "object") {
    return data[0];
  }

  // ถ้าเป็น object ปกติ
  if (typeof data === "object") return data;

  return null;
}

// ---- ตัวช่วย: map field ให้เป็นรูปแบบที่ Navbar ใช้ ----
function normalizeUser(src) {
  if (!src) return null;

  const student_id =
    src.student_id ?? src.studentId ?? src.sid ?? src.studentid ?? null;

  const first_name =
    src.first_name ?? src.firstname ?? src.firstName ?? src.given_name ?? null;

  const last_name =
    src.last_name ?? src.lastname ?? src.lastName ?? src.family_name ?? null;

  const email = src.email ?? null;

  const username =
    src.username ?? src.email ?? src.user_name ?? src.login ?? null;

  const user_id = src.user_id ?? src.userId ?? src.id ?? null;

  return { user_id, student_id, first_name, last_name, email, username };
}

export function useStudentMe() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setErr("");

      const token = getToken();

      try {
        let raw = null;
        let lastError = null;

        for (const path of CANDIDATE_ENDPOINTS) {
          try {
            const res = await apiFetch(path, { token });
            if (res) {
              raw = res;
              if (process.env.NODE_ENV !== "production") {
                // eslint-disable-next-line no-console
                console.debug(`[useStudentMe] ${path} response:`, res);
              }
              break;
            }
          } catch (e) {
            lastError = e;
            if (process.env.NODE_ENV !== "production") {
              // eslint-disable-next-line no-console
              console.debug(`[useStudentMe] ${path} error:`, e?.status, e?.message || e);
            }
            // 401/403/404 → ลอง path ถัดไป
          }
        }

        if (!alive) return;

        if (!raw) {
          throw lastError || new Error("โหลดข้อมูลผู้ใช้ไม่สำเร็จ");
        }

        const unwrapped = unwrap(raw);
        const normalized = normalizeUser(unwrapped);

        if (!normalized) {
          throw new Error("รูปแบบข้อมูลผู้ใช้ไม่ถูกต้อง");
        }

        setMe(normalized);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "โหลดข้อมูลผู้ใช้ไม่สำเร็จ");
        setMe(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return { me, loading, err };
}
