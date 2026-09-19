import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useBuilderStore } from '../store/builderStore';

const DEFAULT_PAN_OFFSET = { x: 0, y: 0 };
const DEFAULT_GUIDES = { x: [], y: [] };

export default function Rulers({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const zoom = useBuilderStore((state) => state?.zoom) || 1;
  const panOffset = useBuilderStore((state) => state?.panOffset) || DEFAULT_PAN_OFFSET;
  const canvasTheme = useBuilderStore((state) => state?.canvasTheme ?? 'dark');
  const isDark = canvasTheme === 'dark';
  const guides = useBuilderStore((state) => state?.guides) || DEFAULT_GUIDES;
  const addGuide = useBuilderStore((state) => state?.addGuide);
  const updateGuide = useBuilderStore((state) => state?.updateGuide);
  const removeGuide = useBuilderStore((state) => state?.removeGuide);

  const topRulerRef = useRef<HTMLCanvasElement>(null);
  const leftRulerRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

  // Handle Resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setDimensions({
          w: entries[0].contentRect.width,
          h: entries[0].contentRect.height
        });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef]);

  // Draw Rulers
  useEffect(() => {
    const drawRuler = (canvas: HTMLCanvasElement, axis: 'x' | 'y') => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);
      
      ctx.fillStyle = isDark ? '#111111' : '#FFFFFF'; // background
      ctx.fillRect(0, 0, width, height);

      ctx.beginPath();
      ctx.strokeStyle = isDark ? '#444444' : '#DDDDDD';
      ctx.fillStyle = isDark ? '#888888' : '#777777';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // We need to find the step size. E.g. every 10px, 50px, 100px depending on zoom
      // In logical coordinates (canvas scale)
      let stepLogical = 50; 
      if (zoom > 2) stepLogical = 10;
      else if (zoom < 0.5) stepLogical = 100;

      const stepVisual = stepLogical * zoom;
      
      if (axis === 'x') {
        const offsetVisual = panOffset.x + (dimensions.w / 2) - 20;
        // Start logical X from leftmost visual edge
        const startLogical = Math.floor(-offsetVisual / stepVisual) * stepLogical;
        const endLogical = Math.ceil((width - offsetVisual) / stepVisual) * stepLogical;

        for (let l = startLogical; l <= endLogical; l += stepLogical) {
          const v = l * zoom + offsetVisual;
          ctx.moveTo(v, height - 5);
          ctx.lineTo(v, height);
          if (l % (stepLogical * 2) === 0) {
            ctx.moveTo(v, 0);
            ctx.lineTo(v, height);
            ctx.fillText(l.toString(), v + 12, height / 2);
          }
        }
      } else {
        const offsetVisual = panOffset.y + (dimensions.h / 2) - 20;
        const startLogical = Math.floor(-offsetVisual / stepVisual) * stepLogical;
        const endLogical = Math.ceil((height - offsetVisual) / stepVisual) * stepLogical;

        for (let l = startLogical; l <= endLogical; l += stepLogical) {
          const v = l * zoom + offsetVisual;
          ctx.moveTo(width - 5, v);
          ctx.lineTo(width, v);
          if (l % (stepLogical * 2) === 0) {
            ctx.moveTo(0, v);
            ctx.lineTo(width, v);
            // Draw text rotated
            ctx.save();
            ctx.translate(width / 2, v + 12);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(l.toString(), 0, 0);
            ctx.restore();
          }
        }
      }
      ctx.stroke();
    };

    if (topRulerRef.current) {
      topRulerRef.current.width = dimensions.w;
      topRulerRef.current.height = 20;
      drawRuler(topRulerRef.current, 'x');
    }
    if (leftRulerRef.current) {
      leftRulerRef.current.width = 20;
      leftRulerRef.current.height = dimensions.h;
      drawRuler(leftRulerRef.current, 'y');
    }
  }, [zoom, panOffset.x, panOffset.y, dimensions.w, dimensions.h, isDark]);

  // Dragging interaction for guides
  const [activeGuide, setActiveGuide] = useState<{ axis: 'x' | 'y', index: number } | null>(null);

  const startDragNewGuide = (axis: 'x' | 'y', e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Convert client coords to visual coords within container
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // We create a new guide.
    // If pulling from Top Ruler (Y axis guide - horizontal line) -> axis 'y'
    // If pulling from Left Ruler (X axis guide - vertical line) -> axis 'x'
    
    // Convert current pointer to logical coords
    const logicalCoord = axis === 'x' 
      ? (e.clientX - rect.left - (rect.width / 2) - panOffset.x) / zoom
      : (e.clientY - rect.top - (rect.height / 2) - panOffset.y) / zoom;
      
    addGuide(axis, logicalCoord);
    
    // The newly added guide will be at the end of the array
    const index = guides[axis].length; 
    
    setActiveGuide({ axis, index });
  };

  const startDragExistingGuide = (axis: 'x' | 'y', index: number, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveGuide({ axis, index });
  };

  useEffect(() => {
    if (!activeGuide) return;
    
    const onMove = (e: PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const { axis, index } = activeGuide;
      const logicalCoord = axis === 'x' 
        ? (e.clientX - rect.left - (rect.width / 2) - panOffset.x) / zoom
        : (e.clientY - rect.top - (rect.height / 2) - panOffset.y) / zoom;
        
      updateGuide(axis, index, logicalCoord);
    };
    
    const onUp = (e: PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) {
        setActiveGuide(null);
        return;
      }
      
      const { axis, index } = activeGuide;
      // Check if dropped back into the ruler area (delete it)
      if (axis === 'x' && e.clientX - rect.left < 20) {
        removeGuide(axis, index);
      } else if (axis === 'y' && e.clientY - rect.top < 20) {
        removeGuide(axis, index);
      }
      setActiveGuide(null);
    };
    
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [activeGuide, zoom, panOffset, containerRef, updateGuide, removeGuide]);

  return (
    <>
      {/* Top Ruler */}
      <div 
        className={`absolute top-0 left-[20px] right-0 h-[20px] ${isDark ? 'bg-[#111] border-[#333]' : 'bg-[#FFF] border-[#DDD]'} z-50 cursor-row-resize border-b`}
        onPointerDown={(e) => startDragNewGuide('y', e)}
      >
        <canvas ref={topRulerRef} className="w-full h-full pointer-events-none" />
      </div>

      {/* Left Ruler */}
      <div 
        className={`absolute top-[20px] left-0 bottom-0 w-[20px] ${isDark ? 'bg-[#111] border-[#333]' : 'bg-[#FFF] border-[#DDD]'} z-50 cursor-col-resize border-r`}
        onPointerDown={(e) => startDragNewGuide('x', e)}
      >
        <canvas ref={leftRulerRef} className="w-full h-full pointer-events-none" />
      </div>

      {/* Corner Square */}
      <div className={`absolute top-0 left-0 w-[20px] h-[20px] ${isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-[#F9FAFB] border-[#DDD]'} border-b border-r z-50`} />

      {/* Guides Render */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
        {guides.x.map((xPos, idx) => {
          const visualX = xPos * zoom + panOffset.x + (dimensions.w / 2);
          // Only render if visible
          if (visualX < 20 || visualX > dimensions.w) return null;
          
          return (
            <div 
              key={`x-${idx}`}
              className="absolute top-[20px] bottom-0 w-[4px] -ml-[2px] cursor-col-resize pointer-events-auto group flex justify-center"
              style={{ transform: `translateX(${visualX}px)` }}
              onPointerDown={(e) => startDragExistingGuide('x', idx, e)}
            >
              <div className={`w-[1px] h-full ${activeGuide?.axis === 'x' && activeGuide.index === idx ? 'bg-[#0099FF]' : 'bg-[#0099FF]/50 group-hover:bg-[#0099FF]'}`} />
            </div>
          )
        })}
        {guides.y.map((yPos, idx) => {
          const visualY = yPos * zoom + panOffset.y + (dimensions.h / 2);
          if (visualY < 20 || visualY > dimensions.h) return null;
          
          return (
            <div 
              key={`y-${idx}`}
              className="absolute left-[20px] right-0 h-[4px] -mt-[2px] cursor-row-resize pointer-events-auto group flex items-center"
              style={{ transform: `translateY(${visualY}px)` }}
              onPointerDown={(e) => startDragExistingGuide('y', idx, e)}
            >
               <div className={`h-[1px] w-full ${activeGuide?.axis === 'y' && activeGuide.index === idx ? 'bg-[#0099FF]' : 'bg-[#0099FF]/50 group-hover:bg-[#0099FF]'}`} />
            </div>
          )
        })}
      </div>
    </>
  );
}
