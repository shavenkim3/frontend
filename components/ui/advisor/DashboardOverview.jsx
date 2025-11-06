"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardOverview() {
  const [dateText, setDateText] = useState("");
  const [timeText, setTimeText] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const d = now.toLocaleDateString("th-TH", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const t = now.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setDateText(d);
      setTimeText(t);
    };
    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const chartData = [
    { name: "สหกิจ", value: 20, color: "#ff8a80" },
    { name: "ปัญหาพิเศษ", value: 40, color: "#26c6da" },
    { name: "ภาคปกติ", value: 30, color: "#009688" },
    { name: "ภาคพิเศษ", value: 30, color: "#00897b" },
    { name: "ยกเลิกทำ", value: 5, color: "#ba68c8" },
    { name: "รวมทั้งหมด", value: 60, color: "#9c27b0" },
  ];

  return (
    <div className="dashboard-container">
      {/* Grid ทั้งหมด */}
      <div className="grid-container">
        {/* ฝั่งซ้าย */}
        <div className="left-grid">
          {/* การ์ดสรุป */}
          <div className="summary-grid">
            <div className="card black">
              <h3>นิสิตที่ปรึกษา</h3>
              <p>20</p>
            </div>
            <div className="card pink">
              <h3>นิสิตสหกิจ</h3>
              <p>20</p>
            </div>
            <div className="card purple">
              <h3>นิสิตทั้งหมด</h3>
              <p>60</p>
            </div>
            <div className="card blue">
              <h3>นิสิตปัญหาพิเศษ</h3>
              <p>40</p>
            </div>
          </div>

          {/* กราฟ */}
          <div className="chart-card">
            <h3>แสดงข้อมูลนิสิต</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="value" fill="#9c27b0" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ฝั่งขวา */}
        <div className="right-grid">
          {/* ภาคปกติ & ภาคพิเศษ (อยู่บนสุด) */}
          <div className="card normal">
            <h3>ภาคปกติ</h3>
            <p className="big">30</p>
            <ul>
              <li>
                นิสิตปัญหาพิเศษ <span>17</span>
              </li>
              <li>
                นิสิตสหกิจ <span>13</span>
              </li>
              <li>
                ยกเลิกทำ <span>1</span>
              </li>
            </ul>
          </div>

          <div className="card special">
            <h3>ภาคพิเศษ</h3>
            <p className="big">30</p>
            <ul>
              <li>
                นิสิตปัญหาพิเศษ <span>23</span>
              </li>
              <li>
                นิสิตสหกิจ <span>7</span>
              </li>
              <li>
                ยกเลิกทำ <span>2</span>
              </li>
            </ul>
          </div>

          {/* การ์ดสรุปสถานะ */}
          <div className="mini-card">
            <h4>กำลังตรวจสอบเอกสาร</h4>
            <p>45</p>
          </div>
          <div className="mini-card">
            <h4>ดำเนินการฝึกงาน</h4>
            <p>5</p>
          </div>
          <div className="mini-card">
            <h4>สอบวิพากษ์</h4>
            <p>0</p>
          </div>
          <div className="mini-card">
            <h4>เสร็จสิ้น</h4>
            <p>0</p>
          </div>
        </div>
      </div>

      {/* ===== CSS ===== */}
      <style jsx>{`
        .dashboard-container {
          background: #fff;
          padding: 24px;
        }

        .overview-header {
          background: #f9f9f9;
          padding: 24px 32px;
          border-bottom: 1px solid #e0e0e0;
          margin-bottom: 20px;
        }
        .overview-header h2 {
          font-size: 1.4rem;
          font-weight: 600;
          color: #03a96b;
          margin: 0 0 4px 0;
        }
        .overview-header p {
          font-size: 1rem;
          color: #333;
          margin: 0;
        }

        .grid-container {
          display: grid;
          grid-template-columns: 3fr 1fr;
          gap: 16px;
        }

        /* การ์ด 4 ช่องแรก */
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 16px;
        }

        .card {
          background: #fff;
          border-radius: 12px;
          padding: 18px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }
        .card h3 {
          font-size: 1.05rem;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .card p {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
        }
        .card ul {
          list-style: none;
          margin: 0;
          padding: 0;
          font-size: 0.95rem;
        }
        .card li {
          display: flex;
          justify-content: space-between;
          color: #333;
          margin: 3px 0;
        }

        /* สีแต่ละประเภท */
        .card.black p {
          color: #000;
        }
        .card.pink p {
          color: #f06292;
        }
        .card.purple p {
          color: #9c27b0;
        }
        .card.blue p {
          color: #26c6da;
        }
        .card.normal h3,
        .card.normal li {
          color: #00796b;
        }
        .card.special h3,
        .card.special li {
          color: #00897b;
        }

        .chart-card {
          background: #fff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }
        .chart-card h3 {
          font-size: 1.05rem;
          color: #03a96b;
          font-weight: 600;
          margin-bottom: 12px;
        }

        /* ฝั่งขวา */
        .right-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .mini-card {
          background: #fff;
          border-radius: 12px;
          padding: 16px 18px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }
        .mini-card h4 {
          margin: 0 0 6px 0;
          font-weight: 600;
          color: #004d40;
        }
        .mini-card p {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
        }

        @media (max-width: 950px) {
          .grid-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
