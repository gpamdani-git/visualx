import { create } from 'zustand';

export type NodeType = 'FRAME' | 'RECTANGLE' | 'TEXT';

export interface FigmaNode {
  id: string;
  type: NodeType;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  children: string[]; // array of child IDs
  parentId: string | null; // null if it's on the root canvas
}

interface FigmaState {
  nodes: Record<string, FigmaNode>;
  rootIds: string[];
  selectedId: string | null;
  
  selectNode: (id: string | null) => void;
  updateNodePosition: (id: string, x: number, y: number) => void;
  reparentNode: (id: string, newParentId: string | null, localX: number, localY: number) => void;
  reorderLayers: (id: string, direction: 'UP' | 'DOWN') => void;
}

// Initial mock data to play with
const initialNodes: Record<string, FigmaNode> = {
  'frame1': { id: 'frame1', type: 'FRAME', name: 'Hero Section', x: 100, y: 100, w: 400, h: 300, color: '#ffffff', children: ['rect1'], parentId: null },
  'rect1': { id: 'rect1', type: 'RECTANGLE', name: 'Button', x: 50, y: 50, w: 100, h: 40, color: '#3b82f6', children: [], parentId: 'frame1' },
  'frame2': { id: 'frame2', type: 'FRAME', name: 'Sidebar', x: 600, y: 100, w: 250, h: 500, color: '#f8fafc', children: ['rect2'], parentId: null },
  'rect2': { id: 'rect2', type: 'RECTANGLE', name: 'Card', x: 25, y: 25, w: 200, h: 100, color: '#e2e8f0', children: [], parentId: 'frame2' },
  'rect3': { id: 'rect3', type: 'RECTANGLE', name: 'Floating Element', x: 300, y: 500, w: 80, h: 80, color: '#f43f5e', children: [], parentId: null },
};

export const useFigmaStore = create<FigmaState>((set) => ({
  nodes: initialNodes,
  rootIds: ['frame1', 'frame2', 'rect3'],
  selectedId: null,
  
  selectNode: (id) => set({ selectedId: id }),
  
  updateNodePosition: (id, x, y) => set((state) => {
    const node = state.nodes[id];
    if (!node) return state;
    return {
      nodes: {
        ...state.nodes,
        [id]: { ...node, x, y }
      }
    };
  }),
  
  reparentNode: (id, newParentId, localX, localY) => set((state) => {
    const node = state.nodes[id];
    if (!node) return state;
    
    const oldParentId = node.parentId;
    
    // If parent hasn't changed, just update position
    if (oldParentId === newParentId) {
      return {
        nodes: {
          ...state.nodes,
          [id]: { ...node, x: localX, y: localY }
        }
      };
    }
    
    const newNodes = { ...state.nodes };
    newNodes[id] = { ...node, x: localX, y: localY, parentId: newParentId };
    
    let newRootIds = [...state.rootIds];
    
    // 1. Remove from old parent or root
    if (oldParentId) {
      const oldParent = newNodes[oldParentId];
      if (oldParent) {
        newNodes[oldParentId] = {
          ...oldParent,
          children: oldParent.children.filter(cid => cid !== id)
        };
      }
    } else {
      newRootIds = newRootIds.filter(rid => rid !== id);
    }
    
    // 2. Add to new parent or root
    if (newParentId) {
      const newParent = newNodes[newParentId];
      if (newParent) {
        newNodes[newParentId] = {
          ...newParent,
          children: [...newParent.children, id]
        };
      }
    } else {
      // Add to root (top of the z-index stack)
      newRootIds.push(id);
    }
    
    return { nodes: newNodes, rootIds: newRootIds };
  }),
  
  reorderLayers: (id, direction) => set((state) => {
    const node = state.nodes[id];
    if (!node) return state;
    
    const parentId = node.parentId;
    const siblings = parentId ? [...state.nodes[parentId].children] : [...state.rootIds];
    
    const idx = siblings.indexOf(id);
    if (idx === -1) return state;
    
    // UP means moving towards the end of the array (higher z-index in React)
    if (direction === 'UP' && idx < siblings.length - 1) {
      const temp = siblings[idx];
      siblings[idx] = siblings[idx + 1];
      siblings[idx + 1] = temp;
    } 
    // DOWN means moving towards the start of the array (lower z-index)
    else if (direction === 'DOWN' && idx > 0) {
      const temp = siblings[idx];
      siblings[idx] = siblings[idx - 1];
      siblings[idx - 1] = temp;
    } else {
      return state; // No change needed
    }
    
    if (parentId) {
      return {
        nodes: {
          ...state.nodes,
          [parentId]: { ...state.nodes[parentId], children: siblings }
        }
      };
    } else {
      return { rootIds: siblings };
    }
  })
}));
