import { create } from 'zustand';
import { temporal } from 'zundo';
import { produce } from 'immer';
import { BreakpointKey, DocumentState, CanvasNode, NodeStyleProps, CanvasTool, CanvasTheme, CanvasComment, defaultStyle } from '../types/builder';
import { componentRegistry } from '../registry/ComponentRegistry';
import { syncStylesToTailwind, parseTailwindToStyles } from '../utils/tailwindParser';
import { v4 as uuidv4 } from 'uuid';
import { isAtomType } from '../utils/dndUtils';

export { defaultStyle };


const initialRootId = 'root';

const initialState: DocumentState = {
  rootNodeId: initialRootId,
  nodes: {
    [initialRootId]: {
      id: initialRootId,
      type: 'Frame',
      name: 'Root Canvas',
      parentId: null,
      childrenIds: [],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fill',
          backgroundColor: '#0a0a0a',
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
        }
      }
    }
  },
  selectedNodeId: null,
  selectedNodeIds: [],
  highlightedNodeIds: [],
  activeBreakpoint: 'lg', // Defaults to desktop
  enabledBreakpoints: ['lg', 'md', 'base'],
  breakpointWidths: {
    lg: 1200,
    md: 810,
    base: 390
  },
  guides: { x: [], y: [] },
  isPreviewMode: false,
  clipboardNodeId: null,
  canvasTool: 'select',
  canvasTheme: (typeof window !== 'undefined' ? ((localStorage.getItem('preferred-theme') as 'light' | 'dark') || 'dark') : 'dark'),
  editorTheme: (typeof window !== 'undefined' ? ((localStorage.getItem('editor-theme') as 'light' | 'dark') || 'dark') : 'dark'),
  showGrid: false,
  zoom: 0.33,
  panOffset: { x: 0, y: 0 },
  comments: [],
  previewWidth: 1200,
  previewHeight: 735,
  previewFullscreen: false,
  previewShowUI: true,
  previewRefreshKey: 0,
};


export type AIAction = 
  | { type: 'UPDATE_NODE'; id: string; updates: { name?: string; props?: Record<string, any>; responsiveStyles?: Record<string, Partial<NodeStyleProps>> } }
  | { type: 'ADD_NODE'; id: string; parentId: string; index?: number; node: CanvasNode }
  | { type: 'DELETE_NODE'; id: string }
  | { type: 'MOVE_NODE'; id: string; parentId: string; index?: number };

export interface BuilderAction {
  selectNode: (id: string | null, append?: boolean) => void;
  selectNodes: (ids: string[]) => void;
  groupSelectedNodes: (type: 'Frame' | 'Stack', explicitIds?: string[]) => void;
  setHighlightedNodeIds: (ids: string[]) => void;
  setBreakpoint: (bp: BreakpointKey) => void;
  setPreviewMode: (val: boolean) => void;
  
  // Preview Actions
  setPreviewWidth: (w: number) => void;
  setPreviewHeight: (h: number) => void;
  setPreviewFullscreen: (val: boolean) => void;
  setPreviewShowUI: (val: boolean) => void;
  refreshPreview: () => void;
  nextBreakpoint: () => void;
  previousBreakpoint: () => void;
  
  // Guides
  addGuide: (axis: 'x' | 'y', pos: number) => void;
  updateGuide: (axis: 'x' | 'y', index: number, pos: number) => void;
  removeGuide: (axis: 'x' | 'y', index: number) => void;
  clearGuides: () => void;

  // AI State
  isAiGenerating: boolean;
  setIsAiGenerating: (val: boolean) => void;



