"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPopup({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-4xl p-8 flex flex-col items-center max-w-xs w-full shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          className="text-blue-600 mb-4"
        >
          <CheckCircle2 size={80} strokeWidth={2.5} />
        </motion.div>
        
        <h3 className="text-xl font-black text-gray-800 text-center leading-tight">
          Berhasil!
        </h3>
        <p className="text-gray-500 text-sm text-center mt-2 font-medium">
          {message}
        </p>
      </motion.div>
    </div>
  );
}