"use client";

import { useState, useMemo, useEffect } from "react";

export default function StudentFormWithProject() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  // ✅ ดึง token จาก localStorage
  const getToken = () => {
    if (typeof window === "undefined") return "";
    return (
      localStorage.getItem("student_token") ||
      localStorage.getItem("token") ||
      ""
    );
  };

  const [form, setForm] = useState({
    prefix: "",
    student_id: "",
    phone: "",
    first_name: "",
    last_name: "",
    department: "เทคโนโลยีสารสนเทศ",
    program_type: "",
    email: "",
    advisor_name: "",
  });

  const [projectForm, setProjectForm] = useState({
    project_name: "",
    detail: "",
  });

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const advisors = useMemo(
    () => [
      "อาจารย์ สุริยะ พินิจการ",
      "อาจารย์ ปัญญาพร ปรางจโรจน์",
      "อาจารย์ กนิษฐา ตั้งไทยขวัญ",
      "อาจารย์ สกาวรัตน์ จังพัฒนาการ",
      "อาจารย์ ธีรนันต์ ธนาวัฒน์ภูวพัน",
    ],
    []
  );

  const onChange = (key) => (e) => {
    const v = e?.target?.value ?? e;
    setForm((s) => ({ ...s, [key]: v }));
  };

  const handleChangeProject = (key) => (e) => {
    setProjectForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  // ✅ โหลดข้อมูลของนิสิตที่ login
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setErr("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
      setLoading(false);
      return;
    }

    // ดึงข้อมูลนิสิต + โครงงานที่ผูกกับ token
    fetch(`${API_URL}/api/student/project/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.error) {
          setErr(data.error || "ไม่สามารถโหลดข้อมูลได้");
          return;
        }
        // ✅ อัปเดตข้อมูลนิสิต
        setForm((s) => ({
          ...s,
          student_id: data.student_id || "",
          prefix: data.prefix || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          phone: data.phone || "",
          department: data.department || "เทคโนโลยีสารสนเทศ",
          program_type: data.program_type || "",
          email: data.email || "",
          advisor_name: data.advisor_name || "",
        }));
        // ✅ อัปเดตข้อมูลโครงงาน
        setProjectForm({
          project_name: data.project_name || "",
          detail: data.detail || "",
        });
      })
      .catch((err) => {
        console.error("load error:", err);
        setErr("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      })
      .finally(() => setLoading(false));
  }, []);

  const validate = () => {
    if (!form.prefix) return "กรุณาเลือกคำนำหน้า";
    if (!form.first_name?.trim()) return "กรุณากรอกชื่อจริง";
    if (!form.last_name?.trim()) return "กรุณากรอกนามสกุล";
    if (!form.phone?.trim()) return "กรุณากรอกเบอร์โทรศัพท์";
    if (!form.email?.trim()) return "กรุณากรอกอีเมล";
    if (!form.program_type) return "กรุณาเลือกภาค";
    if (!form.department?.trim()) return "กรุณากรอกภาควิชา";
    if (!form.advisor_name) return "กรุณาเลือกอาจารย์ที่ปรึกษา";
    if (!projectForm.project_name?.trim()) return "กรุณากรอกชื่อโครงงาน";
    return "";
  };

  // ✅ บันทึกข้อมูล (ของนิสิตที่ login)
  const handleSaveAll = async () => {
    const v = validate();
    if (v) {
      setErr(v);
      setMsg("");
      return;
    }

    setSaving(true);
    setErr("");
    setMsg("");
    const token = getToken();

    try {
      const res = await fetch(`${API_URL}/api/student/project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          ...projectForm,
          reg_type: "project",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "บันทึกไม่สำเร็จ");

      setMsg("✅ บันทึกข้อมูลโครงงานเรียบร้อยแล้ว!");
    } catch (e) {
      console.error("save error:", e);
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-center">กำลังโหลดข้อมูล...</p>;
  
  return (
    <>
      <div className="form-wrapper">
        {/* ====================== ข้อมูลนิสิต ====================== */}
        <section className="form-card">
          <div className="form-header">ข้อมูลส่วนตัวนิสิต</div>
          <div className="form-body">
            <div className="form-row full">
              <label>
                คำนำหน้า <span className="required">*</span>
              </label>
              <div className="prefix-wrap">
                {["นาย", "นางสาว"].map((p) => (
                  <label key={p} className="radio-item">
                    <input
                      type="radio"
                      name="prefix"
                      value={p}
                      checked={form.prefix === p}
                      onChange={() => onChange("prefix")(p)}
                    />
                    <span>{p}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>
                  รหัสนิสิต <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={form.student_id}
                  onChange={onChange("student_id")}
                />
              </div>
              <div>
                <label>
                  เบอร์โทรศัพท์ <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={onChange("phone")}
                />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>
                  ชื่อ <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={onChange("first_name")}
                />
              </div>
              <div>
                <label>
                  นามสกุล <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={onChange("last_name")}
                />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>
                  ภาควิชา <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={form.department}
                  onChange={onChange("department")}
                />
              </div>
              <div>
                <label>
                  ภาค <span className="required">*</span>
                </label>
                <select value={form.program_type} onChange={onChange("program_type")}>
                  <option value="">-- เลือกภาค --</option>
                  <option value="ปกติ">ภาคปกติ</option>
                  <option value="พิเศษ">ภาคพิเศษ</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>
                  อีเมล <span className="required">*</span>
                </label>
                <input type="email" value={form.email} onChange={onChange("email")} />
              </div>
              <div>
                <label>
                  อาจารย์ที่ปรึกษา <span className="required">*</span>
                </label>
                <select value={form.advisor_name} onChange={onChange("advisor_name")}>
                  <option value="">-- เลือกอาจารย์ที่ปรึกษา --</option>
                  {advisors.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* ====================== ข้อมูลโครงงาน ====================== */}
        <section className="form-card">
          <div className="form-header">ข้อมูลโครงงานปัญหาพิเศษ</div>
          <div className="form-body">
            <div className="form-group">
              <label>
                หัวข้อโครงงาน <span className="required">*</span>
              </label>
              <input
                type="text"
                value={projectForm.project_name}
                onChange={handleChangeProject("project_name")}
                required
              />
            </div>

            <div className="form-group">
              <label>รายละเอียดเพิ่มเติม</label>
              <textarea
                value={projectForm.detail}
                onChange={handleChangeProject("detail")}
              />
            </div>
          </div>
        </section>

        {err && <div className="alert-error">{err}</div>}
        {msg && <div className="alert-success">{msg}</div>}

        <div className="actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.history.back()}
            disabled={saving}
          >
            ย้อนกลับ
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSaveAll}
            disabled={saving}
          >
            {saving ? "กำลังบันทึก..." : "ดำเนินการต่อ"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .form-wrapper {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 40px;
        }

        @media (max-width: 768px) {
          .form-wrapper {
            padding: 0 16px;
          }
        }

        .form-card {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          margin-bottom: 40px;
        }
        .form-header {
          background: #03a96b;
          color: #fff;
          padding: 14px 16px;
          border-radius: 10px 10px 0 0;
          font-weight: 600;
          font-size: 1.05rem;
        }
        .form-body {
          padding: 26px 30px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 20px;
        }
        .form-group {
          margin-bottom: 22px;
        }
        .full {
          grid-column: 1 / -1;
        }
        label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .required {
          color: red;
        }
        input,
        select,
        textarea {
          width: 100%;
          padding: 11px 13px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 1rem;
        }
        textarea {
          resize: vertical;
          min-height: 100px;
        }
        .prefix-wrap {
          display: flex;
          gap: 26px;
          margin-top: 4px;
        }
        .radio-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .alert-error {
          background: #ffe6e6;
          color: #b30000;
          border: 1px solid #ffb3b3;
          padding: 8px 12px;
          border-radius: 6px;
          margin-bottom: 12px;
        }
        .alert-success {
          background: #e6ffef;
          color: #0f7a49;
          border: 1px solid #b0f1cd;
          padding: 8px 12px;
          border-radius: 6px;
          margin-bottom: 12px;
        }
        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 14px;
          margin-top: 24px;
        }
        .btn {
          padding: 11px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }
        .btn-primary {
          background: #03a96b;
          color: #fff;
        }
        .btn-secondary {
          background: #e5e7eb;
          color: #111;
        }
        .btn-secondary:hover {
          background: #d1d5db;
        }

        /* ✅ Responsive: จอ ≤ 500px ให้เรียงช่องเป็นบรรทัดเดียว */
        @media (max-width: 500px) {
          .form-row {
            grid-template-columns: 1fr !important;
            gap: 16px;
          }

          .form-body {
            padding: 20px;
          }

          .btn {
            width: 100%;
          }

          .actions {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </>
  );
}