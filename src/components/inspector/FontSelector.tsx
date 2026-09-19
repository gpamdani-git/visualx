import React, { useState } from 'react';
import { Search, X, MoreHorizontal, ChevronDown } from 'lucide-react';

const FONTS = [
  'Inter', 'Syne', 'Plus Jakarta Sans', 'Instrument Sans', 'Playfair Display', 
  'Outfit', 'Satoshi', 'Sarala', 'Sarina', 'Sarpanch', 'Sassy Frass', 'Satisfy', 
  'Savate', 'Sawarabi Gothic', 'Sawarabi Mincho', 'Scada', 'Scheherazade New',
  'system-ui', 'monospace'
];

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
  onClose: () => void;
  top?: number;
  left?: number;
}

export default function FontSelector({ value, onChange, onClose, top, left }: FontSelectorProps) {
  const [search, setSearch] = useState('');
  
  const filtered = FONTS.filter(f => f.toLowerCase().includes(search.toLowerCase()));

  // We are removing reliance on passed top/left if they are 0.
  // We'll calculate a fixed position assuming Right Sidebar is 256px wide + padding.
  
  return (
    <div 
      className="fixed z-[100] w-72 bg-white dark:bg-[#1A1A1A] border border-zinc-200 dark:border-[#222] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95"
      style={{ top: top ?? 180, left: left ?? undefined, right: left ? undefined : 270 }} 
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-base font-bold text-zinc-900 dark:text-white">Fonts</span>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Search & Category */}
      <div className="px-4 pb-2 space-y-3">
        <div className="relative">
          <input 
            type="text" 
            autoFocus
            placeholder="Search" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-[1.5px] border-[#0099FF] rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white outline-none placeholder-zinc-400"
          />
        </div>
        
        <div className="relative">
          <select className="w-full appearance-none bg-zinc-100 dark:bg-[#222] border border-transparent rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white outline-none cursor-pointer">
            <option>All</option>
            <option>Sans Serif</option>
            <option>Serif</option>
            <option>Display</option>
            <option>Handwriting</option>
            <option>Monospace</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
        </div>
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto custom-scrollbar px-2 pb-2 flex flex-col gap-0.5 mt-2">
        {filtered.map(f => {
          const isSelected = value.split(',')[0].replace(/['"]/g, '').trim() === f;
          return (
            <button
              key={f}
              onClick={() => {
                const val = f === 'system-ui' ? 'system-ui, sans-serif' : f === 'monospace' ? 'monospace' : `${f}, sans-serif`;
                onChange(val);
                onClose();
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-[15px] transition-colors flex items-center justify-between group ${
                isSelected 
                  ? 'bg-[#0099FF] text-white' 
                  : 'text-zinc-800 dark:text-[#E0E0E0] hover:bg-zinc-100 dark:hover:bg-[#2A2A2A]'
              }`}
            >
              <span style={{ fontFamily: f, fontSize: '18px' }} className="truncate pr-2">{f}</span>
              {isSelected ? (
                <div 
                  className="p-1 hover:bg-white/20 rounded-md transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Context menu action here
                  }}
                >
                  <MoreHorizontal size={18} />
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
