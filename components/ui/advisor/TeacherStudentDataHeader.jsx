"use client";

import React from "react";

export default function WelcomeSection() {
  const today = new Date().toLocaleDateString("th-TH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeNow = new Date().toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section className="welcome">
      <p>แก้ไขข้อมูลอาจารย์</p>
      <p className="time">
        {today} เวลา {timeNow} น.
      </p>
    </section>
  );
}
