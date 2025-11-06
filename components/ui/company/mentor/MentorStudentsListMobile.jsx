"use client";
import { ClipboardCheck } from "lucide-react";

export default function MentorStudentsListMobile({ rows = [], onEvaluate }) {
  return (
    <>
      <style jsx>{`
        .rs-list { display:grid; gap:12px; }
        .rs-card {
          background:#fff; border:1px solid #e5e7eb; border-radius:14px;
          padding:12px 14px; box-shadow:0 1px 2px rgba(0,0,0,.04);
        }
        .rs-title { font-weight:700; color:#111827; margin-bottom:6px; }
        .rs-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px 12px; }
        .rs-item { display:grid; grid-template-columns:96px 1fr; gap:8px; align-items:start; }
        .rs-label { color:#6b7280; font-size:12.5px; }
        .rs-value { color:#111827; font-size:13.5px; font-weight:600; }
        .status-pill {
          display:inline-flex; align-items:center; justify-content:center;
          min-width:100px; height:34px; border-radius:999px;
          background:#16a34a; color:#fff; font-weight:800; font-size:13px;
        }
        .rs-footer { display:flex; justify-content:flex-end; margin-top:10px; }
        .icon-btn {
          height:36px; width:36px; display:inline-grid; place-items:center;
          border-radius:999px; border:1px solid #dfe3e6;
          background:#fff; color:#0f766e; cursor:pointer;
        }
        .icon-btn:hover { background:#f8fafc; }
        @media (max-width:560px){
          .rs-grid{ grid-template-columns:1fr; }
          .rs-item{ grid-template-columns:1fr; }
        }
      `}</style>

      <div className="rs-list">
        {rows.map((r, i) => (
          <div className="rs-card" key={i}>
            <div className="rs-title">{r.name}</div>
            <div className="rs-grid">
              <div className="rs-item">
                <div className="rs-label">รหัสนิสิต</div>
                <div className="rs-value">{r.id}</div>
              </div>
              <div className="rs-item">
                <div className="rs-label">ภาค</div>
                <div className="rs-value">{r.dept}</div>
              </div>
              <div className="rs-item">
                <div className="rs-label">สถานะ</div>
                <div className="rs-value">
                  <span className="status-pill">{r.result}</span>
                </div>
              </div>
            </div>

            <div className="rs-footer">
              <button
                className="icon-btn"
                onClick={() => onEvaluate?.(r)}
                title="ประเมินนิสิต"
              >
                <ClipboardCheck size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
