import React from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { NodeStyleProps, ScrollSectionConfig } from '../../types/builder';
import { Plus, X, Minus, Hash } from 'lucide-react';

interface ScrollSectionProps {
  effectiveStyles: NodeStyleProps;
}

export default function ScrollSection({ effectiveStyles }: ScrollSectionProps) {
  const selectedNodeId = useBuilderStore((state) => state?.selectedNodeId);
  const activeBreakpoint = useBuilderStore((state) => state?.activeBreakpoint ?? 'lg');
  const updateNodeStyle = useBuilderStore((state) => state?.updateNodeStyle);

  if (!selectedNodeId) return null;

  const scrollSection = effectiveStyles.scrollSection;
  const isScrollActive = Boolean(scrollSection);

  const handleAddScrollSection = () => {
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      scrollSection: {
        name: 'section-1',
        offsetY: 0
      }
    });
  };

  const handleRemoveScrollSection = () => {
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      scrollSection: null
    });
  };

  const updateScrollSection = (updates: Partial<ScrollSectionConfig>) => {
    if (!scrollSection) return;
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      scrollSection: {
        ...scrollSection,
        ...updates
      }
    });
  };

  return (
    <div className="border-b border-zinc-200 dark:border-[#1E1E1E] py-2.5 px-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-zinc-500 dark:text-white font-bold tracking-wider capitalize">Scroll Section</span>
        
        {!isScrollActive ? (
          <button
            onClick={handleAddScrollSection}
            className="p-1 rounded text-zinc-500 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors"
            title="Add Scroll Section Anchor"
          >
            <Plus size={13} />
          </button>
        ) : (
          <button
            onClick={handleRemoveScrollSection}
            className="p-1 rounded text-zinc-500 dark:text-[#777] hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors"
            title="Remove Scroll Section"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {isScrollActive && scrollSection && (
        <div className="flex flex-col gap-2 bg-zinc-50 dark:bg-[#161616] p-2.5 rounded border border-zinc-200 dark:border-[#242424]">
          {/* Section ID Name */}
          <div className="flex items-center gap-1.5">
            <Hash size={13} className="text-zinc-400 dark:text-[#666]" />
            <input
              type="text"
              value={scrollSection.name}
              placeholder="section-id"
              onChange={(e) => updateScrollSection({ name: e.target.value.replace(/\s+/g, '-').toLowerCase() })}
              className="flex-1 bg-white dark:bg-[#111] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 text-xs px-2 py-1 rounded outline-none font-mono transition-colors"
            />
          </div>

          {/* Offset Y */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Offset Y</span>
            <div className="flex items-center bg-white dark:bg-[#111] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] rounded overflow-hidden">
              <button
                onClick={() => updateScrollSection({ offsetY: (scrollSection.offsetY || 0) - 10 })}
                className="px-2 py-1 text-zinc-500 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors"
              >
                <Minus size={11} />
              </button>
              <input
                type="number"
                value={scrollSection.offsetY || 0}
                onChange={(e) => updateScrollSection({ offsetY: Number(e.target.value) })}
                className="w-12 bg-transparent text-zinc-900 dark:text-white text-xs text-center outline-none"
              />
              <button
                onClick={() => updateScrollSection({ offsetY: (scrollSection.offsetY || 0) + 10 })}
                className="px-2 py-1 text-zinc-500 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors"
              >
                <Plus size={11} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
