import React from 'react';
import { 
  CanvasSpatialDropResolution, 
  CanvasPaddingMetrics, 
  CanvasMarginMetrics 
} from '../utils/dndUtils';
import { CanvasNode, BreakpointKey } from '../types/builder';
import { 
  Square, 
  Columns2, 
  Grid3X3, 
  GalleryVerticalEnd,
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  CornerDownRight, 
  Plus, 
  Ruler, 
  Layers,
  Type,
  MousePointerClick,
  Lock
} from 'lucide-react';
import clsx from 'clsx';

interface TargetFrameHighlightProps {
  node: CanvasNode;
  canvasDrop: CanvasSpatialDropResolution;
  isDropInside: boolean;
}

/**
 * Visual highlight overlay for target frames/containers during drag-and-drop.
 * Includes glowing outer boundary, 4 corner brackets, frame header tag, and dimensions.
 */
export const TargetFrameHighlight: React.FC<TargetFrameHighlightProps> = ({
  node,
  canvasDrop,
  isDropInside,
}) => {
  const isRow = canvasDrop.direction === 'row';
  const containerDims = canvasDrop.containerDimensions;

  return (
    <>
      {/* Target Frame Glowing Outer Ring & Tint */}
      <div 
        className={clsx(
          "absolute inset-0 pointer-events-none z-30 transition-all duration-150",
          "outline outline-[length:calc(2.5px/var(--canvas-zoom,1))] outline-[#0099FF]",
          "shadow-[0_0_0_calc(1px/var(--canvas-zoom,1))_#0099FF,0_0_24px_rgba(0,153,255,0.3)]",
          isDropInside ? "bg-[#0099FF]/[0.08]" : "bg-[#0099FF]/[0.03]"
        )}
      />

      {/* 4 Corner Bracket Markers (Figma/Webflow aesthetic) */}
      <div 
        className="absolute top-0 left-0 pointer-events-none z-40 border-t-2 border-l-2 border-[#0099FF]"
        style={{
          width: 'calc(10px / var(--canvas-zoom, 1))',
          height: 'calc(10px / var(--canvas-zoom, 1))',
        }}
      />
      <div 
        className="absolute top-0 right-0 pointer-events-none z-40 border-t-2 border-r-2 border-[#0099FF]"
        style={{
          width: 'calc(10px / var(--canvas-zoom, 1))',
          height: 'calc(10px / var(--canvas-zoom, 1))',
        }}
      />
      <div 
        className="absolute bottom-0 left-0 pointer-events-none z-40 border-b-2 border-l-2 border-[#0099FF]"
        style={{
          width: 'calc(10px / var(--canvas-zoom, 1))',
          height: 'calc(10px / var(--canvas-zoom, 1))',
        }}
      />
      <div 
        className="absolute bottom-0 right-0 pointer-events-none z-40 border-b-2 border-r-2 border-[#0099FF]"
        style={{
          width: 'calc(10px / var(--canvas-zoom, 1))',
          height: 'calc(10px / var(--canvas-zoom, 1))',
        }}
      />

      {/* Target Frame Header Badge (pinned above top-left edge) */}
      <div 
        className="absolute left-0 pointer-events-none z-50 flex items-center shadow-xl origin-bottom-left"
        style={{
          top: 'calc(-26px / var(--canvas-zoom, 1))',
          fontSize: 'calc(10px / var(--canvas-zoom, 1))',
          borderRadius: 'calc(4px / var(--canvas-zoom, 1))',
          gap: 'calc(4px / var(--canvas-zoom, 1))',
          padding: 'calc(2px / var(--canvas-zoom, 1)) calc(8px / var(--canvas-zoom, 1))',
          backgroundColor: '#0099FF',
          color: '#FFFFFF'
        }}
      >
        <span className="font-semibold flex items-center gap-1">
          {node.type === 'Stack' ? (
            <Columns2 size={11} strokeWidth={2.5} />
          ) : node.type === 'Grid' ? (
            <Grid3X3 size={11} strokeWidth={2.5} />
          ) : node.type === 'Masonry' ? (
            <GalleryVerticalEnd size={11} strokeWidth={2.5} />
          ) : (
            <Square size={11} strokeWidth={2.5} />
          )}
          <span>Frame: {node.name}</span>
        </span>
        <span className="bg-black/30 px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider font-normal">
          {node.type === 'Stack' ? (isRow ? 'Row Stack' : 'Column Stack') : node.type}
        </span>
        {containerDims && (
          <span className="bg-black/30 px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider font-normal">
            {containerDims.width} × {containerDims.height}px
          </span>
        )}
        {isDropInside && (
          <span className="bg-white text-zinc-900 dark:text-white px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider">
            ↳ Drop Inside
          </span>
        )}
      </div>
    </>
  );
};

