import React, { useRef, useEffect } from 'react';

export function ResizeHandle({ 
  position, 
  onResize 
}: { 
  position: 'right' | 'bottom' | 'bottom-right';
  onResize: (e: React.MouseEvent, pos: string) => void;
}) {
  const getStyle = () => {
    switch (position) {
      case 'right': return 'top-1/2 -right-1.5 -translate-y-1/2 w-3 h-4 cursor-ew-resize';
      case 'bottom': return 'bottom-[-6px] left-1/2 -translate-x-1/2 w-4 h-3 cursor-ns-resize';
      case 'bottom-right': return '-bottom-1.5 -right-1.5 w-3 h-3 cursor-nwse-resize';
    }
  };

  return (
    <div 
      className={`absolute bg-[#0099FF] rounded-sm z-[60] border border-white ${getStyle()}`}
      onMouseDown={(e) => {
        e.stopPropagation();
        onResize(e, position);
      }}
    />
  );
}
