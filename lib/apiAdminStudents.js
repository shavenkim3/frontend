// lib/apiAdminStudents.js
import { apiFetch } from "./api";

// ==== Token helper: ให้แอดมินมาก่อน ====
function getAnyToken() {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("student_token") ||
    localStorage.getItem("advisor_token") ||
    localStorage.getItem("company_token") ||
    null
  );
}

// ==== Query builder ช่วยต่อพารามิเตอร์ ====
function buildQueryString(obj = {}) {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      params.append(k, String(v).trim());
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/**
 * GET /api/students  (admin)
 * @param {Object} filters - ตัวกรอง เช่น { department: 'IT', reg_type: 'ปกติ' }
 */
export async function fetchAdminStudents(filters = {}) {
  const token = getAnyToken();
  const qs = buildQueryString(filters);
  // apiFetch ตัวกลางรองรับ absolute/relative path อยู่แล้ว
  return apiFetch(`/api/students${qs}`, { token });
}

/**
 * Upload CSV file (admin) ไปที่ /api/students/upload-csv
 * - ใช้ XHR เพื่อแสดง progress จริง
 * - field name: "file"
 */
export function uploadStudentsCsv(file, { onProgress } = {}) {
  if (!file) return Promise.reject(new Error("กรุณาเลือกไฟล์ก่อน"));

  return new Promise((resolve, reject) => {
    const token = getAnyToken();
    // ใช้ NEXT_PUBLIC_API_URL เป็น base (ตัด / ท้ายออก)
    const rawBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const base = rawBase.replace(/\/+$/, "");
    const url = `${base}/api/students/upload-csv`;

    const formData = new FormData();
    formData.append("file", file, file.name);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.upload.onprogress = (evt) => {
      if (evt.lengthComputable) {
        const percent = Math.round((evt.loaded / evt.total) * 100);
        onProgress?.(percent);
      }
    };

    xhr.onload = () => {
      const ct = xhr.getResponseHeader("content-type") || "";
      const isJSON = ct.includes("application/json");
      try {
        const payload = isJSON ? JSON.parse(xhr.responseText || "{}") : xhr.responseText;
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(payload);
        } else {
          const msg =
            (payload && typeof payload === "object" && (payload.message || payload.error)) ||
            (typeof payload === "string" ? payload : "อัปโหลดไม่สำเร็จ");
          reject(new Error(msg));
        }
      } catch {
        reject(new Error("ไม่สามารถอ่านข้อมูลตอบกลับได้"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(formData);
  });
}
