import React, { useState, useRef, useEffect, memo, createContext, useContext } from 'react';
import { 
  DndContext, 
  pointerWithin, 
  closestCenter, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent, 
  DragStartEvent, 
  DragMoveEvent,
  DragOverlay,
  useDraggable, 
  useDroppable 
} from '@dnd-kit/core';
import * as LucideIcons from 'lucide-react';
import { 
  Play, 
  Plus, 
  Trash2, 
  Sparkles, 
  Sliders, 
  Monitor, 
  Tablet, 
  Smartphone,
  ChevronDown,
  Check,
  X,
  Image as ImageIcon,
  Lock
} from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import { BreakpointKey, CanvasNode } from '../types/builder';
import { getComponentsByCategory, componentRegistry } from '../registry/ComponentRegistry';
import { getNodeEffectiveStyle, getStyleFromProps } from '../utils/styleUtils';
import { 
  isContainerType, 
  isAtomType, 
  isDescendant, 
  canAcceptChild,
  resolveCanvasSpatialDrop,
  CanvasSpatialDropResolution
} from '../utils/dndUtils';
import { renderNodeIconByType } from './LeftSidebar';
import { motion } from 'motion/react';
import { GradientControllerOverlay } from './GradientControllerOverlay';
import { 
  TargetFrameHighlight, 
  PaddingVisualOverlay, 
  InsertionLineGuide, 
  InsideDropSlotGuide,
  SpacingMetricsHUD,
  HoverInspectorBadge,
  HoverPaddingGuide,
  getHoverLayoutInfo
} from './DragDropVisualGuides';
import clsx from 'clsx';

// Stable fallback constants outside components to guarantee referential equality
const EMPTY_OBJECT: Record<string, any> = {};
const EMPTY_ARRAY: any[] = [];
const DEFAULT_ENABLED_BREAKPOINTS: BreakpointKey[] = ['lg', 'md', 'base'];
const DEFAULT_BREAKPOINT_WIDTHS: Record<BreakpointKey, number> = { lg: 1200, md: 810, base: 390 };

// Canvas DND Context for sharing active dragged ID and real-time spatial indicators
export interface CanvasDropContextType {
  activeDragId: string | null;
  canvasDrop: CanvasSpatialDropResolution | null;
}

const CanvasDndStateContext = createContext<CanvasDropContextType>({ 
  activeDragId: null, 
  canvasDrop: null 
});

