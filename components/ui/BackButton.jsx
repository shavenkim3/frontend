import { CircleArrowLeft } from "lucide-react";

export default function BackButton({ onClick }) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof onClick === "function") onClick();
  };

  return (
    <button
      type="button"
      className="back-btn"
      onClick={handleClick}
      aria-label="ย้อนกลับหน้าหลัก"
      title="ย้อนกลับ"
    >
      <CircleArrowLeft size={28} strokeWidth={2} color="#00a77f" />
      <style jsx>{`
        .back-btn {
          position: fixed;
          top: 1.25rem;
          left: 1.25rem;
          z-index: 1000;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease, opacity 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .back-btn:hover { transform: translateX(-2px); opacity: 0.85; }
      `}</style>
    </button>
  );
}
