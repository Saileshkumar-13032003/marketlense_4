export default function Input({ label, type = "text", value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded-lg bg-gray-900 border-gray-700 focus:ring focus:ring-blue-500"
      />
    </div>
  );
}