// Recursive Node Renderer for a specific breakpoint view with DnD capabilities
export const BreakpointNodeElement = memo(({ id, breakpoint }: { id: string; breakpoint: BreakpointKey }) => {
  const node = useBuilderStore((state) => state?.nodes?.[id]);
  const isRoot = useBuilderStore((state) => state?.rootNodeId === id);
  // Atomic Selection Checks:
  const isSelectedRaw = useBuilderStore((state) => state?.selectedNodeIds?.includes(id) || state?.selectedNodeId === id);
  const isHighlighted = useBuilderStore((state) => state?.highlightedNodeIds?.includes(id));
  
  // Minimal globals needed
  const activeBreakpoint = useBuilderStore((state) => state?.activeBreakpoint ?? 'lg');
  const isPreviewMode = useBuilderStore((state) => state?.isPreviewMode ?? false);
  const selectNode = useBuilderStore((state) => state?.selectNode);
  
  const { activeDragId, canvasDrop } = useContext(CanvasDndStateContext);

  const isAtomic = isAtomType(node?.type);
  const isContainer = isContainerType(node?.type) || isRoot;

  const isSelected = !isPreviewMode && isSelectedRaw && activeBreakpoint === breakpoint;

  // Lightweight local hover & double-click inline text editing states (zero global re-renders)
  const [isHovered, setIsHovered] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const textInputRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isEditingText && textInputRef.current) {
      textInputRef.current.focus();
      try {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(textInputRef.current);
        selection?.removeAllRanges();
        selection?.addRange(range);
      } catch (err) {}
    }
  }, [isEditingText]);

  const isLocked = Boolean(node?.props?.locked);
  const isHidden = Boolean(node?.props?.hidden || node?.responsiveStyles?.base?.opacity === 0 || node?.responsiveStyles?.base?.visible === false);

  // DnD Draggable hook (root node cannot be dragged, and dragging is paused while editing text inline or locked)
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging
  } = useDraggable({
    id,
    disabled: isPreviewMode || isRoot || isEditingText || isLocked || !node,
    data: {
      id,
      type: node?.type,
      isContainer
    }
  });

  // DnD Droppable hook (all nodes can receive drops, but containers reparent while atoms insert adjacent)
  const {
    setNodeRef: setDroppableRef,
    isOver
  } = useDroppable({
    id,
    disabled: isPreviewMode || !node,
    data: {
      id,
      type: node?.type,
      isContainer
    }
  });

  if (!node) return null;

  const effectiveStyles = getNodeEffectiveStyle(node, breakpoint);
  const reactStyles = getStyleFromProps(effectiveStyles);

  const setNodeRefs = (el: HTMLDivElement | null) => {
    setDraggableRef(el);
    setDroppableRef(el);
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPreviewMode) {
      useBuilderStore.getState().setBreakpoint(breakpoint);
      selectNode(id, e.shiftKey || e.metaKey);
    }
  };

  // Drop validation rules:
  const isSelf = activeDragId === id;
  const isInvalid = Boolean(
    activeDragId &&
    !isSelf &&
    isDescendant(useBuilderStore.getState().nodes, id, activeDragId)
  );

  const canDropHereAsChild = Boolean(
    activeDragId &&
    !isSelf &&
    !isInvalid &&
    canAcceptChild(useBuilderStore.getState().nodes, id, activeDragId, useBuilderStore.getState().rootNodeId)
  );

  // Figma/Framer Spatial Drop Calculation Flags
  const isTargeted = canvasDrop?.targetId === id;
  const isDropBefore = isTargeted && canvasDrop?.position === 'before';
  const isDropAfter = isTargeted && canvasDrop?.position === 'after';
  const isDropInside = (isTargeted || canvasDrop?.containerId === id) && canvasDrop?.position === 'inside';
  const isTargetContainer = Boolean(activeDragId && canvasDrop && canvasDrop.containerId === id);
  const isContainerDropActive = (isDropInside && canDropHereAsChild) || (isOver && canDropHereAsChild && !isDropBefore && !isDropAfter);

  const reviveProps = (p: any): any => {
    if (Array.isArray(p)) return p.map(reviveProps);
    if (p && typeof p === 'object') {
      if (p._type === 'LucideIcon') {
        const IconComp = (LucideIcons as any)[p.name];
        return IconComp ? <IconComp size={p.size || 24} /> : null;
      }
      const revived: any = {};
      for (const key in p) revived[key] = reviveProps(p[key]);
      return revived;
    }
    return p;
  };

  const renderContent = () => {
    // 1. Registry Components Rendering (e.g. Native_Navbar)
    const CompDef = componentRegistry[node.type];
    if (CompDef) {
      return CompDef.render(
        reviveProps(node.props || CompDef.defaultProps),
        node.childrenIds && node.childrenIds.length > 0
          ? node.childrenIds.map((childId) => (
              <BreakpointNodeElement key={childId} id={childId} breakpoint={breakpoint} />
            ))
          : undefined
      );
    }

    // 2. Built-in Canvas Nodes Rendering
    switch (node.type) {
      case 'Frame':
      case 'Stack':
      case 'Grid':
        return (
          <>
            {Array.from(new Set(node.childrenIds)).map((childId) => (
              <BreakpointNodeElement key={childId} id={childId} breakpoint={breakpoint} />
            ))}
            {node.childrenIds.length === 0 && (
              isDropInside && isTargetContainer && canvasDrop ? (
                <InsideDropSlotGuide 
                  containerName={node.name} 
                  isEmpty={true} 
                  targetIndex={0} 
                  gap={canvasDrop.gap} 
                />
              ) : !node.props?.className ? (
                <div className="flex-1 min-h-[50px] flex items-center justify-center text-zinc-500 text-xs italic pointer-events-none border border-dashed border-zinc-700/50 rounded-lg m-2">
                  Empty {node.type}
                </div>
              ) : null
            )}
            {node.childrenIds.length > 0 && isDropInside && isTargetContainer && canvasDrop && (
              <InsideDropSlotGuide 
                containerName={node.name} 
                isEmpty={false} 
                targetIndex={canvasDrop.targetIndex} 
                gap={canvasDrop.gap} 
              />
            )}
          </>
        );
      case 'Masonry':
        return (
          <>
            {Array.from(new Set(node.childrenIds)).map((childId) => (
              <div key={childId} style={{ breakInside: 'avoid', marginBottom: `${effectiveStyles.gap || 16}px` }}>
                <BreakpointNodeElement id={childId} breakpoint={breakpoint} />
              </div>
            ))}
            {node.childrenIds.length === 0 && (
              <div className="w-full min-h-[50px] flex items-center justify-center text-zinc-500 text-xs italic pointer-events-none border border-dashed border-zinc-700/50 rounded-lg p-4">
                Empty Masonry Container
              </div>
            )}
          </>
        );
      case 'Text':
        return (
          <span 
            ref={textInputRef}
            contentEditable={isEditingText}
            suppressContentEditableWarning
            onDoubleClick={(e) => {
              if (!isPreviewMode) {
                e.stopPropagation();
                setIsEditingText(true);
              }
            }}
            onPointerDown={(e) => {
              if (isEditingText) {
                e.stopPropagation(); // Only block drag when actively typing/editing text
              }
            }}
            onKeyDown={(e) => {
              if (isEditingText) {
                e.stopPropagation(); // Prevent canvas shortcuts like delete node while typing
                if (e.key === 'Escape') {
                  e.preventDefault();
                  setIsEditingText(false);
                } else if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  const newText = e.currentTarget.textContent || '';
                  if (newText !== node.props.text) {
                    useBuilderStore.getState().updateNodeProps(id, { text: newText });
                  }
                  setIsEditingText(false);
                }
              }
            }}
            onBlur={(e) => {
              if (isEditingText) {
                const newText = e.currentTarget.textContent || '';
                if (newText !== node.props.text) {
                  useBuilderStore.getState().updateNodeProps(id, { text: newText });
                }
                setIsEditingText(false);
              }
            }}
            className={clsx(
              "block outline-none transition-all",
              isEditingText 
                ? "cursor-text selection:bg-[#0099FF] selection:text-white ring-2 ring-[#0099FF] bg-zinc-100 dark:bg-zinc-9000/15 rounded px-1 -mx-1 select-text" 
                : "cursor-pointer select-none"
            )}
            title={isEditingText ? "Press Enter to save, Esc to cancel" : "Double-click to edit text, drag to reposition"}
          >
            {node.props.text || 'Custom Text'}
          </span>
        );
      case 'Button':
        return (
          <button 
            className="w-full h-full border-none bg-transparent cursor-pointer font-inherit flex items-center justify-center text-inherit outline-none"
            onDoubleClick={(e) => {
              if (!isPreviewMode) {
                e.stopPropagation();
                setIsEditingText(true);
              }
            }}
            title={isEditingText ? "Press Enter to save, Esc to cancel" : "Double-click to edit button label"}
          >
            {isEditingText ? (
              <span
                ref={textInputRef}
                contentEditable
                suppressContentEditableWarning
                onPointerDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === 'Escape') {
                    setIsEditingText(false);
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    const newText = e.currentTarget.textContent || '';
                    if (newText !== node.props.text) {
                      useBuilderStore.getState().updateNodeProps(id, { text: newText });
                    }
                    setIsEditingText(false);
                  }
                }}
                onBlur={(e) => {
                  const newText = e.currentTarget.textContent || '';
                  if (newText !== node.props.text) {
                    useBuilderStore.getState().updateNodeProps(id, { text: newText });
                  }
                  setIsEditingText(false);
                }}
                className="outline-none selection:bg-[#0099FF] selection:text-white ring-1 ring-white/60 px-1 rounded bg-black/40 text-inherit"
              >
                {node.props.text || 'Primary Action'}
              </span>
            ) : (
              <span className="select-none pointer-events-none">{node.props.text || 'Primary Action'}</span>
            )}
          </button>
        );
      case 'Image': {
        const fillConfig = effectiveStyles.fillConfig;
        const isColorOrGradient = 
          fillConfig?.type === 'solid' || 
          fillConfig?.type === 'linear' || 
          fillConfig?.type === 'radial' || 
          fillConfig?.type === 'conic' ||
          (effectiveStyles.backgroundColor && 
           effectiveStyles.backgroundColor !== 'transparent' && 
           !effectiveStyles.backgroundColor.startsWith('url('));

        if (isColorOrGradient) {
          return null;
        }

        const imageSource = fillConfig?.imageSrc || 
          (effectiveStyles.backgroundColor?.startsWith('url(') 
            ? effectiveStyles.backgroundColor.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '') 
            : null) || 
          (fillConfig?.type === 'image' || !fillConfig ? node.props.src : null);

        const altDescription = effectiveStyles.fillConfig?.imageAlt ?? node.props.alt ?? "Design Asset";
        
        let objectFitVal: React.CSSProperties['objectFit'] = effectiveStyles.objectFit || 'cover';
        if (effectiveStyles.fillConfig?.imageType === 'fit') objectFitVal = 'contain';
        else if (effectiveStyles.fillConfig?.imageType === 'stretch') objectFitVal = 'fill';
        else if (effectiveStyles.fillConfig?.imageType === 'fill') objectFitVal = 'cover';

        const objectPositionVal = effectiveStyles.fillConfig?.imagePosition 
          ? effectiveStyles.fillConfig.imagePosition.toLowerCase() 
          : 'center';

        return imageSource ? (
          <img 
            src={imageSource} 
            alt={altDescription} 
            className="w-full h-full pointer-events-none select-none"
            style={{ 
              objectFit: objectFitVal,
              objectPosition: objectPositionVal,
              borderRadius: 'inherit'
            }}
          />
        ) : (
          <div className="w-full h-full bg-zinc-800/80 border border-zinc-700/40 flex flex-col items-center justify-center gap-1.5 p-4 text-zinc-400">
            <ImageIcon size={20} className="text-zinc-500" />
            <span className="text-xs">No Image Source</span>
          </div>
        );
      }
      case 'Video':
        return node.props.src ? (
          <div className="relative w-full h-full overflow-hidden" style={{ borderRadius: 'inherit' }}>
            <video 
              src={node.props.src} 
              className="w-full h-full pointer-events-none"
              style={{ objectFit: effectiveStyles.objectFit || 'cover' }}
              autoPlay={node.props.autoPlay ?? true} 
              loop={node.props.loop ?? true} 
              muted={node.props.muted ?? true}
            />
          </div>
        ) : (
          <div className="w-full h-full bg-zinc-800 flex flex-col items-center justify-center gap-1 p-4 text-zinc-500">
            <span className="text-xs">No Video Source</span>
          </div>
        );
      default:
        return null;
    }
  };


  // --- Motion Effects ---
  const effects = effectiveStyles.effects;
  let motionProps: any = {};
  if (effects) {
    if (effects.appear?.enabled) {
      const enter = effects.appear.enter;
      motionProps.initial = { 
        opacity: enter.opacity ?? 0, 
        scale: enter.scale ?? 1,
        y: enter.offset?.y ?? 0,
        x: enter.offset?.x ?? 0,
        rotateX: enter.rotate?.is3d ? enter.rotate.x : enter.rotate?.val ?? 0,
        rotateY: enter.rotate?.is3d ? enter.rotate.y : 0,
        rotateZ: enter.rotate?.is3d ? enter.rotate.z : enter.rotate?.val ?? 0,
        skewX: enter.skew?.x ?? 0,
        skewY: enter.skew?.y ?? 0
      };
      
      motionProps.animate = { opacity: 1, scale: 1, y: 0, x: 0, rotateX: 0, rotateY: 0, rotateZ: 0, skewX: 0, skewY: 0 };
      
      if (enter.transition?.type === 'spring') {
        motionProps.transition = {
          type: 'spring',
          duration: enter.transition.spring.time ?? 0.8,
          bounce: enter.transition.spring.bounce ?? 0.2,
          delay: enter.transition.spring.delay ?? 0
        };
      } else if (enter.transition?.type === 'ease') {
        let ease = "easeInOut";
        if (enter.transition.ease.easeType === "Ease In") ease = "easeIn";
        if (enter.transition.ease.easeType === "Ease Out") ease = "easeOut";
        if (enter.transition.ease.easeType === "Linear") ease = "linear";
        
        motionProps.transition = {
          type: 'tween',
          ease,
          duration: enter.transition.ease.time ?? 0.6,
          delay: enter.transition.ease.delay ?? 0
        };
      }
    }

    if (effects.hover?.enabled) {
      motionProps.whileHover = {
        scale: effects.hover.scale ?? 1.05,
        opacity: effects.hover.opacity ?? 1,
        y: effects.hover.y ?? -4
      };
    }

    if (effects.press?.enabled) {
      motionProps.whileTap = {
        scale: effects.press.scale ?? 0.95
      };
    }

    if (effects.loop?.enabled) {
      motionProps.animate = { ...motionProps.animate, scale: [1, 1.05, 1] };
      motionProps.transition = { ...motionProps.transition, repeat: Infinity, duration: effects.loop.duration ?? 2 };
    }
  }

  return (
    <motion.div
      id={`canvas-node-${id}`}
      ref={setNodeRefs}
      onDragOver={(e) => {
        if (!isPreviewMode && isContainer) {
          e.preventDefault(); // allow drop
          e.stopPropagation();
        }
      }}
      onDrop={(e) => {
        if (!isPreviewMode && isContainer) {
          e.preventDefault();
          e.stopPropagation();
          const dataStr = e.dataTransfer.getData('application/json');
          if (dataStr) {
            try {
              const data = JSON.parse(dataStr);
              if (data.type === 'custom-asset') {
                useBuilderStore.getState().insertAsset(id, -1, data.asset);
              } else if (data.type === 'hudbird-component') {
                useBuilderStore.getState().insertAsset(id, -1, data.asset);
              } else if (data.type && data.type.startsWith('Hudbird_')) {
                // Fallback for older dragged data
                useBuilderStore.getState().insertAsset(id, -1, data);
              }
            } catch(err) {}
          }
        }
      }}
      {...motionProps}
      onClick={handleSelect}
      onDoubleClick={(e) => {
        if (isPreviewMode || isLocked) return;
        if (node.type === 'Text' || node.type === 'Button') {
          e.stopPropagation();
          setIsEditingText(true);
          return;
        }
      }}
      onMouseEnter={(e) => {
        if (!isPreviewMode && !activeDragId && !isEditingText) {
          e.stopPropagation();
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      style={reactStyles}
      {...attributes}
      {...listeners}
      className={clsx(
        "relative transition-all duration-150 ease-out pointer-events-auto",
        node.props?.className,
        !isPreviewMode && "hover:outline hover:outline-1 hover:outline-blue-500/50 cursor-pointer",
        isSelected && "outline outline-[length:calc(2px/var(--canvas-zoom,1))] outline-[#0099FF] z-20 shadow-[0_0_0_calc(1px/var(--canvas-zoom,1))_#0099FF]",
        isDragging && "opacity-35 ring-1 ring-dashed ring-[#0099FF]",
        isContainerDropActive && "outline-[length:calc(2px/var(--canvas-zoom,1))] outline-[#0099FF] bg-[#0099FF]/10 z-30 ring-[length:calc(3px/var(--canvas-zoom,1))] ring-[#0099FF]/30 shadow-[0_0_24px_rgba(0,153,255,0.25)]",
        isOver && isAtomic && !isDropBefore && !isDropAfter && "outline-[length:calc(2px/var(--canvas-zoom,1))] outline-solid outline-[#0099FF] bg-zinc-100 dark:bg-zinc-900 z-30",
        isOver && isInvalid && "outline-[length:calc(2px/var(--canvas-zoom,1))] outline-dashed outline-red-500/80 bg-red-500/15 cursor-not-allowed",
        isHighlighted && "ring-4 ring-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)] z-40 animate-pulse"
      )}
    >
      {/* Smart Active Layout & Spacing Metrics Inspector (Stack, Grid, Padding, Margin, Gap) */}
      {isSelected && !activeDragId && !isEditingText && (
        <HoverInspectorBadge 
          node={node} 
          effectiveStyles={effectiveStyles} 
          isSelected={isSelected} 
          isLocked={isLocked}
        />
      )}

      {/* Subtle Hover Padding Boundary Guideline for Containers */}
      {isHovered && !activeDragId && !isEditingText && isContainer && (
        <HoverPaddingGuide padding={getHoverLayoutInfo(node, effectiveStyles).padding} />
      )}

      {/* Gradient Controllers Overlay */}
      {isSelected && effectiveStyles.fillConfig && effectiveStyles.fillConfig.type !== 'solid' && effectiveStyles.fillConfig.type !== 'image' && (
        <GradientControllerOverlay fillConfig={effectiveStyles.fillConfig} nodeId={id} breakpoint={breakpoint} />
      )}

      {/* Target Frame Glowing Highlight & Corner Brackets */}
      {isTargetContainer && canvasDrop && (
        <TargetFrameHighlight 
          node={node} 
          canvasDrop={canvasDrop} 
          isDropInside={isDropInside} 
        />
      )}

      {/* Target Frame Visual Padding Overlay with Numeric px Badges */}
      {isTargetContainer && canvasDrop && (
        <PaddingVisualOverlay padding={canvasDrop.paddingMetrics} />
      )}

      {/* Sibling Insertion Line: BEFORE (Above or Left) with Gap Metric & Terminal Beads */}
      {isDropBefore && canvasDrop && (
        <InsertionLineGuide 
          position="before" 
          direction={canvasDrop.direction} 
          nodeName={node.name} 
          gap={canvasDrop.gap} 
        />
      )}

      {/* Sibling Insertion Line: AFTER (Below or Right) with Gap Metric & Terminal Beads */}
      {isDropAfter && canvasDrop && (
        <InsertionLineGuide 
          position="after" 
          direction={canvasDrop.direction} 
          nodeName={node.name} 
          gap={canvasDrop.gap} 
        />
      )}

      {renderContent()}
    </motion.div>
  );
});

interface BreakpointViewportProps {
  breakpoint: BreakpointKey;
  label: string;
  rangeLabel: string;
  defaultWidth: number;
}

export const BreakpointViewport: React.FC<BreakpointViewportProps> = ({
  breakpoint,
  label,
  rangeLabel,
  defaultWidth
}) => {
  const rootNodeId = useBuilderStore((state) => state?.rootNodeId);
  const activeBreakpoint = useBuilderStore((state) => state?.activeBreakpoint ?? 'lg');
  const setBreakpoint = useBuilderStore((state) => state?.setBreakpoint);
  const enabledBreakpoints = useBuilderStore((state) => state?.enabledBreakpoints) || DEFAULT_ENABLED_BREAKPOINTS;
  const enableBreakpoint = useBuilderStore((state) => state?.enableBreakpoint);
  const disableBreakpoint = useBuilderStore((state) => state?.disableBreakpoint);
  const generateAllBreakpoints = useBuilderStore((state) => state?.generateAllBreakpoints);
  const breakpointWidths = useBuilderStore((state) => state?.breakpointWidths) || DEFAULT_BREAKPOINT_WIDTHS;
  const setBreakpointWidth = useBuilderStore((state) => state?.setBreakpointWidth);
  const isPreviewMode = useBuilderStore((state) => state?.isPreviewMode ?? false);
  const canvasTheme = useBuilderStore((state) => state?.canvasTheme ?? 'dark');
  const showGrid = useBuilderStore((state) => state?.showGrid ?? false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(breakpointWidths[breakpoint] || defaultWidth);
  const [isEditingWidth, setIsEditingWidth] = useState(false);
  const [customWidthInput, setCustomWidthInput] = useState(String(currentWidth));
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [canvasDrop, setCanvasDrop] = useState<CanvasSpatialDropResolution | null>(null);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isActive = activeBreakpoint === breakpoint;
  const isDark = canvasTheme === 'dark';
  const nodes = useBuilderStore((state) => state?.nodes) || EMPTY_OBJECT;
  const activeDragNode = activeDragId ? nodes[activeDragId] : null;

  // DnD Sensors for Canvas interaction (distance constraint 5 prevents accidental drag on click)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
    setCanvasDrop(null);
  };

  const handleDragCancel = () => {
    setActiveDragId(null);
    setCanvasDrop(null);
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setCanvasDrop(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const storeNodes = useBuilderStore.getState().nodes;
    const storeRootId = useBuilderStore.getState().rootNodeId;

    if (!storeNodes[activeId] || !storeNodes[overId]) {
      setCanvasDrop(null);
      return;
    }

    // Prevent dragging ancestor into descendant
    if (isDescendant(storeNodes, overId, activeId)) {
      setCanvasDrop(null);
      return;
    }

    const activeRect = event.active.rect.current.translated;
    const pointerX = activeRect ? activeRect.left + activeRect.width / 2 : 0;
    const pointerY = activeRect ? activeRect.top + activeRect.height / 2 : 0;

    const resolution = resolveCanvasSpatialDrop({
      activeId,
      overId,
      nodes: storeNodes,
      rootNodeId: storeRootId,
      pointerX,
      pointerY,
      currentDrop: canvasDrop,
      breakpoint,
    });

    setCanvasDrop(resolution);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);
    const drop = canvasDrop;
    setCanvasDrop(null);

    const { active, over, delta } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;

    // Ensure active breakpoint
    useBuilderStore.getState().setBreakpoint(breakpoint);

    if (drop && drop.targetId === (over.id as string)) {
      useBuilderStore.getState().moveNode(activeId, drop.containerId, drop.targetIndex);
      return;
    }

    // Fallback:
    const overId = over.id as string;
    const storeNodes = useBuilderStore.getState().nodes;
    const storeRootId = useBuilderStore.getState().rootNodeId;
    const activeNode = storeNodes[activeId];
    const overNode = storeNodes[overId];

    if (!activeNode || !overNode) return;

    // Prevent circular moves (ancestor dropped into descendant)
    if (isDescendant(storeNodes, overId, activeId)) return;

    // Rule: Containers (Frame, Stack, Grid, Masonry, Root) accept children. Atoms DO NOT!
    const isOverContainer = isContainerType(overNode.type) || overId === storeRootId;

    if (isOverContainer) {
      // Re-parent into container at the end
      useBuilderStore.getState().moveNode(activeId, overId, overNode.childrenIds.length);
    } else {
      // Atom component (Text, Button, Image, Video):
      // Cannot accept children! Place in atom's parent container at atom's index
      const targetParentId = overNode.parentId || storeRootId;
      const parent = storeNodes[targetParentId];
      if (parent) {
        const overIndex = parent.childrenIds.indexOf(overId);
        const safeIndex = overIndex >= 0 ? (delta.y > 0 ? overIndex + 1 : overIndex) : parent.childrenIds.length;
        useBuilderStore.getState().moveNode(activeId, targetParentId, safeIndex);
      }
    }
  };

  // Sync state with store width changes (using primitive targetWidth to avoid re-renders)
  const targetWidth = breakpointWidths[breakpoint] || defaultWidth;
  useEffect(() => {
    if (targetWidth) {
      setCurrentWidth(targetWidth);
    }
  }, [targetWidth]);

  // Close dropdown menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Drag-to-resize handle logic
  const handleResizeStart = (e: React.MouseEvent, direction: 'left' | 'right') => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = currentWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = direction === 'right' 
        ? Math.max(320, Math.min(1920, startWidth + deltaX * 2))
        : Math.max(320, Math.min(1920, startWidth - deltaX * 2));
      
      const roundedWidth = Math.round(newWidth);
      setCurrentWidth(roundedWidth);
      setBreakpointWidth(breakpoint, roundedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleWidthSubmit = () => {
    const num = parseInt(customWidthInput, 10);
    if (!isNaN(num) && num >= 320 && num <= 2400) {
      setCurrentWidth(num);
      setBreakpointWidth(breakpoint, num);
    }
    setIsEditingWidth(false);
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center shrink-0 relative transition-all duration-200"
      onClick={() => {
        if (!isActive) setBreakpoint(breakpoint);
      }}
    >
      {/* 1. FRAMER BREAKPOINT HEADER PILL (Images 1, 7, 8) */}
      {!isPreviewMode && (
        <div className="mb-3 relative select-none z-30" ref={menuRef}>
          <div 
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-md transition-all cursor-pointer border",
              isActive 
                ? (isDark 
                    ? "bg-[#18181B] border-[#0099FF] text-zinc-900 dark:text-white shadow-[0_0_15px_rgba(0,153,255,0.25)]" 
                    : "bg-white border-[#0099FF] text-zinc-900 dark:text-white shadow-[0_0_15px_rgba(0,153,255,0.2)]")
                : isDark 
                  ? "bg-[#18181B]/90 border-[#2A2A2E] text-[#888890] hover:text-white hover:border-[#444]" 
                  : "bg-white/95 border-zinc-200 text-zinc-600 hover:text-zinc-900 shadow-sm"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setBreakpoint(breakpoint);
              if (rootNodeId) {
                useBuilderStore.getState().selectNode(rootNodeId);
              }
            }}
          >
            {/* Play/Breakpoint Icon */}
            <div className="w-3.5 h-3.5 flex items-center justify-center">
              <Play 
                size={11} 
                fill={isActive ? "#0099FF" : "currentColor"} 
                className={clsx("transition-colors", isActive ? "text-zinc-900 dark:text-white" : isDark ? "text-[#777]" : "text-zinc-400")} 
              />
            </div>

            {/* Label and Range/Width */}
            <div className="flex items-center gap-1.5">
              <span className={clsx("font-bold tracking-tight", isActive ? (isDark ? "text-white" : "text-zinc-900") : isDark ? "text-zinc-300" : "text-zinc-700")}>
                {label}
              </span>
              
              {isEditingWidth ? (
                <input
                  type="number"
                  value={customWidthInput}
                  onChange={(e) => setCustomWidthInput(e.target.value)}
                  onBlur={handleWidthSubmit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleWidthSubmit();
                    if (e.key === 'Escape') setIsEditingWidth(false);
                  }}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  className="w-14 bg-white dark:bg-black/60 text-zinc-900 dark:text-white text-xs px-1 py-0.5 rounded border border-[#0099FF] outline-none text-center"
                />
              ) : (
                <span 
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setIsEditingWidth(true);
                  }}
                  className={clsx(
                    "text-[11px] font-normal transition-colors",
                    isActive ? "text-zinc-900 dark:text-white" : isDark ? "text-[#777]" : "text-zinc-500"
                  )}
                  title="Double click to change width"
                >
                  {rangeLabel || currentWidth}
                </span>
              )}
            </div>

            {/* Plus / More Options Button (Gambar 8) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className={clsx(
                "ml-1 p-0.5 rounded-full transition-colors flex items-center justify-center",
                menuOpen 
                  ? "bg-[#0099FF] text-white" 
                  : isActive 
                    ? "hover:bg-[#0099FF]/20 text-zinc-900 dark:text-white" 
                    : isDark ? "hover:bg-[#333] text-[#888] hover:text-white" : "hover:bg-zinc-200 text-zinc-500"
              )}
              title="Breakpoint Options"
            >
              <Plus size={13} strokeWidth={2.5} />
            </button>
          </div>

          {/* PLUS / BREAKPOINT DROPDOWN MENU (Gambar 8) */}
          {menuOpen && (
            <div 
              className={clsx(
                "absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 rounded-xl border shadow-2xl py-1.5 z-50 text-xs select-none animate-in fade-in zoom-in-95 duration-100",
                isDark 
                  ? "bg-[#18181B] border-[#2E2E35] text-[#E4E4E7]" 
                  : "bg-white border-zinc-200 text-zinc-800 shadow-xl"
              )}
            >
              {/* Generate responsive options */}
              <div 
                onClick={() => {
                  generateAllBreakpoints();
                  setMenuOpen(false);
                }}
                className={clsx(
                  "flex items-center justify-between px-3.5 py-2 cursor-pointer transition-colors",
                  isDark ? "hover:bg-[#27272A] text-white" : "hover:bg-zinc-100 text-zinc-900"
                )}
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-zinc-900 dark:text-white" />
                  <span className="font-medium">Generate Breakpoints</span>
                </div>
                <span className={clsx("text-[10px]", isDark ? "text-[#777]" : "text-zinc-400")}>Auto</span>
              </div>

              <div className={clsx("h-px my-1", isDark ? "bg-[#27272A]" : "bg-zinc-100")} />

              {/* Tablet Breakpoint Toggle */}
              <div 
                onClick={() => {
                  if (enabledBreakpoints.includes('md')) {
                    setBreakpoint('md');
                  } else {
                    enableBreakpoint('md');
                  }
                  setMenuOpen(false);
                }}
                className={clsx(
                  "flex items-center justify-between px-3.5 py-2 cursor-pointer transition-colors",
                  isDark ? "hover:bg-[#27272A]" : "hover:bg-zinc-100"
                )}
              >
                <div className="flex items-center gap-2">
                  <Tablet size={14} className={enabledBreakpoints.includes('md') ? "text-zinc-900 dark:text-white" : "text-zinc-500"} />
                  <span>Tablet (810px)</span>
                </div>
                {enabledBreakpoints.includes('md') && <Check size={13} className="text-zinc-900 dark:text-white" />}
              </div>

              {/* Phone Breakpoint Toggle */}
              <div 
                onClick={() => {
                  if (enabledBreakpoints.includes('base')) {
                    setBreakpoint('base');
                  } else {
                    enableBreakpoint('base');
                  }
                  setMenuOpen(false);
                }}
                className={clsx(
                  "flex items-center justify-between px-3.5 py-2 cursor-pointer transition-colors",
                  isDark ? "hover:bg-[#27272A]" : "hover:bg-zinc-100"
                )}
              >
                <div className="flex items-center gap-2">
                  <Smartphone size={14} className={enabledBreakpoints.includes('base') ? "text-zinc-900 dark:text-white" : "text-zinc-500"} />
                  <span>Phone (390px)</span>
                </div>
                {enabledBreakpoints.includes('base') && <Check size={13} className="text-zinc-900 dark:text-white" />}
              </div>

              <div className={clsx("h-px my-1", isDark ? "bg-[#27272A]" : "bg-zinc-100")} />

              {/* Edit Width */}
              <div 
                onClick={() => {
                  setIsEditingWidth(true);
                  setMenuOpen(false);
                }}
                className={clsx(
                  "flex items-center justify-between px-3.5 py-2 cursor-pointer transition-colors",
                  isDark ? "hover:bg-[#27272A]" : "hover:bg-zinc-100"
                )}
              >
                <div className="flex items-center gap-2">
                  <Sliders size={14} className="text-zinc-400" />
                  <span>Custom Width...</span>
                </div>
                <span className={clsx("text-[10px] font-mono", isDark ? "text-[#888]" : "text-zinc-400")}>{currentWidth}px</span>
              </div>

              {/* Delete / Remove Breakpoint (If not Desktop Primary) */}
              {breakpoint !== 'lg' && enabledBreakpoints.includes(breakpoint) && (
                <>
                  <div className={clsx("h-px my-1", isDark ? "bg-[#27272A]" : "bg-zinc-100")} />
                  <div 
                    onClick={() => {
                      disableBreakpoint(breakpoint);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3.5 py-2 cursor-pointer text-red-400 hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 size={14} />
                    <span>Remove {label} Breakpoint</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. BREAKPOINT CANVAS FRAME CONTAINER */}
      <div 
        className="relative group flex justify-center"
        style={{ width: `${currentWidth}px` }}
      >
        {/* Active Top Drag Bar (Gambar 1, 7) */}
        {isActive && !isPreviewMode && (
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#0099FF] rounded-full z-30 shadow-[0_0_8px_#0099FF]" />
        )}

        {/* Left Interactive Resize Handle */}
        {!isPreviewMode && (
          <div 
            onMouseDown={(e) => handleResizeStart(e, 'left')}
            className={clsx(
              "absolute -left-3 top-0 bottom-0 w-3 cursor-ew-resize flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-opacity",
              isResizing && "opacity-100"
            )}
            title="Drag to resize breakpoint width"
          >
            <div className="w-1 h-12 rounded-full bg-zinc-600 hover:bg-[#0099FF] transition-colors" />
          </div>
        )}

        {/* Right Interactive Resize Handle */}
        {!isPreviewMode && (
          <div 
            onMouseDown={(e) => handleResizeStart(e, 'right')}
            className={clsx(
              "absolute -right-3 top-0 bottom-0 w-3 cursor-ew-resize flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-opacity",
              isResizing && "opacity-100"
            )}
            title="Drag to resize breakpoint width"
          >
            <div className="w-1 h-12 rounded-full bg-zinc-600 hover:bg-[#0099FF] transition-colors" />
          </div>
        )}

        {/* Resizing Pixel Feedback Badge */}
        {isResizing && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#0099FF] text-white text-xs font-mono font-bold px-2 py-0.5 rounded shadow-lg z-50">
            {currentWidth}px
          </div>
        )}

        {/* Actual Frame Viewport Surface with DnD Context */}
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragCancel={handleDragCancel}
          onDragEnd={handleDragEnd}
        >
          <CanvasDndStateContext.Provider value={{ activeDragId, canvasDrop }}>
            <div 
              className={clsx(
                "w-full min-h-[750px] flex flex-col transition-shadow duration-200 overflow-hidden relative",
                isPreviewMode 
                  ? "bg-white dark:bg-[#0A0A0A]" 
                  : clsx(
                      "rounded-xl border shadow-2xl bg-white dark:bg-[#0A0A0A]",
                      isActive 
                        ? "border-[#0099FF]/70 shadow-[0_0_30px_rgba(0,153,255,0.12)]" 
                        : isDark 
                          ? "border-[#222226] hover:border-[#333338]" 
                          : "border-zinc-300 shadow-zinc-300/50"
                    )
              )}
            >
              {showGrid && !isPreviewMode && (
                <div 
                  className="absolute inset-0 pointer-events-none z-[100]" 
                  style={{
                    backgroundImage: `
                      radial-gradient(circle, ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'} 1px, transparent 1px)
                    `,
                    backgroundSize: '16px 16px',
                    backgroundPosition: '0 0'
                  }} 
                />
              )}
              <BreakpointNodeElement id={rootNodeId} breakpoint={breakpoint} />
            </div>

            {/* Drag & Drop Visual Spacing Metrics HUD Widget */}
            {activeDragId && canvasDrop && (
              <SpacingMetricsHUD canvasDrop={canvasDrop} nodes={nodes} />
            )}

            {/* Canvas Drag Overlay floating representation */}
            <DragOverlay dropAnimation={null}>
              {activeDragNode ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1E]/95 border-2 border-[#0099FF] text-white text-xs rounded-lg shadow-[0_12px_32px_rgba(0,153,255,0.4)] backdrop-blur-md pointer-events-none z-50">
                  <div className="w-5 h-5 flex items-center justify-center rounded bg-[#0099FF]/20 text-zinc-900 dark:text-white">
                    {renderNodeIconByType(activeDragNode.type, true, activeDragNode.name)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-white leading-none">{activeDragNode.name}</span>
                    <span className="text-[10px] text-zinc-900 dark:text-white font-mono mt-0.5">{activeDragNode.type}</span>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </CanvasDndStateContext.Provider>
        </DndContext>
      </div>
    </div>
  );
};
