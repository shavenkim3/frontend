"use client";

import SidebarCompany from "@/components/ui/company/SidebarCompany";
import NavbarCompany from "@/components/ui/company/NavbarCompany";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const MOBILE_BP = 800;
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const goto = (path) => (e) => {
    e?.preventDefault?.();
    router.push(path);
    if (isMobile) setMobileOpen(false);
  };

  const handleResize = useCallback(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1920;
    const mobile = w < MOBILE_BP;
    setIsMobile(mobile);
    if (mobile) {
      setCollapsed(true);
    } else {
      setMobileOpen(false);
      setCollapsed(false);
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const handleLogout = () => router.push("/company/login_company");

  return (
    <div
      style={{
        fontFamily: "Kanit, sans-serif",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <NavbarCompany
        collapsed={collapsed}
        username="Company User"
        onLogout={handleLogout}
        onMenuClick={() =>
          isMobile ? setMobileOpen((v) => !v) : setCollapsed((v) => !v)
        }
        onToggleSidebar={() =>
          isMobile ? setMobileOpen((v) => !v) : setCollapsed((v) => !v)
        }
      />

      {isMobile && mobileOpen && (
        <div
          className="drawer-backdrop"
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 1500,
          }}
        />
      )}

      <SidebarCompany
        collapsed={isMobile ? false : collapsed}
        onToggle={() =>
          isMobile ? setMobileOpen((v) => !v) : setCollapsed((v) => !v)
        }
        goto={goto}
      />

      <main
        style={{
          marginLeft: collapsed ? "60px" : "220px",
          padding: "80px 20px",
          textAlign: "center",
          transition: "margin-left 0.3s ease",
        }}
      >
        <h1 style={{ fontSize: "2rem", color: "#333" }}>
          สวัสดีจากหน้าแดชบอร์ดบริษัท 🎉
        </h1>
      </main>
    </div>
  );
}
