export default function Card({ children, className = "" }) {
  return (
    <div className={"w-full max-w-md bg-white rounded-2xl shadow-xl p-8 " + className}>
      {children}
    </div>
  );
}
