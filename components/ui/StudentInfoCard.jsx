"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getStudentToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("student_token") ||
    localStorage.getItem("token") ||
    ""
  );
}

export default function StudentInfoCard() {
  const [student, setStudent] = useState(null);
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getStudentToken();
        const headers = { Authorization: `Bearer ${token}` };

        const [resStudent, resIntern] = await Promise.all([
          fetch(`${API_URL}/students/me`, { headers }),
          fetch(`${API_URL}/internships/me`, { headers }),
        ]);

        const dataStudent = await resStudent.json();
        const dataIntern = await resIntern.json();

        if (!resStudent.ok)
          throw new Error(dataStudent?.error || "โหลดข้อมูลนิสิตไม่สำเร็จ");
        if (!resIntern.ok)
          throw new Error(dataIntern?.error || "โหลดข้อมูลสหกิจไม่สำเร็จ");

        setStudent(dataStudent?.data || null);
        setInternship(dataIntern?.data || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-6">⏳ กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="p-6 text-red-600">❌ {error}</div>;
  if (!student) return <div className="p-6">ไม่พบข้อมูลนิสิต</div>;

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 font-[Kanit]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        ข้อมูลนิสิต
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <Info label="รหัสนิสิต" value={student.student_id} />
        <Info
          label="ชื่อ - นามสกุล"
          value={`${student.prefix || ""}${student.first_name} ${student.last_name}`}
        />
        <Info label="คณะ" value={student.faculty} />
        <Info label="สาขา" value={student.department} />
        <Info label="อีเมล" value={student.email} />
        <Info label="เบอร์โทร" value={student.phone} />
        <Info label="อาจารย์ที่ปรึกษา" value={student.advisor_name} />
        <Info
          label="ประเภทโครงการ"
          value={
            student.reg_type === "coop" ? "สหกิจศึกษา" : "โครงงานพิเศษ"
          }
        />
        <Info label="คะแนนสอบ" value={student.exam_score} />
      </div>

      {student.reg_type === "coop" && internship && (
        <>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            ข้อมูลสหกิจศึกษา
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Info label="ชื่อบริษัท" value={internship.company_name} />
            <Info label="ที่อยู่บริษัท" value={internship.company_address} />
            <Info label="ผู้ควบคุมงาน" value={internship.mentor_name} />
            <Info label="เบอร์โทรผู้ควบคุมงาน" value={internship.mentor_phone} />
            <Info label="ตำแหน่งงานที่ฝึก" value={internship.position_title} />
            <Info label="วันเริ่มต้น" value={internship.start_date} />
            <Info label="วันสิ้นสุด" value={internship.end_date} />
            <Info label="โหมดการทำงาน" value={internship.work_mode || "Onsite"} />
          </div>
        </>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex flex-col border-b border-gray-100 pb-2">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-base text-gray-800 font-medium">
        {value || "-"}
      </span>
    </div>
  );
}
