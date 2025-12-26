"use client";

import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { RefreshCw, Check, X } from "lucide-react";

interface CameraViewProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
}

export default function CameraView({ onCapture, onClose }: CameraViewProps) {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
    }
  }, [webcamRef]);

  const handleConfirm = () => {
    if (imgSrc) {
      onCapture(imgSrc);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="p-4 flex justify-between items-center text-white">
        <button onClick={onClose}><X size={28} /></button>
        <h2 className="font-bold">Ambil Foto Meteran</h2>
        <div className="w-7" /> 
      </div>

      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {!imgSrc ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }}
            className="w-full h-full object-cover"
          />
        ) : (
          <Image src={imgSrc} className="w-full h-full object-cover" alt="Preview" fill unoptimized />
        )}
        
        {!imgSrc && (
          <div className="absolute inset-0 border-40 border-black/40 flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-white rounded-3xl" />
          </div>
        )}
      </div>

      <div className="p-8 bg-black flex justify-center items-center gap-10">
        {!imgSrc ? (
          <button 
            onClick={capture}
            className="w-20 h-20 bg-white rounded-full border-8 border-gray-300 active:scale-90 transition-all"
          />
        ) : (
          <>
            <button 
              onClick={() => setImgSrc(null)}
              className="p-4 bg-red-500 text-white rounded-full"
            >
              <RefreshCw size={28} />
            </button>
            <button 
              onClick={handleConfirm}
              className="p-4 bg-green-500 text-white rounded-full"
            >
              <Check size={28} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}