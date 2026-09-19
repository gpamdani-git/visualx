import React from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { NodeStyleProps, OverlayConfig } from '../../types/builder';
import { ChevronDown, Plus, X } from 'lucide-react';

interface OverlaysSectionProps {
  effectiveStyles: NodeStyleProps;
}

export default function OverlaysSection({ effectiveStyles }: OverlaysSectionProps) {
  const selectedNodeId = useBuilderStore((state) => state?.selectedNodeId);
  const activeBreakpoint = useBuilderStore((state) => state?.activeBreakpoint ?? 'lg');
  const updateNodeStyle = useBuilderStore((state) => state?.updateNodeStyle);

  if (!selectedNodeId) return null;

  const overlay = effectiveStyles.overlay;
  const isOverlayActive = Boolean(overlay);

  const handleAddOverlay = () => {
    const defaultOverlay: OverlayConfig = {
      position: 'Bottom',
      align: 'center',
      offset: { x: 0, y: 10 },
      dismiss: 'Auto',
      collision: 'Auto'
    };
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      overlay: defaultOverlay
    });
  };

  const handleRemoveOverlay = () => {
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      overlay: null
    });
  };

  const updateOverlay = (updates: Partial<OverlayConfig>) => {
    if (!overlay) return;
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      overlay: {
        ...overlay,
        ...updates
      }
    });
  };

  return (
    <div className="border-b border-zinc-200 dark:border-[#1E1E1E] py-2.5 px-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-zinc-500 dark:text-white font-bold tracking-wider capitalize">Overlays</span>
        
        {!isOverlayActive ? (
          <button
            onClick={handleAddOverlay}
            className="p-1 rounded text-zinc-500 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors"
            title="Add Overlay"
          >
            <Plus size={13} />
          </button>
        ) : (
          <button
            onClick={handleRemoveOverlay}
            className="p-1 rounded text-zinc-500 dark:text-[#777] hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors"
            title="Remove Overlay"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {isOverlayActive && overlay && (
        <div className="flex flex-col gap-2 bg-zinc-50 dark:bg-[#161616] p-2.5 rounded border border-zinc-200 dark:border-[#242424]">
          {/* Position (Center, Top, Bottom, Left, Right) */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Position</span>
            <div className="relative">
              <select
                value={overlay.position}
                onChange={(e) => updateOverlay({ position: e.target.value as any })}
                className="appearance-none bg-white dark:bg-[#111] hover:bg-zinc-50 dark:hover:bg-[#1A1A1A] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-1 pr-6 rounded outline-none cursor-pointer transition-colors"
              >
                <option value="Bottom">Bottom</option>
                <option value="Center">Center</option>
                <option value="Top">Top</option>
                <option value="Left">Left</option>
                <option value="Right">Right</option>
              </select>
              <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-[#777] pointer-events-none" />
            </div>
          </div>

          {/* Align (left, center, right) */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Align</span>
            <div className="relative">
              <select
                value={overlay.align}
                onChange={(e) => updateOverlay({ align: e.target.value as any })}
                className="appearance-none bg-white dark:bg-[#111] hover:bg-zinc-50 dark:hover:bg-[#1A1A1A] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-1 pr-6 rounded outline-none cursor-pointer transition-colors"
              >
                <option value="center">Center</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
              <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-[#777] pointer-events-none" />
            </div>
          </div>

          {/* Offset X / Y */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Offset X / Y</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={overlay.offset.x}
                onChange={(e) => updateOverlay({ offset: { ...overlay.offset, x: Number(e.target.value) } })}
                className="w-12 bg-white dark:bg-[#111] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs text-center py-0.5 rounded outline-none"
              />
              <input
                type="number"
                value={overlay.offset.y}
                onChange={(e) => updateOverlay({ offset: { ...overlay.offset, y: Number(e.target.value) } })}
                className="w-12 bg-white dark:bg-[#111] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs text-center py-0.5 rounded outline-none"
              />
            </div>
          </div>

          {/* Dismiss (Auto / Click) */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Dismiss</span>
            <div className="relative">
              <select
                value={overlay.dismiss}
                onChange={(e) => updateOverlay({ dismiss: e.target.value as any })}
                className="appearance-none bg-white dark:bg-[#111] hover:bg-zinc-50 dark:hover:bg-[#1A1A1A] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-1 pr-6 rounded outline-none cursor-pointer transition-colors"
              >
                <option value="Auto">Auto</option>
                <option value="Click">Click Outside</option>
              </select>
              <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-[#777] pointer-events-none" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
