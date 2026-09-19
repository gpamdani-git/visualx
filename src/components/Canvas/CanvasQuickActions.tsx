import React, { useEffect, useState } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { Copy, Trash2, ArrowUp, ArrowDown, CornerLeftUp, Sparkles } from 'lucide-react';
import clsx from 'clsx';

export const CanvasQuickActions = () => {
  const selectedNodeId = useBuilderStore(s => s.selectedNodeId);
  const rootNodeId = useBuilderStore(s => s.rootNodeId);
  const duplicateNode = useBuilderStore(s => s.duplicateNode);
  const deleteNode = useBuilderStore(s => s.deleteNode);
  const moveNode = useBuilderStore(s => s.moveNode);
  const selectNode = useBuilderStore(s => s.selectNode);
  const nodes = useBuilderStore(s => s.nodes);
  const isPreviewMode = useBuilderStore(s => s.isPreviewMode);

  const [position, setPosition] = useState<{ top: number, left: number } | null>(null);

  useEffect(() => {
    if (!selectedNodeId || selectedNodeId === rootNodeId || isPreviewMode) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      const el = document.getElementById(`canvas-node-${selectedNodeId}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        // position above the element
        setPosition({
          top: rect.top - 48, // 48px above
          left: rect.left
        });
      }
    };

    updatePosition();
    
    // Setup observers to track position changes
    window.addEventListener('resize', updatePosition);
    const container = document.getElementById('canvas-scroll-container');
    if (container) {
      container.addEventListener('scroll', updatePosition);
    }
    
    const interval = setInterval(updatePosition, 100);

    return () => {
      window.removeEventListener('resize', updatePosition);
      if (container) container.removeEventListener('scroll', updatePosition);
      clearInterval(interval);
    };
  }, [selectedNodeId, rootNodeId, isPreviewMode]);

  if (!position || !selectedNodeId || isPreviewMode) return null;

  const node = nodes[selectedNodeId];
  if (!node) return null;

  const parentId = node.parentId;
  let siblings: string[] = [];
  let currentIndex = -1;
  if (parentId && nodes[parentId]) {
    siblings = nodes[parentId].childrenIds || [];
    currentIndex = siblings.indexOf(selectedNodeId);
  }

  const handleMoveUp = () => {
    if (parentId && currentIndex > 0) {
      moveNode(selectedNodeId, parentId, currentIndex - 1);
    }
  };

  const handleMoveDown = () => {
    if (parentId && currentIndex < siblings.length - 1) {
      moveNode(selectedNodeId, parentId, currentIndex + 1);
    }
  };

  return (
    <div 
      className="fixed z-[9999] flex items-center gap-1 bg-[#111] border border-[#222] rounded-lg shadow-xl px-1.5 py-1 animate-in fade-in slide-in-from-bottom-2 duration-200"
      style={{ top: Math.max(80, position.top), left: Math.max(300, position.left) }}
    >
      <div className="px-2 border-r border-[#333] flex items-center">
        <span className="text-[10px] font-medium text-[#AAA] max-w-[80px] truncate">{node.name || node.type}</span>
      </div>
      
      {parentId && parentId !== rootNodeId && (
        <button 
          onClick={() => selectNode(parentId)}
          className="p-1.5 text-[#888] hover:text-white hover:bg-[#222] rounded transition-colors"
          title="Select Parent"
        >
          <CornerLeftUp size={14} />
        </button>
      )}

      <button 
        onClick={() => duplicateNode(selectedNodeId)}
        className="p-1.5 text-[#888] hover:text-white hover:bg-[#222] rounded transition-colors"
        title="Duplicate (Cmd+D)"
      >
        <Copy size={14} />
      </button>

      <button 
        onClick={handleMoveUp}
        disabled={currentIndex <= 0}
        className={clsx("p-1.5 rounded transition-colors", currentIndex <= 0 ? "text-[#444] cursor-not-allowed" : "text-[#888] hover:text-white hover:bg-[#222]")}
        title="Move Up"
      >
        <ArrowUp size={14} />
      </button>

      <button 
        onClick={handleMoveDown}
        disabled={currentIndex === siblings.length - 1}
        className={clsx("p-1.5 rounded transition-colors", currentIndex === siblings.length - 1 ? "text-[#444] cursor-not-allowed" : "text-[#888] hover:text-white hover:bg-[#222]")}
        title="Move Down"
      >
        <ArrowDown size={14} />
      </button>

      <div className="w-[1px] h-4 bg-[#333] mx-1"></div>

      <button 
        onClick={() => { /* AI Prompt hook for later */ }}
        className="p-1.5 text-[#9D00FF] hover:text-[#B233FF] hover:bg-[#222] rounded transition-colors flex items-center gap-1"
        title="Ask AI"
      >
        <Sparkles size={14} />
      </button>

      <button 
        onClick={() => { selectNode(null); deleteNode(selectedNodeId); }}
        className="p-1.5 text-red-500 hover:text-red-400 hover:bg-[#222] rounded transition-colors ml-1"
        title="Delete (Backspace)"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};
