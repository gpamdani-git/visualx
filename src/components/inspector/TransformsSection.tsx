import React, { useState, useRef, useEffect } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { NodeStyleProps, TransformsConfig } from '../../types/builder';
import { ChevronDown, Plus, X, Minus } from 'lucide-react';

interface TransformsSectionProps {
  effectiveStyles: NodeStyleProps;
}

export default function TransformsSection({ effectiveStyles }: TransformsSectionProps) {
  const selectedNodeId = useBuilderStore((state) => state?.selectedNodeId);
  const activeBreakpoint = useBuilderStore((state) => state?.activeBreakpoint ?? 'lg');
  const updateNodeStyle = useBuilderStore((state) => state?.updateNodeStyle);

  const [showAddMenu, setShowAddMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowAddMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!selectedNodeId) return null;

  const transforms: TransformsConfig = effectiveStyles.transforms || {
    scale: 1,
    rotate2d: 0,
    is3d: false,
    rotate3d: { x: 0, y: 0, z: 0 },
    skew: { x: 0, y: 0 },
    depth: 0,
    perspective: 1000,
    backface: 'visible',
    preserve3d: false,
    activeProps: ['Rotate', 'Scale']
  };

  const isTransformsActive = Boolean(effectiveStyles.transforms);
  const activeProps = transforms.activeProps || ['Rotate', 'Scale'];

  const handleEnableTransforms = () => {
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      transforms: {
        scale: 1,
        rotate2d: 0,
        is3d: false,
        rotate3d: { x: 0, y: 0, z: 0 },
        skew: { x: 0, y: 0 },
        depth: 0,
        perspective: 1000,
        backface: 'visible',
        preserve3d: false,
        activeProps: ['Rotate', 'Scale']
      }
    });
  };

  const toggleProperty = (prop: string) => {
    const updatedProps = activeProps.includes(prop)
      ? activeProps.filter(p => p !== prop)
      : [...activeProps, prop];

    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      transforms: {
        ...transforms,
        activeProps: updatedProps
      }
    });
  };

  const updateTransforms = (updates: Partial<TransformsConfig>) => {
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      transforms: {
        ...transforms,
        ...updates
      }
    });
  };

  const allAvailableProps = ['Scale', 'Rotate', 'Skew', 'Depth', 'Perspective', 'Backface', 'Preserve 3D'];

  return (
    <div className="border-b border-zinc-200 dark:border-[#1E1E1E] py-2.5 px-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-zinc-500 dark:text-white font-bold tracking-wider capitalize">Transforms</span>
        
        {!isTransformsActive ? (
          <button
            onClick={handleEnableTransforms}
            className="p-1 rounded text-zinc-500 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors"
            title="Enable Transforms"
          >
            <Plus size={13} />
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="p-1 rounded text-zinc-500 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors"
                title="Toggle Transform Options"
              >
                <Plus size={13} />
              </button>

              {showAddMenu && (
                <div className="absolute right-0 top-6 z-50 w-44 bg-white dark:bg-[#222] border border-zinc-200 dark:border-[#333] rounded-lg shadow-2xl py-1 text-xs">
                  {allAvailableProps.map((p) => {
                    const isChecked = activeProps.includes(p);
                    return (
                      <button
                        key={p}
                        onClick={() => toggleProperty(p)}
                        className="w-full text-left px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#252525] text-zinc-700 dark:text-[#DDD] flex items-center justify-between transition-colors"
                      >
                        <span>{p}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="accent-[#0099FF] rounded pointer-events-none"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { transforms: null })}
              className="p-1 rounded text-zinc-500 dark:text-[#777] hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors"
              title="Remove Transforms"
            >
              <X size={13} />
            </button>
          </div>
        )}
      </div>

      {isTransformsActive && (
        <div className="flex flex-col gap-2.5">
          {/* SCALE */}
          {activeProps.includes('Scale') && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Scale</span>
              <div className="flex items-center bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] rounded overflow-hidden">
                <button
                  onClick={() => updateTransforms({ scale: Math.max(0.1, Number(((transforms.scale || 1) - 0.1).toFixed(1))) })}
                  className="px-2 py-1 text-zinc-500 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors"
                >
                  <Minus size={11} />
                </button>
                <input
                  type="number"
                  step="0.1"
                  value={transforms.scale !== undefined ? transforms.scale : 1}
                  onChange={(e) => updateTransforms({ scale: Number(e.target.value) })}
                  className="w-12 bg-transparent text-zinc-900 dark:text-white text-xs text-center outline-none"
                />
                <button
                  onClick={() => updateTransforms({ scale: Number(((transforms.scale || 1) + 0.1).toFixed(1)) })}
                  className="px-2 py-1 text-zinc-500 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors"
                >
                  <Plus size={11} />
                </button>
              </div>
            </div>
          )}

          {/* ROTATE 2D / 3D (Images 20, 21) */}
          {activeProps.includes('Rotate') && (
            <div className="flex flex-col gap-2 bg-zinc-50 dark:bg-[#161616] p-2 rounded border border-zinc-200 dark:border-[#242424]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Rotate</span>
                <div className="flex bg-zinc-100 dark:bg-[#111] p-0.5 rounded border border-zinc-200 dark:border-transparent hover:dark:border-[#333]">
                  <button
                    onClick={() => updateTransforms({ is3d: false })}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                      !transforms.is3d ? 'bg-white dark:bg-[#333] text-zinc-900 dark:text-white shadow-sm rounded-md' : 'text-zinc-500 dark:text-[#777]'
                    }`}
                  >
                    2D
                  </button>
                  <button
                    onClick={() => updateTransforms({ is3d: true })}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                      transforms.is3d ? 'bg-white dark:bg-[#333] text-zinc-900 dark:text-white shadow-sm rounded-md' : 'text-zinc-500 dark:text-[#777]'
                    }`}
                  >
                    3D
                  </button>
                </div>
              </div>

              {!transforms.is3d ? (
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={transforms.rotate2d || 0}
                    onChange={(e) => updateTransforms({ rotate2d: Number(e.target.value) })}
                    className="flex-1 accent-[#0099FF] h-1.5 bg-zinc-200 dark:bg-[#252525] rounded"
                  />
                  <div className="flex items-center bg-white dark:bg-[#111] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] rounded px-1.5 py-0.5 w-14">
                    <input
                      type="number"
                      value={transforms.rotate2d || 0}
                      onChange={(e) => updateTransforms({ rotate2d: Number(e.target.value) })}
                      className="w-full bg-transparent text-zinc-900 dark:text-white text-xs text-right outline-none"
                    />
                    <span className="text-[10px] text-zinc-400 dark:text-[#666] ml-0.5">°</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="flex flex-col items-center bg-white dark:bg-[#111] p-1 rounded border border-zinc-200 dark:border-transparent hover:dark:border-[#333]">
                    <span className="text-[9px] text-zinc-500 dark:text-[#777]">X</span>
                    <input
                      type="number"
                      value={transforms.rotate3d?.x || 0}
                      onChange={(e) => updateTransforms({ rotate3d: { ...transforms.rotate3d, x: Number(e.target.value), y: transforms.rotate3d?.y || 0, z: transforms.rotate3d?.z || 0 } })}
                      className="w-full bg-transparent text-zinc-900 dark:text-white text-xs text-center outline-none"
                    />
                  </div>
                  <div className="flex flex-col items-center bg-white dark:bg-[#111] p-1 rounded border border-zinc-200 dark:border-transparent hover:dark:border-[#333]">
                    <span className="text-[9px] text-zinc-500 dark:text-[#777]">Y</span>
                    <input
                      type="number"
                      value={transforms.rotate3d?.y || 0}
                      onChange={(e) => updateTransforms({ rotate3d: { ...transforms.rotate3d, y: Number(e.target.value), x: transforms.rotate3d?.x || 0, z: transforms.rotate3d?.z || 0 } })}
                      className="w-full bg-transparent text-zinc-900 dark:text-white text-xs text-center outline-none"
                    />
                  </div>
                  <div className="flex flex-col items-center bg-white dark:bg-[#111] p-1 rounded border border-zinc-200 dark:border-transparent hover:dark:border-[#333]">
                    <span className="text-[9px] text-zinc-500 dark:text-[#777]">Z</span>
                    <input
                      type="number"
                      value={transforms.rotate3d?.z || 0}
                      onChange={(e) => updateTransforms({ rotate3d: { ...transforms.rotate3d, z: Number(e.target.value), x: transforms.rotate3d?.x || 0, y: transforms.rotate3d?.y || 0 } })}
                      className="w-full bg-transparent text-zinc-900 dark:text-white text-xs text-center outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SKEW */}
          {activeProps.includes('Skew') && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Skew X / Y</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={transforms.skew?.x || 0}
                  onChange={(e) => updateTransforms({ skew: { ...transforms.skew, x: Number(e.target.value), y: transforms.skew?.y || 0 } })}
                  className="w-12 bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs text-center py-0.5 rounded outline-none"
                />
                <input
                  type="number"
                  value={transforms.skew?.y || 0}
                  onChange={(e) => updateTransforms({ skew: { ...transforms.skew, y: Number(e.target.value), x: transforms.skew?.x || 0 } })}
                  className="w-12 bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs text-center py-0.5 rounded outline-none"
                />
              </div>
            </div>
          )}

          {/* DEPTH */}
          {activeProps.includes('Depth') && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Depth</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="-200"
                  max="200"
                  value={transforms.depth || 0}
                  onChange={(e) => updateTransforms({ depth: Number(e.target.value) })}
                  className="w-20 accent-[#0099FF] h-1.5 bg-zinc-200 dark:bg-[#252525] rounded"
                />
                <span className="text-zinc-900 dark:text-white text-xs w-10 text-right">{transforms.depth || 0}px</span>
              </div>
            </div>
          )}

          {/* PERSPECTIVE */}
          {activeProps.includes('Perspective') && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Perspective</span>
              <div className="flex items-center bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] rounded-lg px-2 py-0.5 w-20">
                <input
                  type="number"
                  value={transforms.perspective || 1000}
                  onChange={(e) => updateTransforms({ perspective: Number(e.target.value) })}
                  className="w-full bg-transparent text-zinc-900 dark:text-white text-xs text-right outline-none"
                />
                <span className="text-[10px] text-zinc-400 dark:text-[#666] ml-1">px</span>
              </div>
            </div>
          )}

          {/* BACKFACE */}
          {activeProps.includes('Backface') && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Backface</span>
              <div className="relative">
                <select
                  value={transforms.backface || 'visible'}
                  onChange={(e) => updateTransforms({ backface: e.target.value as any })}
                  className="appearance-none bg-white dark:bg-[#222] hover:bg-zinc-50 dark:hover:bg-[#2A2A2A] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-1 pr-6 rounded outline-none cursor-pointer transition-colors"
                >
                  <option value="visible">Visible</option>
                  <option value="hidden">Hidden</option>
                </select>
                <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-[#777] pointer-events-none" />
              </div>
            </div>
          )}

          {/* PRESERVE 3D */}
          {activeProps.includes('Preserve 3D') && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Preserve 3D</span>
              <div className="relative">
                <select
                  value={transforms.preserve3d ? 'yes' : 'no'}
                  onChange={(e) => updateTransforms({ preserve3d: e.target.value === 'yes' })}
                  className="appearance-none bg-white dark:bg-[#222] hover:bg-zinc-50 dark:hover:bg-[#2A2A2A] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-1 pr-6 rounded outline-none cursor-pointer transition-colors"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
                <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-[#777] pointer-events-none" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
