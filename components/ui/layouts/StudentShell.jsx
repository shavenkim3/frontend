// frontend/components/layouts/StudentShell.jsx
"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/NavbarCoop"; // ← คือ Navbar ที่คุณมีอยู่แล้ว
import { useStudentMe } from "@/hooks/useStudentMe"; // ← ใช้ชื่อ hook ของคุณ
import Sidebar from "@/components/ui/SidebarCoop"; // ถ้ามี sidebar ใช้ตัวนี้ ถ้าไม่มีก็ลบได้

export default function StudentShell({ children }) {
  const router = useRouter();
  const { me, loading } = useStudentMe();

  const handleLogout = () => {
    // เคลียร์ token ออกจาก localStorage แล้ว redirect
    localStorage.removeItem("student_token");
    localStorage.removeItem("token");
    localStorage.removeItem("jwt");
    router.replace("/student/login_student");
  };

  // toggle sidebar ถ้ามีระบบพับ sidebar
  const collapsed = false;

  // เตรียมข้อมูลให้ Navbar แสดง
  const studentId = me?.student_id || "";
  const firstname = me?.first_name || "";
  const username = me?.username || me?.email || "";

  return (
    <>
      <Navbar
        collapsed={collapsed}
        title="ระบบจัดการข้อมูลสหกิจศึกษา"
        titleSize="1.2rem"
        studentId={studentId}
        firstname={firstname}
        username={username}
        isLoading={loading}
        onMenuClick={() => {
          console.log("toggle menu");
        }}
        onLogout={handleLogout}
      />
      <div style={{ paddingTop: 50, display: "flex" }}>
        {/* ถ้ามี Sidebar */}
        {typeof collapsed !== "undefined" && <Sidebar collapsed={collapsed} />}
        <main style={{ flex: 1, padding: 16 }}>{children}</main>
      </div>
    </>
  );
}
