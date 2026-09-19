import React from 'react';
import { useFigmaStore } from './store';
import { CanvasNode } from './CanvasNode';

export function Canvas() {
  const rootIds = useFigmaStore(state => state.rootIds);
  const selectNode = useFigmaStore(state => state.selectNode);

  return (
    <div 
      id="figma-canvas-root" 
      className="flex-1 bg-[#e5e5e5] relative overflow-hidden"
      onPointerDown={() => selectNode(null)}
      // Simple dots background to look like a canvas
      style={{
        backgroundImage: 'radial-gradient(#d4d4d4 1px, transparent 0)',
        backgroundSize: '24px 24px',
        backgroundPosition: '-12px -12px'
      }}
    >
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-50">
        <div className="text-gray-400 text-sm font-medium">
          Drag elements anywhere. Drag a smaller rectangle into a Frame to reparent it.
        </div>
      </div>
      
      {rootIds.map(id => <CanvasNode key={id} id={id} />)}
    </div>
  );
}
