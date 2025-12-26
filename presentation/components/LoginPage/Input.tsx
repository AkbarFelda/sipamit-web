interface InputProps {
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (val: string) => void;
  type?: "text" | "number" | "email";
}

export default function Input({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  type = "text" 
}: InputProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-black shadow-sm"
      />
    </div>
  );
}