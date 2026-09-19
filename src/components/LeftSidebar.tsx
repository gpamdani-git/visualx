
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { 
  DndContext, 
  closestCenter,
  pointerWithin,
  KeyboardSensor, 
  PointerSensor, MouseSensor, TouchSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent, 
  DragStartEvent,
  DragMoveEvent,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  ChevronDown, 
  ChevronRight, 
  Home, 
  Search, 
  Square, 
  Type, 
  Image as ImageIcon, 
  Component, 
  Hash, 
  Sparkles, 
  Lock, 
  Box, 
  Columns, 
  Plus, 
  File, 
  Folder, 
  MoreHorizontal, 
  MousePointer2, 
  AlignLeft, 
  AlignCenter,
  AlignRight,
  AlignJustify,
  ArrowRightLeft, 
  Copy, 
  Clipboard, 
  Move, 
  CopyPlus, 
  Trash2, 
  Edit2, 
  WrapText, 
  Eye,
  EyeOff, 
  Maximize, 
  Frame, 
  Layers, 
  Columns2, 
  Grid3X3, 
  GalleryVerticalEnd, 
  Video as VideoIcon,
  Check,
  FolderPlus,
  FilePlus,
  FolderOpen,
  Globe,
  ExternalLink,
  ArrowRight,
  Wand2,
  Unlock,
  Boxes,
  Palette,
  X,
  SlidersHorizontal,
  Sun,
  Moon,
  PanelLeftClose
} from 'lucide-react';
import { getComponentsByCategory, ComponentDefinition } from '../registry/ComponentRegistry';
import { useBuilderStore } from '../store/builderStore';
import { useProjectStore } from '../store/projectStore';
import { showToast } from '../store/toastStore';
import { ProjectPage, PageFolder, ColorToken, TextToken, CustomAsset } from '../types/project';
import { isContainerType, isAtomType, isDescendant, canAcceptChild } from '../utils/dndUtils';
import FloatingStyleEditor from './FloatingStyleEditor';
import TextStyleEditor from './inspector/TextStyleEditor';
import clsx from 'clsx';
import { produce } from 'immer';

const ComponentItem = ({ comp }: { comp: ComponentDefinition }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  return (
    <div
      className="relative flex flex-col items-center justify-center p-3 gap-2 bg-zinc-50 dark:bg-[#16161A] border border-zinc-200 dark:border-[#222] hover:border-zinc-300 dark:hover:border-[#444] rounded-lg cursor-grab active:cursor-grabbing hover:bg-zinc-100 dark:hover:bg-[#1A1A1E] transition-all group"
      draggable
      onDragStart={(e) => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        setIsHovered(false);
        e.dataTransfer.setData('application/json', JSON.stringify({ type: 'hudbird-component', asset: comp.createNodeBlueprint() }));
        e.dataTransfer.effectAllowed = 'copy';
      }}
      onMouseEnter={() => {
        hoverTimeoutRef.current = setTimeout(() => setIsHovered(true), 400);
      }}
      onMouseLeave={() => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        setIsHovered(false);
      }}
    >
      <div className="text-zinc-500 dark:text-[#888]">
        {React.isValidElement(comp.icon) ? comp.icon : <div className="w-5 h-5 bg-red-500" />}
      </div>
      {(!React.isValidElement(comp.icon)) && (() => { console.error("MISSING ICON FOR:", comp.id, comp.icon); return null; })()}
      <span className="text-[10px] font-medium text-zinc-700 dark:text-[#CCC] text-center leading-tight">
        {comp.name}
      </span>

      {isHovered && (
        <div className="fixed z-[99999] p-4 bg-white dark:bg-[#111] border border-zinc-200 dark:border-[#333] rounded-xl shadow-2xl pointer-events-none flex items-center justify-center overflow-hidden" style={{ width: 400, height: 300, top: '50%', transform: 'translateY(-50%)', left: 260 }}>
           <div style={{ transform: 'scale(0.5)', width: '200%', height: '200%', transformOrigin: 'center' }} className="flex items-center justify-center pointer-events-none">
             {comp.render(comp.defaultProps || {})}
           </div>
        </div>
      )}
    </div>
  );
};

// Shared Helper for rendering Node Icon
export const renderNodeIconByType = (type?: string, isSelected: boolean = false, name: string = '') => {
  if (type === 'Stack') {
    return <Columns2 size={12} strokeWidth={2.5} className={isSelected ? "text-white" : "text-zinc-900 dark:text-white"} />;
  }
  if (type === 'Grid') {
    return <Grid3X3 size={12} strokeWidth={2.5} className={isSelected ? "text-white" : "text-zinc-900 dark:text-white"} />;
  }
  if (type === 'Masonry') {
    return <GalleryVerticalEnd size={12} strokeWidth={2.5} className={isSelected ? "text-white" : "text-zinc-900 dark:text-white"} />;
  }
  if (type === 'Frame') {
    const isSplit = (name || '').toLowerCase().includes('content');
    return isSplit ? (
      <Columns size={12} strokeWidth={2.5} className={isSelected ? "text-white" : "text-zinc-900 dark:text-white"} />
    ) : (
      <Square size={12} strokeWidth={2.5} className={isSelected ? "text-white" : "text-zinc-900 dark:text-white"} />
    );
  }
  if (type === 'Button') {
    return <Component size={12} strokeWidth={2.5} className={isSelected ? "text-white" : "text-[#9D00FF]"} />;
  }
  if (type === 'Video') {
    return <VideoIcon size={12} strokeWidth={2.5} className={isSelected ? "text-white" : "text-[#9D00FF]"} />;
  }
  if (type === 'Image') {
    return <ImageIcon size={12} strokeWidth={2.5} className={isSelected ? "text-white" : "text-zinc-900 dark:text-white"} />;
  }
  if (type === 'Text') {
    return <Type size={12} strokeWidth={2.5} className={isSelected ? "text-white" : "text-[#999]"} />;
  }
  return <Box size={12} strokeWidth={2.5} className={isSelected ? "text-white" : "text-[#999]"} />;
};

// Helper to extract AST subtree for Create Component
const getSubtreeAst = (rootId: string, allNodes: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  const collect = (id: string) => {
    const n = allNodes[id];
    if (!n) return;
    result[id] = JSON.parse(JSON.stringify(n));
    if (n.childrenIds) {
      n.childrenIds.forEach(collect);
    }
  };
  collect(rootId);
  return result;
};

// Helper for Auto Rename
const getAutoRenameName = (targetNode: any, allNodes: Record<string, any>): string => {
  if (targetNode.type === 'Text') {
    const raw = (targetNode.props?.content || '').replace(/<[^>]*>?/gm, '').trim();
    if (raw) return raw.length > 20 ? raw.slice(0, 20) + '...' : raw;
    const fs = targetNode.responsiveStyles?.base?.fontSize || 16;
    if (fs >= 32) return 'Hero Heading';
    if (fs >= 24) return 'Section Title';
    if (fs >= 18) return 'Subtitle';
    return 'Body Text';
  }
  if (targetNode.type === 'Button') {
    const t = targetNode.props?.content || targetNode.props?.text || 'Action';
    return `${t} Button`;
  }
  if (targetNode.type === 'Image') {
    return targetNode.props?.alt ? `${targetNode.props.alt} Image` : 'Asset Image';
  }
  if (targetNode.type === 'Video') {
    return 'Video Player';
  }
  if (targetNode.type === 'Icon') {
    return `${targetNode.props?.iconName || 'Icon'} Item`;
  }
  if (targetNode.type === 'Grid') {
    return `Grid Layout (${targetNode.childrenIds?.length || 0} items)`;
  }
  if (targetNode.type === 'Masonry') {
    return 'Masonry Gallery';
  }
  if (targetNode.type === 'Stack' || targetNode.type === 'Frame') {
    const children = (targetNode.childrenIds || []).map((id: string) => allNodes[id]).filter(Boolean);
    const hasImage = children.some((c: any) => c.type === 'Image');
    const hasHeading = children.some((c: any) => c.type === 'Text' && ((c.responsiveStyles?.base?.fontSize || 16) >= 24));
    const hasButton = children.some((c: any) => c.type === 'Button');
    const hasNavLinks = children.filter((c: any) => c.type === 'Text' || c.type === 'Button').length >= 3;
    const isRow = targetNode.responsiveStyles?.base?.layoutDirection === 'row';

    if (hasImage && hasHeading && hasButton) return 'Hero Card';
    if (hasImage && (hasHeading || children.length <= 3)) return 'Feature Card';
    if (hasHeading && hasButton) return 'CTA Banner';
    if (hasNavLinks && isRow) return 'Navigation Bar';
    if (isRow) return 'Horizontal Stack';
    return targetNode.type === 'Stack' ? 'Vertical Stack' : 'Content Container';
  }
  return targetNode.type || 'Layer';
};

const EMPTY_OBJECT: Record<string, any> = {};
const EMPTY_ARRAY: any[] = [];

