import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useBuilderStore } from '../store/builderStore';
import { useLibraryStore } from '../store/libraryStore';
import { showToast } from '../store/toastStore';
import { NodeStyleProps } from '../types/builder';
import { componentRegistry } from '../registry/ComponentRegistry';
import { generateJSX } from '../utils/jsxGenerator';
import AlignToolbar from './inspector/AlignToolbar';
import PositionSection from './inspector/PositionSection';
import LayoutSection from './inspector/LayoutSection';
import SizeSection from './inspector/SizeSection';
import LinkSection from './inspector/LinkSection';
import StylesSection from './inspector/StylesSection';
import TypographySection from './inspector/TypographySection';
import EffectsSection from './inspector/EffectsSection';
import TransformsSection from './inspector/TransformsSection';
import OverlaysSection from './inspector/OverlaysSection';
import ScrollSection from './inspector/ScrollSection';
import AccessibilitySection from './inspector/AccessibilitySection';
import PageSettingsSection from './inspector/PageSettingsSection';
import LayoutConflictWarning from './inspector/LayoutConflictWarning';
import { CodeTab } from './inspector/CodeTab';
import { detectLayoutConflicts } from '../utils/conflictUtils';
import { 
  AlignLeft, AlignCenter, AlignRight, 
  Trash2, Plus, GripVertical, Settings, ChevronDown, ChevronUp, Link as LinkIcon, X,
  Type as TypeIcon, Image as ImageIcon, Video as VideoIcon, Square, Columns, 
  MousePointer, Sparkles, Sliders, Layers, Move, Hash, ShieldCheck, Check, 
  Lock, Unlock, Palette, Activity, PanelRightClose, Copy
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// Inline List Editor Component
const ListPropertyEditor = ({ 
  value, 
  onChange,
  propKey
}: { 
  value: any[]; 
  onChange: (newVal: any[]) => void;
  propKey: string;
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Default empty object structure based on propKey
  // For links, it's NavbarLink structure
  const handleAdd = () => {
    const newItem = propKey === 'links' 
      ? { id: 'link_' + uuidv4().substring(0, 8), label: 'New Link', url: '#', type: 'link' }
      : { id: 'item_' + uuidv4().substring(0, 8), label: 'New Item' };
    onChange([...(value || []), newItem]);
    setExpandedIndex(value ? value.length : 0);
  };

  const handleUpdate = (index: number, updates: any) => {
    const newItems = [...value];
    newItems[index] = { ...newItems[index], ...updates };
    onChange(newItems);
  };

  const handleRemove = (index: number) => {
    const newItems = [...value];
    newItems.splice(index, 1);
    onChange(newItems);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const items = Array.isArray(value) ? value : [];

  return (
    <div className="flex flex-col gap-2 bg-zinc-50 dark:bg-[#1A1A1A] rounded-lg border border-zinc-200 dark:border-[#333] p-2">
      {items.map((item, index) => (
        <div key={item.id || index} className="flex flex-col border border-zinc-200 dark:border-[#2A2A2A] rounded bg-white dark:bg-[#222]">
          {/* Header */}
          <div 
            className="flex items-center justify-between p-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-[#2A2A2A]"
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <GripVertical size={12} className="text-zinc-400 cursor-grab" />
              <span className="text-xs text-zinc-800 dark:text-[#CCC] font-medium truncate">{item.label || 'Item'}</span>
              {item.type === 'dropdown' && <span className="text-[9px] bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-1 rounded">Drop</span>}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={(e) => { e.stopPropagation(); handleRemove(index); }} className="p-1 hover:text-red-500 text-zinc-400">
                <Trash2 size={12} />
              </button>
              {expandedIndex === index ? <ChevronUp size={14} className="text-zinc-400" /> : <ChevronDown size={14} className="text-zinc-400" />}
            </div>
          </div>
          
          {/* Expanded Content */}
          {expandedIndex === index && (
            <div className="p-2 border-t border-zinc-200 dark:border-[#333] flex flex-col gap-2 bg-zinc-50 dark:bg-[#1E1E1E]">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-zinc-500">Label</span>
                <input 
                  type="text" 
                  value={item.label || ''} 
                  onChange={(e) => handleUpdate(index, { label: e.target.value })}
                  className="w-full bg-white dark:bg-[#2A2A2A] border border-zinc-200 dark:border-[#444] text-xs px-2 py-1 rounded outline-none focus:border-[#0099FF]"
                />
              </div>
              
              {propKey === 'links' && (
                <>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-zinc-500">Type</span>
                    <select
                      value={item.type || 'link'}
                      onChange={(e) => handleUpdate(index, { type: e.target.value, subLinks: e.target.value === 'dropdown' ? [] : undefined })}
                      className="w-full bg-white dark:bg-[#2A2A2A] border border-zinc-200 dark:border-[#444] text-xs px-2 py-1 rounded outline-none focus:border-[#0099FF]"
                    >
                      <option value="link">Normal Link</option>
                      <option value="dropdown">Dropdown Menu</option>
                    </select>
                  </div>
                  
                  {item.type === 'link' ? (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-zinc-500">URL</span>
                      <input 
                        type="text" 
                        value={item.url || ''} 
                        onChange={(e) => handleUpdate(index, { url: e.target.value })}
                        className="w-full bg-white dark:bg-[#2A2A2A] border border-zinc-200 dark:border-[#444] text-xs px-2 py-1 rounded outline-none focus:border-[#0099FF]"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 mt-1 p-2 bg-white dark:bg-[#222] border border-zinc-200 dark:border-[#333] rounded">
                      <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">Sub-links</span>
                      {(item.subLinks || []).map((sub: any, subIndex: number) => (
                        <div key={sub.id || subIndex} className="flex gap-2 items-center">
                          <input 
                            type="text" placeholder="Label" value={sub.label || ''}
                            onChange={(e) => {
                              const newSubs = [...(item.subLinks || [])];
                              newSubs[subIndex] = { ...newSubs[subIndex], label: e.target.value };
                              handleUpdate(index, { subLinks: newSubs });
                            }}
                            className="flex-1 min-w-0 bg-zinc-50 dark:bg-[#1A1A1A] border border-zinc-200 dark:border-[#444] text-[10px] px-1.5 py-1 rounded outline-none focus:border-[#0099FF]"
                          />
                          <input 
                            type="text" placeholder="URL" value={sub.url || ''}
                            onChange={(e) => {
                              const newSubs = [...(item.subLinks || [])];
                              newSubs[subIndex] = { ...newSubs[subIndex], url: e.target.value };
                              handleUpdate(index, { subLinks: newSubs });
                            }}
                            className="flex-1 min-w-0 bg-zinc-50 dark:bg-[#1A1A1A] border border-zinc-200 dark:border-[#444] text-[10px] px-1.5 py-1 rounded outline-none focus:border-[#0099FF]"
                          />
                          <button 
                            onClick={() => {
                              const newSubs = [...(item.subLinks || [])];
                              newSubs.splice(subIndex, 1);
                              handleUpdate(index, { subLinks: newSubs });
                            }}
                            className="p-1 hover:text-red-500 text-zinc-400"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => {
                          const newSubs = [...(item.subLinks || []), { id: 'sub_' + uuidv4().substring(0, 8), label: 'New', url: '#' }];
                          handleUpdate(index, { subLinks: newSubs });
                        }}
                        className="text-[10px] text-blue-500 hover:text-blue-600 flex items-center gap-1 justify-center py-1 mt-1 bg-blue-50 dark:bg-blue-900/20 rounded"
                      >
                        <Plus size={10} /> Add Sub-link
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      ))}
      <button 
        onClick={handleAdd}
        className="flex items-center justify-center gap-1.5 text-xs py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mt-1"
      >
        <Plus size={14} /> Add {propKey === 'links' ? 'Link' : 'Item'}
      </button>
    </div>
  );
};

type SectionId = 
  | 'layout' 
  | 'size' 
  | 'link' 
  | 'styles' 
  | 'typography' 
  | 'effects' 
  | 'transforms' 
  | 'overlays' 
  | 'scroll' 
  | 'accessibility';

interface SectionDefinition {
  id: SectionId;
  label: string;
  icon: React.ReactNode;
}

const ALL_OPTIONAL_SECTIONS: SectionDefinition[] = [
  { id: 'layout', label: 'Layout (Auto Layout / Grid)', icon: <Sliders size={13} className="text-zinc-900 dark:text-white" /> },
  { id: 'typography', label: 'Typography', icon: <TypeIcon size={13} className="text-zinc-900 dark:text-white" /> },
  { id: 'link', label: 'Link', icon: <LinkIcon size={13} className="text-zinc-900 dark:text-white" /> },
  { id: 'effects', label: 'Effects & Animations', icon: <Sparkles size={13} className="text-zinc-900 dark:text-white" /> },
  { id: 'transforms', label: 'Transforms 2D/3D', icon: <Move size={13} className="text-zinc-900 dark:text-white" /> },
  { id: 'overlays', label: 'Overlays & Modals', icon: <Layers size={13} className="text-zinc-900 dark:text-white" /> },
  { id: 'scroll', label: 'Scroll Target', icon: <Hash size={13} className="text-zinc-500" /> },
  { id: 'accessibility', label: 'Accessibility', icon: <ShieldCheck size={13} className="text-teal-500" /> },
];

export default function RightSidebar() {
  console.log('[RightSidebar] Render started');
  const selectedNodeId = useBuilderStore((state) => state?.selectedNodeId);
  const rootNodeId = useBuilderStore((state) => state?.rootNodeId);
  const nodes = useBuilderStore((state) => state?.nodes) || {};
  const activeBreakpoint = useBuilderStore((state) => state?.activeBreakpoint ?? 'lg');
  const updateNodeProps = useBuilderStore((state) => state?.updateNodeProps);
  const renameNode = useBuilderStore((state) => state?.renameNode);
  const deleteNode = useBuilderStore((state) => state?.deleteNode);
  const duplicateNode = useBuilderStore((state) => state?.duplicateNode);
  
  const addTemplateToLibrary = useLibraryStore((state) => state.addTemplateToLibrary);
  const setActiveLibraryId = useLibraryStore((state) => state.setActiveLibraryId);

  // Per-node active sections state cache
  const [nodeCustomSections, setNodeCustomSections] = useState<Record<string, SectionId[]>>({});
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'design' | 'layout' | 'style' | 'interactions' | 'code'>('design');
  const addMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setShowAddMenu(false);
      }
    };
    if (showAddMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddMenu]);

  const handleSaveAsTemplate = () => {
    if (!selectedNodeId) return;
    const collectedNodes: Record<string, any> = {};
    const collectNode = (id: string) => {
      const node = nodes[id];
      if (!node) return;
      collectedNodes[id] = JSON.parse(JSON.stringify(node));
      if (node.childrenIds) {
        node.childrenIds.forEach(collectNode);
      }
    };
    collectNode(selectedNodeId);
    
    // Set parentId of the root node of this template to null
    if (collectedNodes[selectedNodeId]) {
      collectedNodes[selectedNodeId].parentId = null;
    }

    const templateName = (nodes[selectedNodeId]?.name || 'Component') + " Template";
    
    addTemplateToLibrary({
      id: `tpl-${Date.now()}`,
      name: templateName,
      icon: 'Layers',
      componentType: 'CustomTemplate',
      createBlueprint: () => ({
        rootNodeId: selectedNodeId,
        nodeData: collectedNodes
      })
    });
    
    // Switch to Custom Library to see it
    setActiveLibraryId('my-custom-templates');
    
    showToast(`Template '${templateName}' saved!`, 'Added to My Custom Templates library.', 'success');
  };

  const selectedNode = selectedNodeId ? nodes[selectedNodeId] : null;
  const isRoot = selectedNodeId === rootNodeId;

  // Context-Aware: If no node is selected, render Page Settings
  if (!selectedNode) {
    return (
      <aside 
        id="framer-right-inspector" 
        className="w-[280px] bg-zinc-50 dark:bg-[#111] border-l border-zinc-200 dark:border-[#222] flex flex-col flex-shrink-0 z-20 text-[12px] select-none h-full overflow-y-auto custom-scrollbar text-zinc-800 dark:text-[#CCC]"
        style={{ width: '280px', minWidth: '280px', display: 'flex', position: 'relative' }}
      >
        <div className="px-3 py-2.5 border-b border-zinc-200 dark:border-[#1E1E1E] bg-zinc-100/70 dark:bg-[#141414] flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
          <span className="font-semibold text-zinc-900 dark:text-white text-xs">Settings</span>
          <button 
            onClick={() => useBuilderStore.getState().toggleRightSidebar()}
            className="p-1 hover:bg-zinc-200 dark:hover:bg-[#2A2A2A] rounded text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            title="Close Sidebar"
          >
            <PanelRightClose className="w-4 h-4" />
          </button>
        </div>
        <PageSettingsSection />
      </aside>
    );
  }

  const baseStyles = selectedNode.responsiveStyles?.base || {};
  const currentBreakpointStyles = selectedNode.responsiveStyles?.[activeBreakpoint] || {};
  const effectiveStyles: NodeStyleProps = { ...baseStyles, ...currentBreakpointStyles } as NodeStyleProps;

  // 1. Context-Aware Default Sections Calculation
  const isTextElement = selectedNode.type === 'Text' || selectedNode.type === 'Button';
  const isContainerElement = selectedNode.type === 'Frame' || selectedNode.type === 'Stack' || selectedNode.type === 'Grid' || selectedNode.type === 'Masonry' || isRoot;
  const isMediaElement = selectedNode.type === 'Image' || selectedNode.type === 'Video';

  const getDefaultSectionsForNode = (): SectionId[] => {
    if (isContainerElement) {
      return ['layout', 'size', 'styles', 'effects', 'transforms'];
    }
    if (isTextElement) {
      return ['size', 'typography', 'styles', 'effects'];
    }
    if (isMediaElement) {
      return ['size', 'styles', 'effects', 'transforms'];
    }
    return ['size', 'styles', 'effects'];
  };

  const activeSections: SectionId[] = nodeCustomSections[selectedNode.id] || getDefaultSectionsForNode();

  const handleToggleSection = (sectionId: SectionId) => {
    const current = activeSections;
    let next: SectionId[];
    if (current.includes(sectionId)) {
      next = current.filter(id => id !== sectionId);
    } else {
      next = [...current, sectionId];
    }
    setNodeCustomSections(prev => ({
      ...prev,
      [selectedNode.id]: next
    }));
  };

  const handleRemoveSection = (sectionId: SectionId) => {
    const next = activeSections.filter(id => id !== sectionId);
    setNodeCustomSections(prev => ({
      ...prev,
      [selectedNode.id]: next
    }));
  };

  const getNodeIcon = () => {
    if (isRoot) return <Square size={14} className="text-zinc-900 dark:text-white" />;
    switch (selectedNode.type) {
      case 'Text': return <TypeIcon size={14} className="text-zinc-900 dark:text-white dark:text-white" />;
      case 'Button': return <MousePointer size={14} className="text-zinc-900 dark:text-white dark:text-white" />;
      case 'Image': return <ImageIcon size={14} className="text-zinc-900 dark:text-white dark:text-white" />;
      case 'Video': return <VideoIcon size={14} className="text-zinc-900 dark:text-white dark:text-white" />;
      case 'Grid': return <Columns size={14} className="text-pink-500 dark:text-pink-400" />;
      default: return <Square size={14} className="text-zinc-900 dark:text-white" />;
    }
  };

  const currentDisplayName = isRoot
    ? (activeBreakpoint === 'lg' ? 'Desktop' : activeBreakpoint === 'md' ? 'Tablet' : 'Phone')
    : selectedNode.name;

  const allConflicts = detectLayoutConflicts(selectedNode, effectiveStyles);
  const layoutGroupConflicts = allConflicts.filter(c => c.type === 'grid_flex' || c.type === 'size_constraint' || c.type === 'position_flow');
  const generalConflicts = allConflicts.filter(c => c.type !== 'grid_flex' && c.type !== 'leaf_layout' && c.type !== 'size_constraint' && c.type !== 'position_flow');

  const hasActiveInteractivity = activeSections.some(s => ['effects', 'overlays', 'link', 'scroll', 'accessibility'].includes(s));
  const hasActiveContent = isTextElement || selectedNode.type === 'Video' || activeSections.includes('typography');
  const hasActiveAppearance = activeSections.includes('styles') || activeSections.includes('transforms');

  const breakpointLabel = activeBreakpoint === 'lg' ? 'Desktop' : activeBreakpoint === 'md' ? 'Tablet' : 'Phone';
  const hasBreakpointOverrides = Object.keys(currentBreakpointStyles).length > 0;

  return (
    <aside 
      id="framer-right-inspector" 
      className="w-[280px] bg-zinc-50 dark:bg-[#111] border-l border-zinc-200 dark:border-[#222] flex flex-col flex-shrink-0 z-20 text-[12px] select-none h-full text-zinc-800 dark:text-[#CCC]"
      style={{ width: '280px', minWidth: '280px', display: 'flex', position: 'relative' }}
    >
      {/* Element Header & Quick Actions */}
      <div className="p-2.5 border-b border-zinc-200 dark:border-[#1E1E1E] bg-zinc-100/70 dark:bg-[#141414] flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-1 min-w-0 mr-1.5">
          {getNodeIcon()}
          {isRoot ? (
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-zinc-900 dark:text-white font-semibold text-xs truncate">
                {currentDisplayName}
              </span>
              <span className="text-[10px] bg-zinc-200 dark:bg-[#222] text-zinc-700 dark:text-[#AAA] px-1.5 py-0.5 rounded font-medium">
                Root
              </span>
            </div>
          ) : (
            <input
              type="text"
              value={selectedNode.name}
              onChange={(e) => renameNode(selectedNode.id, e.target.value)}
              className="bg-transparent text-zinc-900 dark:text-white font-medium text-xs truncate outline-none hover:bg-zinc-200/50 dark:hover:bg-[#202020] px-1 py-0.5 rounded focus:bg-white dark:focus:bg-[#1A1A1A] focus:border focus:border-zinc-400 dark:focus:border-zinc-500 min-w-0"
              title="Click to rename layer"
            />
          )}

          {allConflicts.length > 0 && (
            <LayoutConflictWarning conflicts={allConflicts} variant="compact" />
          )}
        </div>

        <div className="flex items-center gap-1">
          <span className="hidden sm:inline-flex items-center gap-1 rounded-md border border-zinc-200 dark:border-zinc-700/70 bg-white/70 dark:bg-zinc-900/50 px-1.5 py-1 text-[10px] font-medium text-zinc-500 dark:text-zinc-400" title={`${breakpointLabel} breakpoint`}>
            <span className={clsx("h-1.5 w-1.5 rounded-full", hasBreakpointOverrides ? "bg-blue-500" : "bg-zinc-300 dark:bg-zinc-600")} />
            {breakpointLabel}
          </span>
          {!isRoot && (
            <button
              onClick={() => {
                const nextLocked = !selectedNode.props?.locked;
                updateNodeProps(selectedNode.id, { locked: nextLocked });
                showToast(nextLocked ? `Locked '${selectedNode.name}'` : `Unlocked '${selectedNode.name}'`, undefined, 'info');
              }}
              className={clsx(
                "p-1 rounded transition-colors cursor-pointer",
                selectedNode.props?.locked 
                  ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 dark:bg-zinc-100 dark:bg-zinc-800" 
                  : "text-zinc-500 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-[#252525]"
              )}
              title={selectedNode.props?.locked ? "Unlock Layer (⌘L)" : "Lock Layer (⌘L)"}
            >
              {selectedNode.props?.locked ? <Lock size={13} /> : <Unlock size={13} />}
            </button>
          )}
          <button
            onClick={handleSaveAsTemplate}
            className="p-1.5 text-zinc-500 hover:text-zinc-800 dark:hover:text-white rounded-md hover:bg-zinc-200 dark:hover:bg-[#2C2C2C] transition-colors"
            title="Save as Template"
          >
            <Plus size={14} />
          </button>
          {!isRoot && (
            <>
              <button
                onClick={() => duplicateNode(selectedNode.id)}
                className="p-1 rounded text-zinc-500 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-[#252525] transition-colors cursor-pointer"
                title="Duplicate Layer"
              >
                <Copy size={13} />
              </button>
              <button
                onClick={() => deleteNode(selectedNode.id)}
                className="p-1 rounded text-zinc-500 dark:text-[#777] hover:text-red-500 dark:hover:text-red-400 hover:bg-zinc-200/60 dark:hover:bg-[#252525] transition-colors cursor-pointer"
                title="Delete Layer"
              >
                <Trash2 size={13} />
              </button>
            </>
          )}
          <button 
            onClick={() => useBuilderStore.getState().toggleRightSidebar()}
            className="p-1 text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-[#2A2A2A] rounded ml-1 transition-colors"
            title="Close Sidebar"
          >
            <PanelRightClose className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Inspector Scrollable Body with Clean Visual Grouping */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        {selectedNode.props?.locked && (
          <div className="m-3 p-2.5 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-lg flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2 text-zinc-700 dark:text-[#AAA] text-xs">
              <Lock size={14} className="shrink-0" />
              <span className="font-medium text-[11px] leading-tight">Layer is locked. Properties cannot be edited until unlocked.</span>
            </div>
            <button
              onClick={() => {
                updateNodeProps(selectedNode.id, { locked: false });
                showToast(`Unlocked '${selectedNode.name}'`, undefined, 'info');
              }}
              className="px-2.5 py-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 rounded text-[10px] font-semibold shrink-0 shadow-sm transition-colors cursor-pointer"
            >
              Unlock
            </button>
          </div>
        )}
        
        <div className={clsx("flex flex-col transition-opacity pb-6", selectedNode.props?.locked && "pointer-events-none opacity-40 select-none")}>

          {/* Global / General Unresolved Conflicts Banner (if any) */}
          {generalConflicts.length > 0 && (
            <div className="px-3 pt-2">
              <LayoutConflictWarning conflicts={generalConflicts} variant="banner" />
            </div>
          )}

          {/* Tabs UI */}
          <div className="sticky top-0 z-10 flex border-b border-zinc-200 dark:border-[#1E1E1E] bg-zinc-50/95 dark:bg-[#111]/95 backdrop-blur">
            <button
              onClick={() => setActiveTab('design')}
              className={clsx(
                "flex-1 py-2.5 text-[11px] font-semibold transition-colors border-b-2",
                activeTab === 'design' ? "border-[#0099FF] text-zinc-900 dark:text-white" : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              )}
            >
              Design
            </button>
            <button
              onClick={() => setActiveTab('layout')}
              className={clsx(
                "flex-1 py-2.5 text-[11px] font-semibold transition-colors border-b-2",
                activeTab === 'layout' ? "border-[#0099FF] text-zinc-900 dark:text-white" : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              )}
            >
              Layout
            </button>
            <button
              onClick={() => setActiveTab('style')}
              className={clsx(
                "flex-1 py-2.5 text-[11px] font-semibold transition-colors border-b-2",
                activeTab === 'style' ? "border-[#0099FF] text-zinc-900 dark:text-white" : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              )}
            >
              Style
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={clsx(
                "flex-1 py-2.5 text-[11px] font-semibold transition-colors border-b-2",
                activeTab === 'code' ? "border-[#0099FF] text-zinc-900 dark:text-white" : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              )}
            >
              Code
            </button>
          </div>

          {/* DESIGN TAB */}
          {activeTab === 'design' && (
            <div className="flex flex-col">
              {/* Element-Specific Raw Content Properties */}
              {selectedNode.type === 'Text' && (
                <div className="border-b border-zinc-200 dark:border-[#1E1E1E] py-2.5 px-3">
                  <span className="text-[11px] font-semibold text-zinc-500 dark:text-white tracking-wider capitalize block mb-1.5">Text Content</span>
                  <textarea
                    rows={3}
                    value={selectedNode.props.text || ''}
                    onChange={(e) => updateNodeProps(selectedNode.id, { text: e.target.value })}
                    placeholder="Enter text..."
                    className="w-full bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs p-2 rounded-lg outline-none resize-none focus:border-zinc-400 dark:focus:border-zinc-500 shadow-xs"
                  />
                </div>
              )}

              {selectedNode.type === 'Button' && (
                <div className="border-b border-zinc-200 dark:border-[#1E1E1E] py-2.5 px-3">
                  <span className="text-[11px] font-semibold text-zinc-500 dark:text-white tracking-wider capitalize block mb-1.5">Button Label</span>
                  <input
                    type="text"
                    value={selectedNode.props.text || 'Click me'}
                    onChange={(e) => updateNodeProps(selectedNode.id, { text: e.target.value })}
                    className="w-full bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-1.5 rounded-lg outline-none focus:border-zinc-400 dark:focus:border-zinc-500 shadow-xs"
                  />
                </div>
              )}

              {selectedNode.type === 'Image' && (
                <div className="border-b border-zinc-200 dark:border-[#1E1E1E] py-2.5 px-3 flex flex-col gap-2">
                  <span className="text-[11px] font-semibold text-zinc-500 dark:text-white tracking-wider capitalize">Image Properties</span>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-zinc-600 dark:text-[#A0A0A0]">Image URL</span>
                    <input
                      type="text"
                      value={selectedNode.props.src || ''}
                      onChange={(e) => updateNodeProps(selectedNode.id, { src: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-1.5 rounded-lg outline-none focus:border-zinc-400 dark:focus:border-zinc-500 shadow-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="text-[11px] text-zinc-600 dark:text-[#A0A0A0]">Alt Text</span>
                    <input
                      type="text"
                      value={selectedNode.props.alt || ''}
                      onChange={(e) => updateNodeProps(selectedNode.id, { alt: e.target.value })}
                      placeholder="Describe Image..."
                      className="w-full bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-1.5 rounded-lg outline-none focus:border-zinc-400 dark:focus:border-zinc-500 shadow-xs"
                    />
                  </div>
                </div>
              )}

              {selectedNode.type === 'Video' && (
                <div className="border-b border-zinc-200 dark:border-[#1E1E1E] py-2.5 px-3 flex flex-col gap-2">
                  <span className="text-[11px] font-semibold text-zinc-500 dark:text-white tracking-wider capitalize">Video Properties</span>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-zinc-600 dark:text-[#A0A0A0]">Video URL / Embed</span>
                    <input
                      type="text"
                      value={selectedNode.props.src || ''}
                      onChange={(e) => updateNodeProps(selectedNode.id, { src: e.target.value })}
                      placeholder="https://commondatastorage.googleapis.com/... or YouTube URL"
                      className="w-full bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-1.5 rounded-lg outline-none focus:border-zinc-400 dark:focus:border-zinc-500 shadow-xs"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Autoplay / Loop</span>
                    <input
                      type="checkbox"
                      checked={selectedNode.props.autoPlay !== false}
                      onChange={(e) => updateNodeProps(selectedNode.id, { autoPlay: e.target.checked, loop: e.target.checked })}
                      className="accent-[#0099FF] rounded cursor-pointer"
                    />
                  </div>
                </div>
              )}
              
              {/* COMPONENT-SPECIFIC PROP CONTROLS */}
              {componentRegistry[selectedNode.type]?.propControls && (
                <div className="border-b border-zinc-200 dark:border-[#1E1E1E] py-2.5 px-3 flex flex-col gap-3">
                  <span className="text-[11px] font-semibold text-zinc-500 dark:text-white tracking-wider capitalize">Component Settings</span>
                  
                  {Object.entries(componentRegistry[selectedNode.type].propControls!).map(([propKey, control]) => {
                    const value = selectedNode.props[propKey] ?? componentRegistry[selectedNode.type].defaultProps[propKey];
                    
                    return (
                      <div key={propKey} className="flex flex-col gap-1.5">
                        <span className="text-[11px] text-zinc-600 dark:text-[#A0A0A0]">{control.label || propKey}</span>
                        
                        {control.type === 'string' && (
                          <input
                            type="text"
                            value={value || ''}
                            onChange={(e) => updateNodeProps(selectedNode.id, { [propKey]: e.target.value })}
                            className="w-full bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-1.5 rounded-lg outline-none focus:border-zinc-400 dark:focus:border-zinc-500 shadow-xs"
                          />
                        )}
                        
                        {control.type === 'boolean' && (
                          <input
                            type="checkbox"
                            checked={!!value}
                            onChange={(e) => updateNodeProps(selectedNode.id, { [propKey]: e.target.checked })}
                            className="accent-[#0099FF] rounded cursor-pointer"
                          />
                        )}
                        
                        {control.type === 'select' && control.options && (
                          <select
                            value={value || ''}
                            onChange={(e) => updateNodeProps(selectedNode.id, { [propKey]: e.target.value })}
                            className="w-full bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-1.5 rounded-lg outline-none focus:border-zinc-400 dark:focus:border-zinc-500 shadow-xs"
                          >
                            {control.options.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        )}

                        {control.type === 'list' && (
                          <ListPropertyEditor 
                            value={Array.isArray(value) ? value : []}
                            onChange={(newVal) => updateNodeProps(selectedNode.id, { [propKey]: newVal })}
                            propKey={propKey}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* LAYOUT TAB */}
          {activeTab === 'layout' && (
            <div className="flex flex-col">
              <div className="px-3 py-2 bg-zinc-100/50 dark:bg-[#111] flex items-center justify-between border-b border-zinc-200/70 dark:border-[#1E1E1E]">
                <div className="flex items-center gap-1.5 text-zinc-700 dark:text-white font-bold text-xs capitalize tracking-wider">
                  <Sliders size={12} className="text-zinc-500 dark:text-[#888]" />
                  <span>Layout & Spacing</span>
                </div>
                {layoutGroupConflicts.length > 0 && (
                  <LayoutConflictWarning conflicts={layoutGroupConflicts} variant="badge" badgeLabel="Conflict Detected" />
                )}
              </div>
              
              <AlignToolbar />
              <PositionSection effectiveStyles={effectiveStyles} />
              
              {activeSections.includes('layout') && (
                <LayoutSection effectiveStyles={effectiveStyles} onRemove={() => handleRemoveSection('layout')} />
              )}
              {activeSections.includes('size') && (
                <SizeSection effectiveStyles={effectiveStyles} />
              )}
            </div>
          )}

          {/* STYLE TAB */}
          {activeTab === 'style' && (
            <div className="flex flex-col">
              
              {/* RAW TAILWIND CLASSES */}
              <div className="border-b border-zinc-200 dark:border-[#1E1E1E] py-2.5 px-3">
                <span className="text-[11px] font-semibold text-zinc-500 dark:text-white tracking-wider capitalize block mb-1.5">Tailwind Classes</span>
                <textarea
                  rows={2}
                  value={selectedNode.props.className || ''}
                  onChange={(e) => updateNodeProps(selectedNode.id, { className: e.target.value })}
                  placeholder="e.g. text-4xl font-bold text-center"
                  className="w-full bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs p-2 rounded-lg outline-none resize-none focus:border-zinc-400 dark:focus:border-zinc-500 shadow-xs font-mono"
                />
              </div>

              {hasActiveContent && activeSections.includes('typography') && (
                <div className="border-b border-zinc-200 dark:border-[#1E1E1E]">
                  <div className="px-3 py-2 bg-zinc-100/50 dark:bg-[#111] flex items-center gap-1.5 text-zinc-700 dark:text-white font-bold text-xs capitalize tracking-wider border-b border-zinc-200/70 dark:border-[#1E1E1E]">
                    <TypeIcon size={12} className="text-zinc-500 dark:text-[#888]" />
                    <span>Typography</span>
                  </div>
                  <TypographySection effectiveStyles={effectiveStyles} />
                </div>
              )}

              {hasActiveAppearance && (
                <div className="border-b border-zinc-200 dark:border-[#1E1E1E]">
                  <div className="px-3 py-2 bg-zinc-100/50 dark:bg-[#111] flex items-center gap-1.5 text-zinc-700 dark:text-white font-bold text-xs capitalize tracking-wider border-b border-zinc-200/70 dark:border-[#1E1E1E]">
                    <Palette size={12} className="text-zinc-500 dark:text-[#888]" />
                    <span>Appearance & Styles</span>
                  </div>
                  {activeSections.includes('styles') && <StylesSection effectiveStyles={effectiveStyles} />}
                  {activeSections.includes('transforms') && <TransformsSection effectiveStyles={effectiveStyles} />}
                </div>
              )}

              {hasActiveInteractivity && (
                <div className="border-b border-zinc-200 dark:border-[#1E1E1E]">
                  <div className="px-3 py-2 bg-zinc-100/50 dark:bg-[#111] flex items-center gap-1.5 text-zinc-700 dark:text-white font-bold text-xs capitalize tracking-wider border-b border-zinc-200/70 dark:border-[#1E1E1E]">
                    <Activity size={12} className="text-zinc-500 dark:text-[#888]" />
                    <span>Effects & Behaviors</span>
                  </div>
                  {activeSections.includes('effects') && <EffectsSection effectiveStyles={effectiveStyles} />}
                  {activeSections.includes('overlays') && <OverlaysSection effectiveStyles={effectiveStyles} />}
                  {activeSections.includes('link') && <LinkSection effectiveStyles={effectiveStyles} />}
                  {activeSections.includes('scroll') && <ScrollSection effectiveStyles={effectiveStyles} />}
                  {activeSections.includes('accessibility') && <AccessibilitySection effectiveStyles={effectiveStyles} />}
                </div>
              )}
            </div>
          )}
          {/* CODE TAB */}
          {activeTab === 'code' && (
            <CodeTab />
          )}
        </div>

        {/* ======================================================== */}
        {/* ADD / MANAGE PROPERTIES BUTTON (Context-Aware Selector)   */}
        {/* ======================================================== */}
        <div className="p-3 relative" ref={addMenuRef}>
          <button
            onClick={() => setShowAddMenu(prev => !prev)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 dark:bg-[#222] dark:hover:bg-[#333] border border-dashed border-zinc-300 dark:border-[#444] text-zinc-700 dark:text-[#CCC] hover:text-zinc-900 dark:hover:text-white font-medium text-xs transition-colors cursor-pointer"
          >
            <Plus size={13} className="text-zinc-900 dark:text-white" />
            <span>Add Property...</span>
          </button>

          {/* Add Property Dropdown Menu */}
          {showAddMenu && (
            <div className="absolute bottom-12 left-3 right-3 bg-white dark:bg-[#111] border border-zinc-200 dark:border-[#2C2C2C] rounded-xl shadow-2xl z-50 p-1.5 select-none animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 py-1 text-[10px] font-semibold text-zinc-400 dark:text-[#777] uppercase tracking-wider">
                Available Properties
              </div>
              <div className="flex flex-col gap-0.5 mt-1 max-h-60 overflow-y-auto custom-scrollbar">
                {ALL_OPTIONAL_SECTIONS.map((sec) => {
                  const isActive = activeSections.includes(sec.id);
                  return (
                    <button
                      key={sec.id}
                      onClick={() => {
                        handleToggleSection(sec.id);
                      }}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-zinc-100 dark:hover:bg-[#252525] text-zinc-800 dark:text-[#EEE] transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {sec.icon}
                        <span>{sec.label}</span>
                      </div>
                      {isActive && <Check size={13} className="text-zinc-900 dark:text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
