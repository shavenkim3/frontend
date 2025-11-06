"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, FileText, AlertTriangle, XCircle } from "lucide-react";

export default function StudentUploadBox() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const timerRef = useRef(null);

  const MAX_FILE_SIZE_MB = 10;
  const ALLOWED_EXTENSIONS = ["csv"];
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const resetState = () => {
    setIsUploading(false);
    setProgress(0);
    setUploaded(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setErrorMessage("อนุญาตเฉพาะไฟล์ .csv เท่านั้น");
      setSelectedFile(null);
      resetState();
      return;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_FILE_SIZE_MB) {
      setErrorMessage(`ไฟล์มีขนาดเกิน ${MAX_FILE_SIZE_MB} MB`);
      setSelectedFile(null);
      resetState();
      return;
    }

    setSelectedFile(file);
    setUploaded(false);
    setErrorMessage("");
    resetState();
  };

  /** ✅ ฟังก์ชันอัปโหลดเชื่อม backend จริง */
  const handleUpload = async () => {
    if (!selectedFile || errorMessage) return;

    setIsUploading(true);
    setUploaded(false);
    setProgress(0);
    setErrorMessage("");

    const token =
      localStorage.getItem("admin_token") || localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API_URL}/api/students/upload-csv`);
        if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploaded(true);
            resolve(xhr.responseText);
          } else {
            reject(new Error(xhr.responseText || `Upload failed (${xhr.status})`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(formData);
      });
    } catch (err) {
      console.error("Upload failed:", err);
      setErrorMessage(err.message || "อัปโหลดไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsUploading(false);
    setProgress(0);
    setUploaded(false);
  };

  return (
    <section className="upload-section">
      <div className="upload-card">
        <h2 className="upload-title">อัปโหลดไฟล์โครงงาน</h2>
        <p className="upload-desc">
          กรุณาอัปโหลดไฟล์ <strong>CSV</strong> ระบบจัดการข้อมูลปัญหาพิเศษและสหกิจศึกษา
          (ขนาดไม่เกิน {MAX_FILE_SIZE_MB} MB)
        </p>

        {/* กล่องอัปโหลด */}
        <div className="upload-box">
          <label htmlFor="file-upload" className="upload-label" style={{ cursor: isUploading ? "not-allowed" : "pointer" }}>
            <UploadCloud size={44} color="#03a96b" />
            <p>
              {selectedFile
                ? selectedFile.name
                : "ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์"}
            </p>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              hidden
              disabled={isUploading}
            />
          </label>
        </div>

        {errorMessage && (
          <div className="error-box">
            <AlertTriangle size={18} color="#d9534f" />
            <span>{errorMessage}</span>
          </div>
        )}

        {selectedFile && !uploaded && !errorMessage && !isUploading && (
          <div className="file-preview">
            <FileText size={18} color="#333" />
            <span>{selectedFile.name}</span>
          </div>
        )}

        {isUploading && (
          <div className="progress-wrapper">
            <div className="progress-row">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="progress-percent">{progress}%</div>
            </div>
            <button className="cancel-btn" onClick={handleCancel} type="button">
              <XCircle size={16} />
              <span>ยกเลิก</span>
            </button>
          </div>
        )}

        {uploaded && (
          <div className="upload-success">
            <CheckCircle2 size={20} color="#03a96b" />
            <span>อัปโหลดสำเร็จ!</span>
          </div>
        )}

        <div className="actions">
          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={!selectedFile || !!errorMessage || isUploading || uploaded}
          >
            {uploaded
              ? "อัปโหลดแล้ว"
              : isUploading
              ? `กำลังอัปโหลด... ${progress}%`
              : "อัปโหลดไฟล์"}
          </button>
        </div>
      </div>

      {/* Styles คงเดิม */}
      <style jsx>{`
        .upload-section {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 50px 20px 70px;
          background: #fff;
        }
        .upload-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          padding: 40px 40px 32px;
          width: 100%;
          max-width: 720px;
          text-align: center;
        }
        .upload-title {
          color: #03a96b;
          font-weight: 600;
          font-size: 1.3rem;
          margin-bottom: 6px;
        }
        .upload-desc {
          color: #666;
          font-size: 0.95rem;
          margin-bottom: 24px;
        }
        .upload-box {
          border: 2px dashed #03a96b;
          border-radius: 14px;
          padding: 60px 20px;
          background: #f9fefb;
          transition: 0.3s;
        }
        .upload-box:hover {
          background: #edfff4;
        }
        .upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #444;
          gap: 10px;
        }
        .file-preview {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
          font-size: 0.9rem;
          color: #333;
        }
        .upload-success {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
          color: #03a96b;
          font-weight: 500;
        }
        .error-box {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 16px;
          color: #d9534f;
          font-weight: 500;
        }
        .actions {
          margin-top: 28px;
        }
        .upload-btn {
          background: #03a96b;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 12px 26px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
          font-size: 1rem;
        }
        .upload-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .upload-btn:hover:not(:disabled) {
          background: #02965f;
        }
        .progress-wrapper {
          margin-top: 18px;
        }
        .progress-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }
        .progress-bar {
          flex: 1;
          height: 10px;
          background: #eaf7f1;
          border-radius: 999px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: #03a96b;
          width: 0%;
          transition: width 0.12s linear;
        }
        .progress-percent {
          min-width: 48px;
          text-align: right;
          font-weight: 600;
          color: #333;
        }
        .cancel-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffecec;
          color: #c0392b;
          border: 1px solid #ffcccc;
          border-radius: 8px;
          padding: 8px 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .cancel-btn:hover {
          background: #ffdede;
        }
      `}</style>
    </section>
  );
}
