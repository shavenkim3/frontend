/* =========================================
 *  Base URL & Utilities
 * ========================================= */

// ต้นฉบับ: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
// กันท้ายเป็น '//' (เช่น https://api.example.com///)
const API_URL = RAW_API_URL.replace(/\/+$/, "");

// ต่อ path แบบชัวร์ ไม่ได้ '//' กลางทาง และรองรับ absolute URL
const joinURL = (base, path) => {
  if (!path) return base;
  if (/^https?:\/\//i.test(path)) return path; // ถ้าเป็น absolute URL ใช้ตามนั้น
  return base + (path.startsWith("/") ? path : `/${path}`);
};

// timeout กัน fetch ค้าง (เช่น backend ช้า)
function withTimeout(ms = 12000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  return { signal: ctrl.signal, cancel: () => clearTimeout(id) };
}

/* =========================================
 *  Fetch กลาง (no-store บน server)
 * ========================================= */
export async function apiFetch(
  path,
  { method = "GET", body, token, headers, timeoutMs = 12000 } = {}
) {
  const url = joinURL(API_URL, path);
  const { signal, cancel } = withTimeout(timeoutMs);
  const isServer = typeof window === "undefined";

  const isForm =
    typeof FormData !== "undefined" && body instanceof FormData;
  const isBlob =
    typeof Blob !== "undefined" && body instanceof Blob;
  const isFile =
    typeof File !== "undefined" && body instanceof File;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        ...(!(isForm || isBlob || isFile)
          ? { "Content-Type": "application/json" }
          : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers || {}),
      },
      body:
        body == null
          ? undefined
          : (isForm || isBlob || isFile)
          ? body
          : JSON.stringify(body),
      ...(isServer ? { cache: "no-store", next: { revalidate: 0 } } : {}),
      signal,
    });

    let data = null;
    const ct = res.headers.get("content-type") || "";
    const isJSON = ct.includes("application/json");

    if (res.status !== 204) {
      try {
        data = isJSON ? await res.json() : await res.text();
        if (!isJSON && typeof data === "string") data = { text: data };
      } catch {
        data = null;
      }
    }

    if (!res.ok) {
      const msg = data?.message || data?.error || `HTTP ${res.status}`;
      const err = new Error(msg);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (e) {
    if (e?.name === "AbortError") {
      const err = new Error(`คำขอหมดเวลา (timeout ${timeoutMs}ms)`);
      err.cause = e;
      err.status = 408;
      throw err;
    }
    throw e;
  } finally {
    cancel();
  }
}

/* =========================================
 *  Token Stores
 * ========================================= */
const makeTokenStore = (key) => ({
  get: () => (typeof window !== "undefined" ? localStorage.getItem(key) : null),
  set: (t) => typeof window !== "undefined" && localStorage.setItem(key, t),
  clear: () => typeof window !== "undefined" && localStorage.removeItem(key),
});

export const tokenStore = makeTokenStore("token");
export const studentTokenStore = makeTokenStore("student_token");
export const companyTokenStore = makeTokenStore("company_token");
export const advisorTokenStore = makeTokenStore("advisor_token");

export const companyToken = () => companyTokenStore.get();
export const setCompanyToken = (token) => companyTokenStore.set(token);
export const clearCompanyToken = () => companyTokenStore.clear();

export const advisorToken = () => advisorTokenStore.get();
export const setAdvisorToken = (token) => advisorTokenStore.set(token);
export const clearAdvisorToken = () => advisorTokenStore.clear();

/* =========================================
 *  Helpers ฝั่ง Student
 * ========================================= */
export async function fetchStudentMe() {
  const token =
    studentTokenStore.get() ||
    tokenStore.get() ||
    (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);

  if (!token) throw new Error("ยังไม่ได้ล็อกอิน (ไม่พบ token)");

  const me = await apiFetch("/auth/student/me", { token });

  const pick = (...paths) => {
    for (const p of paths) {
      const v = p
        .split(".")
        .reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), me);
      if (v !== undefined && v !== null && String(v).trim() !== "")
        return String(v).trim();
    }
    return "";
  };

  const fullName = pick(
    "student.full_name",
    "full_name",
    "user.full_name",
    "name",
    "student.name"
  );
  const fromFullName = fullName ? fullName.split(/\s+/)[0] : "";

  const studentId =
    pick(
      "student.student_id",
      "student.studentId",
      "student.id",
      "student.sid",
      "student_id",
      "studentId",
      "sid",
      "user.student_id",
      "data.student_id"
    ) || "";

  const firstname =
    pick(
      "student.firstname",
      "student.first_name",
      "firstname",
      "first_name",
      "user.firstname",
      "user.first_name",
      "student.firstname_th",
      "firstname_th"
    ) || fromFullName || "";

  const username =
    pick("student.username", "username", "user.username") || firstname || "";

  return { raw: me, studentId, firstname, username };
}

