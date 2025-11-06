"use client";

import React, { useState } from "react";
import { FileText, Download, CheckCircle2, XCircle } from "lucide-react";

export default function DownloadFileSection() {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const FILES = [
    {
      id: 1,
      name: "รายงานปัญหาพิเศษ (SpecialProblemReport).pdf",
      size: "2.4 MB",
      type: "PDF",
      date: "28 ตุลาคม 2568",
    },
    {
      id: 2,
      name: "แบบฟอร์มขอสอบปัญหาพิเศษ.docx",
      size: "1.1 MB",
      type: "DOCX",
      date: "15 ตุลาคม 2568",
    },
  ];

  const startDownload = () => {
    setDownloading(true);
    setCompleted(false);
    setCancelled(false);
    setProgress(0);

    const step = 5;
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + step;
        if (next >= 100) {
          clearInterval(interval);
          setDownloading(false);
          setCompleted(true);
        }
        return next;
      });
    }, 150);

    window.cancelDownload = () => {
      clearInterval(interval);
      setDownloading(false);
      setCancelled(true);
      setProgress(0);
    };
  };

  return (
    <section className="download-section">
      <div className="download-card">
        <h2 className="download-title">ดาวน์โหลดไฟล์โครงงาน</h2>
        <p className="download-desc">
          คุณสามารถดาวน์โหลดไฟล์รายงาน หรือเอกสารที่เกี่ยวข้องกับปัญหาพิเศษของคุณได้ที่นี่
        </p>

        <div className="file-list">
          {FILES.map((file) => (
            <div className="file-item" key={file.id}>
              <div className="file-icon">
                <FileText size={26} color="#03a96b" />
              </div>
              <div className="file-info">
                <div className="file-name">{file.name}</div>
                <div className="file-meta">
                  <span>{file.type}</span> • <span>{file.size}</span> •{" "}
                  <span>{file.date}</span>
                </div>
              </div>
              <button
                className="download-btn"
                onClick={startDownload}
                disabled={downloading}
              >
                <Download size={18} />
                <span>ดาวน์โหลด</span>
              </button>
            </div>
          ))}
        </div>

        {/* Progress */}
        {downloading && (
          <div className="progress-box">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="progress-info">
              <span>{progress}%</span>
              <button
                className="cancel-btn"
                onClick={() => window.cancelDownload?.()}
              >
                <XCircle size={16} />
                <span>ยกเลิก</span>
              </button>
            </div>
          </div>
        )}

        {completed && (
          <div className="download-success">
            <CheckCircle2 size={20} color="#03a96b" />
            <span>ดาวน์โหลดสำเร็จ!</span>
          </div>
        )}

        {cancelled && (
          <div className="download-cancel">
            <XCircle size={20} color="#d9534f" />
            <span>ยกเลิกการดาวน์โหลดแล้ว</span>
          </div>
        )}
      </div>

      {/* ✅ CSS */}
      <style jsx>{`
        * {
          box-sizing: border-box;
          font-family: "Kanit", sans-serif !important;
        }

        .download-section {
          display: flex;
          justify-content: center;
          padding: 50px 20px 70px;
          background: #fff;
        }

        .download-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          padding: 40px 40px 32px;
          width: 100%;
          max-width: 1600px;
        }

        .download-title {
          color: #03a96b;
          font-weight: 600;
          font-size: 1.3rem;
          margin-bottom: 8px;
        }

        .download-desc {
          color: #666;
          font-size: 0.95rem;
          margin-bottom: 32px;
        }

        /* รายการไฟล์ */
        .file-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fcfefc;
          border: 1px solid #d9f4e3;
          border-radius: 10px;
          padding: 20px 26px;
          transition: background 0.3s ease, border-color 0.3s ease;
        }

        .file-item:hover {
          background: #f5fff9;
          border-color: #03a96b;
        }

        .file-info {
          flex: 1;
          margin-left: 12px;
        }

        .file-name {
          font-weight: 600;
          font-size: 1rem;
          color: #222;
          margin-bottom: 4px;
        }

        .file-meta {
          font-size: 0.85rem;
          color: #777;
        }

        /* ปุ่มดาวน์โหลด */
        .download-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #03a96b;
          border: none;
          color: white;
          border-radius: 8px;
          padding: 10px 20px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.25s;
          min-width: 130px;
          justify-content: center;
        }

        .download-btn:hover {
          background: #02955f;
        }

        .download-btn:disabled {
          background: #b8e0cc;
          cursor: not-allowed;
        }

        /* Progress */
        .progress-box {
          margin-top: 26px;
        }

        .progress-bar {
          width: 100%;
          height: 10px;
          background: #eaf7f1;
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #03a96b;
          width: 0%;
          transition: width 0.1s linear;
        }

        .progress-info {
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cancel-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #ffecec;
          color: #c0392b;
          border: 1px solid #ffcccc;
          border-radius: 8px;
          padding: 6px 12px;
          font-weight: 500;
          cursor: pointer;
        }

        .cancel-btn:hover {
          background: #ffdede;
        }

        .download-success,
        .download-cancel {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 18px;
          font-weight: 500;
        }

        .download-success {
          color: #03a96b;
        }

        .download-cancel {
          color: #d9534f;
        }
      `}</style>
    </section>
  );
}