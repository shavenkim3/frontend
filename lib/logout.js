// lib/logout.js
export function logoutAll() {
  try {
    // 🔹 ลบ token ของทุก role
    localStorage.removeItem("student_token");
    localStorage.removeItem("advisor_token");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("company_token");
    localStorage.removeItem("token");

    // 🔹 ล้างข้อมูลอื่น ๆ ที่อาจเก็บไว้
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_profile");
    sessionStorage.clear();

    // 🔹 redirect ไปหน้า login กลาง (หรือเปลี่ยน path ตามที่คุณใช้)
    window.location.href = "/";
  } catch (err) {
    console.error("Logout error:", err);
  }
}
