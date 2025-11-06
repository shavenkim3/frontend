const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const ADMIN_TOKEN_KEY = "admin_token";       // ✅ key มาตรฐานเดียวกัน

export function getAdminToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(ADMIN_TOKEN_KEY) || "";
}
export function setAdminToken(token) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
}
export function clearAdminToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

async function adminFetch(path, { method = "GET", body, headers } = {}) {
  const token = getAdminToken();
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),  // ✅ Bearer
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  let data = null;
  const ct = res.headers.get("content-type") || "";
  const isJSON = ct.includes("application/json");
  if (res.status !== 204) {
    try { data = isJSON ? await res.json() : await res.text(); }
    catch { data = null; }
  }
  if (!res.ok) {
    // ดึงข้อความจาก backend ถ้ามี
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export async function adminLogin({ admin_name, password }) {
  const data = await adminFetch("/auth/admin/login", { method: "POST", body: { admin_name, password } });
  setAdminToken(data?.token || "");         // ✅ เก็บ token
  return data;
}
export async function adminMe() {
  return adminFetch("/admin/me", { method: "GET" }); // ✅ ต้องมี Bearer
}
export function adminLogout() {
  clearAdminToken();
}
