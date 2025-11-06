"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import SidebarAdmin from "@/components/ui/admin/SidebarAdmin";
import HeaderBarAdmin_Problem from "@/components/ui/admin/HeaderBarAdmin_Problem";
import WelcomeSectionAdmin_edit from "@/components/ui/admin/WelcomeSectionAdmin_edit";
import TeacherEditForm from "@/components/ui/admin/TeacherEditForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getAdminToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token") ||
    ""
  );
}

export default function TeacherEditPage() {
  const { id } = useParams();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const MOBILE_BP = 799;

  const handleResize = useCallback(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1920;
    const mobile = w <= MOBILE_BP;
    setIsMobile(mobile);
    if (mobile) setCollapsed(false);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  /** ✅ โหลดข้อมูลอาจารย์จาก backend */
  useEffect(() => {
    if (!id) return;
    const fetchTeacher = async () => {
      try {
        setLoading(true);
        setErr("");
        const token = getAdminToken();

        const res = await fetch(`${API_URL}/admin/advisors/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setTeacher({
          id: data.advisor_id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          department: data.department,
          students: data.students || 0,
          status: data.status === "full" ? "เต็มโควตา" : "เปิดรับที่ปรึกษา",
          code: data.advisor_id,
        });
      } catch (e) {
        console.error("fetchTeacher error:", e);
        setErr("ไม่สามารถโหลดข้อมูลอาจารย์ได้");
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [id]);

  /** ✅ เมื่อกดบันทึก */
  const handleSave = async (formData) => {
    try {
      const token = getAdminToken();
      const payload = {
        full_name: formData.name,
        email: formData.email,
        phone_number: formData.phone,
        department: formData.department,
      };

      const res = await fetch(`${API_URL}/admin/advisors/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      alert("✅ บันทึกข้อมูลเรียบร้อยแล้ว");
      router.push("/admin/teacher");
    } catch (err) {
      console.error("saveTeacher error:", err);
      alert("❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const handleCancel = () => router.push("/admin/teacher");

  const rootClass = `
    layout
    ${isMobile ? "" : collapsed ? "is-collapsed" : ""}
    ${isMobile && mobileOpen ? "mobile-open" : ""}
  `;

  return (
    <div className={rootClass}>
      {/* โหลดฟอนต์ Kanit */}
      <link
        href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ===== Sidebar ===== */}
      <SidebarAdmin
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {isMobile && mobileOpen && (
        <div className="drawer-backdrop" onClick={() => setMobileOpen(false)} />
      )}

      {/* ===== Main Content ===== */}
      <main
        className={`main flex flex-col min-h-screen bg-gray-50 transition-all duration-300 
        ${isMobile ? "ml-0" : collapsed ? "ml-[60px]" : "ml-[220px]"}`}
      >
        <HeaderBarAdmin_Problem
          isMobile={isMobile}
          setMobileOpen={setMobileOpen}
          title="ระบบจัดการข้อมูลสหกิจศึกษา"
          showUser={true}
        />

        <div className="flex-1 p-6">
          <WelcomeSectionAdmin_edit />

          {loading ? (
            <p className="text-center text-gray-600 mt-10 text-lg">
              ⏳ กำลังโหลดข้อมูล...
            </p>
          ) : err ? (
            <p className="text-center text-red-500 mt-10 text-lg">{err}</p>
          ) : (
            <div className="mt-6">
              <TeacherEditForm
                teacher={teacher}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        body {
          background: #f5f5f5;
          font-family: "Kanit", sans-serif;
        }

        .main {
          transition: margin-left 0.3s ease;
        }

        @media (max-width: 799px) {
          .main {
            margin-left: 0 !important;
          }
        }

        .drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
          z-index: 40;
        }
      `}</style>
    </div>
  );
}
