// frontend/lib/auth-token.js
export function getToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("student_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("jwt") ||
    ""
  );
}