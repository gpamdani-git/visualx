import { CanvasNode, CanvasNodeType, BreakpointKey } from '../types/builder';
import { getNodeEffectiveStyle } from './styleUtils';
import { componentRegistry } from '../registry/ComponentRegistry';

export type NodeType = CanvasNodeType;

export const CONTAINER_TYPES: readonly CanvasNodeType[] = ['Frame', 'Stack', 'Grid', 'Masonry'];
export const ATOM_TYPES: readonly CanvasNodeType[] = ['Text', 'Button', 'Image', 'Video'];

/**
 * Hudbird compound/section types that can accept child nodes.
 * Overlays whose canvas render ignores children (Dialog, Dropdown) are atoms.
 */
export const HUDBIRD_CONTAINER_TYPES: readonly string[] = [
  'Hudbird_Accordion', 'Hudbird_AccordionItem',
  'Hudbird_Tabs', 'Hudbird_TabList', 'Hudbird_TabPanel',
  'Hudbird_Card', 'Hudbird_CardHeader', 'Hudbird_CardBody', 'Hudbird_CardFooter',
  'Hudbird_BentoGrid', 'Hudbird_BentoCard',
  'Hudbird_Navbar', 'Hudbird_NavbarContent',
  'Hudbird_Hero', 'Hudbird_HeroBody', 'Hudbird_HeroContent', 'Hudbird_HeroActions',
  'Hudbird_Pricing', 'Hudbird_PricingHeader', 'Hudbird_PricingGrid', 'Hudbird_PricingTier',
  'Hudbird_PricingTierHeader', 'Hudbird_PricingTierFeatures',
  'Hudbird_Fieldset', 'Hudbird_FieldsetContent', 'Hudbird_FieldsetRow',
  'Hudbird_DescriptionList', 'Hudbird_DescriptionListItem',
  'Hudbird_Table', 'Hudbird_TableHeader', 'Hudbird_TableBody', 'Hudbird_TableFooter', 'Hudbird_TableRow',
];

export function isHudbirdContainerType(type?: string): boolean {
  if (!type || !type.startsWith('Hudbird_')) return false;
  if ((HUDBIRD_CONTAINER_TYPES as readonly string[]).includes(type)) return true;
  // All Section-category registry entries are layout containers
  return componentRegistry[type]?.category === 'Section';
}

export function isContainerType(type?: string): boolean {
  if (!type) return false;
  if (CONTAINER_TYPES.includes(type as NodeType)) return true;
  return isHudbirdContainerType(type);
}

export function isAtomType(type?: string): boolean {
  if (!type) return false;
  if (ATOM_TYPES.includes(type as NodeType)) return true;
  // Non-container Hudbird components behave as atoms (cannot accept children)
  if (type.startsWith('Hudbird_')) return !isHudbirdContainerType(type);
  return false;
}

/**
 * Checks if childId is the same as or a descendant of ancestorId.
 */
export function isDescendant(
  nodes: Record<string, CanvasNode>,
  childId: string | null | undefined,
  ancestorId: string | null | undefined
): boolean {
  if (!childId || !ancestorId) return false;
  if (childId === ancestorId) return true;

  let currentId: string | null = childId;
  const visited = new Set<string>();

  while (currentId && !visited.has(currentId)) {
    visited.add(currentId);
    if (currentId === ancestorId) return true;
    currentId = nodes[currentId]?.parentId || null;
  }

  return false;
}

/**
 * Validates if targetId can accept draggedId as a child (container check & circular dependency prevention).
 */
export function canAcceptChild(
  nodes: Record<string, CanvasNode>,
  targetId: string,
  draggedId: string,
  rootNodeId: string
): boolean {
  if (!targetId || !draggedId) return false;
  if (targetId === draggedId) return false;

  // Cannot drop ancestor into descendant
  if (isDescendant(nodes, targetId, draggedId)) {
    return false;
  }

  // Root node is always a valid container
  if (targetId === rootNodeId) {
    return true;
  }

  const targetNode = nodes[targetId];
  if (!targetNode) return false;

  // Atom components cannot accept children
  if (isAtomType(targetNode.type)) {
    return false;
  }

  return isContainerType(targetNode.type);
}

