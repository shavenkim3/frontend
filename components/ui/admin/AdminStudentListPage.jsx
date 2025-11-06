"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  Plus,
  Filter,
  Search,
  Pencil,
  EyeIcon,
  X,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AdminStudentListPageView() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [selectedTab, setSelectedTab] = useState("ทั้งหมด");
  const [filter, setFilter] = useState({
    program: "ไม่ระบุ",
    advisor: "",
    search: "",
  });
  const [showFilter, setShowFilter] = useState(false);

  // ✅ โหลดข้อมูลจาก backend
  useEffect(() => {
    const token =
      localStorage.getItem("admin_token") || localStorage.getItem("token");

    fetch(`${API_URL}/api/students`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("❌ โหลดข้อมูลนิสิตล้มเหลว:", err));
  }, []);

  /* =====================================================
   * 🔹 Helper Functions: ประมวลผลประเภท (reg_type)
   * ===================================================== */
  const getRegKind = (regTypeRaw) => {
    const v = String(regTypeRaw || "").trim().toLowerCase();
    if (!v) return "none";
    if (["project", "ปัญหาพิเศษ"].includes(v)) return "project";
    if (["coop", "co-op", "สหกิจศึกษา"].includes(v)) return "coop";
    return "none";
  };

  const getBadgeClass = (regTypeRaw) => {
    const kind = getRegKind(regTypeRaw);
    if (kind === "project") return "bg-[#0288D1]"; // 🔵 ฟ้า
    if (kind === "coop") return "bg-[#E65100]"; // 🟠 ส้ม
    return "bg-gray-400"; // ⚪ เทา
  };

  const getBadgeText = (regTypeRaw) => {
    const kind = getRegKind(regTypeRaw);
    if (kind === "project") return "ปัญหาพิเศษ";
    if (kind === "coop") return "สหกิจศึกษา";
    return "ยังไม่ลงทะเบียน";
  };

  // ✅ กรองข้อมูล
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const kind = getRegKind(s.reg_type);
      const kindTh =
        kind === "project"
          ? "ปัญหาพิเศษ"
          : kind === "coop"
          ? "สหกิจศึกษา"
          : "ยังไม่ลงทะเบียน";

      if (selectedTab !== "ทั้งหมด" && kindTh !== selectedTab) return false;
      if (filter.program !== "ไม่ระบุ" && s.program_type !== filter.program)
        return false;
      if (filter.advisor && s.advisor_name !== filter.advisor) return false;

      const searchText = filter.search.toLowerCase();
      if (
        searchText &&
        !(
          String(s.student_id).includes(searchText) ||
          `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchText)
        )
      )
        return false;
      return true;
    });
  }, [students, selectedTab, filter]);

  const clearFilters = () => {
    setFilter({ program: "ไม่ระบุ", advisor: "", search: "" });
    setSelectedTab("ทั้งหมด");
  };

  return (
    <div className="flex flex-col xl:flex-row gap-4 p-4 bg-[#f5f5f5] min-h-[85vh] relative">
      {/* ✅ ตารางนิสิต */}
      <div className="flex-1 bg-white rounded-lg shadow-md p-5 overflow-hidden relative">
        {/* Filter Icon (มือถือ) */}
        <div className="absolute top-0 right-0">
          <button
            onClick={() => setShowFilter(true)}
            className="hidden custom-filter-icon:flex items-center justify-center w-10 h-10 border border-[#027a50] text-[#027a50] rounded-full hover:bg-[#e6f4ef] transition mt-2 mr-2"
            title="ตัวกรอง"
          >
            <Filter size={18} />
          </button>
        </div>

        {/* ปุ่มหมวด + ปุ่ม CSV */}
        <div className="flex flex-wrap items-center justify-start gap-3 mb-3 pr-14">
          {["ทั้งหมด", "ปัญหาพิเศษ", "สหกิจศึกษา", "ยังไม่ลงทะเบียน"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-5 py-2 rounded-full font-semibold transition border ${
                  selectedTab === tab
                    ? "bg-[#03A9F4] text-white border-transparent"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            )
          )}

          <button
            className="csv-btn flex items-center gap-2 border border-[#03a96b] text-[#03a96b] px-3 py-2 rounded-lg hover:bg-[#f0fdf4] transition whitespace-nowrap"
            title="ดาวน์โหลด CSV"
          >
            <Download size={16} />
            <span className="csv-text">ดาวน์โหลด CSV</span>
          </button>

          <button
            onClick={() => router.push("/admin/student/add")}
            className="add-btn flex items-center gap-2 bg-[#03a96b] text-white px-3 py-2 rounded-lg hover:bg-[#02975f] transition whitespace-nowrap"
            title="เพิ่มไฟล์ CSV"
          >
            <Plus size={16} />
            <span className="add-text">เพิ่มไฟล์ CSV</span>
          </button>
        </div>

        {/* ช่องค้นหา */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
          <input
            type="text"
            placeholder="ค้นหา: รหัสนิสิต หรือ ชื่อ–นามสกุล"
            value={filter.search}
            onChange={(e) =>
              setFilter((f) => ({ ...f, search: e.target.value }))
            }
            className="border border-gray-300 rounded-lg pl-9 pr-3 py-2 w-full focus:outline-[#03a96b]"
          />
        </div>

        {/* ✅ ตารางข้อมูลนิสิต */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full border-collapse text-sm student-table">
            <thead className="sticky top-0 bg-[#333] text-white text-center z-10">
              <tr>
                <th className="p-3">ประเภท</th>
                <th className="p-3">รหัสนิสิต</th>
                <th className="p-3">ชื่อ–นามสกุล</th>
                <th className="p-3">ภาค</th>
                <th className="p-3">อาจารย์</th>
                <th className="p-3">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-200 hover:bg-[#f9f9f9] text-center"
                >
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-white rounded-full text-xs font-semibold inline-block min-w-[110px] ${getBadgeClass(
                        s.reg_type
                      )}`}
                    >
                      {getBadgeText(s.reg_type)}
                    </span>
                  </td>
                  <td className="p-3">{s.student_id}</td>
                  <td className="p-3">
                    {s.prefix}
                    {s.first_name} {s.last_name}
                  </td>
                  <td className="p-3">{s.program_type}</td>
                  <td className="p-3">
                    {s.advisor_name ? s.advisor_name.split(" ")[0] : "-"}
                  </td>
                  <td className="p-3 flex items-center justify-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center border border-[#d0d7de] rounded-full hover:bg-[#e6f4ef] transition">
                      <Pencil size={16} color="#027a50" strokeWidth={2.2} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center border border-[#d0d7de] rounded-full hover:bg-[#e6f4ef] transition">
                      <EyeIcon size={16} color="#027a50" strokeWidth={2.2} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ ตัวกรอง (Desktop) */}
      <div className="custom-filter:hidden w-[320px] flex flex-col gap-3 transition-all">
        <div className="bg-[#03a96b] text-white text-center rounded-lg shadow-md py-4">
          <h3 className="text-lg font-semibold">จำนวนนิสิต</h3>
          <div className="text-4xl font-bold mt-1">
            {filteredStudents.length}
          </div>
        </div>

        <FilterPanel
          students={students}
          filter={filter}
          setFilter={setFilter}
          clearFilters={clearFilters}
        />
      </div>

      {/* ✅ Drawer Filter (มือถือ) */}
      {showFilter && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-30"
            onClick={() => setShowFilter(false)}
          />
          <div className="fixed top-0 right-0 w-[300px] h-full bg-white shadow-lg z-40 p-4 overflow-y-auto animate-slideIn">
            <div className="bg-[#03a96b] text-white text-center rounded-lg shadow-md py-4 mb-4">
              <h3 className="text-lg font-semibold">จำนวนนิสิต</h3>
              <div className="text-4xl font-bold mt-1">
                {filteredStudents.length}
              </div>
            </div>

            <FilterPanel
              students={students}
              filter={filter}
              setFilter={setFilter}
              clearFilters={clearFilters}
            />

            <div className="absolute top-3 right-3">
              <button onClick={() => setShowFilter(false)}>
                <X size={24} color="#333" />
              </button>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease forwards;
        }

        @media (max-width: 1000px) {
          .csv-text,
          .add-text {
            display: none !important;
          }
          .csv-btn,
          .add-btn {
            padding: 0.6rem !important;
            border-radius: 50% !important;
            width: 40px;
            height: 40px;
            justify-content: center;
          }
          .student-table {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

/* ✅ Filter Panel (ดึงอาจารย์จากข้อมูลจริง) */
function FilterPanel({ students, filter, setFilter, clearFilters }) {
  const advisorList = Array.from(
    new Set(
      students
        .map((s) => s.advisor_name)
        .filter((v) => v && v.trim() !== "")
    )
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="space-y-3">
        <div>
          <label className="block font-medium mb-1">ภาค</label>
          <div className="flex items-center gap-4">
            {["ภาคปกติ", "ภาคพิเศษ", "ไม่ระบุ"].map((v) => (
              <label key={v} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="program"
                  value={v}
                  checked={filter.program === v}
                  onChange={(e) =>
                    setFilter((f) => ({ ...f, program: e.target.value }))
                  }
                />
                {v}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">เลือกอาจารย์ที่ปรึกษา</label>
          <select
            className="w-full border border-gray-500 rounded-lg px-2 py-2 text-sm"
            value={filter.advisor}
            onChange={(e) =>
              setFilter((f) => ({ ...f, advisor: e.target.value }))
            }
          >
            <option value="">-- เลือกอาจารย์ที่ปรึกษา --</option>
            {advisorList.map((name) => (
              <option key={name} value={name}>
                {name.split(" ")[0]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 mt-3">
          <button
            className="flex-1 bg-gray-200 text-gray-800 rounded-lg py-2 font-semibold hover:bg-gray-300"
            onClick={clearFilters}
          >
            ล้างตัวกรอง
          </button>
        </div>
      </div>
    </div>
  );
}
