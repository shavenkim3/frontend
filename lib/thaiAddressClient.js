// frontend/lib/thaiAddressClient.js

let _dbCache = null;

/** โหลดฐานข้อมูลครั้งแรกแบบ dynamic (ลดขนาด bundle) */
async function loadDB() {
  if (_dbCache) return _dbCache;
  const mod = await import("thai-address-database"); // data เป็น array
  _dbCache = mod.default || mod;
  return _dbCache;
}

/** คืนรายการที่ตรงรหัสไปรษณีย์ (อาจมีหลายตำบลในรหัสเดียว) */
export async function listByZip(zip) {
  if (!zip) return [];
  const z = String(zip).replace(/\D+/g, "").slice(0, 5);
  if (z.length !== 5) return [];
  const db = await loadDB();
  return db.filter((r) => String(r.zipcode) === z);
}

/** ใช้ง่ายๆ: ดึง province/district + รายการ subdistricts จาก zip */
export async function lookupZipSummary(zip) {
  const rows = await listByZip(zip);
  if (rows.length === 0) return null;
  const province = rows[0]?.province ?? null;
  const district = rows[0]?.amphoe ?? null;
  // รหัสเดียวมักมีหลายตำบล -> รวมเป็นลิสต์ให้เลือก
  const subdistricts = Array.from(new Set(rows.map((r) => r.tambon).filter(Boolean)));
  return { province, district, subdistricts, zipcode: String(zip).slice(0, 5) };
}
