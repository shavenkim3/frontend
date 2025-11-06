"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

export default function EvaluationTable() {
  const [responses, setResponses] = useState({});

  const questions = [
    {
      category: "ลักษณะนิสัย",
      items: [
        "การตรงต่อเวลา",
        "การแต่งกาย",
        "บุคลิก",
        "กิริยามารยาท",
        "มนุษย์สัมพันธ์",
        "การยอมรับฟังความเห็นผู้อื่น",
      ],
    },
    {
      category: "ทัศนคติ",
      items: [
        "ความร่วมมือ",
        "ความรับผิดชอบ",
        "ความสนใจและตั้งใจในการทำงาน",
        "ความซื่อสัตย์",
        "ความมั่นใจ",
        "ความอดทนมานะ",
      ],
    },
    {
      category: "ความรู้",
      items: [
        "ความละเอียดรอบคอบ",
        "คุณภาพของงาน",
        "ความคิดริเริ่ม",
        "การแก้ไขปัญหาเฉพาะหน้า",
        "คุณภาพของงาน",
      ],
    },
  ];

  const handleSelect = (question, value) => {
    setResponses((prev) => ({ ...prev, [question]: value }));
  };

  const circleSizes = [60, 52, 44, 52, 60];
  const levels = [
    { label: "ดีมาก", color: "border-green-600" },
    { label: "ดี", color: "border-green-600" },
    { label: "ปานกลาง", color: "border-gray-600" },
    { label: "น้อย", color: "border-purple-500" },
    { label: "ปรับปรุง", color: "border-purple-500" },
  ];

  return (
    <div className="p-4 font-[Kanit] text-gray-900">
      <h2 className="text-2xl font-bold mb-8 text-black text-center md:text-left">
        แบบประเมินผลการปฏิบัติงานนักศึกษา
      </h2>

      {questions.map((section, idx) => (
        <div key={idx} className="mb-12">
          {/* ===== หัวข้อหมวด ===== */}
          <div className="px-4 py-3 mb-6 rounded-md border-l-8 border-indigo-500 bg-indigo-50 shadow-sm">
            <h3 className="font-bold text-lg text-indigo-800 tracking-wide">
              {section.category}
            </h3>
          </div>

          {/* ===== รายการในหมวด ===== */}
          <div className="space-y-10">
            {section.items.map((item, qIdx) => (
              <div key={qIdx}>
                <p className="mb-4 font-medium">{item}</p>

                {/* กลุ่มวงกลม + ข้อความ */}
                <div className="flex justify-center items-start gap-[2vw] sm:gap-[1.5vw] md:gap-6 flex-nowrap overflow-hidden">
                  {levels.map((level, i) => {
                    const num = i + 1;
                    const isSelected = responses[item] === num;

                    const bgColor = isSelected
                      ? level.color.includes("green")
                        ? "bg-green-600"
                        : level.color.includes("purple")
                        ? "bg-purple-500"
                        : "bg-gray-600"
                      : "bg-transparent";

                    return (
                      <div
                        key={num}
                        className="flex flex-col items-center justify-start"
                        style={{
                          flex: "1 1 0",
                          minWidth: 0,
                        }}
                      >
                        <button
                          onClick={() => handleSelect(item, num)}
                          className={`circle-btn flex items-center justify-center border-2 ${level.color} ${bgColor} transition-all duration-150`}
                          style={{
                            width: circleSizes[i],
                            height: circleSizes[i],
                          }}
                        >
                          {isSelected && <Check size={18} color="white" />}
                        </button>

                        <div
                          className="mt-2 flex items-center justify-center text-center"
                          style={{
                            height: "22px",
                            lineHeight: "22px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span className="text-sm font-medium text-black">
                            {level.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ✅ Responsive + Circle Fix */}
      <style jsx>{`
        .circle-btn {
          border-radius: 50% !important;
          aspect-ratio: 1 / 1;
          box-sizing: border-box;
        }

        .circle-btn:active {
          transform: scale(1.08);
        }

        @media (max-width: 1024px) {
          .circle-btn {
            width: 50px !important;
            height: 50px !important;
          }
        }
        @media (max-width: 768px) {
          .circle-btn {
            width: 44px !important;
            height: 44px !important;
          }
          span {
            font-size: 13px !important;
          }
          .flex.justify-center {
            gap: 1.8vw !important;
          }
        }
        @media (max-width: 540px) {
          .circle-btn {
            width: 38px !important;
            height: 38px !important;
          }
          span {
            font-size: 12px !important;
          }
          .flex.justify-center {
            gap: 1.5vw !important;
          }
        }
        @media (max-width: 430px) {
          .circle-btn {
            width: 32px !important;
            height: 32px !important;
          }
          span {
            font-size: 11px !important;
          }
          .flex.justify-center {
            gap: 1.2vw !important;
          }
        }
        @media (max-width: 370px) {
          .circle-btn {
            width: 28px !important;
            height: 28px !important;
          }
          span {
            font-size: 10px !important;
          }
          .flex.justify-center {
            gap: 1vw !important;
          }
        }
      `}</style>
    </div>
  );
}
