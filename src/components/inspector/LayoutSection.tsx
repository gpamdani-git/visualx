import React, { useState, useRef } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { NodeStyleProps } from '../../types/builder';
import AdvancedLayoutPopover from './AdvancedLayoutPopover';
import LayoutConflictWarning from './LayoutConflictWarning';
import SectionContextMenu from './SectionContextMenu';
import { detectLayoutConflicts } from '../../utils/conflictUtils';
import { 
  ChevronDown, 
  Minus, 
  Plus, 
  Sliders,
  MoveHorizontal,
  MoveVertical
} from 'lucide-react';

interface LayoutSectionProps {
  effectiveStyles: NodeStyleProps;
  onRemove?: () => void;
}

const EMPTY_NODES: Record<string, any> = {};

export default function LayoutSection({ effectiveStyles, onRemove }: LayoutSectionProps) {
  const selectedNodeId = useBuilderStore((state) => state?.selectedNodeId);
  const activeBreakpoint = useBuilderStore((state) => state?.activeBreakpoint ?? 'lg');
  const updateNodeStyle = useBuilderStore((state) => state?.updateNodeStyle);
  const nodes = useBuilderStore((state) => state?.nodes) || EMPTY_NODES;
  const selectedNode = selectedNodeId ? nodes[selectedNodeId] : null;

  const [paddingSplit, setPaddingSplit] = useState(effectiveStyles.padding?.isSplit || false);
  const [showAdvancedPopover, setShowAdvancedPopover] = useState(false);
  const [popoverTop, setPopoverTop] = useState(160);
  const advancedButtonRef = useRef<HTMLButtonElement>(null);

  if (!selectedNodeId) return null;

  // Calculate layout conflicts
  const conflicts = detectLayoutConflicts(selectedNode, effectiveStyles);
  const layoutConflicts = conflicts.filter((c) => c.type === 'grid_flex' || c.type === 'leaf_layout');

  const isGrid = effectiveStyles.layoutType === 'Grid' || effectiveStyles.display === 'grid';
  const layoutDirection = effectiveStyles.layoutDirection || 'column';
  const justifyContent = effectiveStyles.justifyContent || 'flex-start';
  const alignItems = effectiveStyles.alignItems || 'flex-start';
  const flexWrap = effectiveStyles.flexWrap === 'wrap';
  const gap = effectiveStyles.gap !== undefined ? effectiveStyles.gap : 0;
  const gapX = effectiveStyles.gapX !== undefined ? effectiveStyles.gapX : gap;
  const gapY = effectiveStyles.gapY !== undefined ? effectiveStyles.gapY : gap;
  
  const gridColumns = typeof effectiveStyles.gridColumns === 'number' ? effectiveStyles.gridColumns : 2;
  const gridRows = typeof effectiveStyles.gridRows === 'number' ? effectiveStyles.gridRows : 2;
  const isMasonry = effectiveStyles.gridMasonry || Boolean(effectiveStyles.masonryColumns);

  const padding = effectiveStyles.padding || { top: 0, right: 0, bottom: 0, left: 0 };
  const topPad = padding.top ?? 0;
  const rightPad = padding.right ?? 0;
  const bottomPad = padding.bottom ?? 0;
  const leftPad = padding.left ?? 0;
  const isPaddingAllEqual = topPad === rightPad && topPad === bottomPad && topPad === leftPad;
  const hasAnyPadding = topPad > 0 || rightPad > 0 || bottomPad > 0 || leftPad > 0;
  const isPaddingMixed = !isPaddingAllEqual;

  const handleLayoutTypeChange = (type: 'Stack' | 'Grid') => {
    if (type === 'Grid') {
      updateNodeStyle(selectedNodeId, activeBreakpoint, {
        layoutType: 'Grid',
        display: 'grid',
        gridColumns: gridColumns || 2,
        gridRows: gridRows || 2,
        gapX: gapX || 0,
        gapY: gapY || 0,
        gridMasonry: false
      });
    } else {
      updateNodeStyle(selectedNodeId, activeBreakpoint, {
        layoutType: 'Stack',
        display: 'flex',
        layoutDirection: layoutDirection || 'column',
        gridMasonry: false
      });
    }
  };

  const handleUniformPadding = (val: number) => {
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      padding: { top: val, right: val, bottom: val, left: val, isSplit: false }
    });
  };

  const handleSidePadding = (side: 'top' | 'right' | 'bottom' | 'left', val: number) => {
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      padding: { ...padding, [side]: val, isSplit: true }
    });
  };

  const handleToggleAdvancedPopover = () => {
    if (advancedButtonRef.current) {
      const rect = advancedButtonRef.current.getBoundingClientRect();
      setPopoverTop(Math.max(60, rect.top - 120));
    }
    setShowAdvancedPopover((prev) => !prev);
  };

  // Convert distribute value for select
  const distributeMap: Record<string, string> = {
    'flex-start': 'Start',
    'center': 'Center',
    'flex-end': 'End',
    'space-between': 'Space Between',
    'space-around': 'Space Around',
    'space-evenly': 'Space Evenly'
  };

  const distributeReverseMap: Record<string, any> = {
    'Start': 'flex-start',
    'Center': 'center',
    'End': 'flex-end',
    'Space Between': 'space-between',
    'Space Around': 'space-around',
    'Space Evenly': 'space-around'
  };

  return (
    <div className="border-b border-zinc-200 dark:border-[#1E1E1E] py-3 px-3 text-zinc-900 dark:text-[#E0E0E0]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Layout</span>
          {layoutConflicts.length > 0 && (
            <LayoutConflictWarning conflicts={layoutConflicts} variant="compact" />
          )}
        </div>
        <SectionContextMenu 
          onDelete={onRemove}
          onReset={() => {
            updateNodeStyle(selectedNodeId, activeBreakpoint, {
              layoutType: undefined, display: undefined, layoutDirection: undefined, 
              alignItems: undefined, justifyContent: undefined, gap: undefined,
              padding: undefined, flexWrap: undefined
            });
          }}
        />
      </div>

      {/* Prominent Conflict Warning Banner with Precedence Info */}
      {layoutConflicts.length > 0 && (
        <LayoutConflictWarning conflicts={layoutConflicts} variant="banner" />
      )}

      <div className="flex flex-col gap-3 text-xs">
        {/* Type: Stack | Grid */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-600 dark:text-[#A0A0A0]">Type</span>
            {layoutConflicts.length > 0 && (
              <LayoutConflictWarning 
                conflicts={layoutConflicts} 
                variant="badge" 
                badgeLabel={isGrid ? "Grid active" : "Stack active"}
              />
            )}
          </div>
          <div className="flex bg-zinc-100 dark:bg-[#222] p-0.5 rounded-lg border border-zinc-200/80 dark:border-[#222] w-36">
            <button
              onClick={() => handleLayoutTypeChange('Stack')}
              className={`flex-1 py-1 rounded-md text-xs font-medium transition-all ${
                !isGrid
                  ? 'bg-white dark:bg-[#2C2C2C] text-zinc-900 dark:text-white font-semibold shadow-xs'
                  : 'text-zinc-500 dark:text-[#777] hover:text-zinc-800 dark:hover:text-[#CCC]'
              }`}
            >
              Stack
            </button>
            <button
              onClick={() => handleLayoutTypeChange('Grid')}
              className={`flex-1 py-1 rounded-md text-xs font-medium transition-all ${
                isGrid
                  ? 'bg-white dark:bg-[#2C2C2C] text-zinc-900 dark:text-white font-semibold shadow-xs'
                  : 'text-zinc-500 dark:text-[#777] hover:text-zinc-800 dark:hover:text-[#CCC]'
              }`}
            >
              Grid
            </button>
          </div>
        </div>

        {/* ================= STACK MODE ================= */}
        {!isGrid ? (
          <>
            {/* Direction: Horizontal ↔ | Vertical ↕ */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-600 dark:text-[#A0A0A0]">Direction</span>
                <LayoutConflictWarning conflicts={layoutConflicts} variant="inline" highlightKey="layoutDirection" />
              </div>
              <div className="flex bg-zinc-100 dark:bg-[#222] p-0.5 rounded-lg border border-zinc-200/80 dark:border-[#222] w-36">
                <button
                  onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { layoutDirection: 'row' })}
                  title="Horizontal (Row)"
                  className={`flex-1 py-1 flex items-center justify-center rounded-md transition-all ${
                    layoutDirection === 'row'
                      ? 'bg-white dark:bg-[#333] text-zinc-900 dark:text-white shadow-sm rounded-md'
                      : 'text-zinc-500 dark:text-[#777] hover:text-zinc-800 dark:hover:text-[#CCC]'
                  }`}
                >
                  <MoveHorizontal size={14} />
                </button>
                <button
                  onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { layoutDirection: 'column' })}
                  title="Vertical (Column)"
                  className={`flex-1 py-1 flex items-center justify-center rounded-md transition-all ${
                    layoutDirection === 'column'
                      ? 'bg-white dark:bg-[#333] text-zinc-900 dark:text-white shadow-sm rounded-md'
                      : 'text-zinc-500 dark:text-[#777] hover:text-zinc-800 dark:hover:text-[#CCC]'
                  }`}
                >
                  <MoveVertical size={14} />
                </button>
              </div>
            </div>

            {/* Distribute (justify-content) */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 dark:text-[#A0A0A0]">Distribute</span>
              <div className="relative w-36">
                <select
                  value={distributeMap[justifyContent] || 'Start'}
                  onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, { justifyContent: distributeReverseMap[e.target.value] || 'flex-start' })}
                  className="w-full appearance-none bg-zinc-100 dark:bg-[#222] hover:bg-zinc-200/70 dark:hover:bg-[#252525] border border-zinc-200/80 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-3 py-1 pr-7 rounded-lg outline-none cursor-pointer font-medium"
                >
                  <option value="Start">Start</option>
                  <option value="Center">Center</option>
                  <option value="End">End</option>
                  <option value="Space Between">Space Between</option>
                  <option value="Space Around">Space Around</option>
                  <option value="Space Evenly">Space Evenly</option>
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-[#777] pointer-events-none" />
              </div>
            </div>

            {/* Align (align-items: Start | Center | End) */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 dark:text-[#A0A0A0]">Align</span>
              <div className="flex bg-zinc-100 dark:bg-[#222] p-0.5 rounded-lg border border-zinc-200/80 dark:border-[#222] w-36 justify-between">
                {/* Start */}
                <button
                  onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { alignItems: 'flex-start' })}
                  title="Align Start"
                  className={`flex-1 py-1 flex items-center justify-center rounded-md transition-all ${
                    alignItems === 'flex-start'
                      ? 'bg-white dark:bg-[#333] text-zinc-900 dark:text-white shadow-sm rounded-md'
                      : 'text-zinc-400 dark:text-[#777] hover:text-zinc-800 dark:hover:text-[#CCC]'
                  }`}
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="3" width="2" height="10" rx="1" fill="currentColor" />
                    <rect x="6" y="5" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>

                {/* Center */}
                <button
                  onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { alignItems: 'center' })}
                  title="Align Center"
                  className={`flex-1 py-1 flex items-center justify-center rounded-md transition-all ${
                    alignItems === 'center'
                      ? 'bg-white dark:bg-[#333] text-zinc-900 dark:text-white shadow-sm rounded-md'
                      : 'text-zinc-400 dark:text-[#777] hover:text-zinc-800 dark:hover:text-[#CCC]'
                  }`}
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <rect x="4" y="5" width="8" height="6" rx="1.5" fill={alignItems === 'center' ? '#0099FF' : 'currentColor'} fillOpacity={alignItems === 'center' ? '0.15' : '0'} stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>

                {/* End */}
                <button
                  onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { alignItems: 'flex-end' })}
                  title="Align End"
                  className={`flex-1 py-1 flex items-center justify-center rounded-md transition-all ${
                    alignItems === 'flex-end'
                      ? 'bg-white dark:bg-[#333] text-zinc-900 dark:text-white shadow-sm rounded-md'
                      : 'text-zinc-400 dark:text-[#777] hover:text-zinc-800 dark:hover:text-[#CCC]'
                  }`}
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="12" y="3" width="2" height="10" rx="1" fill="currentColor" />
                    <rect x="2" y="5" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Wrap: Yes | No */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-600 dark:text-[#A0A0A0]">Wrap</span>
                <LayoutConflictWarning conflicts={layoutConflicts} variant="inline" highlightKey="flexWrap" />
              </div>
              <div className="flex bg-zinc-100 dark:bg-[#222] p-0.5 rounded-lg border border-zinc-200/80 dark:border-[#222] w-36">
                <button
                  onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { flexWrap: 'wrap' })}
                  className={`flex-1 py-1 rounded-md text-xs font-medium transition-all ${
                    flexWrap
                      ? 'bg-white dark:bg-[#2C2C2C] text-zinc-900 dark:text-white font-semibold shadow-xs'
                      : 'text-zinc-500 dark:text-[#777] hover:text-zinc-800 dark:hover:text-[#CCC]'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { flexWrap: 'nowrap' })}
                  className={`flex-1 py-1 rounded-md text-xs font-medium transition-all ${
                    !flexWrap
                      ? 'bg-white dark:bg-[#2C2C2C] text-zinc-900 dark:text-white font-semibold shadow-xs'
                      : 'text-zinc-500 dark:text-[#777] hover:text-zinc-800 dark:hover:text-[#CCC]'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Gap: Input + Slider */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 dark:text-[#A0A0A0]">Gap</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={gap}
                  onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, { gap: Math.max(0, Number(e.target.value)) })}
                  className="w-16 bg-zinc-100 dark:bg-[#222] border border-zinc-200/80 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-1 rounded-lg outline-none text-center font-medium"
                />
                <input
                  type="range"
                  min="0"
                  max="64"
                  value={gap}
                  onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, { gap: Number(e.target.value) })}
                  className="w-16 accent-[#0099FF] h-1.5 bg-zinc-200 dark:bg-[#2A2A2A] rounded cursor-pointer"
                />
              </div>
            </div>
          </>
        ) : (
          /* ================= GRID MODE ================= */
          <>
            {/* Masonry: Yes | No */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-600 dark:text-[#A0A0A0]">Masonry</span>
                <LayoutConflictWarning conflicts={layoutConflicts} variant="inline" highlightKey="gridMasonry" />
              </div>
              <div className="flex bg-zinc-100 dark:bg-[#222] p-0.5 rounded-lg border border-zinc-200/80 dark:border-[#222] w-36">
                <button
                  onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { gridMasonry: true, masonryColumns: 2 })}
                  className={`flex-1 py-1 rounded-md text-xs font-medium transition-all ${
                    isMasonry
                      ? 'bg-white dark:bg-[#2C2C2C] text-zinc-900 dark:text-white font-semibold shadow-xs'
                      : 'text-zinc-500 dark:text-[#777] hover:text-zinc-800 dark:hover:text-[#CCC]'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { gridMasonry: false, masonryColumns: undefined })}
                  className={`flex-1 py-1 rounded-md text-xs font-medium transition-all ${
                    !isMasonry
                      ? 'bg-white dark:bg-[#2C2C2C] text-zinc-900 dark:text-white font-semibold shadow-xs'
                      : 'text-zinc-500 dark:text-[#777] hover:text-zinc-800 dark:hover:text-[#CCC]'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Columns Stepper */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-600 dark:text-[#A0A0A0]">Columns</span>
                <LayoutConflictWarning conflicts={layoutConflicts} variant="inline" highlightKey="gridColumns" />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={gridColumns}
                  onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, { gridColumns: Math.max(1, Number(e.target.value)) })}
                  className="w-16 bg-zinc-100 dark:bg-[#222] border border-zinc-200/80 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-1 rounded-lg outline-none text-center font-medium"
                />
                <div className="flex items-center bg-zinc-100 dark:bg-[#222] border border-transparent dark:border-transparent hover:border-zinc-300 dark:hover:border-[#333] rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { gridColumns: Math.max(1, gridColumns - 1) })}
                    className="px-2 py-1 text-zinc-500 dark:text-[#888] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-[#252525] transition-colors"
                  >
                    <Minus size={11} />
                  </button>
                  <div className="w-[1px] h-3 bg-zinc-300 dark:bg-[#333]" />
                  <button
                    onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { gridColumns: gridColumns + 1 })}
                    className="px-2 py-1 text-zinc-500 dark:text-[#888] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-[#252525] transition-colors"
                  >
                    <Plus size={11} />
                  </button>
                </div>
              </div>
            </div>

            {/* Rows Stepper (hanya bila bukan Masonry) */}
            {!isMasonry && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-600 dark:text-[#A0A0A0]">Rows</span>
                  <LayoutConflictWarning conflicts={layoutConflicts} variant="inline" highlightKey="gridRows" />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={gridRows}
                    onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, { gridRows: Math.max(1, Number(e.target.value)) })}
                    className="w-16 bg-zinc-100 dark:bg-[#222] border border-zinc-200/80 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-1 rounded-lg outline-none text-center font-medium"
                  />
                  <div className="flex items-center bg-zinc-100 dark:bg-[#222] border border-transparent dark:border-transparent hover:border-zinc-300 dark:hover:border-[#333] rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { gridRows: Math.max(1, gridRows - 1) })}
                      className="px-2 py-1 text-zinc-500 dark:text-[#888] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-[#252525] transition-colors"
                    >
                      <Minus size={11} />
                    </button>
                    <div className="w-[1px] h-3 bg-zinc-300 dark:bg-[#333]" />
                    <button
                      onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { gridRows: gridRows + 1 })}
                      className="px-2 py-1 text-zinc-500 dark:text-[#888] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-[#252525] transition-colors"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Gap with Slider */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-zinc-600 dark:text-[#A0A0A0] w-16">Gap</span>
              <div className="flex-1 flex items-center gap-3">
                <div className="flex items-center bg-zinc-100 dark:bg-[#222] border border-transparent dark:border-transparent hover:border-zinc-300 dark:hover:border-[#333] rounded-lg px-2 py-1.5 w-16 shrink-0">
                  <input
                    type="number"
                    value={gapX}
                    onChange={(e) => {
                       const val = Math.max(0, Number(e.target.value));
                       updateNodeStyle(selectedNodeId, activeBreakpoint, { gapX: val, gapY: val });
                    }}
                    className="w-full bg-transparent text-zinc-900 dark:text-white text-xs text-center outline-none font-bold"
                  />
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="120" 
                  value={gapX}
                  onChange={(e) => {
                     const val = Number(e.target.value);
                     updateNodeStyle(selectedNodeId, activeBreakpoint, { gapX: val, gapY: val });
                  }}
                  className="flex-1 accent-[#0099FF] h-1.5 bg-[#222] rounded-full appearance-none outline-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #0099FF ${(gapX / 120) * 100}%, #222 ${(gapX / 120) * 100}%)`
                  }}
                />
              </div>
            </div>
          </>
        )}

        {/* Padding (Common to both Stack and Grid) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-600 dark:text-[#A0A0A0]">Padding</span>
            {isPaddingMixed && hasAnyPadding && !paddingSplit && (
              <span className="text-[9px] bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white px-1.5 py-0.5 rounded font-medium">
                Mixed
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!paddingSplit ? (
              <input
                type="number"
                value={isPaddingMixed ? '' : topPad}
                placeholder={isPaddingMixed ? 'Mixed' : '0'}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : Number(e.target.value);
                  handleUniformPadding(val);
                }}
                className="w-16 bg-zinc-100 dark:bg-[#222] border border-zinc-200/80 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-1 rounded-lg outline-none text-center font-medium"
              />
            ) : null}

            {/* Split Toggle Icon [ □ ] [ ◰ ] */}
            <div className="flex bg-zinc-100 dark:bg-[#222] p-0.5 rounded-lg border border-zinc-200/80 dark:border-[#222]">
              <button
                onClick={() => setPaddingSplit(false)}
                title="Uniform Padding"
                className={`p-1 rounded-md transition-all ${
                  !paddingSplit
                    ? 'bg-white dark:bg-[#333] text-zinc-900 dark:text-white shadow-sm rounded-md'
                    : 'text-zinc-400 dark:text-[#777] hover:text-zinc-800 dark:hover:text-[#CCC]'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2.5" y="2.5" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
              <button
                onClick={() => setPaddingSplit(true)}
                title="4-Side Padding"
                className={`p-1 rounded-md transition-all ${
                  paddingSplit
                    ? 'bg-white dark:bg-[#333] text-zinc-900 dark:text-white shadow-sm rounded-md'
                    : 'text-zinc-400 dark:text-[#777] hover:text-zinc-800 dark:hover:text-[#CCC]'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 5.5V3.5C2.5 2.94772 2.94772 2.5 3.5 2.5H5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M13.5 5.5V3.5C13.5 2.94772 13.0523 2.5 12.5 2.5H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M2.5 10.5V12.5C2.5 13.0523 2.94772 13.5 3.5 13.5H5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M13.5 10.5V12.5C13.5 13.0523 13.0523 13.5 12.5 13.5H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 4-Corner Padding Split Inputs */}
        {paddingSplit && (
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {[
              { side: 'top', label: 'T', val: topPad },
              { side: 'right', label: 'R', val: rightPad },
              { side: 'bottom', label: 'B', val: bottomPad },
              { side: 'left', label: 'L', val: leftPad }
            ].map(({ side, label, val }) => (
              <div 
                key={side}
                className={`flex flex-col items-center py-1 px-1 rounded-lg border transition-all ${
                  val > 0 
                    ? 'bg-zinc-100 dark:bg-zinc-9000/5 dark:bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-600/30' 
                    : 'bg-zinc-100 dark:bg-[#222] border-zinc-200/80 dark:border-transparent hover:dark:border-[#333]'
                }`}
              >
                <span className={`text-[9px] font-semibold ${val > 0 ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-[#666]'}`}>
                  {label}
                </span>
                <input
                  type="number"
                  value={val}
                  onChange={(e) => handleSidePadding(side as any, Number(e.target.value))}
                  className={`w-full bg-transparent text-xs text-center outline-none font-medium ${
                    val > 0 ? 'text-zinc-900 dark:text-white' : 'text-zinc-900 dark:text-white'
                  }`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Advanced Button (Khusus Grid Mode) */}
        {isGrid && (
          <div className="pt-1">
            <button
              ref={advancedButtonRef}
              data-advanced-layout-trigger="true"
              onClick={handleToggleAdvancedPopover}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200/70 dark:bg-[#222] dark:hover:bg-[#333] border border-zinc-200/80 dark:border-transparent text-zinc-900 dark:text-white font-medium text-xs transition-colors"
            >
              <div className="w-5 h-5 rounded-md bg-[#0099FF] flex items-center justify-center text-white shadow-2xs">
                <Sliders size={11} />
              </div>
              <span>Advanced</span>
            </button>
          </div>
        )}
      </div>

      {/* Floating Advanced Layout Popover */}
      {showAdvancedPopover && (
        <AdvancedLayoutPopover
          effectiveStyles={effectiveStyles}
          top={popoverTop}
          onClose={() => setShowAdvancedPopover(false)}
        />
      )}
    </div>
  );
}
