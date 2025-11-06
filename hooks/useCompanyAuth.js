"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { companyToken, clearCompanyToken } from "@/lib/api";

/**
 * requireNoMCP = true  -> ถ้าบัญชีโดนบังคับเปลี่ยนรหัสผ่าน จะ redirect ไป /company/change-password
 * requireNoMCP = false -> อยู่หน้าไหนก็ได้ (รวมหน้า change-password เอง)
 */
export default function useCompanyAuth({ requireNoMCP = false } = {}) {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = companyToken();
    if (!t) { router.replace("/"); return; }

    api.company.me(t)
      .then((m) => {
        setMe(m);
        if (requireNoMCP && m.must_change_password) {
          router.replace("/company/change-password");
        }
      })
      .catch(() => {
        clearCompanyToken();
        router.replace("/");
      })
      .finally(() => setLoading(false));
  }, [router, requireNoMCP]);

  const logout = () => { clearCompanyToken(); router.replace("/"); };

  return { me, loading, logout };
}
