"use client";

import { Camera, Image as ImageIcon, X } from "lucide-react";

interface ImagePickerSourceProps {
  onCameraClick: () => void;
  onGalleryClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
}

export default function ImagePickerSource({ 
  onCameraClick, 
  onGalleryClick, 
  onClose 
}: ImagePickerSourceProps) {
  return (
    <div className="fixed inset-0 z-60 flex items-end justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-112.5 bg-white rounded-t-4xl p-6 animate-in slide-in-from-bottom duration-300">
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-800 text-lg">Pilih Sumber Foto</h3>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 pb-4">
          <button 
            onClick={onCameraClick}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 border-blue-50 bg-blue-50/30 hover:bg-blue-50 transition-colors"
          >
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
              <Camera size={28} />
            </div>
            <span className="font-bold text-blue-700 text-sm">Ambil Foto</span>
          </button>

          <label className="cursor-pointer flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 border-gray-50 bg-gray-50/50 hover:bg-gray-100 transition-colors">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={onGalleryClick}
            />
            <div className="p-3 bg-gray-600 rounded-2xl text-white shadow-lg shadow-gray-200">
              <ImageIcon size={28} />
            </div>
            <span className="font-bold text-gray-700 text-sm">Galeri</span>
          </label>
        </div>

      </div>
    </div>
  );
}