export interface DropResolution {
  targetParentId: string;
  insertIndex: number;
  position: 'before' | 'after' | 'inside';
}

export interface CanvasPaddingMetrics {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface CanvasMarginMetrics {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface CanvasSpatialDropResolution {
  containerId: string;
  targetId: string;
  targetIndex: number;
  position: 'inside' | 'before' | 'after';
  direction: 'row' | 'column';
  gap: number;
  padding: number;
  paddingMetrics: CanvasPaddingMetrics;
  marginMetrics: CanvasMarginMetrics;
  targetDimensions?: { width: number; height: number };
  containerDimensions?: { width: number; height: number };
}

export interface ResolveCanvasSpatialDropOptions {
  activeId: string;
  overId: string;
  nodes: Record<string, CanvasNode>;
  rootNodeId: string;
  pointerX?: number;
  pointerY?: number;
  relativeX?: number;
  relativeY?: number;
  currentDrop?: CanvasSpatialDropResolution | null;
  breakpoint?: BreakpointKey;
}

function isOptionsObj(val: unknown): val is ResolveCanvasSpatialDropOptions {
  return typeof val === 'object' && val !== null && 'activeId' in val && 'nodes' in val;
}

/**
 * Resolves drop position for canvas drag-and-drop with layout direction & spatial rules.
 * Supports both options object and positional arguments.
 */
export function resolveCanvasSpatialDrop(
  nodesOrOptions: Record<string, CanvasNode> | ResolveCanvasSpatialDropOptions,
  activeIdParam?: string,
  overIdParam?: string,
  rootNodeIdParam?: string,
  relativeXParam?: number,
  relativeYParam?: number,
  directionParam: 'row' | 'column' = 'column',
  gapParam: number = 16,
  paddingParam: number = 24
): CanvasSpatialDropResolution | null {
  let nodes: Record<string, CanvasNode>;
  let activeId: string;
  let overId: string;
  let rootNodeId: string;
  let relativeX = 0.5;
  let relativeY = 0.5;
  let direction = directionParam;
  let gap = gapParam;
  let padding = paddingParam;
  let paddingMetrics: CanvasPaddingMetrics = { top: paddingParam, right: paddingParam, bottom: paddingParam, left: paddingParam };
  let marginMetrics: CanvasMarginMetrics = { top: 0, right: 0, bottom: 0, left: 0 };
  let targetDimensions: { width: number; height: number } | undefined = undefined;
  let containerDimensions: { width: number; height: number } | undefined = undefined;
  let currentDrop: CanvasSpatialDropResolution | null = null;

  if (isOptionsObj(nodesOrOptions)) {
    const opts = nodesOrOptions;
    nodes = opts.nodes;
    activeId = opts.activeId;
    overId = opts.overId;
    rootNodeId = opts.rootNodeId;
    currentDrop = opts.currentDrop || null;

    // Calculate relative coordinates from pointer if available
    if (typeof opts.relativeX === 'number' && typeof opts.relativeY === 'number') {
      relativeX = opts.relativeX;
      relativeY = opts.relativeY;
    } else if (typeof opts.pointerX === 'number' && typeof opts.pointerY === 'number' && typeof document !== 'undefined') {
      const el = document.getElementById(`canvas-node-${overId}`) || document.getElementById(overId) || document.querySelector(`[data-node-id="${overId}"]`);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          relativeX = Math.max(0, Math.min(1, (opts.pointerX - rect.left) / rect.width));
          relativeY = Math.max(0, Math.min(1, (opts.pointerY - rect.top) / rect.height));
          targetDimensions = { width: Math.round(rect.width), height: Math.round(rect.height) };
        }
      }
    }

