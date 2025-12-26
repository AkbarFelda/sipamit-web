"use client"; // Wajib karena ada interaksi tombol mata

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputPasswordProps {
  value: string;
  onChange: (val: string) => void;
  label?: string; 
  placeholder?: string;
}

export default function InputPassword({ 
  value, 
  onChange, 
  label = "Password", 
  placeholder = "Masukkan Password" 
}: InputPasswordProps) {
  
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      
      <div className="relative">
        <input
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)} 
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl border border-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />

        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
}