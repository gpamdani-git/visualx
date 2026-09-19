import React, { useState } from 'react';
import { Search, X, ChevronLeft } from 'lucide-react';
import { TextToken } from '../../types/project';
import { useProjectStore } from '../../store/projectStore';
import TextStyleEditor from './TextStyleEditor'; // We'll adapt it to work inline or we'll build a custom one

interface TextStyleSelectorProps {
  tokens: TextToken[];
  onSelect: (token: TextToken) => void;
  onClose: () => void;
  onEdit: (token: TextToken) => void;
  onCreateNew: () => void;
  top?: number;
  left?: number;
}

export default function TextStyleSelector({ tokens, onSelect, onClose, onEdit, onCreateNew, top, left }: TextStyleSelectorProps) {
  const [search, setSearch] = useState('');
  const filtered = tokens.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div 
      className="fixed z-[100] w-[280px] bg-white dark:bg-[#1A1A1A] border border-zinc-200 dark:border-[#222] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95"
      style={{ top: top ?? 120, left: left ?? undefined, right: left ? undefined : 270 }} 
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-[#222]">
        <span className="text-base font-bold text-zinc-900 dark:text-white">Text Styles</span>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="px-4 py-3">
        <div className="relative flex items-center bg-transparent border-b border-zinc-200 dark:border-[#333]">
          <Search size={16} className="text-zinc-400 absolute left-0" />
          <input 
            type="text" 
            autoFocus
            placeholder="Search..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent pl-7 pr-2 py-2 text-sm text-zinc-900 dark:text-white outline-none placeholder-zinc-400"
          />
        </div>
      </div>

      <div className="max-h-[300px] overflow-y-auto custom-scrollbar px-2 flex flex-col gap-0.5">
        {filtered.length === 0 ? (
           <div className="px-3 py-4 text-xs text-zinc-500 text-center">No text styles found</div>
        ) : (
          filtered.map(token => (
            <div
              key={token.id}
              className="group flex items-center justify-between w-full text-left px-3 py-2 rounded-xl text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-[#2A2A2A] cursor-pointer"
              onClick={() => {
                onSelect(token);
                onClose();
              }}
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-zinc-900 dark:text-white w-6">{token.name.substring(0, 2).toUpperCase()}</span>
                <span className="text-zinc-600 dark:text-[#CCC]">{token.name}</span>
              </div>
              <div className="flex items-center">
                <span className="text-zinc-400 dark:text-[#666] group-hover:hidden text-xs">
                  {token.fontSize}px / {token.lineHeight}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(token);
                  }}
                  className="hidden group-hover:flex items-center justify-center px-3 py-1 bg-zinc-200 dark:bg-[#333] hover:bg-zinc-300 dark:hover:bg-[#444] rounded-lg text-xs font-medium text-zinc-900 dark:text-white transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-zinc-100 dark:border-[#222]">
        <button 
          onClick={() => {
            onCreateNew();
          }}
          className="w-full py-2 bg-zinc-100 dark:bg-[#2A2A2A] hover:bg-zinc-200 dark:hover:bg-[#333] text-zinc-900 dark:text-white font-medium rounded-xl text-sm transition-colors"
        >
          New Style
        </button>
      </div>
    </div>
  );
}
