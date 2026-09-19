import React, { useRef } from 'react';
import { useBuilderStore } from '../store/builderStore';
import { FillConfig } from './inspector/ColorPopover';
import { BreakpointKey } from '../types/builder';

export function GradientControllerOverlay({ fillConfig, nodeId, breakpoint }: { fillConfig: FillConfig, nodeId: string, breakpoint: BreakpointKey }) {
  const updateNodeStyle = useBuilderStore((state) => state?.updateNodeStyle);
  const svgRef = useRef<SVGSVGElement>(null);

  if (!fillConfig.handles || fillConfig.handles.length === 0) return null;

  const generateGradientCss = (type: string, stps: {color: string, position: number}[], hndls?: {x: number, y: number}[]) => {
    const stopsStr = stps.map(s => `${s.color} ${s.position}%`).join(', ');
    
    let cx = 50, cy = 50;
    if (hndls && hndls.length > 0) {
      cx = hndls[0].x * 100;
      cy = hndls[0].y * 100;
    }

    if (type === 'linear') {
      let angle = 180;
      if (hndls && hndls.length === 2) {
        const dx = hndls[1].x - hndls[0].x;
        const dy = hndls[1].y - hndls[0].y;
        angle = Math.atan2(dx, -dy) * 180 / Math.PI;
      }
      return `linear-gradient(${angle}deg, ${stopsStr})`;
    } else if (type === 'radial') {
      if (hndls && hndls.length === 2) {
        // Approximate radius based on distance
        const dx = hndls[1].x - hndls[0].x;
        const dy = hndls[1].y - hndls[0].y;
        const dist = Math.sqrt(dx*dx + dy*dy) * 100; // rough percentage
        // return `radial-gradient(circle ${dist}cqi at ${cx}% ${cy}%, ${stopsStr})`; 
        // Note: cqi (container query inline) or % might not be perfect for circle, 
        // CSS prefers px, but let's just use a percentage ellipse for simplicity
        return `radial-gradient(ellipse ${dist}% ${dist}% at ${cx}% ${cy}%, ${stopsStr})`;
      }
      return `radial-gradient(circle at ${cx}% ${cy}%, ${stopsStr})`;
    } else if (type === 'conic') {
      let angle = 0;
      if (hndls && hndls.length === 2) {
        const dx = hndls[1].x - hndls[0].x;
        const dy = hndls[1].y - hndls[0].y;
        angle = Math.atan2(dx, -dy) * 180 / Math.PI;
      }
      return `conic-gradient(from ${angle}deg at ${cx}% ${cy}%, ${stopsStr})`;
    }
    return '';
  };

  const handleDrag = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    e.preventDefault();
    
    const handleMove = (moveEvent: MouseEvent) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      
      // Allow dragging outside boundaries (standard gradient behavior in Framer/Figma)
      const x = (moveEvent.clientX - rect.left) / rect.width;
      const y = (moveEvent.clientY - rect.top) / rect.height;
      
      const newHandles = [...fillConfig.handles!];
      newHandles[index] = { x, y };
      
      const newConfig = { ...fillConfig, handles: newHandles };
      const newCss = generateGradientCss(newConfig.type, newConfig.stops || [], newHandles);
      
      updateNodeStyle(nodeId, breakpoint, {
        fillConfig: newConfig,
        backgroundColor: newCss
      });
    };
    
    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
    
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  return (
    <svg 
      ref={svgRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-[100] overflow-visible"
      style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }}
    >
      {fillConfig.handles.length === 2 && (
        <>
          {fillConfig.type === 'radial' && (
            <circle
              cx={`${fillConfig.handles[0].x * 100}%`}
              cy={`${fillConfig.handles[0].y * 100}%`}
              r={`${Math.sqrt(Math.pow(fillConfig.handles[1].x - fillConfig.handles[0].x, 2) + Math.pow(fillConfig.handles[1].y - fillConfig.handles[0].y, 2)) * 100}%`}
              fill="none"
              stroke="white"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          )}
          {fillConfig.type === 'conic' && (
            <circle
              cx={`${fillConfig.handles[0].x * 100}%`}
              cy={`${fillConfig.handles[0].y * 100}%`}
              r={`${Math.sqrt(Math.pow(fillConfig.handles[1].x - fillConfig.handles[0].x, 2) + Math.pow(fillConfig.handles[1].y - fillConfig.handles[0].y, 2)) * 100}%`}
              fill="none"
              stroke="white"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          )}
          {/* Outline line for visibility */}
          <line 
            x1={`${fillConfig.handles[0].x * 100}%`} 
            y1={`${fillConfig.handles[0].y * 100}%`} 
            x2={`${fillConfig.handles[1].x * 100}%`} 
            y2={`${fillConfig.handles[1].y * 100}%`} 
            stroke="white" 
            strokeWidth="4"
          />
          {/* Inner line */}
          <line 
            x1={`${fillConfig.handles[0].x * 100}%`} 
            y1={`${fillConfig.handles[0].y * 100}%`} 
            x2={`${fillConfig.handles[1].x * 100}%`} 
            y2={`${fillConfig.handles[1].y * 100}%`} 
            stroke="#0099FF" 
            strokeWidth="2"
          />
        </>
      )}

      {fillConfig.handles.map((h, i) => (
        <g key={i} className="pointer-events-auto cursor-grab active:cursor-grabbing" onMouseDown={(e) => handleDrag(e, i)}>
          <circle 
            cx={`${h.x * 100}%`} 
            cy={`${h.y * 100}%`} 
            r="10" 
            fill="white" 
            stroke="#0099FF" 
            strokeWidth="3"
            className="hover:scale-110 transition-transform origin-center"
          />
          {fillConfig.stops && fillConfig.stops[i] && (
            <circle 
              cx={`${h.x * 100}%`} 
              cy={`${h.y * 100}%`} 
              r="5" 
              fill={fillConfig.stops[i].color} 
            />
          )}
        </g>
      ))}
    </svg>
  );
}
