import React from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';
import { useBuilderStore } from '../store/builderStore';

export default function KeyboardShortcutsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const canvasTheme = useBuilderStore((state) => state?.canvasTheme) || 'dark';
  const isDark = canvasTheme === 'dark';

  if (!isOpen) return null;

  const ShortcutGroup = ({ title, shortcuts }: { title: string, shortcuts: { label: string, keys: string[] }[] }) => (
    <div className="mb-6">
      <h3 className={clsx("text-xs font-semibold mb-3 tracking-wide uppercase", isDark ? "text-zinc-400" : "text-zinc-500")}>
        {title}
      </h3>
      <div className="flex flex-col gap-2">
        {shortcuts.map((sc, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className={clsx("text-sm", isDark ? "text-zinc-300" : "text-zinc-700")}>{sc.label}</span>
            <div className="flex items-center gap-1.5">
              {sc.keys.map((k, idx) => (
                <kbd key={idx} className={clsx(
                  "px-1.5 py-0.5 min-w-[20px] text-center rounded text-xs font-mono font-medium shadow-sm border",
                  isDark ? "bg-zinc-800 border-zinc-700 text-zinc-300" : "bg-white border-zinc-200 text-zinc-700",
                  k === 'or' && "bg-transparent border-transparent shadow-none text-zinc-500 italic px-0"
                )}>
                  {k}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={clsx("absolute inset-0 transition-opacity", isDark ? "bg-black/60 backdrop-blur-sm" : "bg-zinc-900/40 backdrop-blur-sm")} 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className={clsx(
        "relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200",
        isDark ? "bg-[#111111] border border-zinc-800" : "bg-white border border-zinc-200"
      )}>
        <div className={clsx("flex items-center justify-between px-6 py-4 border-b", isDark ? "border-zinc-800" : "border-zinc-100")}>
          <h2 className={clsx("text-lg font-bold", isDark ? "text-white" : "text-zinc-900")}>Keyboard Shortcuts</h2>
          <button 
            onClick={onClose}
            className={clsx("p-2 rounded-full transition-colors", isDark ? "hover:bg-zinc-800 text-zinc-400 hover:text-white" : "hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900")}
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 custom-scrollbar">
          <div>
            <ShortcutGroup 
              title="General"
              shortcuts={[
                { label: 'AI Agent', keys: ['⌘', 'K'] },
                { label: 'Toggle Preview', keys: ['⌘', 'P'] },
                { label: 'Save Project', keys: ['⌘', 'S'] },
                { label: 'Undo', keys: ['⌘', 'Z'] },
                { label: 'Redo', keys: ['⌘', '⇧', 'Z'] },
                { label: 'Zoom In', keys: ['⌘', '+'] },
                { label: 'Zoom Out', keys: ['⌘', '-'] },
                { label: 'Zoom to 100%', keys: ['⌘', '0'] },
                { label: 'Fit to Screen', keys: ['⌘', '1'] },
                { label: 'Zoom to Selection', keys: ['⌘', '2'] },
              ]}
            />
            <ShortcutGroup 
              title="Tools"
              shortcuts={[
                { label: 'Select Tool', keys: ['V'] },
                { label: 'Hand Tool', keys: ['H', 'or', 'Space'] },
                { label: 'Comment Tool', keys: ['C'] },
              ]}
            />
          </div>

          <div>
            <ShortcutGroup 
              title="Editing"
              shortcuts={[
                { label: 'Copy', keys: ['⌘', 'C'] },
                { label: 'Paste', keys: ['⌘', 'V'] },
                { label: 'Duplicate', keys: ['⌘', 'D'] },
                { label: 'Delete', keys: ['Backspace', 'or', 'Delete'] },
                { label: 'Remove Frame (Unwrap)', keys: ['⌘', 'Backspace'] },
                { label: 'Multi-Select', keys: ['Shift', '+', 'Click'] },
              ]}
            />
            <ShortcutGroup 
              title="Add Elements"
              shortcuts={[
                { label: 'Add Frame', keys: ['F'] },
                { label: 'Add Stack', keys: ['S'] },
                { label: 'Add Grid', keys: ['G'] },
                { label: 'Add Masonry', keys: ['M'] },
                { label: 'Add Text', keys: ['T'] },
                { label: 'Add Image', keys: ['I'] },
                { label: 'Add Video', keys: ['V'] },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