    const overNode = nodes[overId];
    if (overNode) {
      const isOverContainer = overId === rootNodeId || isContainerType(overNode.type);
      const targetContainerNode = isOverContainer ? overNode : (nodes[overNode.parentId || rootNodeId] || overNode);
      const effectiveStyles = getNodeEffectiveStyle(targetContainerNode, opts.breakpoint || 'lg');
      direction = (effectiveStyles.layoutDirection || 'column') as 'row' | 'column';
      gap = typeof effectiveStyles.gap === 'number' ? effectiveStyles.gap : 16;
      
      const padObj = typeof effectiveStyles.padding === 'object' && effectiveStyles.padding !== null
        ? {
            top: effectiveStyles.padding.top ?? 0,
            right: effectiveStyles.padding.right ?? 0,
            bottom: effectiveStyles.padding.bottom ?? 0,
            left: effectiveStyles.padding.left ?? 0,
          }
        : {
            top: typeof effectiveStyles.padding === 'number' ? effectiveStyles.padding : 16,
            right: typeof effectiveStyles.padding === 'number' ? effectiveStyles.padding : 16,
            bottom: typeof effectiveStyles.padding === 'number' ? effectiveStyles.padding : 16,
            left: typeof effectiveStyles.padding === 'number' ? effectiveStyles.padding : 16,
          };
      paddingMetrics = padObj;
      padding = padObj.top;

      const overStyles = getNodeEffectiveStyle(overNode, opts.breakpoint || 'lg');
      const marObj = typeof (overStyles as any).margin === 'object' && (overStyles as any).margin !== null
        ? {
            top: (overStyles as any).margin.top ?? 0,
            right: (overStyles as any).margin.right ?? 0,
            bottom: (overStyles as any).margin.bottom ?? 0,
            left: (overStyles as any).margin.left ?? 0,
          }
        : {
            top: typeof (overStyles as any).margin === 'number' ? (overStyles as any).margin : 0,
            right: typeof (overStyles as any).margin === 'number' ? (overStyles as any).margin : 0,
            bottom: typeof (overStyles as any).margin === 'number' ? (overStyles as any).margin : 0,
            left: typeof (overStyles as any).margin === 'number' ? (overStyles as any).margin : 0,
          };
      marginMetrics = marObj;

      if (typeof document !== 'undefined') {
        const containerEl = document.getElementById(`canvas-node-${targetContainerNode.id}`) || document.getElementById(targetContainerNode.id);
        if (containerEl) {
          const cRect = containerEl.getBoundingClientRect();
          containerDimensions = { width: Math.round(cRect.width), height: Math.round(cRect.height) };
        }
      }
    }
  } else {
    nodes = nodesOrOptions;
    activeId = activeIdParam!;
    overId = overIdParam!;
    rootNodeId = rootNodeIdParam!;
    relativeX = relativeXParam ?? 0.5;
    relativeY = relativeYParam ?? 0.5;
  }

  if (!activeId || !overId || activeId === overId) return null;

  const activeNode = nodes[activeId];
  const overNode = nodes[overId];
  if (!activeNode || !overNode) return null;

  // Prevent circular dependency
  if (isDescendant(nodes, overId, activeId)) return null;

  const isOverRoot = overId === rootNodeId;
  const isOverContainer = isOverRoot || isContainerType(overNode.type);

  // If hovering over root, always place inside root
  if (isOverRoot) {
    return {
      containerId: rootNodeId,
      targetId: rootNodeId,
      targetIndex: overNode.childrenIds.length,
      position: 'inside',
      direction,
      gap,
      padding,
      paddingMetrics,
      marginMetrics,
      targetDimensions,
      containerDimensions
    };
  }

