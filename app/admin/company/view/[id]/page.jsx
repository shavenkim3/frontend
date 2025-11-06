"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import SidebarAdmin from "@/components/ui/admin/SidebarAdmin";
import HeaderBarAdmin_Problem from "@/components/ui/admin/HeaderBarAdmin_Problem";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getAdminToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token") ||
    ""
  );
}

export default function CompanyViewPage() {
  const { id } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [company, setCompany] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  /** 🔹 โหลดข้อมูลบริษัททั้งหมด + ผู้ติดต่อ + ที่อยู่ + นิสิต */
  useEffect(() => {
    const token = getAdminToken();
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [companyRes, contactsRes, addressesRes, studentsRes] =
          await Promise.all([
            fetch(`${API_URL}/admin/companies/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_URL}/admin/companies/${id}/contacts`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_URL}/admin/companies/${id}/addresses`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_URL}/admin/companies/${id}/students`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        if (!companyRes.ok) throw new Error("โหลดข้อมูลบริษัทไม่สำเร็จ");

        const companyData = await companyRes.json();
        const contactsData = await contactsRes.json();
        const addressesData = await addressesRes.json();
        const studentsData = await studentsRes.json();

        setCompany(companyData);
        setContacts(contactsData.items || []);
        setAddresses(addressesData.items || []);
        setStudents(studentsData.items || []);
      } catch (err) {
        console.error("fetch company error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="layout">
      <SidebarAdmin
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <HeaderBarAdmin_Problem
        title="ข้อมูลบริษัท"
        isMobile={isMobile}
        setMobileOpen={setMobileOpen}
      />

      <main
        className="main"
        style={{
          marginLeft: collapsed ? "70px" : "230px",
          paddingTop: "80px",
        }}
      >
        <div className="content-wrapper">
          {loading ? (
            <p>⏳ กำลังโหลดข้อมูล...</p>
          ) : error ? (
            <p style={{ color: "red" }}>❌ {error}</p>
          ) : (
            <>
              {/* 🔹 ข้อมูลบริษัท */}
              <div className="card">
                <h2>ข้อมูลบริษัท</h2>
                <div className="info-grid">
                  <div>
                    <strong>ชื่อบริษัท:</strong> {company?.name || "-"}
                  </div>
                  <div>
                    <strong>อีเมล:</strong> {company?.email || "-"}
                  </div>
                  <div>
                    <strong>เบอร์โทรหลัก:</strong> {company?.phone_main || "-"}
                  </div>
                  <div>
                    <strong>เบอร์มือถือ:</strong> {company?.phone_mobile || "-"}
                  </div>
                  <div>
                    <strong>เว็บไซต์:</strong>{" "}
                    {company?.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                      >
                        {company.website}
                      </a>
                    ) : (
                      "-"
                    )}
                  </div>
                  <div>
                    <strong>หมายเหตุ:</strong> {company?.notes || "-"}
                  </div>
                </div>
              </div>

              {/* 🔹 รายชื่อผู้ติดต่อบริษัท */}
              <div className="card">
                <h2>ผู้ติดต่อของบริษัท</h2>
                {contacts.length === 0 ? (
                  <p>ไม่มีข้อมูลผู้ติดต่อ</p>
                ) : (
                  <table className="info-table">
                    <thead>
                      <tr>
                        <th>ชื่อ-นามสกุล</th>
                        <th>ตำแหน่ง</th>
                        <th>อีเมล</th>
                        <th>โทรศัพท์</th>
                        <th>มือถือ</th>
                        <th>หมายเหตุ</th>
                        <th>สถานะ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((c) => (
                        <tr key={c.contact_id}>
                          <td>{`${c.first_name || ""} ${c.last_name || ""}`}</td>
                          <td>{c.position_title || "-"}</td>
                          <td>{c.email || "-"}</td>
                          <td>{c.phone || "-"}</td>
                          <td>{c.mobile || "-"}</td>
                          <td>{c.notes || "-"}</td>
                          <td>{c.is_primary ? "หลัก" : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* 🔹 ที่อยู่บริษัท */}
              <div className="card">
                <h2>ที่อยู่บริษัท</h2>
                {addresses.length === 0 ? (
                  <p>ไม่มีข้อมูลที่อยู่</p>
                ) : (
                  <table className="info-table">
                    <thead>
                      <tr>
                        <th>ประเภท</th>
                        <th>ที่อยู่</th>
                        <th>อำเภอ/เขต</th>
                        <th>จังหวัด</th>
                        <th>รหัสไปรษณีย์</th>
                      </tr>
                    </thead>
                    <tbody>
                      {addresses.map((a) => (
                        <tr key={a.address_id}>
                          <td>{a.address_type || "-"}</td>
                          <td>
                            {a.address_line1 || ""} {a.address_line2 || ""}
                          </td>
                          <td>{a.district || "-"}</td>
                          <td>{a.province || "-"}</td>
                          <td>{a.postal_code || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* 🔹 นิสิตที่ฝึกงานในบริษัทนี้ */}
              <div className="card">
                <h2>นิสิตที่ฝึกงานในบริษัทนี้</h2>
                {students.length === 0 ? (
                  <p>ไม่มีนิสิตฝึกงานในบริษัทนี้</p>
                ) : (
                  <table className="info-table">
                    <thead>
                      <tr>
                        <th>รหัสนิสิต</th>
                        <th>ชื่อ-สกุล</th>
                        <th>สาขา</th>
                        <th>คณะ</th>
                        <th>ตำแหน่งฝึกงาน</th>
                        <th>ระยะเวลา</th>
                        <th>สถานะ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s) => (
                        <tr key={s.internship_id}>
                          <td>{s.student_id}</td>
                          <td>{`${s.first_name || ""} ${s.last_name || ""}`}</td>
                          <td>{s.department || "-"}</td>
                          <td>{s.faculty || "-"}</td>
                          <td>{s.position || "-"}</td>
                          <td>
                            {s.start_date
                              ? `${new Date(
                                  s.start_date
                                ).toLocaleDateString("th-TH")} - ${
                                  s.end_date
                                    ? new Date(
                                        s.end_date
                                      ).toLocaleDateString("th-TH")
                                    : "-"
                                }`
                              : "-"}
                          </td>
                          <td>{s.status || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>

        <style jsx>{`
          .main {
            background: #f7f8fa;
            min-height: 100vh;
          }
          .content-wrapper {
            max-width: 1000px;
            margin: 0 auto;
            padding: 24px;
            font-family: "Kanit", sans-serif;
          }
          .card {
            background: #fff;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }
          h2 {
            font-size: 1.2rem;
            font-weight: 600;
            color: #026b45;
            margin-bottom: 16px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 10px;
          }
          .info-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.95rem;
          }
          .info-table th {
            background: #2f3337;
            color: #fff;
            text-align: center;
            padding: 10px;
          }
          .info-table td {
            border-bottom: 1px solid #eee;
            text-align: center;
            padding: 8px;
          }
          .link {
            color: #028a58;
            text-decoration: underline;
          }
        `}</style>
      </main>
    </div>
  );
}
