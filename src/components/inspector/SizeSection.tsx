import React, { useState, useRef, useEffect } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { NodeStyleProps, SizingMode } from '../../types/builder';
import { ChevronDown, Plus, X } from 'lucide-react';
import LayoutConflictWarning from './LayoutConflictWarning';
import { detectLayoutConflicts } from '../../utils/conflictUtils';

interface SizeSectionProps {
  effectiveStyles: NodeStyleProps;
}

const EMPTY_NODES: Record<string, any> = {};

export default function SizeSection({ effectiveStyles }: SizeSectionProps) {
  const selectedNodeId = useBuilderStore((state) => state?.selectedNodeId);
  const activeBreakpoint = useBuilderStore((state) => state?.activeBreakpoint ?? 'lg');
  const updateNodeStyle = useBuilderStore((state) => state?.updateNodeStyle);
  const nodes = useBuilderStore((state) => state?.nodes) || EMPTY_NODES;
  const selectedNode = selectedNodeId ? nodes[selectedNodeId] : null;

  const [showAddMenu, setShowAddMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowAddMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!selectedNodeId) return null;

  const conflicts = detectLayoutConflicts(selectedNode, effectiveStyles);
  const sizeConflicts = conflicts.filter((c) => c.type === 'size_constraint');

  const widthType = effectiveStyles.widthType || 'fill';
  const widthVal = effectiveStyles.widthValue ?? '100%';
  const heightType = effectiveStyles.heightType || 'fit-content';
  const heightVal = effectiveStyles.heightValue ?? 'auto';

  const hasMinWidth = effectiveStyles.minWidth !== undefined;
  const hasMaxWidth = effectiveStyles.maxWidth !== undefined;
  const hasMinHeight = effectiveStyles.minHeight !== undefined;
  const hasMaxHeight = effectiveStyles.maxHeight !== undefined;
  const hasAspectRatio = effectiveStyles.aspectRatio !== undefined;

  const handleWidthTypeChange = (type: SizingMode) => {
    let newVal: string | number = '100%';
    if (type === 'fixed') newVal = 300;
    else if (type === 'fill') newVal = '100%';
    else if (type === 'fit-content') newVal = 'auto';
    else if (type === '1fr') newVal = '1fr';
    else if (type === 'relative') newVal = 50;

    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      widthType: type,
      widthValue: newVal
    });
  };

  const handleHeightTypeChange = (type: SizingMode) => {
    let newVal: string | number = 'auto';
    if (type === 'fixed') newVal = 200;
    else if (type === 'fill') newVal = '100%';
    else if (type === 'fit-content') newVal = 'auto';
    else if (type === '1fr') newVal = '1fr';
    else if (type === 'relative') newVal = 50;

    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      heightType: type,
      heightValue: newVal
    });
  };

  const addConstraint = (constraint: 'minWidth' | 'maxWidth' | 'minHeight' | 'maxHeight' | 'aspectRatio') => {
    setShowAddMenu(false);
    switch (constraint) {
      case 'minWidth':
        updateNodeStyle(selectedNodeId, activeBreakpoint, { minWidth: 200, minWidthType: 'fixed' });
        break;
      case 'maxWidth':
        updateNodeStyle(selectedNodeId, activeBreakpoint, { maxWidth: 1200, maxWidthType: 'fixed' });
        break;
      case 'minHeight':
        updateNodeStyle(selectedNodeId, activeBreakpoint, { minHeight: 100, minHeightType: 'fixed' });
        break;
      case 'maxHeight':
        updateNodeStyle(selectedNodeId, activeBreakpoint, { maxHeight: 800, maxHeightType: 'fixed' });
        break;
      case 'aspectRatio':
        updateNodeStyle(selectedNodeId, activeBreakpoint, { aspectRatio: '16/9' });
        break;
    }
  };

  return (
    <div className="border-b border-zinc-200 dark:border-[#1E1E1E] py-2.5 px-3">
      {/* Header with Plus Button & Conflict Badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-zinc-500 dark:text-white font-bold tracking-wider capitalize">Size</span>
          {sizeConflicts.length > 0 && (
            <LayoutConflictWarning conflicts={sizeConflicts} variant="badge" badgeLabel="Constraint Conflict" />
          )}
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="p-1 rounded text-zinc-500 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors"
            title="Add Size Constraint"
          >
            <Plus size={13} />
          </button>

          {showAddMenu && (
            <div className="absolute right-0 top-6 z-50 w-40 bg-white dark:bg-[#222] border border-zinc-200 dark:border-[#333] rounded shadow-2xl py-1 text-xs">
              {!hasMinWidth && (
                <button
                  onClick={() => addConstraint('minWidth')}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#252525] text-zinc-800 dark:text-[#DDD] flex items-center justify-between"
                >
                  <span>Min Width</span>
                  <Plus size={11} className="text-zinc-400 dark:text-[#666]" />
                </button>
              )}
              {!hasMaxWidth && (
                <button
                  onClick={() => addConstraint('maxWidth')}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#252525] text-zinc-800 dark:text-[#DDD] flex items-center justify-between"
                >
                  <span>Max Width</span>
                  <Plus size={11} className="text-zinc-400 dark:text-[#666]" />
                </button>
              )}
              {!hasMinHeight && (
                <button
                  onClick={() => addConstraint('minHeight')}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#252525] text-zinc-800 dark:text-[#DDD] flex items-center justify-between"
                >
                  <span>Min Height</span>
                  <Plus size={11} className="text-zinc-400 dark:text-[#666]" />
                </button>
              )}
              {!hasMaxHeight && (
                <button
                  onClick={() => addConstraint('maxHeight')}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#252525] text-zinc-800 dark:text-[#DDD] flex items-center justify-between"
                >
                  <span>Max Height</span>
                  <Plus size={11} className="text-zinc-400 dark:text-[#666]" />
                </button>
              )}
              {!hasAspectRatio && (
                <button
                  onClick={() => addConstraint('aspectRatio')}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#252525] text-zinc-800 dark:text-[#DDD] flex items-center justify-between"
                >
                  <span>Aspect Ratio</span>
                  <Plus size={11} className="text-zinc-400 dark:text-[#666]" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Width Row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs text-zinc-600 dark:text-[#A0A0A0] w-12">Width</span>
        <div className="flex items-center gap-1.5 flex-1 justify-end">
          <div className="relative">
            <select
              value={widthType}
              onChange={(e) => handleWidthTypeChange(e.target.value as SizingMode)}
              className="appearance-none bg-white dark:bg-[#222] hover:bg-zinc-50 dark:hover:bg-[#2A2A2A] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2 py-1 pr-5 rounded outline-none cursor-pointer"
            >
              <option value="auto">Auto</option>
              <option value="fixed">Fixed</option>
              <option value="fill">Fill</option>
              <option value="fit-content">Fit</option>
              <option value="1fr">1fr</option>
              <option value="relative">Relative</option>
            </select>
            <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-[#777] pointer-events-none" />
          </div>

          {(widthType === 'fixed' || widthType === 'relative') && (
            <div className="flex items-center bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] rounded px-1.5 py-0.5 w-20">
              <input
                type="number"
                value={typeof widthVal === 'number' ? widthVal : parseInt(String(widthVal)) || 0}
                onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, { widthValue: Number(e.target.value) })}
                className="w-full bg-transparent text-zinc-900 dark:text-white text-xs text-right outline-none"
              />
              <span className="text-[10px] text-zinc-400 dark:text-[#666] ml-1">{widthType === 'relative' ? '%' : 'px'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Height Row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs text-zinc-600 dark:text-[#A0A0A0] w-12">Height</span>
        <div className="flex items-center gap-1.5 flex-1 justify-end">
          <div className="relative">
            <select
              value={heightType}
              onChange={(e) => handleHeightTypeChange(e.target.value as SizingMode)}
              className="appearance-none bg-white dark:bg-[#222] hover:bg-zinc-50 dark:hover:bg-[#2A2A2A] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2 py-1 pr-5 rounded outline-none cursor-pointer"
            >
              <option value="auto">Auto</option>
              <option value="fixed">Fixed</option>
              <option value="fill">Fill</option>
              <option value="fit-content">Fit</option>
              <option value="1fr">1fr</option>
              <option value="relative">Relative</option>
            </select>
            <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-[#777] pointer-events-none" />
          </div>

          {(heightType === 'fixed' || heightType === 'relative') && (
            <div className="flex items-center bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] rounded px-1.5 py-0.5 w-20">
              <input
                type="number"
                value={typeof heightVal === 'number' ? heightVal : parseInt(String(heightVal)) || 0}
                onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, { heightValue: Number(e.target.value) })}
                className="w-full bg-transparent text-zinc-900 dark:text-white text-xs text-right outline-none"
              />
              <span className="text-[10px] text-zinc-400 dark:text-[#666] ml-1">{heightType === 'relative' ? '%' : 'px'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Active Min Width Constraint */}
      {hasMinWidth && (
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs text-zinc-500 dark:text-[#888]">Min W</span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={Number(effectiveStyles.minWidth) || 0}
              onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, { minWidth: Number(e.target.value) })}
              className="w-16 bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-1.5 py-0.5 rounded text-right outline-none"
            />
            <span className="text-[10px] text-zinc-400 dark:text-[#666]">px</span>
            <button
              onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { minWidth: undefined })}
              className="p-1 text-zinc-400 dark:text-[#666] hover:text-red-500 dark:hover:text-red-400"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Active Max Width Constraint */}
      {hasMaxWidth && (
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs text-zinc-500 dark:text-[#888]">Max W</span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={Number(effectiveStyles.maxWidth) || 0}
              onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, { maxWidth: Number(e.target.value) })}
              className="w-16 bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-1.5 py-0.5 rounded text-right outline-none"
            />
            <span className="text-[10px] text-zinc-400 dark:text-[#666]">px</span>
            <button
              onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { maxWidth: undefined })}
              className="p-1 text-zinc-400 dark:text-[#666] hover:text-red-500 dark:hover:text-red-400"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Active Min Height Constraint */}
      {hasMinHeight && (
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs text-zinc-500 dark:text-[#888]">Min H</span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={Number(effectiveStyles.minHeight) || 0}
              onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, { minHeight: Number(e.target.value) })}
              className="w-16 bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-1.5 py-0.5 rounded text-right outline-none"
            />
            <span className="text-[10px] text-zinc-400 dark:text-[#666]">px</span>
            <button
              onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { minHeight: undefined })}
              className="p-1 text-zinc-400 dark:text-[#666] hover:text-red-500 dark:hover:text-red-400"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Active Max Height Constraint */}
      {hasMaxHeight && (
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs text-zinc-500 dark:text-[#888]">Max H</span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={Number(effectiveStyles.maxHeight) || 0}
              onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, { maxHeight: Number(e.target.value) })}
              className="w-16 bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-1.5 py-0.5 rounded text-right outline-none"
            />
            <span className="text-[10px] text-zinc-400 dark:text-[#666]">px</span>
            <button
              onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { maxHeight: undefined })}
              className="p-1 text-zinc-400 dark:text-[#666] hover:text-red-500 dark:hover:text-red-400"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Active Aspect Ratio */}
      {hasAspectRatio && (
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs text-zinc-500 dark:text-[#888]">Ratio</span>
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={effectiveStyles.aspectRatio || '16/9'}
              onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, { aspectRatio: e.target.value })}
              className="w-16 bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-1.5 py-0.5 rounded text-right outline-none"
            />
            <button
              onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { aspectRatio: undefined })}
              className="p-1 text-zinc-400 dark:text-[#666] hover:text-red-500 dark:hover:text-red-400"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
