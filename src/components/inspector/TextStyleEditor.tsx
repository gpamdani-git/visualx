import React, { useState } from 'react';
import { X, Type, ChevronLeft, Search, Trash2, SlidersHorizontal, Bold, Italic, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { TextToken } from '../../types/project';
import { useProjectStore } from '../../store/projectStore';
import FontSelector from './FontSelector';
import ColorPopover from './ColorPopover';

interface TextStyleEditorProps {
  token: TextToken;
  onClose: () => void;
  position?: { top: number; left: number };
}

export default function TextStyleEditor({ token, onClose, position = { top: 120, left: 264 } }: TextStyleEditorProps) {
  const updateTextToken = useProjectStore(state => state.updateTextToken);
  
  const [tokenName, setTokenName] = useState(token.name);
  const [showFontSelector, setShowFontSelector] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const handleUpdate = (updates: Partial<TextToken>) => {
    updateTextToken(token.id, updates);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenName(e.target.value);
    handleUpdate({ name: e.target.value });
  };
  
  const handleColorChange = (color: string) => {
    handleUpdate({ color });
  };

  return (
    <div 
      className="fixed z-[9999] w-72 bg-white dark:bg-[#222] border border-zinc-200 dark:border-[#333] rounded-xl shadow-2xl flex flex-col select-none animate-in fade-in zoom-in-95"
      style={{ top: position.top, left: position.left }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-zinc-200 dark:border-[#333]">
        <div className="flex items-center gap-2 w-full">
          <button onClick={onClose} className="p-1 hover:bg-zinc-100 dark:hover:bg-[#333] rounded text-zinc-400">
            <ChevronLeft size={16} />
          </button>
          <input 
            type="text" 
            value={tokenName}
            onChange={handleNameChange}
            className="flex-1 text-center bg-transparent text-sm font-semibold text-zinc-900 dark:text-white outline-none"
            placeholder="Edit Style Name..."
          />
          <button onClick={onClose} className="p-1 hover:bg-zinc-100 dark:hover:bg-[#333] rounded text-zinc-400">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-3 custom-scrollbar overflow-y-auto max-h-[60vh]">
        {/* Font */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-zinc-600 dark:text-[#A0A0A0] w-16">Font</span>
          <button 
            onClick={() => setShowFontSelector(true)}
            className="flex-1 text-left px-2 py-1.5 bg-zinc-50 dark:bg-[#222] border border-zinc-200 dark:border-[#222] hover:dark:border-[#333] hover:border-[#0099FF] dark:hover:border-[#0099FF] rounded-md text-xs text-zinc-900 dark:text-white flex items-center justify-between"
          >
            <span style={{ fontFamily: token.fontFamily }}>{token.fontFamily.split(',')[0]}</span>
            <span className="text-zinc-400">▾</span>
          </button>
        </div>

        {/* Weight */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-zinc-600 dark:text-[#A0A0A0] w-16">Weight</span>
          <select 
            value={token.fontWeight}
            onChange={(e) => handleUpdate({ fontWeight: parseInt(e.target.value) })}
            className="flex-1 appearance-none px-2 py-1.5 bg-zinc-50 dark:bg-[#222] border border-zinc-200 dark:border-[#222] hover:dark:border-[#333] rounded-md text-xs text-zinc-900 dark:text-white outline-none cursor-pointer"
          >
            <option value={100}>Thin (100)</option>
            <option value={200}>Extra Light (200)</option>
            <option value={300}>Light (300)</option>
            <option value={400}>Regular (400)</option>
            <option value={500}>Medium (500)</option>
            <option value={600}>Semi Bold (600)</option>
            <option value={700}>Bold (700)</option>
            <option value={800}>Extra Bold (800)</option>
            <option value={900}>Black (900)</option>
          </select>
        </div>

        {/* Color */}
        <div className="flex items-center justify-between gap-2 relative">
          <span className="text-xs text-zinc-600 dark:text-[#A0A0A0] w-16">Color</span>
          <button 
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex-1 flex items-center gap-2 px-2 py-1.5 bg-zinc-50 dark:bg-[#222] border border-zinc-200 dark:border-[#222] hover:dark:border-[#333] rounded-md"
          >
            <div 
              className="w-4 h-4 rounded shadow-sm border border-black/10" 
              style={{ backgroundColor: token.color || '#000000' }} 
            />
            <span className="text-xs text-zinc-900 dark:text-white uppercase font-mono">{token.color || '#000000'}</span>
          </button>
          
          {showColorPicker && (
            <ColorPopover 
              color={token.color || '#000000'}
              onChange={handleColorChange}
              onClose={() => setShowColorPicker(false)}
              singleOnly={true}
              top={0} // Will be styled via relative parent
            />
          )}
        </div>

        {/* Size / Line Height */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs text-zinc-600 dark:text-[#A0A0A0] w-16">Size</span>
            <input 
              type="number" 
              value={token.fontSize}
              onChange={(e) => handleUpdate({ fontSize: parseInt(e.target.value) || 16 })}
              className="w-16 px-2 py-1.5 bg-zinc-50 dark:bg-[#222] border border-zinc-200 dark:border-[#222] hover:dark:border-[#333] rounded-md text-xs text-zinc-900 dark:text-white outline-none text-right"
            />
            <span className="text-xs text-zinc-400">px</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs text-zinc-600 dark:text-[#A0A0A0] w-16">Line</span>
            <input 
              type="text" 
              value={token.lineHeight}
              onChange={(e) => handleUpdate({ lineHeight: e.target.value })}
              className="w-16 px-2 py-1.5 bg-zinc-50 dark:bg-[#222] border border-zinc-200 dark:border-[#222] hover:dark:border-[#333] rounded-md text-xs text-zinc-900 dark:text-white outline-none text-right"
            />
            <span className="text-xs text-zinc-400">em</span>
          </div>
        </div>

        {/* Align */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-zinc-600 dark:text-[#A0A0A0] w-16">Align</span>
          <div className="flex-1 flex items-center bg-zinc-100 dark:bg-[#222] rounded-lg p-0.5 border border-zinc-200 dark:border-[#222]">
            {['left', 'center', 'right', 'justify'].map(a => (
              <button 
                key={a}
                onClick={() => handleUpdate({ textAlign: a as any })}
                className={`flex-1 flex items-center justify-center p-1 rounded-md transition-colors ${
                  (token.textAlign || 'left') === a 
                    ? 'bg-white dark:bg-[#333] text-zinc-900 dark:text-white shadow-sm rounded-md' 
                    : 'text-zinc-500 dark:text-[#888] hover:text-zinc-800 dark:hover:text-[#CCC]'
                }`}
              >
                {a === 'left' && <AlignLeft size={13} />}
                {a === 'center' && <AlignCenter size={13} />}
                {a === 'right' && <AlignRight size={13} />}
                {a === 'justify' && <AlignJustify size={13} />}
              </button>
            ))}
          </div>
        </div>
        
        {/* Decoration */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-zinc-600 dark:text-[#A0A0A0] w-16">Decoration</span>
          <div className="flex-1 flex items-center gap-2">
            <button 
              onClick={() => handleUpdate({ textDecoration: token.textDecoration === 'underline' ? 'none' : 'underline' })}
              className={`flex-1 flex items-center justify-center p-1.5 border rounded-md transition-colors ${token.textDecoration === 'underline' ? 'bg-[#0099FF]/10 border-[#0099FF] text-zinc-900 dark:text-white' : 'border-zinc-200 dark:border-[#333] bg-zinc-50 dark:bg-[#111] text-zinc-600 dark:text-[#A0A0A0]'}`}
            >
              <span className="text-xs underline font-medium">U</span>
            </button>
            <button 
              onClick={() => handleUpdate({ textDecoration: token.textDecoration === 'line-through' ? 'none' : 'line-through' })}
              className={`flex-1 flex items-center justify-center p-1.5 border rounded-md transition-colors ${token.textDecoration === 'line-through' ? 'bg-[#0099FF]/10 border-[#0099FF] text-zinc-900 dark:text-white' : 'border-zinc-200 dark:border-[#333] bg-zinc-50 dark:bg-[#111] text-zinc-600 dark:text-[#A0A0A0]'}`}
            >
              <span className="text-xs line-through font-medium">S</span>
            </button>
            <button 
              onClick={() => handleUpdate({ textTransform: token.textTransform === 'uppercase' ? 'none' : 'uppercase' })}
              className={`flex-1 flex items-center justify-center p-1.5 border rounded-md transition-colors ${token.textTransform === 'uppercase' ? 'bg-[#0099FF]/10 border-[#0099FF] text-zinc-900 dark:text-white' : 'border-zinc-200 dark:border-[#333] bg-zinc-50 dark:bg-[#111] text-zinc-600 dark:text-[#A0A0A0]'}`}
            >
              <span className="text-xs font-medium">TT</span>
            </button>
          </div>
        </div>

      </div>

      {showFontSelector && (
        <FontSelector 
          value={token.fontFamily}
          onChange={(f) => handleUpdate({ fontFamily: f })}
          onClose={() => setShowFontSelector(false)}
          top={position.top}
          left={position.left + 280}
        />
      )}
    </div>
  );
}
