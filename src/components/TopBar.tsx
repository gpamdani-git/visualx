import React, { useState, useRef, useEffect } from 'react';
import { useStore } from 'zustand';
import { 
  Play, 
  Sparkles, 
  Plus, 
  Type, 
  LayoutPanelLeft, 
  ChevronDown, 
  Code,
  Search,
  Database,
  Globe,
  BarChart3,
  Settings,
  LayoutGrid,
  Command,
  ChevronRight,
  HelpCircle,
  User,
  Check,
  Save,
  Undo2,
  Redo2,
  Copy,
  Trash2,
  Home,
  Frame as FrameIcon,
  Columns2,
  Grid3X3,
  GalleryVerticalEnd,
  Image as ImageIcon,
  Video as VideoIcon,
  Layers,
  Square,
  Download
} from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import { Keyboard } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { showToast } from '../store/toastStore';

interface TopBarProps {
  onAiClick: () => void;
  onExportClick: () => void;
}

export default function TopBar({ onAiClick, onExportClick }: TopBarProps) {
  const setPreviewMode = useBuilderStore((state) => state?.setPreviewMode);
  const addNode = useBuilderStore((state) => state?.addNode);
  const addFrame = useBuilderStore((state) => state?.addFrame);
  const selectedNodeIds = useBuilderStore((state) => state?.selectedNodeIds) || [];
  const groupSelectedNodes = useBuilderStore((state) => state?.groupSelectedNodes);
  const addStack = useBuilderStore((state) => state?.addStack);
  const addGrid = useBuilderStore((state) => state?.addGrid);
  const addMasonry = useBuilderStore((state) => state?.addMasonry);
  const addImage = useBuilderStore((state) => state?.addImage);
  const addVideo = useBuilderStore((state) => state?.addVideo);
  const rootNodeId = useBuilderStore((state) => state?.rootNodeId);
  const selectedNodeId = useBuilderStore((state) => state?.selectedNodeId);

  const activeProjectId = useProjectStore((state) => state?.activeProjectId);
  const projects = useProjectStore((state) => state?.projects) || [];
  const goToDashboard = useProjectStore((state) => state?.goToDashboard);
  const saveActiveProject = useProjectStore((state) => state?.saveActiveProject);
  const deleteProject = useProjectStore((state) => state?.deleteProject);
  const exportProjectJson = useProjectStore((state) => state?.exportProjectJson);
  const isSaving = useProjectStore((state) => state?.isSaving) ?? false;
  const lastSavedAt = useProjectStore((state) => state?.lastSavedAt) ?? null;

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [addLayoutOpen, setAddLayoutOpen] = useState(false);
  const [previewTooltip, setPreviewTooltip] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const addLayoutRef = useRef<HTMLDivElement>(null);

  const currentProject = projects.find(p => p.id === activeProjectId);
  const projectTitle = currentProject?.title || 'Canvas (copy)';

  const targetNodeId = selectedNodeId || rootNodeId;
  
  // Zundo Temporal State (for Undo/Redo)
  const pastStatesLength = useStore(useBuilderStore.temporal as any, (state: any) => state?.pastStates?.length ?? 0);
  const futureStatesLength = useStore(useBuilderStore.temporal as any, (state: any) => state?.futureStates?.length ?? 0);
  const undo = useStore(useBuilderStore.temporal as any, (state: any) => state?.undo);
  const redo = useStore(useBuilderStore.temporal as any, (state: any) => state?.redo);
  
  const canUndo = pastStatesLength > 0;
  const canRedo = futureStatesLength > 0;

  const handleUndo = () => {
    if (canUndo && typeof undo === 'function') {
      undo();
    }
  };

  const handleRedo = () => {
    if (canRedo && typeof redo === 'function') {
      redo();
    }
  };

  // Auto-close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (addLayoutRef.current && !addLayoutRef.current.contains(event.target as Node)) {
        setAddLayoutOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Global Keyboard Shortcuts for Layout & Media addition
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input, textarea, or contentEditable element
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return;
      }

      // Check if command/ctrl is pressed (avoid interfering with browser shortcuts)
      if (e.metaKey || e.ctrlKey) {
        if (e.key.toLowerCase() === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            if (canRedo) redo();
          } else {
            if (canUndo) undo();
          }
        }
        return;
      }
      
      if (e.altKey) return;

      const key = e.key.toLowerCase();
      if (key === 'f') {
        e.preventDefault();
        addFrame(targetNodeId);
      } else if (key === 's') {
        e.preventDefault();
        addStack(targetNodeId, 'row');
      } else if (key === 'g') {
        e.preventDefault();
        addGrid(targetNodeId, 3);
      } else if (key === 'm') {
        e.preventDefault();
        addMasonry(targetNodeId, 3);
      } else if (key === 'i') {
        e.preventDefault();
        addImage(targetNodeId);
      } else if (key === 'v') {
        e.preventDefault();
        addVideo(targetNodeId);
      } else if (key === 't') {
        e.preventDefault();
        addNode(targetNodeId, 'Text');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [targetNodeId, addFrame, addStack, addGrid, addMasonry, addImage, addVideo, addNode, canUndo, canRedo, undo, redo]);

  const handleGoToDashboard = () => {
    setMenuOpen(false);
    saveActiveProject();
    goToDashboard();
  };

  const handleManualSave = () => {
    if (activeProjectId) {
      saveActiveProject(undefined, { showNotification: true });
    }
  };

  const handleConfirmDelete = () => {
    if (activeProjectId) {
      const title = currentProject?.title || 'Project';
      deleteProject(activeProjectId);
      showToast(`Project '${title}' deleted`, 'Returning to Dashboard', 'info');
      setDeleteConfirmOpen(false);
      goToDashboard();
    }
  };

  return (
    <>
    <KeyboardShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    <div className="h-[48px] border-b border-zinc-200 dark:border-[#222] flex items-center justify-between px-3 flex-shrink-0 relative z-[9999] bg-white dark:bg-[#111111] transition-colors">
      {/* Left side: Canvas dropdown button & Add Layout/Media menu */}
      <div className="flex items-center space-x-2">
        {/* Main Canvas / Navigation Menu */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-md transition-colors text-zinc-600 dark:text-[#999] hover:text-zinc-900 dark:hover:text-white ${
              menuOpen ? 'bg-zinc-100 dark:bg-[#262626] text-zinc-900 dark:text-white' : 'hover:bg-zinc-100 dark:hover:bg-[#222]'
            }`}
          >
            <LayoutPanelLeft className="w-4 h-4" />
            <span className="font-medium text-xs">Canvas</span>
            <ChevronDown className="w-3 h-3 text-zinc-400 dark:text-[#999]" />
          </button>

          {/* FRAMER STYLE MAIN DROPDOWN MENU */}
          {menuOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-64 bg-white dark:bg-[#18181A] border border-zinc-200 dark:border-[#2B2B30] rounded-xl shadow-2xl p-1.5 z-50 text-xs text-zinc-700 dark:text-[#CCCCCC] animate-in fade-in zoom-in-95 duration-100 max-h-[85vh] overflow-y-auto">
              {/* Search input in menu */}
              <div className="relative px-1 pb-1 mb-1">
                <div className="flex items-center bg-zinc-100 dark:bg-[#222226] border border-zinc-200 dark:border-[#303036] rounded-md px-2 py-1.5">
                  <Search className="w-3.5 h-3.5 text-zinc-400 dark:text-[#777] mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Type to search..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    className="w-full bg-transparent text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-[#777] focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* Core Views */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-zinc-100 dark:bg-[#25252C] text-zinc-900 dark:text-[#E1E1E6] hover:text-white font-medium"
                >
                  <div className="flex items-center gap-2">
                    <LayoutPanelLeft className="w-3.5 h-3.5" />
                    <span>Canvas</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 dark:text-[#888]">⌥1</span>
                </button>

                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-[#25252C] text-zinc-600 dark:text-[#BBB] hover:text-zinc-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-zinc-400 dark:text-[#888]" />
                    <span>CMS</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 dark:text-[#888]">⌥2</span>
                </button>

                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-[#25252C] text-zinc-600 dark:text-[#BBB] hover:text-zinc-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-zinc-400 dark:text-[#888]" />
                    <span>Localization</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 dark:text-[#888]">⌥3</span>
                </button>

                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-[#25252C] text-zinc-600 dark:text-[#BBB] hover:text-zinc-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-3.5 h-3.5 text-zinc-400 dark:text-[#888]" />
                    <span>Analytics</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 dark:text-[#888]">⌥4</span>
                </button>

                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-[#25252C] text-zinc-600 dark:text-[#BBB] hover:text-zinc-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-2">
                    <Settings className="w-3.5 h-3.5 text-zinc-400 dark:text-[#888]" />
                    <span>Settings</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 dark:text-[#888]">⌥5</span>
                </button>
              </div>

              {/* Divider */}
              <div className="h-px bg-zinc-200 dark:bg-[#282830] my-1.5" />

              {/* PRIMARY ACTION: GO TO DASHBOARD */}
              <button
                onClick={handleGoToDashboard}
                className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-[#25252C] text-zinc-700 dark:text-[#DDD] hover:text-zinc-900 dark:hover:text-white font-semibold transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Home className="w-3.5 h-3.5 text-zinc-500 dark:text-[#888] group-hover:text-zinc-900 dark:group-hover:text-white" />
                  <span className="text-zinc-700 dark:text-[#DDD] group-hover:text-zinc-900 dark:group-hover:text-white">Go to Dashboard</span>
                </div>
                <span className="text-[10px] text-zinc-400 dark:text-[#888]">Save & Exit</span>
              </button>

              {/* Quick Actions (AI assistant) */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onAiClick();
                }}
                className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-[#25252C] text-zinc-700 dark:text-[#DDD] hover:text-zinc-900 dark:hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-400 dark:text-[#888] group-hover:text-zinc-900 dark:group-hover:text-white" />
                  <span>Quick Actions</span>
                </div>
                <span className="text-[10px] text-zinc-400 dark:text-[#888]">⌘K</span>
              </button>

              {/* Divider */}
              <div className="h-px bg-zinc-200 dark:bg-[#282830] my-1.5" />

              {/* Tool Categories Submenus */}
              <div className="flex flex-col gap-0.5 text-zinc-600 dark:text-[#AAA]">
                <button 
                  onClick={handleManualSave}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-[#25252C] hover:text-zinc-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-2">
                    <Save className="w-3.5 h-3.5 text-zinc-400 dark:text-[#777]" />
                    <span>Save Project</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 dark:text-[#888]">⌘S</span>
                </button>

                <button 
                  onClick={() => {
                    setMenuOpen(false);
                    if (activeProjectId) exportProjectJson(activeProjectId);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-[#25252C] hover:text-zinc-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-3.5 h-3.5 text-zinc-400 dark:text-[#777]" />
                    <span>Export Project JSON</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-zinc-400 dark:text-[#666]" />
                </button>

                <button 
                  onClick={() => {
                    setMenuOpen(false);
                    onExportClick();
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-[#25252C] hover:text-zinc-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-2">
                    <Code className="w-3.5 h-3.5 text-zinc-400 dark:text-[#777]" />
                    <span>Export React Code</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-zinc-400 dark:text-[#666]" />
                </button>

                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-[#25252C] hover:text-zinc-900 dark:hover:text-white cursor-pointer">
                  <span>File</span>
                  <ChevronRight className="w-3 h-3 text-zinc-400 dark:text-[#666]" />
                </div>
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-[#25252C] hover:text-zinc-900 dark:hover:text-white cursor-pointer">
                  <span>Edit</span>
                  <ChevronRight className="w-3 h-3 text-zinc-400 dark:text-[#666]" />
                </div>
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-[#25252C] hover:text-zinc-900 dark:hover:text-white cursor-pointer">
                  <span>Layout</span>
                  <ChevronRight className="w-3 h-3 text-zinc-400 dark:text-[#666]" />
                </div>
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-[#25252C] hover:text-zinc-900 dark:hover:text-white cursor-pointer">
                  <span>Preferences</span>
                  <ChevronRight className="w-3 h-3 text-zinc-400 dark:text-[#666]" />
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-zinc-200 dark:bg-[#282830] my-1.5" />

              <div 
                className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-[#25252C] hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                onClick={() => {
                  setShortcutsOpen(true);
                  setMenuOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <Keyboard className="w-3.5 h-3.5 text-zinc-400 dark:text-[#777]" />
                  <span>Keyboard Shortcuts</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-[#25252C] hover:text-zinc-900 dark:hover:text-white cursor-pointer">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-zinc-400 dark:text-[#777]" />
                  <span>Help</span>
                </div>
                <ChevronRight className="w-3 h-3 text-zinc-400 dark:text-[#666]" />
              </div>

              <div className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-[#25252C] hover:text-zinc-900 dark:hover:text-white cursor-pointer">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-zinc-400 dark:text-[#777]" />
                  <span>Your Account</span>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="h-px bg-zinc-200 dark:bg-[#282830] my-1.5" />
              <button 
                onClick={() => {
                  setMenuOpen(false);
                  setDeleteConfirmOpen(true);
                }}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-red-500/10 text-red-500 dark:text-red-400 transition-colors w-full text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Trash2 className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
                  <span>Delete Project...</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* FRAMER ADD MENU: Layout & Media Dropdown */}
        <div className="relative" ref={addLayoutRef}>
          <button 
            onClick={() => setAddLayoutOpen(!addLayoutOpen)}
            className={`p-1.5 rounded-md transition-colors ${
              addLayoutOpen ? 'bg-zinc-200 dark:bg-[#2E2E32] text-zinc-900 dark:text-white ring-1 ring-zinc-300 dark:ring-white/20' : 'hover:bg-zinc-100 dark:hover:bg-[#222] text-zinc-600 dark:text-[#AAA] hover:text-zinc-900 dark:hover:text-white'
            }`}
            title="Add Layout & Media (F, S, G, M, I, V)"
          >
            {/* Framer style Frame/Crop icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 currentColor">
              <path d="M4 1V4M4 4H1M4 4V12M4 12H1M4 12V15M4 12H12M12 15V12M12 12H15M12 12V4M12 4H15M12 4V1M12 4H4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* ADD LAYOUT & MEDIA DROPDOWN MENU */}
          {addLayoutOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-48 bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-[#2D2D32] rounded-xl shadow-2xl p-1.5 z-50 text-xs text-zinc-700 dark:text-[#E1E1E6] animate-in fade-in zoom-in-95 duration-100 font-sans">
              
              {/* Layout Components */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => {
                    if (selectedNodeIds.length > 1) groupSelectedNodes('Frame');
                    else addFrame(targetNodeId);
                    setAddLayoutOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-[#2A2A2E] text-left transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <FrameIcon className="w-4 h-4 text-zinc-400 dark:text-[#9E9EA7] group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                    <span className="font-medium text-zinc-700 dark:text-[#E1E1E6] group-hover:text-zinc-900 dark:group-hover:text-white">Frame</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 dark:text-[#8E8E93] group-hover:text-zinc-600 dark:group-hover:text-[#AAA]">F</span>
                </button>

                <button
                  onClick={() => {
                    if (selectedNodeIds.length > 1) groupSelectedNodes('Stack');
                    else addStack(targetNodeId, 'row');
                    setAddLayoutOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-[#2A2A2E] text-left transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Columns2 className="w-4 h-4 text-zinc-400 dark:text-[#9E9EA7] group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                    <span className="font-medium text-zinc-700 dark:text-[#E1E1E6] group-hover:text-zinc-900 dark:group-hover:text-white">Stack</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 dark:text-[#8E8E93] group-hover:text-zinc-600 dark:group-hover:text-[#AAA]">S</span>
                </button>

                <button
                  onClick={() => {
                    addGrid(targetNodeId, 3);
                    setAddLayoutOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-[#2A2A2E] text-left transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Grid3X3 className="w-4 h-4 text-zinc-400 dark:text-[#9E9EA7] group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                    <span className="font-medium text-zinc-700 dark:text-[#E1E1E6] group-hover:text-zinc-900 dark:group-hover:text-white">Grid</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 dark:text-[#8E8E93] group-hover:text-zinc-600 dark:group-hover:text-[#AAA]">G</span>
                </button>

                <button
                  onClick={() => {
                    addMasonry(targetNodeId, 3);
                    setAddLayoutOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-[#2A2A2E] text-left transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <GalleryVerticalEnd className="w-4 h-4 text-zinc-400 dark:text-[#9E9EA7] group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                    <span className="font-medium text-zinc-700 dark:text-[#E1E1E6] group-hover:text-zinc-900 dark:group-hover:text-white">Masonry</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 dark:text-[#8E8E93] group-hover:text-zinc-600 dark:group-hover:text-[#AAA]">M</span>
                </button>
              </div>

              {/* Divider */}
              <div className="h-px bg-zinc-200 dark:bg-[#2D2D32] my-1" />

              {/* Media Components */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => {
                    addImage(targetNodeId);
                    setAddLayoutOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-[#2A2A2E] text-left transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <ImageIcon className="w-4 h-4 text-zinc-400 dark:text-[#9E9EA7] group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                    <span className="font-medium text-zinc-700 dark:text-[#E1E1E6] group-hover:text-zinc-900 dark:group-hover:text-white">Image</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 dark:text-[#8E8E93] group-hover:text-zinc-600 dark:group-hover:text-[#AAA]">I</span>
                </button>

                <button
                  onClick={() => {
                    addVideo(targetNodeId);
                    setAddLayoutOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-[#2A2A2E] text-left transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <VideoIcon className="w-4 h-4 text-zinc-400 dark:text-[#9E9EA7] group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                    <span className="font-medium text-zinc-700 dark:text-[#E1E1E6] group-hover:text-zinc-900 dark:group-hover:text-white">Video</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 dark:text-[#8E8E93] group-hover:text-zinc-600 dark:group-hover:text-[#AAA]">V</span>
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Undo / Redo */}
        <div className="flex items-center space-x-0.5 border-l border-r border-zinc-200 dark:border-[#222] px-1.5 mx-1">
          <button 
            onClick={handleUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded-md transition-colors ${canUndo ? 'text-zinc-600 dark:text-[#AAA] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#222] cursor-pointer' : 'text-zinc-300 dark:text-[#555] opacity-40 cursor-not-allowed'}`}
            title={canUndo ? "Undo (Cmd+Z)" : "Nothing to undo"}
            aria-disabled={!canUndo}
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button 
            onClick={handleRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded-md transition-colors ${canRedo ? 'text-zinc-600 dark:text-[#AAA] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#222] cursor-pointer' : 'text-zinc-300 dark:text-[#555] opacity-40 cursor-not-allowed'}`}
            title={canRedo ? "Redo (Cmd+Shift+Z)" : "Nothing to redo"}
            aria-disabled={!canRedo}
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Text Quick Insert */}
        <button 
          onClick={() => addNode(targetNodeId, 'Text')} 
          className="p-1.5 hover:bg-zinc-100 dark:hover:bg-[#222] rounded-md text-zinc-600 dark:text-[#AAA] hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer" 
          title="Add Text (T)"
        >
          <Type className="w-4 h-4" />
        </button>
      </div>

      {/* Center: Active Project title and branch badge */}
      <div className="flex items-center space-x-2 font-medium">
        <span className="text-zinc-900 dark:text-white text-xs font-semibold">{projectTitle}</span>
        <span className="text-zinc-400 dark:text-[#666]">·</span>
        <span className="flex items-center text-zinc-600 dark:text-[#999] bg-zinc-100 dark:bg-[#1A1A1A] px-2 py-0.5 rounded border border-zinc-200 dark:border-[#222] text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span> main
        </span>
        {isSaving ? (
          <span className="text-[10px] text-zinc-600 dark:text-zinc-300 ml-2 animate-pulse flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Saving...
          </span>
        ) : lastSavedAt ? (
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 ml-2 flex items-center gap-1 font-mono">
            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Saved {lastSavedAt}
          </span>
        ) : null}
      </div>

      {/* Right side: AI Agent, Preview, Code Export, Save, Publish */}
      <div className="flex items-center space-x-2">


        <button 
          onClick={onAiClick}
          className="px-3 py-1.5 flex items-center space-x-2 bg-zinc-100 dark:bg-[#222] text-zinc-600 dark:text-[#999] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-[#333] border border-zinc-200 dark:border-[#333] rounded-md transition-all shadow-md cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">AI Agent</span>
        </button>
        <div className="relative">
          <button 
            onClick={() => setPreviewMode(true)} 
            onMouseEnter={() => setPreviewTooltip(true)}
            onMouseLeave={() => setPreviewTooltip(false)}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-[#222] rounded-md text-zinc-600 dark:text-[#999] hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer" 
          >
            <Play className="w-4 h-4" />
          </button>
          {previewTooltip && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-[#202024] text-zinc-900 dark:text-white text-[11px] font-medium px-2 py-1 rounded-md shadow-2xl border border-zinc-200 dark:border-[#2E2E34] flex items-center gap-1.5 whitespace-nowrap z-50 pointer-events-none">
              <span>Preview</span>
              <span className="text-[10px] font-mono text-zinc-500 dark:text-[#8E8E93] bg-zinc-100 dark:bg-[#141416] px-1 py-0.5 rounded">⌘P</span>
            </div>
          )}
        </div>
        <button 
          onClick={onExportClick} 
          className="p-1.5 hover:bg-zinc-100 dark:hover:bg-[#222] rounded-md text-zinc-600 dark:text-[#999] hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer" 
          title="Export Code"
        >
          <Code className="w-4 h-4" />
        </button>
        {/* Explicit Save button */}
        <button
          onClick={handleManualSave}
          disabled={isSaving}
          className="px-2.5 py-1.5 flex items-center space-x-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-[#202024] dark:hover:bg-[#282830] text-zinc-800 dark:text-[#DDD] hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-[#333] rounded-md transition-colors text-xs font-medium cursor-pointer shadow-sm"
          title="Save Project (⌘S)"
        >
          <Save className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin text-blue-500' : 'text-zinc-500 dark:text-zinc-400'}`} />
          <span>{isSaving ? 'Saving...' : 'Save'}</span>
        </button>

      </div>
    </div>

    {/* DELETE PROJECT MODAL */}
    {deleteConfirmOpen && (
      <div className="fixed inset-0 z-[100000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white dark:bg-[#16161A] border border-zinc-200 dark:border-[#2B2B36] rounded-xl shadow-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Delete Project</h3>
              <p className="text-xs text-zinc-500 dark:text-gray-400">Permanently remove this project</p>
            </div>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 mb-5 leading-relaxed">
            Are you sure you want to delete <strong className="text-zinc-900 dark:text-white">"{projectTitle}"</strong>? All pages, components, and design canvas data will be permanently deleted. This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeleteConfirmOpen(false)}
              className="px-3.5 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-gray-300 dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-[#22222A] dark:hover:bg-[#2A2A34] rounded-md transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Project</span>
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
