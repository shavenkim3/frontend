"use client";

import { useEffect, useState } from "react";
import { adminMe, adminLogout } from "@/lib/adminApi";

function useAdminMe() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchAdmin() {
    try {
      setLoading(true);
      const data = await adminMe(); // จะ throw ถ้า 401
      setAdmin(data?.admin || null);
      setError("");
    } catch (err) {
      const msg = err?.message || "กรุณา login ก่อน";
      setError(msg);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAdmin(); }, []);

  function logout() {
    adminLogout();
    if (typeof window !== "undefined") window.location.href = "/admin/login_admin";
  }

  return { admin, loading, error, refetch: fetchAdmin, logout };
}

export { useAdminMe };       // ✅ named export
export default useAdminMe;   // ✅ default export
