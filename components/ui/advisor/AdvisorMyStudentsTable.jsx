"use client";
import React, { useState, useMemo } from "react";
import { Eye, Trash2, Plus, Search } from "lucide-react";

export default function AdvisorMyStudentsTable() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([
    {
      student_id: "6521653555",
      prefix: "นาย",
      first_name: "ชัยพร",
      last_name: "แพ้มาลัย",
      department: "วิทยาการคอมพิวเตอร์",
      email: "chai@example.ac.th",
      reg_type: "project",
    },
    {
      student_id: "6521650003",
      prefix: "นาย",
      first_name: "ธีร์รภัทร",
      last_name: "นฤนาค",
      department: "เทคโนโลยีสารสนเทศ",
      email: "teerapat@example.ac.th",
      reg_type: "coop",
    },
  ]);
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

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

  const handleView = (r) =>
    alert(`📋 ข้อมูลนิสิต\n${r.prefix || ""}${r.first_name} ${r.last_name}\n${r.email || "-"}`);

  const handleRemove = (r) =>
    confirm(`ต้องการลบ ${r.first_name} ${r.last_name} ออกจากที่ปรึกษาหรือไม่?`)
      ? alert("ลบสำเร็จ (mock)")
      : null;

  const handleAdd = () => alert("➕ เพิ่มนิสิตในที่ปรึกษา (mock)");

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
    <div className="p-4">
      {/* ✅ แทน header เดิม */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">นิสิตในที่ปรึกษา</h2>

      {/* ===== Filter + Search ===== */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        {/* Filter ปุ่ม */}
        <div className="flex gap-2">
          {["all", "project", "coop"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold border ${
                filterType === type
                  ? "bg-sky-400 text-white border-sky-400"
                  : "bg-white text-black border-gray-300 hover:bg-gray-100"
              }`}
            >
              {type === "all" ? "ทั้งหมด" : type === "project" ? "ปัญหาพิเศษ" : "สหกิจ"}
            </button>
          ))}
        </div>

        {/* Search + Add */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-2.5 top-2.5 text-gray-500" />
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
          <div className="py-6 text-center text-gray-500">ไม่พบนิสิตในที่ปรึกษา</div>
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
                  <td className="py-3">{r.department || "-"}</td>
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
    </div>
  );
}
