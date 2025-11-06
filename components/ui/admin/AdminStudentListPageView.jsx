"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Filter, Search, Pencil, EyeIcon, X } from "lucide-react";

export default function AdminStudentListPageView({ studentsData = [] }) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("ทั้งหมด");
  const [filter, setFilter] = useState({
    program: "ไม่ระบุ",
    search: "",
  });
  const [showFilter, setShowFilter] = useState(false);

  const students = Array.isArray(studentsData) ? studentsData : [];

  /* =====================================================
   * 🔹 Helper Functions: รองรับ reg_type หรือ title จาก backend
   * ===================================================== */
  const getRegKind = (raw) => {
    if (!raw) return "none";
    const v = String(raw).trim().toLowerCase();

    if (["project", "special_problem", "sp", "ปัญหาพิเศษ"].includes(v))
      return "project";
    if (["coop", "co-op", "cooperative", "สหกิจศึกษา", "สหกิจ"].includes(v))
      return "coop";

    return "none";
  };

  const getBadgeClass = (data) => {
    const kind = getRegKind(data?.reg_type || data?.title);
    if (kind === "project") return "bg-[#0288D1]"; // 🔵 ปัญหาพิเศษ
    if (kind === "coop") return "bg-[#E65100]"; // 🟠 สหกิจศึกษา
    return "bg-gray-400"; // ⚪ ยังไม่ลงทะเบียน
  };

  const getBadgeText = (data) => {
    const kind = getRegKind(data?.reg_type || data?.title);
    if (kind === "project") return "ปัญหาพิเศษ";
    if (kind === "coop") return "สหกิจศึกษา";
    return "ยังไม่ลงทะเบียน";
  };

  // ✅ ฟังก์ชันกรองข้อมูล
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const kind = getRegKind(s.reg_type || s.title);
      const kindTh =
        kind === "project"
          ? "ปัญหาพิเศษ"
          : kind === "coop"
          ? "สหกิจศึกษา"
          : "ยังไม่ลงทะเบียน";

      if (selectedTab !== "ทั้งหมด" && kindTh !== selectedTab) return false;
      if (filter.program !== "ไม่ระบุ" && s.program !== filter.program)
        return false;

      const searchText = filter.search.toLowerCase();
      if (
        searchText &&
        !(
          String(s.student_id).toLowerCase().includes(searchText) ||
          `${s.first_name || ""} ${s.last_name || ""}`
            .toLowerCase()
            .includes(searchText) ||
          String(s.full_name || "").toLowerCase().includes(searchText)
        )
      )
        return false;
      return true;
    });
  }, [students, selectedTab, filter]);

  const clearFilters = () => {
    setFilter({ program: "ไม่ระบุ", search: "" });
    setSelectedTab("ทั้งหมด");
  };

  /* =====================================================
   * 🔹 UI
   * ===================================================== */
  return (
    <div className="flex flex-col xl:flex-row gap-4 p-4 bg-[#f5f5f5] min-h-[85vh] relative">
      {/* ✅ ตาราง / การ์ดข้อมูลนิสิต */}
      <div className="flex-1 bg-white rounded-lg shadow-md p-5 overflow-hidden relative">
        <div className="absolute top-2 right-3 custom-filter-icon">
          <button
            onClick={() => setShowFilter(true)}
            className="hidden items-center justify-center w-10 h-10 border border-[#03a96b] text-[#03a96b] rounded-full hover:bg-[#e6f4ef] transition"
            title="ตัวกรอง"
          >
            <Filter size={18} />
          </button>
        </div>

        {/* ✅ ปุ่มหมวด */}
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

        {/* ✅ ตาราง */}
        <div className="relative border border-gray-200 rounded-lg overflow-hidden">
          <div className="table-view max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="min-w-full border-collapse text-sm">
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
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-200 hover:bg-[#f9f9f9] text-center align-middle transition-colors"
                    >
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 text-white rounded-full text-xs font-semibold inline-block min-w-[110px] ${getBadgeClass(
                            s
                          )}`}
                        >
                          {getBadgeText(s)}
                        </span>
                      </td>
                      <td className="p-3">{s.student_id || "-"}</td>
                      <td className="p-3">{s.full_name || "-"}</td>
                      <td className="p-3">{s.program || "-"}</td>
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-4 text-gray-500 text-center">
                      ไม่พบนิสิตในที่ปรึกษาคนนี้
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ✅ ตัวกรองด้านข้าง */}
      <div className="filter-panel w-[320px] flex flex-col gap-3 transition-all">
        <div className="bg-[#03a96b] text-white text-center rounded-lg shadow-md py-4">
          <h3 className="text-lg font-semibold">จำนวนนิสิตที่ลงทะเบียน</h3>
          <div className="text-4xl font-bold mt-1">{filteredStudents.length}</div>
        </div>
        <FilterPanel
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
              <h3 className="text-lg font-semibold">จำนวนนิสิตที่ลงทะเบียน</h3>
              <div className="text-4xl font-bold mt-1">
                {filteredStudents.length}
              </div>
            </div>
            <FilterPanel
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
        @media (max-width: 1400px) {
          .filter-panel {
            display: none !important;
          }
          .custom-filter-icon button {
            display: flex !important;
          }
        }
        @media (max-width: 1100px) {
          .table-view {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

/* =====================================================
   🔹 Filter Panel (เฉพาะภาค)
===================================================== */
function FilterPanel({ filter, setFilter, clearFilters }) {
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
