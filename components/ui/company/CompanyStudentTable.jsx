"use client";

import { Eye, ClipboardCheck } from "lucide-react";

export default function CompanyStudentTable({ students, router }) {
  /* ✅ ฟังก์ชันเลือกสี badge */
  const getStatusColor = (status) => {
    if (status === "ปัญหาพิเศษ") return "#3b82f6"; // ฟ้าน้ำเงิน
    if (status === "สหกิจ") return "#f59e0b"; // ส้มทอง
    return "#9ca3af";
  };

  const getResultColor = (result) => {
    if (result === "ตรวจเอกสาร") return "#facc15"; // เหลืองทอง
    if (result === "เสร็จสมบูรณ์") return "#16a34a"; // เขียว
    return "#9ca3af";
  };

  return (
    <div>
      <style jsx>{`
        table {
          width: 100%;
          border-collapse: collapse;
          font-family: "Kanit", sans-serif;
          font-size: 1rem;
        }

        thead {
          background: #2f3337;
          color: white;
          border-bottom: 4px solid #16a34a;
        }

        th,
        td {
          text-align: center;
          vertical-align: middle;
          padding: 18px 16px;
        }

        tbody tr {
          border-bottom: 4px solid #16a34a;
        }

        tbody tr:hover {
          background: #f0fdf4;
        }

        .badge-status {
          color: white;
          border-radius: 14px;
          font-size: 0.95rem;
          padding: 6px 16px;
          font-weight: 500;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          min-width: 110px;
        }

        .badge-result {
          color: white;
          border-radius: 20px;
          padding: 6px 18px;
          font-size: 0.95rem;
          font-weight: 600;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          min-width: 130px;
        }

        .actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }

        .btn {
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: 50%;
          padding: 8px;
          transition: 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn.evaluate:hover {
          background: #dcfce7;
          color: #16a34a;
        }

        .btn.view:hover {
          background: #dbeafe;
          color: #2563eb;
        }

        .no-result {
          text-align: center;
          padding: 20px;
          color: #777;
        }
      `}</style>

      <table>
        <thead>
          <tr>
            <th>หัวข้อ</th>
            <th>รหัสนิสิต</th>
            <th>ชื่อ – นามสกุล</th>
            <th>ภาค</th>
            <th>อาจารย์</th>
            <th>สถานะ</th>
            <th>ดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((s, i) => (
              <tr key={i}>
                <td>
                  <span
                    className="badge-status"
                    style={{ backgroundColor: getStatusColor(s.status) }}
                  >
                    {s.status}
                  </span>
                </td>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.dept}</td>
                <td>{s.advisor}</td>
                <td>
                  <span
                    className="badge-result"
                    style={{ backgroundColor: getResultColor(s.result) }}
                  >
                    {s.result}
                  </span>
                </td>
                <td className="actions">
                  <button
                    className="btn evaluate"
                    title="ประเมินนิสิต"
                    onClick={() =>
                      router.push(`/company/student_data/evaluate?id=${s.id}`)
                    }
                  >
                    <ClipboardCheck size={18} />
                  </button>

                  <button
                    className="btn view"
                    title="ดูข้อมูล"
                    onClick={() =>
                      router.push(`/company/student_data/view?id=${s.id}`)
                    }
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-result">
                ❌ ไม่พบนิสิตที่ตรงกับคำค้นหา
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
