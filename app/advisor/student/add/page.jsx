"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SidebarTeacher from "@/components/ui/teacher/SidebarTeacher";
import NavbarTeacher from "@/components/ui/teacher/NavbarTeacher";
import TeacherStudentAddHeader from "@/components/ui/teacher/TeacherStudentAddHeader";

import AdvisorStudentsSearchBar from "@/components/ui/teacher/AdvisorStudentsSearchBar";
import AdvisorStudentAddForm from "@/components/ui/teacher/AdvisorStudentAddForm";
import AdvisorStudentsTable from "@/components/ui/teacher/AdvisorStudentsTable";

import { addAdvisee, getAdvisee } from "@/lib/teacherAdvisorApi";

export default function AdvisorStudentsPage() {
  const router = useRouter();

  // ===== Layout state =====
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const MOBILE_BP = 800;

  const toggleSidebar = () => {
    if (isMobile) setMobileOpen((v) => !v);
    else setCollapsed((v) => !v);
  };
  const handleLogout = () => router.push("/teacher/login");
  const goto = (path) => (e) => {
    e?.preventDefault?.();
    router.push(path);
    if (isMobile) setMobileOpen(false);
  };

  const handleResize = useCallback(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1920;
    const mobile = w < MOBILE_BP;
    setIsMobile(mobile);
    if (mobile) setCollapsed(true);
    else {
      setMobileOpen(false);
      setCollapsed(false);
    }
  }, []);
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);
  useEffect(() => {
    if (!(isMobile && mobileOpen)) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobile, mobileOpen]);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const sidebarCollapsed = isMobile ? false : collapsed;

  async function handleAddStudent(student) {
  if (!confirm(`ต้องการเพิ่ม ${student.first_name} ${student.last_name} เป็นที่ปรึกษาหรือไม่?`))
    return;
  try {
    await addAdvisee({
      student_id: student.student_id,
      is_primary: false,
      advisor_role: "ที่ปรึกษาร่วม",
      note: "เพิ่มโดยอาจารย์",
    });
    alert("เพิ่มนิสิตเข้าที่ปรึกษาสำเร็จ");
  } catch (e) {
    alert(e.message || "เกิดข้อผิดพลาดในการเพิ่มนิสิต");
  }
}

  // ===== Data state (search results & editing)
  const [items, setItems] = useState([]); // ผลค้นหา student_info
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // สำหรับแก้ไข
  const [selectedStudent, setSelectedStudent] = useState(null); // {student_id, prefix, ...}
  const [initialForm, setInitialForm] = useState(null); // ค่า relationship ปัจจุบัน (ถ้ามี)

  const handleResults = ({ items }) => {
    setItems(items);
  };

  const openEdit = async (s) => {
    setSelectedStudent(s);
    try {
      const rel = await getAdvisee(s.student_id); // null ได้ถ้ายังไม่เคยผูก
      if (rel) {
        setInitialForm({
          student_id: s.student_id,
          is_primary: !!rel.is_primary,
          advisor_role: rel.advisor_role || "",
          status: rel.status || "",
          note: rel.note || "",
        });
      } else {
        setInitialForm({
          student_id: s.student_id,
          is_primary: false,
          advisor_role: "",
          status: "",
          note: "",
        });
      }
      setShowForm(true);
    } catch (e) {
      setInitialForm({
        student_id: s.student_id,
        is_primary: false,
        advisor_role: "",
        status: "",
        note: "",
      });
      setShowForm(true);
    }
  };

  const onSubmitForm = async (form) => {
    setSubmitting(true);
    try {
      await addAdvisee(form); // upsert ความสัมพันธ์
      alert("บันทึกเรียบร้อย");
      setShowForm(false);
      setSelectedStudent(null);
      setInitialForm(null);
    } catch (e) {
      alert(e.message || "บันทึกไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`page-root ${collapsed ? "collapsed" : ""} ${
        isMobile && mobileOpen ? "mobile-open" : ""
      }`}
    >
      {/* ==== Layout CSS ==== */}
      <style jsx global>{`
        :root {
          --sbw: 220px;
          --sbw-c: 60px;
          --navh: 64px;
        }
        html,
        body {
          height: 100%;
        }
        body {
          background: #f5f5f5;
          margin: 0;
          font-family: "Kanit", sans-serif;
        }
        :global(.sidebar) {
          position: fixed !important;
          top: 0;
          left: 0;
          height: 100dvh;
          width: var(--sbw);
          overflow: hidden;
          background: #1a1a1a;
          z-index: 2000;
        }
        :global(.navbar) {
          position: fixed !important;
          top: 0;
          left: var(--sbw);
          height: var(--navh);
          width: calc(100% - var(--sbw));
          z-index: 2100;
          background: #00824d;
        }
        .collapsed :global(.sidebar) {
          width: var(--sbw-c);
        }
        .collapsed :global(.navbar) {
          left: var(--sbw-c);
          width: calc(100% - var(--sbw-c));
        }
        :global(table) {
          table-layout: fixed;
          width: 100%;
        }
        :global(th),
        :global(td) {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      `}</style>

      <style jsx>{`
        .main {
          margin-left: var(--sbw);
          padding: calc(var(--navh) + 16px) 20px 20px;
          transition: margin-left 0.3s ease;
          min-height: 100vh;
        }
        .collapsed .main {
          margin-left: var(--sbw-c);
        }
        .titleRow {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          align-items: center;
          margin-bottom: 16px;
        }
        @media (max-width: 799px) {
          :global(.navbar) {
            left: 0 !important;
            width: 100% !important;
          }
          .main {
            margin-left: 0 !important;
            padding: calc(var(--navh) + 20px) 16px 16px;
          }
          :global(.sidebar) {
            width: 280px !important;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 2200 !important;
          }
          .mobile-open :global(.sidebar) {
            transform: translateX(0);
          }
          .drawer-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.38);
            z-index: 2100;
          }
          .mobile-open :global(.tooltip) {
            display: none !important;
          }
        }
      `}</style>

      <NavbarTeacher
        collapsed={collapsed}
        isMobile={isMobile}
        onToggle={toggleSidebar}
        onLogout={handleLogout}
        username="อาจารย์ผู้สอน"
      />
      {isMobile && mobileOpen && (
        <div
          className="drawer-backdrop"
          onClick={() => setMobileOpen(false)}
          role="button"
          aria-label="ปิดเมนู"
        />
      )}
      <SidebarTeacher
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        goto={goto}
      />

      <main className="main">
        <div className="titleRow">
          <TeacherStudentAddHeader title="รายชื่อนิสิตทั้งหมด" />
        </div>

        {/* ✅ โหลดนิสิตทั้งหมดตั้งแต่เข้าเพจ */}
        <AdvisorStudentsSearchBar
          onResults={handleResults}
          autoLoad={true}
          limit={200} // ปรับจำนวนตามต้องการ
        />

        <AdvisorStudentsTable
          items={items}
          loading={loading}
          onEdit={openEdit}
          onAdd={handleAddStudent}
        />

        {showForm && selectedStudent && (
          <AdvisorStudentAddForm
            onSubmit={onSubmitForm}
            onCancel={() => {
              setShowForm(false);
              setSelectedStudent(null);
              setInitialForm(null);
            }}
            submitting={submitting}
            initialValues={initialForm}
            studentInfo={selectedStudent}
          />
        )}
      </main>
    </div>
  );
}
