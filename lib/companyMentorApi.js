const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getCompanyToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("company_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("jwt") ||
    ""
  );
}

/**
 * ดึงรายชื่อนิสิตที่พี่เลี้ยงดูแล
 */
export async function fetchMentorStudents({ q = "", limit = 50, offset = 0 } = {}) {
  const token = getCompanyToken();
  const url = new URL(`${API_URL}/company/mentor/students`);
  if (q) url.searchParams.set("q", q);
  url.searchParams.set("limit", limit);
  url.searchParams.set("offset", offset);

  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `โหลดข้อมูลไม่สำเร็จ (${res.status})`);
  }

  return res.json();
}
