import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Sun, Moon, Pipette, Check, Trash2, Copy, Sparkles, SlidersHorizontal } from 'lucide-react';
import { ColorToken } from '../types/project';
import { useProjectStore } from '../store/projectStore';
import { showToast } from '../store/toastStore';
import clsx from 'clsx';

interface FloatingStyleEditorProps {
  token: ColorToken;
  onClose: () => void;
  position?: { top: number; left: number };
}

// Color conversion helpers
function hexToRgb(hex: string): { r: number; g: number; b: number; a: number } {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  if (cleanHex.length === 6) {
    cleanHex += 'ff';
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) return { r: 0, g: 0, b: 0, a: 1 };
  return {
    r: (num >> 24) & 255,
    g: (num >> 16) & 255,
    b: (num >> 8) & 255,
    a: Math.round(((num & 255) / 255) * 100) / 100
  };
}

function rgbToHex(r: number, g: number, b: number, a = 1): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  const alphaHex = a < 1 ? toHex(Math.round(a * 255)) : '';
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`.toUpperCase();
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  h = h / 360;
  s = s / 100;
  v = v / 100;
  let r = 0, g = 0, b = 0;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

const PRESET_SWATCHES = [
  '#0A0A0A', '#141414', '#1F1F24', '#27272A', '#3F3F46', '#71717A', '#A1A1AA', '#FFFFFF',
  '#0099FF', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B', '#10B981'
];

export default function FloatingStyleEditor({
  token,
  onClose,
  position = { top: 120, left: 264 }
}: FloatingStyleEditorProps) {
  const updateColorToken = useProjectStore((state) => state.updateColorToken);
  const deleteColorToken = useProjectStore((state) => state.deleteColorToken);

  const [activeMode, setActiveMode] = useState<'dark' | 'light'>('dark');
  const [tokenName, setTokenName] = useState(token.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [colorFormat, setColorFormat] = useState<'HEX' | 'RGB' | 'HSL'>('HEX');

  // Active color string
  const currentColor = activeMode === 'dark' ? (token.darkValue || '#0A0A0A') : (token.lightValue || '#FFFFFF');

  // Parse color into HSV and Alpha
  const { h, s, v, a } = useMemo(() => {
    const rgb = hexToRgb(currentColor);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    return { h: hsv.h, s: hsv.s, v: hsv.v, a: rgb.a };
  }, [currentColor]);

  const [hue, setHue] = useState(h);
  const [sat, setSat] = useState(s);
  const [val, setVal] = useState(v);
  const [alpha, setAlpha] = useState(a);

  // Sync state when activeMode or token changes
  useEffect(() => {
    const rgb = hexToRgb(currentColor);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    setHue(hsv.h);
    setSat(hsv.s);
    setVal(hsv.v);
    setAlpha(rgb.a);
  }, [activeMode, token.id]);

  // Reference for dragging 2D Saturation/Value palette
  const satValRef = useRef<HTMLDivElement>(null);
  const isDraggingPalette = useRef(false);
  const isDraggingHue = useRef(false);
  const isDraggingAlpha = useRef(false);

  // Update color token helper
  const applyColor = (newHue: number, newSat: number, newVal: number, newAlpha: number) => {
    const rgb = hsvToRgb(newHue, newSat, newVal);
    const newHex = rgbToHex(rgb.r, rgb.g, rgb.b, newAlpha);
    if (activeMode === 'dark') {
      updateColorToken(token.id, { darkValue: newHex });
    } else {
      updateColorToken(token.id, { lightValue: newHex });
    }
  };

  // 2D Sat/Val pointer interaction
  const handlePalettePointer = (e: React.PointerEvent | MouseEvent) => {
    if (!satValRef.current) return;
    const rect = satValRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    const newSat = Math.round((x / rect.width) * 100);
    const newVal = Math.round((1 - y / rect.height) * 100);

    setSat(newSat);
    setVal(newVal);
    applyColor(hue, newSat, newVal, alpha);
  };

  const handlePaletteDown = (e: React.PointerEvent) => {
    e.preventDefault();
    isDraggingPalette.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    handlePalettePointer(e);
  };

  // Hue bar pointer interaction
  const handleHuePointer = (e: React.PointerEvent | MouseEvent, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const newHue = Math.round((x / rect.width) * 360);
    setHue(newHue);
    applyColor(newHue, sat, val, alpha);
  };

  // Alpha bar pointer interaction
  const handleAlphaPointer = (e: React.PointerEvent | MouseEvent, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const newAlpha = Math.round((x / rect.width) * 100) / 100;
    setAlpha(newAlpha);
    applyColor(hue, sat, val, newAlpha);
  };

  // Eyedropper API
  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          const rgb = hexToRgb(result.sRGBHex);
          const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
          setHue(hsv.h);
          setSat(hsv.s);
          setVal(hsv.v);
          setAlpha(1);
          applyColor(hsv.h, hsv.s, hsv.v, 1);
        }
      } catch (err) {
        console.warn('EyeDropper cancelled:', err);
      }
    } else {
      showToast('EyeDropper not supported in this browser', undefined, 'info');
    }
  };

  // Name rename
  const handleSaveName = () => {
    setIsEditingName(false);
    if (tokenName.trim() && tokenName.trim() !== token.name) {
      updateColorToken(token.id, { name: tokenName.trim() });
      showToast(`Renamed style to '${tokenName.trim()}'`, undefined, 'success');
    } else {
      setTokenName(token.name);
    }
  };

  // Hex display
  const currentHexClean = currentColor.replace('#', '').toUpperCase();

  return (
    <div 
      className="fixed z-[9999] w-[290px] bg-[#1C1C20] border border-[#2D2D35] rounded-xl shadow-2xl flex flex-col text-white select-none backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
      style={{ top: position.top, left: position.left }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Header with Title and Mode Switch */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#2D2D35]">
        <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
          <div 
            className="w-4 h-4 rounded-full border border-white/20 shrink-0 shadow-inner"
            style={{ backgroundColor: currentColor }}
          />
          {isEditingName ? (
            <input 
              type="text"
              autoFocus
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveName();
                if (e.key === 'Escape') {
                  setTokenName(token.name);
                  setIsEditingName(false);
                }
              }}
              className="bg-[#121215] border border-[#0099FF] rounded px-1.5 py-0.5 text-xs text-white font-medium outline-none w-full"
            />
          ) : (
            <span 
              onClick={() => setIsEditingName(true)}
              className="text-xs font-semibold text-white truncate cursor-text hover:text-zinc-900 dark:text-white transition-colors"
              title="Click to rename"
            >
              {token.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Light / Dark Mode Toggle Tabs (Image 1) */}
          <div className="flex items-center bg-[#121216] border border-[#2B2B33] rounded-md p-0.5">
            <button
              onClick={() => setActiveMode('light')}
              className={clsx(
                "p-1 rounded transition-colors text-[11px] flex items-center gap-1",
                activeMode === 'light' ? "bg-white text-black font-semibold shadow-sm" : "text-[#888] hover:text-white"
              )}
              title="Edit Light Mode Value"
            >
              <Sun size={12} />
            </button>
            <button
              onClick={() => setActiveMode('dark')}
              className={clsx(
                "p-1 rounded transition-colors text-[11px] flex items-center gap-1",
                activeMode === 'dark' ? "bg-[#2A2A35] text-white font-semibold shadow-sm" : "text-[#888] hover:text-white"
              )}
              title="Edit Dark Mode Value"
            >
              <Moon size={12} />
            </button>
          </div>

          <button 
            onClick={onClose}
            className="p-1 rounded-md text-[#888] hover:text-white hover:bg-white/10 transition-colors ml-1"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* 2D Saturation / Value Color Area */}
      <div className="p-3.5 flex flex-col gap-3">
        <div 
          ref={satValRef}
          onPointerDown={handlePaletteDown}
          onPointerMove={(e) => {
            if (isDraggingPalette.current) handlePalettePointer(e);
          }}
          onPointerUp={() => { isDraggingPalette.current = false; }}
          className="relative w-full h-36 rounded-lg cursor-crosshair overflow-hidden shadow-inner touch-none"
          style={{
            backgroundColor: `hsl(${hue}, 100%, 50%)`,
            backgroundImage: `
              linear-gradient(to right, #FFFFFF, transparent),
              linear-gradient(to top, #000000, transparent)
            `
          }}
        >
          {/* Picker Thumb Cursor */}
          <div 
            className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md pointer-events-none"
            style={{
              left: `${sat}%`,
              top: `${100 - val}%`,
              backgroundColor: currentColor
            }}
          />
        </div>

        {/* Hue Rainbow Slider Bar */}
        <div className="flex items-center gap-2">
          <div 
            onPointerDown={(e) => {
              const target = e.currentTarget;
              target.setPointerCapture(e.pointerId);
              isDraggingHue.current = true;
              handleHuePointer(e, target);
            }}
            onPointerMove={(e) => {
              if (isDraggingHue.current) handleHuePointer(e, e.currentTarget);
            }}
            onPointerUp={() => { isDraggingHue.current = false; }}
            className="relative flex-1 h-3 rounded-full cursor-pointer touch-none shadow-inner"
            style={{
              backgroundImage: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
            }}
          >
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 -translate-x-1/2 rounded-full bg-white border border-black/30 shadow-md pointer-events-none"
              style={{ left: `${(hue / 360) * 100}%` }}
            />
          </div>
          <button 
            onClick={handleEyeDropper}
            className="p-1 rounded hover:bg-white/10 text-[#AAA] hover:text-white transition-colors"
            title="Pick color from screen"
          >
            <Pipette size={13} />
          </button>
        </div>

        {/* Opacity Slider Bar */}
        <div className="flex items-center gap-2">
          <div 
            onPointerDown={(e) => {
              const target = e.currentTarget;
              target.setPointerCapture(e.pointerId);
              isDraggingAlpha.current = true;
              handleAlphaPointer(e, target);
            }}
            onPointerMove={(e) => {
              if (isDraggingAlpha.current) handleAlphaPointer(e, e.currentTarget);
            }}
            onPointerUp={() => { isDraggingAlpha.current = false; }}
            className="relative flex-1 h-3 rounded-full cursor-pointer touch-none shadow-inner"
            style={{
              backgroundImage: `
                linear-gradient(to right, transparent, hsl(${hue}, ${sat}%, ${val}%)),
                repeating-conic-gradient(#333 0% 25%, #222 0% 50%) 50% / 8px 8px
              `
            }}
          >
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 -translate-x-1/2 rounded-full bg-white border border-black/30 shadow-md pointer-events-none"
              style={{ left: `${alpha * 100}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-[#AAA] w-8 text-right">
            {Math.round(alpha * 100)}%
          </span>
        </div>

        {/* Value Inputs Row */}
        <div className="grid grid-cols-[60px_1fr_50px] gap-1.5 items-center pt-1 border-t border-[#2D2D35]">
          {/* Format Selector */}
          <select 
            value={colorFormat}
            onChange={(e) => setColorFormat(e.target.value as any)}
            className="bg-[#141418] border border-[#2B2B33] text-[11px] font-medium text-[#AAA] rounded px-1.5 py-1 outline-none cursor-pointer hover:border-[#444]"
          >
            <option value="HEX">HEX</option>
            <option value="RGB">RGB</option>
            <option value="HSL">HSL</option>
          </select>

          {/* Hex Value Input */}
          <div className="flex items-center bg-[#141418] border border-[#2B2B33] rounded-lg px-2 py-1 focus-within:border-[#0099FF] transition-colors">
            <span className="text-[#666] text-xs font-mono select-none">#</span>
            <input 
              type="text"
              value={currentHexClean}
              onChange={(e) => {
                const val = e.target.value.trim();
                if (/^[0-9A-Fa-f]{0,8}$/.test(val)) {
                  if (val.length === 6 || val.length === 8 || val.length === 3) {
                    const rgb = hexToRgb(val);
                    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
                    setHue(hsv.h);
                    setSat(hsv.s);
                    setVal(hsv.v);
                    setAlpha(rgb.a);
                    applyColor(hsv.h, hsv.s, hsv.v, rgb.a);
                  }
                }
              }}
              className="bg-transparent border-none outline-none text-xs font-mono text-white uppercase w-full ml-1"
            />
          </div>

          {/* Opacity Value Input */}
          <div className="flex items-center bg-[#141418] border border-[#2B2B33] rounded px-1.5 py-1 focus-within:border-[#0099FF]">
            <input 
              type="number"
              min={0}
              max={100}
              value={Math.round(alpha * 100)}
              onChange={(e) => {
                const num = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                const newAlpha = num / 100;
                setAlpha(newAlpha);
                applyColor(hue, sat, val, newAlpha);
              }}
              className="bg-transparent border-none outline-none text-xs font-mono text-white w-full text-right"
            />
            <span className="text-[10px] text-[#666] ml-0.5">%</span>
          </div>
        </div>

        {/* Quick Palette Swatches */}
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="text-[10px] text-[#777] font-medium tracking-wider">SWATCHES</span>
          <div className="grid grid-cols-8 gap-1.5">
            {PRESET_SWATCHES.map((hex) => (
              <button
                key={hex}
                onClick={() => {
                  const rgb = hexToRgb(hex);
                  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
                  setHue(hsv.h);
                  setSat(hsv.s);
                  setVal(hsv.v);
                  applyColor(hsv.h, hsv.s, hsv.v, alpha);
                }}
                className="w-5 h-5 rounded-md border border-white/10 hover:scale-110 transition-transform shadow-sm relative group flex items-center justify-center"
                style={{ backgroundColor: hex }}
              >
                {currentColor.toUpperCase().startsWith(hex.toUpperCase()) && (
                  <Check size={10} className={hex === '#FFFFFF' ? "text-black" : "text-white"} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#2D2D35] text-[11px]">
          <button
            onClick={() => {
              deleteColorToken(token.id);
              onClose();
              showToast(`Deleted style '${token.name}'`, undefined, 'info');
            }}
            className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors p-1 rounded"
          >
            <Trash2 size={12} />
            <span>Delete Style</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#0099FF] text-white font-medium rounded hover:bg-[#0088EE] transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
