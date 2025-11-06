"use client";

export default function CompanyInfoForm() {
  return (
    <div className="form-section">
      <div className="form-grid">
        {/* ===== ชื่อบริษัท ===== */}
        <div className="form-group full">
          <label>
            ชื่อบริษัท <span className="required">*</span>
          </label>
          <input type="text" placeholder="บริษัท เอ บี ซี" />
        </div>

        {/* ===== เว็บไซต์บริษัท ===== */}
        <div className="form-group full">
          <label>เว็บไซต์บริษัท</label>
          <input type="text" placeholder="http://" />
        </div>

        {/* ===== อีเมล / เบอร์โทร ===== */}
        <div className="form-group">
          <label>
            อีเมลบริษัท <span className="required">*</span>
          </label>
          <input type="email" placeholder="info@company.co.th" />
        </div>

        <div className="form-group">
          <label>
            เบอร์โทรศัพท์ <span className="required">*</span>
          </label>
          <input type="text" placeholder="02-123-4567" />
        </div>

        {/* ===== มือถือ / ผู้ประสานงาน ===== */}
        <div className="form-group">
          <label>
            เบอร์มือถือ <span className="required">*</span>
          </label>
          <input type="text" placeholder="080-000-0000" />
        </div>

        <div className="form-group">
          <label>
            ผู้ประสานงาน <span className="required">*</span>
          </label>
          <input type="text" placeholder="คุณ สมชาย ใจดี" />
        </div>
      </div>

      {/* ===== STYLE ===== */}
      <style jsx>{`
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full {
          grid-column: 1 / -1;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        label {
          font-weight: 600;
          color: #374151;
          font-size: 15px;
          margin-bottom: 6px;
        }

        /* ✅ ทำให้ * เป็นสีแดง */
        .required {
          color: #dc2626; /* red-600 */
          margin-left: 3px;
        }

        input {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 15px;
          background: #ffffff;
          font-family: "Kanit", sans-serif;
        }

        input:focus {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
          outline: none;
        }
      `}</style>
    </div>
  );
}
