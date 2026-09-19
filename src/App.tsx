import FigmaEditor from './figma-engine/FigmaEditor';
import { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import CanvasArea from './components/CanvasArea';
import PreviewArea from './components/PreviewArea';

import CodeExportModal from './components/CodeExportModal';
import { CropImageModal } from './components/CropImageModal';
import { useBuilderStore } from './store/builderStore';
import { useProjectStore } from './store/projectStore';
import PreviewTopBar from './components/PreviewTopBar';
import Dashboard from './components/Dashboard';
import GlobalTokenStyles from './components/GlobalTokenStyles';
import AiPanel from './components/AiPanel';
import ToastContainer from './components/ToastContainer';
import { PanelLeftOpen, PanelRightOpen } from 'lucide-react';

import { useLibraryStore } from './store/libraryStore';
import './components/native/NativeNavbar';
import './components/native/NativeButton';

function AppContent() {
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const isPreviewMode = useBuilderStore((state) => state?.isPreviewMode ?? false);
  const setPreviewMode = useBuilderStore((state) => state?.setPreviewMode);
  const previewFullscreen = useBuilderStore((state) => state?.previewFullscreen ?? false);
  const previewShowUI = useBuilderStore((state) => state?.previewShowUI ?? true);
  const canvasTheme = useBuilderStore((state) => state?.canvasTheme ?? 'dark');
  const editorTheme = useBuilderStore((state) => state?.editorTheme ?? 'dark');
  const isLeftSidebarOpen = useBuilderStore((state) => state?.isLeftSidebarOpen ?? true);
  const isRightSidebarOpen = useBuilderStore((state) => state?.isRightSidebarOpen ?? true);
  
  const viewMode = useProjectStore((state) => state?.viewMode ?? 'dashboard');
  const isAiPanelOpen = useProjectStore((state) => state?.isAiPanelOpen ?? false);
  const setAiPanelOpen = useProjectStore((state) => state?.setAiPanelOpen);
  const activeProjectId = useProjectStore((state) => state?.activeProjectId ?? null);
  const saveActiveProject = useProjectStore((state) => state?.saveActiveProject);
  const projects = useProjectStore((state) => state?.projects);
  const dbLoaded = useProjectStore((state) => state?.dbLoaded);
  const loadProjectDb = useProjectStore((state) => state?.loadFromDb);
  
  const libDbLoaded = useLibraryStore((state) => state?.dbLoaded);
  const loadLibraryDb = useLibraryStore((state) => state?.loadFromDb);

  useEffect(() => {
    if (!dbLoaded) loadProjectDb();
    if (!libDbLoaded) loadLibraryDb();
  }, [dbLoaded, libDbLoaded, loadProjectDb, loadLibraryDb]);

  // removed loading check from here

  // Sync editor theme to localStorage only, stop modifying <html> directly
  useEffect(() => {
    localStorage.setItem('editor-theme', editorTheme);
  }, [editorTheme]);

  // Global Keyboard Shortcuts (Cmd+P for Preview, Cmd+K for AI, Cmd+Z for undo/redo, Cmd+S for save, Delete/Backspace for Delete Node)
  
  // Cleanup any potential duplicate children IDs from bad AI actions
  useEffect(() => {
    const state = useBuilderStore.getState();
    if (!state || !state.nodes) return;
    const newNodes = { ...state.nodes };
    let hasChanges = false;
    Object.keys(newNodes).forEach(id => {
      const node = newNodes[id];
      if (node && node.childrenIds) {
        const unique = Array.from(new Set(node.childrenIds));
        if (unique.length !== node.childrenIds.length) {
          newNodes[id] = { ...node, childrenIds: unique };
          hasChanges = true;
        }
      }
    });
    if (hasChanges) {
      useBuilderStore.setState({ nodes: newNodes });
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputActive = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      
      // If user is editing text in an input field or contenteditable, don't intercept standard typing/delete keys
      if (isInputActive) return;

      const state = useBuilderStore.getState();
      const selectedNodeId = state.selectedNodeId;
      const rootNodeId = state.rootNodeId;

      // Cmd/Ctrl + P: Toggle Preview Mode
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setPreviewMode(!state.isPreviewMode);
        return;
      }

      // Cmd/Ctrl + K: AI Agent
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        useProjectStore.getState().setAiPanelOpen(!useProjectStore.getState().isAiPanelOpen);
        return;
      }

      // Cmd/Ctrl + S: Save
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (viewMode === 'editor' && activeProjectId) {
          saveActiveProject();
        }
        return;
      }

      // Cmd/Ctrl + Z / Cmd+Shift+Z: Undo / Redo
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        const temporalState = (useBuilderStore as any).temporal?.getState();
        if (temporalState) {
          if (e.shiftKey) {
            if (temporalState.futureStates && temporalState.futureStates.length > 0) {
              temporalState.redo();
            }
          } else {
            if (temporalState.pastStates && temporalState.pastStates.length > 0) {
              temporalState.undo();
            }
          }
        }
        return;
      }

      // Cmd/Ctrl + D: Duplicate selected node
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        if (selectedNodeId && selectedNodeId !== rootNodeId) {
          e.preventDefault();
          state.duplicateNode(selectedNodeId);
          return;
        }
      }

      // Cmd/Ctrl + C: Copy selected node
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'c') {
        if (selectedNodeId) {
          state.copyNode(selectedNodeId);
        }
      }

      // Cmd/Ctrl + V: Paste copied node
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'v') {
        if (selectedNodeId) {
          state.pasteNode(selectedNodeId);
        }
      }

      // Cmd+Backspace: Remove frame (unwrap)
      if ((e.metaKey || e.ctrlKey) && (e.key === 'Backspace' || e.key === 'Delete')) {
        if (selectedNodeId && selectedNodeId !== rootNodeId) {
          e.preventDefault();
          state.removeFrame(selectedNodeId);
          return;
        }
      }

      // F: Group in Frame
      if (!e.metaKey && !e.ctrlKey && !e.altKey && e.key.toLowerCase() === 'f') {
        const hasSelection = (state.selectedNodeIds && state.selectedNodeIds.length > 0) || (state.selectedNodeId && state.selectedNodeId !== rootNodeId);
        if (hasSelection) {
          e.preventDefault();
          state.groupSelectedNodes('Frame');
          return;
        }
      }

      // Delete or Backspace: Delete selected node/layer
      if (e.key === 'Backspace' || e.key === 'Delete') {
        const multiIds = state.selectedNodeIds || [];
        if (multiIds.length > 1) {
          e.preventDefault();
          multiIds.forEach(id => {
            if (id !== rootNodeId) state.deleteNode(id);
          });
          return;
        } else if (selectedNodeId && selectedNodeId !== rootNodeId) {
          e.preventDefault();
          state.deleteNode(selectedNodeId);
          return;
        }
      }

      // Escape: Deselect current node
      if (e.key === 'Escape') {
        if (selectedNodeId) {
          e.preventDefault();
          state.selectNode(null);
          return;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, activeProjectId, saveActiveProject, setPreviewMode]);

  // If in dashboard view mode, render Dashboard component
  if (!dbLoaded || !libDbLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div>Loading workspace...</div>
        </div>
      </div>
    );
  }

  if (viewMode === 'dashboard') {
    return <Dashboard />;
  }
  
  if (viewMode === 'figma') {
    return <FigmaEditor />;
  }



  // Hide top bar if in fullscreen preview mode with UI hidden (Screenshot 9)
  const shouldShowTopBar = isPreviewMode ? (!previewFullscreen || previewShowUI) : true;

  // Get current project to inject tokens
  const currentProject = (projects || []).find(p => p.id === activeProjectId);

  
  // Otherwise render visual builder editor
  const editorThemeClass = editorTheme === 'dark' ? 'dark' : '';
  const canvasThemeClass = canvasTheme === 'dark' ? 'dark' : '';

  return (
    <>
      <GlobalTokenStyles />
      <div
        className={`flex flex-col h-screen w-screen overflow-hidden font-sans transition-colors duration-150 ${
          isPreviewMode
            ? canvasThemeClass // Inherit canvas theme instead of forcing dark mode
            : 'bg-zinc-50 text-zinc-800 select-none text-[12px]' // Note: background handles its own dark mode via .dark class down below
        }`}
      >
        {/* We wrap the entire Editor UI in a div to pass down the Editor Theme */}
        <div className={`flex flex-col flex-1 overflow-hidden h-full ${isPreviewMode ? '' : editorThemeClass}`}>
          {/* Editor background applied here */}
          {!isPreviewMode && <div className="absolute inset-0 bg-zinc-50 dark:bg-[#111111] dark:text-[#999999] pointer-events-none -z-10" />}
          
          {shouldShowTopBar && (
            isPreviewMode ? (
              <PreviewTopBar />
            ) : (
              <TopBar
                onAiClick={() => setAiPanelOpen(!isAiPanelOpen)}
                onExportClick={() => setExportModalOpen(true)}
              />
            )
          )}
          <div className="flex flex-1 overflow-hidden relative">
            {isPreviewMode ? (
              <PreviewArea />
            ) : (
              <>
                {isLeftSidebarOpen ? (
                  <LeftSidebar />
                ) : (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 z-50">
                    <button 
                      onClick={() => useBuilderStore.getState().toggleLeftSidebar()}
                      className="bg-zinc-50 dark:bg-[#1A1A1A] border border-zinc-200 dark:border-[#333] border-l-0 p-1.5 rounded-r-md shadow-md text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                      title="Open Left Sidebar"
                    >
                      <PanelLeftOpen className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {/* Isolate CanvasArea with its own theme wrapper */}
                <div className={`flex-1 flex flex-col relative z-0 min-w-0 ${canvasThemeClass}`}>
                  <CanvasArea />
                </div>
                
                <div className={isAiPanelOpen ? 'flex flex-col h-full z-40 relative' : 'hidden'}><AiPanel /></div>
                
                {isRightSidebarOpen ? (
                  <RightSidebar />
                ) : (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 z-50">
                    <button 
                      onClick={() => useBuilderStore.getState().toggleRightSidebar()}
                      className="bg-zinc-50 dark:bg-[#1A1A1A] border border-zinc-200 dark:border-[#333] border-r-0 p-1.5 rounded-l-md shadow-md text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                      title="Open Right Sidebar"
                    >
                      <PanelRightOpen className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <CodeExportModal isOpen={exportModalOpen} onClose={() => setExportModalOpen(false)} />
        <CropImageModal />
        <ToastContainer />
      </div>
    </>
  );
}

export default function App() {
  return <AppContent />;
}
