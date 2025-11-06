"use client";

import DateTimeText from "@/components/ui/DateTimeText";

export default function evaluationHeader({ title = "เพิ่มข้อมูลนิสิต" }) {
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