  // Canvas Tools & Navigation Actions
  setCanvasTool: (tool: CanvasTool) => void;
  setCanvasTheme: (theme: CanvasTheme) => void;
  toggleCanvasTheme: () => void;
  setEditorTheme: (theme: CanvasTheme) => void;
  toggleEditorTheme: () => void;
  setShowGrid: (show: boolean) => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomTo100: () => void;
  zoomToFit: () => void;
  zoomToSelection: () => void;
  setPanOffset: (pan: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  
  // Workspace UI State
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;

  // Breakpoints Actions
  toggleBreakpoint: (bp: BreakpointKey) => void;
  enableBreakpoint: (bp: BreakpointKey) => void;
  disableBreakpoint: (bp: BreakpointKey) => void;
  generateAllBreakpoints: () => void;
  setBreakpointWidth: (bp: BreakpointKey, width: number) => void;
  
  // Comments Actions
  addComment: (comment: Omit<CanvasComment, 'id' | 'timestamp'>) => void;
  resolveComment: (id: string) => void;
  deleteComment: (id: string) => void;

  // AST Actions
  applyAiActions: (actions: AIAction[]) => void;
  addNode: (parentId: string, nodeType: CanvasNode['type'], initialProps?: Record<string, any>, index?: number) => void;
  deleteNode: (id: string) => void;
  updateNodeClassName: (id: string, prefix: string, value: string | null, isExactToggle?: boolean) => void;
  duplicateNode: (id: string) => void;
  copyNode: (id: string) => void;
  pasteNode: (parentId: string) => void;
  
  addFrame: (parentId: string) => void;
  addStack: (parentId: string, direction?: 'row' | 'column') => void;
  addGrid: (parentId: string, columns?: number) => void;
  addMasonry: (parentId: string, columns?: number) => void;
  addImage: (parentId: string, src?: string) => void;
  addVideo: (parentId: string, src?: string) => void;
  removeFrame: (id: string) => void;
  addNavigationTemplate: (parentId: string) => void;
  insertAsset: (parentId: string, index: number, asset: { rootNodeId: string, nodeData: Record<string, any> }) => void;

  // Property updates
  updateNodeStyle: (id: string, breakpoint: BreakpointKey, styles: Partial<NodeStyleProps>) => void;
  updateNodeProps: (id: string, props: Record<string, any>) => void;
  updateNode: (id: string, updates: Partial<CanvasNode>) => void;
  renameNode: (id: string, name: string) => void;
  replaceNodeType: (id: string, newType: CanvasNode['type']) => void;
  
  // Drag & Drop / Hierarchy
  moveNode: (sourceId: string, targetParentId: string, insertIndex: number) => void;
}

export const useBuilderStore = create<DocumentState & BuilderAction & { clipboardNodeId: string | null }>()(
  temporal(
    (set, get) => ({
      ...initialState,
      
      selectNode: (id, append = false) => set((state) => {
        if (append && id) {
          const current = state.selectedNodeIds || [];
          if (current.includes(id)) {
            const next = current.filter(x => x !== id);
            return { selectedNodeIds: next, selectedNodeId: next[0] || null };
          } else {
            const next = [...current, id];
            return { selectedNodeIds: next, selectedNodeId: next[next.length - 1] };
          }
        }
        return { selectedNodeId: id, selectedNodeIds: id ? [id] : [] };
      }),
      selectNodes: (ids) => set((state) => {
        // Filter out nodes whose parent is also in the selection (keep only highest level in the selection)
        const topLevelIds = ids.filter(id => {
          let parentId = state.nodes[id]?.parentId;
          while (parentId) {
            if (ids.includes(parentId)) return false;
            parentId = state.nodes[parentId]?.parentId;
          }
          return true;
        });
        return { selectedNodeIds: topLevelIds, selectedNodeId: topLevelIds[0] || null };
      }),
      groupSelectedNodes: (type, explicitIds) => set(produce((state: DocumentState) => {
        let rawIds = explicitIds && explicitIds.length > 0 ? explicitIds : (state.selectedNodeIds || []);
        if (rawIds.length === 0 && state.selectedNodeId) {
          rawIds = [state.selectedNodeId];
        }

        // Filter valid nodes (must exist, cannot be rootNodeId)
        const validIds = rawIds.filter(id => id && id !== state.rootNodeId && state.nodes[id]);
        if (validIds.length === 0) return;

        // Helper to check descendant
        const isDescendantOf = (childId: string, ancestorId: string): boolean => {
          let curr = state.nodes[childId]?.parentId;
          while (curr) {
            if (curr === ancestorId) return true;
            curr = state.nodes[curr]?.parentId;
          }
          return false;
        };

        // Filter out nodes whose ancestor is already in the selection list
        // to prevent nesting loops or pulling descendants out incorrectly
        const topLevelIds = validIds.filter(id => {
          return !validIds.some(otherId => otherId !== id && isDescendantOf(id, otherId));
        });
        
        if (topLevelIds.length === 0) return;

        // Find Target Parent & Insertion Index
        let targetParentId: string = state.rootNodeId;
        let insertIndex = -1;

        const firstNode = state.nodes[topLevelIds[0]];
        const allSameParent = topLevelIds.every(id => state.nodes[id]?.parentId === firstNode?.parentId);

        if (allSameParent && firstNode?.parentId && state.nodes[firstNode.parentId]) {
          targetParentId = firstNode.parentId;
          const parent = state.nodes[targetParentId];
          const indices = topLevelIds.map(id => parent.childrenIds.indexOf(id)).filter(idx => idx >= 0);
          insertIndex = indices.length > 0 ? Math.min(...indices) : parent.childrenIds.length;
        } else {
          // Find Lowest Common Ancestor (LCA)
          const getAncestors = (nodeId: string): string[] => {
            const list: string[] = [];
            let curr = state.nodes[nodeId]?.parentId;
            while (curr) {
              list.push(curr);
              curr = state.nodes[curr]?.parentId;
            }
            return list;
          };

          let commonAncestors = getAncestors(topLevelIds[0]);
          for (let i = 1; i < topLevelIds.length; i++) {
            const ancestors = new Set(getAncestors(topLevelIds[i]));
            commonAncestors = commonAncestors.filter(a => ancestors.has(a));
          }

          targetParentId = commonAncestors[0] || state.rootNodeId;
          const targetParent = state.nodes[targetParentId];
          
          if (targetParent) {
            // Find earliest matching branch child
            let minIndex = targetParent.childrenIds.length;
            for (const id of topLevelIds) {
                // Find which child of targetParent this 'id' belongs to (or is)
                let branchChildId = id;
                while (branchChildId && state.nodes[branchChildId]?.parentId !== targetParentId) {
                    branchChildId = state.nodes[branchChildId]?.parentId || '';
                }
                if (branchChildId) {
                    const idx = targetParent.childrenIds.indexOf(branchChildId);
                    if (idx !== -1 && idx < minIndex) {
                        minIndex = idx;
                    }
                }
            }
            insertIndex = minIndex;
          }
        }

        const targetParent = state.nodes[targetParentId];
        if (!targetParent) return;
        
        if (insertIndex === -1) {
            insertIndex = targetParent.childrenIds.length;
        }

        // Generate new Group ID
        const newGroupId = uuidv4();
        const groupName = type === 'Stack' ? 'Stack' : 'Frame';

        // Detach topLevelIds from their old parents
        topLevelIds.forEach(id => {
          const oldParentId = state.nodes[id]?.parentId;
          if (oldParentId && state.nodes[oldParentId]) {
            state.nodes[oldParentId].childrenIds = state.nodes[oldParentId].childrenIds.filter(cId => cId !== id);
          }
        });

        // Responsive styles for Frame / Stack
        const baseStyle: NodeStyleProps = {
          ...defaultStyle,
          widthType: 'fit-content',
          heightType: 'fit-content',
          backgroundColor: 'transparent',
          borderRadius: { tl: 8, tr: 8, br: 8, bl: 8 },
          padding: { top: 16, right: 16, bottom: 16, left: 16 },
          layoutType: 'Stack',
          display: 'flex',
          layoutDirection: type === 'Stack' ? 'row' : 'column',
          gap: 16,
          alignItems: 'stretch',
          justifyContent: 'flex-start',
        };

        state.nodes[newGroupId] = {
          id: newGroupId,
          type: type,
          name: groupName,
          parentId: targetParentId,
          childrenIds: [...topLevelIds],
          props: type === 'Stack' ? { direction: 'row' } : {},
          responsiveStyles: {
            base: baseStyle
          }
        };

        // Re-parent children to the new group
        topLevelIds.forEach(id => {
          if (state.nodes[id]) {
            state.nodes[id].parentId = newGroupId;
          }
        });

        // Insert new group into target parent's childrenIds
        targetParent.childrenIds.splice(insertIndex, 0, newGroupId);

        // Set selection to new group
        state.selectedNodeId = newGroupId;
        state.selectedNodeIds = [newGroupId];
      })),
      setHighlightedNodeIds: (ids) => set({ highlightedNodeIds: ids }),
      
      setBreakpoint: (bp) => set((state) => {
        const widths = state.breakpointWidths || { lg: 1200, md: 810, base: 390 };
        return { 
          activeBreakpoint: bp,
          previewWidth: bp === 'lg' ? (widths.lg || 1200) : bp === 'md' ? (widths.md || 810) : (widths.base || 390)
        };
      }),
      
      setPreviewMode: (val) => set((state) => ({ 
        isPreviewMode: val, 
        previewFullscreen: false, 
        previewShowUI: true,
        previewWidth: state.previewWidth || 1200,
        previewHeight: state.previewHeight || 735
      })),

      setPreviewWidth: (w) => set(produce((state: DocumentState) => {
        state.previewWidth = w;
        if (w >= 1200) {
          state.activeBreakpoint = 'lg';
        } else if (w >= 810) {
          state.activeBreakpoint = 'md';
        } else {
          state.activeBreakpoint = 'base';
        }
      })),

      setPreviewHeight: (h) => set({ previewHeight: h }),

      setPreviewFullscreen: (val) => set({ previewFullscreen: val }),

      setPreviewShowUI: (val) => set({ previewShowUI: val }),

      refreshPreview: () => set(state => ({ previewRefreshKey: (state.previewRefreshKey || 0) + 1 })),

      nextBreakpoint: () => set(produce((state: DocumentState) => {
        const order: BreakpointKey[] = ['lg', 'md', 'base'];
        const currentIndex = order.indexOf(state.activeBreakpoint);
        const nextBp = order[(currentIndex + 1) % order.length];
        state.activeBreakpoint = nextBp;
        const widths = state.breakpointWidths || { lg: 1200, md: 810, base: 390 };
        state.previewWidth = nextBp === 'lg' ? (widths.lg || 1200) : nextBp === 'md' ? (widths.md || 810) : (widths.base || 390);
      })),

      previousBreakpoint: () => set(produce((state: DocumentState) => {
        const order: BreakpointKey[] = ['lg', 'md', 'base'];
        const currentIndex = order.indexOf(state.activeBreakpoint);
        const prevBp = order[(currentIndex - 1 + order.length) % order.length];
        state.activeBreakpoint = prevBp;
        const widths = state.breakpointWidths || { lg: 1200, md: 810, base: 390 };
        state.previewWidth = prevBp === 'lg' ? (widths.lg || 1200) : prevBp === 'md' ? (widths.md || 810) : (widths.base || 390);
      })),

      addGuide: (axis, pos) => set(produce((state) => {
    if (!state.guides) state.guides = { x: [], y: [] };
    state.guides[axis].push(pos);
  })),
  updateGuide: (axis, index, pos) => set(produce((state) => {
    if (state.guides && state.guides[axis]) {
      state.guides[axis][index] = pos;
    }
  })),
  removeGuide: (axis, index) => set(produce((state) => {
    if (state.guides && state.guides[axis]) {
      state.guides[axis].splice(index, 1);
    }
  })),
  clearGuides: () => set(produce((state) => {
    state.guides = { x: [], y: [] };
  })),
  isAiGenerating: false,
  setIsAiGenerating: (val) => set({ isAiGenerating: val }),
  setCanvasTool: (tool) => set({ canvasTool: tool }),

  setCanvasTheme: (theme) => set({ canvasTheme: theme }),
  toggleCanvasTheme: () => set(state => ({ canvasTheme: state.canvasTheme === 'dark' ? 'light' : 'dark' })),

  setEditorTheme: (theme) => set({ editorTheme: theme }),
  toggleEditorTheme: () => set(state => ({ editorTheme: state.editorTheme === 'dark' ? 'light' : 'dark' })),

  isLeftSidebarOpen: true,
  isRightSidebarOpen: true,
  toggleLeftSidebar: () => set(state => ({ isLeftSidebarOpen: !state.isLeftSidebarOpen })),
  toggleRightSidebar: () => set(state => ({ isRightSidebarOpen: !state.isRightSidebarOpen })),

  setShowGrid: (show) => set({ showGrid: show }),
      setZoom: (zoom) => set({ zoom: Math.min(Math.max(zoom, 0.05), 3) }),

      zoomIn: () => set(state => ({ zoom: Math.min(+(state.zoom + 0.1).toFixed(2), 3) })),

      zoomOut: () => set(state => ({ zoom: Math.max(+(state.zoom - 0.1).toFixed(2), 0.05) })),

      zoomTo100: () => set({ zoom: 1, panOffset: { x: 0, y: 0 } }),

      zoomToFit: () => set({ zoom: 0.33, panOffset: { x: 0, y: 0 } }),

      zoomToSelection: () => set(state => {
        if (!state.selectedNodeId) return { zoom: 0.8, panOffset: { x: 0, y: 0 } };
        return { zoom: 0.8, panOffset: { x: 0, y: 0 } };
      }),

      setPanOffset: (pan) => set(state => ({
        panOffset: typeof pan === 'function' ? pan(state.panOffset) : pan
      })),

      toggleBreakpoint: (bp) => set(produce((state: DocumentState) => {
        if (bp === 'lg') return; // Cannot toggle Desktop (Primary)
        if (!state.enabledBreakpoints) state.enabledBreakpoints = ['lg', 'md', 'base'];
        if (state.enabledBreakpoints.includes(bp)) {
          state.enabledBreakpoints = state.enabledBreakpoints.filter(k => k !== bp);
          if (state.activeBreakpoint === bp) {
            state.activeBreakpoint = 'lg';
          }
        } else {
          state.enabledBreakpoints.push(bp);
        }
      })),

      enableBreakpoint: (bp) => set(produce((state: DocumentState) => {
        if (!state.enabledBreakpoints) state.enabledBreakpoints = ['lg', 'md', 'base'];
        if (!state.enabledBreakpoints.includes(bp)) {
          state.enabledBreakpoints.push(bp);
        }
        state.activeBreakpoint = bp;
      })),

      disableBreakpoint: (bp) => set(produce((state: DocumentState) => {
        if (bp === 'lg') return;
        if (!state.enabledBreakpoints) state.enabledBreakpoints = ['lg', 'md', 'base'];
        state.enabledBreakpoints = state.enabledBreakpoints.filter(k => k !== bp);
        if (state.activeBreakpoint === bp) {
          state.activeBreakpoint = 'lg';
        }
      })),

      generateAllBreakpoints: () => set(produce((state: DocumentState) => {
        state.enabledBreakpoints = ['lg', 'md', 'base'];
      })),

      setBreakpointWidth: (bp, width) => set(produce((state: DocumentState) => {
        if (!state.breakpointWidths) state.breakpointWidths = { lg: 1200, md: 810, base: 390 };
        state.breakpointWidths[bp] = width;
      })),

      addComment: (comment) => set(produce((state: DocumentState) => {
        if (!state.comments) state.comments = [];
        state.comments.push({
          ...comment,
          id: uuidv4(),
          timestamp: Date.now(),
          resolved: false
        });
      })),

      resolveComment: (id) => set(produce((state: DocumentState) => {
        if (!state.comments) return;
        const comment = state.comments.find(c => c.id === id);
        if (comment) {
          comment.resolved = !comment.resolved;
        }
      })),

      deleteComment: (id) => set(produce((state: DocumentState) => {
        if (!state.comments) return;
        state.comments = state.comments.filter(c => c.id !== id);
      })),


      applyAiActions: (actions) => set(produce((state: DocumentState) => {
        actions.forEach(action => {
          if (action.type === 'UPDATE_NODE') {
            const node = state.nodes[action.id];
            if (!node) return;
            if (action.updates.name) node.name = action.updates.name;
            if (action.updates.props) {
              node.props = { ...node.props, ...action.updates.props };
            }
            if (action.updates.responsiveStyles) {
              Object.keys(action.updates.responsiveStyles).forEach(bp => {
                node.responsiveStyles[bp] = {
                  ...node.responsiveStyles[bp],
                  ...action.updates.responsiveStyles[bp]
                };
              });
            }
          } else if (action.type === 'ADD_NODE') {
            const parent = state.nodes[action.parentId];
            if (!parent) return;
            state.nodes[action.id] = action.node;
            
            if (!parent.childrenIds.includes(action.id)) {
              const safeIndex = action.index !== undefined ? Math.max(0, Math.min(action.index, parent.childrenIds.length)) : parent.childrenIds.length;
              parent.childrenIds.splice(safeIndex, 0, action.id);
            }
          } else if (action.type === 'DELETE_NODE') {
            if (action.id === state.rootNodeId) return;
            const node = state.nodes[action.id];
            if (!node) return;
            if (node.parentId) {
              const parent = state.nodes[node.parentId];
              if (parent) {
                parent.childrenIds = parent.childrenIds.filter(childId => childId !== action.id);
              }
            }
            const deleteRecursively = (nodeId: string) => {
              const targetNode = state.nodes[nodeId];
              if (!targetNode) return;
              targetNode.childrenIds.forEach(deleteRecursively);
              delete state.nodes[nodeId];
            };
            deleteRecursively(action.id);
            if (state.selectedNodeId === action.id) {
              state.selectedNodeId = null;
            }
          } else if (action.type === 'MOVE_NODE') {
            const node = state.nodes[action.id];
            const newParent = state.nodes[action.parentId];
            if (!node || !newParent || action.id === state.rootNodeId) return;
            
            // Remove from old parent
            if (node.parentId) {
              const oldParent = state.nodes[node.parentId];
              if (oldParent) {
                oldParent.childrenIds = oldParent.childrenIds.filter(c => c !== action.id);
              }
            }
            // Add to new parent
            node.parentId = action.parentId;
            const safeIndex = action.index !== undefined ? Math.max(0, Math.min(action.index, newParent.childrenIds.length)) : newParent.childrenIds.length;
            newParent.childrenIds.splice(safeIndex, 0, action.id);
          }
        });
      })),
      addNode: (parentId, nodeType, initialProps = {}, index) => set(produce((state: DocumentState) => {
        const parent = state.nodes[parentId];
         if (!parent) return;
         
         // Fix: If selected node cannot accept children, insert adjacent to it in its parent
         let targetParentId = parentId;
         let insertIndex = -1;
         const isAtomic = (isAtomType(parent.type) || parent.type === 'Icon');
         if (isAtomic && parent.parentId) {
            targetParentId = parent.parentId;
            const targetParent = state.nodes[targetParentId];
            if (targetParent) {
                insertIndex = targetParent.childrenIds.indexOf(parentId) + 1;
            }
         }
         const actualParent = state.nodes[targetParentId];
         if (!actualParent) return;

        const newNodeId = uuidv4();
        
        const baseStyle: NodeStyleProps = { ...defaultStyle };
        
        if (nodeType === 'Text') {
          baseStyle.widthType = 'fit-content';
          baseStyle.heightType = 'fit-content';
          baseStyle.fontFamily = 'Inter, sans-serif';
          baseStyle.fontSize = 16;
          baseStyle.color = '#000000';
          if (!initialProps.text) initialProps.text = 'New Text';
        } else if (nodeType === 'Stack') {
          baseStyle.display = 'flex';
          baseStyle.layoutDirection = initialProps.direction || 'column';
          baseStyle.widthType = 'fill';
          baseStyle.heightType = 'fit-content';
          baseStyle.gap = 16;
          baseStyle.padding = { top: 16, right: 16, bottom: 16, left: 16 };
          baseStyle.alignItems = 'stretch';
          baseStyle.justifyContent = 'flex-start';
          baseStyle.backgroundColor = 'transparent';
        } else if (nodeType === 'Grid') {
          baseStyle.display = 'grid';
          baseStyle.gridColumns = initialProps.columns || 2;
          baseStyle.gap = 16;
          baseStyle.widthType = 'fill';
          baseStyle.heightType = 'fit-content';
          baseStyle.padding = { top: 16, right: 16, bottom: 16, left: 16 };
          baseStyle.backgroundColor = 'transparent';
        } else if (nodeType === 'Masonry') {
          baseStyle.display = 'block';
          baseStyle.masonryColumns = initialProps.columns || 3;
          baseStyle.gap = 16;
          baseStyle.widthType = 'fill';
          baseStyle.heightType = 'fit-content';
          baseStyle.padding = { top: 16, right: 16, bottom: 16, left: 16 };
          baseStyle.backgroundColor = 'transparent';
        } else if (nodeType === 'Frame') {
          baseStyle.widthType = 'fill';
          baseStyle.heightType = 'fixed';
          baseStyle.heightValue = 220;
          baseStyle.backgroundColor = '#f3f4f6';
          baseStyle.borderRadius = { tl: 12, tr: 12, br: 12, bl: 12 };
          baseStyle.padding = { top: 16, right: 16, bottom: 16, left: 16 };
          baseStyle.layoutDirection = 'column';
          baseStyle.gap = 12;
        } else if (nodeType === 'Image') {
          const imgSrc = initialProps.src || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
          const imgAlt = initialProps.alt || 'Design Asset';
          initialProps.src = imgSrc;
          initialProps.alt = imgAlt;
          baseStyle.widthType = 'fill';
          baseStyle.heightType = 'fixed';
          baseStyle.heightValue = 220;
          baseStyle.borderRadius = { tl: 8, tr: 8, br: 8, bl: 8 };
          baseStyle.objectFit = 'cover';
          baseStyle.backgroundColor = `url('${imgSrc}')`;
          baseStyle.fillConfig = {
            type: 'image',
            imageSrc: imgSrc,
            imageAlt: imgAlt,
            imageType: 'fill',
            imagePosition: 'Center',
            imageResolution: 'Auto'
          };
        } else if (nodeType === 'Video') {
          if (!initialProps.src) {
            initialProps.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
          }
          initialProps.autoPlay = initialProps.autoPlay ?? true;
          initialProps.loop = initialProps.loop ?? true;
          initialProps.muted = initialProps.muted ?? true;
          initialProps.controls = initialProps.controls ?? true;
          baseStyle.widthType = 'fill';
          baseStyle.heightType = 'fixed';
          baseStyle.heightValue = 240;
          baseStyle.borderRadius = { tl: 8, tr: 8, br: 8, bl: 8 };
          baseStyle.objectFit = 'cover';
          baseStyle.backgroundColor = '#000000';
        }

        const newNode: CanvasNode = {
          id: newNodeId,
          type: nodeType,
          name: `${nodeType}`,
          parentId: targetParentId,
          childrenIds: [],
          props: initialProps,
          responsiveStyles: {
            base: baseStyle
          }
        };

        state.nodes[newNodeId] = newNode;
        
        if (index !== undefined && index >= 0) {
          actualParent.childrenIds.splice(index, 0, newNodeId);
        } else {
          if (insertIndex >= 0) actualParent.childrenIds.splice(insertIndex, 0, newNodeId); else actualParent.childrenIds.push(newNodeId);
        }
        
        // Auto-select newly created node
        state.selectedNodeId = newNodeId;
      })),

      copyNode: (id) => set({ clipboardNodeId: id }),
      
      pasteNode: (parentId) => set(produce((state: DocumentState & { clipboardNodeId: string | null }) => {
        const clipboardId = state.clipboardNodeId;
        if (!clipboardId || !state.nodes[clipboardId]) return;
        
        const parent = state.nodes[parentId];
         if (!parent) return;
         
         // Fix: If selected node cannot accept children, insert adjacent to it in its parent
         let targetParentId = parentId;
         let insertIndex = -1;
         const isAtomic = (isAtomType(parent.type) || parent.type === 'Icon');
         if (isAtomic && parent.parentId) {
            targetParentId = parent.parentId;
            const targetParent = state.nodes[targetParentId];
            if (targetParent) {
                insertIndex = targetParent.childrenIds.indexOf(parentId) + 1;
            }
         }
         const actualParent = state.nodes[targetParentId];
         if (!actualParent) return;

        const cloneNodeRecursively = (originalId: string, newParentId: string | null) => {
          const originalNode = state.nodes[originalId];
          if (!originalNode) return null;
          
          const newId = uuidv4();
          const newNode = JSON.parse(JSON.stringify(originalNode));
          newNode.id = newId;
          newNode.parentId = newParentId;
          newNode.name = `${newNode.name} (Copy)`;
          
          const newChildrenIds: string[] = [];
          for (const childId of originalNode.childrenIds) {
             const clonedChildId = cloneNodeRecursively(childId, newId);
             if (clonedChildId) newChildrenIds.push(clonedChildId);
          }
          newNode.childrenIds = newChildrenIds;
          
          state.nodes[newId] = newNode;
          return newId;
        };

        const newPastedId = cloneNodeRecursively(clipboardId, targetParentId);
        if (newPastedId) {
          if (insertIndex >= 0) actualParent.childrenIds.splice(insertIndex, 0, newPastedId); else actualParent.childrenIds.push(newPastedId);
          state.selectedNodeId = newPastedId;
          state.selectedNodeIds = [newPastedId];
        }
      })),

      duplicateNode: (id) => set(produce((state: DocumentState) => {
        if (id === state.rootNodeId) return;
        const node = state.nodes[id];
        if (!node || !node.parentId) return;
        
        const parent = state.nodes[node.parentId];
        
        const cloneNodeRecursively = (originalId: string, newParentId: string | null) => {
          const originalNode = state.nodes[originalId];
          if (!originalNode) return null;
          
          const newId = uuidv4();
          const newNode = JSON.parse(JSON.stringify(originalNode));
          newNode.id = newId;
          newNode.parentId = newParentId;
          newNode.name = `${newNode.name} (Copy)`;
          
          const newChildrenIds: string[] = [];
          for (const childId of originalNode.childrenIds) {
             const clonedChildId = cloneNodeRecursively(childId, newId);
             if (clonedChildId) newChildrenIds.push(clonedChildId);
          }
          newNode.childrenIds = newChildrenIds;
          
          state.nodes[newId] = newNode;
          return newId;
        };

        const newId = cloneNodeRecursively(id, node.parentId);
        if (newId) {
           const insertIndex = parent.childrenIds.indexOf(id) + 1;
           parent.childrenIds.splice(insertIndex, 0, newId);
           state.selectedNodeId = newId;
           state.selectedNodeIds = [newId];
        }
      })),
      
      addFrame: (parentId) => set(produce((state: DocumentState) => {
         const parent = state.nodes[parentId];
         if (!parent) return;
         
         // Fix: If selected node cannot accept children, insert adjacent to it in its parent
         let targetParentId = parentId;
         let insertIndex = -1;
         const isAtomic = (isAtomType(parent.type) || parent.type === 'Icon');
         if (isAtomic && parent.parentId) {
            targetParentId = parent.parentId;
            const targetParent = state.nodes[targetParentId];
            if (targetParent) {
                insertIndex = targetParent.childrenIds.indexOf(parentId) + 1;
            }
         }
         const actualParent = state.nodes[targetParentId];
         if (!actualParent) return;
         const newId = uuidv4();
         state.nodes[newId] = {
           id: newId,
           type: 'Frame',
           name: 'Frame',
           parentId: targetParentId,
           childrenIds: [],
           props: {},
           responsiveStyles: {
             base: {
               ...defaultStyle,
               widthType: 'fill',
               heightType: 'fixed',
               heightValue: 200,
               backgroundColor: '#f3f4f6',
               borderRadius: { tl: 12, tr: 12, br: 12, bl: 12 },
               padding: { top: 16, right: 16, bottom: 16, left: 16 },
               layoutDirection: 'column',
               gap: 12,
             }
           }
         };
         if (insertIndex >= 0) actualParent.childrenIds.splice(insertIndex, 0, newId); else actualParent.childrenIds.push(newId);
         state.selectedNodeId = newId;
      })),

      addStack: (parentId, direction = 'row') => set(produce((state: DocumentState) => {
         const parent = state.nodes[parentId];
         if (!parent) return;
         
         // Fix: If selected node cannot accept children, insert adjacent to it in its parent
         let targetParentId = parentId;
         let insertIndex = -1;
         const isAtomic = (isAtomType(parent.type) || parent.type === 'Icon');
         if (isAtomic && parent.parentId) {
            targetParentId = parent.parentId;
            const targetParent = state.nodes[targetParentId];
            if (targetParent) {
                insertIndex = targetParent.childrenIds.indexOf(parentId) + 1;
            }
         }
         const actualParent = state.nodes[targetParentId];
         if (!actualParent) return;
         const stackId = uuidv4();
         
         // Create 2 child frames inside the stack to show flex layout visually
         const child1Id = uuidv4();
         const child2Id = uuidv4();

         state.nodes[child1Id] = {
           id: child1Id,
           type: 'Frame',
           name: 'Stack Item 1',
           parentId: stackId,
           childrenIds: [],
           props: {},
           responsiveStyles: {
             base: {
               ...defaultStyle,
               widthType: 'fill',
               heightType: 'fixed',
               heightValue: 120,
               backgroundColor: '#e5e7eb',
               borderRadius: { tl: 8, tr: 8, br: 8, bl: 8 },
               padding: { top: 12, right: 12, bottom: 12, left: 12 },
             }
           }
         };

         state.nodes[child2Id] = {
           id: child2Id,
           type: 'Frame',
           name: 'Stack Item 2',
           parentId: stackId,
           childrenIds: [],
           props: {},
           responsiveStyles: {
             base: {
               ...defaultStyle,
               widthType: 'fill',
               heightType: 'fixed',
               heightValue: 120,
               backgroundColor: '#e5e7eb',
               borderRadius: { tl: 8, tr: 8, br: 8, bl: 8 },
               padding: { top: 12, right: 12, bottom: 12, left: 12 },
             }
           }
         };

         state.nodes[stackId] = {
           id: stackId,
           type: 'Stack',
           name: 'Stack',
           parentId: targetParentId,
           childrenIds: [child1Id, child2Id],
           props: { direction },
           responsiveStyles: {
             base: {
               ...defaultStyle,
               display: 'flex',
               layoutDirection: direction,
               widthType: 'fill',
               heightType: 'fit-content',
               gap: 16,
               padding: { top: 16, right: 16, bottom: 16, left: 16 },
               backgroundColor: '#f9fafb',
               borderRadius: { tl: 12, tr: 12, br: 12, bl: 12 },
               alignItems: 'stretch',
             }
           }
         };

         if (insertIndex >= 0) actualParent.childrenIds.splice(insertIndex, 0, stackId); else actualParent.childrenIds.push(stackId);
         state.selectedNodeId = stackId;
      })),

      addGrid: (parentId, columns = 3) => set(produce((state: DocumentState) => {
         const parent = state.nodes[parentId];
         if (!parent) return;
         
         // Fix: If selected node cannot accept children, insert adjacent to it in its parent
         let targetParentId = parentId;
         let insertIndex = -1;
         const isAtomic = (isAtomType(parent.type) || parent.type === 'Icon');
         if (isAtomic && parent.parentId) {
            targetParentId = parent.parentId;
            const targetParent = state.nodes[targetParentId];
            if (targetParent) {
                insertIndex = targetParent.childrenIds.indexOf(parentId) + 1;
            }
         }
         const actualParent = state.nodes[targetParentId];
         if (!actualParent) return;
         const gridId = uuidv4();
         
         const childrenIds: string[] = [];
         for (let i = 1; i <= 3; i++) {
           const childId = uuidv4();
           childrenIds.push(childId);
           state.nodes[childId] = {
             id: childId,
             type: 'Frame',
             name: `Grid Cell ${i}`,
             parentId: gridId,
             childrenIds: [],
             props: {},
             responsiveStyles: {
               base: {
                 ...defaultStyle,
                 widthType: 'fill',
                 heightType: 'fixed',
                 heightValue: 140,
                 backgroundColor: '#e5e7eb',
                 borderRadius: { tl: 8, tr: 8, br: 8, bl: 8 },
                 padding: { top: 12, right: 12, bottom: 12, left: 12 },
               }
             }
           };
         }

         state.nodes[gridId] = {
           id: gridId,
           type: 'Grid',
           name: 'Grid',
           parentId: targetParentId,
           childrenIds,
           props: { columns },
           responsiveStyles: {
             base: {
               ...defaultStyle,
               display: 'grid',
               gridColumns: columns,
               gap: 16,
               widthType: 'fill',
               heightType: 'fit-content',
               padding: { top: 16, right: 16, bottom: 16, left: 16 },
               backgroundColor: '#f9fafb',
               borderRadius: { tl: 12, tr: 12, br: 12, bl: 12 },
             }
           }
         };

         if (insertIndex >= 0) actualParent.childrenIds.splice(insertIndex, 0, gridId); else actualParent.childrenIds.push(gridId);
         state.selectedNodeId = gridId;
      })),

      addMasonry: (parentId, columns = 3) => set(produce((state: DocumentState) => {
         const parent = state.nodes[parentId];
         if (!parent) return;
         
         // Fix: If selected node cannot accept children, insert adjacent to it in its parent
         let targetParentId = parentId;
         let insertIndex = -1;
         const isAtomic = (isAtomType(parent.type) || parent.type === 'Icon');
         if (isAtomic && parent.parentId) {
            targetParentId = parent.parentId;
            const targetParent = state.nodes[targetParentId];
            if (targetParent) {
                insertIndex = targetParent.childrenIds.indexOf(parentId) + 1;
            }
         }
         const actualParent = state.nodes[targetParentId];
         if (!actualParent) return;
         const masonryId = uuidv4();
         
         const heights = [180, 240, 150, 210, 160, 220];
         const childrenIds: string[] = [];
         
         heights.forEach((h, idx) => {
           const childId = uuidv4();
           childrenIds.push(childId);
           state.nodes[childId] = {
             id: childId,
             type: 'Frame',
             name: `Masonry Item ${idx + 1}`,
             parentId: masonryId,
             childrenIds: [],
             props: {},
             responsiveStyles: {
               base: {
                 ...defaultStyle,
                 widthType: 'fill',
                 heightType: 'fixed',
                 heightValue: h,
                 backgroundColor: '#e5e7eb',
                 borderRadius: { tl: 8, tr: 8, br: 8, bl: 8 },
                 padding: { top: 12, right: 12, bottom: 12, left: 12 },
               }
             }
           };
         });

         state.nodes[masonryId] = {
           id: masonryId,
           type: 'Masonry',
           name: 'Masonry',
           parentId: targetParentId,
           childrenIds,
           props: { columns },
           responsiveStyles: {
             base: {
               ...defaultStyle,
               display: 'block',
               masonryColumns: columns,
               gap: 16,
               widthType: 'fill',
               heightType: 'fit-content',
               padding: { top: 16, right: 16, bottom: 16, left: 16 },
               backgroundColor: '#f9fafb',
               borderRadius: { tl: 12, tr: 12, br: 12, bl: 12 },
             }
           }
         };

         if (insertIndex >= 0) actualParent.childrenIds.splice(insertIndex, 0, masonryId); else actualParent.childrenIds.push(masonryId);
         state.selectedNodeId = masonryId;
      })),

      addImage: (parentId, src) => set(produce((state: DocumentState) => {
         const parent = state.nodes[parentId];
         if (!parent) return;
         
         // Fix: If selected node cannot accept children, insert adjacent to it in its parent
         let targetParentId = parentId;
         let insertIndex = -1;
         const isAtomic = (isAtomType(parent.type) || parent.type === 'Icon');
         if (isAtomic && parent.parentId) {
            targetParentId = parent.parentId;
            const targetParent = state.nodes[targetParentId];
            if (targetParent) {
                insertIndex = targetParent.childrenIds.indexOf(parentId) + 1;
            }
         }
         const actualParent = state.nodes[targetParentId];
         if (!actualParent) return;
         const imgId = uuidv4();
         const defaultSrc = src || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
         const defaultAlt = 'Design Asset';
         state.nodes[imgId] = {
           id: imgId,
           type: 'Image',
           name: 'Image',
           parentId: targetParentId,
           childrenIds: [],
           props: {
             src: defaultSrc,
             alt: defaultAlt,
           },
           responsiveStyles: {
             base: {
               ...defaultStyle,
               widthType: 'fill',
               heightType: 'fixed',
               heightValue: 240,
               borderRadius: { tl: 8, tr: 8, br: 8, bl: 8 },
               objectFit: 'cover',
               backgroundColor: `url('${defaultSrc}')`,
               fillConfig: {
                 type: 'image',
                 imageSrc: defaultSrc,
                 imageAlt: defaultAlt,
                 imageType: 'fill',
                 imagePosition: 'Center',
                 imageResolution: 'Auto'
               }
             }
           }
         };
         if (insertIndex >= 0) actualParent.childrenIds.splice(insertIndex, 0, imgId); else actualParent.childrenIds.push(imgId);
         state.selectedNodeId = imgId;
      })),

      addVideo: (parentId, src) => set(produce((state: DocumentState) => {
         const parent = state.nodes[parentId];
         if (!parent) return;
         
         // Fix: If selected node cannot accept children, insert adjacent to it in its parent
         let targetParentId = parentId;
         let insertIndex = -1;
         const isAtomic = (isAtomType(parent.type) || parent.type === 'Icon');
         if (isAtomic && parent.parentId) {
            targetParentId = parent.parentId;
            const targetParent = state.nodes[targetParentId];
            if (targetParent) {
                insertIndex = targetParent.childrenIds.indexOf(parentId) + 1;
            }
         }
         const actualParent = state.nodes[targetParentId];
         if (!actualParent) return;
         const vidId = uuidv4();
         state.nodes[vidId] = {
           id: vidId,
           type: 'Video',
           name: 'Video',
           parentId: targetParentId,
           childrenIds: [],
           props: {
             src: src || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
             autoPlay: true,
             loop: true,
             muted: true,
             controls: true,
           },
           responsiveStyles: {
             base: {
               ...defaultStyle,
               widthType: 'fill',
               heightType: 'fixed',
               heightValue: 260,
               borderRadius: { tl: 8, tr: 8, br: 8, bl: 8 },
               objectFit: 'cover',
               backgroundColor: '#000000',
             }
           }
         };
         if (insertIndex >= 0) actualParent.childrenIds.splice(insertIndex, 0, vidId); else actualParent.childrenIds.push(vidId);
         state.selectedNodeId = vidId;
      })),
      
      removeFrame: (id) => set(produce((state: DocumentState) => {
         if (id === state.rootNodeId) return;
         const node = state.nodes[id];
         if (!node || !node.parentId) return;
         
         const parent = state.nodes[node.parentId];
         if (!parent) return;
         
         // Move all children to the parent
         const children = [...(node.childrenIds || [])];
         const index = parent.childrenIds.indexOf(id);
         
         if (index > -1) {
             parent.childrenIds.splice(index, 1, ...children);
         } else {
             parent.childrenIds.push(...children);
         }
         
         // Update parentId for children
         for (const childId of children) {
             if (state.nodes[childId]) {
                 state.nodes[childId].parentId = node.parentId;
             }
         }
         
         delete state.nodes[id];
         
         // Clean up selection if needed
         if (state.selectedNodeId === id) {
             state.selectedNodeId = children.length > 0 ? children[0] : node.parentId;
         }
         if (state.selectedNodeIds) {
             state.selectedNodeIds = state.selectedNodeIds.filter(selectedId => selectedId !== id);
             if (state.selectedNodeIds.length === 0) {
                 if (state.selectedNodeId) {
                     state.selectedNodeIds = [state.selectedNodeId];
                 }
             }
         }
      })),


      insertAsset: (parentId, index, asset) => set(produce((state: DocumentState) => {
    const parent = state.nodes[parentId];
    if (!parent) return;

    // Helper to generate new IDs and deeply clone the asset node structure
    const idMap = new Map<string, string>();
    
    // First pass: generate new IDs
    Object.keys(asset.nodeData).forEach(oldId => {
      idMap.set(oldId, uuidv4());
    });
    
    // Second pass: clone and update IDs and parentIds
    const newRootId = idMap.get(asset.rootNodeId);
    
    Object.values(asset.nodeData).forEach((oldNode: any) => {
      const newNode = JSON.parse(JSON.stringify(oldNode)); // deep clone
      newNode.id = idMap.get(oldNode.id);
      
      // Update parentId
      if (oldNode.id === asset.rootNodeId) {
        newNode.parentId = parentId;
      } else if (oldNode.parentId && idMap.has(oldNode.parentId)) {
        newNode.parentId = idMap.get(oldNode.parentId);
      }
      
      // Update childrenIds
      if (newNode.childrenIds) {
        newNode.childrenIds = newNode.childrenIds.map((cId: string) => idMap.get(cId) || cId);
      }
      
      // --- NEW: Tailwind-First Sync on Drop ---
      // If a dropped template has a className but no layout defined in responsiveStyles, we parse it
      // so the Right Properties Panel immediately shows the correct padding, gap, and flex rules!
      if (newNode.props?.className) {
        if (!newNode.responsiveStyles) newNode.responsiveStyles = { base: {} };
        if (!newNode.responsiveStyles.base) newNode.responsiveStyles.base = {};
        
        // Only parse if it looks like it hasn't been set
        if (Object.keys(newNode.responsiveStyles.base).length === 0) {
           const extractedStyles = parseTailwindToStyles(newNode.props.className);
           newNode.responsiveStyles.base = { ...extractedStyles };
        }
      }
      
      state.nodes[newNode.id] = newNode;
    });
    
    if (newRootId) {
      if (index >= 0) {
        parent.childrenIds.splice(index, 0, newRootId);
      } else {
        parent.childrenIds.push(newRootId);
      }
      state.selectedNodeId = newRootId;
    }
  })),

  addNavigationTemplate: (parentId) => set(produce((state: DocumentState) => {
         const parent = state.nodes[parentId];
         if (!parent) return;
         
         // Fix: If selected node cannot accept children, insert adjacent to it in its parent
         let targetParentId = parentId;
         let insertIndex = -1;
         const isAtomic = (isAtomType(parent.type) || parent.type === 'Icon');
         if (isAtomic && parent.parentId) {
            targetParentId = parent.parentId;
            const targetParent = state.nodes[targetParentId];
            if (targetParent) {
                insertIndex = targetParent.childrenIds.indexOf(parentId) + 1;
            }
         }
         const actualParent = state.nodes[targetParentId];
         if (!actualParent) return;

         const navId = uuidv4();
         const leftStackId = uuidv4();
         const rightStackId = uuidv4();
         const logoId = uuidv4();
         const aboutId = uuidv4();
         const blogId = uuidv4();
         const pricingId = uuidv4();
         const buttonId = uuidv4();

         // Nav Wrapper
         state.nodes[navId] = {
           id: navId,
           type: 'Frame',
           name: 'Navigation',
           parentId: parentId,
           childrenIds: [leftStackId, rightStackId],
           props: {},
           responsiveStyles: {
             base: {
               ...defaultStyle,
               widthType: 'fill',
               widthValue: '100%',
               heightType: 'fit-content',
               layoutDirection: 'row',
               justifyContent: 'space-between',
               alignItems: 'center',
               backgroundColor: 'transparent',
               padding: { top: 16, right: 24, bottom: 16, left: 24 },
             }
           }
         };

         // Left Stack (Logo)
         state.nodes[leftStackId] = {
           id: leftStackId,
           type: 'Frame',
           name: 'Nav Left',
           parentId: navId,
           childrenIds: [logoId],
           props: {},
           responsiveStyles: {
             base: {
               ...defaultStyle,
               widthType: 'fit-content',
               heightType: 'fit-content',
               layoutDirection: 'row',
               alignItems: 'center',
               backgroundColor: 'transparent',
             }
           }
         };

         // Right Stack (Links + Button)
         state.nodes[rightStackId] = {
           id: rightStackId,
           type: 'Frame',
           name: 'Nav Right',
           parentId: navId,
           childrenIds: [aboutId, blogId, pricingId, buttonId],
           props: {},
           responsiveStyles: {
             base: {
               ...defaultStyle,
               widthType: 'fit-content',
               heightType: 'fit-content',
               layoutDirection: 'row',
               alignItems: 'center',
               gap: 24,
               backgroundColor: 'transparent',
             }
           }
         };

         // Logo Image
         state.nodes[logoId] = {
           id: logoId,
           type: 'Image',
           name: 'Logo',
           parentId: leftStackId,
           childrenIds: [],
           props: {
             src: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=100&auto=format&fit=crop', // placeholder logo shape
             alt: 'Logo'
           },
           responsiveStyles: {
             base: {
               ...defaultStyle,
               widthType: 'fixed',
               widthValue: '32px',
               heightType: 'fixed',
               heightValue: '32px',
               borderRadius: { tl: 8, tr: 8, br: 8, bl: 8 },
             }
           }
         };

         // Helper for text links
         const createTextLink = (id, name, text, parentId) => {
           state.nodes[id] = {
             id,
             type: 'Text',
             name,
             parentId,
             childrenIds: [],
             props: { text },
             responsiveStyles: {
               base: {
                 ...defaultStyle,
                 widthType: 'fit-content',
                 heightType: 'fit-content',
                 fontFamily: 'Inter, sans-serif',
                 fontSize: 14,
                 color: '#333333',
                 fontWeight: 500,
               }
             }
           };
         };

         createTextLink(aboutId, 'About Link', 'About', rightStackId);
         createTextLink(blogId, 'Blog Link', 'Blog', rightStackId);
         createTextLink(pricingId, 'Pricing Link', 'Pricing', rightStackId);

         // CTA Button
         state.nodes[buttonId] = {
           id: buttonId,
           type: 'Button',
           name: 'CTA Button',
           parentId: rightStackId,
           childrenIds: [],
           props: { text: 'Book Demo', variant: 'primary' },
           responsiveStyles: {
             base: {
               ...defaultStyle,
               widthType: 'fit-content',
               heightType: 'fit-content',
               padding: { top: 8, right: 16, bottom: 8, left: 16 },
               backgroundColor: '#000000',
               color: '#ffffff',
               borderRadius: { tl: 6, tr: 6, br: 6, bl: 6 },
               fontFamily: 'Inter, sans-serif',
               fontSize: 14,
               fontWeight: 500,
             }
           }
         };

         if (insertIndex >= 0) actualParent.childrenIds.splice(insertIndex, 0, navId); else actualParent.childrenIds.push(navId);
         state.selectedNodeId = navId;
      })),


      deleteNode: (id) => set(produce((state: DocumentState) => {
    // Delete node logic unchanged...
    const node = state.nodes[id];
    if (!node) return;
    
    if (node.parentId && state.nodes[node.parentId]) {
      const parent = state.nodes[node.parentId];
      parent.childrenIds = parent.childrenIds.filter(childId => childId !== id);
    }
    
    const deleteRecursively = (nodeId: string) => {
      const n = state.nodes[nodeId];
      if (n && n.childrenIds) {
        n.childrenIds.forEach(deleteRecursively);
      }
      delete state.nodes[nodeId];
    };
    
    deleteRecursively(id);
    if (state.selectedNodeId === id || state.selectedNodeIds.includes(id)) {
      state.selectedNodeId = null;
      state.selectedNodeIds = [];
    }
  })),

  updateNodeClassName: (id, prefix, value, isExactToggle) => set(produce((state: DocumentState) => {
    const node = state.nodes[id];
    if (!node) return;

    let currentClasses = (node.props?.className || '').trim().split(/\s+/).filter(Boolean);
    
    if (isExactToggle) {
      const hasClass = currentClasses.includes(prefix);
      const shouldAdd = value !== null ? Boolean(value) : !hasClass;
      if (shouldAdd && !hasClass) {
        currentClasses.push(prefix);
      } else if (!shouldAdd && hasClass) {
        currentClasses = currentClasses.filter(c => c !== prefix);
      }
    } else {
      const regex = new RegExp(`^${prefix}.*$`);
      currentClasses = currentClasses.filter(cls => !regex.test(cls));
      if (value !== null && value !== '') {
        currentClasses.push(`${prefix}${value}`);
      }
    }
    
    if (!node.props) node.props = {};
    node.props.className = currentClasses.join(' ');
  })),


      updateNodeStyle: (id, breakpoint, styles) => set(produce((state: DocumentState) => {
        const node = state.nodes[id];
        if (!node) return;
        
        if (breakpoint === 'base') {
          node.responsiveStyles.base = {
            ...node.responsiveStyles.base,
            ...styles
          };
        } else {
          node.responsiveStyles[breakpoint] = {
            ...(node.responsiveStyles[breakpoint] || {}),
            ...styles
          };
        }

        // --- NEW: Tailwind-First Sync ---
        // Every time visual properties are modified, sync them directly into the underlying Tailwind className string
        if (breakpoint === 'base') {
          node.props = node.props || {};
          node.props.className = syncStylesToTailwind(node.props.className, styles);
        }
        // --------------------------------

        if (node.type === 'Image') {
          if (styles.fillConfig?.imageSrc) {
            node.props.src = styles.fillConfig.imageSrc;
          } else if (styles.backgroundColor && styles.backgroundColor.includes('url(')) {
            const extracted = styles.backgroundColor.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
            node.props.src = extracted;
          } else if (styles.fillConfig && styles.fillConfig.type !== 'image') {
            node.props.src = '';
          } else if (styles.backgroundColor && styles.backgroundColor !== 'transparent' && !styles.backgroundColor.includes('url(')) {
            node.props.src = '';
          }
          if (styles.fillConfig?.imageAlt !== undefined) {
            node.props.alt = styles.fillConfig.imageAlt;
          }
        }

        // Recursive propagation for opacity or visible (Hide/Show)
        if (styles.opacity !== undefined || styles.visible !== undefined) {
          const isHidden = styles.opacity === 0 || styles.visible === false;
          const propagateVisibility = (nodeId: string) => {
            const curr = state.nodes[nodeId];
            if (!curr || !curr.childrenIds) return;
            curr.childrenIds.forEach(childId => {
              const childNode = state.nodes[childId];
              if (childNode) {
                childNode.props = { ...childNode.props, hidden: isHidden };
                childNode.responsiveStyles.base = {
                  ...childNode.responsiveStyles.base,
                  opacity: isHidden ? 0 : 1,
                  visible: !isHidden
                };
                propagateVisibility(childId);
              }
            });
          };
          propagateVisibility(id);
        }
      })),
      
      updateNodeProps: (id, props) => set(produce((state: DocumentState) => {
        const node = state.nodes[id];
        if (!node) return;
        node.props = { ...node.props, ...props };

        // Recursive propagation for locked & hidden to all descendants
        if (props.locked !== undefined || props.hidden !== undefined) {
          const propagateDescendants = (nodeId: string) => {
            const curr = state.nodes[nodeId];
            if (!curr || !curr.childrenIds) return;
            curr.childrenIds.forEach(childId => {
              const childNode = state.nodes[childId];
              if (childNode) {
                if (props.locked !== undefined) {
                  childNode.props = { ...childNode.props, locked: props.locked };
                }
                if (props.hidden !== undefined) {
                  childNode.props = { ...childNode.props, hidden: props.hidden };
                  childNode.responsiveStyles.base = {
                    ...childNode.responsiveStyles.base,
                    opacity: props.hidden ? 0 : 1,
                    visible: !props.hidden
                  };
                }
                propagateDescendants(childId);
              }
            });
          };
          propagateDescendants(id);
        }
      })),

      updateNode: (id, updates) => set(produce((state: DocumentState) => {
        if (state.nodes[id]) {
          Object.assign(state.nodes[id], updates);
        }
      })),
      renameNode: (id, name) => set(produce((state: DocumentState) => {
        const node = state.nodes[id];
        if (node) {
          node.name = name;
        }
      })),

      replaceNodeType: (id, newType) => set(produce((state: DocumentState) => {
        const node = state.nodes[id];
        if (!node || id === state.rootNodeId) return;

        node.type = newType;
        node.name = newType;

        if (newType === 'Stack') {
          node.responsiveStyles.base = {
            ...node.responsiveStyles.base,
            display: 'flex',
            layoutDirection: node.responsiveStyles.base?.layoutDirection || 'column',
            layoutType: 'Stack',
            gap: node.responsiveStyles.base?.gap || 12,
          };
          node.props = { ...node.props, direction: node.responsiveStyles.base?.layoutDirection || 'column' };
        } else if (newType === 'Frame') {
          node.responsiveStyles.base = {
            ...node.responsiveStyles.base,
            display: 'block',
            layoutType: undefined,
          };
        } else if (newType === 'Grid') {
          node.props = { ...node.props, columns: 3 };
          node.responsiveStyles.base = {
            ...node.responsiveStyles.base,
            display: 'grid',
            gridColumns: 3,
            gap: 16,
          };
        } else if (newType === 'Text') {
          if (!node.props.content) node.props.content = 'Text Content';
          node.responsiveStyles.base = {
            ...node.responsiveStyles.base,
            fontSize: 16,
            fontWeight: 400,
            color: '#111827',
          };
        } else if (newType === 'Button') {
          if (!node.props.content && !node.props.text) node.props.content = 'Button';
          node.responsiveStyles.base = {
            ...node.responsiveStyles.base,
            padding: { top: 8, right: 16, bottom: 8, left: 16 },
            backgroundColor: '#0099FF',
            color: '#FFFFFF',
            borderRadius: { tl: 6, tr: 6, br: 6, bl: 6 },
          };
        } else if (newType === 'Image') {
          const defaultSrc = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
          node.props.src = node.props.src || defaultSrc;
          node.props.alt = node.props.alt || 'Asset Image';
          node.responsiveStyles.base = {
            ...node.responsiveStyles.base,
            widthType: 'fill',
            heightType: 'fixed',
            heightValue: 240,
            borderRadius: { tl: 8, tr: 8, br: 8, bl: 8 },
            objectFit: 'cover',
          };
        } else if (newType === 'Video') {
          node.props.src = node.props.src || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
          node.responsiveStyles.base = {
            ...node.responsiveStyles.base,
            widthType: 'fill',
            heightType: 'fixed',
            heightValue: 240,
            borderRadius: { tl: 8, tr: 8, br: 8, bl: 8 },
            objectFit: 'cover',
          };
        }
      })),
      
      moveNode: (sourceId, targetParentId, insertIndex) => set(produce((state: DocumentState) => {
        const sourceNode = state.nodes[sourceId];
        const targetParent = state.nodes[targetParentId];
        
        if (!sourceNode || !targetParent || sourceId === state.rootNodeId) return;
        
        // Enforce rule: atom components (Text, Button, Image, Video) cannot accept children
        const isTargetAtom = ['Text', 'Button', 'Image', 'Video'].includes(targetParent.type) && targetParentId !== state.rootNodeId;
        if (isTargetAtom) return;

        // Prevent moving a node into itself or its own descendants (circular dependency check)
        let currentParent: string | null = targetParentId;
        const visited = new Set<string>();
        while (currentParent && !visited.has(currentParent)) {
          visited.add(currentParent);
          if (currentParent === sourceId) return; // Invalid move
          currentParent = state.nodes[currentParent]?.parentId || null;
        }

        // Remove from old parent
        const oldParentId = sourceNode.parentId;
        if (oldParentId) {
          const oldParent = state.nodes[oldParentId];
          if (oldParent) {
            const oldIdx = oldParent.childrenIds.indexOf(sourceId);
            if (oldIdx !== -1) {
              oldParent.childrenIds.splice(oldIdx, 1);
            }
          }
        }

        // Add to new parent
        sourceNode.parentId = targetParentId;
        const targetLength = targetParent.childrenIds.length;
        const safeIndex = insertIndex !== undefined 
          ? Math.max(0, Math.min(insertIndex, targetLength))
          : targetLength;
        
        targetParent.childrenIds.splice(safeIndex, 0, sourceId);
        state.selectedNodeId = sourceId;
      })),
    }),
    { 
      limit: 50,
      partialize: (state) => ({
        nodes: state.nodes,
        rootNodeId: state.rootNodeId,
        canvasTheme: state.canvasTheme,
        editorTheme: state.editorTheme,
      })
    }
  )
);
