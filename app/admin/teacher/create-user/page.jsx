"use client";

import { useState } from "react";
import SidebarAdmin from "@/components/ui/admin/SidebarAdmin";
import HeaderBarAdmin_Problem from "@/components/ui/admin/HeaderBarAdmin_Problem";
import { useAdminMe } from "@/hooks/useAdminMe";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/** ดึง token ฝั่ง admin */
function getAdminToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("admin_token") || localStorage.getItem("token") || "";
}

export default function CreateAdvisorUserPage() {
  const { admin } = useAdminMe();
  const [collapsed, setCollapsed] = useState(false);

  // ===== form states =====
  const [advisorId, setAdvisorId] = useState(""); // เช่น Q1043
  const [email, setEmail] = useState("");         // เช่น Chaiyaporn.M@ku.th
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOk("");
    setErr("");

    const cleanAdvisorId = advisorId.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanAdvisorId) return setErr("กรุณากรอก Advisor ID");
    if (!cleanEmail) return setErr("กรุณากรอกอีเมล");

    setLoading(true);
    try {
      const token = getAdminToken();
      const res = await fetch(`${API_URL}/auth/advisor/admin/advisors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          advisor_id: cleanAdvisorId,
          email: cleanEmail,
          role: "advisor",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || data?.message || "สร้างไม่สำเร็จ");

      setOk(`✅ สร้างผู้ใช้อาจารย์สำเร็จ: ${cleanAdvisorId} (${cleanEmail})`);
      setAdvisorId("");
      setEmail("");
    } catch (e) {
      console.error(e);
      setErr(e.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ===== Sidebar ===== */}
      <SidebarAdmin collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      {/* ===== Main Area ===== */}
      <div className="flex-1 flex flex-col">
        <HeaderBarAdmin_Problem
          collapsed={collapsed}
          username={admin?.admin_name || "ผู้ดูแลระบบ"}
          title="สร้างผู้ใช้อาจารย์"
          onToggleSidebar={() => setCollapsed((v) => !v)}
        />

        {/* ===== Content ===== */}
        <main className="flex-1 flex items-center justify-center px-4 py-10 overflow-y-auto">
          <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
              สร้างผู้ใช้อาจารย์
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Advisor ID
                </label>
                <input
                  type="text"
                  value={advisorId}
                  onChange={(e) => setAdvisorId(e.target.value)}
                  placeholder="เช่น Q1043"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  อีเมลอาจารย์
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="เช่น chaiyaporn.m@ku.th"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* role fixed = advisor (ซ่อน) */}
              <input type="hidden" name="role" value="advisor" />

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 rounded-lg font-semibold text-white transition ${
                  loading ? "bg-gray-400" : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {loading ? "กำลังสร้าง..." : "สร้างผู้ใช้อาจารย์"}
              </button>
            </form>

            {ok && <p className="mt-4 text-green-600 text-center">{ok}</p>}
            {err && <p className="mt-4 text-red-600 text-center">{err}</p>}

  
          </div>
        </main>
      </div>
    </div>
  );
}
