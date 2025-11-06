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
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = getStudentToken();
        if (!token) throw new Error("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่");

        const headers = { Authorization: `Bearer ${token}` };

        // ✅ 1. ดึงข้อมูลนิสิต
        const resStu = await fetch(`${API_URL}/students/me`, { headers });
        const dataStu = await resStu.json();
        if (!resStu.ok)
          throw new Error(dataStu?.error || "โหลดข้อมูลนิสิตไม่สำเร็จ");
        setStudent(dataStu?.data);

        // ✅ 2. ดึงข้อมูลบริษัท (จะได้ internship + company + address + mentor)
        const resComp = await fetch(`${API_URL}/api/student-company`, {
          headers,
        });
        if (resComp.status === 204) {
          setCompanyData(null);
        } else {
          const dataComp = await resComp.json();
          if (!resComp.ok)
            throw new Error(dataComp?.error || "โหลดข้อมูลบริษัทไม่สำเร็จ");
          setCompanyData(dataComp);
          setInternship(dataComp?.internship || null);
        }
      } catch (err) {
        console.error("Load error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="p-6">⏳ กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="p-6 text-red-600">❌ {error}</div>;
  if (!student) return <div className="p-6">ไม่พบข้อมูลนิสิต</div>;

  const company = companyData?.company;
  const address = companyData?.address;
  const mentor = companyData?.mentor;

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 font-[Kanit] max-w-5xl mx-auto">
      {/* ====== ข้อมูลนิสิต ====== */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">ข้อมูลนิสิต</h2>
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

      {/* ====== ข้อมูลการฝึกงาน ====== */}
      {internship && (
        <>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            ข้อมูลการฝึกงาน
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <Info label="สถานะ" value={internship.is_active ? "กำลังฝึกงาน" : "สิ้นสุดแล้ว"} />
            <Info label="วันที่สร้าง" value={internship.created_at?.slice(0, 10)} />
            <Info label="วันที่แก้ไข" value={internship.updated_at?.slice(0, 10)} />
          </div>
        </>
      )}

      {/* ====== ข้อมูลบริษัท ====== */}
      {company && (
        <>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            ข้อมูลสถานประกอบการ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <Info label="ชื่อบริษัท" value={company.name} />
            <Info label="เว็บไซต์" value={company.website} />
            <Info label="อีเมล" value={company.email} />
            <Info label="เบอร์โทรหลัก" value={company.phone_main} />
            <Info label="เบอร์มือถือ" value={company.phone_mobile} />
            <Info label="หมายเหตุ" value={company.notes} />
          </div>
        </>
      )}

      {/* ====== ที่อยู่ ====== */}
      {address && (
        <>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            ที่อยู่บริษัท
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <Info label="ถนน" value={address.road} />
            <Info label="หมู่บ้าน" value={address.village} />
            <Info label="ตรอก/ซอย" value={address.alley} />
            <Info label="ห้อง/ชั้น" value={address.room} />
            <Info label="ตำบล/แขวง" value={address.subdistrict} />
            <Info label="อำเภอ/เขต" value={address.district} />
            <Info label="จังหวัด" value={address.province} />
            <Info label="รหัสไปรษณีย์" value={address.zipcode} />
          </div>
        </>
      )}

      {/* ====== ผู้ควบคุมงาน / พี่เลี้ยง ====== */}
      {mentor && (
        <>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            ผู้ควบคุมงาน / พี่เลี้ยง
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Info
              label="ชื่อ - นามสกุล"
              value={`${mentor.first_name || ""} ${mentor.last_name || ""}`}
            />
            <Info label="ตำแหน่ง" value={mentor.position_title} />
            <Info label="อีเมล" value={mentor.email} />
            <Info label="เบอร์โทร" value={mentor.phone} />
            <Info label="เบอร์มือถือ" value={mentor.mobile} />
            <Info label="หมายเหตุ" value={mentor.notes} />
          </div>
        </>
      )}
    </div>
  );
}

/** ===== Sub-component แสดงข้อมูล ===== */
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
