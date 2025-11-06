"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Plus } from "lucide-react";

/* -----------------------------------------------------------
   🔹 ตัวหลัก: หน้ารวมรายชื่อนิสิตในที่ปรึกษา (mock)
----------------------------------------------------------- */
export default function AdvisorStudentsPage_Mock() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [form, setForm] = useState({
    student_id: "",
    advisor_role: "",
    status: "",
    note: "",
    is_primary: false,
  });

  /* ---------------- Mock: โหลดข้อมูลทั้งหมด ---------------- */
  useEffect(() => {
    const mockStudents = [
      {
        student_id: "6521653555",
        prefix: "นาย",
        first_name: "ชัยพร",
        last_name: "แพ้มาลัย",
        program_type: "ภาคพิเศษ",
        advisor_name: "อ.สุริยะ",
        reg_type: "project",
        email: "chai@example.ac.th",
      },
      {
        student_id: "6521650003",
        prefix: "นาย",
        first_name: "ธีร์รภัทร",
        last_name: "นฤนาค",
        program_type: "ภาคปกติ",
        advisor_name: "อ.ธีรานนท์",
        reg_type: "coop",
        email: "teerapat@example.ac.th",
      },
    ];
    setItems(mockStudents);
  }, []);

  /* ---------------- ฟังก์ชันจำลอง ---------------- */
  const handleSearch = (q) => {
    setLoading(true);
    setTimeout(() => {
      const filtered = mockFilter(q);
      setItems(filtered);
      setLoading(false);
    }, 500);
  };

  const mockFilter = (q) => {
    const base = [
      {
        student_id: "6521653555",
        prefix: "นาย",
        first_name: "ชัยพร",
        last_name: "แพ้มาลัย",
        program_type: "ภาคพิเศษ",
        advisor_name: "อ.สุริยะ",
        reg_type: "project",
        email: "chai@example.ac.th",
      },
      {
        student_id: "6521650003",
        prefix: "นาย",
        first_name: "ธีร์รภัทร",
        last_name: "นฤนาค",
        program_type: "ภาคปกติ",
        advisor_name: "อ.ธีรานนท์",
        reg_type: "coop",
        email: "teerapat@example.ac.th",
      },
      {
        student_id: "6521650999",
        prefix: "นางสาว",
        first_name: "กนกวรรณ",
        last_name: "วงศ์เจริญ",
        program_type: "ภาคพิเศษ",
        advisor_name: "อ.ภัทราวดี",
        reg_type: "project",
        email: "kanok@example.ac.th",
      },
    ];
    const lower = q.trim().toLowerCase();
    if (!lower) return base;
    return base.filter(
      (s) =>
        s.first_name.toLowerCase().includes(lower) ||
        s.last_name.toLowerCase().includes(lower) ||
        s.student_id.includes(lower)
    );
  };

  const handleAddStudent = (s) => {
    alert(`เพิ่มนิสิต ${s.first_name} ${s.last_name} (mock)`);
    setSelectedStudent(s);
    setForm({
      student_id: s.student_id,
      advisor_role: "",
      status: "",
      note: "",
      is_primary: false,
    });
    setShowForm(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    alert("บันทึกสำเร็จ (mock)");
    setShowForm(false);
    setSelectedStudent(null);
  };

  /* ---------------- Render ---------------- */
  return (
    <main className="p-6 font-[Kanit] bg-gray-50 min-h-screen">

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} loading={loading} />

      {/* Table */}
      <StudentsTable
        items={items}
        loading={loading}
        onAdd={handleAddStudent}
      />

      {/* Add Form */}
      {showForm && selectedStudent && (
        <StudentAddForm
          student={selectedStudent}
          form={form}
          setForm={setForm}
          onSubmit={handleSubmitForm}
          onCancel={() => setShowForm(false)}
        />
      )}
    </main>
  );
}

/* -----------------------------------------------------------
   🔹 Search Bar Component
----------------------------------------------------------- */
function SearchBar({ onSearch, loading }) {
  const [q, setQ] = useState("");
  const onKey = (e) => e.key === "Enter" && onSearch(q);
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="relative w-full">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKey}
          placeholder="ค้นหานิสิต (รหัส / ชื่อ / อีเมล)"
          className="w-full border border-gray-300 rounded-lg px-10 py-2"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      </div>
      <button
        onClick={() => onSearch(q)}
        disabled={loading}
        className="bg-gray-800 text-white rounded-lg px-4 py-2"
      >
        {loading ? "..." : "ค้นหา"}
      </button>
    </div>
  );
}

/* -----------------------------------------------------------
   🔹 Table Component
----------------------------------------------------------- */
function StudentsTable({ items, loading, onAdd }) {
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
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm mb-6">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-neutral-800 text-white text-center text-[14px]">
            <th className="py-3 px-4 font-semibold">หัวข้อ</th>
            <th className="py-3 px-4 font-semibold">รหัสนิสิต</th>
            <th className="py-3 px-4 font-semibold">ชื่อ-นามสกุล</th>
            <th className="py-3 px-4 font-semibold">ภาค</th>
            <th className="py-3 px-4 font-semibold">อาจารย์</th>
            <th className="py-3 px-4 font-semibold">ดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="py-4 text-center text-gray-500">
                กำลังโหลด...
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-4 text-center text-gray-500">
                ไม่พบนิสิต
              </td>
            </tr>
          ) : (
            items.map((s, idx) => (
              <tr
                key={idx}
                className="text-center border-t border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="py-3">{renderRegType(s)}</td>
                <td className="py-3">{s.student_id}</td>
                <td className="py-3">
                  {s.prefix}
                  {s.first_name} {s.last_name}
                </td>
                <td className="py-3">{s.program_type}</td>
                <td className="py-3">{s.advisor_name}</td>
                <td className="py-3 flex justify-center gap-2">
                  <button
                    onClick={() => onAdd(s)}
                    className="rounded-md bg-emerald-500 px-3 py-1 text-white font-medium text-sm hover:bg-emerald-600 transition flex items-center gap-1"
                  >
                    <Plus size={14} /> เพิ่มข้อมูล
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/* -----------------------------------------------------------
   🔹 Add/Edit Form Component
----------------------------------------------------------- */
function StudentAddForm({ student, form, setForm, onSubmit, onCancel }) {
  return (
    <form
      onSubmit={onSubmit}
      className="border rounded-xl p-4 bg-gray-50 shadow-sm"
    >
      <div className="mb-4 text-sm text-gray-700">
        <div>
          <b>นิสิต:</b> {student.prefix}
          {student.first_name} {student.last_name}
        </div>
        <div>
          <b>รหัส:</b>{" "}
          <span className="font-mono">{student.student_id}</span>
        </div>
        <div>
          <b>ภาค:</b> {student.program_type || "-"}
        </div>
        <div>
          <b>อีเมล:</b> {student.email || "-"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">รหัสนิสิต</label>
          <input
            className="border w-full rounded px-3 py-2"
            value={form.student_id}
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            บทบาท (advisor_role)
          </label>
          <input
            className="border w-full rounded px-3 py-2"
            value={form.advisor_role}
            onChange={(e) =>
              setForm({ ...form, advisor_role: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">สถานะ</label>
          <input
            className="border w-full rounded px-3 py-2"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">หมายเหตุ</label>
          <input
            className="border w-full rounded px-3 py-2"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-2 col-span-2">
          <input
            type="checkbox"
            checked={form.is_primary}
            onChange={(e) =>
              setForm({ ...form, is_primary: e.target.checked })
            }
          />
          <label>เป็นที่ปรึกษาหลัก (Primary)</label>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800"
        >
          บันทึก
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  );
}