interface PaddingVisualOverlayProps {
  padding: CanvasPaddingMetrics;
}

/**
 * Visual padding bands overlay displaying translucent shaded areas on Top, Right, Bottom, Left
 * with high-contrast numeric pixel badges on the target frame.
 */
export const PaddingVisualOverlay: React.FC<PaddingVisualOverlayProps> = ({ padding }) => {
  const { top = 0, right = 0, bottom = 0, left = 0 } = padding;
  const hasAnyPadding = top > 0 || right > 0 || bottom > 0 || left > 0;

  if (!hasAnyPadding) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Top Padding Strip */}
      {top > 0 && (
        <div 
          className="absolute top-0 left-0 right-0 bg-emerald-500/15 border-b border-dashed border-emerald-400/60 flex items-center justify-center transition-all"
          style={{ height: `${top}px` }}
        >
          <span 
            className="px-1.5 py-0.5 rounded bg-emerald-950/90 text-emerald-300 font-mono font-bold border border-emerald-500/40 shadow-sm whitespace-nowrap"
            style={{ fontSize: 'calc(9px / var(--canvas-zoom, 1))' }}
          >
            p-top: {top}px
          </span>
        </div>
      )}

      {/* Bottom Padding Strip */}
      {bottom > 0 && (
        <div 
          className="absolute bottom-0 left-0 right-0 bg-emerald-500/15 border-t border-dashed border-emerald-400/60 flex items-center justify-center transition-all"
          style={{ height: `${bottom}px` }}
        >
          <span 
            className="px-1.5 py-0.5 rounded bg-emerald-950/90 text-emerald-300 font-mono font-bold border border-emerald-500/40 shadow-sm whitespace-nowrap"
            style={{ fontSize: 'calc(9px / var(--canvas-zoom, 1))' }}
          >
            p-bottom: {bottom}px
          </span>
        </div>
      )}

      {/* Left Padding Strip */}
      {left > 0 && (
        <div 
          className="absolute left-0 bg-emerald-500/15 border-r border-dashed border-emerald-400/60 flex items-center justify-center transition-all"
          style={{ 
            top: `${top}px`, 
            bottom: `${bottom}px`, 
            width: `${left}px` 
          }}
        >
          <span 
            className="px-1 py-0.5 rounded bg-emerald-950/90 text-emerald-300 font-mono font-bold border border-emerald-500/40 shadow-sm whitespace-nowrap -rotate-90"
            style={{ fontSize: 'calc(9px / var(--canvas-zoom, 1))' }}
          >
            p-left: {left}px
          </span>
        </div>
      )}

      {/* Right Padding Strip */}
      {right > 0 && (
        <div 
          className="absolute right-0 bg-emerald-500/15 border-l border-dashed border-emerald-400/60 flex items-center justify-center transition-all"
          style={{ 
            top: `${top}px`, 
            bottom: `${bottom}px`, 
            width: `${right}px` 
          }}
        >
          <span 
            className="px-1 py-0.5 rounded bg-emerald-950/90 text-emerald-300 font-mono font-bold border border-emerald-500/40 shadow-sm whitespace-nowrap rotate-90"
            style={{ fontSize: 'calc(9px / var(--canvas-zoom, 1))' }}
          >
            p-right: {right}px
          </span>
        </div>
      )}
    </div>
  );
};