// Layers Context Menu Component with Submenus & Smart Dynamic Viewport Bounds
const ContextMenu = ({ 
  x, 
  y, 
  nodeId, 
  onClose,
  onStartRename 
}: { 
  x: number; 
  y: number; 
  nodeId: string; 
  onClose: () => void;
  onStartRename?: (nodeId: string) => void;
}) => {
  const duplicateNode = useBuilderStore((state) => state?.duplicateNode);
  const copyNode = useBuilderStore((state) => state?.copyNode);
  const pasteNode = useBuilderStore((state) => state?.pasteNode);
  const deleteNode = useBuilderStore((state) => state?.deleteNode);
  const removeFrame = useBuilderStore((state) => state?.removeFrame);
  const groupSelectedNodes = useBuilderStore((state) => state?.groupSelectedNodes);
  const selectedNodeIds = useBuilderStore((state) => state?.selectedNodeIds) || EMPTY_ARRAY;
  const nodes = useBuilderStore((state) => state?.nodes) || EMPTY_OBJECT;
  const rootNodeId = useBuilderStore((state) => state?.rootNodeId);
  const selectNode = useBuilderStore((state) => state?.selectNode);
  const selectNodes = useBuilderStore((state) => state?.selectNodes);
  const updateNodeStyle = useBuilderStore((state) => state?.updateNodeStyle);
  const updateNodeProps = useBuilderStore((state) => state?.updateNodeProps);
  const renameNode = useBuilderStore((state) => state?.renameNode);
  const replaceNodeType = useBuilderStore((state) => state?.replaceNodeType);
  const moveNode = useBuilderStore((state) => state?.moveNode);

  const node = nodes[nodeId];
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: y, left: x });
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const submenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearSubmenuTimer = () => {
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
      submenuTimeoutRef.current = null;
    }
  };

  useLayoutEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let calculatedTop = y;
      // If menu extends beyond bottom margin (16px), anchor it upward so it never clips
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
      clearSubmenuTimer();
    };
  }, [onClose]);

  if (!node) return null;

  const MenuItem = ({ 
    icon, 
    label, 
    shortcut, 
    onClick, 
    hasSub,
    submenuKey,
    active,
    destructive
  }: { 
    icon?: React.ReactNode; 
    label: string; 
    shortcut?: string; 
    onClick?: () => void; 
    hasSub?: boolean;
    submenuKey?: string;
    active?: boolean;
    destructive?: boolean;
  }) => (
    <div 
      className={clsx(
        "relative flex items-center justify-between px-3 py-1.5 cursor-pointer text-xs rounded transition-colors select-none",
        destructive
          ? "hover:bg-red-500/10 text-red-600 dark:text-red-400"
          : active 
            ? "bg-zinc-100 dark:bg-[#2A2A2A] text-zinc-900 dark:text-white" 
            : "hover:bg-zinc-100 dark:hover:bg-[#282828] text-zinc-800 dark:text-[#E5E5E5]"
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (hasSub && submenuKey) {
          setActiveSubmenu(activeSubmenu === submenuKey ? null : submenuKey);
          return;
        }
        if (onClick) {
          onClick();
          onClose();
        }
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        {icon && <div className="w-3.5 h-3.5 flex items-center justify-center opacity-70 shrink-0">{icon}</div>}
        <span className="truncate">{label}</span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0 ml-2">
        {shortcut && <span className="text-zinc-400 dark:text-[#777] text-[10px] tracking-wider font-mono">{shortcut}</span>}
        {hasSub && <ChevronRight size={12} className="opacity-50" />}
      </div>
    </div>
  );

  const SubmenuPanel = ({ children }: { children: React.ReactNode }) => (
    <div 
      className="absolute left-[calc(100%-4px)] top-0 pl-2 z-[10000] select-none pointer-events-auto"
      onMouseEnter={() => {
        clearSubmenuTimer();
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="w-52 bg-white dark:bg-[#222] border border-zinc-200 dark:border-[#333] rounded-lg shadow-2xl py-1.5 custom-scrollbar max-h-[70vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );

  const Divider = () => <div className="h-px bg-zinc-200 dark:bg-[#333] my-1" />;

  // Handlers
  const handleAddToAgent = () => {
    useProjectStore.getState().setAiPanelOpen(true);
    selectNode(nodeId);
    showToast(`Added '${node.name}' to AI Agent`, 'Ready for AI generation & prompt context', 'info');
  };

  const handleCreateComponent = () => {
    const subtree = getSubtreeAst(nodeId, nodes);
    useProjectStore.getState().addCustomAsset(node.name || 'Component', nodeId, subtree);
    showToast(`Component '${node.name || 'Component'}' created!`, 'Saved to custom assets', 'success');
  };

  const handleAutoRename = () => {
    const newName = getAutoRenameName(node, nodes);
    renameNode(nodeId, newName);
    showToast(`Renamed to '${newName}'`, undefined, 'info');
  };

  const handleToggleLock = () => {
    const nextLocked = !node.props?.locked;
    updateNodeProps(nodeId, { locked: nextLocked });
    showToast(nextLocked ? `Locked '${node.name}'` : `Unlocked '${node.name}'`, undefined, 'info');
  };

  const isHidden = node.props?.hidden || node.responsiveStyles?.base?.opacity === 0 || node.responsiveStyles?.base?.visible === false;
  const handleToggleHide = () => {
    updateNodeStyle(nodeId, 'base', { 
      opacity: isHidden ? 1 : 0,
      visible: isHidden
    });
    updateNodeProps(nodeId, { hidden: !isHidden });
    showToast(isHidden ? `Showing '${node.name}'` : `Hidden '${node.name}'`, undefined, 'info');
  };

  const parentNode = node.parentId ? nodes[node.parentId] : null;

  return (
    <div 
      ref={menuRef}
      className="fixed z-[99999] w-56 bg-white dark:bg-[#222] border border-zinc-200 dark:border-[#333] rounded-lg shadow-2xl py-1.5 max-h-[85vh] overflow-visible custom-scrollbar select-none"
      style={{ top: position.top, left: position.left }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <MenuItem 
        icon={<Sparkles size={12} className="text-zinc-900 dark:text-white" />}
        label="Add To Agent" 
        onClick={handleAddToAgent} 
      />
      <MenuItem 
        icon={<Component size={12} />}
        label="Create Component" 
        shortcut="⌥⌘K" 
        onClick={handleCreateComponent} 
      />
      
      <Divider />

      {/* SELECT SUBMENU */}
      <div 
        className="relative"
        onMouseEnter={() => {
          clearSubmenuTimer();
          setActiveSubmenu('select');
        }}
        onMouseLeave={() => {
          clearSubmenuTimer();
          submenuTimeoutRef.current = setTimeout(() => {
            setActiveSubmenu(null);
          }, 150);
        }}
      >
        <MenuItem 
          icon={<MousePointer2 size={12} />}
          label="Select" 
          hasSub 
          submenuKey="select"
          active={activeSubmenu === 'select'}
        />
        {activeSubmenu === 'select' && (
          <SubmenuPanel>
            <MenuItem 
              label="Select Parent" 
              shortcut="⌘⇧P"
              onClick={() => {
                if (node.parentId && node.parentId !== rootNodeId) {
                  selectNode(node.parentId);
                }
              }} 
            />
            <MenuItem 
              label="Select Children" 
              shortcut="⌘⇧C"
              onClick={() => {
                if (node.childrenIds && node.childrenIds.length > 0) {
                  selectNodes(node.childrenIds);
                }
              }} 
            />
            <Divider />
            <MenuItem 
              label="Next Sibling" 
              shortcut="⌘]"
              onClick={() => {
                if (parentNode) {
                  const idx = parentNode.childrenIds.indexOf(nodeId);
                  if (idx !== -1 && idx < parentNode.childrenIds.length - 1) {
                    selectNode(parentNode.childrenIds[idx + 1]);
                  }
                }
              }} 
            />
            <MenuItem 
              label="Previous Sibling" 
              shortcut="⌘["
              onClick={() => {
                if (parentNode) {
                  const idx = parentNode.childrenIds.indexOf(nodeId);
                  if (idx > 0) {
                    selectNode(parentNode.childrenIds[idx - 1]);
                  }
                }
              }} 
            />
            <Divider />
            <MenuItem 
              label="All Siblings" 
              onClick={() => {
                if (parentNode) {
                  selectNodes(parentNode.childrenIds);
                }
              }} 
            />
          </SubmenuPanel>
        )}
      </div>

      {/* ALIGN SUBMENU */}
      <div 
        className="relative"
        onMouseEnter={() => {
          clearSubmenuTimer();
          setActiveSubmenu('align');
        }}
        onMouseLeave={() => {
          clearSubmenuTimer();
          submenuTimeoutRef.current = setTimeout(() => {
            setActiveSubmenu(null);
          }, 150);
        }}
      >
        <MenuItem 
          icon={<AlignLeft size={12} />}
          label="Align" 
          hasSub 
          submenuKey="align"
          active={activeSubmenu === 'align'}
        />
        {activeSubmenu === 'align' && (
          <SubmenuPanel>
            <MenuItem 
              label="Align Left" 
              onClick={() => updateNodeStyle(nodeId, 'base', { alignItems: 'flex-start', textAlign: 'left' })} 
            />
            <MenuItem 
              label="Align Center (H)" 
              onClick={() => updateNodeStyle(nodeId, 'base', { alignItems: 'center', textAlign: 'center' })} 
            />
            <MenuItem 
              label="Align Right" 
              onClick={() => updateNodeStyle(nodeId, 'base', { alignItems: 'flex-end', textAlign: 'right' })} 
            />
            <Divider />
            <MenuItem 
              label="Align Top" 
              onClick={() => updateNodeStyle(nodeId, 'base', { justifyContent: 'flex-start' })} 
            />
            <MenuItem 
              label="Align Center (V)" 
              onClick={() => updateNodeStyle(nodeId, 'base', { justifyContent: 'center' })} 
            />
            <MenuItem 
              label="Align Bottom" 
              onClick={() => updateNodeStyle(nodeId, 'base', { justifyContent: 'flex-end' })} 
            />
            <Divider />
            <MenuItem 
              label="Space Between" 
              onClick={() => updateNodeStyle(nodeId, 'base', { justifyContent: 'space-between' })} 
            />
          </SubmenuPanel>
        )}
      </div>

      {/* REPLACE WITH SUBMENU */}
      <div 
        className="relative"
        onMouseEnter={() => {
          clearSubmenuTimer();
          setActiveSubmenu('replace');
        }}
        onMouseLeave={() => {
          clearSubmenuTimer();
          submenuTimeoutRef.current = setTimeout(() => {
            setActiveSubmenu(null);
          }, 150);
        }}
      >
        <MenuItem 
          icon={<ArrowRightLeft size={12} />}
          label="Replace With" 
          hasSub 
          submenuKey="replace"
          active={activeSubmenu === 'replace'}
        />
        {activeSubmenu === 'replace' && (
          <SubmenuPanel>
            <MenuItem 
              icon={<Frame size={12} />}
              label="Frame" 
              onClick={() => replaceNodeType(nodeId, 'Frame')} 
            />
            <MenuItem 
              icon={<Columns2 size={12} />}
              label="Stack (Vertical)" 
              onClick={() => {
                replaceNodeType(nodeId, 'Stack');
                updateNodeStyle(nodeId, 'base', { layoutDirection: 'column' });
              }} 
            />
            <MenuItem 
              icon={<Columns size={12} />}
              label="Stack (Horizontal)" 
              onClick={() => {
                replaceNodeType(nodeId, 'Stack');
                updateNodeStyle(nodeId, 'base', { layoutDirection: 'row' });
              }} 
            />
            <MenuItem 
              icon={<Grid3X3 size={12} />}
              label="Grid" 
              onClick={() => replaceNodeType(nodeId, 'Grid')} 
            />
            <Divider />
            <MenuItem 
              icon={<Type size={12} />}
              label="Text" 
              onClick={() => replaceNodeType(nodeId, 'Text')} 
            />
            <MenuItem 
              icon={<Box size={12} />}
              label="Button" 
              onClick={() => replaceNodeType(nodeId, 'Button')} 
            />
            <MenuItem 
              icon={<ImageIcon size={12} />}
              label="Image" 
              onClick={() => replaceNodeType(nodeId, 'Image')} 
            />
            <MenuItem 
              icon={<VideoIcon size={12} />}
              label="Video" 
              onClick={() => replaceNodeType(nodeId, 'Video')} 
            />
          </SubmenuPanel>
        )}
      </div>

      <Divider />

      <MenuItem 
        icon={<Copy size={12} />} 
        label="Copy" 
        shortcut="⌘C" 
        onClick={() => {
          copyNode(nodeId);
          showToast(`Copied '${node.name}'`, undefined, 'info');
        }} 
      />
      <MenuItem 
        icon={<Clipboard size={12} />} 
        label="Paste" 
        shortcut="⌘V" 
        onClick={() => {
          const clipboardId = useBuilderStore.getState().clipboardNodeId;
          if (!clipboardId || !nodes[clipboardId]) {
            showToast('Clipboard is empty', 'Copy a layer first (⌘C)', 'info');
            return;
          }
          pasteNode(nodeId);
          showToast('Pasted layer', undefined, 'success');
        }} 
      />
      
      {/* MOVE SUBMENU */}
      <div 
        className="relative"
        onMouseEnter={() => {
          clearSubmenuTimer();
          setActiveSubmenu('move');
        }}
        onMouseLeave={() => {
          clearSubmenuTimer();
          submenuTimeoutRef.current = setTimeout(() => {
            setActiveSubmenu(null);
          }, 150);
        }}
      >
        <MenuItem 
          icon={<Move size={12} />} 
          label="Move" 
          hasSub 
          submenuKey="move"
          active={activeSubmenu === 'move'}
        />
        {activeSubmenu === 'move' && (
          <SubmenuPanel>
            <MenuItem 
              label="Move Up" 
              shortcut="⌥↑"
              onClick={() => {
                if (parentNode) {
                  const idx = parentNode.childrenIds.indexOf(nodeId);
                  if (idx > 0) {
                    moveNode(nodeId, node.parentId!, idx - 1);
                    showToast(`Moved '${node.name}' up`, undefined, 'info');
                  }
                }
              }} 
            />
            <MenuItem 
              label="Move Down" 
              shortcut="⌥↓"
              onClick={() => {
                if (parentNode) {
                  const idx = parentNode.childrenIds.indexOf(nodeId);
                  if (idx !== -1 && idx < parentNode.childrenIds.length - 1) {
                    moveNode(nodeId, node.parentId!, idx + 1);
                    showToast(`Moved '${node.name}' down`, undefined, 'info');
                  }
                }
              }} 
            />
            <Divider />
            <MenuItem 
              label="Bring to Front" 
              shortcut="⌘]"
              onClick={() => {
                if (parentNode) {
                  moveNode(nodeId, node.parentId!, parentNode.childrenIds.length);
                  showToast(`Moved '${node.name}' to front`, undefined, 'info');
                }
              }} 
            />
            <MenuItem 
              label="Send to Back" 
              shortcut="⌘["
              onClick={() => {
                if (parentNode) {
                  moveNode(nodeId, node.parentId!, 0);
                  showToast(`Moved '${node.name}' to back`, undefined, 'info');
                }
              }} 
            />
          </SubmenuPanel>
        )}
      </div>

      <MenuItem 
        icon={<CopyPlus size={12} />} 
        label="Duplicate" 
        shortcut="⌘D" 
        onClick={() => {
          duplicateNode(nodeId);
          showToast(`Duplicated '${node.name}'`, undefined, 'success');
        }} 
      />
      <MenuItem 
        icon={<Trash2 size={12} className="text-red-400" />}
        label={selectedNodeIds.length > 1 && selectedNodeIds.includes(nodeId) ? `Delete (${selectedNodeIds.length} items)` : "Delete"} 
        shortcut="⌫" 
        destructive
        onClick={() => {
          if (selectedNodeIds.length > 1 && selectedNodeIds.includes(nodeId)) {
            const count = selectedNodeIds.length;
            selectedNodeIds.forEach(id => {
              if (id !== rootNodeId) deleteNode(id);
            });
            showToast(`Deleted ${count} layers`, undefined, 'info');
          } else if (nodeId !== rootNodeId) {
            deleteNode(nodeId);
            showToast(`Deleted '${node.name}'`, undefined, 'info');
          }
        }} 
      />

      <Divider />

      <MenuItem 
        icon={<Edit2 size={12} />}
        label="Rename" 
        shortcut="⌘R" 
        onClick={() => {
          if (onStartRename) {
            onStartRename(nodeId);
          }
        }} 
      />
      <MenuItem 
        icon={<Wand2 size={12} />}
        label="Auto Rename" 
        shortcut="⌥R" 
        onClick={handleAutoRename} 
      />
      <MenuItem 
        icon={<Lock size={12} />}
        label={node.props?.locked ? "Unlock" : "Lock"} 
        shortcut="⌘L" 
        onClick={handleToggleLock} 
      />
      <MenuItem 
        icon={isHidden ? <Eye size={12} /> : <EyeOff size={12} />}
        label={isHidden ? "Show" : "Hide"} 
        shortcut="⌘;" 
        onClick={handleToggleHide} 
      />

      {/* OVERFLOW SUBMENU */}
      <div 
        className="relative"
        onMouseEnter={() => {
          clearSubmenuTimer();
          setActiveSubmenu('overflow');
        }}
        onMouseLeave={() => {
          clearSubmenuTimer();
          submenuTimeoutRef.current = setTimeout(() => {
            setActiveSubmenu(null);
          }, 150);
        }}
      >
        <MenuItem 
          icon={<Maximize size={12} />}
          label="Overflow" 
          hasSub 
          submenuKey="overflow"
          active={activeSubmenu === 'overflow'}
        />
        {activeSubmenu === 'overflow' && (
          <SubmenuPanel>
            <MenuItem 
              label="Visible" 
              onClick={() => {
                updateNodeStyle(nodeId, 'base', { overflow: 'visible' });
                showToast('Overflow set to Visible', undefined, 'info');
              }} 
            />
            <MenuItem 
              label="Hidden" 
              onClick={() => {
                updateNodeStyle(nodeId, 'base', { overflow: 'hidden' });
                showToast('Overflow set to Hidden', undefined, 'info');
              }} 
            />
            <MenuItem 
              label="Scroll" 
              onClick={() => {
                updateNodeStyle(nodeId, 'base', { overflow: 'scroll' });
                showToast('Overflow set to Scroll', undefined, 'info');
              }} 
            />
          </SubmenuPanel>
        )}
      </div>

      <Divider />

      {selectedNodeIds.length > 1 && selectedNodeIds.includes(nodeId) ? (
        <>
          <MenuItem 
            icon={<Frame size={12} className="text-zinc-900 dark:text-white" />}
            label="Group in Frame" 
            shortcut="F" 
            onClick={() => {
              groupSelectedNodes('Frame', selectedNodeIds);
              showToast('Grouped in Frame', undefined, 'success');
            }} 
          />
          <MenuItem 
            icon={<Columns2 size={12} className="text-zinc-900 dark:text-white" />}
            label="Group in Stack" 
            shortcut="S" 
            onClick={() => {
              groupSelectedNodes('Stack', selectedNodeIds);
              showToast('Grouped in Stack', undefined, 'success');
            }} 
          />
        </>
      ) : (
        <>
          <MenuItem 
            icon={<Frame size={12} className="text-zinc-900 dark:text-white" />}
            label="Add to Frame" 
            shortcut="⌘↵" 
            onClick={() => {
              groupSelectedNodes('Frame', [nodeId]);
              showToast('Added to Frame', undefined, 'success');
            }} 
          />
          <MenuItem 
            icon={<Columns2 size={12} className="text-zinc-900 dark:text-white" />}
            label="Add to Stack" 
            shortcut="⌥⌘↵" 
            onClick={() => {
              groupSelectedNodes('Stack', [nodeId]);
              showToast('Added to Stack', undefined, 'success');
            }} 
          />
          <MenuItem 
            label="Remove Group" 
            shortcut="⌘⌫" 
            onClick={() => {
              removeFrame(nodeId);
              showToast('Ungrouped', undefined, 'info');
            }} 
          />
        </>
      )}
    </div>
  );
};

// Page Item Context Menu Component
const PageContextMenu = ({
  x,
  y,
  page,
  pageFolders,
  canDelete,
  onClose,
  onSetHome,
  onDuplicate,
  onRename,
  onToggleDraft,
  onMoveToFolder,
  onDelete
}: {
  x: number;
  y: number;
  page: ProjectPage;
  pageFolders: PageFolder[];
  canDelete: boolean;
  onClose: () => void;
  onSetHome: () => void;
  onDuplicate: () => void;
  onRename: () => void;
  onToggleDraft: () => void;
  onMoveToFolder: (folderId: string | null) => void;
  onDelete: () => void;
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showFolderSubmenu, setShowFolderSubmenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-[99999] w-52 bg-white dark:bg-[#222] border border-zinc-200 dark:border-[#333] rounded-lg shadow-2xl py-1.5 select-none max-h-[85vh] overflow-y-auto custom-scrollbar"
      style={{ top: Math.max(10, Math.min(y, window.innerHeight - 340)), left: Math.max(10, Math.min(x, window.innerWidth - 240)) }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {!page.isHome && (
        <button
          onClick={() => { onSetHome(); onClose(); }}
          className="flex items-center justify-between w-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#333] text-zinc-800 dark:text-[#E5E5E5] text-xs"
        >
          <div className="flex items-center gap-2">
            <Home size={13} className="text-zinc-500 dark:text-[#888]" />
            <span>Set as Home Page</span>
          </div>
        </button>
      )}

      <button
        onClick={() => { onDuplicate(); onClose(); }}
        className="flex items-center justify-between w-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#333] text-zinc-800 dark:text-[#E5E5E5] text-xs"
      >
        <div className="flex items-center gap-2">
          <Copy size={13} className="text-zinc-500 dark:text-[#888]" />
          <span>Duplicate Page</span>
        </div>
        <span className="text-zinc-500 dark:text-[#888] text-[10px] font-mono">⌘D</span>
      </button>

      <button
        onClick={() => { onRename(); onClose(); }}
        className="flex items-center justify-between w-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#333] text-zinc-800 dark:text-[#E5E5E5] text-xs"
      >
        <div className="flex items-center gap-2">
          <Edit2 size={13} className="text-zinc-500 dark:text-[#888]" />
          <span>Rename</span>
        </div>
        <span className="text-zinc-500 dark:text-[#888] text-[10px] font-mono">⌘R</span>
      </button>

      <button
        onClick={() => { onToggleDraft(); onClose(); }}
        className="flex items-center justify-between w-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#333] text-zinc-800 dark:text-[#E5E5E5] text-xs"
      >
        <div className="flex items-center gap-2">
          <EyeOff size={13} className="text-zinc-500 dark:text-[#888]" />
          <span>{page.isDraft ? 'Set to Published' : 'Set to Draft'}</span>
        </div>
      </button>

      {/* Move to Folder Submenu */}
      <div 
        className="relative"
        onMouseEnter={() => setShowFolderSubmenu(true)}
        onMouseLeave={() => setShowFolderSubmenu(false)}
      >
        <div className="flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#333] text-zinc-800 dark:text-[#E5E5E5] text-xs cursor-pointer">
          <div className="flex items-center gap-2">
            <Folder size={13} className="text-zinc-500 dark:text-[#888]" />
            <span>Move to Folder</span>
          </div>
          <ChevronRight size={12} className="text-zinc-500 dark:text-[#888]" />
        </div>

        {showFolderSubmenu && (
          <div className="absolute left-full top-0 ml-1 w-44 bg-white dark:bg-[#1E1E1E] border border-zinc-200 dark:border-[#333] rounded-lg shadow-2xl py-1 z-50">
            <button
              onClick={() => { onMoveToFolder(null); onClose(); }}
              className="flex items-center justify-between w-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#333] text-zinc-800 dark:text-[#E5E5E5] text-xs"
            >
              <span>Root (No Folder)</span>
              {!page.folderId && <Check size={12} className="text-zinc-900 dark:text-white" />}
            </button>
            {pageFolders.map(folder => (
              <button
                key={folder.id}
                onClick={() => { onMoveToFolder(folder.id); onClose(); }}
                className="flex items-center justify-between w-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#333] text-zinc-800 dark:text-[#E5E5E5] text-xs"
              >
                <span className="truncate">{folder.name}</span>
                {page.folderId === folder.id && <Check size={12} className="text-zinc-900 dark:text-white" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-px bg-zinc-200 dark:bg-[#333] my-1" />

      <button
        disabled={!canDelete}
        onClick={() => { if (canDelete) { onDelete(); onClose(); } }}
        className={clsx(
          "flex items-center justify-between w-full px-3 py-1.5 text-xs text-left",
          canDelete ? "hover:bg-red-500/10 text-red-500 cursor-pointer" : "text-zinc-400 dark:text-[#555] cursor-not-allowed"
        )}
      >
        <div className="flex items-center gap-2">
          <Trash2 size={13} />
          <span>Delete Page</span>
        </div>
        <span className="text-[10px] font-mono">⌫</span>
      </button>
    </div>
  );
};

// Folder Item Context Menu Component
const FolderContextMenu = ({
  x,
  y,
  folder,
  onClose,
  onNewPageInside,
  onRename,
  onDelete
}: {
  x: number;
  y: number;
  folder: PageFolder;
  onClose: () => void;
  onNewPageInside: () => void;
  onRename: () => void;
  onDelete: () => void;
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-[99999] w-48 bg-white dark:bg-[#222] border border-zinc-200 dark:border-[#333] rounded-lg shadow-2xl py-1.5 select-none max-h-[85vh] overflow-y-auto custom-scrollbar"
      style={{ top: Math.max(10, Math.min(y, window.innerHeight - 220)), left: Math.max(10, Math.min(x, window.innerWidth - 200)) }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <button
        onPointerDown={(e) => { e.stopPropagation(); onNewPageInside(); onClose(); }}
        className="flex items-center justify-between w-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#333] text-zinc-800 dark:text-[#E5E5E5] text-xs"
      >
        <div className="flex items-center gap-2">
          <FilePlus size={13} className="text-zinc-500 dark:text-[#888]" />
          <span>New Page in Folder</span>
        </div>
      </button>

      <button
        onPointerDown={(e) => { e.stopPropagation(); onRename(); onClose(); }}
        className="flex items-center justify-between w-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#333] text-zinc-800 dark:text-[#E5E5E5] text-xs"
      >
        <div className="flex items-center gap-2">
          <Edit2 size={13} className="text-zinc-500 dark:text-[#888]" />
          <span>Rename Folder</span>
        </div>
      </button>

      <div className="h-px bg-zinc-200 dark:bg-[#333] my-1" />

      <button
        onPointerDown={(e) => { e.stopPropagation(); onDelete(); onClose(); }}
        className="flex items-center justify-between w-full px-3 py-1.5 hover:bg-red-500/10 text-red-500 text-xs text-left"
      >
        <div className="flex items-center gap-2">
          <Trash2 size={13} />
          <span>Delete Folder</span>
        </div>
      </button>
    </div>
  );
};

const doesNodeOrDescendantMatch = (nodes: Record<string, any>, id: string, query: string): boolean => {
  if (!query) return true;
  const node = nodes[id];
  if (!node) return false;
  if ((node.name || node.type || '').toLowerCase().includes(query.toLowerCase())) return true;
  if (node.childrenIds) {
    for (const childId of node.childrenIds) {
      if (doesNodeOrDescendantMatch(nodes, childId, query)) {
        return true;
      }
    }
  }
  return false;
};

// Hook to check if a node is in the path to the currently selected node
const useIsNodeInSelectionPath = (nodeId: string) => {
  const selectedNodeId = useBuilderStore((state) => state?.selectedNodeId);
  const nodes = useBuilderStore((state) => state?.nodes) || {};
  if (!selectedNodeId) return false;
  if (selectedNodeId === nodeId) return true;
  
  let currentId: string | null = selectedNodeId;
  while (currentId) {
    if (currentId === nodeId) return true;
    currentId = nodes[currentId]?.parentId || null;
  }
  return false;
};

interface LeftSidebarDropTarget {
  targetId: string;
  position: 'before' | 'after' | 'inside';
  targetParentId: string;
  targetIndex: number;
  depth: number;
}

interface LeftSidebarDragContextType {
  activeDragId: string | null;
  projectedDrop: LeftSidebarDropTarget | null;
}

const LeftSidebarDragContext = React.createContext<LeftSidebarDragContextType>({
  activeDragId: null,
  projectedDrop: null,
});

const SortableNode: React.FC<{ 
  id: string; 
  depth: number; 
  activeDragId: string | null;
  onContextMenu: (e: React.MouseEvent, id: string) => void;
  searchQuery?: string;
  editingNodeId?: string | null;
  onStartRename?: (id: string | null) => void;
}> = ({ id, depth, activeDragId, onContextMenu, searchQuery, editingNodeId, onStartRename }) => {
  const nodes = useBuilderStore((state) => state?.nodes) || {};
  const rootNodeId = useBuilderStore((state) => state?.rootNodeId);
  const selectedNodeId = useBuilderStore((state) => state?.selectedNodeId);
  const selectedNodeIds = useBuilderStore((state) => state?.selectedNodeIds) || [];
  const selectNode = useBuilderStore((state) => state?.selectNode);
  const renameNode = useBuilderStore((state) => state?.renameNode);
  const deleteNode = useBuilderStore((state) => state?.deleteNode);
  const updateNodeProps = useBuilderStore((state) => state?.updateNodeProps);
  const updateNodeStyle = useBuilderStore((state) => state?.updateNodeStyle);
  const node = nodes[id];
  const isLocked = Boolean(node?.props?.locked);
  const isHidden = Boolean(node?.props?.hidden || node?.responsiveStyles?.base?.opacity === 0 || node?.responsiveStyles?.base?.visible === false);
  const [localEditing, setLocalEditing] = useState(false);
  const isEditing = (editingNodeId === id) || localEditing;
  const [editValue, setEditValue] = useState(node?.name || '');
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (node?.name) {
      setEditValue(node.name);
    }
  }, [node?.name]);

  useEffect(() => {
    if (editingNodeId === id && node?.name) {
      setEditValue(node.name);
    }
  }, [editingNodeId, id, node?.name]);

  // Drag Context for Figma-like insertion indicators
  const { activeDragId: ctxActiveDragId, projectedDrop } = React.useContext(LeftSidebarDragContext);
  const effectiveActiveDragId = activeDragId || ctxActiveDragId;
  const isTargeted = projectedDrop?.targetId === id;
  const isDropBefore = isTargeted && projectedDrop?.position === 'before';
  const isDropAfter = isTargeted && projectedDrop?.position === 'after';
  const isDropInside = isTargeted && projectedDrop?.position === 'inside';
  
  // Auto-reveal: Expand if a descendant is selected, but only when selection changes
  const isInPath = useIsNodeInSelectionPath(id);
  const prevSelectedNodeId = useRef(selectedNodeId);
  useEffect(() => {
    if (selectedNodeId !== prevSelectedNodeId.current) {
      if (isInPath && !isExpanded) {
        setIsExpanded(true);
      }
      prevSelectedNodeId.current = selectedNodeId;
    }
  }, [selectedNodeId, isInPath, isExpanded]);

  const isSelected = selectedNodeIds.includes(id) || selectedNodeId === id;
  const isAtomic = isAtomType(node?.type);
  const isContainer = isContainerType(node?.type);
  const hasChildren = !isAtomic && node?.childrenIds && node.childrenIds.length > 0;

  // Search logic
  const descendantMatchesSearch = searchQuery ? node?.childrenIds?.some(childId => doesNodeOrDescendantMatch(nodes, childId, searchQuery)) : false;
  const nodeMatchesSearch = (node?.name || node?.type || '').toLowerCase().includes((searchQuery || '').toLowerCase());
  const shouldShow = !searchQuery || nodeMatchesSearch || descendantMatchesSearch;

  // Auto-expand if a descendant matches the search
  useEffect(() => {
    if (searchQuery && descendantMatchesSearch && !isExpanded) {
      setIsExpanded(true);
    }
  }, [searchQuery, descendantMatchesSearch, isExpanded]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ 
    id,
    disabled: isLocked,
    data: {
      id,
      type: node?.type,
      isContainer
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1
  };

  if (!node || !shouldShow) return null;

  // Drop validation rules:
  const isSelf = activeDragId === id;
  const isInvalid = Boolean(
    activeDragId &&
    !isSelf &&
    isDescendant(nodes, id, activeDragId)
  );

  const canDropHereAsChild = Boolean(
    activeDragId &&
    !isSelf &&
    !isInvalid &&
    canAcceptChild(nodes, id, activeDragId, rootNodeId)
  );

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={clsx(
        "relative transition-all duration-150",
        isDragging && "opacity-40"
      )}
    >
      {/* Figma Sibling Insertion Line: BEFORE (Parallel line with circle indicator at exact indent depth) */}
      {isDropBefore && (
        <div 
          className="absolute -top-[1.5px] left-0 right-0 h-[2px] bg-[#0099FF] z-50 pointer-events-none shadow-[0_0_8px_#0099FF]"
          style={{ marginLeft: `${depth * 12 + 4}px` }}
        >
          <div className="absolute -left-1.5 -top-[3px] w-2 h-2 rounded-full bg-[#0099FF] border border-white shadow-[0_0_4px_#0099FF]" />
        </div>
      )}

      {/* Wrapper for indentation so background doesn't stretch to the left edge */}
      <div style={{ paddingLeft: `${depth * 12 + 4}px` }} className="pr-2 py-[1px]">
        <div 
          className={clsx(
            "flex items-center justify-between h-7 px-1.5 cursor-pointer text-xs select-none group transition-colors rounded-md relative",
            isSelected ? "bg-[#0099FF] text-white" : "hover:bg-zinc-200/60 dark:hover:bg-[#2A2A2A] text-zinc-600 dark:text-[#A0A0A0]",
            isDropInside && "bg-[#0099FF]/25 ring-2 ring-[#0099FF] text-white shadow-[0_0_12px_rgba(0,153,255,0.35)]",
            !isDropInside && isOver && canDropHereAsChild && "bg-[#0099FF]/15 ring-1 ring-[#0099FF] text-white",
            isOver && isInvalid && "bg-red-500/15 ring-1 ring-red-500/40 text-red-400 dark:text-red-300"
          )}
          onClick={(e) => {
            e.stopPropagation();
            selectNode(id, e.shiftKey || e.metaKey);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            onContextMenu(e, id);
          }}
        >
          <div className="flex items-center gap-1 overflow-hidden flex-1">
            {/* Toggle Arrow */}
            <div 
              className={clsx(
                "w-4 h-4 flex items-center justify-center rounded hover:bg-zinc-200 dark:hover:bg-black/20 transition-colors shrink-0", 
                !hasChildren && "invisible"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </div>
            
            {/* Type Icon */}
            <div className="flex items-center justify-center w-4 h-4 shrink-0">
              {renderNodeIconByType(node.type, isSelected, node.name)}
            </div>
            
            {/* Label */}
            {isEditing && !isLocked ? (
              <input
                type="text"
                className="bg-transparent border-none outline-none font-medium truncate ml-1 text-zinc-900 dark:text-white w-full"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                autoFocus
                onBlur={() => {
                  setLocalEditing(false);
                  if (onStartRename) onStartRename(null);
                  if (editValue.trim() && editValue !== node.name) {
                    renameNode(id, editValue.trim());
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setLocalEditing(false);
                    if (onStartRename) onStartRename(null);
                    if (editValue.trim() && editValue !== node.name) {
                      renameNode(id, editValue.trim());
                    }
                  }
                  if (e.key === 'Escape') {
                    setLocalEditing(false);
                    if (onStartRename) onStartRename(null);
                    setEditValue(node.name);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span 
                className={clsx(
                  "font-medium truncate ml-1 transition-colors", 
                  isSelected ? "text-white" : "text-zinc-700 dark:text-[#CCC] group-hover:text-zinc-900 dark:group-hover:text-white",
                  isHidden && "opacity-45 line-through decoration-zinc-400 dark:decoration-zinc-500 italic",
                  isLocked && "cursor-not-allowed"
                )}
                onDoubleClick={(e) => {
                  if (isLocked) return;
                  e.stopPropagation();
                  setEditValue(node.name);
                  setLocalEditing(true);
                  if (onStartRename) onStartRename(id);
                }}
              >
                {node.name}
              </span>
            )}
          </div>

          {/* Drop indicator label if hovering container */}
          {isDropInside ? (
            <span className="text-[9px] font-semibold text-zinc-900 dark:text-white bg-[#0099FF]/20 px-1.5 py-0.5 rounded border border-[#0099FF]/40 animate-pulse mr-1 shrink-0 flex items-center gap-1">
              <span>↳</span> <span>Into</span>
            </span>
          ) : isOver && canDropHereAsChild ? (
            <span className="text-[9px] font-semibold text-zinc-900 dark:text-white bg-[#0099FF]/20 px-1 py-0.5 rounded border border-[#0099FF]/40 animate-pulse mr-1 shrink-0">
              ↳ Into
            </span>
          ) : null}

          {/* Trailing Icons & Quick Actions (Lock, Eye, Delete) */}
          <div className={clsx("flex items-center gap-1 shrink-0", isSelected ? "opacity-100" : "opacity-70 group-hover:opacity-100")}>
            {/* Lock/Unlock Toggle Indicator */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const nextLocked = !isLocked;
                updateNodeProps(id, { locked: nextLocked });
                showToast(nextLocked ? `Locked '${node.name}'` : `Unlocked '${node.name}'`, undefined, 'info');
              }}
              className={clsx(
                "p-0.5 rounded transition-all cursor-pointer",
                isLocked 
                  ? "opacity-100 text-zinc-900 dark:text-white hover:text-zinc-900 dark:text-white" 
                  : "opacity-0 group-hover:opacity-70 hover:!opacity-100 text-zinc-400 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white"
              )}
              title={isLocked ? "Unlock layer" : "Lock layer"}
            >
              {isLocked ? <Lock size={11} className="text-zinc-900 dark:text-white" /> : <Unlock size={11} />}
            </button>

            {/* Visibility Toggle Indicator */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateNodeStyle(id, 'base', { 
                  opacity: isHidden ? 1 : 0,
                  visible: isHidden
                });
                updateNodeProps(id, { hidden: !isHidden });
                showToast(isHidden ? `Showing '${node.name}'` : `Hidden '${node.name}'`, undefined, 'info');
              }}
              className={clsx(
                "p-0.5 rounded transition-all cursor-pointer",
                isHidden 
                  ? "opacity-100 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white" 
                  : "opacity-0 group-hover:opacity-70 hover:!opacity-100 text-zinc-400 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white"
              )}
              title={isHidden ? "Show layer" : "Hide layer"}
            >
              {isHidden ? <EyeOff size={11} /> : <Eye size={11} />}
            </button>

            {/* Delete button on hover */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNode(id);
              }}
              className="opacity-0 group-hover:opacity-70 hover:!opacity-100 p-0.5 rounded hover:bg-red-500/20 text-zinc-400 dark:text-[#777] hover:text-red-400 transition-all cursor-pointer"
              title="Delete layer (⌫)"
            >
              <Trash2 size={11} />
            </button>
          </div>
        </div>
      </div>

      {/* Figma Sibling Insertion Line: AFTER (Parallel line with circle indicator at exact indent depth) */}
      {isDropAfter && (
        <div 
          className="absolute -bottom-[1.5px] left-0 right-0 h-[2px] bg-[#0099FF] z-50 pointer-events-none shadow-[0_0_8px_#0099FF]"
          style={{ marginLeft: `${depth * 12 + 4}px` }}
        >
          <div className="absolute -left-1.5 -top-[3px] w-2 h-2 rounded-full bg-[#0099FF] border border-white shadow-[0_0_4px_#0099FF]" />
        </div>
      )}
      
      {isExpanded && hasChildren && (
        <SortableContext items={Array.from(new Set(node.childrenIds))} strategy={verticalListSortingStrategy}>
          <div>
            {Array.from(new Set(node.childrenIds)).map(childId => (
              <SortableNode 
                key={childId} 
                id={childId} 
                depth={depth + 1} 
                activeDragId={activeDragId}
                onContextMenu={onContextMenu} 
                searchQuery={searchQuery}
                editingNodeId={editingNodeId}
                onStartRename={onStartRename}
              />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
};

export default function LeftSidebar() {
  const nodes = useBuilderStore((state) => state?.nodes) || {};
  const rootNodeId = useBuilderStore((state) => state?.rootNodeId);
  const rootNode = rootNodeId ? nodes[rootNodeId] : undefined;
  const selectedNodeId = useBuilderStore(state => state?.selectedNodeId);
  const addNavigationTemplate = useBuilderStore(state => state?.addNavigationTemplate);
  const [expandedBp, setExpandedBp] = useState<string>('lg');
  const activeBreakpoint = useBuilderStore(state => state?.activeBreakpoint ?? 'lg');
  const selectNode = useBuilderStore(state => state?.selectNode);
  
  const activeProjectId = useProjectStore((state) => state?.activeProjectId);
  const projects = useProjectStore((state) => state?.projects) || [];
  const setActivePage = useProjectStore((state) => state?.setActivePage);
  const addPage = useProjectStore((state) => state?.addPage);
  const duplicatePage = useProjectStore((state) => state?.duplicatePage);
  const deletePage = useProjectStore((state) => state?.deletePage);
  const renamePage = useProjectStore((state) => state?.renamePage);
  const setHomePage = useProjectStore((state) => state?.setHomePage);
  const togglePageDraft = useProjectStore((state) => state?.togglePageDraft);
  const addPageFolder = useProjectStore((state) => state?.addPageFolder);
  const renamePageFolder = useProjectStore((state) => state?.renamePageFolder);
  const deletePageFolder = useProjectStore((state) => state?.deletePageFolder);
  const togglePageFolderExpanded = useProjectStore((state) => state?.togglePageFolderExpanded);
  const movePageToFolder = useProjectStore((state) => state?.movePageToFolder);

  const addColorToken = useProjectStore((state) => state?.addColorToken);
  const updateColorToken = useProjectStore((state) => state?.updateColorToken);
  const deleteColorToken = useProjectStore((state) => state?.deleteColorToken);
  const addTextToken = useProjectStore((state) => state?.addTextToken);
  const updateTextToken = useProjectStore((state) => state?.updateTextToken);
  const deleteTextToken = useProjectStore((state) => state?.deleteTextToken);
  const deleteCustomAsset = useProjectStore((state) => state?.deleteCustomAsset);

  const currentProject = projects.find(p => p.id === activeProjectId);
  const pages = currentProject?.pages || [];
  const customAssets = currentProject?.customAssets || [];
  const colorTokens = currentProject?.colorTokens || [];
  const textTokens = currentProject?.textTokens || [];
  const pageFolders = currentProject?.pageFolders || [];
  const activePageId = currentProject?.activePageId || (pages[0]?.id ?? '');
  const activePage = pages.find(p => p.id === activePageId) || pages[0];

  const [activeTab, setActiveTab] = useState<'pages' | 'layers' | 'assets'>('pages');
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, nodeId: string } | null>(null);
  
  // Pages Plus Menu Dropdown State (Gambar 3)
  const [pagePlusMenuOpen, setPagePlusMenuOpen] = useState(false);
  const pagePlusMenuRef = useRef<HTMLDivElement>(null);

  // Page Context Menu State (Gambar 8)
  const [pageContextMenu, setPageContextMenu] = useState<{ x: number, y: number, page: ProjectPage } | null>(null);

  // Folder Context Menu State (Gambar 7)
  const [folderContextMenu, setFolderContextMenu] = useState<{ x: number, y: number, folder: PageFolder } | null>(null);

  // Inline Rename Editing State for Page or Folder (Gambar 4 & 5)
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [pageEditName, setPageEditName] = useState('');
  
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [folderEditName, setFolderEditName] = useState('');

  // Inline Rename Editing State for Layers
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  // Search Filter for Pages, Layers & Assets
  const [searchQuery, setSearchQuery] = useState('');

  // Style Management States
  const [expandedStyleFolders, setExpandedStyleFolders] = useState<Set<string>>(
    new Set(['Brand', 'Brand/Success', 'Brand/Dark Mode', 'Grayscale', 'Color', 'Text'])
  );
  const [editingColorToken, setEditingColorToken] = useState<ColorToken | null>(null);
  const [editingTextToken, setEditingTextToken] = useState<TextToken | null>(null);
  const [floatingEditorPos, setFloatingEditorPos] = useState<{ top: number; left: number }>({ top: 120, left: 245 });
  
  const [styleContextMenu, setStyleContextMenu] = useState<{ x: number; y: number; token: ColorToken } | null>(null);
  const [textStyleContextMenu, setTextStyleContextMenu] = useState<{ x: number; y: number; token: TextToken } | null>(null);
  const [showAddTextMenu, setShowAddTextMenu] = useState<{ top: number; left: number } | null>(null);
  
  const [isAddingStyleModalOpen, setIsAddingStyleModalOpen] = useState(false);
  const [newStyleInputName, setNewStyleInputName] = useState('');
  const [newStyleInputColor, setNewStyleInputColor] = useState('#0099FF');
  
  const [editingTextTokenId, setEditingTextTokenId] = useState<string | null>(null);
  const [textEditName, setTextEditName] = useState('');
  const styleMenuRef = useRef<HTMLDivElement>(null);

  // Close context menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (styleMenuRef.current && !styleMenuRef.current.contains(e.target as Node)) {
        setStyleContextMenu(null);
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Insert Custom Asset to Canvas
  const handleInsertCustomAsset = (asset: CustomAsset) => {
    if (!asset || !asset.nodeData) return;
    const store = useBuilderStore.getState();
    const rootId = store.rootNodeId;
    const targetParentId = (store.selectedNodeId && store.selectedNodeId !== rootId)
      ? (isContainerType(store.nodes[store.selectedNodeId]?.type) ? store.selectedNodeId : (store.nodes[store.selectedNodeId]?.parentId || rootId))
      : rootId;

    function cloneSubtree(currNode: any, parentId: string): string {
      const freshId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const childIds: string[] = [];
      if (currNode.children && Array.isArray(currNode.children)) {
        currNode.children.forEach((c: any) => {
          childIds.push(cloneSubtree(c, freshId));
        });
      }
      const freshNode = {
        id: freshId,
        name: currNode.name || 'Component',
        type: currNode.type || 'Frame',
        parentId,
        childrenIds: childIds,
        props: { ...currNode.props },
        responsiveStyles: JSON.parse(JSON.stringify(currNode.responsiveStyles || { base: {} }))
      };
      useBuilderStore.setState(produce((state: any) => {
        state.nodes[freshId] = freshNode;
        const parent = state.nodes[parentId];
        if (parent) {
          if (!parent.childrenIds) parent.childrenIds = [];
          parent.childrenIds.push(freshId);
        }
      }));
      return freshId;
    }

    const newTopId = cloneSubtree(asset.nodeData, targetParentId);
    store.selectNode(newTopId);
    showToast(`Inserted component '${asset.name}'`, undefined, 'success');
  };

  // Find Style usages in canvas
  const handleFindInCanvas = (token: ColorToken) => {
    const store = useBuilderStore.getState();
    const allNodes = store.nodes;
    const matchedIds: string[] = [];
    const tokenHex = (token.lightValue || '').toLowerCase();
    const tokenDarkHex = (token.darkValue || '').toLowerCase();

    Object.values(allNodes).forEach((n: any) => {
      if (n.id === store.rootNodeId) return;
      const bg = (n.responsiveStyles?.base?.backgroundColor || '').toLowerCase();
      const col = (n.responsiveStyles?.base?.color || '').toLowerCase();
      const borderCol = (n.responsiveStyles?.base?.borderColor || '').toLowerCase();
      if (
        (tokenHex && (bg.includes(tokenHex) || col.includes(tokenHex) || borderCol.includes(tokenHex))) ||
        (tokenDarkHex && (bg.includes(tokenDarkHex) || col.includes(tokenDarkHex) || borderCol.includes(tokenDarkHex)))
      ) {
        matchedIds.push(n.id);
      }
    });

    if (matchedIds.length > 0) {
      store.selectNodes(matchedIds);
      showToast(`Found and selected ${matchedIds.length} layer(s) using '${token.name}'`, undefined, 'success');
    } else {
      showToast(`No layers currently using '${token.name}'`, undefined, 'info');
    }
  };

  // Duplicate style token
  const handleDuplicateStyle = (token: ColorToken) => {
    const newName = `${token.name} Copy`;
    addColorToken({
      name: newName,
      lightValue: token.lightValue,
      darkValue: token.darkValue,
      type: token.type || 'solid'
    });
    showToast(`Duplicated style '${newName}'`, undefined, 'success');
  };

  // Confirm Add Style
  
  const handleAddTextToken = (type: string) => {
    let newName = type;
    let counter = 1;
    while (textTokens.some(t => t.name === newName)) {
      newName = `${type} ${counter}`;
      counter++;
    }

    const defaultProps: any = {
      name: newName,
      fontFamily: 'Inter, sans-serif',
      color: '#000000',
      textAlign: 'left',
      letterSpacing: 0
    };

    switch (type) {
      case 'Heading 1': defaultProps.fontSize = 48; defaultProps.fontWeight = 700; defaultProps.lineHeight = '1.2'; break;
      case 'Heading 2': defaultProps.fontSize = 36; defaultProps.fontWeight = 700; defaultProps.lineHeight = '1.3'; break;
      case 'Heading 3': defaultProps.fontSize = 24; defaultProps.fontWeight = 600; defaultProps.lineHeight = '1.4'; break;
      case 'Heading 4': defaultProps.fontSize = 20; defaultProps.fontWeight = 600; defaultProps.lineHeight = '1.4'; break;
      case 'Heading 5': defaultProps.fontSize = 18; defaultProps.fontWeight = 600; defaultProps.lineHeight = '1.5'; break;
      case 'Heading 6': defaultProps.fontSize = 16; defaultProps.fontWeight = 600; defaultProps.lineHeight = '1.5'; break;
      case 'Paragraph': defaultProps.fontSize = 16; defaultProps.fontWeight = 400; defaultProps.lineHeight = '1.6'; break;
    }
    
    addTextToken(defaultProps);
    setShowAddTextMenu(null);
  };

  const handleConfirmAddStyle = () => {
    const name = newStyleInputName.trim() || 'New Style';
    const newId = addColorToken({
      name,
      lightValue: newStyleInputColor || '#0099FF',
      darkValue: newStyleInputColor || '#0099FF',
      type: 'solid'
    });
    const createdToken: ColorToken = {
      id: newId,
      name,
      lightValue: newStyleInputColor || '#0099FF',
      darkValue: newStyleInputColor || '#0099FF',
      type: 'solid'
    };
    setIsAddingStyleModalOpen(false);
    setNewStyleInputName('');
    setFloatingEditorPos({ top: 180, left: 245 });
    setEditingColorToken(createdToken);
    showToast(`Created style '${name}'`, undefined, 'success');
  };
  const renderLayerTree = () => (
    <div className="pl-2">
      <LeftSidebarDragContext.Provider value={{ activeDragId, projectedDrop }}>
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragCancel={handleDragCancel}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={Array.from(new Set(rootNode?.childrenIds || []))}
            strategy={verticalListSortingStrategy}
          >
            {rootNode?.childrenIds && rootNode.childrenIds.length > 0 ? (
              Array.from(new Set(rootNode.childrenIds)).map((childId) => (
                <SortableNode 
                  key={childId} 
                  id={childId} 
                  depth={1} 
                  activeDragId={activeDragId}
                  onContextMenu={handleContextMenu} 
                  searchQuery={searchQuery}
                  editingNodeId={editingNodeId}
                  onStartRename={setEditingNodeId}
                />
              ))
            ) : (
              <div className="py-2 pl-6 text-[#555] text-[11px] italic">
                No layers on this page
              </div>
            )}
          </SortableContext>
          <DragOverlay>
            {activeDragNode ? (
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[#1F1F24] border border-[#0099FF] text-white text-xs rounded shadow-2xl backdrop-blur-md opacity-95 pointer-events-none">
                <div className="w-4 h-4 flex items-center justify-center">
                  {renderNodeIconByType(activeDragNode.type, true, activeDragNode.name)}
                </div>
                <span className="font-semibold text-xs text-white truncate max-w-[120px]">{activeDragNode.name}</span>
                <span className="text-[10px] text-zinc-900 dark:text-white bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono">
                  {activeDragNode.type}
                </span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </LeftSidebarDragContext.Provider>
    </div>
  );


  // Close plus menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pagePlusMenuRef.current && !pagePlusMenuRef.current.contains(e.target as Node)) {
        setPagePlusMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [projectedDrop, setProjectedDrop] = useState<LeftSidebarDropTarget | null>(null);
  const activeDragNode = activeDragId ? nodes[activeDragId] : null;

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 }
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = event.active.id as string;
    setActiveDragId(activeId);
    
    // If a node is selected, select all its children as well
    const state = useBuilderStore.getState();
    const node = state.nodes[activeId];
    if (node && node.childrenIds && node.childrenIds.length > 0) {
      state.selectNodes([activeId, ...node.childrenIds]);
    } else {
      state.selectNode(activeId);
    }
  };

  const handleDragCancel = () => {
    setActiveDragId(null);
    setProjectedDrop(null);
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over, delta } = event;
    if (!over || active.id === over.id) {
      setProjectedDrop(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const storeNodes = useBuilderStore.getState().nodes;
    const storeRootId = useBuilderStore.getState().rootNodeId;
    const activeNode = storeNodes[activeId];
    const overNode = storeNodes[overId];

    if (!activeNode || !overNode) {
      setProjectedDrop(null);
      return;
    }

    // Prevent dragging ancestor into its descendant
    if (isDescendant(storeNodes, overId, activeId)) {
      setProjectedDrop(null);
      return;
    }

    const isOverContainer = isContainerType(overNode.type) || overId === storeRootId;
    const canAccept = canAcceptChild(storeNodes, overId, activeId, storeRootId);

    // Calculate relative pointer Y within over item
    let relativeY = 0.5;
    if (over.rect && event.active.rect.current.translated) {
      const activeCenterY = event.active.rect.current.translated.top + event.active.rect.current.translated.height / 2;
      relativeY = Math.max(0, Math.min(1, (activeCenterY - over.rect.top) / (over.rect.height || 1)));
    }

    let position: 'before' | 'after' | 'inside' = 'after';
    let targetParentId = overNode.parentId || storeRootId;
    let targetIndex = 0;

    // Indentation sensitivity (Framer/Figma style):
    // Dragging right (>25px) indicates intent to nest into preceding container
    if (delta.x > 25 && isOverContainer && canAccept) {
      position = 'inside';
      targetParentId = overId;
      targetIndex = overNode.childrenIds.length;
    } else if (delta.x < -20 && overNode.parentId && overNode.parentId !== storeRootId) {
      // Dragging left (<-20px) un-nests to parent's container level
      const overParentNode = storeNodes[overNode.parentId];
      if (overParentNode) {
        targetParentId = overParentNode.parentId || storeRootId;
        const targetParentObj = storeNodes[targetParentId];
        if (targetParentObj) {
          const overParentIndex = targetParentObj.childrenIds.indexOf(overNode.parentId);
          targetIndex = overParentIndex >= 0 ? overParentIndex + 1 : targetParentObj.childrenIds.length;
        }
        position = 'after';
      }
    } else if (isOverContainer && canAccept && relativeY >= 0.25 && relativeY <= 0.75) {
      // Hovering in middle 50% of container: Drop INSIDE
      position = 'inside';
      targetParentId = overId;
      targetIndex = overNode.childrenIds.length;
    } else {
      // Sibling insertion (before or after overNode)
      const isBefore = isOverContainer ? relativeY < 0.25 : relativeY < 0.5;
      position = isBefore ? 'before' : 'after';
      const parent = storeNodes[targetParentId];
      if (parent) {
        const overIndex = parent.childrenIds.indexOf(overId);
        targetIndex = overIndex >= 0 ? (isBefore ? overIndex : overIndex + 1) : parent.childrenIds.length;
      }
    }

    setProjectedDrop({
      targetId: overId,
      position,
      targetParentId,
      targetIndex,
      depth: 1
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);
    const drop = projectedDrop;
    setProjectedDrop(null);

    const { active, over } = event;
    if (!over || active.id === over.id) return;
    
    const activeId = active.id as string;
    if (drop && drop.targetId === (over.id as string)) {
      useBuilderStore.getState().moveNode(activeId, drop.targetParentId, drop.targetIndex);
      return;
    }

    // Fallback if drop was not precalculated
    const overId = over.id as string;
    const storeNodes = useBuilderStore.getState().nodes;
    const storeRootId = useBuilderStore.getState().rootNodeId;
    const activeNode = storeNodes[activeId];
    const overNode = storeNodes[overId];
    
    if (!activeNode || !overNode) return;
    if (isDescendant(storeNodes, overId, activeId)) return;
    
    const targetParentId = overNode.parentId || storeRootId;
    const parent = storeNodes[targetParentId];
    const targetIndex = parent ? parent.childrenIds.indexOf(overId) + 1 : 0;

    useBuilderStore.getState().moveNode(activeId, targetParentId, targetIndex);
  };

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const { selectedNodeIds, selectedNodeId } = useBuilderStore.getState();
    const isAlreadySelected = (selectedNodeIds && selectedNodeIds.includes(id)) || selectedNodeId === id;
    if (!isAlreadySelected) {
      useBuilderStore.getState().selectNode(id, e.shiftKey || e.metaKey);
    }
    setContextMenu({ x: e.clientX, y: e.clientY, nodeId: id });
  };

  const handlePageContextMenu = (e: React.MouseEvent, page: ProjectPage) => {
    e.preventDefault();
    e.stopPropagation();
    setPageContextMenu({ x: e.clientX, y: e.clientY, page });
  };

  const handleFolderContextMenu = (e: React.MouseEvent, folder: PageFolder) => {
    e.preventDefault();
    e.stopPropagation();
    setFolderContextMenu({ x: e.clientX, y: e.clientY, folder });
  };

  // Create New Page and activate inline rename immediately (Gambar 4)
  const handleCreateNewPage = (folderId: string | null = null) => {
    setPagePlusMenuOpen(false);
    const count = pages.length;
    const newName = count === 0 ? 'Home' : `/page-${count + 1}`;
    const newPageId = addPage(newName, undefined, folderId);
    setEditingPageId(newPageId);
    setPageEditName(newName);
  };

  // Create New Folder and activate inline rename immediately (Gambar 5)
  const handleCreateNewFolder = () => {
    setPagePlusMenuOpen(false);
    const count = pageFolders.length + 1;
    const folderName = `/folder-${count}`;
    const newFolderId = addPageFolder(folderName);
    setEditingFolderId(newFolderId);
    setFolderEditName(folderName);
  };

  const finishPageRename = (pageId: string) => {
    if (pageEditName.trim()) {
      renamePage(pageId, pageEditName.trim());
    }
    setEditingPageId(null);
  };

  const finishFolderRename = (folderId: string) => {
    if (folderEditName.trim()) {
      renamePageFolder(folderId, folderEditName.trim());
    }
    setEditingFolderId(null);
  };

  // Filter pages by search query
  const filteredPages = pages.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group pages by folders
  const rootPages = filteredPages.filter(p => !p.folderId);
  const getPagesInFolder = (folderId: string) => filteredPages.filter(p => p.folderId === folderId);

  return (
    <div id="framer-left-sidebar" className="w-[240px] bg-white dark:bg-[#111] border-r border-zinc-200 dark:border-[#222] flex flex-col flex-shrink-0 z-[100] h-full relative text-zinc-800 dark:text-[#CCC]" onContextMenu={(e) => {
      if (e.target === e.currentTarget) {
        e.preventDefault();
      }
    }}>
      
      {/* Global Mode Switcher Tabs */}
      <div className="flex items-center px-1 py-1.5 gap-0.5 border-b border-zinc-200 dark:border-[#1E1E1E] shrink-0">
        <button 
          onClick={() => setActiveTab('pages')}
          className={clsx(
            "px-2 py-1.5 text-[11px] font-medium rounded transition-all flex-1", 
            activeTab === 'pages' ? "bg-zinc-200/80 dark:bg-[#2A2A2A] text-zinc-900 dark:text-white shadow-xs border border-zinc-300 dark:border-[#333]" : "text-zinc-600 dark:text-[#A0A0A0] hover:text-zinc-900 dark:hover:text-[#CCC] hover:bg-zinc-100 dark:hover:bg-[#1A1A1A]"
          )}
        >
          Pages
        </button>
        <button 
          onClick={() => setActiveTab('layers')}
          className={clsx(
            "px-2 py-1.5 text-[11px] font-medium rounded transition-all flex-1", 
            activeTab === 'layers' ? "bg-zinc-200/80 dark:bg-[#2A2A2A] text-zinc-900 dark:text-white shadow-xs border border-zinc-300 dark:border-[#333]" : "text-zinc-600 dark:text-[#A0A0A0] hover:text-zinc-900 dark:hover:text-[#CCC] hover:bg-zinc-100 dark:hover:bg-[#1A1A1A]"
          )}
        >
          Layers
        </button>
        <button 
          onClick={() => setActiveTab('assets')}
          className={clsx(
            "px-2 py-1.5 text-[11px] font-medium rounded transition-all flex-1", 
            activeTab === 'assets' ? "bg-zinc-200/80 dark:bg-[#2A2A2A] text-zinc-900 dark:text-white shadow-xs border border-zinc-300 dark:border-[#333]" : "text-zinc-600 dark:text-[#A0A0A0] hover:text-zinc-900 dark:hover:text-[#CCC] hover:bg-zinc-100 dark:hover:bg-[#1A1A1A]"
          )}
        >
          Assets
        </button>

        <button 
          onClick={() => useBuilderStore.getState().toggleLeftSidebar()}
          className="ml-1 p-1 text-zinc-400 hover:text-zinc-800 dark:hover:text-white rounded hover:bg-zinc-100 dark:hover:bg-[#1A1A1A] transition-colors"
          title="Close Sidebar"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* 1. PAGES TAB */}
      {activeTab === 'pages' && (
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          {/* Header with Title and Plus Button (Gambar 3) */}
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-zinc-200 dark:border-[#1E1E1E] relative">
            <span className="text-xs font-semibold text-zinc-900 dark:text-white tracking-wide">Pages</span>
            
            <div className="relative" ref={pagePlusMenuRef}>
              <button
                onClick={() => setPagePlusMenuOpen(!pagePlusMenuOpen)}
                className={clsx(
                  "p-1 rounded hover:bg-zinc-200 dark:hover:bg-[#2A2A2A] text-zinc-500 dark:text-[#999] hover:text-zinc-900 dark:hover:text-white transition-colors",
                  pagePlusMenuOpen && "bg-zinc-200 dark:bg-[#2A2A2A] text-zinc-900 dark:text-white"
                )}
                title="Add Page or Folder"
              >
                <Plus size={14} />
              </button>

              {/* PLUS DROPDOWN MENU (Gambar 3) */}
              {pagePlusMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-[#303038] rounded-lg shadow-2xl py-1.5 z-50 text-xs select-none animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => handleCreateNewPage(null)}
                    className="flex items-center justify-between w-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#27272A] text-zinc-800 dark:text-[#E4E4E7] hover:text-zinc-900 dark:hover:text-white text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FilePlus size={14} className="text-zinc-500 dark:text-[#A1A1AA]" />
                      <span className="font-medium">New page</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 dark:text-[#71717A] font-mono">⌥P</span>
                  </button>

                  <button
                    onClick={handleCreateNewFolder}
                    className="flex items-center justify-between w-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#27272A] text-zinc-800 dark:text-[#E4E4E7] hover:text-zinc-900 dark:hover:text-white text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FolderPlus size={14} className="text-zinc-500 dark:text-[#A1A1AA]" />
                      <span className="font-medium">New folder</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 dark:text-[#71717A] font-mono">⌥F</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Search Input for Pages */}
          <div className="p-2 border-b border-zinc-200 dark:border-[#1E1E1E]">
            <div className="flex items-center gap-2 px-2.5 py-1 bg-zinc-100 dark:bg-[#111] border border-zinc-200 dark:border-[#242424] rounded-md focus-within:border-zinc-400 dark:focus-within:border-[#444] transition-all">
              <Search size={12} className="text-zinc-400 dark:text-[#666]" />
              <input 
                type="text" 
                placeholder="Search pages..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-[#666] w-full"
              />
            </div>
          </div>

          {/* List of Pages and Folders */}
          <div className="flex-1 px-2 py-2 flex flex-col gap-0.5">
            
            {/* Root Pages */}
            {rootPages.map((page) => {
              const isActive = page.id === activePageId;
              const isRenaming = editingPageId === page.id;

              return (
                <div
                  key={page.id}
                  onClick={() => {
                    if (!isRenaming) {
                      setActivePage(page.id);
                    }
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setEditingPageId(page.id);
                    setPageEditName(page.name);
                  }}
                  onContextMenu={(e) => handlePageContextMenu(e, page)}
                  className={clsx(
                    "flex items-center justify-between px-2.5 py-1.5 rounded-md cursor-pointer text-xs select-none group transition-colors",
                    isActive 
                      ? "bg-zinc-200/80 dark:bg-[#2A2A2A] text-zinc-900 dark:text-white border border-zinc-300 dark:border-[#3A3A3A] shadow-xs" 
                      : "text-zinc-600 dark:text-[#A0A0A0] hover:text-zinc-900 dark:hover:text-[#DDD] hover:bg-zinc-100 dark:hover:bg-[#1A1A1A]"
                  )}
                >
                  <div className="flex items-center gap-2 overflow-hidden flex-1">
                    {page.isHome ? (
                      <Home size={13} className={isActive ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-[#777]"} />
                    ) : (
                      <File size={13} className={isActive ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-[#777]"} />
                    )}

                    {isRenaming ? (
                      <input
                        type="text"
                        value={pageEditName}
                        onChange={(e) => setPageEditName(e.target.value)}
                        onBlur={() => finishPageRename(page.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') finishPageRename(page.id);
                          if (e.key === 'Escape') setEditingPageId(null);
                        }}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-[#111] text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 rounded px-1.5 py-0.5 outline-none text-xs w-full"
                      />
                    ) : (
                      <span className={clsx("truncate font-medium", isActive ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-[#AAA]")}>
                        {page.name}
                      </span>
                    )}
                  </div>

                  {/* Badges / Indicators */}
                  <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100">
                    {page.isDraft && (
                      <span className="text-[9px] bg-zinc-200 dark:bg-[#333] text-zinc-600 dark:text-[#A0A0A0] px-1 py-0.2 rounded">Draft</span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePageContextMenu(e, page);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-[#333] text-zinc-500 dark:text-[#AAA] hover:text-zinc-900 dark:hover:text-white transition-opacity"
                    >
                      <MoreHorizontal size={12} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Folders with Nested Pages (Gambar 6) */}
            {pageFolders.map((folder) => {
              const pagesInThisFolder = getPagesInFolder(folder.id);
              const isFolderRenaming = editingFolderId === folder.id;
              const isExpanded = folder.isExpanded !== false;

              return (
                <div key={folder.id} className="flex flex-col mt-1">
                  {/* Folder Row */}
                  <div
                    onContextMenu={(e) => handleFolderContextMenu(e, folder)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setEditingFolderId(folder.id);
                      setFolderEditName(folder.name);
                    }}
                    onClick={() => togglePageFolderExpanded(folder.id)}
                    className="flex items-center justify-between px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#1A1A1A] rounded-md cursor-pointer text-xs select-none group text-zinc-700 dark:text-[#AAA] hover:text-zinc-900 dark:hover:text-white"
                  >
                    <div className="flex items-center gap-1.5 overflow-hidden flex-1">
                      <div className="w-3.5 h-3.5 flex items-center justify-center text-zinc-400 dark:text-[#777]">
                        {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      </div>
                      
                      {isExpanded ? (
                        <FolderOpen size={13} className="text-zinc-900 dark:text-white/90" />
                      ) : (
                        <Folder size={13} className="text-zinc-900 dark:text-white/90" />
                      )}

                      {isFolderRenaming ? (
                        <input
                          type="text"
                          value={folderEditName}
                          onChange={(e) => setFolderEditName(e.target.value)}
                          onBlur={() => finishFolderRename(folder.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') finishFolderRename(folder.id);
                            if (e.key === 'Escape') setEditingFolderId(null);
                          }}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                          className="bg-white dark:bg-[#111] text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 rounded px-1.5 py-0.5 outline-none text-xs w-full"
                        />
                      ) : (
                        <span className="truncate font-semibold text-zinc-900 dark:text-white/90">{folder.name}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateNewPage(folder.id);
                        }}
                        className="p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-[#333] text-zinc-500 dark:text-[#AAA] hover:text-zinc-900 dark:hover:text-white"
                        title="Add Page in Folder"
                      >
                        <Plus size={11} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFolderContextMenu(e, folder);
                        }}
                        className="p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-[#333] text-zinc-500 dark:text-[#AAA] hover:text-zinc-900 dark:hover:text-white"
                      >
                        <MoreHorizontal size={11} />
                      </button>
                    </div>
                  </div>

                  {/* Pages inside this Folder */}
                  {isExpanded && (
                    <div className="pl-4 flex flex-col gap-0.5 border-l border-zinc-200 dark:border-[#222] ml-3.5 mt-0.5">
                      {pagesInThisFolder.length === 0 ? (
                        <div 
                          onClick={() => handleCreateNewPage(folder.id)}
                          className="px-2 py-1 text-[11px] text-zinc-400 dark:text-[#555] hover:text-zinc-600 dark:hover:text-[#888] cursor-pointer italic"
                        >
                          + Add page to folder
                        </div>
                      ) : (
                        pagesInThisFolder.map((page) => {
                          const isActive = page.id === activePageId;
                          const isRenaming = editingPageId === page.id;

                          return (
                            <div
                              key={page.id}
                              onClick={() => {
                                if (!isRenaming) {
                                  setActivePage(page.id);
                                }
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                setEditingPageId(page.id);
                                setPageEditName(page.name);
                              }}
                              onContextMenu={(e) => handlePageContextMenu(e, page)}
                              className={clsx(
                                "flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer text-xs select-none group transition-colors",
                                isActive 
                                  ? "bg-zinc-200/80 dark:bg-[#2A2A2A] text-zinc-900 dark:text-white border border-zinc-300 dark:border-[#3A3A3A] shadow-xs" 
                                  : "text-zinc-600 dark:text-[#A0A0A0] hover:text-zinc-900 dark:hover:text-[#DDD] hover:bg-zinc-100 dark:hover:bg-[#1A1A1A]"
                              )}
                            >
                              <div className="flex items-center gap-1.5 overflow-hidden flex-1">
                                <File size={12} className={isActive ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-[#777]"} />
                                
                                {isRenaming ? (
                                  <input
                                    type="text"
                                    value={pageEditName}
                                    onChange={(e) => setPageEditName(e.target.value)}
                                    onBlur={() => finishPageRename(page.id)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') finishPageRename(page.id);
                                      if (e.key === 'Escape') setEditingPageId(null);
                                    }}
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-white dark:bg-[#111] text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 rounded px-1.5 py-0.5 outline-none text-xs w-full"
                                  />
                                ) : (
                                  <span className={clsx("truncate", isActive ? "text-zinc-900 dark:text-white font-medium" : "text-zinc-700 dark:text-[#AAA]")}>
                                    {page.name}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePageContextMenu(e, page);
                                  }}
                                  className="p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-[#333] text-zinc-500 dark:text-[#AAA] hover:text-zinc-900 dark:hover:text-white"
                                >
                                  <MoreHorizontal size={11} />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}

          </div>
        </div>
      )}

      {/* 2. LAYERS TAB (Dynamic to active page AST and Framer Breakpoint Hierarchy) */}
      {activeTab === 'layers' && (
        <>
          {/* Active Page Indicator Header */}
          <div className="flex flex-col gap-2 p-3 border-b border-zinc-200 dark:border-[#1E1E1E] shrink-0">
            <div 
              onClick={() => setActiveTab('pages')}
              className="flex items-center justify-between px-2.5 py-1.5 bg-zinc-100 dark:bg-[#222] hover:bg-zinc-200/60 dark:hover:bg-[#222] rounded-md border border-zinc-200 dark:border-transparent hover:dark:border-[#333] cursor-pointer transition-colors group"
              title="Click to switch active page in Pages tab"
            >
              <div className="flex items-center gap-2 text-xs text-zinc-700 dark:text-[#CCC] group-hover:text-zinc-900 dark:group-hover:text-white overflow-hidden">
                {activePage?.isHome ? (
                  <Home size={14} className="text-zinc-900 dark:text-white opacity-90 shrink-0" />
                ) : (
                  <File size={14} className="text-zinc-900 dark:text-white opacity-90 shrink-0" />
                )}
                <span className="font-medium truncate">{activePage?.name || 'Home'}</span>
              </div>
              <ChevronDown size={14} className="text-zinc-400 dark:text-[#666] group-hover:text-zinc-700 dark:group-hover:text-[#AAA] shrink-0" />
            </div>
            
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-zinc-100 dark:bg-[#111] border border-zinc-200 dark:border-[#222] rounded-md focus-within:border-zinc-400 dark:focus-within:border-[#444] focus-within:bg-white dark:focus-within:bg-[#1A1A1A] transition-all">
              <Search size={14} className="text-zinc-400 dark:text-[#666]" />
              <input 
                type="text" 
                placeholder="Search layers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-[#666] w-full" 
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white">
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Hierarchical Breakpoints & Layer Tree (Gambar 9) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
            
            {/* 1. Desktop Breakpoint (Primary / Parent) */}
            <div className="flex flex-col mb-1">
              <div 
                onClick={() => {
                  useBuilderStore.getState().setBreakpoint('lg');
                  if (rootNodeId) selectNode(rootNodeId);
                }}
                className={clsx(
                  "flex items-center justify-between h-7 px-2.5 cursor-pointer text-xs select-none transition-colors group",
                  (activeBreakpoint === 'lg' && selectedNodeId === rootNodeId)
                    ? "bg-[#0099FF] text-white font-medium" 
                    : "text-zinc-600 dark:text-[#A0A0A0] hover:bg-zinc-100 dark:hover:bg-[#222] hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                <div className="flex items-center gap-1.5 overflow-hidden flex-1">
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedBp(expandedBp === 'lg' ? '' : 'lg');
                    }}
                    className="w-4 h-4 flex items-center justify-center -ml-1 rounded hover:bg-black/10 dark:hover:bg-black/20 transition-colors"
                  >
                    {expandedBp === 'lg' ? <ChevronDown size={12} className={activeBreakpoint === 'lg' && selectedNodeId === rootNodeId ? "text-white" : "text-zinc-400 dark:text-[#777]"} /> : <ChevronRight size={12} className={activeBreakpoint === 'lg' && selectedNodeId === rootNodeId ? "text-white" : "text-zinc-400 dark:text-[#777]"} />}
                  </div>
                  <Frame size={13} className={activeBreakpoint === 'lg' && selectedNodeId === rootNodeId ? "text-white" : "text-zinc-900 dark:text-white"} />
                  <span className="truncate font-medium">Desktop</span>
                </div>
                <span className={clsx(
                  "text-[10px] font-medium tracking-wide",
                  (activeBreakpoint === 'lg' && selectedNodeId === rootNodeId) ? "text-white/90" : "text-zinc-400 dark:text-[#777]"
                )}>
                  Primary
                </span>
              </div>
              {expandedBp === 'lg' && renderLayerTree()}
            </div>

            {/* 2. Tablet Breakpoint (Child) */}
            <div className="flex flex-col mb-1">
              <div 
                onClick={() => {
                  useBuilderStore.getState().enableBreakpoint('md');
                  useBuilderStore.getState().setBreakpoint('md');
                  if (rootNodeId) selectNode(rootNodeId);
                }}
                className={clsx(
                  "flex items-center justify-between h-7 px-2.5 cursor-pointer text-xs select-none transition-colors group",
                  (activeBreakpoint === 'md' && selectedNodeId === rootNodeId)
                    ? "bg-[#0099FF] text-white font-medium" 
                    : "text-zinc-600 dark:text-[#A0A0A0] hover:bg-zinc-100 dark:hover:bg-[#222] hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                <div className="flex items-center gap-1.5 overflow-hidden flex-1">
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedBp(expandedBp === 'md' ? '' : 'md');
                    }}
                    className="w-4 h-4 flex items-center justify-center -ml-1 rounded hover:bg-black/10 dark:hover:bg-black/20 transition-colors"
                  >
                    {expandedBp === 'md' ? <ChevronDown size={12} className={activeBreakpoint === 'md' && selectedNodeId === rootNodeId ? "text-white" : "text-zinc-400 dark:text-[#777]"} /> : <ChevronRight size={12} className={activeBreakpoint === 'md' && selectedNodeId === rootNodeId ? "text-white" : "text-zinc-400 dark:text-[#777]"} />}
                  </div>
                  <Frame size={13} className={activeBreakpoint === 'md' && selectedNodeId === rootNodeId ? "text-white" : "text-zinc-900 dark:text-white"} />
                  <span className="truncate font-medium">Tablet</span>
                </div>
                <span className={clsx(
                  "text-[10px] font-mono",
                  (activeBreakpoint === 'md' && selectedNodeId === rootNodeId) ? "text-white/90" : "text-zinc-400 dark:text-[#777]"
                )}>
                  1199 — 810
                </span>
              </div>
              {expandedBp === 'md' && renderLayerTree()}
            </div>

            {/* 3. Phone Breakpoint (Child) */}
            <div className="flex flex-col mb-1">
              <div 
                onClick={() => {
                  useBuilderStore.getState().enableBreakpoint('base');
                  useBuilderStore.getState().setBreakpoint('base');
                  if (rootNodeId) selectNode(rootNodeId);
                }}
                className={clsx(
                  "flex items-center justify-between h-7 px-2.5 cursor-pointer text-xs select-none transition-colors group",
                  (activeBreakpoint === 'base' && selectedNodeId === rootNodeId)
                    ? "bg-[#0099FF] text-white font-medium" 
                    : "text-zinc-600 dark:text-[#A0A0A0] hover:bg-zinc-100 dark:hover:bg-[#222] hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                <div className="flex items-center gap-1.5 overflow-hidden flex-1">
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedBp(expandedBp === 'base' ? '' : 'base');
                    }}
                    className="w-4 h-4 flex items-center justify-center -ml-1 rounded hover:bg-black/10 dark:hover:bg-black/20 transition-colors"
                  >
                    {expandedBp === 'base' ? <ChevronDown size={12} className={activeBreakpoint === 'base' && selectedNodeId === rootNodeId ? "text-white" : "text-zinc-400 dark:text-[#777]"} /> : <ChevronRight size={12} className={activeBreakpoint === 'base' && selectedNodeId === rootNodeId ? "text-white" : "text-zinc-400 dark:text-[#777]"} />}
                  </div>
                  <Frame size={13} className={activeBreakpoint === 'base' && selectedNodeId === rootNodeId ? "text-white" : "text-zinc-900 dark:text-white"} />
                  <span className="truncate font-medium">Phone</span>
                </div>
                <span className={clsx(
                  "text-[10px] font-mono",
                  (activeBreakpoint === 'base' && selectedNodeId === rootNodeId) ? "text-white/90" : "text-zinc-400 dark:text-[#777]"
                )}>
                  809 — 0
                </span>
              </div>
              {expandedBp === 'base' && renderLayerTree()}
            </div>

          </div>
        </>
      )}

      {/* 3. ASSETS TAB */}
      {activeTab === 'assets' && (() => {
        // Filter components by search
        const filteredCustomAssets = customAssets.filter(a => 
          !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const nativeComponents = Object.values(getComponentsByCategory()).flat().filter(c => !c.hidden);
        const filteredNativeComponents = nativeComponents.filter(c => 
          !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Build hierarchical folder tree for Color Tokens
        interface StyleFolderTree {
          name: string;
          fullPath: string;
          subfolders: Record<string, StyleFolderTree>;
          tokens: { token: ColorToken; leafName: string }[];
        }

        const rootTokens: { token: ColorToken; leafName: string }[] = [];
        const folders: Record<string, StyleFolderTree> = {};
        const q = searchQuery.trim().toLowerCase();

        colorTokens.forEach(token => {
          if (q) {
            const matchName = token.name.toLowerCase().includes(q);
            const matchLight = token.lightValue?.toLowerCase().includes(q);
            const matchDark = token.darkValue?.toLowerCase().includes(q);
            if (!matchName && !matchLight && !matchDark) return;
          }

          const parts = token.name.split('/').map(p => p.trim()).filter(Boolean);
          if (parts.length <= 1) {
            rootTokens.push({ token, leafName: parts[0] || token.name });
          } else {
            let currentMap = folders;
            let currentPath = '';
            for (let i = 0; i < parts.length - 1; i++) {
              const seg = parts[i];
              currentPath = currentPath ? `${currentPath}/${seg}` : seg;
              if (!currentMap[seg]) {
                currentMap[seg] = {
                  name: seg,
                  fullPath: currentPath,
                  subfolders: {},
                  tokens: []
                };
              }
              if (i === parts.length - 2) {
                const leafName = parts[parts.length - 1];
                currentMap[seg].tokens.push({ token, leafName });
              } else {
                currentMap = currentMap[seg].subfolders;
              }
            }
          }
        });

        // Helper to count tokens inside folder tree
        const countFolderTokens = (folder: StyleFolderTree): number => {
          let count = folder.tokens.length;
          Object.values(folder.subfolders).forEach(sub => {
            count += countFolderTokens(sub);
          });
          return count;
        };

        // Render Style Token item
        const renderStyleTokenItem = (token: ColorToken, leafName: string, depth: number) => {
          return (
            <div 
              key={token.id}
              style={{ paddingLeft: `${depth * 14 + 14}px` }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setFloatingEditorPos({ top: Math.min(rect.top, window.innerHeight - 450), left: 245 });
                setEditingColorToken(token);
              }}
              className="flex items-center justify-between pr-2.5 py-1.5 text-zinc-700 dark:text-[#CCC] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#1E1E24] rounded-md cursor-pointer group select-none transition-colors"
            >
              <div className="flex items-center gap-2 overflow-hidden flex-1">
                <div 
                  className="w-3.5 h-3.5 rounded-full border border-zinc-300 dark:border-white/20 shadow-xs shrink-0" 
                  style={{ backgroundColor: token.lightValue || token.darkValue }}
                />
                <span className="text-xs truncate font-medium text-zinc-800 dark:text-[#DDD]">{leafName}</span>
              </div>
              
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-mono text-zinc-400 dark:text-[#666] uppercase">
                  {token.lightValue?.replace('#', '')}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setStyleContextMenu({ x: e.clientX, y: e.clientY, token });
                  }}
                  className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-[#333] text-zinc-400 dark:text-[#888] hover:text-zinc-900 dark:hover:text-white"
                  title="Style options"
                >
                  <MoreHorizontal size={13} />
                </button>
              </div>
            </div>
          );
        };

        // Render Style Folder recursively
        const renderStyleFolderRecursive = (folder: StyleFolderTree, depth: number = 0) => {
          const isExpanded = expandedStyleFolders.has(folder.fullPath);
          const totalTokens = countFolderTokens(folder);

          return (
            <div key={folder.fullPath} className="flex flex-col">
              <div 
                onClick={() => {
                  setExpandedStyleFolders(prev => {
                    const next = new Set(prev);
                    if (next.has(folder.fullPath)) next.delete(folder.fullPath);
                    else next.add(folder.fullPath);
                    return next;
                  });
                }}
                style={{ paddingLeft: `${depth * 14 + 8}px` }}
                className="flex items-center justify-between pr-2.5 py-1.5 text-zinc-700 dark:text-[#AAA] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#1A1A1A] rounded cursor-pointer group select-none text-xs transition-colors"
              >
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <div className="w-3.5 h-3.5 flex items-center justify-center text-zinc-400 dark:text-[#777]">
                    {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  </div>
                  {isExpanded ? (
                    <FolderOpen size={13} className="text-zinc-900 dark:text-white shrink-0" />
                  ) : (
                    <Folder size={13} className="text-zinc-900 dark:text-white shrink-0" />
                  )}
                  <span className="font-semibold text-xs truncate text-zinc-900 dark:text-[#EEE]">{folder.name}</span>
                </div>
                <span className="text-[10px] text-zinc-400 dark:text-[#666] font-mono">{totalTokens}</span>
              </div>

              {isExpanded && (
                <div className="flex flex-col">
                  {Object.values(folder.subfolders).map(sub => renderStyleFolderRecursive(sub, depth + 1))}
                  {folder.tokens.map(({ token, leafName }) => renderStyleTokenItem(token, leafName, depth + 1))}
                </div>
              )}
            </div>
          );
        };

        return (
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
            {/* Search Input for Assets */}
            <div className="p-3 border-b border-zinc-200 dark:border-[#1E1E1E]">
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-zinc-100 dark:bg-[#111] border border-zinc-200 dark:border-[#222] rounded-md focus-within:border-zinc-400 dark:focus-within:border-[#444] transition-all">
                <Search size={14} className="text-zinc-400 dark:text-[#666]" />
                <input 
                  type="text" 
                  placeholder="Search components & styles..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs text-zinc-900 dark:text-white w-full placeholder-zinc-400 dark:placeholder-[#666]" 
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white">
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
            
            {/* 1. COMPONENT SECTION (Renamed from Custom Assets) */}
            <div className="py-2">
              <div className="flex items-center justify-between px-3 py-2 group">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-white">Component</span>
                  <span className="text-[10px] bg-zinc-100 dark:bg-[#222] text-zinc-500 dark:text-[#888] px-1.5 py-0.2 rounded font-mono">
                    {filteredCustomAssets.length + filteredNativeComponents.length}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 dark:text-[#666]">Drag or click</span>
              </div>
              
              <div className="flex flex-col px-3 gap-1.5 mt-0.5 mb-2">
                {filteredCustomAssets.length === 0 && filteredNativeComponents.length === 0 ? (
                  <div className="text-[11px] text-zinc-400 dark:text-[#666] italic py-2 px-1">
                    {searchQuery ? 'No matching components.' : 'No components yet. Right-click any layer & select "Create Component".'}
                  </div>
                ) : (
                  <>
                    {/* Native Components */}
                    {filteredNativeComponents.map(comp => (
                      <div 
                        key={comp.id} 
                        className="flex items-center justify-between px-2.5 py-1.5 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-800/30 rounded-md text-zinc-800 dark:text-[#CCC] hover:text-zinc-900 dark:hover:text-white cursor-grab active:cursor-grabbing hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-colors group"
                        draggable
                        onClick={() => {
                          const asset = comp.createNodeBlueprint();
                          const data = { id: comp.id, name: comp.name, nodeData: asset.nodeData, rootNodeId: asset.rootNodeId };
                          handleInsertCustomAsset(data);
                        }}
                        onDragStart={(e) => {
                          const asset = comp.createNodeBlueprint();
                          const data = { id: comp.id, name: comp.name, nodeData: asset.nodeData, rootNodeId: asset.rootNodeId };
                          e.dataTransfer.setData('application/json', JSON.stringify({ type: 'custom-asset', asset: data }));
                          e.dataTransfer.effectAllowed = 'copy';
                        }}
                        title="Click to insert or drag onto canvas"
                      >
                        <div className="flex items-center gap-2 overflow-hidden flex-1">
                          <div className="text-blue-500 shrink-0">
                            {React.isValidElement(comp.icon) ? React.cloneElement(comp.icon as React.ReactElement, { size: 14 }) : <Boxes size={13} />}
                          </div>
                          <span className="text-xs truncate font-medium">{comp.name}</span>
                        </div>
                      </div>
                    ))}
                    
                    {/* Custom Assets */}
                    {filteredCustomAssets.map(asset => (
                      <div 
                        key={asset.id} 
                        className="flex items-center justify-between px-2.5 py-1.5 bg-zinc-100/80 dark:bg-[#1A1A1E] border border-zinc-200 dark:border-[#2A2A30] rounded-md text-zinc-800 dark:text-[#CCC] hover:text-zinc-900 dark:hover:text-white cursor-grab active:cursor-grabbing hover:bg-zinc-200/60 dark:hover:bg-[#24242A] transition-colors group"
                        draggable
                        onClick={() => handleInsertCustomAsset(asset)}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('application/json', JSON.stringify({ type: 'custom-asset', asset }));
                          e.dataTransfer.effectAllowed = 'copy';
                        }}
                        title="Click to insert or drag onto canvas"
                      >
                        <div className="flex items-center gap-2 overflow-hidden flex-1">
                          <Boxes size={13} className="text-[#9D00FF] shrink-0" />
                          <span className="text-xs truncate font-medium">{asset.name}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCustomAsset(asset.id);
                            showToast(`Deleted component '${asset.name}'`, undefined, 'info');
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 hover:text-red-500 text-zinc-400 dark:text-[#777] transition-all"
                          title="Delete component"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
            
            {/* 2. STYLES SECTION (Slash / Hierarchy & Floating Editor) */}
            <div className="flex-1 py-2 border-t border-zinc-200 dark:border-[#222]">
              <div className="flex items-center justify-between px-3 py-2 group">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-white">Styles</span>
                  <span className="text-[10px] bg-zinc-100 dark:bg-[#222] text-zinc-500 dark:text-[#888] px-1.5 py-0.2 rounded font-mono">
                    {colorTokens.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setNewStyleInputName('Brand/New Style');
                    setNewStyleInputColor('#0099FF');
                    setIsAddingStyleModalOpen(true);
                  }}
                  className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-[#2A2A2A] text-zinc-500 dark:text-[#999] hover:text-zinc-900 dark:hover:text-white transition-colors"
                  title="Add new style"
                >
                  <Plus size={14} />
                </button>
              </div>
              
              <div className="flex flex-col px-1.5 mt-0.5">
                {/* TEXT STYLES FOLDER */}
                <div className="flex flex-col">
                  <div 
                    onClick={() => {
                      setExpandedStyleFolders(prev => {
                        const next = new Set(prev);
                        if (next.has('Text')) next.delete('Text');
                        else next.add('Text');
                        return next;
                      });
                    }}
                    className="flex items-center justify-between px-2.5 py-1.5 text-zinc-700 dark:text-[#AAA] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#1A1A1A] rounded cursor-pointer select-none text-xs transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 flex items-center justify-center text-zinc-400 dark:text-[#777]">
                        {expandedStyleFolders.has('Text') ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      </div>
                      <Type size={13} className="text-zinc-900 dark:text-white" />
                      <span className="font-semibold text-xs text-zinc-900 dark:text-[#EEE]">Text</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 dark:text-[#666] font-mono">{textTokens.length}</span>
                  </div>
                  
                  {expandedStyleFolders.has('Text') && (
                    <div className="flex flex-col pl-4">
                      {textTokens.map(token => (
                        <div 
                          key={token.id}
                          className="flex items-center justify-between pr-2 py-1 text-zinc-600 dark:text-[#A0A0A0] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#1E1E24] rounded cursor-pointer group text-xs"
                        >
                          <div className="flex items-center gap-2 overflow-hidden flex-1">
                            <span className="font-mono text-[10px] text-zinc-400 dark:text-[#666]">Aa</span>
                            <span className="truncate">{token.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-zinc-400 dark:text-[#666] group-hover:hidden">
                              {token.fontSize}px
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setTextStyleContextMenu({ x: e.clientX, y: e.clientY, token });
                              }}
                              className="hidden group-hover:flex p-1 rounded hover:bg-zinc-200 dark:hover:bg-[#333] text-zinc-400 dark:text-[#888] hover:text-zinc-900 dark:hover:text-white"
                              title="Style options"
                            >
                              <MoreHorizontal size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* COLOR STYLES HIERARCHICAL FOLDERS & TOKENS */}
                <div className="flex flex-col mt-0.5">
                  {/* Render Nested Folders */}
                  {Object.values(folders).map(folder => renderStyleFolderRecursive(folder, 0))}

                  {/* Render Root Tokens */}
                  {rootTokens.map(({ token, leafName }) => renderStyleTokenItem(token, leafName, 0))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Style Item Options Menu (Three dots) */}
      {styleContextMenu && (
        <div
          ref={styleMenuRef}
          className="fixed z-[99999] w-48 bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-[#333] rounded-lg shadow-2xl py-1 text-xs select-none animate-in fade-in zoom-in-95 duration-100"
          style={{ 
            top: Math.min(styleContextMenu.y, window.innerHeight - 200), 
            left: Math.min(styleContextMenu.x, window.innerWidth - 200) 
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              setFloatingEditorPos({ top: Math.max(100, styleContextMenu.y - 120), left: 245 });
              setEditingColorToken(styleContextMenu.token);
              setStyleContextMenu(null);
            }}
            className="flex items-center gap-2 w-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#27272A] text-zinc-800 dark:text-[#EEE] text-left transition-colors"
          >
            <SlidersHorizontal size={13} className="text-zinc-900 dark:text-white" />
            <span>Edit Style</span>
          </button>
          
          <button
            onClick={() => {
              handleFindInCanvas(styleContextMenu.token);
              setStyleContextMenu(null);
            }}
            className="flex items-center gap-2 w-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#27272A] text-zinc-800 dark:text-[#EEE] text-left transition-colors"
          >
            <Search size={13} className="text-zinc-900 dark:text-white" />
            <span>Find in Canvas</span>
          </button>

          <button
            onClick={() => {
              handleDuplicateStyle(styleContextMenu.token);
              setStyleContextMenu(null);
            }}
            className="flex items-center gap-2 w-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#27272A] text-zinc-800 dark:text-[#EEE] text-left transition-colors"
          >
            <Copy size={13} className="text-zinc-900 dark:text-white" />
            <span>Duplicate</span>
          </button>

          <div className="h-px bg-zinc-200 dark:bg-[#333] my-1" />

          <button
            onClick={() => {
              deleteColorToken(styleContextMenu.token.id);
              showToast(`Deleted style '${styleContextMenu.token.name}'`, undefined, 'info');
              setStyleContextMenu(null);
            }}
            className="flex items-center gap-2 w-full px-3 py-1.5 hover:bg-red-500/10 text-red-600 dark:text-red-400 text-left transition-colors"
          >
            <Trash2 size={13} />
            <span>Delete</span>
          </button>
        </div>
      )}

      {/* Add New Style Modal */}
      {isAddingStyleModalOpen && (
        <div 
          className="fixed z-[99999] inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100"
          onClick={() => setIsAddingStyleModalOpen(false)}
        >
          <div 
            className="bg-white dark:bg-[#1A1A1E] border border-zinc-200 dark:border-[#333] rounded-xl shadow-2xl p-4 w-80 text-zinc-900 dark:text-white flex flex-col gap-3.5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-[#2C2C35]">
              <span className="text-xs font-semibold text-zinc-900 dark:text-white">Create New Style</span>
              <button onClick={() => setIsAddingStyleModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white">
                <X size={14} />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-zinc-600 dark:text-[#A0A0A0]">
                Style Name <span className="text-[10px] text-zinc-400">(use / for folders, e.g. Brand/Accent)</span>
              </label>
              <input 
                type="text" 
                autoFocus
                placeholder="e.g. Brand/Primary or Accent"
                value={newStyleInputName}
                onChange={(e) => setNewStyleInputName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirmAddStyle();
                  if (e.key === 'Escape') setIsAddingStyleModalOpen(false);
                }}
                className="bg-zinc-100 dark:bg-[#121215] border border-zinc-200 dark:border-[#2C2C35] rounded-md px-2.5 py-1.5 text-xs text-zinc-900 dark:text-white outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded-md border border-zinc-300 dark:border-white/20 shadow-xs shrink-0" 
                style={{ backgroundColor: newStyleInputColor }}
              />
              <input 
                type="text" 
                value={newStyleInputColor}
                onChange={(e) => setNewStyleInputColor(e.target.value)}
                className="bg-zinc-100 dark:bg-[#121215] border border-zinc-200 dark:border-[#2C2C35] rounded-md px-2 py-1 text-xs font-mono text-zinc-900 dark:text-white w-24 outline-none uppercase"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-[#2C2C35]">
              <button
                onClick={() => setIsAddingStyleModalOpen(false)}
                className="px-3 py-1.5 text-xs text-zinc-600 dark:text-[#A0A0A0] hover:text-zinc-900 dark:hover:text-white rounded hover:bg-zinc-100 dark:hover:bg-[#252528]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAddStyle}
                className="px-3 py-1.5 text-xs bg-[#0099FF] text-white font-medium rounded hover:bg-[#0088EE] transition-colors"
              >
                Create Style
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Floating Style Editor (Figma / Webflow style) */}
      {/* Text Style Options Menu (Three dots) */}
      {textStyleContextMenu && (
        <div
          className="fixed z-[99999] w-48 bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-[#333] rounded-lg shadow-2xl py-1 text-xs select-none animate-in fade-in zoom-in-95 duration-100"
          style={{ 
             top: Math.min(textStyleContextMenu.y, window.innerHeight - 200), 
             left: Math.min(textStyleContextMenu.x, window.innerWidth - 200) 
           }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              setFloatingEditorPos({ top: Math.max(100, textStyleContextMenu.y - 120), left: 245 });
              setEditingTextToken(textStyleContextMenu.token);
              setTextStyleContextMenu(null);
            }}
            className="flex items-center gap-2 w-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#27272A] text-zinc-800 dark:text-[#EEE] text-left transition-colors"
          >
            <SlidersHorizontal size={13} className="text-zinc-900 dark:text-white" />
            <span>Edit Style</span>
          </button>
          
          <div className="h-px bg-zinc-200 dark:bg-[#333] my-1" />
          <button
            onClick={() => {
              deleteTextToken(textStyleContextMenu.token.id);
              showToast(`Deleted text style '${textStyleContextMenu.token.name}'`, undefined, 'info');
              setTextStyleContextMenu(null);
            }}
            className="flex items-center gap-2 w-full px-3 py-1.5 hover:bg-red-500/10 text-red-600 dark:text-red-400 text-left transition-colors"
          >
            <Trash2 size={13} />
            <span>Delete</span>
          </button>
        </div>
      )}
      
      {/* Floating Text Style Editor */}
      {editingTextToken && (
        <TextStyleEditor
          token={editingTextToken}
          position={floatingEditorPos}
          onClose={() => setEditingTextToken(null)}
        />
      )}

      {editingColorToken && (
        <FloatingStyleEditor
          token={editingColorToken}
          position={floatingEditorPos}
          onClose={() => setEditingColorToken(null)}
        />
      )}

      {/* Layer Context Menu */}
      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          nodeId={contextMenu.nodeId} 
          onClose={() => setContextMenu(null)} 
          onStartRename={(id) => setEditingNodeId(id)}
        />
      )}

      {/* Page Item Context Menu (Gambar 8) */}
      {pageContextMenu && (
        <PageContextMenu
          x={pageContextMenu.x}
          y={pageContextMenu.y}
          page={pageContextMenu.page}
          pageFolders={pageFolders}
          canDelete={pages.length > 1}
          onClose={() => setPageContextMenu(null)}
          onSetHome={() => setHomePage(pageContextMenu.page.id)}
          onDuplicate={() => duplicatePage(pageContextMenu.page.id)}
          onRename={() => {
            setEditingPageId(pageContextMenu.page.id);
            setPageEditName(pageContextMenu.page.name);
          }}
          onToggleDraft={() => togglePageDraft(pageContextMenu.page.id)}
          onMoveToFolder={(folderId) => movePageToFolder(pageContextMenu.page.id, folderId)}
          onDelete={() => deletePage(pageContextMenu.page.id)}
        />
      )}

      {/* Folder Item Context Menu (Gambar 7) */}
      {folderContextMenu && (
        <FolderContextMenu
          x={folderContextMenu.x}
          y={folderContextMenu.y}
          folder={folderContextMenu.folder}
          onClose={() => setFolderContextMenu(null)}
          onNewPageInside={() => handleCreateNewPage(folderContextMenu.folder.id)}
          onRename={() => {
            setEditingFolderId(folderContextMenu.folder.id);
            setFolderEditName(folderContextMenu.folder.name);
          }}
          onDelete={() => deletePageFolder(folderContextMenu.folder.id)}
        />
      )}

    </div>
  );
}

