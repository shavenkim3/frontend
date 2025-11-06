export function InputGroup({ id, value, onChange, placeholder }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-blue-50 p-3 shadow-sm focus-within:ring-2 focus-within:ring-emerald-400">
      <input
        id={id}
        type="text"
        inputMode="text"
        autoComplete="off"
        className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
}
