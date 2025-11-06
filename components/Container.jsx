export default function Container({ children, className = "" }) {
  return (
    <div
      className={
        "w-full min-h-screen flex items-center justify-center " +
        "bg-gradient-to-br from-emerald-200 via-white to-emerald-100 " +
        "[background-image:radial-gradient(circle_at_top_left,rgba(16,185,129,0.15),transparent_40%)," +
        "radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.15),transparent_40%)] " +
        "p-4 " + className
      }
    >
      {children}
    </div>
  );
}
