import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { 
  ChevronRight, 
  Copy, 
  ClipboardPaste, 
  CopyPlus, 
  Trash2, 
  Frame, 
  Rows, 
  PlusSquare, 
  Unlink, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Boxes 
} from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import { useProjectStore } from '../store/projectStore';
import { showToast } from '../store/toastStore';
import clsx from 'clsx';

const EMPTY_OBJECT: Record<string, any> = {};
const EMPTY_ARRAY: any[] = [];

// Helper to extract AST subtree for custom asset creation
function getSubtreeAst(nodeId: string, nodes: Record<string, any>): any {
  const node = nodes[nodeId];
  if (!node) return null;
  const children = (node.childrenIds || []).map((cId: string) => getSubtreeAst(cId, nodes)).filter(Boolean);
  return {
    ...node,
    children
  };
}

export default function CanvasContextMenu({ 
  x, 
  y, 
  nodeId, 
  onClose 
}: { 
  x: number; 
  y: number; 
  nodeId: string | null; 
  onClose: () => void; 
}) {
  const copyNode = useBuilderStore((state) => state?.copyNode);
  const pasteNode = useBuilderStore((state) => state?.pasteNode);
  const duplicateNode = useBuilderStore((state) => state?.duplicateNode);
  const deleteNode = useBuilderStore((state) => state?.deleteNode);
  const addFrame = useBuilderStore((state) => state?.addFrame);
  const addStack = useBuilderStore((state) => state?.addStack);
  const removeFrame = useBuilderStore((state) => state?.removeFrame);
  const groupSelectedNodes = useBuilderStore((state) => state?.groupSelectedNodes);
  const updateNodeProps = useBuilderStore((state) => state?.updateNodeProps);
  const updateNodeStyle = useBuilderStore((state) => state?.updateNodeStyle);
  const selectNode = useBuilderStore((state) => state?.selectNode);
  const selectedNodeIds = useBuilderStore((state) => state?.selectedNodeIds) || EMPTY_ARRAY;
  const rootNodeId = useBuilderStore((state) => state?.rootNodeId);
  const nodes = useBuilderStore((state) => state?.nodes) || EMPTY_OBJECT;
  
  const effectiveNodeId = nodeId || (selectedNodeIds.length === 1 ? selectedNodeIds[0] : null);
  const node = effectiveNodeId ? nodes[effectiveNodeId] : null;
  const isRoot = effectiveNodeId === rootNodeId;
  const isLocked = Boolean(node?.props?.locked);
  const isHidden = Boolean(node?.props?.hidden || node?.responsiveStyles?.base?.opacity === 0 || node?.responsiveStyles?.base?.visible === false);

  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: y, left: x });

  useLayoutEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let calculatedTop = y;
      if (y + rect.height > viewportHeight - 16) {
        calculatedTop = Math.max(16, viewportHeight - rect.height - 16);
      } else {
        calculatedTop = Math.max(16, y);
      }

      let calculatedLeft = Math.min(x, viewportWidth - rect.width - 16);
      calculatedLeft = Math.max(16, calculatedLeft);

      setPosition({ top: calculatedTop, left: calculatedLeft });
    }
  }, [x, y]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 20);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const MenuItem = ({ 
    icon, 
    label, 
    shortcut, 
    onClick, 
    disabled, 
    destructive 
  }: { 
    icon?: React.ReactNode; 
    label: string; 
    shortcut?: string; 
    onClick?: () => void; 
    disabled?: boolean; 
    destructive?: boolean; 
  }) => (
    <div 
      className={clsx(
        "flex items-center justify-between px-3 py-1.5 text-xs rounded transition-colors select-none",
        disabled 
          ? "opacity-40 cursor-not-allowed text-zinc-400 dark:text-zinc-600" 
          : destructive
            ? "hover:bg-red-500/10 text-red-600 dark:text-red-400 cursor-pointer"
            : "hover:bg-zinc-100 dark:hover:bg-[#282828] cursor-pointer text-zinc-800 dark:text-[#E5E5E5]"
      )}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (onClick && !disabled) {
          onClick();
          onClose();
        }
      }}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        {icon && <div className="w-3.5 h-3.5 flex items-center justify-center opacity-70 shrink-0">{icon}</div>}
        <span className="truncate">{label}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-2">
        {shortcut && (
          <span className="text-zinc-400 dark:text-[#777] text-[10px] tracking-wider font-mono">
            {shortcut}
          </span>
        )}
      </div>
    </div>
  );

  const Divider = () => <div className="h-px bg-zinc-200 dark:bg-[#333] my-1" />;

  // Quick Action Handlers
  const handleAddToAgent = () => {
    if (!effectiveNodeId || !node) return;
    useProjectStore.getState().setAiPanelOpen(true);
    selectNode(effectiveNodeId);
    showToast(`Added '${node.name}' to AI Agent context`, undefined, 'info');
  };

  const handleCreateComponent = () => {
    if (!effectiveNodeId || !node) return;
    const subtree = getSubtreeAst(effectiveNodeId, nodes);
    useProjectStore.getState().addCustomAsset(node.name || 'Component', effectiveNodeId, subtree);
    showToast(`Component '${node.name || 'Component'}' created!`, 'Saved to custom assets', 'success');
  };

  const handleToggleLock = () => {
    if (!effectiveNodeId || !node) return;
    const nextLocked = !isLocked;
    updateNodeProps(effectiveNodeId, { locked: nextLocked });
    showToast(nextLocked ? `Locked '${node.name}'` : `Unlocked '${node.name}'`, undefined, 'info');
  };

  const handleToggleHide = () => {
    if (!effectiveNodeId || !node) return;
    const nextHidden = !isHidden;
    updateNodeProps(effectiveNodeId, { hidden: nextHidden });
    updateNodeStyle(effectiveNodeId, 'base', { 
      opacity: nextHidden ? 0 : 1, 
      visible: !nextHidden 
    });
    showToast(nextHidden ? `Hidden '${node.name}'` : `Revealed '${node.name}'`, undefined, 'info');
  };

  const handleGroup = (type: 'Frame' | 'Stack') => {
    const targetIds = selectedNodeIds.length > 1 ? selectedNodeIds : (effectiveNodeId ? [effectiveNodeId] : []);
    if (targetIds.length > 0) {
      groupSelectedNodes(type, targetIds);
      showToast(`Grouped in ${type}`, undefined, 'success');
    }
  };

  const handleDelete = () => {
    if (selectedNodeIds.length > 1) {
      selectedNodeIds.forEach(id => {
        if (id !== rootNodeId) deleteNode(id);
      });
      showToast(`Deleted ${selectedNodeIds.length} items`, undefined, 'info');
    } else if (effectiveNodeId && effectiveNodeId !== rootNodeId) {
      deleteNode(effectiveNodeId);
      if (node) showToast(`Deleted '${node.name}'`, undefined, 'info');
    }
  };

  return (
    <div 
      ref={menuRef}
      className="fixed z-[99999] w-56 bg-white dark:bg-[#1A1A1A] border border-zinc-200 dark:border-[#333] rounded-lg shadow-2xl py-1.5 custom-scrollbar max-h-[85vh] overflow-y-auto select-none"
      style={{ 
        top: position.top, 
        left: position.left 
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {effectiveNodeId && node && !isRoot ? (
        <>
          {/* AI & Component Creation */}
          <MenuItem 
            icon={<Sparkles size={13} className="text-zinc-900 dark:text-white" />} 
            label="Add to AI Agent" 
            shortcut="⌘K" 
            onClick={handleAddToAgent} 
          />
          <MenuItem 
            icon={<Boxes size={13} className="text-zinc-900 dark:text-white" />} 
            label="Create Component" 
            shortcut="⌥⌘K" 
            onClick={handleCreateComponent} 
          />
          <Divider />

          {/* Clipboard & Duplication */}
          <MenuItem 
            icon={<Copy size={13} />} 
            label="Copy" 
            shortcut="⌘C" 
            onClick={() => {
              copyNode(effectiveNodeId);
              showToast(`Copied '${node.name}'`, undefined, 'info');
            }} 
          />
          <MenuItem 
            icon={<ClipboardPaste size={13} />} 
            label="Paste Inside" 
            shortcut="⌘V" 
            onClick={() => pasteNode(effectiveNodeId)} 
          />
          <MenuItem 
            icon={<CopyPlus size={13} />} 
            label="Duplicate" 
            shortcut="⌘D" 
            onClick={() => duplicateNode(effectiveNodeId)} 
          />
          <Divider />

          {/* Grouping Actions */}
          <MenuItem 
            icon={<Frame size={13} className="text-zinc-900 dark:text-white" />} 
            label="Group in Frame" 
            shortcut="F" 
            onClick={() => handleGroup('Frame')} 
          />
          <MenuItem 
            icon={<Rows size={13} className="text-zinc-900 dark:text-white" />} 
            label="Group in Stack" 
            shortcut="S" 
            onClick={() => handleGroup('Stack')} 
          />
          <MenuItem 
            icon={<PlusSquare size={13} />} 
            label="Add Child Frame" 
            shortcut="⌘↵" 
            onClick={() => addFrame(effectiveNodeId)} 
          />
          {(node.type === 'Frame' || node.type === 'Stack') && node.childrenIds?.length > 0 && (
            <MenuItem 
              icon={<Unlink size={13} />} 
              label="Remove Group (Unwrap)" 
              shortcut="⌘⌫" 
              onClick={() => removeFrame(effectiveNodeId)} 
            />
          )}
          <Divider />

          {/* Lock / Hide Toggles */}
          <MenuItem 
            icon={isLocked ? <Unlock size={13} className="text-zinc-900 dark:text-white" /> : <Lock size={13} />} 
            label={isLocked ? "Unlock Layer" : "Lock Layer"} 
            shortcut="⌘L" 
            onClick={handleToggleLock} 
          />
          <MenuItem 
            icon={isHidden ? <Eye size={13} /> : <EyeOff size={13} />} 
            label={isHidden ? "Show Layer" : "Hide Layer"} 
            shortcut="⌘;" 
            onClick={handleToggleHide} 
          />
          <Divider />

          {/* Delete */}
          <MenuItem 
            icon={<Trash2 size={13} />} 
            label={selectedNodeIds.length > 1 ? `Delete (${selectedNodeIds.length} items)` : "Delete"} 
            shortcut="⌫" 
            destructive
            onClick={handleDelete} 
          />
        </>
      ) : (
        <>
          {/* Empty canvas / Root right click */}
          <MenuItem 
            icon={<ClipboardPaste size={13} />} 
            label="Paste Here" 
            shortcut="⌘V" 
            onClick={() => pasteNode(rootNodeId)} 
          />
          <MenuItem 
            icon={<Frame size={13} className="text-zinc-900 dark:text-white" />} 
            label="Add Frame to Canvas" 
            onClick={() => addFrame(rootNodeId)} 
          />
          <MenuItem 
            icon={<Rows size={13} className="text-zinc-900 dark:text-white" />} 
            label="Add Stack to Canvas" 
            onClick={() => addStack(rootNodeId, 'column')} 
          />
        </>
      )}
    </div>
  );
}
