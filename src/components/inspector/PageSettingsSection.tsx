import React from 'react';
import { useProjectStore } from '../../store/projectStore';
import { useBuilderStore } from '../../store/builderStore';
import { FileText, Globe, Monitor, Tablet, Smartphone, Sparkles, Image } from 'lucide-react';
import { BreakpointKey } from '../../types/builder';

const DEFAULT_BREAKPOINT_WIDTHS: Record<BreakpointKey, number> = { lg: 1200, md: 810, base: 390 };
const EMPTY_OBJECT: Record<string, any> = {};

export default function PageSettingsSection() {
  const projects = useProjectStore((state) => state?.projects);
  const activeProjectId = useProjectStore((state) => state?.activeProjectId);
  const activeProject = (projects || []).find((p) => p.id === activeProjectId) || projects?.[0];
  const renamePage = useProjectStore((state) => state?.renamePage);
  
  const rootNodeId = useBuilderStore((state) => state?.rootNodeId);
  const nodes = useBuilderStore((state) => state?.nodes) || EMPTY_OBJECT;
  const rootNode = rootNodeId ? nodes[rootNodeId] : undefined;
  const activeBreakpoint = useBuilderStore((state) => state?.activeBreakpoint ?? 'lg');
  const updateNodeStyle = useBuilderStore((state) => state?.updateNodeStyle);
  const breakpointWidths = useBuilderStore((state) => state?.breakpointWidths) || DEFAULT_BREAKPOINT_WIDTHS;
  const setBreakpointWidth = useBuilderStore((state) => state?.setBreakpointWidth);

  const activePage = activeProject?.pages.find((p) => p.id === activeProject.activePageId) || activeProject?.pages[0];

  const pageBg = rootNode?.responsiveStyles[activeBreakpoint]?.backgroundColor || '#0a0a0a';

  if (!activePage) return null;

  return (
    <div className="flex flex-col text-xs text-zinc-700 dark:text-[#CCC]">
      {/* Header Banner */}
      <div className="p-3.5 border-b border-zinc-200 dark:border-[#1E1E1E] bg-zinc-100/70 dark:bg-[#141414]">
        <div className="flex items-center gap-2 mb-1">
          <FileText size={15} className="text-zinc-500 dark:text-[#888]" />
          <span className="font-semibold text-zinc-900 dark:text-white text-sm">{activePage.name}</span>
          {activePage.isHome && (
            <span className="bg-zinc-200 dark:bg-[#333] text-zinc-700 dark:text-[#AAA] text-[10px] font-medium px-1.5 py-0.5 rounded">Home</span>
          )}
        </div>
        <span className="text-zinc-500 dark:text-[#666] text-[11px] font-mono">{activePage.path || '/'}</span>
      </div>

      {/* Page Configuration */}
      <div className="p-3 border-b border-zinc-200 dark:border-[#1E1E1E] flex flex-col gap-2.5">
        <span className="text-[11px] font-semibold text-zinc-500 dark:text-[#888] tracking-wider capitalize">Page Info</span>
        
        <div className="flex items-center justify-between gap-2">
          <span className="text-zinc-600 dark:text-[#A0A0A0]">Title</span>
          <input
            type="text"
            value={activePage.name}
            onChange={(e) => renamePage(activePage.id, e.target.value, activePage.path)}
            className="w-36 bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white px-2 py-1 rounded outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-zinc-600 dark:text-[#A0A0A0]">Slug / Path</span>
          <input
            type="text"
            value={activePage.path || '/'}
            onChange={(e) => renamePage(activePage.id, activePage.name, e.target.value)}
            className="w-36 bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white px-2 py-1 rounded outline-none font-mono focus:border-zinc-400 dark:focus:border-zinc-500"
          />
        </div>

        {/* Page Background */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-zinc-600 dark:text-[#A0A0A0]">Canvas Background</span>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={pageBg}
              onChange={(e) => updateNodeStyle(rootNodeId, activeBreakpoint, { backgroundColor: e.target.value })}
              className="w-5 h-5 rounded border border-zinc-300 dark:border-[#333] cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={pageBg}
              onChange={(e) => updateNodeStyle(rootNodeId, activeBreakpoint, { backgroundColor: e.target.value })}
              className="w-20 bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white px-1.5 py-0.5 rounded font-mono text-center outline-none"
            />
          </div>
        </div>
      </div>

      {/* Breakpoints Sizing (Desktop, Tablet, Phone) */}
      <div className="p-3 border-b border-zinc-200 dark:border-[#1E1E1E] flex flex-col gap-2.5">
        <span className="text-[11px] font-semibold text-zinc-500 dark:text-white font-bold tracking-wider capitalize">Responsive Breakpoints</span>

        {/* Desktop */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-600 dark:text-[#A0A0A0]">
            <Monitor size={13} className="text-zinc-400 dark:text-[#666]" />
            <span>Desktop</span>
          </div>
          <div className="flex items-center bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] rounded-lg px-2 py-0.5">
            <input
              type="number"
              value={breakpointWidths.lg}
              onChange={(e) => setBreakpointWidth('lg', Number(e.target.value))}
              className="w-12 bg-transparent text-zinc-900 dark:text-white text-right outline-none font-mono"
            />
            <span className="text-[10px] text-zinc-400 dark:text-[#666] ml-1">px</span>
          </div>
        </div>

        {/* Tablet */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-600 dark:text-[#A0A0A0]">
            <Tablet size={13} className="text-zinc-400 dark:text-[#666]" />
            <span>Tablet</span>
          </div>
          <div className="flex items-center bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] rounded-lg px-2 py-0.5">
            <input
              type="number"
              value={breakpointWidths.md}
              onChange={(e) => setBreakpointWidth('md', Number(e.target.value))}
              className="w-12 bg-transparent text-zinc-900 dark:text-white text-right outline-none font-mono"
            />
            <span className="text-[10px] text-zinc-400 dark:text-[#666] ml-1">px</span>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-600 dark:text-[#A0A0A0]">
            <Smartphone size={13} className="text-zinc-400 dark:text-[#666]" />
            <span>Phone</span>
          </div>
          <div className="flex items-center bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] rounded-lg px-2 py-0.5">
            <input
              type="number"
              value={breakpointWidths.base}
              onChange={(e) => setBreakpointWidth('base', Number(e.target.value))}
              className="w-12 bg-transparent text-zinc-900 dark:text-white text-right outline-none font-mono"
            />
            <span className="text-[10px] text-zinc-400 dark:text-[#666] ml-1">px</span>
          </div>
        </div>
      </div>

      {/* SEO & Social Metadata */}
      <div className="p-3 flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          <Globe size={13} className="text-zinc-400 dark:text-[#666]" />
          <span className="text-[11px] font-semibold text-zinc-500 dark:text-[#888] tracking-wider capitalize">SEO & Social</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-zinc-500 dark:text-[#888]">Page Title</span>
          <input
            type="text"
            placeholder="My Awesome Site — Built with Framer"
            defaultValue={`${activePage.name} | ${activeProject?.title || 'Website'}`}
            className="w-full bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white px-2 py-1 rounded outline-none placeholder-zinc-400 dark:placeholder-[#555]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-zinc-500 dark:text-[#888]">Meta Description</span>
          <textarea
            rows={2}
            placeholder="Brief description for search engines..."
            defaultValue="Explore modern interactive experiences crafted visually."
            className="w-full bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white px-2 py-1 rounded outline-none resize-none placeholder-zinc-400 dark:placeholder-[#555]"
          />
        </div>
      </div>
    </div>
  );
}
