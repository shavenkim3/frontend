"use client";

import DateTimeText from "@/components/ui/DateTimeText";

export default function CompanyNewsAddHeader({ title = "หน้าเพิ่มข่าวสาร" }) {
  return (
    <div className="sfh-root">
      <style jsx>{`
        .sfh-title {
          font-family: 'Kanit', sans-serif;
          font-size: 1.2rem;
          font-weight: 500;
          margin-bottom: 6px;
          color: #232629;
        }
      `}</style>

      <h2 className="sfh-title">{title}</h2>
      <DateTimeText />
    </div>
  );
}