/* =========================================
 *  API รวม (Auth + Registration + Advisor Admin)
 * ========================================= */
export const api = {
  /* ---------- Company Auth ---------- */
  company: {
    login: (email, password) =>
      apiFetch("/auth/company/login", {
        method: "POST",
        body: { email, password },
      }),
    me: (token) => apiFetch("/auth/company/me", { token }),
    changePassword: (token, payload) =>
      apiFetch("/auth/company/change-password", {
        method: "POST",
        token,
        body: payload,
      }),
  },

  /* ---------- Student Auth ---------- */
  loginStudent: (email, password) =>
    apiFetch("/auth/student/login", {
      method: "POST",
      body: { email, password },
    }),

  studentRequestOtp: (email, purpose = "reset") =>
    apiFetch("/auth/student/request-otp", {
      method: "POST",
      body: { email, purpose },
    }),

  studentResetPassword: (email, otp, newPassword) =>
    apiFetch("/auth/student/reset-password", {
      method: "POST",
      body: { email, otp, newPassword },
    }),

  me: (token) => apiFetch("/auth/student/me", { token }),

  claimStudent: (student_id, token) =>
    apiFetch("/api/claim-student", {
      method: "POST",
      body: { student_id },
      token,
    }),

  /* ---------- Admin Auth ---------- */
  adminLogin: (admin_name, password) =>
    apiFetch("/auth/admin/login", {
      method: "POST",
      body: { admin_name, password },
    }),
  adminMe: (token) => apiFetch("/auth/admin/me", { token }),

  /* ---------- Registration ---------- */
  regOptions: (token) => apiFetch("/api/registration/options", { token }),
  getMyReg: async (token) => {
    try {
      const data = await apiFetch("/api/me/registration", { token });
      const isLinked = Boolean(
        data?.isLinked ?? data?.student_id ?? data?.linked ?? data?.linked_at
      );
      return {
        isLinked,
        reg_type: data?.reg_type ?? data?.type ?? null,
        reg_code: data?.reg_code ?? null,
        raw: data,
      };
    } catch (e) {
      if (e?.status === 404)
        return { isLinked: false, reg_type: null, reg_code: null };
      if (e?.status === 401 || e?.status === 403) throw e;
      return {
        isLinked: false,
        reg_type: null,
        reg_code: null,
        error: e.message,
      };
    }
  },
  saveMyReg: (reg_type, token) =>
    apiFetch("/api/me/registration", {
      method: "POST",
      body: { choice_code: reg_type },
      token,
    }),

  /* ---------- Advisor Auth ---------- */
  advisor: {
    login: (identifier, password) =>
      apiFetch("/auth/advisor/login", {
        method: "POST",
        body: { email: identifier, username: identifier, password },
      }),
    me: (token) => apiFetch("/auth/advisor/me", { token }),
    resetPassword: ({ email, old_password, new_password }) =>
      apiFetch("/auth/advisor/reset_password", {
        method: "POST",
        body: { email, old_password, new_password },
      }),
    admin: {
      createAdvisor: (token, payload) =>
        apiFetch("/advisor/admin/advisors", {
          method: "POST",
          token,
          body: payload,
        }),
    },
  },

  /* ---------- Public Registration (Email + OTP สำหรับนิสิต) ---------- */
  checkEmail: (email) =>
    apiFetch("/auth/student/check-email", {
      method: "POST",
      body: { email },
    }),

  requestOtp: (email, purpose = "signup") =>
    apiFetch("/auth/student/request-otp", {
      method: "POST",
      body: { email, purpose },
    }),

  verifyOtp: (email, otp, purpose = "signup") =>
    apiFetch("/auth/student/verify-otp", {
      method: "POST",
      body: { email, otp, purpose },
    }),

  registerWithOtp: ({ email, otp, password }) =>
    apiFetch("/auth/student/register-with-otp", {
      method: "POST",
      body: { email, otp, password },
    }),
};

/* ---------- Export alias สำหรับ OTP ----------- */
export const studentOtpApi = {
  checkEmail: api.checkEmail,
  requestOtp: api.requestOtp,
  verifyOtp: api.verifyOtp,
  registerWithOtp: api.registerWithOtp,
};

/* =========================================
 *  หมายเหตุเวลาขึ้น Vercel
 * =========================================
 * - ตั้ง ENV: NEXT_PUBLIC_API_URL=https://student-menegement.onrender.com
 */
