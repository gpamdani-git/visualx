import React, { useRef, useEffect } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { NodeStyleProps } from '../../types/builder';
import { X, Sliders } from 'lucide-react';

interface AdvancedLayoutPopoverProps {
  effectiveStyles: NodeStyleProps;
  top?: number;
  onClose: () => void;
}

export default function AdvancedLayoutPopover({
  effectiveStyles,
  top = 160,
  onClose
}: AdvancedLayoutPopoverProps) {
  const selectedNodeId = useBuilderStore((state) => state?.selectedNodeId);
  const activeBreakpoint = useBuilderStore((state) => state?.activeBreakpoint ?? 'lg');
  const updateNodeStyle = useBuilderStore((state) => state?.updateNodeStyle);

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        const isTrigger = (e.target as HTMLElement)?.closest?.('[data-advanced-layout-trigger="true"]');
        if (!isTrigger) {
          onClose();
        }
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!selectedNodeId) return null;

  const isColumnsFixed = effectiveStyles.gridAutoFlow !== 'column' && typeof effectiveStyles.gridColumns === 'number';
  const widthMode = effectiveStyles.minWidthType || 'fixed';
  const widthVal = effectiveStyles.minWidth || effectiveStyles.widthValue || 50;
  const heightMode = effectiveStyles.heightType === 'fill' ? 'Fill Container' : effectiveStyles.heightType === 'fit-content' ? 'Fit Content' : 'Fixed';
  const alignItems = effectiveStyles.alignItems || 'center';

  return (
    <div
      ref={popoverRef}
      style={{ top: Math.max(60, Math.min(window.innerHeight - 380, top)) }}
      className="fixed right-[288px] w-[260px] bg-white dark:bg-[#141414] border border-zinc-200 dark:border-[#262626] rounded-2xl shadow-2xl z-[100] p-4 select-none animate-in fade-in zoom-in-95 duration-100 text-zinc-900 dark:text-[#ECECEC]"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-[#222] mb-3">
        <div className="flex items-center gap-1.5">
          <Sliders size={14} className="text-zinc-900 dark:text-white" />
          <span className="text-xs font-semibold">Advanced Layout</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-zinc-400 dark:text-[#777] hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#202020] transition-colors"
        >
          <X size={13} />
        </button>
      </div>

      <div className="flex flex-col gap-3 text-xs">
        {/* Columns: Auto / Fixed */}
        <div className="flex items-center justify-between">
          <span className="text-zinc-600 dark:text-[#A0A0A0]">Columns</span>
          <div className="flex bg-zinc-100 dark:bg-[#222] p-0.5 rounded-lg border border-zinc-200/80 dark:border-[#222]">
            <button
              onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { gridAutoFlow: 'column', gridColumns: 'auto' })}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                !isColumnsFixed
                  ? 'bg-white dark:bg-[#2C2C2C] text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-500 dark:text-[#777] hover:text-zinc-800 dark:hover:text-[#CCC]'
              }`}
            >
              Auto
            </button>
            <button
              onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { gridAutoFlow: 'row', gridColumns: 2 })}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                isColumnsFixed
                  ? 'bg-white dark:bg-[#2C2C2C] text-zinc-900 dark:text-white font-semibold shadow-xs'
                  : 'text-zinc-500 dark:text-[#777] hover:text-zinc-800 dark:hover:text-[#CCC]'
              }`}
            >
              Fixed
            </button>
          </div>
        </div>

        {/* Width */}
        <div className="flex items-center justify-between">
          <span className="text-zinc-600 dark:text-[#A0A0A0]">Width</span>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={widthVal}
              onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, { minWidth: e.target.value })}
              className="w-14 bg-white dark:bg-[#222] border border-[#0099FF] text-zinc-900 dark:text-white text-xs px-2 py-1 rounded-lg outline-none text-center font-medium"
            />
            <div className="relative">
              <select
                value={widthMode}
                onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, { minWidthType: e.target.value as any })}
                className="appearance-none bg-zinc-100 dark:bg-[#222] hover:bg-zinc-200/70 dark:hover:bg-[#252525] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-[11px] font-medium px-2.5 py-1 pr-5 rounded-lg outline-none cursor-pointer"
              >
                <option value="min">Min</option>
                <option value="fixed">Fixed</option>
                <option value="max">Max</option>
                <option value="1fr">1fr</option>
              </select>
              <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] text-zinc-400 pointer-events-none">▾</span>
            </div>
          </div>
        </div>

        {/* Height */}
        <div className="flex items-center justify-between">
          <span className="text-zinc-600 dark:text-[#A0A0A0]">Height</span>
          <div className="relative w-36">
            <select
              value={heightMode}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'Fill Container') {
                  updateNodeStyle(selectedNodeId, activeBreakpoint, { heightType: 'fill', heightValue: '100%' });
                } else if (val === 'Fit Content') {
                  updateNodeStyle(selectedNodeId, activeBreakpoint, { heightType: 'fit-content', heightValue: 'auto' });
                } else {
                  updateNodeStyle(selectedNodeId, activeBreakpoint, { heightType: 'fixed', heightValue: 200 });
                }
              }}
              className="w-full appearance-none bg-zinc-100 dark:bg-[#222] hover:bg-zinc-200/70 dark:hover:bg-[#252525] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-[11px] font-medium px-2.5 py-1 pr-6 rounded-lg outline-none cursor-pointer truncate"
            >
              <option value="Fill Container">Fill Container</option>
              <option value="Fit Content">Fit Content</option>
              <option value="Fixed">Fixed</option>
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 pointer-events-none">▾</span>
          </div>
        </div>

        {/* Align: Start | Center | End */}
        <div className="flex items-center justify-between">
          <span className="text-zinc-600 dark:text-[#A0A0A0]">Align</span>
          <div className="flex bg-zinc-100 dark:bg-[#222] p-0.5 rounded-lg border border-zinc-200/80 dark:border-[#222] gap-0.5">
            <button
              onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { alignItems: 'flex-start' })}
              title="Align Start"
              className={`p-1.5 rounded-md transition-all ${
                alignItems === 'flex-start'
                  ? 'bg-white dark:bg-[#333] text-zinc-900 dark:text-white shadow-sm rounded-md'
                  : 'text-zinc-400 dark:text-[#777] hover:text-zinc-800 dark:hover:text-[#CCC]'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="3" width="2" height="10" rx="1" fill="currentColor" />
                <rect x="6" y="5" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>

            <button
              onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { alignItems: 'center' })}
              title="Align Center"
              className={`p-1.5 rounded-md transition-all ${
                alignItems === 'center'
                  ? 'bg-white dark:bg-[#333] text-zinc-900 dark:text-white shadow-sm rounded-md'
                  : 'text-zinc-400 dark:text-[#777] hover:text-zinc-800 dark:hover:text-[#CCC]'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <rect x="4" y="5" width="8" height="6" rx="1.5" fill={alignItems === 'center' ? '#0099FF' : 'currentColor'} fillOpacity={alignItems === 'center' ? '0.15' : '0'} stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>

            <button
              onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { alignItems: 'flex-end' })}
              title="Align End"
              className={`p-1.5 rounded-md transition-all ${
                alignItems === 'flex-end'
                  ? 'bg-white dark:bg-[#333] text-zinc-900 dark:text-white shadow-sm rounded-md'
                  : 'text-zinc-400 dark:text-[#777] hover:text-zinc-800 dark:hover:text-[#CCC]'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="12" y="3" width="2" height="10" rx="1" fill="currentColor" />
                <rect x="2" y="5" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
