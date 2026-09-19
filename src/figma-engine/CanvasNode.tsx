import React, { useRef } from 'react';
import { useFigmaStore } from './store';

export function CanvasNode({ id }: { id: string; key?: React.Key }) {
  const node = useFigmaStore((state) => state.nodes[id]);
  const selectNode = useFigmaStore((state) => state.selectNode);
  const reparentNode = useFigmaStore((state) => state.reparentNode);
  const selectedId = useFigmaStore((state) => state.selectedId);
  const ref = useRef<HTMLDivElement>(null);

  if (!node) return null;

  const isSelected = selectedId === id;
  const isFrame = node.type === 'FRAME';

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    selectNode(id);

    const el = ref.current;
    if (!el) return;

    // Grab starting coordinates
    const startX = e.clientX;
    const startY = e.clientY;
    
    // We capture the original bounding rect to calculate offset relative to the pointer
    const initialRect = el.getBoundingClientRect();
    const offsetX = e.clientX - initialRect.left;
    const offsetY = e.clientY - initialRect.top;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      
      // TRANSIENT UPDATE: Direct DOM manipulation (60 FPS, bypasses React state updates)
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      el.style.zIndex = '9999'; // Bring to front while dragging
      
      // Optional: Add pointer-events none to children to avoid intercepting drops
      el.style.pointerEvents = 'none'; 
    };

    const onPointerUp = (upEvent: PointerEvent) => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      // Restore inline styles
      el.style.transform = '';
      el.style.zIndex = '';
      el.style.pointerEvents = 'auto'; // ensure it can be clicked again

      // Calculate final global top-left coordinates of this node
      const newGlobalX = upEvent.clientX - offsetX;
      const newGlobalY = upEvent.clientY - offsetY;

      // HIT TESTING: Find what frame is underneath the cursor
      // We temporarily disable pointer events on this dragged node so it doesn't block the hit test
      el.style.pointerEvents = 'none';
      const elementsUnder = document.elementsFromPoint(upEvent.clientX, upEvent.clientY);
      el.style.pointerEvents = 'auto';

      let targetFrameId: string | null = null;
      let targetFrameEl: Element | null = null;

      for (const elem of elementsUnder) {
        if (elem.hasAttribute('data-frame-id')) {
          const fId = elem.getAttribute('data-frame-id');
          // Validation: The drop target cannot be itself, and cannot be a child of itself
          if (fId && fId !== id && !el.contains(elem)) {
            targetFrameId = fId;
            targetFrameEl = elem;
            break;
          }
        }
      }

      // MATHEMATICAL REPARENTING: Convert Global coordinates to Local coordinates
      if (targetFrameId && targetFrameEl) {
        // Dropped inside a Frame
        const frameRect = targetFrameEl.getBoundingClientRect();
        const localX = newGlobalX - frameRect.left;
        const localY = newGlobalY - frameRect.top;
        reparentNode(id, targetFrameId, localX, localY);
      } else {
        // Dropped onto the root canvas
        const canvasEl = document.getElementById('figma-canvas-root');
        if (canvasEl) {
          const canvasRect = canvasEl.getBoundingClientRect();
          const localX = newGlobalX - canvasRect.left;
          const localY = newGlobalY - canvasRect.top;
          reparentNode(id, null, localX, localY);
        }
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <div
      ref={ref}
      onPointerDown={handlePointerDown}
      data-frame-id={isFrame ? id : undefined}
      style={{
        position: 'absolute',
        left: node.x,
        top: node.y,
        width: node.w,
        height: node.h,
        backgroundColor: node.color,
        boxShadow: isSelected ? '0 0 0 2px #3b82f6, 0 4px 12px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)',
        // Note: Figma frames clip their children, but for visual clarity during a drop, we leave it visible.
        // We use overflow visible so you can see a child being dragged out of a frame bounds easily.
        overflow: 'visible',
        cursor: 'grab'
      }}
      className={isFrame ? 'border border-gray-300' : 'rounded-md border border-black/10'}
    >
      {/* Frame Name Label */}
      {isFrame && (
        <div className="absolute -top-5 left-0 text-[11px] text-gray-500 font-medium whitespace-nowrap">
          {node.name}
        </div>
      )}
      
      {/* Recursive rendering of children */}
      {isFrame && node.children.map(childId => (
        <CanvasNode key={childId} id={childId} />
      ))}
      
      {node.type === 'TEXT' && (
        <div className="w-full h-full flex items-center justify-center p-2 text-sm">
          {node.name}
        </div>
      )}
    </div>
  );
}
