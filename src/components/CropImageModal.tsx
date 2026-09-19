import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function CropImageModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [src, setSrc] = useState('');

  useEffect(() => {
    const handleOpen = (e: any) => {
      setSrc(e.detail.src);
      setIsOpen(true);
    };
    window.addEventListener('openImageCrop', handleOpen);
    return () => window.removeEventListener('openImageCrop', handleOpen);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-8">
      <div className="bg-white dark:bg-[#111111] rounded-xl border border-zinc-200 dark:border-[#2A2A2A] w-full max-w-5xl h-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-[#2A2A2A]">
          <h2 className="text-zinc-900 dark:text-white text-sm font-medium">Crop Image</h2>
          <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-zinc-900 dark:text-[#888] dark:hover:text-white transition-colors cursor-pointer">
            <X size={16} />
          </button>
        </div>
        
        <div className="flex-1 p-8 bg-zinc-100 dark:bg-[#0a0a0a] flex items-center justify-center relative">
          {/* Mock Crop Area */}
          <div className="relative w-full h-full max-w-3xl max-h-[500px]">
            <img src={src} alt="Crop" className="w-full h-full object-contain opacity-50" />
            
            {/* Crop overlay mockup */}
            <div className="absolute inset-4 border-2 border-white cursor-move flex items-center justify-center overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${src}')` }} />
                {/* Handles */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white cursor-nwse-resize -translate-x-1 -translate-y-1"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white cursor-nesw-resize translate-x-1 -translate-y-1"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white cursor-nesw-resize -translate-x-1 translate-y-1"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white cursor-nwse-resize translate-x-1 translate-y-1"></div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-zinc-200 dark:border-[#2A2A2A] flex justify-between items-center bg-zinc-50 dark:bg-[#111111]">
          <div className="flex gap-2">
            <div className="bg-white dark:bg-[#1A1A1A] border border-zinc-200 dark:border-[#2A2A2A] rounded-md px-3 py-1.5 text-zinc-900 dark:text-white text-xs flex items-center gap-1">
              <span>1600</span>
              <span className="text-zinc-400 dark:text-[#888]">W</span>
            </div>
            <div className="bg-white dark:bg-[#1A1A1A] border border-zinc-200 dark:border-[#2A2A2A] rounded-md px-3 py-1.5 text-zinc-900 dark:text-white text-xs flex items-center gap-1">
              <span>900</span>
              <span className="text-zinc-400 dark:text-[#888]">H</span>
            </div>
          </div>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white text-xs font-medium rounded-lg transition-colors shadow-lg cursor-pointer"
          >
            Crop
          </button>
        </div>
      </div>
    </div>
  );
}
