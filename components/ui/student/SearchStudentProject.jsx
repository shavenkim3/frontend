"use client";

import React, { useState, useEffect } from "react";
import { Search, XCircle, Eye, Pencil, Download } from "lucide-react";

export default function SearchStudentProject() {
  const [filters, setFilters] = useState({
    year: "",
    department: "",
    advisor: "",
    projectName: "",
  });

  const [results, setResults] = useState([]);

  const years = ["2568", "2567", "2566", "2565", "2564", "2563", "2562", "2561", "2560"];
  const departments = ["ภาคปกติ", "ภาคพิเศษ"];
  const advisors = [
    "อาจารย์ กนิษฐา ตั้งไทยขวัญ",
    "อาจารย์ ธีรานนต์ ธนารัตน์ภิวพันธ์",
    "อาจารย์ ปัญญาพร ปรางงโรจน์",
    "อาจารย์ สภาวรัตน์ จังหวัฒนาการ",
    "อาจารย์ สุริยะ พันิจการ",
  ];

  const mockData = [
    {
      id: 1,
      year: "2567",
      department: "ภาคพิเศษ",
      project: "ระบบจัดการข้อมูลปัญหาพิเศษ",
      advisor: "อาจารย์ สุริยะ พันิจการ",
      student: "นายชัยพร แพ้มาลัย",
    },
    {
      id: 2,
      year: "2566",
      department: "ภาคปกติ",
      project: "ระบบฝึกงานออนไลน์",
      advisor: "อาจารย์ กนิษฐา ตั้งไทยขวัญ",
      student: "นายธีร์รภัทร นฤนาค",
    },
    {
      id: 3,
      year: "2565",
      department: "ภาคพิเศษ",
      project: "ระบบติดตามโครงงานนิสิต",
      advisor: "อาจารย์ ธีรานนต์ ธนารัตน์ภิวพันธ์",
      student: "น.ส.ธนัญญา มณีวรรณ",
    },
  ];

  // ✅ ค้นหาอัตโนมัติเมื่อมีการเปลี่ยนค่า filter
  useEffect(() => {
    const filtered = mockData.filter((item) => {
      return (
        (!filters.year || item.year === filters.year) &&
        (!filters.department || item.department === filters.department) &&
        (!filters.advisor || item.advisor === filters.advisor) &&
        (!filters.projectName ||
          item.project.toLowerCase().includes(filters.projectName.toLowerCase()))
      );
    });
    setResults(filtered);
  }, [filters]);

  const handleReset = () => {
    setFilters({
      year: "",
      department: "",
      advisor: "",
      projectName: "",
    });
  };

  const handleDownload = (item) => {
    alert(`ดาวน์โหลดข้อมูลโครงงาน: ${item.project}`);
  };

  return (
    <div className="search-container">
      {/* ฟอร์มค้นหา */}
      <div className="search-form">
        <div className="row">
          {/* ปีการศึกษา */}
          <div className="form-group">
            <label>ปีการศึกษา</label>
            <select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            >
              <option value="">-- เลือกปีการศึกษา --</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* ภาควิชา */}
          <div className="form-group">
            <label>ภาควิชา</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            >
              <option value="">-- เลือกภาควิชา --</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* อาจารย์ที่ปรึกษา */}
          <div className="form-group">
            <label>อาจารย์ที่ปรึกษา</label>
            <select
              value={filters.advisor}
              onChange={(e) => setFilters({ ...filters, advisor: e.target.value })}
            >
              <option value="">-- เลือกอาจารย์ที่ปรึกษา --</option>
              {advisors.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ชื่อโครงงาน */}
        <div className="row">
          <div className="form-group full">
            <label>ชื่อเรื่องโครงงาน</label>
            <input
              type="text"
              placeholder="กรอกชื่อโครงงาน"
              value={filters.projectName}
              onChange={(e) =>
                setFilters({ ...filters, projectName: e.target.value })
              }
            />
          </div>
        </div>

        {/* ปุ่มล้างข้อมูล */}
        <div className="action-row">
          <button className="btn reset" onClick={handleReset}>
            <XCircle size={18} /> ล้างข้อมูล
          </button>
        </div>
      </div>

      {/* ✅ ตารางผลลัพธ์ */}
      <div className="table-wrapper">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>ปีการศึกษา</th>
                <th>ภาควิชา</th>
                <th>ชื่อโครงงาน</th>
                <th>ชื่อนิสิต</th>
                <th>อาจารย์ที่ปรึกษา</th>
                <th>ดาวน์โหลด</th>
              </tr>
            </thead>
            <tbody>
              {results.length > 0 ? (
                results.map((item) => (
                  <tr key={item.id}>
                    <td>{item.year}</td>
                    <td>{item.department}</td>
                    <td>{item.project}</td>
                    <td>{item.student}</td>
                    <td>{item.advisor}</td>
                    <td>
                      <button
                        className="btn-download"
                        onClick={() => handleDownload(item)}
                      >
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="no-data">
                    ไม่มีข้อมูลแสดง
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Card view สำหรับจอเล็ก */}
        <div className="card-list">
          {results.map((item) => (
            <div key={item.id} className="card-item">
              <div className="card-header">
                <strong>{item.student}</strong>
                <span className="badge">ปี {item.year}</span>
              </div>
              <div className="card-body">
                <p><b>ภาค:</b> {item.department}</p>
                <p><b>อาจารย์:</b> {item.advisor}</p>
                <p><b>โครงงาน:</b> {item.project}</p>
              </div>
              <div className="card-footer">
                <button
                  className="btn-download"
                  onClick={() => handleDownload(item)}
                >
                  <Download size={16} /> ดาวน์โหลด
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Style ทั้งหมด */}
      <style jsx>{`
        .search-container {
          background: #fff;
          padding: 24px;
          border-radius: 10px;
          font-family: "Kanit", sans-serif;
        }

        .search-form {
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 1.5rem;
        }

        .row {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 200px;
        }

        .form-group.full {
          flex: 1 1 100%;
        }

        label {
          font-size: 0.95rem;
          font-weight: 500;
          margin-bottom: 4px;
        }

        input,
        select {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 0.95rem;
          background: #fff;
        }

        input:focus,
        select:focus {
          outline: none;
          border-color: #03a96b;
          box-shadow: 0 0 0 2px rgba(3, 169, 107, 0.2);
        }

        .action-row {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn.reset {
          background: #d9534f;
          color: white;
        }
        .btn.reset:hover {
          background: #c9302c;
        }

        .table-wrapper {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: #03a96b;
          color: white;
        }

        th,
        td {
          text-align: center;
          vertical-align: middle;
          padding: 12px 14px;
          border-bottom: 1px solid #eee;
          font-size: 0.95rem;
        }

        tr:hover td {
          background: #f2fdf8;
        }

        .btn-download {
          background: #03a96b;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 6px 10px;
          cursor: pointer;
          transition: 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: auto;
        }

        .btn-download:hover {
          background: #02945f;
        }

        .no-data {
          text-align: center;
          color: #999;
          padding: 16px 0;
        }

        .table-scroll {
          max-height: 370px;
          overflow-y: auto;
        }

        .table-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .table-scroll::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 3px;
        }

        .card-list {
          display: none;
        }

        @media (max-width: 1200px) {
          table {
            display: none;
          }

          .card-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            max-height: 600px;
            overflow-y: auto;
            padding: 10px;
          }

          .card-item {
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 12px 16px;
            background: #fff;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
            font-size: 1rem;
            margin-bottom: 4px;
          }

          .badge {
            background: #03a96b;
            color: white;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 0.8rem;
          }

          .card-body p {
            margin: 4px 0;
            font-size: 0.9rem;
          }

          .card-footer {
            margin-top: 10px;
            display: flex;
            justify-content: flex-end;
          }

          .card-footer .btn-download {
            font-size: 0.85rem;
            padding: 6px 12px;
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }

        @media (max-width: 768px) {
          .row {
            flex-direction: column;
          }
          .action-row {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}