interface InsertionLineGuideProps {
  position: 'before' | 'after';
  direction: 'row' | 'column';
  nodeName: string;
  gap?: number;
}

/**
 * Visual insertion line guide showing Above/Left or Below/Right drop positions
 * with dual terminal beads, action pill, and Gap/Spacing distance metrics.
 */
export const InsertionLineGuide: React.FC<InsertionLineGuideProps> = ({
  position,
  direction,
  nodeName,
  gap = 0,
}) => {
  const isRow = direction === 'row';
  const isBefore = position === 'before';

  if (isRow) {
    // Horizontal row layout: Insertion line placed Left (before) or Right (after)
    return (
      <div 
        className={clsx(
          "absolute top-0 bottom-0 z-50 pointer-events-none flex flex-col items-center justify-between",
          isBefore ? "-left-[2px]" : "-right-[2px]"
        )}
        style={{
          width: 'calc(3px / var(--canvas-zoom, 1))',
          backgroundColor: '#0099FF',
          boxShadow: '0 0 12px #0099FF, 0 0 20px rgba(0,153,255,0.6)',
        }}
      >
        {/* Top Terminal Bead */}
        <div 
          className="rounded-full bg-[#0099FF] border-2 border-white shadow-md shrink-0"
          style={{
            width: 'calc(9px / var(--canvas-zoom, 1))',
            height: 'calc(9px / var(--canvas-zoom, 1))',
            marginTop: 'calc(-4.5px / var(--canvas-zoom, 1))',
          }}
        />

        {/* Action Pill Badge with Gap Indicator */}
        <div 
          className="bg-[#0099FF] text-white font-bold whitespace-nowrap shadow-lg flex items-center gap-1.5 shrink-0 -rotate-90 origin-center"
          style={{
            fontSize: 'calc(9px / var(--canvas-zoom, 1))',
            padding: 'calc(2px / var(--canvas-zoom, 1)) calc(6px / var(--canvas-zoom, 1))',
            borderRadius: 'calc(4px / var(--canvas-zoom, 1))',
          }}
        >
          {isBefore ? <ArrowLeft size={10} strokeWidth={3} /> : <ArrowRight size={10} strokeWidth={3} />}
          <span>{isBefore ? 'Insert left of' : 'Insert right of'}</span>
          <span className="font-extrabold max-w-[120px] truncate">{nodeName}</span>
          {gap > 0 && (
            <span className="bg-black/30 text-cyan-200 px-1 py-0.2 rounded font-mono text-[8px]">
              Gap {gap}px
            </span>
          )}
        </div>

        {/* Bottom Terminal Bead */}
        <div 
          className="rounded-full bg-[#0099FF] border-2 border-white shadow-md shrink-0"
          style={{
            width: 'calc(9px / var(--canvas-zoom, 1))',
            height: 'calc(9px / var(--canvas-zoom, 1))',
            marginBottom: 'calc(-4.5px / var(--canvas-zoom, 1))',
          }}
        />
      </div>
    );
  }

  // Vertical column layout: Insertion line placed Top (Above) or Bottom (Below)
  return (
    <div 
      className={clsx(
        "absolute left-0 right-0 z-50 pointer-events-none flex items-center justify-between",
        isBefore ? "-top-[2px]" : "-bottom-[2px]"
      )}
      style={{
        height: 'calc(3px / var(--canvas-zoom, 1))',
        backgroundColor: '#0099FF',
        boxShadow: '0 0 12px #0099FF, 0 0 20px rgba(0,153,255,0.6)',
      }}
    >
      {/* Left Terminal Bead */}
      <div 
        className="rounded-full bg-[#0099FF] border-2 border-white shadow-md shrink-0"
        style={{
          width: 'calc(9px / var(--canvas-zoom, 1))',
          height: 'calc(9px / var(--canvas-zoom, 1))',
          marginLeft: 'calc(-4.5px / var(--canvas-zoom, 1))',
        }}
      />

      {/* Centered Action Pill Badge */}
      <div 
        className="bg-[#0099FF] text-white font-bold whitespace-nowrap shadow-lg flex items-center gap-1.5 shrink-0"
        style={{
          fontSize: 'calc(9px / var(--canvas-zoom, 1))',
          padding: 'calc(2px / var(--canvas-zoom, 1)) calc(8px / var(--canvas-zoom, 1))',
          borderRadius: 'calc(4px / var(--canvas-zoom, 1))',
        }}
      >
        {isBefore ? <ArrowUp size={10} strokeWidth={3} /> : <ArrowDown size={10} strokeWidth={3} />}
        <span>{isBefore ? 'Insert above' : 'Insert below'}</span>
        <span className="font-extrabold max-w-[140px] truncate">{nodeName}</span>
        {gap > 0 && (
          <span className="bg-black/30 text-cyan-200 px-1.5 py-0.5 rounded font-mono text-[8px] flex items-center gap-0.5">
            <Ruler size={8} />
            <span>Gap {gap}px</span>
          </span>
        )}
      </div>

      {/* Right Terminal Bead */}
      <div 
        className="rounded-full bg-[#0099FF] border-2 border-white shadow-md shrink-0"
        style={{
          width: 'calc(9px / var(--canvas-zoom, 1))',
          height: 'calc(9px / var(--canvas-zoom, 1))',
          marginRight: 'calc(-4.5px / var(--canvas-zoom, 1))',
        }}
      />
    </div>
  );
};

