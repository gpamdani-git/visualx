import React from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { NodeStyleProps, AccessibilityConfig } from '../../types/builder';
import { ChevronDown, Plus, X } from 'lucide-react';

interface AccessibilitySectionProps {
  effectiveStyles: NodeStyleProps;
}

export default function AccessibilitySection({ effectiveStyles }: AccessibilitySectionProps) {
  const selectedNodeId = useBuilderStore((state) => state?.selectedNodeId);
  const activeBreakpoint = useBuilderStore((state) => state?.activeBreakpoint ?? 'lg');
  const updateNodeStyle = useBuilderStore((state) => state?.updateNodeStyle);

  if (!selectedNodeId) return null;

  const access: AccessibilityConfig = effectiveStyles.accessibility || {
    tag: 'div',
    ariaLabel: '',
    tabIndex: undefined,
    googleBot: 'Index'
  };

  const isAccessActive = Boolean(effectiveStyles.accessibility);

  const handleAddAccess = () => {
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      accessibility: {
        tag: 'section',
        ariaLabel: '',
        tabIndex: undefined,
        googleBot: 'Index'
      }
    });
  };

  const handleRemoveAccess = () => {
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      accessibility: null
    });
  };

  const updateAccess = (updates: Partial<AccessibilityConfig>) => {
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      accessibility: {
        ...access,
        ...updates
      }
    });
  };

  const tags = ['div', 'section', 'nav', 'header', 'footer', 'main', 'article', 'button', 'a', 'aside', 'figure', 'h1', 'h2', 'p', 'span'];

  return (
    <div className="border-b border-zinc-200 dark:border-[#1E1E1E] py-2.5 px-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-zinc-500 dark:text-white font-bold tracking-wider capitalize">Accessibility</span>
        
        {!isAccessActive ? (
          <button
            onClick={handleAddAccess}
            className="p-1 rounded text-zinc-500 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors"
            title="Configure Accessibility"
          >
            <Plus size={13} />
          </button>
        ) : (
          <button
            onClick={handleRemoveAccess}
            className="p-1 rounded text-zinc-500 dark:text-[#777] hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors"
            title="Reset Accessibility"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {isAccessActive && (
        <div className="flex flex-col gap-2 bg-zinc-50 dark:bg-[#161616] p-2.5 rounded border border-zinc-200 dark:border-[#242424]">
          {/* HTML Tag (Image 24) */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Tag</span>
            <div className="relative">
              <select
                value={access.tag}
                onChange={(e) => updateAccess({ tag: e.target.value })}
                className="appearance-none bg-white dark:bg-[#111] hover:bg-zinc-50 dark:hover:bg-[#1A1A1A] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-1 pr-6 rounded outline-none cursor-pointer font-mono transition-colors"
              >
                {tags.map((t) => (
                  <option key={t} value={t}>&lt;{t}&gt;</option>
                ))}
              </select>
              <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-[#777] pointer-events-none" />
            </div>
          </div>

          {/* Aria Label */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Aria Label</span>
            <input
              type="text"
              value={access.ariaLabel || ''}
              placeholder="e.g. Navigation Header"
              onChange={(e) => updateAccess({ ariaLabel: e.target.value })}
              className="flex-1 max-w-[140px] bg-white dark:bg-[#111] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 text-xs px-2 py-0.5 rounded outline-none transition-colors"
            />
          </div>

          {/* Tab Index with Clear button */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Tab Index</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={access.tabIndex !== undefined ? access.tabIndex : ''}
                placeholder="auto"
                onChange={(e) => updateAccess({ tabIndex: e.target.value === '' ? undefined : Number(e.target.value) })}
                className="w-14 bg-white dark:bg-[#111] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 text-xs text-center py-0.5 rounded outline-none transition-colors"
              />
              {access.tabIndex !== undefined && (
                <button
                  onClick={() => updateAccess({ tabIndex: undefined })}
                  className="p-1 text-zinc-400 dark:text-[#666] hover:text-red-500 transition-colors"
                  title="Clear Tab Index"
                >
                  <X size={11} />
                </button>
              )}
            </div>
          </div>

          {/* Google Bot (Index / No Index / Skip) */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Google Bot</span>
            <div className="relative">
              <select
                value={access.googleBot || 'Index'}
                onChange={(e) => updateAccess({ googleBot: e.target.value as any })}
                className="appearance-none bg-white dark:bg-[#111] hover:bg-zinc-50 dark:hover:bg-[#1A1A1A] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-1 pr-6 rounded outline-none cursor-pointer transition-colors"
              >
                <option value="Index">Index</option>
                <option value="No Index">No Index</option>
                <option value="Skip">Skip</option>
              </select>
              <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-[#777] pointer-events-none" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
