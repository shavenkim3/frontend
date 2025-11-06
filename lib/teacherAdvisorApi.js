/** ========= Config ========= */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const EP = {
  list:   `${API_URL}/api/advisor/students`,
  add:    `${API_URL}/api/advisor/students`,
  item:   (id) => `${API_URL}/api/advisor/students/${id}`,
  search: `${API_URL}/api/advisor/students/search`, // ✅ endpoint ที่ดึงจาก student_info
};

/** ========= Helpers ========= */
function getAdvisorToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("advisor_token") ||
    localStorage.getItem("token") ||
    ""
  );
}

/** ========= API Functions ========= */

/** ✅ ดึงรายการนิสิตในที่ปรึกษา (เฉพาะที่ผูกแล้ว) */
export async function listAdvisees(q = "") {
  const token = getAdvisorToken();
  const url = `${EP.list}${q ? `?q=${encodeURIComponent(q)}` : ""}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Fetch advisees failed");
  return data.items || [];
}

/** ✅ เพิ่มหรืออัปเดตความสัมพันธ์นิสิต–อาจารย์ */
export async function addAdvisee(payload) {
  const token = getAdvisorToken();
  const res = await fetch(EP.add, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Add failed");
  return data;
}

/** ✅ ลบนิสิตออกจากที่ปรึกษา */
export async function removeAdvisee(student_id) {
  const token = getAdvisorToken();
  const res = await fetch(EP.item(student_id), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Delete failed");
  return data;
}

/** ✅ ค้นหานิสิตทั้งหมดจาก student_info */
export async function searchStudents(q = "", opts = {}) {
  const { limit = 100, offset = 0 } = opts;
  const token = getAdvisorToken();

  const qs = new URLSearchParams();
  if (q) qs.set("q", q);
  if (limit) qs.set("limit", String(limit));
  if (offset) qs.set("offset", String(offset));

  const url = `${EP.search}${qs.toString() ? `?${qs.toString()}` : ""}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.error || "Search failed");
  return {
    items: data.items || [],
    total: data.total ?? data.items?.length ?? 0,
  };
}

/** ✅ ดึงความสัมพันธ์นิสิตกับอาจารย์ (ถ้ามี) */
export async function getAdvisee(student_id) {
  const token = getAdvisorToken();
  const res = await fetch(EP.item(student_id), {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(data.error || "Fetch advisee failed");
  return data;
}
