"use client";
import { ClipboardCheck } from "lucide-react";

export default function MentorStudentsTableDesktop({ rows = [], onEvaluate }) {
  return (
    <>
      <style jsx>{`
        .tbl-wrap { background:#fff; border-radius:12px; overflow:hidden; border:1px solid #e5e7eb; }
        table { width:100%; border-collapse:collapse; }
        thead th {
          background:#2f3337; color:#fff; text-align:center;
          font-weight:700; font-size:14px; padding:12px 16px;
        }
        tbody tr + tr td { border-top:1px solid #efefef; }
        tbody td {
          padding:14px 16px; font-size:14px; color:#111827;
          text-align:center; background:#fff;
        }
        .status-pill {
          display:inline-flex; align-items:center; justify-content:center;
          min-width:100px; height:36px; border-radius:999px;
          background:#16a34a; color:#fff; font-weight:800; font-size:13.5px;
        }
        .icon-btn {
          height:36px; width:36px; display:inline-grid; place-items:center;
          border-radius:999px; border:1px solid #dfe3e6; background:#fff;
          color:#0f766e; cursor:pointer; transition:background .15s, transform .05s;
        }
        .icon-btn:hover { background:#f8fafc; }
        .icon-btn:active { transform:scale(.96); }
      `}</style>

      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>รหัสนิสิต</th>
              <th>ชื่อ – นามสกุล</th>
              <th>ภาค</th>
              <th>สถานะ</th>
              <th>ดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((r, i) => (
                <tr key={i}>
                  <td>{r.id}</td>
                  <td>{r.name}</td>
                  <td>{r.dept}</td>
                  <td>
                    <span className="status-pill">{r.result}</span>
                  </td>
                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => onEvaluate?.(r)}
                      title="ประเมินนิสิต"
                    >
                      <ClipboardCheck size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ color: "#777", padding: "20px" }}>
                  ❌ ไม่พบนิสิตที่ตรงกับคำค้นหา
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
