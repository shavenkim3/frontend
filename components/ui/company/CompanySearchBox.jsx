"use client";

import { Search, Filter } from "lucide-react";

export default function CompanySearchBox({ searchTerm, setSearchTerm }) {
  return (
    <div>
      <style jsx>{`
        .filter-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 500;
          margin-bottom: 12px;
          color: #333;
        }

        .search-box {
          display: flex;
          align-items: center;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 10px 14px;
          margin-bottom: 20px;
        }

        .search-box input {
          border: none;
          outline: none;
          flex: 1;
          font-family: "Kanit", sans-serif;
          font-size: 1rem;
        }
      `}</style>

      <div className="filter-row">
        <Filter size={18} />
        <span>ตัวกรอง</span>
      </div>

      <div className="search-box">
        <Search size={18} color="#777" />
        <input
          type="text"
          placeholder="ค้นหานิสิต ชื่อ, รหัส, ภาค หรืออาจารย์..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}
