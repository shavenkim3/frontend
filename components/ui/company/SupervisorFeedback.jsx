"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

export default function SupervisorFeedback() {
  const highlightRequired = (q) => {
    return q.replace("*", '<span class="text-red-500">*</span>');
  };

  // ✅ state สำหรับเก็บการเลือก “ความพร้อม”
  const [readiness, setReadiness] = useState({});

  const readinessTopics = [
    "ความพร้อมในด้านความรู้จากศูนย์ที่เกี่ยวกับงาน",
    "ความพร้อมในด้านความรู้ทางด้านปฏิบัติที่นิสิตฝึกงาน",
    "ความพร้อมในด้านการปรับตัวให้เข้ากับหน่วยงาน",
    "ความพร้อมในด้านความรับผิดชอบ ความขยัน ความอดทน ซื่อสัตย์ และตั้งใจทำงาน",
    "ความพร้อมในด้านมนุษยสัมพันธ์ต่อเพื่อนร่วมงาน",
  ];

  const levels = [1, 2, 3, 4, 5];

  // ป้องกันการเลือกซ้ำ (1 ลำดับมีได้ข้อเดียว)
  const handleSelect = (topic, level) => {
    setReadiness((prev) => {
      const updated = Object.fromEntries(
        Object.entries(prev).map(([key, val]) => [
          key,
          val === level ? null : val,
        ])
      );
      return { ...updated, [topic]: level };
    });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md font-[Kanit] text-gray-900">
      <h2 className="text-lg font-bold mb-6">
        ความคิดเห็นและข้อเสนอแนะของผู้ควบคุมการฝึกงาน
      </h2>

      <div className="space-y-5">
        {/* ======= คำถามหลัก ======= */}
        {[
          "1. การฝึกงานโครงการสหกิจศึกษาของนิสิตเป็นประโยชน์ต่อนิสิตในตำแหน่งงานอย่างไรหรือไม่อย่างไร *",
          "2. ระยะเวลาการฝึกงานโครงการสหกิจศึกษาของนิสิตเหมาะสมกับลักษณะงานที่ฝึกหรือไม่",
          "3. การฝึกงานสหกิจศึกษาของนิสิตสหกิจศึกษา นิสิตควรมีทัศนคติพฤติกรรมที่เด่นหรือไม่ อย่างไร",
          "4. ปัญหาอุปสรรคและข้อเสนอแนะเกี่ยวกับการปฏิบัติงานของนิสิตที่ควรปรับปรุงแก้ไข และสมควรที่จะปรับปรุงอย่างไร",
        ].map((q, i) => (
          <div key={i}>
            <label
              className="block mb-1 font-medium"
              dangerouslySetInnerHTML={{ __html: highlightRequired(q) }}
            />
            <textarea
              rows="2"
              placeholder="กรอกข้อมูล"
              className="w-full bg-gray-100 rounded px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>
        ))}

        {/* ======= ความพร้อมของนิสิต ======= */}
        <div className="mt-8">
          <h3 className="font-semibold text-gray-800 mb-4">
            5. ความพร้อมของนิสิตในแต่ละด้าน{" "}
            <span className="text-sm font-normal text-gray-600">
              (โปรดเรียงตามลำดับความสำคัญ 1–5 โดยไม่ซ้ำกัน)
            </span>
          </h3>

          {readinessTopics.map((topic, i) => (
            <div key={i} className="mb-8">
              <p className="mb-3 font-medium text-gray-800">{topic}</p>

              <div className="flex justify-center items-center gap-6 sm:gap-8 md:gap-10 flex-wrap">
                {levels.map((lvl) => {
                  const isSelected = readiness[topic] === lvl;
                  return (
                    <div
                      key={lvl}
                      className="flex flex-col items-center justify-start"
                    >
                      <button
                        onClick={() => handleSelect(topic, lvl)}
                        className={`circle-btn flex items-center justify-center border-2 ${
                          isSelected
                            ? "bg-green-600 border-green-600"
                            : "border-gray-400"
                        } transition-all duration-150`}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                        }}
                      >
                        {isSelected && <Check size={18} color="white" />}
                      </button>
                      <span
                        className={`mt-2 text-sm font-medium ${
                          isSelected ? "text-green-700" : "text-gray-700"
                        }`}
                      >
                        {lvl}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ======= จำนวนรับนิสิต ======= */}
        <div className="mt-6">
          <label className="block mb-1 font-medium">
            6. ท่านเห็นว่าควรรับนิสิตเข้าฝึกงานโครงการสหกิจศึกษาอีกครั้งต่อไปหรือไม่
          </label>
          <div className="flex items-center gap-4 mb-2">
            <span>รับ จำนวน</span>
            <input
              type="number"
              className="bg-gray-100 rounded px-3 py-1 w-24 focus:ring-2 focus:ring-green-400 focus:outline-none"
              placeholder="__"
            />
            <span>คน</span>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="accept" className="accent-green-500" />
              <span>ไม่รับ เพราะ</span>
            </label>
            <input
              type="text"
              className="bg-gray-100 rounded px-3 py-1 flex-1 focus:ring-2 focus:ring-green-400 focus:outline-none"
              placeholder="กรอกเหตุผล"
            />
          </div>
        </div>

        {/* ======= อื่นๆ ======= */}
        <div className="mt-6">
          <label className="block mb-1 font-medium">
            7. อื่นๆ (ถ้ามีโปรดระบุ)
          </label>
          <textarea
            rows="3"
            placeholder="รายละเอียดเพิ่มเติม"
            className="w-full bg-gray-100 rounded px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>

        {/* ======= ปุ่ม ======= */}
        <div className="flex justify-end gap-4 mt-8">
          
          
        </div>
      </div>

      <style jsx>{`
        .circle-btn:active {
          transform: scale(1.08);
        }

        @media (max-width: 768px) {
          .circle-btn {
            width: 42px !important;
            height: 42px !important;
          }
          span {
            font-size: 13px !important;
          }
        }
      `}</style>
    </div>
  );
}