interface InsideDropSlotGuideProps {
  containerName: string;
  isEmpty: boolean;
  targetIndex: number;
  gap?: number;
}

/**
 * Visual guide for dropping INSIDE a target frame.
 * Renders either a prominent empty-frame drop zone or an inside insertion slot indicator.
 */
export const InsideDropSlotGuide: React.FC<InsideDropSlotGuideProps> = ({
  containerName,
  isEmpty,
  targetIndex,
  gap = 0,
}) => {
  if (isEmpty) {
    return (
      <div 
        className="w-full min-h-[70px] flex flex-col items-center justify-center border-2 border-dashed border-[#0099FF] bg-[#0099FF]/10 rounded-xl p-4 text-zinc-900 dark:text-white pointer-events-none animate-pulse"
        style={{
          fontSize: 'calc(11px / var(--canvas-zoom, 1))',
          gap: 'calc(4px / var(--canvas-zoom, 1))',
        }}
      >
        <div className="w-7 h-7 rounded-full bg-[#0099FF] text-white flex items-center justify-center shadow-md">
          <Plus size={16} strokeWidth={3} />
        </div>
        <span className="font-bold">↳ Drop inside empty {containerName}</span>
        <span className="text-[9px] text-zinc-900 dark:text-white/80 font-mono">Position #1 (First Child)</span>
      </div>
    );
  }

  return (
    <div 
      className="w-full my-1.5 py-2 px-3 border-2 border-dashed border-[#0099FF] bg-[#0099FF]/15 rounded-lg flex items-center justify-between text-zinc-900 dark:text-white font-semibold pointer-events-none shadow-sm"
      style={{
        fontSize: 'calc(10px / var(--canvas-zoom, 1))',
      }}
    >
      <div className="flex items-center gap-1.5">
        <CornerDownRight size={13} strokeWidth={2.5} />
        <span>Drop inside <strong className="font-bold">{containerName}</strong></span>
      </div>
      <div className="flex items-center gap-2">
        {gap > 0 && (
          <span className="bg-[#0099FF]/20 px-1.5 py-0.5 rounded font-mono text-[9px]">
            Gap {gap}px
          </span>
        )}
        <span className="bg-[#0099FF] text-white px-2 py-0.5 rounded text-[9px] font-bold">
          Slot #{targetIndex + 1}
        </span>
      </div>
    </div>
  );
};

interface SpacingMetricsHUDProps {
  canvasDrop: CanvasSpatialDropResolution;
  nodes: Record<string, CanvasNode>;
}

