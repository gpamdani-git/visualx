import React, { useState, useRef, useEffect } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { LayoutConflict } from '../../utils/conflictUtils';
import { 
  AlertTriangle, 
  Info, 
  Check, 
  ArrowRight, 
  X, 
  Sparkles, 
  Layers,
  HelpCircle,
  EyeOff
} from 'lucide-react';

interface LayoutConflictWarningProps {
  conflicts: LayoutConflict[];
  variant?: 'banner' | 'compact' | 'inline' | 'badge';
  highlightKey?: string;
  badgeLabel?: string;
}

export default function LayoutConflictWarning({
  conflicts,
  variant = 'banner',
  highlightKey,
  badgeLabel
}: LayoutConflictWarningProps) {
  const selectedNodeId = useBuilderStore((state) => state?.selectedNodeId);
  const activeBreakpoint = useBuilderStore((state) => state?.activeBreakpoint ?? 'lg');
  const updateNodeStyle = useBuilderStore((state) => state?.updateNodeStyle);

  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);
  const [hoveredConflictId, setHoveredConflictId] = useState<string | null>(null);
  const [resolvedIds, setResolvedIds] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveTooltipId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!selectedNodeId || !conflicts || conflicts.length === 0) return null;

  // Filter conflicts if highlightKey is specified for inline display
  const matchingConflicts = highlightKey
    ? conflicts.filter((c) => c.conflictingKeys.includes(highlightKey))
    : conflicts;

  if (matchingConflicts.length === 0) return null;

  const handleResolve = (conflict: LayoutConflict) => {
    if (!conflict.resolutionAction || !selectedNodeId) return;
    updateNodeStyle(selectedNodeId, activeBreakpoint, conflict.resolutionAction.cleanseStyles);
    setResolvedIds((prev) => ({ ...prev, [conflict.id]: true }));
    setTimeout(() => {
      setActiveTooltipId(null);
      setHoveredConflictId(null);
    }, 450);
  };

  // Reusable Tooltip Popover content showing explicit "Which property will be used" breakdown
  const renderTooltipContent = (conflict: LayoutConflict) => {
    const isResolved = resolvedIds[conflict.id];
    const isWarning = conflict.severity === 'warning';

    return (
      <div 
        className="w-72 bg-white dark:bg-[#181818] border border-zinc-200 dark:border-[#2E2E2E] rounded-xl shadow-2xl p-3 z-50 text-xs text-zinc-900 dark:text-zinc-100 select-none animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-2 border-b border-zinc-100 dark:border-[#282828] mb-2">
          <div className="flex items-center gap-1.5 font-semibold text-[11px]">
            {isWarning ? (
              <AlertTriangle size={13} className="text-zinc-900 dark:text-white shrink-0 stroke-[2.5]" />
            ) : (
              <Info size={13} className="text-zinc-900 dark:text-white shrink-0 stroke-[2.5]" />
            )}
            <span className={isWarning ? 'text-zinc-900 dark:text-white dark:text-white' : 'text-zinc-900 dark:text-white'}>
              {conflict.title}
            </span>
          </div>
          <button
            onClick={() => {
              setActiveTooltipId(null);
              setHoveredConflictId(null);
            }}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white p-0.5 rounded transition-colors"
          >
            <X size={12} />
          </button>
        </div>

        {/* Description */}
        <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-2.5">
          {conflict.description}
        </p>

        {/* "Which property will be used?" Card */}
        <div className="bg-zinc-50 dark:bg-[#1F1F1F] border border-zinc-200/80 dark:border-[#2C2C2C] rounded-lg p-2.5 mb-2.5 space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-[#888] flex items-center justify-between">
            <span>Property Resolution & Precedence</span>
            <span className="text-[9px] font-normal text-zinc-900 dark:text-white dark:text-white">CSS Rules Applied</span>
          </div>

          {/* Active / Used Property */}
          <div className="flex items-start gap-1.5 text-[11px] bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 rounded-md p-1.5">
            <Check size={13} className="text-zinc-900 dark:text-white shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-semibold text-zinc-900 dark:text-white dark:text-white block">
                Will Be Used:
              </span>
              <span className="font-medium text-emerald-800 dark:text-emerald-200 text-[11px]">
                {conflict.activePropertyUsed || conflict.precedentValue}
              </span>
            </div>
          </div>

          {/* Ignored / Inactive Property */}
          {conflict.ignoredPropertyNotice && (
            <div className="flex items-start gap-1.5 text-[11px] bg-zinc-100 dark:bg-[#262626] border border-zinc-200/60 dark:border-[#333] rounded-md p-1.5 opacity-90">
              <EyeOff size={13} className="text-zinc-400 dark:text-[#777] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-semibold text-zinc-500 dark:text-[#888] block">
                  Inactive / Ignored:
                </span>
                <span className="text-zinc-500 dark:text-[#999] text-[11px] line-through">
                  {conflict.ignoredPropertyNotice}
                </span>
              </div>
            </div>
          )}

          {/* Precedence Explanation */}
          <p className="text-[10px] text-zinc-500 dark:text-[#999] leading-tight pt-0.5">
            {conflict.precedenceExplanation}
          </p>
        </div>

        {/* 1-Click Resolution Action */}
        {conflict.resolutionAction && (
          <button
            type="button"
            disabled={isResolved}
            onClick={() => handleResolve(conflict)}
            className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-[11px] font-medium transition-all ${
              isResolved
                ? 'bg-emerald-500/20 text-zinc-900 dark:text-white dark:text-white border border-emerald-500/30'
                : 'bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600/30 text-zinc-900 dark:text-white dark:text-[#38BDF8] cursor-pointer shadow-2xs'
            }`}
          >
            {isResolved ? (
              <>
                <Check size={12} className="text-zinc-900 dark:text-white" />
                <span className="text-zinc-900 dark:text-white font-semibold">Styles Cleaned!</span>
              </>
            ) : (
              <>
                <Sparkles size={12} />
                <span>{conflict.resolutionAction.label}</span>
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  // 1. SUBTLE INFO BADGE VARIANT
  if (variant === 'badge') {
    const conflict = matchingConflicts[0];
    const isTooltipOpen = activeTooltipId === conflict.id || hoveredConflictId === conflict.id;
    const isWarning = conflict.severity === 'warning';

    return (
      <div 
        className="relative inline-flex items-center" 
        ref={containerRef}
        onMouseEnter={() => setHoveredConflictId(conflict.id)}
        onMouseLeave={() => setHoveredConflictId(null)}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActiveTooltipId(activeTooltipId === conflict.id ? null : conflict.id);
          }}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium transition-all cursor-pointer ${
            isWarning
              ? 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white dark:text-white'
              : 'bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600/25 text-zinc-900 dark:text-white dark:text-[#38BDF8]'
          }`}
          title="Click or hover to inspect property precedence"
        >
          {isWarning ? (
            <AlertTriangle size={10} className="stroke-[2.5]" />
          ) : (
            <Info size={10} className="stroke-[2.5]" />
          )}
          <span>{badgeLabel || (isWarning ? 'Conflict' : 'Info')}</span>
        </button>

        {isTooltipOpen && (
          <div className="absolute right-0 top-full mt-1.5 z-50">
            {renderTooltipContent(conflict)}
          </div>
        )}
      </div>
    );
  }

  // 2. INLINE VARIANT
  if (variant === 'inline') {
    const conflict = matchingConflicts[0];
    const isTooltipOpen = activeTooltipId === conflict.id || hoveredConflictId === conflict.id;
    const isWarning = conflict.severity === 'warning';

    return (
      <div 
        className="relative inline-flex items-center" 
        ref={containerRef}
        onMouseEnter={() => setHoveredConflictId(conflict.id)}
        onMouseLeave={() => setHoveredConflictId(null)}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActiveTooltipId(activeTooltipId === conflict.id ? null : conflict.id);
          }}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium transition-all cursor-pointer ${
            isWarning
              ? 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white dark:text-white'
              : 'bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600/25 text-zinc-900 dark:text-white'
          }`}
          title="Click to view layout conflict & precedence"
        >
          {isWarning ? <AlertTriangle size={10} className="stroke-[2.5]" /> : <Info size={10} className="stroke-[2.5]" />}
          <span>{isWarning ? 'Conflict' : 'Overridden'}</span>
        </button>

        {isTooltipOpen && (
          <div className="absolute right-0 top-full mt-1.5 z-50">
            {renderTooltipContent(conflict)}
          </div>
        )}
      </div>
    );
  }

  // 3. COMPACT VARIANT (for Section Headers)
  if (variant === 'compact') {
    const total = matchingConflicts.length;
    const conflict = matchingConflicts[0];
    const isTooltipOpen = activeTooltipId === conflict.id || hoveredConflictId === conflict.id;

    return (
      <div 
        className="relative inline-flex items-center" 
        ref={containerRef}
        onMouseEnter={() => setHoveredConflictId(conflict.id)}
        onMouseLeave={() => setHoveredConflictId(null)}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActiveTooltipId(activeTooltipId ? null : conflict.id);
          }}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600/30 text-zinc-900 dark:text-white text-[10px] font-semibold transition-all cursor-pointer"
          title="View style precedence & conflict details"
        >
          <Info size={11} className="stroke-[2.5]" />
          <span>{total === 1 ? '1 Conflict' : `${total} Conflicts`}</span>
        </button>

        {isTooltipOpen && (
          <div className="absolute left-0 top-full mt-1.5 z-50">
            {renderTooltipContent(conflict)}
          </div>
        )}
      </div>
    );
  }

  // 4. BANNER VARIANT (Full In-Inspector Card)
  return (
    <div className="flex flex-col gap-2 my-2" ref={containerRef}>
      {matchingConflicts.map((conflict) => {
        const isResolved = resolvedIds[conflict.id];
        const isInfo = conflict.severity === 'info';

        return (
          <div
            key={conflict.id}
            className={`p-2.5 rounded-xl border text-xs transition-all ${
              isInfo
                ? 'bg-zinc-100 dark:bg-zinc-9000/5 dark:bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-600/20 text-blue-900 dark:text-blue-100'
                : 'bg-zinc-100 dark:bg-zinc-800 dark:bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white'
            }`}
          >
            {/* Warning Header */}
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                {isInfo ? (
                  <Info size={13} className="text-zinc-900 dark:text-white shrink-0 stroke-[2.5]" />
                ) : (
                  <AlertTriangle size={13} className="text-zinc-900 dark:text-white shrink-0 stroke-[2.5]" />
                )}
                <span className={isInfo ? 'text-zinc-900 dark:text-white dark:text-white' : 'text-zinc-900 dark:text-white dark:text-white'}>
                  {conflict.title}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed mb-2">
              {conflict.description}
            </p>

            {/* "Which property will be used?" Box */}
            <div className="bg-white/80 dark:bg-[#181818]/90 border border-zinc-200/80 dark:border-[#2C2C2C] rounded-lg p-2 mb-2 text-[10px] space-y-1.5">
              <div className="flex items-center justify-between font-medium">
                <span className="text-zinc-500 dark:text-[#888] uppercase tracking-wider text-[9px]">
                  Property Precedence
                </span>
                <span className="text-[9px] text-zinc-900 dark:text-white dark:text-white font-semibold flex items-center gap-1">
                  <Check size={10} /> Active in Export
                </span>
              </div>

              <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                {conflict.activePropertyUsed}
              </div>

              {conflict.ignoredPropertyNotice && (
                <div className="text-[10px] text-zinc-400 dark:text-[#777] line-through">
                  {conflict.ignoredPropertyNotice}
                </div>
              )}

              <p className="text-zinc-600 dark:text-zinc-300 text-[10px] leading-snug pt-0.5">
                {conflict.precedenceExplanation}
              </p>
            </div>

            {/* Resolution Action */}
            {conflict.resolutionAction && (
              <button
                type="button"
                disabled={isResolved}
                onClick={() => handleResolve(conflict)}
                className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-[11px] font-medium transition-all ${
                  isResolved
                    ? 'bg-emerald-500/20 text-zinc-900 dark:text-white dark:text-white border border-emerald-500/30 cursor-default'
                    : 'bg-white dark:bg-[#202020] hover:bg-zinc-100 dark:hover:bg-[#282828] border border-zinc-300/80 dark:border-[#383838] text-zinc-900 dark:text-white shadow-2xs cursor-pointer'
                }`}
              >
                {isResolved ? (
                  <>
                    <Check size={12} className="text-zinc-900 dark:text-white" />
                    <span>Redundant Styles Cleaned</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={11} className="text-zinc-900 dark:text-white" />
                    <span>{conflict.resolutionAction.label}</span>
                  </>
                )}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
