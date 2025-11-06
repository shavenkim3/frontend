"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * ดึงข้อมูลโปรไฟล์อาจารย์จาก backend (/auth/advisor/me)
 */
export function useAdvisorMe() {
  const [advisor, setAdvisor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token =
      localStorage.getItem("advisor_token") ||
      localStorage.getItem("token") ||
      "";

    if (!token) {
      setError("missing_token");
      setLoading(false);
      return;
    }

    async function fetchAdvisor() {
      try {
        const res = await fetch(`${API_URL}/auth/advisor/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `HTTP ${res.status}`);
        }

        const data = await res.json();
        setAdvisor(data.advisor);
      } catch (err) {
        console.error("useAdvisorMe error:", err);
        setError(err.message || "unknown");
      } finally {
        setLoading(false);
      }
    }

    fetchAdvisor();
  }, []);

  return { advisor, loading, error };
}
