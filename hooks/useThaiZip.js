// frontend/hooks/useThaiZip.js
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { lookupZipSummary } from "@/lib/thaiAddressClient";

export function useThaiZip(initialZip = "") {
  const [zip, setZip] = useState(initialZip);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [subdistrict, setSubdistrict] = useState("");
  const [subdistrictOptions, setSubdistrictOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const cleanZip = useMemo(
    () => String(zip || "").replace(/\D+/g, "").slice(0, 5),
    [zip]
  );

  // debounce 300ms ตอนพิมพ์ zip
  const timerRef = useRef(null);
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (cleanZip.length !== 5) {
      setErr("");
      setProvince(""); setDistrict(""); setSubdistrict("");
      setSubdistrictOptions([]);
      return;
    }

    timerRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        setErr("");
        const info = await lookupZipSummary(cleanZip);
        if (!info) {
          setProvince(""); setDistrict(""); setSubdistrict("");
          setSubdistrictOptions([]);
          setErr("ไม่พบรหัสไปรษณีย์นี้");
          return;
        }
        setProvince(info.province || "");
        setDistrict(info.district || "");
        setSubdistrictOptions(info.subdistricts || []);
        // auto เลือกตำบลถ้ามีตัวเดียว
        if (info.subdistricts?.length === 1) {
          setSubdistrict(info.subdistricts[0]);
        } else if (!info.subdistricts?.includes(subdistrict)) {
          setSubdistrict("");
        }
      } catch (e) {
        setErr("เกิดข้อผิดพลาดในการค้นหา");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cleanZip]);

  return {
    zip, setZip,
    province, setProvince,
    district, setDistrict,
    subdistrict, setSubdistrict,
    subdistrictOptions,
    loading, err,
  };
}
