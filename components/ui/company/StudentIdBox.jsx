"use client";

export default function StudentIdBox({ value = "", readOnly = true }) {
  return (
    <div className="student-search">
      <label>รหัสนิสิต</label>
      <input
        type="text"
        value={value}
        readOnly={readOnly}
        className={`student-id`}
        onChange={() => {}}
      />
    </div>
  );
}
