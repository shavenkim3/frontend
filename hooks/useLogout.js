"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const logout = useCallback(
    async (redirectTo = "/student/login_student") => {
      if (loading) return;
      setLoading(true);

      try {
        // เรียก backend เพื่อเคลียร์คุกกี้ session/token
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          credentials: "include", // ต้องมี เพื่อให้ส่ง cookie ไปด้วย
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("Logout failed:", err);
      } finally {
        // ล้าง token ฝั่ง client กันพลาด
        localStorage.removeItem("student_token");
        localStorage.removeItem("advisor_token");
        localStorage.removeItem("company_token");
        localStorage.removeItem("token");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("role");

        // กลับหน้า login
        router.replace(redirectTo);
        setLoading(false);
      }
    },
    [loading, router]
  );

  return { logout, loading };
}