/**
 * Floating Spacing Metrics HUD displayed in the canvas area during drag-and-drop actions.
 * Summarizes the target container, action mode, padding values, gap, and dimensions.
 */
export const SpacingMetricsHUD: React.FC<SpacingMetricsHUDProps> = ({
  canvasDrop,
  nodes,
}) => {
  const container = nodes[canvasDrop.containerId];
  const target = nodes[canvasDrop.targetId];
  if (!container) return null;

  const { top = 0, right = 0, bottom = 0, left = 0 } = canvasDrop.paddingMetrics || {};
  const gap = canvasDrop.gap ?? 0;
  const isRow = canvasDrop.direction === 'row';

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none flex items-center gap-3 px-4 py-2.5 bg-[#141416]/95 border border-zinc-700/80 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.6)] backdrop-blur-xl text-white select-none transition-all">
      {/* Target Container Badge */}
      <div className="flex items-center gap-2 pr-3 border-r border-zinc-700/60">
        <div className="w-6 h-6 rounded-lg bg-[#0099FF]/20 border border-[#0099FF]/50 text-zinc-900 dark:text-white flex items-center justify-center">
          {container.type === 'Stack' ? (
            <Columns2 size={13} strokeWidth={2.5} />
          ) : container.type === 'Grid' ? (
            <Grid3X3 size={13} strokeWidth={2.5} />
          ) : container.type === 'Masonry' ? (
            <GalleryVerticalEnd size={13} strokeWidth={2.5} />
          ) : (
            <Square size={13} strokeWidth={2.5} />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">Target Frame</span>
          <span className="text-xs font-bold text-white max-w-[130px] truncate">{container.name}</span>
        </div>
      </div>

      {/* Action Indicator */}
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#0099FF]/15 border border-[#0099FF]/40 text-zinc-900 dark:text-white text-xs font-semibold">
        {canvasDrop.position === 'inside' ? (
          <>
            <CornerDownRight size={13} strokeWidth={2.5} />
            <span>Drop Inside</span>
          </>
        ) : canvasDrop.position === 'before' ? (
          <>
            {isRow ? <ArrowLeft size={13} strokeWidth={2.5} /> : <ArrowUp size={13} strokeWidth={2.5} />}
            <span>{isRow ? 'Insert Left' : 'Insert Above'}</span>
          </>
        ) : (
          <>
            {isRow ? <ArrowRight size={13} strokeWidth={2.5} /> : <ArrowDown size={13} strokeWidth={2.5} />}
            <span>{isRow ? 'Insert Right' : 'Insert Below'}</span>
          </>
        )}
        {target && canvasDrop.position !== 'inside' && (
          <span className="text-white max-w-[90px] truncate">({target.name})</span>
        )}
      </div>

      {/* Padding Metrics */}
      <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-300">
        <span className="text-[10px] uppercase font-mono text-zinc-900 dark:text-white/80 font-bold mr-1">Padding</span>
        <span className="font-mono text-[11px] font-medium tracking-tight">
          T:{top} R:{right} B:{bottom} L:{left}
        </span>
      </div>

      {/* Gap Metric */}
      {gap > 0 && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-pink-950/40 border border-pink-500/30 rounded-lg text-pink-300">
          <span className="text-[10px] uppercase font-mono text-pink-400/80 font-bold">Gap</span>
          <span className="font-mono text-[11px] font-bold">{gap}px</span>
        </div>
      )}

      {/* Layout Direction */}
      <div className="text-[10px] font-mono text-zinc-400 pl-1">
        {container.type === 'Stack' ? (isRow ? 'Row' : 'Column') : container.type}
      </div>
    </div>
  );
};

export interface HoverLayoutMetrics {
  type: string;
  name: string;
  isStack: boolean;
  stackDirection?: 'row' | 'column';
  isGrid: boolean;
  gridColumns?: number | string;
  gap?: number;
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
    formatted: string;
  } | null;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
    formatted: string;
  } | null;
  hasSpacingInfo: boolean;
}

/**
 * Extracts and formats layout and spacing metrics for canvas hover inspection.
 */
