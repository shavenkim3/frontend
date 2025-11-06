"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronDown,
  Pencil,
  Trash2,
  PlusCircle,
  X,
  ExternalLink,
  Loader2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/** helper: แปลงวันที่ */
const formatDate = (dateStr) => {
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
};

/** helper: แสดง domain ของเว็บ */
const extractDomain = (url) => {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

export default function AdminAnnouncements() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /** โหลดข่าวจาก backend */
  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/admin/news/all`);
      if (!res.ok) throw new Error("โหลดข่าวไม่สำเร็จ");
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const toggleExpand = (id) => setExpanded(expanded === id ? null : id);

  /** ฟังก์ชันเพิ่ม */
  const handleAdd = () => router.push("/admin/news/add");

  /** ฟังก์ชันแก้ไข */
  const handleEdit = (id) => router.push(`/admin/news/edit/${id}`);

  /** ฟังก์ชันลบ */
  const handleDelete = async (id) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข่าวนี้?")) return;
    try {
      const res = await fetch(`${API_URL}/admin/news/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("ลบข่าวไม่สำเร็จ");
      setAnnouncements((prev) => prev.filter((n) => n.news_id !== id));
      alert("ลบข่าวสำเร็จ");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return (
      <div className="p-4 flex items-center gap-2 text-gray-500">
        <Loader2 className="animate-spin" /> กำลังโหลดข่าว...
      </div>
    );

  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <section className="admin-announcements">
      {/* ปุ่มเพิ่ม */}
      <div className="header-bar">
        <button className="add-btn" onClick={handleAdd}>
          <PlusCircle size={20} />
          เพิ่มข่าวใหม่
        </button>
      </div>

      {announcements.map((item) => {
        const id = item.news_id;
        const startDate = formatDate(item.start_date);
        const endDate = formatDate(item.end_date);
        const created = formatDate(item.created_at);

        return (
          <div key={id} className="news-card">
            {/* Header ของแต่ละข่าว */}
            <div className="news-card-header">
              <div
                className="left"
                onClick={() => toggleExpand(id)}
                style={{ cursor: "pointer" }}
              >
                <strong>{item.title}</strong>
                <div className="date-range">
                  {startDate} - {endDate}
                </div>
              </div>

              <div className="actions-top">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(item.news_id)}
                  title="แก้ไข"
                >
                  <Pencil size={18} />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.news_id)}
                  title="ลบ"
                >
                  <Trash2 size={18} />
                </button>
                {expanded === id ? (
                  <ChevronDown size={20} color="#03a96b" onClick={() => toggleExpand(id)} />
                ) : (
                  <ChevronRight size={20} color="#03a96b" onClick={() => toggleExpand(id)} />
                )}
              </div>
            </div>

            {/* เนื้อหาข่าว */}
            <div
              className={`news-card-body ${
                expanded === id ? "expanded" : ""
              }`}
            >
              <p>
                <strong>วันที่:</strong> {startDate} - {endDate}
              </p>
              <p>
                <strong>ช่วงเวลา:</strong>{" "}
                {item.is_all_day
                  ? "ตลอดวัน"
                  : `${item.start_time?.slice(0, 5)} - ${item.end_time?.slice(
                      0,
                      5
                    )} น.`}
              </p>

              <div
                dangerouslySetInnerHTML={{ __html: item.content }}
                style={{ margin: "8px 0" }}
              />

              {item.link_main && (
                <p>
                  <strong>ลิงก์:</strong>{" "}
                  <a
                    href={item.link_main}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#03a96b] underline"
                  >
                    <ExternalLink size={14} />
                    {extractDomain(item.link_main)}
                  </a>
                </p>
              )}

              {item.note && (
                <p>
                  <strong>หมายเหตุ:</strong> {item.note}
                </p>
              )}

              <p className="published">เผยแพร่เมื่อ: {created}</p>
            </div>
          </div>
        );
      })}

      {/* ===== CSS ===== */}
      <style jsx>{`
        .admin-announcements {
          padding: 24px 28px 40px;
          font-family: "Kanit", sans-serif;
        }

        .header-bar {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-bottom: 16px;
        }

        .add-btn {
          background: #03a96b;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .news-card {
          background: #fff;
          border-radius: 8px;
          margin-bottom: 16px;
          border: 1px solid #e0e0e0;
          overflow: hidden;
          transition: box-shadow 0.2s ease;
        }

        .news-card:hover {
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .news-card-header {
          border-top: 5px solid #03a96b;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 18px;
          background: #fff;
        }

        .date-range {
          color: #03a96b;
          font-size: 0.95rem;
        }

        .actions-top {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .edit-btn,
        .delete-btn {
          border: none;
          background: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .edit-btn {
          color: #03a96b;
        }

        .edit-btn:hover {
          color: #028c5e;
        }

        .delete-btn {
          color: #e53935;
        }

        .delete-btn:hover {
          color: #c62828;
        }

        .news-card-body {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          background-color: #fafafa;
          padding: 0 20px;
          transition: all 0.3s ease;
          border-top: 1px solid #eee;
        }

        .news-card-body.expanded {
          max-height: 420px;
          opacity: 1;
          padding: 14px 20px 18px;
        }

        .published {
          color: #777;
          font-size: 0.9rem;
          margin-top: 6px;
        }
      `}</style>
    </section>
  );
}
