// lib/apiAdminNews.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/** ทำ error ให้อ่านง่าย */
async function parseMaybeJSON(res) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try { return await res.json(); } catch { return null; }
  }
  return await res.text();
}

// ถ้าต้องการแนบ token ของแอดมิน ให้เปิดส่วน getToken + header ด้านล่าง
function getToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token") ||
    ""
  );
}

export async function apiFetch(path, { method = "GET", body, headers } = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await parseMaybeJSON(res);
  if (!res.ok) {
    const msg =
      (data && typeof data === "object")
        ? (data.message || JSON.stringify(data))
        : (data || "Request failed");
    throw new Error(msg);
  }
  return data;
}

/** ===== API ===== */

// POST /admin/news  -> สร้างข่าวใหม่
export async function createAdminNews(payload) {
  return apiFetch("/admin/news", {
    method: "POST",
    body: payload,
  });
}

// GET /admin/news/all  -> array of rows
export async function fetchNewsList() {
  return apiFetch("/admin/news/all");
}

export async function fetchNewsById(id) {
  return apiFetch(`/admin/news/${encodeURIComponent(id)}`);
}

export async function updateNews(id, payload) {
  return apiFetch(`/admin/news/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteNews(id) {
  const res = await fetch(`${API_URL}/admin/news/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
  });
  if (!res.ok && res.status !== 204) {
    const data = await parseMaybeJSON(res);
    const msg =
      (data && typeof data === "object")
        ? (data.message || JSON.stringify(data))
        : (data || "Delete failed");
    throw new Error(msg);
  }
  return true;
}

// เผื่อไฟล์อื่น import แบบ default
export default {
  createAdminNews,
  fetchNewsList,
  fetchNewsById,
  updateNews,
  deleteNews,
};
