import React from "react";

export default function InternshipForm() {
  const grades = ["ดีมาก", "ดี", "ปานกลาง", "น้อย", "ปรับปรุง"];

  const sections = [
    {
      title: "ลักษณะนิสัย",
      items: [
        "การตรงต่อเวลา",
        "การแต่งกาย",
        "บุคลิก",
        "กิริยามารยาท",
        "มนุษยสัมพันธ์",
        "การยอมรับฟังความคิดเห็นของผู้อื่น",
      ],
    },
    {
      title: "ทัศนคติ",
      items: [
        "ความรับผิดชอบ",
        "ความร่วมมือ",
        "ความสนใจและตั้งใจในการทำงาน",
        "ความซื่อสัตย์",
        "ความมั่นใจ",
        "ความอดทนมานะ",
      ],
    },
    {
      title: "ความรู้",
      items: [
        "ความรู้พื้นฐานในงานที่ทำ",
        "ความละเอียดรอบคอบ",
        "ความคิดริเริ่ม",
        "การแก้ไขปัญหาเฉพาะหน้า",
        "คุณภาพของงาน",
      ],
    },
  ];

  // ฟังก์ชันทำให้ * เป็นสีแดง
  const highlightRequired = (label) =>
    label.replace("*", '<span class="text-red-500">*</span>');

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans space-y-6">
      {/* -------------------- ข้อมูลการฝึกงาน -------------------- */}
      <div className="bg-white rounded shadow">
        <div
          className="text-white px-6 py-3 flex items-center rounded-t"
          style={{ backgroundColor: "#0DB26B" }}
        >
          <h2 className="text-lg font-bold">ข้อมูลการฝึกงาน</h2>
        </div>

        <div className="p-6">
          <form className="space-y-4">
            <div>
              <label
                className="block mb-1"
                dangerouslySetInnerHTML={{
                  __html: highlightRequired("ตำแหน่งที่ฝึกงาน *"),
                }}
              />
              <input
                type="text"
                placeholder="Frontend developer"
                className="w-full bg-gray-100 rounded px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block mb-1"
                  dangerouslySetInnerHTML={{
                    __html: highlightRequired("วันที่เริ่มฝึกงาน *"),
                  }}
                />
                <input
                  type="date"
                  className="w-full bg-gray-100 rounded px-3 py-2"
                />
              </div>
              <div>
                <label
                  className="block mb-1"
                  dangerouslySetInnerHTML={{
                    __html: highlightRequired("วันที่สิ้นสุดฝึกงาน *"),
                  }}
                />
                <input
                  type="date"
                  className="w-full bg-gray-100 rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label
                className="block mb-1"
                dangerouslySetInnerHTML={{
                  __html: highlightRequired("เวลาทำงานรวม (ไม่นับวันหยุด) *"),
                }}
              />
              <input
                type="text"
                placeholder="180 วัน"
                className="w-full bg-gray-100 rounded px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label
                  className="block mb-1"
                  dangerouslySetInnerHTML={{
                    __html: highlightRequired("ลากิจ *"),
                  }}
                />
                <input
                  type="text"
                  placeholder="2 ครั้ง"
                  className="w-full bg-gray-100 rounded px-3 py-2"
                />
              </div>
              <div>
                <label
                  className="block mb-1"
                  dangerouslySetInnerHTML={{
                    __html: highlightRequired("ลาป่วย *"),
                  }}
                />
                <input
                  type="text"
                  placeholder="2 ครั้ง"
                  className="w-full bg-gray-100 rounded px-3 py-2"
                />
              </div>
              <div>
                <label
                  className="block mb-1"
                  dangerouslySetInnerHTML={{
                    __html: highlightRequired("ขาดงาน *"),
                  }}
                />
                <input
                  type="text"
                  placeholder="2 ครั้ง"
                  className="w-full bg-gray-100 rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label
                className="block mb-1"
                dangerouslySetInnerHTML={{
                  __html: highlightRequired("วันลาหยุดงานทั้งหมดรวม *"),
                }}
              />
              <input
                type="text"
                placeholder="6 วัน"
                className="w-full bg-gray-100 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1">รายละเอียดเพิ่มเติม</label>
              <textarea
                rows="4"
                placeholder="รายละเอียด"
                className="w-full bg-gray-100 rounded px-3 py-2"
              />
            </div>
          </form>
        </div>
      </div>

      {/* -------------------- ข้อมูลบริษัท -------------------- */}
      <div className="bg-white rounded shadow">
        <div
          className="text-white px-6 py-3 flex items-center rounded-t"
          style={{ backgroundColor: "#0DB26B" }}
        >
          <h2 className="text-lg font-bold">ข้อมูลบริษัท</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* ข้อมูลบริษัท */}
          <div>
            <h3 className="text-md font-semibold mb-3">ข้อมูลบริษัท</h3>
            <form className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label
                  className="block mb-1"
                  dangerouslySetInnerHTML={{
                    __html: highlightRequired("ชื่อบริษัท *"),
                  }}
                />
                <input
                  type="text"
                  placeholder="บริษัท เอ บี ซี"
                  className="w-full bg-gray-100 rounded px-3 py-2"
                />
              </div>

              <div className="col-span-2">
                <label className="block mb-1">เว็บไซต์บริษัท</label>
                <input
                  type="text"
                  placeholder="http://"
                  className="w-full bg-gray-100 rounded px-3 py-2"
                />
              </div>

              <div>
                <label
                  className="block mb-1"
                  dangerouslySetInnerHTML={{
                    __html: highlightRequired("อีเมลบริษัท *"),
                  }}
                />
                <input
                  type="email"
                  placeholder="info@company.co.th"
                  className="w-full bg-gray-100 rounded px-3 py-2"
                />
              </div>

              <div>
                <label
                  className="block mb-1"
                  dangerouslySetInnerHTML={{
                    __html: highlightRequired("เบอร์โทรศัพท์หลัก *"),
                  }}
                />
                <input
                  type="text"
                  placeholder="02-123-4567"
                  className="w-full bg-gray-100 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-1">เบอร์มือถือ</label>
                <input
                  type="text"
                  placeholder="080-000-0000"
                  className="w-full bg-gray-100 rounded px-3 py-2"
                />
              </div>

              <div>
                <label
                  className="block mb-1"
                  dangerouslySetInnerHTML={{
                    __html: highlightRequired("เบอร์โทรผู้ประสานงาน *"),
                  }}
                />
                <input
                  type="text"
                  placeholder="02-123-4567"
                  className="w-full bg-gray-100 rounded px-3 py-2"
                />
              </div>

              <div className="col-span-2">
                <label
                  className="block mb-1"
                  dangerouslySetInnerHTML={{
                    __html: highlightRequired("ผู้ประสานงาน *"),
                  }}
                />
                <input
                  type="text"
                  placeholder="คุณ สมชาย ใจดี"
                  className="w-full bg-gray-100 rounded px-3 py-2"
                />
              </div>
            </form>
          </div>

          {/* ข้อมูลที่อยู่บริษัท */}
          <div>
            <h3 className="text-md font-semibold mb-3">ข้อมูลที่อยู่บริษัท</h3>
            <form className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block mb-1"
                  dangerouslySetInnerHTML={{
                    __html: highlightRequired("จังหวัด *"),
                  }}
                />
                <input
                  type="text"
                  placeholder="นครปฐม"
                  className="w-full bg-gray-100 rounded px-3 py-2"
                />
              </div>

              <div>
                <label
                  className="block mb-1"
                  dangerouslySetInnerHTML={{
                    __html: highlightRequired("รหัสไปรษณีย์ *"),
                  }}
                />
                <input
                  type="text"
                  placeholder="12210"
                  className="w-full bg-gray-100 rounded px-3 py-2"
                />
              </div>

              <div>
                <label
                  className="block mb-1"
                  dangerouslySetInnerHTML={{
                    __html: highlightRequired("แขวง / ตำบล *"),
                  }}
                />
                <input
                  type="text"
                  placeholder="กำแพงแสน"
                  className="w-full bg-gray-100 rounded px-3 py-2"
                />
              </div>

              <div>
                <label
                  className="block mb-1"
                  dangerouslySetInnerHTML={{
                    __html: highlightRequired("อำเภอ / เขต *"),
                  }}
                />
                <input
                  type="text"
                  placeholder="บางเลน"
                  className="w-full bg-gray-100 rounded px-3 py-2"
                />
              </div>

              <div>
                <label
                  className="block mb-1"
                  dangerouslySetInnerHTML={{
                    __html: highlightRequired("ถนน *"),
                  }}
                />
                <input
                  type="text"
                  placeholder="บางเลน"
                  className="w-full bg-gray-100 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-1">หมู่</label>
                <input
                  type="text"
                  placeholder="หมู่ 2"
                  className="w-full bg-gray-100 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-1">ซอย</label>
                <input
                  type="text"
                  placeholder="ซอย 5"
                  className="w-full bg-gray-100 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-1">ห้อง / ชั้น</label>
                <input
                  type="text"
                  placeholder="ห้อง 707 / ชั้น 6"
                  className="w-full bg-gray-100 rounded px-3 py-2"
                />
              </div>

              <div className="col-span-2">
                <label className="block mb-1">รายละเอียดเพิ่มเติม</label>
                <textarea
                  rows="3"
                  placeholder="รายละเอียด"
                  className="w-full bg-gray-100 rounded px-3 py-2"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* -------------------- รายละเอียดการประเมิน -------------------- */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <div
          className="text-white px-6 py-3 flex items-center rounded-t"
          style={{ backgroundColor: "#0DB26B" }}
        >
          <h2 className="text-lg font-bold">รายละเอียดการประเมิน</h2>
        </div>

        <div className="p-6">
          <table className="w-full border border-gray-500 border-collapse text-sm text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-500 px-2 py-1 w-40">
                  รายละเอียดการประเมิน
                </th>
                <th className="border border-gray-500 px-2 py-1 w-48">
                  รายการ
                </th>
                {grades.map((g, i) => (
                  <th
                    key={i}
                    className="border border-gray-500 px-2 py-1 text-center"
                  >
                    {g}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sections.map((sec, sIndex) => (
                <React.Fragment key={sIndex}>
                  {sec.items.map((item, i) => (
                    <tr key={i}>
                      {i === 0 && (
                        <td
                          rowSpan={sec.items.length}
                          className="border border-gray-500 px-2 py-1 font-semibold text-center align-middle w-40"
                        >
                          {sec.title}
                        </td>
                      )}
                      <td className="border border-gray-500 px-2 py-1 text-left w-48">
                        {item}
                      </td>
                      {grades.map((_, j) => (
                        <td
                          key={j}
                          className="border border-gray-500 w-16 h-8"
                        ></td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <label className="block font-semibold mb-2">
              สรุปผลการพิจารณา
            </label>
            <div className="flex gap-6">
              <label>
                <input type="radio" name="result" /> ผ่าน
              </label>
              <label>
                <input type="radio" name="result" /> ไม่ผ่าน
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------- ความคิดเห็นและข้อเสนอแนะ -------------------- */}
      <div className="bg-white rounded shadow">
        <div
          className="text-white px-6 py-3 flex items-center rounded-t"
          style={{ backgroundColor: "#0DB26B" }}
        >
          <h2 className="text-lg font-bold">
            ความคิดเห็นและข้อเสนอแนะของผู้ควบคุมการฝึกงาน
          </h2>
        </div>

        <div className="p-6 space-y-4">
          {[
            "1. การฝึกงานโครงการสหกิจศึกษาของนิสิตเป็นประโยชน์ต่อนิสิตในตำแหน่งงานอย่างไรหรือไม่อย่างไร *",
            "2. ระยะเวลาการฝึกงานโครงการสหกิจศึกษาของนิสิตเหมาะสมกับลักษณะงานที่ฝึกหรือไม่",
            "3. การฝึกงานสหกิจศึกษาของนิสิตสหกิจศึกษา นิสิตควรมีทัศนคติพฤติกรรมที่เด่นหรือไม่ อย่างไร",
            "4. ปัญหาอุปสรรคและข้อเสนอแนะเกี่ยวกับการปฏิบัติงานของนิสิตที่ควรปรับปรุงแก้ไข และสมควรที่จะปรับปรุงอย่างไร",
            "5. ท่านเห็นว่านิสิตที่เข้ารับการฝึกงานโครงการสหกิจศึกษา มีความพร้อมในด้านใดบ้าง (โปรดเรียงตามลำดับความสำคัญ 1-3)",
          ].map((q, i) => (
            <div key={i}>
              <label
                className="block mb-1"
                dangerouslySetInnerHTML={{ __html: highlightRequired(q) }}
              />
              <textarea
                rows="2"
                placeholder="กรอกข้อมูล"
                className="w-full bg-gray-100 rounded px-3 py-2"
              />
            </div>
          ))}

          {/* ความพร้อม */}
          <div className="space-y-2">
            {[
              "ความพร้อมในด้านความรู้จากศูนย์ที่เกี่ยวกับงาน",
              "ความพร้อมในด้านความรู้ทางด้านปฏิบัติที่นิสิตฝึกงาน",
              "ความพร้อมในด้านปรับตัวให้เข้ากับหน่วยงาน",
              "ความพร้อมในด้านความรับผิดชอบ ความขยัน ความอดทน ซื่อสัตย์และตั้งใจทำงาน",
              "ความพร้อมในด้านมนุษยสัมพันธ์ต่อเพื่อนร่วมงาน",
            ].map((q, i) => (
              <input
                key={i}
                type="text"
                placeholder={q}
                className="w-full bg-gray-100 rounded px-3 py-2"
              />
            ))}
          </div>

          {/* จำนวนรับนิสิต */}
          <div>
            <label className="block mb-1">
              6. ท่านเห็นว่าควรรับนิสิตเข้าฝึกงานโครงการสหกิจศึกษาอีกครั้งต่อไปหรือไม่
            </label>
            <div className="flex items-center gap-4 mb-2">
              <span>รับ จำนวน</span>
              <input
                type="number"
                className="bg-gray-100 rounded px-3 py-1 w-24"
                placeholder="__"
              />
              <span>คน</span>
            </div>
            <div className="flex items-center gap-4">
              <label>
                <input type="radio" name="accept" /> ไม่รับ เพราะ
              </label>
              <input
                type="text"
                className="bg-gray-100 rounded px-3 py-1 flex-1"
                placeholder="กรอกเหตุผล"
              />
            </div>
          </div>

          {/* อื่นๆ */}
          <div>
            <label className="block mb-1">7. อื่นๆ (ถ้ามีโปรดระบุ)</label>
            <textarea
              rows="3"
              placeholder="รายละเอียด"
              className="w-full bg-gray-100 rounded px-3 py-2"
            />
          </div>

          {/* ปุ่ม */}
          <div className="flex justify-end gap-4">
            <button className="px-6 py-2 border rounded text-gray-700">
              ยกเลิก
            </button>
            <button
              className="px-6 py-2 text-white rounded"
              style={{ backgroundColor: "#0DB26B" }}
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
