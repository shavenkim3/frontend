"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, ExternalLink } from "lucide-react";

/** helper: แปลงวันที่เป็นภาษาไทย */
function formatDate(dateStr) {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/** helper: ดึงชื่อ domain จาก URL เช่น https://regis.ku.ac.th/... → regis.ku.ac.th */
function extractDomain(url) {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function Announcements() {
  const [expanded, setExpanded] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(`${API_URL}/admin/news/all`);
        if (!res.ok) throw new Error("โหลดข่าวไม่สำเร็จ");
        const data = await res.json();
        setAnnouncements(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "เกิดข้อผิดพลาดในการโหลดข่าว");
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const toggleExpand = (id) => setExpanded(expanded === id ? null : id);

  if (loading) return <p>กำลังโหลดข่าว...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!announcements.length) return <p>ยังไม่มีข่าวประกาศ</p>;

  return (
    <section className="p-4 font-[Kanit]">
      <h2 className="text-xl font-bold mb-4 text-green-600">ประกาศข่าวสาร</h2>

      {announcements.map((item) => {
        const id = item.news_id;
        const startDate = formatDate(item.start_date);
        const endDate = formatDate(item.end_date);
        const created = formatDate(item.created_at);

        return (
          <div
            key={id}
            className="news-card border border-gray-200 rounded-xl mb-3 shadow-sm overflow-hidden transition hover:shadow-md"
          >
            {/* 🔹 หัวข้อข่าว */}
            <div
              className="flex justify-between items-center bg-gray-50 px-4 py-3 cursor-pointer hover:bg-green-50 transition"
              onClick={() => toggleExpand(id)}
            >
              <div className="flex-1">
                <strong className="text-gray-800 block">{item.title}</strong>
                <div className="text-sm text-gray-500">
                  {startDate} - {endDate}
                </div>
                <div className="text-sm text-gray-700 mt-1 line-clamp-1">
                  {item.content}
                </div>
              </div>
              {expanded === id ? (
                <ChevronDown className="text-green-600" size={20} />
              ) : (
                <ChevronRight className="text-green-600" size={20} />
              )}
            </div>

            {/* 🔹 ส่วนขยาย (รายละเอียดทั้งหมด) */}
            {expanded === id && (
              <div className="bg-white px-5 py-4 text-gray-700 text-sm">
                <div
                  className="mb-2"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
                <p>
                  <strong>วันที่:</strong> {startDate} - {endDate}
                </p>
                {item.is_all_day ? (
                  <p>
                    <strong>ช่วงเวลา:</strong> ทั้งวัน
                  </p>
                ) : (
                  <p>
                    <strong>ช่วงเวลา:</strong>{" "}
                    {item.start_time?.slice(0, 5)} - {item.end_time?.slice(0, 5)}
                  </p>
                )}
                {item.note && (
                  <p>
                    <strong>หมายเหตุ:</strong> {item.note}
                  </p>
                )}
                {/* 🔹 ลิงก์หลัก + แสดงชื่อเว็บ */}
                {item.link_main && (
                  <p className="mt-2">
                    <a
                      href={item.link_main}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline inline-flex items-center gap-1"
                    >
                      <ExternalLink size={14} />
                      {extractDomain(item.link_main)}
                    </a>
                  </p>
                )}
                {/* 🔹 ลิงก์สำรอง (ถ้ามี) */}
                {item.link_alt && (
                  <p>
                    <a
                      href={item.link_alt}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline inline-flex items-center gap-1"
                    >
                      <ExternalLink size={14} />
                      {extractDomain(item.link_alt)}
                    </a>
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-3">
                  เผยแพร่เมื่อ: {created}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