export function getHoverLayoutInfo(node: CanvasNode, effectiveStyles: any): HoverLayoutMetrics {
  const isStack = node.type === 'Stack';
  const isGrid = node.type === 'Grid';
  const stackDirection = (effectiveStyles.layoutDirection || 'column') as 'row' | 'column';
  const gap = typeof effectiveStyles.gap === 'number' && effectiveStyles.gap > 0 ? effectiveStyles.gap : undefined;
  
  let paddingInfo: HoverLayoutMetrics['padding'] = null;
  const pad = effectiveStyles.padding;
  if (pad) {
    if (typeof pad === 'number' && pad > 0) {
      paddingInfo = {
        top: pad,
        right: pad,
        bottom: pad,
        left: pad,
        formatted: `${pad}px`,
      };
    } else if (typeof pad === 'object') {
      const top = Number(pad.top) || 0;
      const right = Number(pad.right) || 0;
      const bottom = Number(pad.bottom) || 0;
      const left = Number(pad.left) || 0;
      if (top > 0 || right > 0 || bottom > 0 || left > 0) {
        let formatted = '';
        if (top === right && right === bottom && bottom === left) {
          formatted = `${top}px`;
        } else if (top === bottom && left === right) {
          formatted = `x:${left} y:${top}px`;
        } else {
          formatted = `${top} ${right} ${bottom} ${left}px`;
        }
        paddingInfo = { top, right, bottom, left, formatted };
      }
    }
  }

  let marginInfo: HoverLayoutMetrics['margin'] = null;
  const mar = effectiveStyles.margin;
  if (mar) {
    if (typeof mar === 'number' && mar > 0) {
      marginInfo = {
        top: mar,
        right: mar,
        bottom: mar,
        left: mar,
        formatted: `${mar}px`,
      };
    } else if (typeof mar === 'object') {
      const top = Number(mar.top) || 0;
      const right = Number(mar.right) || 0;
      const bottom = Number(mar.bottom) || 0;
      const left = Number(mar.left) || 0;
      if (top > 0 || right > 0 || bottom > 0 || left > 0) {
        let formatted = '';
        if (top === right && right === bottom && bottom === left) {
          formatted = `${top}px`;
        } else if (top === bottom && left === right) {
          formatted = `x:${left} y:${top}px`;
        } else {
          formatted = `${top} ${right} ${bottom} ${left}px`;
        }
        marginInfo = { top, right, bottom, left, formatted };
      }
    }
  }

  const hasSpacingInfo = Boolean(gap !== undefined || paddingInfo !== null || marginInfo !== null || isStack || isGrid);

  return {
    type: node.type,
    name: node.name,
    isStack,
    stackDirection,
    isGrid,
    gridColumns: effectiveStyles.gridColumns,
    gap,
    padding: paddingInfo,
    margin: marginInfo,
    hasSpacingInfo,
  };
}

interface HoverInspectorBadgeProps {
  node: CanvasNode;
  effectiveStyles: any;
  isSelected?: boolean;
  isLocked?: boolean;
}

/**
 * Lightweight, high-performance hover badge displaying layout (Stack, Grid, Frame),
 * and spacing metrics (gap, padding, margin) when present.
 */
