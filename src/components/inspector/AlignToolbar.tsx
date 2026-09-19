import React from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { NodeStyleProps } from '../../types/builder';

const EMPTY_NODES: Record<string, any> = {};

export default function AlignToolbar() {
  const selectedNodeId = useBuilderStore((state) => state?.selectedNodeId);
  const rootNodeId = useBuilderStore((state) => state?.rootNodeId);
  const nodes = useBuilderStore((state) => state?.nodes) || EMPTY_NODES;
  const activeBreakpoint = useBuilderStore((state) => state?.activeBreakpoint ?? 'lg');
  const updateNodeStyle = useBuilderStore((state) => state?.updateNodeStyle);

  if (!selectedNodeId || selectedNodeId === rootNodeId) return null;

  const node = nodes[selectedNodeId];
  if (!node) return null;

  const parent = node.parentId ? nodes[node.parentId] : null;

  const handleAlign = (type: 'left' | 'centerH' | 'right' | 'top' | 'centerV' | 'bottom' | 'distributeH' | 'distributeV') => {
    // If element is absolute, adjust top/left/right/bottom coordinates
    const base = node.responsiveStyles.base || {};
    const curr = node.responsiveStyles[activeBreakpoint] || {};
    const styles: Partial<NodeStyleProps> = { ...base, ...curr };

    if (styles.position === 'absolute') {
      const pin = styles.pinning || { pinned: { t: true, l: true } };
      switch (type) {
        case 'left':
          updateNodeStyle(node.id, activeBreakpoint, {
            left: 0,
            pinning: { ...pin, left: 0, pinned: { ...pin.pinned, l: true, r: false } }
          });
          break;
        case 'centerH':
          updateNodeStyle(node.id, activeBreakpoint, {
            left: '50%',
            pinning: { ...pin, left: 0, pinned: { ...pin.pinned, l: true, r: true } }
          });
          break;
        case 'right':
          updateNodeStyle(node.id, activeBreakpoint, {
            right: 0,
            left: undefined,
            pinning: { ...pin, right: 0, pinned: { ...pin.pinned, r: true, l: false } }
          });
          break;
        case 'top':
          updateNodeStyle(node.id, activeBreakpoint, {
            top: 0,
            pinning: { ...pin, top: 0, pinned: { ...pin.pinned, t: true, b: false } }
          });
          break;
        case 'centerV':
          updateNodeStyle(node.id, activeBreakpoint, {
            top: '50%',
            pinning: { ...pin, top: 0, pinned: { ...pin.pinned, t: true, b: true } }
          });
          break;
        case 'bottom':
          updateNodeStyle(node.id, activeBreakpoint, {
            bottom: 0,
            top: undefined,
            pinning: { ...pin, bottom: 0, pinned: { ...pin.pinned, b: true, t: false } }
          });
          break;
        default:
          break;
      }
    } else if (parent) {
      // In flex parent, adjust self align or parent justify/align
      switch (type) {
        case 'left':
          updateNodeStyle(node.id, activeBreakpoint, { alignItems: 'flex-start', textAlign: 'left' });
          break;
        case 'centerH':
          updateNodeStyle(node.id, activeBreakpoint, { alignItems: 'center', textAlign: 'center' });
          break;
        case 'right':
          updateNodeStyle(node.id, activeBreakpoint, { alignItems: 'flex-end', textAlign: 'right' });
          break;
        case 'top':
          updateNodeStyle(node.id, activeBreakpoint, { justifyContent: 'flex-start' });
          break;
        case 'centerV':
          updateNodeStyle(node.id, activeBreakpoint, { justifyContent: 'center' });
          break;
        case 'bottom':
          updateNodeStyle(node.id, activeBreakpoint, { justifyContent: 'flex-end' });
          break;
        case 'distributeH':
        case 'distributeV':
          updateNodeStyle(node.id, activeBreakpoint, { justifyContent: 'space-between' });
          break;
      }
    }
  };

  const alignButtons = [
    {
      id: 'left',
      label: 'Align Left',
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="2" width="2" height="12" rx="0.5" />
          <rect x="5" y="5" width="8" height="6" rx="1.5" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )
    },
    {
      id: 'centerH',
      label: 'Align Center Horizontal',
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <line x1="8" y1="1" x2="8" y2="15" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 1" />
          <rect x="4" y="5" width="8" height="6" rx="1.5" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )
    },
    {
      id: 'right',
      label: 'Align Right',
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <rect x="13" y="2" width="2" height="12" rx="0.5" />
          <rect x="3" y="5" width="8" height="6" rx="1.5" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )
    },
    {
      id: 'top',
      label: 'Align Top',
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <rect x="2" y="1" width="12" height="2" rx="0.5" />
          <rect x="5" y="5" width="6" height="8" rx="1.5" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )
    },
    {
      id: 'centerV',
      label: 'Align Center Vertical',
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 1" />
          <rect x="5" y="4" width="6" height="8" rx="1.5" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )
    },
    {
      id: 'bottom',
      label: 'Align Bottom',
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <rect x="2" y="13" width="12" height="2" rx="0.5" />
          <rect x="5" y="3" width="6" height="8" rx="1.5" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )
    },
    {
      id: 'distributeH',
      label: 'Distribute Horizontally',
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="2" width="1.5" height="12" />
          <rect x="13.5" y="2" width="1.5" height="12" />
          <rect x="5.5" y="4" width="5" height="8" rx="1" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )
    },
    {
      id: 'distributeV',
      label: 'Distribute Vertically',
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <rect x="2" y="1" width="12" height="1.5" />
          <rect x="2" y="13.5" width="12" height="1.5" />
          <rect x="4" y="5.5" width="8" height="5" rx="1" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex items-center justify-between px-2.5 py-2 border-b border-zinc-200 dark:border-[#1E1E1E] bg-white dark:bg-[#141414]">
      {alignButtons.map((btn) => (
        <button
          key={btn.id}
          onClick={() => handleAlign(btn.id as any)}
          title={btn.label}
          className="p-1 rounded text-zinc-500 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#252528] transition-colors flex items-center justify-center cursor-pointer"
        >
          {btn.icon}
        </button>
      ))}
    </div>
  );
}
