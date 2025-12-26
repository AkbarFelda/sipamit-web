interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button = ({ label, onClick }: ButtonProps) => (
  <button 
    onClick={onClick}
    className="w-full bg-blue-600 text-white py-3 rounded-xl mt-6 hover:bg-blue-700 transition-colors"
  >
    {label}
  </button>
);