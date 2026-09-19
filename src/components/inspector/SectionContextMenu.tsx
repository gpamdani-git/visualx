import React, { useState } from 'react';
import { MoreHorizontal, Edit2, Unlink, Trash2, RotateCcw } from 'lucide-react';

interface SectionContextMenuProps {
  onEdit?: () => void;
  onDetach?: () => void;
  onReset?: () => void;
  onDelete?: () => void;
  isLinked?: boolean;
}

export default function SectionContextMenu({ onEdit, onDetach, onReset, onDelete, isLinked }: SectionContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded text-zinc-400 dark:text-[#666] hover:text-zinc-700 dark:hover:text-[#AAA] transition-colors"
      >
        <MoreHorizontal size={14} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 w-36 bg-white dark:bg-[#1A1A1A] border border-zinc-200 dark:border-[#333] rounded-lg shadow-xl py-1">
            {onEdit && (
              <button 
                onClick={() => { onEdit(); setIsOpen(false); }}
                className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-[#252525] text-zinc-800 dark:text-[#DDD]"
              >
                <Edit2 size={12} />
                <span>Edit</span>
              </button>
            )}
            {isLinked && onDetach && (
              <button 
                onClick={() => { onDetach(); setIsOpen(false); }}
                className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-[#252525] text-zinc-800 dark:text-[#DDD]"
              >
                <Unlink size={12} />
                <span>Detach style</span>
              </button>
            )}
            {onReset && (
              <button 
                onClick={() => { onReset(); setIsOpen(false); }}
                className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-[#252525] text-zinc-800 dark:text-[#DDD]"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
            {onDelete && (
              <>
                {(onEdit || onReset || (isLinked && onDetach)) && <div className="h-px bg-zinc-200 dark:bg-[#333] my-1" />}
                <button 
                  onClick={() => { onDelete(); setIsOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                >
                  <Trash2 size={12} />
                  <span>Remove</span>
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
