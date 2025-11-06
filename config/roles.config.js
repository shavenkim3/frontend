import { GraduationCap, School, Shield, Building2 } from "lucide-react";

export const roles = [
  { label: "นิสิต",  sub: "Student",  href: "/student/login_student",  Icon: GraduationCap },
  { label: "อาจารย์",  sub: "advisor",  href: "/advisor/login_advisor",  Icon: School },
  { label: "แอดมิน",   sub: "Admin",    href: "/admin/login_admin",   Icon: Shield },
  { label: "หน่วยงานภายนอก", sub: "Company", href: "/company/login_company", Icon: Building2 },
];
