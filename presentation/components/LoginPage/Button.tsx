interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const Button = ({ label, onClick, disabled }: ButtonProps) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className="w-full bg-blue-600 text-white py-3 rounded-xl mt-6 hover:bg-blue-700 transition-colors"
  >
    {label}
  </button>
);