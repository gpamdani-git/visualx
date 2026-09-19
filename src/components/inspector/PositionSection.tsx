import React from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { NodeStyleProps, PinningCompass } from '../../types/builder';
import { ChevronDown, Minus, Plus, ChevronsUp, ChevronUp, ChevronsDown } from 'lucide-react';
import LayoutConflictWarning from './LayoutConflictWarning';
import { detectLayoutConflicts } from '../../utils/conflictUtils';

interface PositionSectionProps {
  effectiveStyles: NodeStyleProps;
}

const EMPTY_NODES: Record<string, any> = {};

export default function PositionSection({ effectiveStyles }: PositionSectionProps) {
  const selectedNodeId = useBuilderStore((state) => state?.selectedNodeId);
  const activeBreakpoint = useBuilderStore((state) => state?.activeBreakpoint ?? 'lg');
  const updateNodeStyle = useBuilderStore((state) => state?.updateNodeStyle);
  const nodes = useBuilderStore((state) => state?.nodes) || EMPTY_NODES;
  const selectedNode = selectedNodeId ? nodes[selectedNodeId] : null;

  if (!selectedNodeId) return null;

  const conflicts = detectLayoutConflicts(selectedNode, effectiveStyles);
  const positionConflicts = conflicts.filter((c) => c.type === 'position_flow');

  const positionType = effectiveStyles.position || 'relative';
  const stickyTop = effectiveStyles.stickyTop !== undefined ? effectiveStyles.stickyTop : 0;
  const zIndex = effectiveStyles.zIndex !== undefined ? effectiveStyles.zIndex : 0;

  const pinning: PinningCompass = effectiveStyles.pinning || {
    top: typeof effectiveStyles.top === 'number' ? effectiveStyles.top : 0,
    left: typeof effectiveStyles.left === 'number' ? effectiveStyles.left : 0,
    right: typeof effectiveStyles.right === 'number' ? effectiveStyles.right : 0,
    bottom: typeof effectiveStyles.bottom === 'number' ? effectiveStyles.bottom : 0,
    pinned: { t: true, l: true, r: false, b: false }
  };

  const handlePositionChange = (pos: 'relative' | 'absolute' | 'fixed' | 'sticky') => {
    if (pos === 'absolute') {
      updateNodeStyle(selectedNodeId, activeBreakpoint, {
        position: 'absolute',
        pinning: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pinned: { t: true, l: true, r: false, b: false }
        },
        top: 0,
        left: 0
      });
    } else if (pos === 'sticky') {
      updateNodeStyle(selectedNodeId, activeBreakpoint, {
        position: 'sticky',
        stickyTop: 0,
        top: 0
      });
    } else {
      updateNodeStyle(selectedNodeId, activeBreakpoint, {
        position: pos,
        top: undefined,
        left: undefined,
        right: undefined,
        bottom: undefined
      });
    }
  };

  const togglePin = (side: 't' | 'l' | 'r' | 'b') => {
    const updatedPinned = {
      ...pinning.pinned,
      [side]: !pinning.pinned[side]
    };
    const updatedPinning = {
      ...pinning,
      pinned: updatedPinned
    };
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      pinning: updatedPinning,
      top: updatedPinned.t ? (pinning.top || 0) : undefined,
      left: updatedPinned.l ? (pinning.left || 0) : undefined,
      right: updatedPinned.r ? (pinning.right || 0) : undefined,
      bottom: updatedPinned.b ? (pinning.bottom || 0) : undefined
    });
  };

  const updatePinValue = (side: 'top' | 'left' | 'right' | 'bottom', val: number) => {
    const updatedPinning = {
      ...pinning,
      [side]: val
    };
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      pinning: updatedPinning,
      [side]: val
    });
  };

  return (
    <div className="border-b border-zinc-200 dark:border-[#1E1E1E] py-2.5 px-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-zinc-500 dark:text-white font-bold tracking-wider capitalize">Position</span>
          {positionConflicts.length > 0 && (
            <LayoutConflictWarning conflicts={positionConflicts} variant="badge" badgeLabel="Flow Conflict" />
          )}
        </div>
      </div>

      {/* Type Selector Dropdown */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Type</span>
        <div className="relative">
          <select
            value={positionType}
            onChange={(e) => handlePositionChange(e.target.value as any)}
            className="appearance-none bg-white dark:bg-[#222] hover:bg-zinc-50 dark:hover:bg-[#2A2A2A] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-1 pr-6 rounded outline-none cursor-pointer focus:border-zinc-400 dark:focus:border-zinc-500"
          >
            <option value="relative">Relative</option>
            <option value="absolute">Absolute</option>
            <option value="fixed">Fixed</option>
            <option value="sticky">Sticky</option>
          </select>
          <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-[#777] pointer-events-none" />
        </div>
      </div>

      {/* Absolute Compass Pinning Widget (Image 5 & 6) */}
      {positionType === 'absolute' && (
        <div className="flex flex-col gap-2 bg-zinc-100/70 dark:bg-[#161616] p-2.5 rounded border border-zinc-200 dark:border-[#242424] mb-2.5">
          <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-[#777] mb-1">
            <span>Pinning</span>
            <span className="text-[10px] text-zinc-400 dark:text-[#555]">Click compass edges to pin</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            {/* Left coordinate input */}
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[10px] text-zinc-500 dark:text-[#666]">L</span>
              <input
                type="number"
                value={pinning.left ?? 0}
                disabled={!pinning.pinned.l}
                onChange={(e) => updatePinValue('left', Number(e.target.value))}
                className="w-12 bg-white dark:bg-[#111] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs text-center py-0.5 rounded outline-none disabled:opacity-30"
              />
            </div>

            {/* Compass Box */}
            <div className="flex flex-col items-center">
              {/* Top input */}
              <div className="flex flex-col items-center gap-0.5 mb-1">
                <span className="text-[10px] text-zinc-500 dark:text-[#666]">T</span>
                <input
                  type="number"
                  value={pinning.top ?? 0}
                  disabled={!pinning.pinned.t}
                  onChange={(e) => updatePinValue('top', Number(e.target.value))}
                  className="w-12 bg-white dark:bg-[#111] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs text-center py-0.5 rounded outline-none disabled:opacity-30"
                />
              </div>

              {/* Compass Interactive Crosshair */}
              <div className="relative w-16 h-16 bg-white dark:bg-[#222] border border-zinc-300 dark:border-[#333] rounded flex items-center justify-center shadow-xs">
                {/* Top edge button */}
                <button
                  onClick={() => togglePin('t')}
                  className={`absolute top-0 left-2 right-2 h-2 rounded-t transition-colors ${
                    pinning.pinned.t ? 'bg-[#0099FF]' : 'bg-zinc-200 hover:bg-zinc-300 dark:bg-[#333] dark:hover:bg-[#444]'
                  }`}
                  title="Toggle Top Pin"
                />
                {/* Bottom edge button */}
                <button
                  onClick={() => togglePin('b')}
                  className={`absolute bottom-0 left-2 right-2 h-2 rounded-b transition-colors ${
                    pinning.pinned.b ? 'bg-[#0099FF]' : 'bg-zinc-200 hover:bg-zinc-300 dark:bg-[#333] dark:hover:bg-[#444]'
                  }`}
                  title="Toggle Bottom Pin"
                />
                {/* Left edge button */}
                <button
                  onClick={() => togglePin('l')}
                  className={`absolute left-0 top-2 bottom-2 w-2 rounded-l transition-colors ${
                    pinning.pinned.l ? 'bg-[#0099FF]' : 'bg-zinc-200 hover:bg-zinc-300 dark:bg-[#333] dark:hover:bg-[#444]'
                  }`}
                  title="Toggle Left Pin"
                />
                {/* Right edge button */}
                <button
                  onClick={() => togglePin('r')}
                  className={`absolute right-0 top-2 bottom-2 w-2 rounded-r transition-colors ${
                    pinning.pinned.r ? 'bg-[#0099FF]' : 'bg-zinc-200 hover:bg-zinc-300 dark:bg-[#333] dark:hover:bg-[#444]'
                  }`}
                  title="Toggle Right Pin"
                />

                {/* Center dot */}
                <div className="w-2.5 h-2.5 rounded-full bg-[#0099FF] shadow-xs" />
              </div>

              {/* Bottom input */}
              <div className="flex flex-col items-center gap-0.5 mt-1">
                <input
                  type="number"
                  value={pinning.bottom ?? 0}
                  disabled={!pinning.pinned.b}
                  onChange={(e) => updatePinValue('bottom', Number(e.target.value))}
                  className="w-12 bg-white dark:bg-[#111] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs text-center py-0.5 rounded outline-none disabled:opacity-30"
                />
                <span className="text-[10px] text-zinc-500 dark:text-[#666]">B</span>
              </div>
            </div>

            {/* Right coordinate input */}
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[10px] text-zinc-500 dark:text-[#666]">R</span>
              <input
                type="number"
                value={pinning.right ?? 0}
                disabled={!pinning.pinned.r}
                onChange={(e) => updatePinValue('right', Number(e.target.value))}
                className="w-12 bg-white dark:bg-[#111] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs text-center py-0.5 rounded outline-none disabled:opacity-30"
              />
            </div>
          </div>
        </div>
      )}

      {/* Sticky Top Stepper (Image 7) */}
      {positionType === 'sticky' && (
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Top</span>
          <div className="flex items-center bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] rounded overflow-hidden">
            <button
              onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { stickyTop: Math.max(0, stickyTop - 5) })}
              className="px-2 py-1 text-zinc-500 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#252525]"
            >
              <Minus size={11} />
            </button>
            <input
              type="number"
              value={stickyTop}
              onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, { stickyTop: Number(e.target.value) })}
              className="w-12 bg-transparent text-zinc-900 dark:text-white text-xs text-center outline-none"
            />
            <button
              onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { stickyTop: stickyTop + 5 })}
              className="px-2 py-1 text-zinc-500 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#252525]"
            >
              <Plus size={11} />
            </button>
          </div>
        </div>
      )}

      {/* Z-Index Tools */}
      <div className="flex flex-col gap-2 mt-4 pt-3 border-t border-zinc-200 dark:border-[#242424]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-zinc-500 dark:text-[#A0A0A0] tracking-wider uppercase">Z-Index Arrangement</span>
        </div>
        
        <div className="flex items-center justify-between gap-1">
          {/* Preset Buttons */}
          <div className="flex bg-white dark:bg-[#1E1E1E] border border-zinc-200 dark:border-[#2A2A2A] rounded-lg p-0.5 w-full">
            <button
              onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { zIndex: 0 })}
              title="Send to Back (0)"
              className="flex-1 flex items-center justify-center p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-[#2A2A2A] dark:hover:text-white rounded-md transition-colors"
            >
              <ChevronsDown size={14} />
            </button>
            <button
              onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { zIndex: zIndex - 1 })}
              title="Send Backward (-1)"
              className="flex-1 flex items-center justify-center p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-[#2A2A2A] dark:hover:text-white rounded-md transition-colors"
            >
              <ChevronDown size={14} />
            </button>
            <div className="w-[1px] bg-zinc-200 dark:bg-[#2A2A2A] mx-0.5 my-1" />
            <button
              onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { zIndex: zIndex + 1 })}
              title="Bring Forward (+1)"
              className="flex-1 flex items-center justify-center p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-[#2A2A2A] dark:hover:text-white rounded-md transition-colors"
            >
              <ChevronUp size={14} />
            </button>
            <button
              onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { zIndex: 50 })}
              title="Bring to Front (50)"
              className="flex-1 flex items-center justify-center p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-[#2A2A2A] dark:hover:text-white rounded-md transition-colors"
            >
              <ChevronsUp size={14} />
            </button>
          </div>
        </div>

        {/* Custom Input */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-zinc-500 dark:text-[#777]">Custom Value</span>
          <div className="flex items-center bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] rounded overflow-hidden">
            <button
              onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { zIndex: zIndex - 1 })}
              className="px-2 py-1 text-zinc-400 dark:text-[#666] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#252525]"
            >
              <Minus size={11} />
            </button>
            <input
              type="number"
              value={zIndex}
              onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, { zIndex: Number(e.target.value) })}
              className="w-10 bg-transparent text-zinc-900 dark:text-white text-xs text-center outline-none"
            />
            <button
              onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { zIndex: zIndex + 1 })}
              className="px-2 py-1 text-zinc-400 dark:text-[#666] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#252525]"
            >
              <Plus size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
