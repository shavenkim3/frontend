"use client";

export default function InternshipForm() {
  return (
    <div className="form-section">
      <h3>ข้อมูลการฝึก</h3>
      <div className="form-grid">
        {/* ===== ตำแหน่งฝึกงาน ===== */}
        <div className="form-group full">
          <label>
            ตำแหน่งที่ฝึกงาน <span className="required">*</span>
          </label>
          <input type="text" placeholder="เช่น Frontend Developer" />
        </div>

        {/* ===== วันที่เริ่มและสิ้นสุด ===== */}
        <div className="form-group-row">
          <div className="form-group">
            <label>
              วันที่เริ่มฝึกงาน <span className="required">*</span>
            </label>
            <input type="date" />
          </div>
          <div className="form-group">
            <label>
              วันที่สิ้นสุดฝึกงาน <span className="required">*</span>
            </label>
            <input type="date" />
          </div>
        </div>

        {/* ===== รวมวันทำงาน ===== */}
        <div className="form-group full">
          <label>
            มาทำงานรวม (ไม่นับวันหยุด) <span className="required">*</span>
          </label>
          <input type="number" placeholder="เช่น 180 วัน" />
        </div>

        {/* ===== ลาหยุด / ลาป่วย / ขาดงาน ===== */}
        <div className="form-group-triple">
          <div className="form-group">
            <label>
              ลาหยุด <span className="required">*</span>
            </label>
            <input type="number" placeholder="จำนวนครั้ง" />
          </div>
          <div className="form-group">
            <label>
              ลาป่วย <span className="required">*</span>
            </label>
            <input type="number" placeholder="จำนวนครั้ง" />
          </div>
          <div className="form-group">
            <label>
              ขาดงาน <span className="required">*</span>
            </label>
            <input type="number" placeholder="จำนวนครั้ง" />
          </div>
        </div>

        {/* ===== วันที่มาทำงานทั้งหมดรวม ===== */}
        <div className="form-group full">
          <label>
            วันที่มาทำงานทั้งหมดรวม <span className="required">*</span>
          </label>
          <input type="number" placeholder="เช่น 6 วัน" />
        </div>

        {/* ===== รายละเอียดเพิ่มเติม ===== */}
        <div className="form-group full">
          <label>รายละเอียดเพิ่มเติม</label>
          <textarea placeholder="รายละเอียดเพิ่มเติม (ถ้ามี)"></textarea>
        </div>
      </div>

      {/* ===== STYLES ===== */}
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

        /* === วันที่เริ่ม-สิ้นสุด === */
        .form-group-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          grid-column: 1 / -1;
        }

        /* === ลาหยุด / ลาป่วย / ขาดงาน === */
        .form-group-triple {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          grid-column: 1 / -1;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .form-group-row,
          .form-group-triple {
            grid-template-columns: 1fr; /* ✅ ซ้อนลงเมื่อจอเล็ก */
          }
        }

        label {
          font-weight: 600;
          color: #374151;
          font-size: 15px;
          margin-bottom: 6px;
        }

        /* ✅ สีแดงสำหรับเครื่องหมาย * */
        .required {
          color: #dc2626; /* red-600 */
          margin-left: 3px;
        }

        input,
        textarea {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 15px;
          background: #ffffff;
          font-family: "Kanit", sans-serif;
        }

        textarea {
          resize: none;
          height: 90px;
        }

        input:focus,
        textarea:focus {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
          outline: none;
        }
      `}</style>
    </div>
  );
}
