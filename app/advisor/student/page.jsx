"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2, Plus, Search } from "lucide-react";

import SidebarAdvisor from "@/components/ui/advisor/SidebarAdvisor";
import HeaderBarAdvisor_Problem from "@/components/ui/advisor/HeaderBarAdvisor_Problem";
import TeacherStudentDataHeader from "@/components/ui/advisor/TeacherStudentDataHeader";
import { listAdvisees, removeAdvisee } from "@/lib/teacherAdvisorApi";

export default function AdvisorMyStudentsPage() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // all | project | coop

  /** โหลดข้อมูล **/
  const loadData = async () => {
    try {
      setLoading(true);
      const items = await listAdvisees();
      setRows(items || []);
    } catch (err) {
      console.error("❌ Load advisees failed:", err);
      alert(err.message || "โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /** ฟิลเตอร์ **/
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((s) => {
      const matchText =
        !q ||
        s.first_name?.toLowerCase().includes(q) ||
        s.last_name?.toLowerCase().includes(q) ||
        s.student_id?.toLowerCase().includes(q) ||
        s.department?.toLowerCase().includes(q);
      const matchType =
        filterType === "all"
          ? true
          : filterType === "project"
          ? s.reg_type?.toLowerCase().includes("proj")
          : s.reg_type?.toLowerCase().includes("coop");
      return matchText && matchType;
    });
  }, [rows, query, filterType]);

  /** การจัดการ **/
  const handleRemove = async (r) => {
    if (!confirm(`ต้องการลบ ${r.first_name} ${r.last_name} ออกจากที่ปรึกษาหรือไม่?`)) return;
    try {
      await removeAdvisee(r.student_id);
      alert("ลบสำเร็จ");
      loadData();
    } catch (e) {
      alert(e.message || "เกิดข้อผิดพลาดในการลบ");
    }
  };

  const handleView = (r) =>
    alert(`📋 ข้อมูลนิสิต\n${r.prefix || ""}${r.first_name} ${r.last_name}\n${r.email || "-"}`);

  const handleAdd = () => router.push("/teacher/student_data/add");

  const renderRegType = (r) => {
    const val = String(r?.reg_type || "").toLowerCase();
    if (val.includes("coop"))
      return (
        <span className="inline-block min-w-[110px] rounded-full bg-blue-600 px-4 py-1 text-white font-semibold text-[13px]">
          สหกิจศึกษา
        </span>
      );
    if (val.includes("proj"))
      return (
        <span className="inline-block min-w-[110px] rounded-full bg-orange-500 px-4 py-1 text-white font-semibold text-[13px]">
          ปัญหาพิเศษ
        </span>
      );
    return (
      <span className="inline-block min-w-[110px] rounded-full bg-gray-400 px-4 py-1 text-white font-semibold text-[13px]">
        ยังไม่ลงทะเบียน
      </span>
    );
  };

  return (
    <div className={`page-root ${collapsed ? "collapsed" : ""}`}>
      <HeaderBarAdvisor_Problem
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        onLogout={() => router.push("/teacher/login")}
        username="อาจารย์ผู้สอน"
      />
      <SidebarAdvisor collapsed={collapsed} goto={(p) => router.push(p)} />

      <main
        style={{ marginLeft: collapsed ? "60px" : "220px", padding: "80px 20px" }}
      >
        <TeacherStudentDataHeader title="นิสิตในที่ปรึกษา" />

        {/* ===== Filter + Search ===== */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
          {/* Filter ปุ่ม */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold border ${
                filterType === "all"
                  ? "bg-sky-400 text-white border-sky-400"
                  : "bg-white text-black border-gray-300 hover:bg-gray-100"
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setFilterType("project")}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold border ${
                filterType === "project"
                  ? "bg-sky-400 text-white border-sky-400"
                  : "bg-white text-black border-gray-300 hover:bg-gray-100"
              }`}
            >
              ปัญหาพิเศษ
            </button>
            <button
              onClick={() => setFilterType("coop")}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold border ${
                filterType === "coop"
                  ? "bg-sky-400 text-white border-sky-400"
                  : "bg-white text-black border-gray-300 hover:bg-gray-100"
              }`}
            >
              สหกิจ
            </button>
          </div>

          {/* Search + Add */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-2.5 top-2.5 text-gray-500"
              />
              <input
                type="text"
                placeholder="ค้นหานิสิต..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8 pr-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleAdd}
              className="flex items-center gap-2 rounded-md bg-emerald-500 px-3 py-2 text-white text-sm font-medium hover:bg-emerald-600 transition"
            >
              <Plus size={16} /> เพิ่มนิสิตในที่ปรึกษา
            </button>
          </div>
        </div>

        {/* ===== ตาราง ===== */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="py-6 text-center text-gray-500">⏳ กำลังโหลด...</div>
          ) : filtered.length === 0 ? (
            <div className="py-6 text-center text-gray-500">
              ไม่พบนิสิตในที่ปรึกษา
            </div>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-neutral-800 text-white text-center text-[14px]">
                  <th className="py-3 px-4 font-semibold">หัวข้อ</th>
                  <th className="py-3 px-4 font-semibold">รหัสนิสิต</th>
                  <th className="py-3 px-4 font-semibold">ชื่อ - นามสกุล</th>
                  <th className="py-3 px-4 font-semibold">ภาควิชา</th>
                  <th className="py-3 px-4 font-semibold">อีเมล</th>
                  <th className="py-3 px-4 font-semibold">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr
                    key={i}
                    className="text-center border-t border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-3">{renderRegType(r)}</td>
                    <td className="py-3">{r.student_id || "-"}</td>
                    <td className="py-3">{`${r.prefix || ""}${r.first_name} ${r.last_name}`}</td>
                    <td className="py-3">{`${r.department || "-"}`}</td>
                    <td className="py-3">{r.email || "-"}</td>
                    <td className="py-3 flex justify-center gap-2">
                      <button
                        onClick={() => handleView(r)}
                        className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleRemove(r)}
                        className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-red-100 hover:text-red-600 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
