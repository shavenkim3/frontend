// app/layout.js
import { Inter, Kanit } from "next/font/google";
import "./globals.css";

// ✅ โหลดฟอนต์ Inter (ภาษาอังกฤษ)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// ✅ โหลดฟอนต์ Kanit (ภาษาไทย)
const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit",
  display: "swap",
});

// ✅ metadata เดิม (ไม่แตะต้อง)
export const metadata = {
  title: "ระบบจัดการข้อมูลนิสิต",
  description: "ระบบจัดการสหกิจศึกษาและโครงงานพิเศษ",
  icons: {
    icon: [
      { url: "/logo/IT_logo.png", type: "image/png", sizes: "32x32" },
      { url: "/logo/IT_logo.png?v=2" }, // กันแคช
    ],
    shortcut: "/logo/IT_logo.png?v=2",
    apple: "/logo/IT_logo.png?v=2",
  },
};

// ✅ layout หลัก
export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body
        className={`${inter.variable} ${kanit.variable} antialiased font-[var(--font-kanit)]`}
      >
        {children}
      </body>
    </html>
  );
}
