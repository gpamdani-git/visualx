import React, { useState, useRef } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { NodeStyleProps, ShadowItem } from '../../types/builder';
import { ChevronDown, Plus, X, Maximize2, Minimize2, Image as ImageIcon } from 'lucide-react';
import ColorPopover from './ColorPopover';
import SectionContextMenu from './SectionContextMenu';

interface StylesSectionProps {
  effectiveStyles: NodeStyleProps;
}

export default function StylesSection({ effectiveStyles }: StylesSectionProps) {
  const selectedNodeId = useBuilderStore((state) => state?.selectedNodeId);
  const activeBreakpoint = useBuilderStore((state) => state?.activeBreakpoint ?? 'lg');
  const updateNodeStyle = useBuilderStore((state) => state?.updateNodeStyle);

  const [radiusSplit, setRadiusSplit] = useState(effectiveStyles.borderRadius?.isSplit || false);
  const [showFillPopover, setShowFillPopover] = useState(false);
  const [popoverTop, setPopoverTop] = useState(120);
  const fillButtonRef = useRef<HTMLButtonElement>(null);

  const handleToggleFillPopover = () => {
    if (fillButtonRef.current) {
      const rect = fillButtonRef.current.getBoundingClientRect();
      const idealTop = Math.max(60, Math.min(window.innerHeight - 560, rect.top - 80));
      setPopoverTop(idealTop);
    }
    setShowFillPopover(prev => !prev);
  };

  if (!selectedNodeId) return null;

  const opacity = effectiveStyles.opacity !== undefined ? effectiveStyles.opacity : 1;
  const isVisible = effectiveStyles.visible !== false;
  const bgColor = effectiveStyles.backgroundColor || 'transparent';
  const overflow = effectiveStyles.overflow || 'visible';
  const radius = effectiveStyles.borderRadius || { tl: 0, tr: 0, br: 0, bl: 0 };
  const tlRad = radius.tl ?? 0;
  const trRad = radius.tr ?? 0;
  const brRad = radius.br ?? 0;
  const blRad = radius.bl ?? 0;
  const isRadiusAllEqual = tlRad === trRad && tlRad === brRad && tlRad === blRad;
  const hasAnyRadius = tlRad > 0 || trRad > 0 || brRad > 0 || blRad > 0;
  const isRadiusMixed = !isRadiusAllEqual;
  const border: { color: string; width: number; style: 'solid' | 'dashed' | 'dotted' } | null = effectiveStyles.border || (effectiveStyles.borderWidth ? {
    color: effectiveStyles.borderColor || '#333333',
    width: effectiveStyles.borderWidth,
    style: (effectiveStyles.borderStyle === 'dashed' || effectiveStyles.borderStyle === 'dotted') ? effectiveStyles.borderStyle : 'solid'
  } : null);
  const shadows = effectiveStyles.shadows || [];

  const handleUniformRadius = (val: number) => {
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      borderRadius: { tl: val, tr: val, br: val, bl: val, isSplit: false }
    });
  };

  const handleCornerRadius = (corner: 'tl' | 'tr' | 'br' | 'bl', val: number) => {
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      borderRadius: { ...radius, [corner]: val, isSplit: true }
    });
  };

  const handleAddBorder = () => {
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      border: {
        color: '#333333',
        width: 1,
        style: 'solid'
      },
      borderColor: '#333333',
      borderWidth: 1
    });
  };

  const handleRemoveBorder = () => {
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      border: null,
      borderColor: 'transparent',
      borderWidth: 0
    });
  };

  const handleAddShadow = () => {
    const newShadow: ShadowItem = {
      id: `shadow-${Date.now()}`,
      x: 0,
      y: 10,
      blur: 20,
      spread: 0,
      color: 'rgba(0,0,0,0.25)'
    };
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      shadows: [...shadows, newShadow]
    });
  };

  const handleRemoveShadow = (id: string) => {
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      shadows: shadows.filter((s) => s.id !== id)
    });
  };

  return (
    <div className="border-b border-zinc-200 dark:border-[#1E1E1E] py-2.5 px-3">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[11px] font-semibold text-zinc-500 dark:text-white font-bold tracking-wider capitalize">Styles</span>
        <SectionContextMenu 
          onReset={() => {
            if (selectedNodeId) updateNodeStyle(selectedNodeId, activeBreakpoint, {
              opacity: undefined, visible: undefined, backgroundColor: undefined,
              overflow: undefined, borderRadius: undefined, shadows: undefined,
              border: undefined
            });
          }}
        />
      </div>

      {/* Opacity Slider */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Opacity</span>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={opacity}
            onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, { opacity: Number(e.target.value) })}
            className="w-24 accent-[#0099FF] h-1.5 bg-zinc-200 dark:bg-[#252525] rounded cursor-pointer"
          />
          <div className="flex items-center bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] rounded px-1.5 py-0.5 w-14">
            <input
              type="number"
              min="0"
              max="100"
              value={Math.round(opacity * 100)}
              onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, { opacity: Math.min(1, Math.max(0, Number(e.target.value) / 100)) })}
              className="w-full bg-transparent text-zinc-900 dark:text-white text-xs text-right outline-none"
            />
            <span className="text-[10px] text-zinc-400 dark:text-[#666] ml-0.5">%</span>
          </div>
        </div>
      </div>

      {/* Visible */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Visible</span>
        <div className="relative">
          <select
            value={isVisible ? 'yes' : 'no'}
            onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, { visible: e.target.value === 'yes' })}
            className="appearance-none bg-white dark:bg-[#222] hover:bg-zinc-50 dark:hover:bg-[#2A2A2A] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-1 pr-6 rounded outline-none cursor-pointer"
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-[#777] pointer-events-none" />
        </div>
      </div>

      {/* Fill (Color / Gradient / Image) */}
      <div className="flex items-center justify-between gap-2 mb-2 relative">
        <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Fill</span>
        <div className="flex items-center gap-1.5">
          {(() => {
            const fillConfig = effectiveStyles.fillConfig;
            const isImageFill = fillConfig?.type === 'image' || bgColor?.startsWith('url(');
            const isGradientFill = fillConfig?.type === 'linear' || fillConfig?.type === 'radial' || fillConfig?.type === 'conic' || bgColor?.includes('gradient');
            const imageFillSrc = fillConfig?.imageSrc || (bgColor?.startsWith('url(') ? bgColor.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '') : '');

            return (
              <>
                <button
                  ref={fillButtonRef}
                  data-fill-trigger="true"
                  onClick={handleToggleFillPopover}
                  className="w-5 h-5 rounded border border-zinc-300 dark:border-[#333] cursor-pointer overflow-hidden relative shadow-2xs hover:scale-105 transition-transform flex items-center justify-center shrink-0"
                  style={
                    isImageFill && imageFillSrc
                      ? { backgroundImage: `url('${imageFillSrc}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#222222' }
                      : isGradientFill
                        ? { backgroundImage: bgColor, backgroundColor: 'transparent' }
                        : { backgroundColor: bgColor === 'transparent' ? '#000000' : bgColor, backgroundImage: undefined }
                  }
                  title={
                    isImageFill
                      ? 'Image Fill'
                      : isGradientFill
                        ? 'Gradient Fill'
                        : 'Color Fill'
                  }
                >
                  {isImageFill && !imageFillSrc && <ImageIcon size={10} className="text-zinc-400" />}
                </button>
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => {
                    const val = e.target.value;
                    const cleanUrl = val.startsWith('url(') ? val.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '') : val;
                    if (isImageFill || val.startsWith('url(')) {
                      updateNodeStyle(selectedNodeId, activeBreakpoint, {
                        backgroundColor: val.startsWith('url(') ? val : `url('${val}')`,
                        fillConfig: {
                          type: 'image',
                          imageSrc: cleanUrl,
                          imageAlt: fillConfig?.imageAlt || 'Design Asset',
                          imageType: fillConfig?.imageType || 'fill',
                          imagePosition: fillConfig?.imagePosition || 'Center',
                          imageResolution: fillConfig?.imageResolution || 'Auto'
                        }
                      });
                    } else {
                      updateNodeStyle(selectedNodeId, activeBreakpoint, { backgroundColor: val });
                    }
                  }}
                  placeholder={isImageFill ? "url('...')" : "#HEX"}
                  className="w-24 bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2 py-0.5 rounded outline-none font-mono truncate focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
                  title={bgColor}
                />
                {bgColor !== 'transparent' && (
                  <button
                    onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { backgroundColor: 'transparent', fillConfig: undefined })}
                    className="p-1 text-zinc-400 dark:text-[#666] hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    title="Clear Fill"
                  >
                    <X size={11} />
                  </button>
                )}
              </>
            );
          })()}
        </div>
        
        {showFillPopover && (
          <ColorPopover
            color={bgColor}
            fillConfig={effectiveStyles.fillConfig}
            top={popoverTop}
            onChange={(c, config) => updateNodeStyle(selectedNodeId, activeBreakpoint, { backgroundColor: c, fillConfig: config })}
            onClose={() => setShowFillPopover(false)}
          />
        )}
      </div>

      {/* Overflow */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Overflow</span>
        <div className="relative">
          <select
            value={overflow}
            onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, { overflow: e.target.value as any })}
            className="appearance-none bg-white dark:bg-[#222] hover:bg-zinc-50 dark:hover:bg-[#2A2A2A] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-1 pr-6 rounded outline-none cursor-pointer"
          >
            <option value="visible">Visible</option>
            <option value="clip">Clip</option>
            <option value="hidden">Hidden</option>
            <option value="scroll">Scroll</option>
          </select>
          <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-[#777] pointer-events-none" />
        </div>
      </div>

      {/* Radius (Uniform vs 4-Corner) (Images 18, 19) */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Radius</span>
            {isRadiusMixed && hasAnyRadius && !radiusSplit && (
              <span 
                className="text-[9px] bg-zinc-100 dark:bg-zinc-9000/15 text-zinc-900 dark:text-white px-1.5 py-0.5 rounded font-medium"
                title={`Top-Left: ${tlRad}px, Top-Right: ${trRad}px, Bottom-Right: ${brRad}px, Bottom-Left: ${blRad}px`}
              >
                Mixed
              </span>
            )}
          </div>
          <button
            onClick={() => setRadiusSplit(!radiusSplit)}
            className={`p-1 rounded transition-colors relative ${
              isRadiusMixed && hasAnyRadius 
                ? 'text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-900 dark:bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800' 
                : 'text-zinc-500 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#252525]'
            }`}
            title={radiusSplit ? 'Switch to uniform radius' : isRadiusMixed && hasAnyRadius ? 'Switch to 4-corner radius (Custom values configured)' : 'Switch to 4-corner radius'}
          >
            {radiusSplit ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            {isRadiusMixed && hasAnyRadius && !radiusSplit && (
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#0099FF] rounded-full ring-2 ring-white dark:ring-[#141414]" />
            )}
          </button>
        </div>

        {!radiusSplit ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-zinc-500 dark:text-[#777]">All</span>
              <div className="flex items-center bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] rounded-lg px-2 py-0.5 w-24 focus-within:border-[#0099FF] transition-colors">
                <input
                  type="number"
                  value={isRadiusMixed ? '' : tlRad}
                  placeholder={isRadiusMixed ? 'Mixed' : '0'}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : Number(e.target.value);
                    handleUniformRadius(val);
                  }}
                  className="w-full bg-transparent text-zinc-900 dark:text-white text-xs text-right outline-none placeholder:text-zinc-400 placeholder:italic"
                />
                <span className="text-[10px] text-zinc-400 dark:text-[#666] ml-1">px</span>
              </div>
            </div>

            {/* Informative breakdown tag if mixed so user sees exactly which corners are rounded */}
            {isRadiusMixed && hasAnyRadius && (
              <div 
                onClick={() => setRadiusSplit(true)}
                className="flex items-center justify-between px-2 py-1 bg-zinc-100/80 dark:bg-[#161616] hover:bg-zinc-200/60 dark:hover:bg-[#202020] rounded border border-zinc-200/80 dark:border-[#262626] cursor-pointer transition-colors text-[10px] text-zinc-600 dark:text-[#A0A0A0] font-mono group"
                title="Click to edit 4-corner radius values"
              >
                <span className="text-[9px] font-sans text-zinc-400 dark:text-[#666] group-hover:text-zinc-600 dark:group-hover:text-[#AAA]">4-Corners:</span>
                <div className="flex items-center gap-1.5">
                  <span className={tlRad > 0 ? "font-semibold text-zinc-900 dark:text-white dark:text-[#38bdf8]" : "text-zinc-400 dark:text-zinc-600"}>TL:{tlRad}</span>
                  <span className={trRad > 0 ? "font-semibold text-zinc-900 dark:text-white dark:text-[#38bdf8]" : "text-zinc-400 dark:text-zinc-600"}>TR:{trRad}</span>
                  <span className={brRad > 0 ? "font-semibold text-zinc-900 dark:text-white dark:text-[#38bdf8]" : "text-zinc-400 dark:text-zinc-600"}>BR:{brRad}</span>
                  <span className={blRad > 0 ? "font-semibold text-zinc-900 dark:text-white dark:text-[#38bdf8]" : "text-zinc-400 dark:text-zinc-600"}>BL:{blRad}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-1.5">
            <div className={`flex flex-col items-center p-1 rounded border transition-colors ${
              tlRad > 0 
                ? 'bg-zinc-100 dark:bg-zinc-9000/5 dark:bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-600/40 dark:border-zinc-300 dark:border-zinc-600/40' 
                : 'bg-zinc-100/70 dark:bg-[#161616] border-zinc-200 dark:border-[#242424]'
            }`}>
              <span className={`text-[9px] ${tlRad > 0 ? 'text-zinc-900 dark:text-white font-semibold' : 'text-zinc-500 dark:text-[#777]'}`}>TL</span>
              <input
                type="number"
                value={tlRad}
                onChange={(e) => handleCornerRadius('tl', Number(e.target.value))}
                className={`w-full bg-transparent text-xs text-center outline-none ${tlRad > 0 ? 'text-zinc-900 dark:text-white font-medium' : 'text-zinc-900 dark:text-white'}`}
              />
            </div>
            <div className={`flex flex-col items-center p-1 rounded border transition-colors ${
              trRad > 0 
                ? 'bg-zinc-100 dark:bg-zinc-9000/5 dark:bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-600/40 dark:border-zinc-300 dark:border-zinc-600/40' 
                : 'bg-zinc-100/70 dark:bg-[#161616] border-zinc-200 dark:border-[#242424]'
            }`}>
              <span className={`text-[9px] ${trRad > 0 ? 'text-zinc-900 dark:text-white font-semibold' : 'text-zinc-500 dark:text-[#777]'}`}>TR</span>
              <input
                type="number"
                value={trRad}
                onChange={(e) => handleCornerRadius('tr', Number(e.target.value))}
                className={`w-full bg-transparent text-xs text-center outline-none ${trRad > 0 ? 'text-zinc-900 dark:text-white font-medium' : 'text-zinc-900 dark:text-white'}`}
              />
            </div>
            <div className={`flex flex-col items-center p-1 rounded border transition-colors ${
              brRad > 0 
                ? 'bg-zinc-100 dark:bg-zinc-9000/5 dark:bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-600/40 dark:border-zinc-300 dark:border-zinc-600/40' 
                : 'bg-zinc-100/70 dark:bg-[#161616] border-zinc-200 dark:border-[#242424]'
            }`}>
              <span className={`text-[9px] ${brRad > 0 ? 'text-zinc-900 dark:text-white font-semibold' : 'text-zinc-500 dark:text-[#777]'}`}>BR</span>
              <input
                type="number"
                value={brRad}
                onChange={(e) => handleCornerRadius('br', Number(e.target.value))}
                className={`w-full bg-transparent text-xs text-center outline-none ${brRad > 0 ? 'text-zinc-900 dark:text-white font-medium' : 'text-zinc-900 dark:text-white'}`}
              />
            </div>
            <div className={`flex flex-col items-center p-1 rounded border transition-colors ${
              blRad > 0 
                ? 'bg-zinc-100 dark:bg-zinc-9000/5 dark:bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-600/40 dark:border-zinc-300 dark:border-zinc-600/40' 
                : 'bg-zinc-100/70 dark:bg-[#161616] border-zinc-200 dark:border-[#242424]'
            }`}>
              <span className={`text-[9px] ${blRad > 0 ? 'text-zinc-900 dark:text-white font-semibold' : 'text-zinc-500 dark:text-[#777]'}`}>BL</span>
              <input
                type="number"
                value={blRad}
                onChange={(e) => handleCornerRadius('bl', Number(e.target.value))}
                className={`w-full bg-transparent text-xs text-center outline-none ${blRad > 0 ? 'text-zinc-900 dark:text-white font-medium' : 'text-zinc-900 dark:text-white'}`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Border */}
      <div className="mb-2 pt-2 border-t border-zinc-200 dark:border-[#222]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Border</span>
          {!border ? (
            <button
              onClick={handleAddBorder}
              className="p-1 rounded text-zinc-500 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#252525]"
              title="Add Border"
            >
              <Plus size={12} />
            </button>
          ) : (
            <button
              onClick={handleRemoveBorder}
              className="p-1 text-zinc-400 dark:text-[#666] hover:text-red-500 dark:hover:text-red-400"
              title="Remove Border"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {border && (
          <div className="flex items-center gap-2 bg-zinc-100/70 dark:bg-[#161616] p-2 rounded border border-zinc-200 dark:border-[#242424]">
            <input
              type="color"
              value={border.color || '#333333'}
              onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, {
                border: { ...border, color: e.target.value },
                borderColor: e.target.value
              })}
              className="w-5 h-5 rounded border border-zinc-300 dark:border-[#333] cursor-pointer bg-transparent"
            />
            <div className="flex items-center bg-white dark:bg-[#111] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] rounded px-1.5 py-0.5 w-14">
              <input
                type="number"
                value={border.width || 1}
                onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, {
                  border: { ...border, width: Number(e.target.value) },
                  borderWidth: Number(e.target.value)
                })}
                className="w-full bg-transparent text-zinc-900 dark:text-white text-xs text-right outline-none"
              />
              <span className="text-[10px] text-zinc-400 dark:text-[#666] ml-1">px</span>
            </div>
            <div className="relative flex-1">
              <select
                value={border.style || 'solid'}
                onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, {
                  border: { ...border, style: e.target.value as any }
                })}
                className="w-full appearance-none bg-white dark:bg-[#111] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2 py-0.5 rounded outline-none cursor-pointer"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
              <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-[#777] pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Shadows List */}
      <div className="pt-2 border-t border-zinc-200 dark:border-[#222]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Shadows</span>
          <button
            onClick={handleAddShadow}
            className="p-1 rounded text-zinc-500 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#252525]"
            title="Add Shadow"
          >
            <Plus size={12} />
          </button>
        </div>

        {shadows.map((s, idx) => (
          <div key={s.id || idx} className="flex items-center justify-between gap-1.5 bg-zinc-100/70 dark:bg-[#161616] p-1.5 rounded border border-zinc-200 dark:border-[#242424] mb-1 text-xs">
            <span className="text-zinc-500 dark:text-[#888] font-mono text-[10px]">
              {s.x}px {s.y}px {s.blur}px
            </span>
            <div className="flex items-center gap-1">
              <input
                type="color"
                value={s.color.startsWith('#') ? s.color : '#000000'}
                onChange={(e) => {
                  const updated = shadows.map((item) => item.id === s.id ? { ...item, color: e.target.value } : item);
                  updateNodeStyle(selectedNodeId, activeBreakpoint, { shadows: updated });
                }}
                className="w-4 h-4 rounded border border-zinc-300 dark:border-[#333] cursor-pointer bg-transparent"
              />
              <button
                onClick={() => handleRemoveShadow(s.id)}
                className="p-0.5 text-zinc-400 dark:text-[#666] hover:text-red-500 dark:hover:text-red-400"
              >
                <X size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
