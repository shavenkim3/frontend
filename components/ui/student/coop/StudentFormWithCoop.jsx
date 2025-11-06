"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";

/** ========= Config ========= */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const ENDPOINTS = {
  meStudent: `${API_URL}/students/me`,          // GET/PUT ข้อมูลส่วนตัว
  meIntern: `${API_URL}/internships/me`,       // GET/POST ข้อมูลฝึกงาน (upsert)
  company: `${API_URL}/api/student-company`,  // GET/POST ข้อมูลบริษัท (load/save endpoint เดียว)
};

// ดึง token จาก localStorage
function getToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("student_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("jwt") ||
    ""
  );
}

// ตัวช่วยเรียก API (แนบ Authorization อัตโนมัติ)
async function apiFetch(url, { method = "GET", body } = {}) {
  const token = getToken();
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: method === "GET" ? undefined : body ? JSON.stringify(body) : undefined,
  });

  const ct = res.headers.get("content-type") || "";
  const isJSON = ct.includes("application/json");
  let data = null;

  if (res.status !== 204) {
    try {
      data = isJSON ? await res.json() : await res.text();
      if (!isJSON && typeof data === "string") data = { text: data };
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

const pick = (obj, keys) =>
  keys.reduce((o, k) => ({ ...o, [k]: obj?.[k] ?? "" }), {});

// helper
const orNull = (v) => {
  const t = typeof v === "string" ? v.trim() : v;
  return t === "" ? null : t;
};

/** ========== คอมโพเนนต์รวม ========== */
const StudentOnboardingCard = forwardRef(function StudentOnboardingCard(
  {
    embedded = false,               // กัน nested form
    companyUrl = ENDPOINTS.company, // ปล่อยให้เปลี่ยนได้
  },
  ref
) {
  /** ---------- STEP 1: ข้อมูลส่วนตัว ---------- */
  const [infoLoading, setInfoLoading] = useState(true);
  const [infoMsg, setInfoMsg] = useState("");
  const [infoErr, setInfoErr] = useState("");
  const [info, setInfo] = useState({
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
  const studentIdLocked = useMemo(() => !!info.student_id, [info.student_id]);

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

  const validateInfo = useCallback(() => {
    if (!info.prefix) return "กรุณาเลือกคำนำหน้า";
    if (!info.student_id?.trim()) return "กรุณากรอกรหัสนิสิต";
    if (!info.first_name?.trim()) return "กรุณากรอกชื่อจริง";
    if (!info.last_name?.trim()) return "กรุณากรอกนามสกุล";
    if (!info.phone?.trim()) return "กรุณากรอกเบอร์โทรศัพท์";
    if (!info.email?.trim()) return "กรุณากรอกอีเมล";
    if (!info.program_type) return "กรุณาเลือกภาค";
    if (!info.department?.trim()) return "กรุณากรอกภาควิชา";
    if (!info.advisor_name) return "กรุณาเลือกอาจารย์ที่ปรึกษา";
    return "";
  }, [info]);

  /** ---------- STEP 2: ข้อมูลฝึกงาน ---------- */
  const [internLoading, setInternLoading] = useState(false);
  const [internMsg, setInternMsg] = useState("");
  const [internErr, setInternErr] = useState("");
  const [intern, setIntern] = useState({
    position: "",
    start_date: "",
    end_date: "",
    intern_note: "",
  });

  const validateIntern = useCallback(() => {
    if (!intern.position.trim()) return "กรุณากรอกตำแหน่งงานที่ต้องการสมัคร";
    if (!intern.start_date) return "กรุณาเลือกวันที่เริ่มฝึกงาน";
    if (!intern.end_date) return "กรุณาเลือกวันที่สิ้นสุดฝึกงาน";
    if (intern.end_date < intern.start_date)
      return "วันที่สิ้นสุดต้องไม่ก่อนวันที่เริ่ม";
    return "";
  }, [intern]);

  /** ---------- STEP 3: ข้อมูลบริษัท ---------- */
  const [compLoading, setCompLoading] = useState(false);
  const [compMsg, setCompMsg] = useState("");
  const [compErr, setCompErr] = useState("");
  const [form, setForm] = useState({
    // company
    company_name: "",
    company_website: "",
    company_email: "",
    company_phone: "",
    company_mobile: "",
    company_note: "",
    // address
    address_type: "",
    address_line1: "",
    address_line2: "",
    province: "",
    district: "",
    subdistrict: "",
    zipcode: "",
    road: "",
    village: "",
    alley: "",
    room: "",
    extra_details: "",
    // mentor
    mentor_first_name: "",
    mentor_last_name: "",
    mentor_email: "",
    mentor_phone: "",
    mobile: "",
    position_title: "",
    notes: "",
  });

  const validateCompany = useCallback(() => {
    if (!form.company_name?.trim()) return "กรุณากรอกชื่อบริษัท";
    if (!form.company_email?.trim()) return "กรุณากรอกอีเมลบริษัท";
    if (!form.company_phone?.trim()) return "กรุณากรอกเบอร์โทรหลัก";
    if (!form.province?.trim()) return "กรุณากรอกจังหวัด";
    if (!form.district?.trim()) return "กรุณากรอกอำเภอ/เขต";
    if (!form.subdistrict?.trim()) return "กรุณากรอกแขวง/ตำบล";
    if (!form.zipcode?.trim()) return "กรุณากรอกรหัสไปรษณีย์";
    if (!form.address_line1?.trim()) return "กรุณากรอกที่อยู่บรรทัดที่ 1";
    if (!form.mentor_first_name?.trim()) return "กรุณากรอกชื่อ Mentor";
    if (!form.mentor_phone?.trim()) return "กรุณากรอกเบอร์ Mentor";
    return "";
  }, [form]);

  // gating
  const infoValid = useMemo(() => validateInfo() === "", [validateInfo]);
  const internValid = useMemo(() => infoValid && validateIntern() === "", [infoValid, validateIntern]);

  const minEndDate = useMemo(() => intern.start_date || undefined, [intern.start_date]);

  /** ---------- โหลด data ตามลำดับ ---------- */
  const loadInfo = useCallback(async () => {
    setInfoLoading(true);
    setInfoErr("");
    setInfoMsg("");
    try {
      const res = await apiFetch(ENDPOINTS.meStudent, { method: "GET" });
      const data = res?.data ?? res ?? null;
      if (!data) {
        setInfo((s) => ({ ...s, department: "เทคโนโลยีสารสนเทศ" }));
      } else {
        setInfo((s) => ({
          ...s,
          ...pick(data, [
            "prefix",
            "student_id",
            "phone",
            "first_name",
            "last_name",
            "department",
            "program_type",
            "email",
            "advisor_name",
          ]),
        }));
      }
    } catch (e) {
      console.error("Load student info failed:", e);
      setInfoErr("ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setInfoLoading(false);
    }
  }, []);

  const loadIntern = useCallback(async () => {
    if (!infoValid) return;
    setInternLoading(true);
    setInternErr("");
    setInternMsg("");
    try {
      const data = await apiFetch(ENDPOINTS.meIntern, { method: "GET" });
      setIntern((prev) => ({
        ...prev,
        position: data?.position || "",
        start_date: data?.start_date?.slice(0, 10) || "",
        end_date: data?.end_date?.slice(0, 10) || "",
        intern_note: data?.intern_note || "",
      }));
    } catch (e) {
      const m = e?.message || "";
      if (!/404|ไม่พบ|not found/i.test(m)) {
        setInternErr(m || "ไม่สามารถดึงข้อมูลการฝึกงาน");
      }
    } finally {
      setInternLoading(false);
    }
  }, [infoValid]);

  const loadCompany = useCallback(async () => {
    if (!internValid) return; // ต้องผ่าน intern ก่อน
    setCompLoading(true);
    setCompErr("");
    setCompMsg("");
    try {
      const resp = await apiFetch(companyUrl, { method: "GET" }); // 200 หรือ 204
      if (!resp) return;
      setForm((s) => ({
        ...s,
        // company
        company_name: resp.company_name || "",
        company_website: resp.company_website || "",
        company_email: resp.company_email || "",
        company_phone: resp.company_phone || "",
        company_mobile: resp.company_mobile || "",
        company_note: resp.company_note || resp.note || "",
        // address
        address_type: resp.address?.address_type || "",
        address_line1: resp.address?.address_line1 || "",
        address_line2: resp.address?.address_line2 || "",
        province: resp.address?.province || "",
        district: resp.address?.district || "",
        subdistrict: resp.address?.subdistrict || "",
        zipcode: resp.address?.zipcode || "",
        road: resp.address?.road || "",
        village: resp.address?.village || "",
        alley: resp.address?.alley || "",
        room: resp.address?.room || "",
        extra_details: resp.address?.extra_details ?? "",
        // mentor
        mentor_first_name: resp.mentor?.first_name || "",
        mentor_last_name: resp.mentor?.last_name || "",
        mentor_email: resp.mentor?.email || "",
        mentor_phone: resp.mentor?.phone || "",
        mentor_mobile: resp.mentor?.mobile ?? "",
        mentor_position_title: resp.mentor?.position_title || "",
        mentor_notes: resp.mentor?.notes || "",
      }));
    } catch (e) {
      const m = e?.message || "";
      if (!/404|ไม่พบ|not found/i.test(m)) {
        setCompErr(m || "โหลดข้อมูลบริษัทไม่สำเร็จ");
      }
    } finally {
      setCompLoading(false);
    }
  }, [companyUrl, internValid]);

  // boot
  useEffect(() => { loadInfo(); }, [loadInfo]);
  useEffect(() => { if (infoValid) loadIntern(); }, [infoValid, loadIntern]);
  useEffect(() => { if (internValid) loadCompany(); }, [internValid, loadCompany]);

  /** ---------- handlers ---------- */
  const onInfoChange = (key) => (e) => {
    const v = e?.target?.value ?? e;
    setInfo((s) => ({ ...s, [key]: v }));
    setInfoMsg("");
    setInfoErr("");
  };
  const onInternChange = (e) => {
    const { name, value } = e.target;
    setIntern((s) => ({ ...s, [name]: value }));
    setInternMsg("");
    setInternErr("");
  };
  const updateCompany = (key) => (e) => {
    setForm((s) => ({ ...s, [key]: e.target.value }));
    setCompMsg("");
    setCompErr("");
  };

  /** ---------- submitAll รวม 3 สเต็ป ---------- */
  const [savingAll, setSavingAll] = useState(false);
  const submitAll = async () => {
    setInfoErr(""); setInternErr(""); setCompErr("");
    setInfoMsg(""); setInternMsg(""); setCompMsg("");

    // step 1 validate
    const e1 = validateInfo();
    if (e1) { setInfoErr(e1); throw new Error(e1); }

    // step 2 validate
    const e2 = validateIntern();
    if (e2) { setInternErr(e2); throw new Error(e2); }

    // step 3 validate
    const e3 = validateCompany();
    if (e3) { setCompErr(e3); throw new Error(e3); }

    setSavingAll(true);
    try {
      // 1) Save info
      const bodyInfo = {
        student_id: info.student_id || null,
        prefix: info.prefix || null,
        first_name: info.first_name || null,
        last_name: info.last_name || null,
        phone: info.phone || null,
        department: info.department || null,
        program_type: info.program_type || null,
        email: info.email || null,
        advisor_name: info.advisor_name || null,
      };
      const resInfo = await apiFetch(ENDPOINTS.meStudent, { method: "PUT", body: bodyInfo });
      const payloadInfo = resInfo?.data ?? resInfo ?? {};
      setInfo((s) => ({
        ...s,
        ...pick(payloadInfo, [
          "prefix", "student_id", "phone", "first_name", "last_name",
          "department", "program_type", "email", "advisor_name",
        ]),
      }));
     

      // 2) Save intern
      await apiFetch(ENDPOINTS.meIntern, {
        method: "POST",
        body: {
          position: intern.position.trim(),
          start_date: intern.start_date,
          end_date: intern.end_date,
          intern_note: intern.intern_note?.trim() || null,
        },
      });


      // 3) Save company
      const payloadCompany = {
        company_name: form.company_name?.trim(),
        company_website: orNull(form.company_website),
        company_email: form.company_email?.trim(),
        company_phone: form.company_phone?.trim(),
        company_mobile: orNull(form.company_mobile),
        company_note: orNull(form.company_note),
        address: {
          address_type: orNull(form.address_type),
          address_line1: orNull(form.address_line1),
          address_line2: orNull(form.address_line2),
          province: form.province?.trim(),
          district: form.district?.trim(),
          subdistrict: form.subdistrict?.trim(),
          zipcode: form.zipcode?.trim(),
          road: orNull(form.road),
          village: orNull(form.village),
          alley: orNull(form.alley),
          room: orNull(form.room),
          extra_details: orNull(form.extra_details),
        },
        mentor: {
          first_name: form.mentor_first_name?.trim(),
          last_name: orNull(form.mentor_last_name),
          email: orNull(form.mentor_email),
          phone: form.mentor_phone?.trim(),
          mobile: orNull(form.mentor_mobile),
          position_title: orNull(form.mentor_position_title),
          notes: orNull(form.mentor_notes),
        },
      };
      await apiFetch(companyUrl, { method: "POST", body: payloadCompany });
      setCompMsg("บันทึกข้อมูลบริษัทสำเร็จ");

      return { ok: true };
    } catch (err) {
      const msg = err?.message || "บันทึกไม่สำเร็จ";
      if (!infoMsg) setInfoErr(msg);
      else if (!internMsg) setInternErr(msg);
      else setCompErr(msg);
      throw err;
    } finally {
      setSavingAll(false);
    }
  };

  useImperativeHandle(ref, () => ({ submitAll }), [submitAll]);

  // ถ้า embedded = true: ใช้ <div> แทน <form>
  const Wrapper = embedded ? "div" : "form";
  const wrapProps = embedded
    ? {}
    : {
      onSubmit: (e) => {
        e.preventDefault();
        submitAll().catch(() => { });
      },
      noValidate: true,
    };

  /** ---------- UI ---------- */
  return (
    <section className="form-card">
      <style jsx>{`
        .steps {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
          margin: 6px 0 16px;
        }
        .step {
          background:#f4f4f5; border:1px solid #e5e7eb; color:#374151;
          border-radius: 10px; padding:10px 12px; font-weight:700; text-align:center;
        }
        .step.active { background:#0c6d68; color:#fff; border-color:#0c6d68; }
        .form-header {
          background: #2ca26e; color: #fff; border-radius: 6px;
          padding: 15px 18px; font-weight: 700; font-size: 1.05rem; margin: 14px 0 16px;
        }
        .row { display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:14px; }
        .full { grid-column: 1 / -1; }
        .form-group { margin:0; }
        label { display:block; font-weight:600; margin-bottom:6px; color:#222; }
        .label-normal { font-weight:400; }
        .required-star { color:#f33; margin-left:4px; }
        input, select, textarea {
          width:100%; padding:10px; border:1px solid #ccc; border-radius:6px; font-size:1rem; background:#fff;
        }
        textarea { min-height: 110px; resize: vertical; }
        .prefix-wrap { display:flex; gap:28px; margin-top:6px; }
        .radio-item { display:inline-flex; flex-direction:column; align-items:center; gap:6px; }
        .note { font-size:0.9rem; color:#555; }
        .actions { display:flex; gap:10px; justify-content:flex-end; margin-top:12px; }
        .btn { padding:10px 14px; border-radius:6px; border:none; cursor:pointer; font-weight:700; }
        .btn-primary { background:#2ca26e; color:#fff; }
        .btn-secondary { background:#ddd; color:#111; }
        .alert { padding:10px 12px; border-radius:6px; margin:10px 0; }
        .alert-error { background:#ffe6e6; color:#b30000; border:1px solid #ffb3b3; }
        .alert-success { background:#e6ffef; color:#0f7a49; border:1px solid #b0f1cd; }
        .dim-wrap { position:relative; }
        .dimmer {
          position:absolute; inset:0; background:rgba(255,255,255,.65);
          display:flex; align-items:center; justify-content:center; border-radius:10px; font-weight:700;
        }
        @media (max-width: 799px) { .row { grid-template-columns: 1fr; gap:14px; } }
      `}</style>

      {/* progress steps */}
      <div className="steps">
        <div className={`step ${infoValid ? "active" : ""}`}>1) ข้อมูลส่วนตัว</div>
        <div className={`step ${internValid ? "active" : ""}`}>2) ข้อมูลฝึกงาน</div>
        <div className="step">3) ข้อมูลบริษัท</div>
      </div>

      <Wrapper {...wrapProps}>
        {/* =================== STEP 1 =================== */}
        <div className="form-header">ข้อมูลส่วนตัว</div>

        <div className="row full">
          <div className="form-group" role="group" aria-labelledby="prefix-label">
            <label id="prefix-label" className="label-normal">
              คำนำหน้า <span className="required-star">*</span>
            </label>
            <div className="prefix-wrap">
              <label htmlFor="prefix_mr" className="radio-item">
                <input
                  type="radio" id="prefix_mr" name="prefix" value="นาย"
                  checked={info.prefix === "นาย"} onChange={() => onInfoChange("prefix")("นาย")} required
                />
                <span>นาย</span>
              </label>
              <label htmlFor="prefix_miss" className="radio-item">
                <input
                  type="radio" id="prefix_miss" name="prefix" value="นางสาว"
                  checked={info.prefix === "นางสาว"} onChange={() => onInfoChange("prefix")("นางสาว")} required
                />
                <span>นางสาว</span>
              </label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <label className="label-normal" htmlFor="student_id">
              รหัสนิสิต <span className="required-star">*</span>
            </label>
            <input
              type="text" id="student_id" name="student_id" placeholder="กรอกรหัสนิสิต"
              value={info.student_id} onChange={onInfoChange("student_id")} required readOnly={studentIdLocked}
            />
            <div className="note">* ระบบจะล็อกไม่ให้แก้รหัสนิสิตเมื่อมีการบันทึกแล้ว</div>
          </div>
          <div className="form-group">
            <label className="label-normal" htmlFor="phone">
              เบอร์โทรศัพท์ <span className="required-star">*</span>
            </label>
            <input
              type="tel" id="phone" name="phone" placeholder="กรอกเบอร์โทรศัพท์"
              value={info.phone} onChange={onInfoChange("phone")} required
            />
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <label className="label-normal" htmlFor="first_name">
              ชื่อจริง <span className="required-star">*</span>
            </label>
            <input
              type="text" id="first_name" name="first_name" placeholder="กรอกชื่อจริง"
              value={info.first_name} onChange={onInfoChange("first_name")} required
            />
          </div>
          <div className="form-group">
            <label className="label-normal" htmlFor="last_name">
              นามสกุล <span className="required-star">*</span>
            </label>
            <input
              type="text" id="last_name" name="last_name" placeholder="กรอกนามสกุล"
              value={info.last_name} onChange={onInfoChange("last_name")} required
            />
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <label className="label-normal" htmlFor="department">
              ภาควิชา <span className="required-star">*</span>
            </label>
            <input
              type="text" id="department" name="department" placeholder="เทคโนโลยีสารสนเทศ"
              value={info.department} onChange={onInfoChange("department")} required
            />
          </div>
          <div className="form-group">
            <label className="label-normal" htmlFor="semester">
              ภาค <span className="required-star">*</span>
            </label>
            <select
              id="semester" name="semester" value={info.program_type}
              onChange={onInfoChange("program_type")} required
            >
              <option value="" disabled>-- เลือกภาค --</option>
              <option value="ปกติ">ภาคปกติ</option>
              <option value="พิเศษ">ภาคพิเศษ</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <label className="label-normal" htmlFor="email">
              อีเมล <span className="required-star">*</span>
            </label>
            <input
              type="email" id="email" name="email" placeholder="กรอกอีเมล"
              value={info.email} onChange={onInfoChange("email")} required
            />
          </div>
          <div className="form-group">
            <label className="label-normal" htmlFor="advisor">
              อาจารย์ที่ปรึกษา <span className="required-star">*</span>
            </label>
            <select
              id="advisor" name="advisor" value={info.advisor_name}
              onChange={onInfoChange("advisor_name")} required
            >
              <option value="" disabled>-- เลือกอาจารย์ที่ปรึกษา --</option>
              {advisors.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {infoLoading && <div className="alert">กำลังโหลดข้อมูล...</div>}
        {!infoLoading && infoErr && <div className="alert alert-error">{infoErr}</div>}
        {!infoLoading && infoMsg && <div className="alert alert-success">{infoMsg}</div>}

        {/* =================== STEP 2 =================== */}
        <div className="form-header" style={{ marginTop: 24 }}>ข้อมูลฝึกงาน</div>

        <div className="dim-wrap">
          {!infoValid && <div className="dimmer">🔒 กรอก “ข้อมูลส่วนตัว” ให้ครบก่อน</div>}

          <div className="row">
            <div className="form-group full">
              <label className="label-normal" htmlFor="position">
                ตำแหน่งงานที่ต้องการสมัคร <span className="required-star">*</span>
              </label>
              <input
                type="text" id="position" name="position" placeholder="กรอกตำแหน่งที่ต้องการสมัคร"
                value={intern.position} onChange={onInternChange}
                required disabled={!infoValid || internLoading}
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label className="label-normal" htmlFor="start_date">
                วันที่เริ่มฝึกงาน <span className="required-star">*</span>
              </label>
              <input
                type="date" id="start_date" name="start_date"
                value={intern.start_date} onChange={onInternChange}
                required disabled={!infoValid || internLoading}
              />
            </div>
            <div className="form-group">
              <label className="label-normal" htmlFor="end_date">
                วันที่สิ้นสุดฝึกงาน <span className="required-star">*</span>
              </label>
              <input
                type="date" id="end_date" name="end_date" min={minEndDate}
                value={intern.end_date} onChange={onInternChange}
                required disabled={!infoValid || internLoading}
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group full">
              <label className="label-normal" htmlFor="intern_note">รายละเอียดเพิ่มเติม</label>
              <textarea
                id="intern_note" name="intern_note" placeholder="รายละเอียด"
                value={intern.intern_note} onChange={onInternChange}
                disabled={!infoValid || internLoading}
              />
            </div>
          </div>

          {!!internErr && <div className="alert alert-error">{internErr}</div>}
          {!!internMsg && <div className="alert alert-success">{internMsg}</div>}
        </div>

        {/* =================== STEP 3 =================== */}
        <div className="form-header" style={{ marginTop: 24 }}>ข้อมูลบริษัท</div>

        <div className="dim-wrap">
          {!internValid && <div className="dimmer">🔒 กรอก “ข้อมูลฝึกงาน” ให้ครบก่อน</div>}

          {/* Company */}
          <div
            id="company-info-header"
            className="form-header-section"
            style={{
              margin: "36px 0 24px",
              position: "relative",
              fontSize: "1.2rem",         // ✅ ขยายตัวอักษ
            }}
          >
            ข้อมูลบริษัท
          </div>

          <div className="row">
            <div className="form-group full">
              <label className="label-normal" htmlFor="company_name">
                ชื่อบริษัท <span className="required-star">*</span>
              </label>
              <input
                id="company_name" required disabled={!internValid || compLoading}
                value={form.company_name} onChange={updateCompany("company_name")} placeholder="ชื่อบริษัท"
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group full">
              <label className="label-normal" htmlFor="company_website">เว็บไซต์บริษัท</label>
              <input
                id="company_website" type="url" disabled={!internValid || compLoading}
                value={form.company_website} onChange={updateCompany("company_website")} placeholder="https://"
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label className="label-normal" htmlFor="company_email">
                อีเมลบริษัท <span className="required-star">*</span>
              </label>
              <input
                id="company_email" type="email" required disabled={!internValid || compLoading}
                value={form.company_email} onChange={updateCompany("company_email")} placeholder="info@company.com"
              />
            </div>
            <div className="form-group">
              <label className="label-normal" htmlFor="company_phone">
                เบอร์โทรหลัก <span className="required-star">*</span>
              </label>
              <input
                id="company_phone" required disabled={!internValid || compLoading}
                value={form.company_phone} onChange={updateCompany("company_phone")} placeholder="02-xxx-xxxx"
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label className="label-normal" htmlFor="company_mobile">เบอร์มือถือ</label>
              <input
                id="company_mobile" disabled={!internValid || compLoading}
                value={form.company_mobile} onChange={updateCompany("company_mobile")} placeholder="081-xxx-xxxx"
              />
            </div>
            <div className="form-group">
              <label className="label-normal" htmlFor="company_note">โน้ตบริษัท</label>
              <input
                id="company_note" disabled={!internValid || compLoading}
                value={form.company_note} onChange={updateCompany("company_note")} placeholder="เช่น รับ onsite"
              />
            </div>
          </div>

          {/* Address */}
          <div
            id="company-info-header"
            className="form-header-section"
            style={{
              margin: "36px 0 24px",
              position: "relative",
              fontSize: "1.2rem",         // ✅ ขยายตัวอักษ
            }}
          >
            ที่อยู่บริษัท
          </div>
          <div className="row">
            <div className="form-group">
              <label className="label-normal" htmlFor="address_type">ประเภทที่อยู่</label>
              <input
                id="address_type" disabled={!internValid || compLoading}
                value={form.address_type} onChange={updateCompany("address_type")} placeholder="เช่น สถานที่ฝึกงาน"
              />
            </div>
            <div className="form-group">
              <label className="label-normal" htmlFor="address_line1">
                ที่อยู่บรรทัดที่ 1 <span className="required-star">*</span>
              </label>
              <input
                id="address_line1" required disabled={!internValid || compLoading}
                value={form.address_line1} onChange={updateCompany("address_line1")} placeholder="บ้านเลขที่/ถนน"
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group full">
              <label className="label-normal" htmlFor="address_line2">ที่อยู่บรรทัดที่ 2</label>
              <input
                id="address_line2" disabled={!internValid || compLoading}
                value={form.address_line2} onChange={updateCompany("address_line2")} placeholder="ตึก/ชั้น/ห้อง"
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label className="label-normal" htmlFor="province">
                จังหวัด <span className="required-star">*</span>
              </label>
              <input id="province" required disabled={!internValid || compLoading}
                value={form.province} onChange={updateCompany("province")} />
            </div>
            <div className="form-group">
              <label className="label-normal" htmlFor="district">
                อำเภอ / เขต <span className="required-star">*</span>
              </label>
              <input id="district" required disabled={!internValid || compLoading}
                value={form.district} onChange={updateCompany("district")} />
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label className="label-normal" htmlFor="subdistrict">
                แขวง / ตำบล <span className="required-star">*</span>
              </label>
              <input id="subdistrict" required disabled={!internValid || compLoading}
                value={form.subdistrict} onChange={updateCompany("subdistrict")} />
            </div>
            <div className="form-group">
              <label className="label-normal" htmlFor="zipcode">
                รหัสไปรษณีย์ <span className="required-star">*</span>
              </label>
              <input id="zipcode" required disabled={!internValid || compLoading}
                value={form.zipcode} onChange={updateCompany("zipcode")} />
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label className="label-normal" htmlFor="road">ถนน</label>
              <input id="road" disabled={!internValid || compLoading}
                value={form.road} onChange={updateCompany("road")} />
            </div>
            <div className="form-group">
              <label className="label-normal" htmlFor="village">หมู่</label>
              <input id="village" disabled={!internValid || compLoading}
                value={form.village} onChange={updateCompany("village")} />
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label className="label-normal" htmlFor="alley">ซอย</label>
              <input id="alley" disabled={!internValid || compLoading}
                value={form.alley} onChange={updateCompany("alley")} />
            </div>
            <div className="form-group">
              <label className="label-normal" htmlFor="room">ห้อง / ชั้น</label>
              <input id="room" disabled={!internValid || compLoading}
                value={form.room} onChange={updateCompany("room")} />
            </div>
          </div>

          <div className="row">
            <div className="form-group full">
              <label className="label-normal" htmlFor="extra_details">รายละเอียดที่อยู่เพิ่มเติม</label>
              <textarea
                id="extra_details" disabled={!internValid || compLoading}
                value={form.extra_details} onChange={updateCompany("extra_details")} placeholder="จุดสังเกต / วิธีเดินทาง ฯลฯ"
              />
            </div>
          </div>

          {/* Mentor */}
          <div
            id="company-info-header"
            className="form-header-section"
            style={{
              margin: "36px 0 24px",
              position: "relative",
              fontSize: "1.2rem",         // ✅ ขยายตัวอักษ
            }}
          >
            พี่เลี้ยง
          </div>
          <div className="row">
            <div className="form-group">
              <label className="label-normal" htmlFor="mentor_first_name">
                ชื่อ <span className="required-star">*</span>
              </label>
              <input
                id="mentor_first_name" required disabled={!internValid || compLoading}
                value={form.mentor_first_name} onChange={updateCompany("mentor_first_name")}
              />
            </div>
            <div className="form-group">
              <label className="label-normal" htmlFor="mentor_last_name">นามสกุล</label>
              <input
                id="mentor_last_name" disabled={!internValid || compLoading}
                value={form.mentor_last_name} onChange={updateCompany("mentor_last_name")}
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label className="label-normal" htmlFor="mentor_email">อีเมล</label>
              <input
                id="mentor_email" type="email" disabled={!internValid || compLoading}
                value={form.mentor_email} onChange={updateCompany("mentor_email")}
              />
            </div>
            <div className="form-group">
              <label className="label-normal" htmlFor="mentor_phone">
                เบอร์โทร <span className="required-star">*</span>
              </label>
              <input
                id="mentor_phone" required disabled={!internValid || compLoading}
                value={form.mentor_phone} onChange={updateCompany("mentor_phone")}
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label className="label-normal" htmlFor="mentor_mobile">มือถือ</label>
              <input
                id="mentor_mobile" disabled={!internValid || compLoading}
                value={form.mentor_mobile} onChange={updateCompany("mentor_mobile")}
              />
            </div>
            <div className="form-group">
              <label className="label-normal" htmlFor="mentor_position_title">ตำแหน่ง</label>
              <input
                id="mentor_position_title" disabled={!internValid || compLoading}
                value={form.mentor_position_title} onChange={updateCompany("mentor_position_title")}
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group full">
              <label className="label-normal" htmlFor="mentor_notes">บันทึกเพิ่มเติมของ Mentor</label>
              <textarea
                id="mentor_notes" disabled={!internValid || compLoading}
                value={form.mentor_notes} onChange={updateCompany("mentor_notes")}
              />
            </div>
          </div>

          {!!compErr && <div className="alert alert-error">{compErr}</div>}
          {!!compMsg && <div className="alert alert-success">{compMsg}</div>}
        </div>

        {/* ====== ปุ่มส่วนท้าย ====== */}
        <div className="actions">
          {embedded ? (
            <>
              <button
                className="btn btn-primary" type="button"
                onClick={() => submitAll().catch(() => { })}
                disabled={savingAll || infoLoading || internLoading || compLoading}
                aria-busy={savingAll}
              >
                {savingAll ? "กำลังบันทึกทั้งหมด..." : "บันทึกทั้งหมด"}
              </button>
              <button
                type="button" className="btn btn-secondary"
                onClick={() => {
                  loadInfo();
                  if (infoValid) loadIntern();
                  if (internValid) loadCompany();
                }}
                disabled={savingAll || infoLoading || internLoading || compLoading}
              >
                รีเฟรช
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-primary" type="submit"
                disabled={savingAll || infoLoading || internLoading || compLoading}
                aria-busy={savingAll}
              >
                {savingAll ? "กำลังบันทึกทั้งหมด..." : "บันทึกทั้งหมด"}
              </button>
              <button
                type="button" className="btn btn-secondary"
                onClick={() => {
                  loadInfo();
                  if (infoValid) loadIntern();
                  if (internValid) loadCompany();
                }}
                disabled={savingAll || infoLoading || internLoading || compLoading}
              >
                รีโหลด
              </button>
            </>
          )}
        </div>
      </Wrapper>
    </section>
  );
});

export default StudentOnboardingCard;
