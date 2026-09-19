import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useBuilderStore } from '../store/builderStore';
import { BreakpointViewport } from './BreakpointViewport';
import BottomToolbox from './BottomToolbox';
import CanvasComments from './CanvasComments';
import Rulers from './Rulers';
import CanvasContextMenu from './CanvasContextMenu';
import { CanvasQuickActions } from './Canvas/CanvasQuickActions';
import { BreakpointKey, CanvasNode } from '../types/builder';
import clsx from 'clsx';

const BREAKPOINT_CONFIGS: { id: BreakpointKey; label: string; rangeLabel: string; defaultWidth: number }[] = [
  { id: 'lg', label: 'Desktop', rangeLabel: '1200', defaultWidth: 1200 },
  { id: 'md', label: 'Tablet', rangeLabel: '1199 — 810', defaultWidth: 810 },
  { id: 'base', label: 'Phone', rangeLabel: '809 — 0', defaultWidth: 390 },
];

const DEFAULT_ENABLED_BREAKPOINTS: BreakpointKey[] = ['lg', 'md', 'base'];
const DEFAULT_PAN_OFFSET = { x: 0, y: 0 };

export default function CanvasArea() {
  const enabledBreakpoints = useBuilderStore((state) => state?.enabledBreakpoints) || DEFAULT_ENABLED_BREAKPOINTS;
  const isPreviewMode = useBuilderStore((state) => state?.isPreviewMode ?? false);
  const isAiGenerating = useBuilderStore((state) => state?.isAiGenerating ?? false);
  
  // Marquee Selection State
  const [selectionBox, setSelectionBox] = useState<{ startX: number, startY: number, currentX: number, currentY: number } | null>(null);
  const selectNodes = useBuilderStore((state) => state?.selectNodes);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, nodeId: string | null } | null>(null);
  const selectNode = useBuilderStore((state) => state?.selectNode);
  const canvasTheme = useBuilderStore((state) => state?.canvasTheme ?? 'dark');
  const canvasTool = useBuilderStore((state) => state?.canvasTool);
  const zoom = useBuilderStore((state) => state?.zoom) || 1;
  const setZoom = useBuilderStore((state) => state?.setZoom);
  const panOffset = useBuilderStore((state) => state?.panOffset) || DEFAULT_PAN_OFFSET;
  const setPanOffset = useBuilderStore((state) => state?.setPanOffset);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [spacePressed, setSpacePressed] = useState(false);
  const panStartRef = useRef<{ x: number; y: number; startPanX: number; startPanY: number }>({ x: 0, y: 0, startPanX: 0, startPanY: 0 });

  // Native non-passive wheel event listener to strictly block browser-native page zoom and back/forward gestures
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleNativeWheel = (e: WheelEvent) => {
      // Always prevent default to stop browser-level swipe navigation (History Back/Forward) and page-level zoom
      e.preventDefault();
      e.stopPropagation();

      const state = useBuilderStore.getState();
      const currentZoom = state.zoom;
      const currentPan = state.panOffset;

      if (e.ctrlKey || e.metaKey) {
        // Pinch-to-zoom / Ctrl+Wheel: Zoom focused at mouse cursor
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left - rect.width / 2;
        const mouseY = e.clientY - rect.top - rect.height / 2;

        const zoomDelta = -e.deltaY * 0.0035;
        const factor = Math.exp(zoomDelta);
        const nextZoom = Math.min(Math.max(+(currentZoom * factor).toFixed(3), 0.05), 3.0);

        if (nextZoom !== currentZoom) {
          const scaleRatio = nextZoom / currentZoom;
          const nextPanX = mouseX - (mouseX - currentPan.x) * scaleRatio;
          const nextPanY = mouseY - (mouseY - currentPan.y) * scaleRatio;

          state.setZoom(nextZoom);
          state.setPanOffset({ x: Math.round(nextPanX), y: Math.round(nextPanY) });
        }
      } else {
        // Standard 2-finger panning or trackpad drag without triggering back/forward
        state.setPanOffset({
          x: currentPan.x - e.deltaX,
          y: currentPan.y - e.deltaY,
        });
      }
    };

    container.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleNativeWheel);
    };
  }, []);

  // Track spacebar for quick hand tool pan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !spacePressed) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
        setSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [spacePressed]);

  // Mouse pan handlers
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isPreviewMode) return;
    
    // Find closest node if clicked on one
    const nodeEl = (e.target as Element).closest('[id^="canvas-node-"]');
    let targetNodeId = null;
    
    const rootNodeId = useBuilderStore.getState().rootNodeId;
    
    if (nodeEl) {
      targetNodeId = nodeEl.id.replace('canvas-node-', '');
      if (targetNodeId === rootNodeId) targetNodeId = null;
    }
    
    if (targetNodeId) {
      // If node is not currently selected, select it
      const { selectedNodeIds, selectedNodeId } = useBuilderStore.getState();
      const isSelected = selectedNodeIds?.includes(targetNodeId) || selectedNodeId === targetNodeId;
      if (!isSelected) {
        useBuilderStore.getState().selectNode(targetNodeId);
      }
    } else {
      useBuilderStore.getState().selectNode(null);
    }
    
    setContextMenu({ x: e.clientX, y: e.clientY, nodeId: targetNodeId });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) return; // ignore right click for regular down
    if (canvasTool === 'hand' || spacePressed || e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        startPanX: panOffset.x,
        startPanY: panOffset.y,
      };
    } else if (!isPreviewMode) {
      const target = e.target as HTMLElement;
      const isInsideNode = Boolean(target.closest('[id^="canvas-node-"], [data-viewport-header], [data-comment-pin], [data-ruler], button, input, textarea, a, select'));
      
      if (!isInsideNode) {
        selectNode(null);
        setSelectionBox({
          startX: e.clientX,
          startY: e.clientY,
          currentX: e.clientX,
          currentY: e.clientY
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      setPanOffset({
        x: panStartRef.current.startPanX + dx,
        y: panStartRef.current.startPanY + dy,
      });
    } else if (selectionBox) {
      setSelectionBox(prev => prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null);
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
    }
    if (selectionBox) {
      // Calculate selected nodes based on DOM intersection
      const boxRect = {
        left: Math.min(selectionBox.startX, selectionBox.currentX),
        top: Math.min(selectionBox.startY, selectionBox.currentY),
        right: Math.max(selectionBox.startX, selectionBox.currentX),
        bottom: Math.max(selectionBox.startY, selectionBox.currentY),
      };
      
      const nodes = Array.from(document.querySelectorAll('[id^="canvas-node-"]'));
      const selectedIds = [];
      const rootNodeId = useBuilderStore.getState().rootNodeId;
      nodes.forEach(node => {
        const id = node.id.replace('canvas-node-', '');
        if (id === rootNodeId) return;
        const rect = node.getBoundingClientRect();
        if (!(rect.right < boxRect.left || 
              rect.left > boxRect.right || 
              rect.bottom < boxRect.top || 
              rect.top > boxRect.bottom)) {
          selectedIds.push(node.id.replace('canvas-node-', ''));
        }
      });
      
      if (selectedIds.length > 0) {
        selectNodes(selectedIds);
      }
      setSelectionBox(null);
    }
  };

  const isDark = canvasTheme === 'dark';
  const showHandCursor = canvasTool === 'hand' || spacePressed;

  // Filter breakpoints that are enabled (Desktop is always first)
  const visibleBreakpoints = BREAKPOINT_CONFIGS.filter(cfg => enabledBreakpoints.includes(cfg.id));

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={handleContextMenu}
      style={{
        touchAction: 'none',
        overscrollBehavior: 'none',
      }}
      className={clsx(
        "flex-1 relative overflow-hidden flex flex-col select-none transition-all duration-300",
        isAiGenerating && "ring-4 ring-inset ring-purple-500/50 shadow-[inset_0_0_50px_rgba(168,85,247,0.2)]",
        isDark ? "bg-[#0B0B0E]" : "bg-[#F3F4F6]",
        showHandCursor ? (isPanning ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
      )}
    >
      {isAiGenerating && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-4 py-2 bg-[#1A1A1A]/90 border border-purple-500/30 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.3)] backdrop-blur-md animate-pulse pointer-events-none">
          <div className="w-4 h-4 border-2 border-purple-400 border-t-purple-200 rounded-full animate-spin" />
          <span className="text-sm font-medium text-purple-100">AI is updating design...</span>
        </div>
      )}

      {/* Marquee Selection Box */}
      {selectionBox && (
        <div 
          className="fixed z-[100] border border-[#0099FF] bg-[#0099FF]/20 pointer-events-none"
          style={{
            left: Math.min(selectionBox.startX, selectionBox.currentX),
            top: Math.min(selectionBox.startY, selectionBox.currentY),
            width: Math.abs(selectionBox.currentX - selectionBox.startX),
            height: Math.abs(selectionBox.currentY - selectionBox.startY)
          }}
        />
      )}

      {/* Rulers & Guides */}
      {!isPreviewMode && <Rulers containerRef={containerRef} />}

      {/* Background Dot Grid / Canvas Texture */}
      <div 
        className={clsx(
          "absolute inset-0 pointer-events-none transition-opacity duration-300",
          isAiGenerating ? "opacity-20" : "opacity-40",
          isDark ? "bg-[radial-gradient(#27272A_1px,transparent_1px)]" : "bg-[radial-gradient(#D1D5DB_1px,transparent_1px)]"
        )}
        style={{ backgroundSize: `${24 * zoom}px ${24 * zoom}px` }}
      />

      {/* Scalable & Pannable Canvas World Container */}
      <div 
        className="w-full h-full flex items-center justify-center origin-center transition-transform duration-75 ease-out"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
          transformOrigin: '50% 50%',
          '--canvas-zoom': zoom
        } as React.CSSProperties}
      >
        {/* Row of Breakpoints (Desktop, Tablet, Phone) */}
        <div className="flex items-start gap-16 px-16 py-20 relative">
          {visibleBreakpoints.map((bp) => (
            <BreakpointViewport
              key={bp.id}
              breakpoint={bp.id}
              label={bp.label}
              rangeLabel={bp.rangeLabel}
              defaultWidth={bp.defaultWidth}
            />
          ))}

          {/* Comments Pins Layer inside Canvas Scale */}
          <CanvasComments />
        </div>
      </div>

      {/* Floating Bottom Toolbox (Select, Hand, Comment, Theme, Zoom) */}
      <BottomToolbox />

      {/* Canvas Context Menu */}
      {contextMenu && (
        <CanvasContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          nodeId={contextMenu.nodeId}
          onClose={() => setContextMenu(null)}
        />
      )}

      <CanvasQuickActions />
    </div>
  );
}
