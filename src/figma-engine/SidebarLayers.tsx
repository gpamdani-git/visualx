import React from 'react';
import { useFigmaStore } from './store';
import { ChevronDown, Frame, Square, Type, ArrowUp, ArrowDown } from 'lucide-react';

function LayerItem({ id, depth }: { id: string, depth: number, key?: React.Key }) {
  const node = useFigmaStore(state => state.nodes[id]);
  const selectedId = useFigmaStore(state => state.selectedId);
  const selectNode = useFigmaStore(state => state.selectNode);
  const reorderLayers = useFigmaStore(state => state.reorderLayers);

  if (!node) return null;
  const isSelected = selectedId === id;
  const isFrame = node.type === 'FRAME';

  return (
    <div>
      <div 
        className={`group px-2 py-1.5 flex items-center justify-between text-[13px] cursor-default hover:bg-black/5 ${isSelected ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        onPointerDown={(e) => { e.stopPropagation(); selectNode(id); }}
      >
        <div className="flex items-center gap-2">
          {isFrame ? (
            <ChevronDown className="w-3.5 h-3.5 opacity-50" />
          ) : (
            <span className="w-3.5 h-3.5 inline-block" />
          )}
          
          {isFrame ? <Frame className="w-3.5 h-3.5" /> : node.type === 'TEXT' ? <Type className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
          
          <span className="truncate font-medium select-none">{node.name}</span>
        </div>
        
        {/* Z-Index Reorder Actions (Mocked as simple up/down arrows for the sidebar) */}
        <div className="hidden group-hover:flex items-center gap-1 opacity-50">
          <button 
            className="p-1 hover:bg-black/10 rounded" 
            title="Move Forward"
            onPointerDown={(e) => { e.stopPropagation(); reorderLayers(id, 'UP'); }}
          >
            <ArrowUp className="w-3 h-3" />
          </button>
          <button 
            className="p-1 hover:bg-black/10 rounded" 
            title="Move Backward"
            onPointerDown={(e) => { e.stopPropagation(); reorderLayers(id, 'DOWN'); }}
          >
            <ArrowDown className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      {/* Render children recursively */}
      {isFrame && node.children.map(childId => (
        <LayerItem key={childId} id={childId} depth={depth + 1} />
      ))}
    </div>
  );
}

export function SidebarLayers() {
  const rootIds = useFigmaStore(state => state.rootIds);
  
  return (
    <div className="w-64 bg-[#f8f9fa] border-r border-gray-200 flex flex-col h-full overflow-hidden select-none">
      <div className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200">
        Layers
      </div>
      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        {/* Render bottom-to-top visually so it matches standard design tool sidebars */}
        {[...rootIds].reverse().map(id => <LayerItem key={id} id={id} depth={0} />)}
      </div>
    </div>
  );
}