export const HoverInspectorBadge: React.FC<HoverInspectorBadgeProps> = ({
  node,
  effectiveStyles,
  isSelected = false,
  isLocked = false,
}) => {
  const info = getHoverLayoutInfo(node, effectiveStyles);
  
  const hasMetrics = info.isStack || info.isGrid || info.gap !== undefined || info.padding || info.margin || (node.type === 'Text' || node.type === 'Button');

  // We removed the blue label entirely.
  // The dark badge is now the primary active indicator.

  return (
    <div 
      className={clsx(
        "absolute pointer-events-none z-40 flex items-center shadow-lg origin-bottom-left transition-opacity duration-150 whitespace-nowrap",
        "left-0"
      )}
      style={{
        top: 'calc(-22px / var(--canvas-zoom, 1))',
        fontSize: 'calc(9.5px / var(--canvas-zoom, 1))',
        borderRadius: 'calc(4px / var(--canvas-zoom, 1))',
        gap: 'calc(4px / var(--canvas-zoom, 1))',
        padding: 'calc(2px / var(--canvas-zoom, 1)) calc(6px / var(--canvas-zoom, 1))',
        backgroundColor: '#18181B',
        border: '1px solid rgba(255,255,255,0.18)',
        color: '#FFFFFF',
      }}
    >
      {/* Node Type & Icon */}
      {!isSelected && (
        <span className="font-semibold flex items-center gap-1 text-zinc-200">
          {info.isStack ? (
            <Columns2 size={10} strokeWidth={2.5} className="text-zinc-900 dark:text-white" />
          ) : info.isGrid ? (
            <Grid3X3 size={10} strokeWidth={2.5} className="text-zinc-900 dark:text-white" />
          ) : info.type === 'Masonry' ? (
            <GalleryVerticalEnd size={10} strokeWidth={2.5} className="text-zinc-900 dark:text-white" />
          ) : info.type === 'Text' ? (
            <Type size={10} strokeWidth={2.5} className="text-zinc-900 dark:text-white" />
          ) : info.type === 'Button' ? (
            <MousePointerClick size={10} strokeWidth={2.5} className="text-zinc-900 dark:text-white" />
          ) : (
            <Square size={10} strokeWidth={2.5} className="text-zinc-400" />
          )}
          <span className="truncate max-w-[85px]">{node.name}</span>
        </span>
      )}

      {/* Stack Direction */}
      {info.isStack && (
        <span className="bg-zinc-200 dark:bg-zinc-800 text-blue-300 px-1 py-0.2 rounded font-mono text-[8.5px] border border-zinc-300 dark:border-zinc-600/30">
          {info.stackDirection === 'row' ? 'Row' : 'Column'}
        </span>
      )}

      {/* Grid Columns */}
      {info.isGrid && info.gridColumns && (
        <span className="bg-indigo-500/20 text-indigo-300 px-1 py-0.2 rounded font-mono text-[8.5px] border border-indigo-500/30">
          {info.gridColumns} cols
        </span>
      )}

      {/* Gap */}
      {info.gap !== undefined && (
        <span className="bg-pink-500/20 text-pink-300 px-1 py-0.2 rounded font-mono text-[8.5px] border border-pink-500/30 flex items-center gap-0.5">
          <Ruler size={8} />
          <span>gap:{info.gap}px</span>
        </span>
      )}

      {/* Padding */}
      {info.padding && (
        <span className="bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded font-mono text-[8.5px] border border-emerald-500/30">
          pad:{info.padding.formatted}
        </span>
      )}

      {/* Margin */}
      {info.margin && (
        <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white px-1 py-0.2 rounded font-mono text-[8.5px] border border-zinc-200 dark:border-zinc-700">
          mar:{info.margin.formatted}
        </span>
      )}

      {/* Double click hint for Text and Button */}
      {(node.type === 'Text' || node.type === 'Button') && (
        <span className="text-[8px] text-zinc-400 border-l border-zinc-700 pl-1 ml-0.5 italic font-normal">
          2× edit
        </span>
      )}
    </div>
  );
};

interface HoverPaddingGuideProps {
  padding: HoverLayoutMetrics['padding'];
}

/**
 * Subtle dashed padding outline for hovered container nodes.
 */
export const HoverPaddingGuide: React.FC<HoverPaddingGuideProps> = ({ padding }) => {
  if (!padding) return null;
  const { top = 0, right = 0, bottom = 0, left = 0 } = padding;
  if (!top && !right && !bottom && !left) return null;

  return (
    <div 
      className="absolute pointer-events-none z-20 border border-dashed border-emerald-500/30 bg-emerald-500/[0.03]"
      style={{
        top: `${top}px`,
        right: `${right}px`,
        bottom: `${bottom}px`,
        left: `${left}px`,
      }}
    />
  );
};

