interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function MobileContainer({ children, className = "" }: MobileContainerProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <main className={`w-full max-w-112.5 min-h-screen bg-white shadow-2xl relative overflow-x-hidden ${className}`}>
        {children}
      </main>
    </div>
  );
}