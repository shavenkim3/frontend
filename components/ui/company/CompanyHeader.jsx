"use client";

import { useEffect, useState } from "react";

export default function CompanyHeader({ title = "ข้อมูลนิสิต" }) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const days = [
        "อาทิตย์",
        "จันทร์",
        "อังคาร",
        "พุธ",
        "พฤหัสบดี",
        "ศุกร์",
        "เสาร์",
      ];
      const months = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
      ];
      const dayName = days[now.getDay()];
      const day = now.getDate();
      const month = months[now.getMonth()];
      const year = now.getFullYear() + 543;
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setCurrentTime(
        `วัน${dayName}, ${day} ${month} ${year} เวลา ${hours}:${minutes} น.`
      );
    };
    updateDateTime();
    const t = setInterval(updateDateTime, 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="sfh-root">
      <style jsx>{`
        .sfh-title {
          font-family: "Kanit", sans-serif;
          font-size: 1.2rem;
          font-weight: 500;
          margin-bottom: 6px;
          color: #232629;
        }
        .sfh-time {
          font-size: 0.9rem;
          color: #555;
        }
      `}</style>

      <h2 className="sfh-title">{title}</h2>
      <div className="sfh-time">{currentTime}</div>
    </div>
  );
}