  // If hovering over a container:
  if (isOverContainer) {
    // If container has no children, always drop inside
    if (!overNode.childrenIds || overNode.childrenIds.length === 0) {
      return {
        containerId: overId,
        targetId: overId,
        targetIndex: 0,
        position: 'inside',
        direction,
        gap,
        padding,
        paddingMetrics,
        marginMetrics,
        targetDimensions,
        containerDimensions
      };
    }

    // Central deadzone with hysteresis:
    // If previously inside, keep 'inside' unless pointer clearly moves near edges (< 0.15 or > 0.85)
    const minInside = currentDrop?.position === 'inside' ? 0.15 : 0.22;
    const maxInside = currentDrop?.position === 'inside' ? 0.85 : 0.78;
    const isInsideCenter = relativeY >= minInside && relativeY <= maxInside && relativeX >= minInside && relativeX <= maxInside;
    
    if (isInsideCenter) {
      return {
        containerId: overId,
        targetId: overId,
        targetIndex: overNode.childrenIds.length,
        position: 'inside',
        direction,
        gap,
        padding,
        paddingMetrics,
        marginMetrics,
        targetDimensions,
        containerDimensions
      };
    }
  }

  // Otherwise, drop as sibling BEFORE or AFTER overNode in its parent container
  const parentId = overNode.parentId || rootNodeId;
  const parentNode = nodes[parentId];
  if (!parentNode) return null;

  const overIndex = parentNode.childrenIds.indexOf(overId);
  if (overIndex === -1) return null;

  // Sibling insertion with hysteresis to prevent flickering on line borders
  const splitThreshold = currentDrop?.position === 'before' ? 0.55 : 0.45;
  const isBefore = direction === 'row' ? relativeX < splitThreshold : relativeY < splitThreshold;

  return {
    containerId: parentId,
    targetId: overId,
    targetIndex: isBefore ? overIndex : overIndex + 1,
    position: isBefore ? 'before' : 'after',
    direction,
    gap,
    padding,
    paddingMetrics,
    marginMetrics,
    targetDimensions,
    containerDimensions
  };
}

/**
 * Resolves drop position (before, after, inside) enforcing atom vs container rules.
 */
export function resolveDropPosition(
  nodes: Record<string, CanvasNode>,
  activeId: string,
  overId: string,
  rootNodeId: string,
  relativeY: number // 0 (top) to 1 (bottom) of target element
): DropResolution | null {
  if (!activeId || !overId || activeId === overId) return null;

  const activeNode = nodes[activeId];
  const overNode = nodes[overId];

  if (!activeNode || !overNode) return null;

  // Prevent circular dependency
  if (isDescendant(nodes, overId, activeId)) return null;

  const isOverRoot = overId === rootNodeId;
  const isOverContainer = isOverRoot || isContainerType(overNode.type);

  // If hovering over root, always place inside
  if (isOverRoot) {
    return {
      targetParentId: rootNodeId,
      insertIndex: overNode.childrenIds.length,
      position: 'inside'
    };
  }

  // If over a container, middle 50% (0.25 <= relativeY <= 0.75) means drop INSIDE
  if (isOverContainer && relativeY >= 0.25 && relativeY <= 0.75) {
    return {
      targetParentId: overId,
      insertIndex: overNode.childrenIds.length,
      position: 'inside'
    };
  }

  // Otherwise, drop BEFORE or AFTER in overNode's parent container
  const parentId = overNode.parentId || rootNodeId;
  const parentNode = nodes[parentId];
  if (!parentNode) return null;

  const overIndex = parentNode.childrenIds.indexOf(overId);
  if (overIndex === -1) return null;

  if (relativeY < (isOverContainer ? 0.25 : 0.5)) {
    // Drop before
    return {
      targetParentId: parentId,
      insertIndex: overIndex,
      position: 'before'
    };
  } else {
    // Drop after
    return {
      targetParentId: parentId,
      insertIndex: overIndex + 1,
      position: 'after'
    };
  }
}
