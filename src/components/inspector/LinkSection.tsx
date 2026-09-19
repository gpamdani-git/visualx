import React, { useState, useRef, useEffect } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { NodeStyleProps, LinkConfig } from '../../types/builder';
import { useProjectStore } from '../../store/projectStore';
import { ChevronDown, Plus, X, Link as LinkIcon, ExternalLink } from 'lucide-react';

interface LinkSectionProps {
  effectiveStyles: NodeStyleProps;
}

export default function LinkSection({ effectiveStyles }: LinkSectionProps) {
  const selectedNodeId = useBuilderStore((state) => state?.selectedNodeId);
  const activeBreakpoint = useBuilderStore((state) => state?.activeBreakpoint ?? 'lg');
  const updateNodeStyle = useBuilderStore((state) => state?.updateNodeStyle);

  const activeProjectId = useProjectStore((state) => state?.activeProjectId);
  const projects = useProjectStore((state) => state?.projects);
  const activeProject = React.useMemo(() => {
    if (!projects || projects.length === 0) return null;
    return projects.find((p) => p.id === activeProjectId) || projects[0];
  }, [projects, activeProjectId]);
  const pages = React.useMemo(() => activeProject?.pages || [], [activeProject]);

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

  const link = effectiveStyles.link;
  const isLinkActive = Boolean(link);

  const handleAddLink = () => {
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      link: {
        url: 'https://',
        target: '_blank'
      }
    });
  };

  const handleRemoveLink = () => {
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      link: null
    });
  };

  const updateLinkProp = (updates: Partial<LinkConfig>) => {
    if (!link) return;
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      link: {
        ...link,
        ...updates
      }
    });
  };

  return (
    <div className="border-b border-zinc-200 dark:border-[#1E1E1E] py-2.5 px-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-zinc-500 dark:text-white font-bold tracking-wider capitalize">Link</span>
        
        {!isLinkActive ? (
          <button
            onClick={handleAddLink}
            className="p-1 rounded text-zinc-500 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors"
            title="Add Link"
          >
            <Plus size={13} />
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="p-1 rounded text-zinc-500 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors"
                title="Add Link Options"
              >
                <Plus size={13} />
              </button>

              {showAddMenu && (
                <div className="absolute right-0 top-6 z-50 w-36 bg-white dark:bg-[#222] border border-zinc-200 dark:border-[#333] rounded shadow-2xl py-1 text-xs">
                  <button
                    onClick={() => {
                      updateLinkProp({ rel: ['noopener', 'noreferrer'] });
                      setShowAddMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#252525] text-zinc-700 dark:text-[#DDD] transition-colors"
                  >
                    Rel
                  </button>
                  <button
                    onClick={() => {
                      updateLinkProp({ params: '?ref=website' });
                      setShowAddMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#252525] text-zinc-700 dark:text-[#DDD] transition-colors"
                  >
                    Parameters
                  </button>
                  <button
                    onClick={() => {
                      updateLinkProp({ tracking: 'cta_click' });
                      setShowAddMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#252525] text-zinc-700 dark:text-[#DDD] transition-colors"
                  >
                    Tracking
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleRemoveLink}
              className="p-1 rounded text-zinc-500 dark:text-[#777] hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors"
              title="Remove Link"
            >
              <X size={13} />
            </button>
          </div>
        )}
      </div>

      {/* When Link is Active */}
      {isLinkActive && link && (
        <div className="flex flex-col gap-2">
          {/* Target URL / Page Selector */}
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={link.url}
              placeholder="https:// or /page or #section"
              onChange={(e) => updateLinkProp({ url: e.target.value })}
              className="flex-1 bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2 py-1 rounded outline-none focus:border-zinc-400 dark:focus:border-zinc-500 placeholder-zinc-400 dark:placeholder-zinc-600 transition-colors"
            />
            {/* Quick Page Picker */}
            {pages.length > 1 && (
              <div className="relative">
                <select
                  onChange={(e) => {
                    if (e.target.value) updateLinkProp({ url: e.target.value, target: '_self' });
                  }}
                  className="appearance-none bg-white dark:bg-[#222] hover:bg-zinc-50 dark:hover:bg-[#2A2A2A] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2 py-1 pr-5 rounded outline-none cursor-pointer transition-colors"
                  defaultValue=""
                >
                  <option value="" disabled>Pages</option>
                  {pages.map((p) => (
                    <option key={p.id} value={p.path || `/${p.name.toLowerCase()}`}>{p.name}</option>
                  ))}
                </select>
                <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-[#777] pointer-events-none" />
              </div>
            )}
          </div>

          {/* Target (_blank or _self) */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Target</span>
            <div className="relative">
              <select
                value={link.target || '_blank'}
                onChange={(e) => updateLinkProp({ target: e.target.value as '_blank' | '_self' })}
                className="appearance-none bg-white dark:bg-[#222] hover:bg-zinc-50 dark:hover:bg-[#2A2A2A] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-1 pr-6 rounded outline-none cursor-pointer transition-colors"
              >
                <option value="_blank">New Tab (_blank)</option>
                <option value="_self">Same Tab (_self)</option>
              </select>
              <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-[#777] pointer-events-none" />
            </div>
          </div>

          {/* Optional Rel */}
          {link.rel && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-zinc-500 dark:text-[#888]">Rel</span>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={link.rel.join(' ')}
                  onChange={(e) => updateLinkProp({ rel: e.target.value.split(' ').filter(Boolean) })}
                  className="w-32 bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-1.5 py-0.5 rounded outline-none"
                />
                <button
                  onClick={() => updateLinkProp({ rel: undefined })}
                  className="p-1 text-zinc-400 dark:text-[#666] hover:text-red-500 transition-colors"
                >
                  <X size={11} />
                </button>
              </div>
            </div>
          )}

          {/* Optional Parameters */}
          {link.params !== undefined && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-zinc-500 dark:text-[#888]">Params</span>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={link.params}
                  onChange={(e) => updateLinkProp({ params: e.target.value })}
                  className="w-32 bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-1.5 py-0.5 rounded outline-none"
                />
                <button
                  onClick={() => updateLinkProp({ params: undefined })}
                  className="p-1 text-zinc-400 dark:text-[#666] hover:text-red-500 transition-colors"
                >
                  <X size={11} />
                </button>
              </div>
            </div>
          )}

          {/* Optional Tracking */}
          {link.tracking !== undefined && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-zinc-500 dark:text-[#888]">Tracking</span>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={link.tracking}
                  onChange={(e) => updateLinkProp({ tracking: e.target.value })}
                  className="w-32 bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-1.5 py-0.5 rounded outline-none"
                />
                <button
                  onClick={() => updateLinkProp({ tracking: undefined })}
                  className="p-1 text-zinc-400 dark:text-[#666] hover:text-red-500 transition-colors"
                >
                  <X size={11} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
