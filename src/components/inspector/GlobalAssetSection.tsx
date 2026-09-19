import React from 'react';
import { Palette, Plus } from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';
import { useBuilderStore } from '../../store/builderStore';

export default function GlobalAssetSection() {
  const activeProjectId = useProjectStore(s => s.activeProjectId);
  const projects = useProjectStore(s => s.projects);
  const canvasTheme = useBuilderStore(s => s.canvasTheme ?? 'dark');
  const activeProject = projects.find(p => p.id === activeProjectId);
  const storeTokens = activeProject?.colorTokens || [];
  const textTokens = activeProject?.textTokens || [];

  const colorTokens = storeTokens.map(t => ({
    name: t.name,
    val: canvasTheme === 'light' ? (t.lightValue || t.darkValue) : (t.darkValue || t.lightValue),
  }));

  return (
    <div className="flex flex-col text-xs text-zinc-700 dark:text-[#CCC]">
      {/* Header Banner */}
      <div className="p-3.5 border-b border-zinc-200 dark:border-[#1E1E1E] bg-zinc-100/70 dark:bg-[#141414]">
        <div className="flex items-center gap-2 mb-1">
          <Palette size={15} className="text-pink-500 dark:text-pink-400" />
          <span className="font-semibold text-zinc-900 dark:text-white text-sm">Design System Assets</span>
        </div>
        <span className="text-zinc-500 dark:text-[#666] text-[11px]">Global Color & Typography Tokens</span>
      </div>

      {/* Color Styles */}
      <div className="p-3 border-b border-zinc-200 dark:border-[#1E1E1E] flex flex-col gap-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold text-zinc-500 dark:text-white font-bold tracking-wider capitalize">Color Tokens</span>
          <button className="p-1 rounded text-zinc-500 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors">
            <Plus size={12} />
          </button>
        </div>

        {colorTokens.map((c) => (
          <div key={c.name} className="flex items-center justify-between bg-zinc-50 dark:bg-[#161616] p-1.5 rounded border border-zinc-200 dark:border-[#242424]">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-zinc-300 dark:border-[#333]" style={{ backgroundColor: c.val }} />
              <span className="text-zinc-900 dark:text-white text-xs">{c.name}</span>
            </div>
            <span className="text-[10px] text-zinc-500 dark:text-[#666] font-mono">{c.val}</span>
          </div>
        ))}
      </div>

      {/* Text Styles */}
      <div className="p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold text-zinc-500 dark:text-white font-bold tracking-wider capitalize">Text Styles</span>
          <button className="p-1 rounded text-zinc-500 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors">
            <Plus size={12} />
          </button>
        </div>

        {textTokens.map((t) => (
          <div key={t.id} className="flex flex-col gap-0.5 bg-zinc-50 dark:bg-[#161616] p-2 rounded border border-zinc-200 dark:border-[#242424]">
            <span className="text-zinc-900 dark:text-white text-xs font-medium">{t.name}</span>
            <span className="text-[10px] text-zinc-500 dark:text-[#777] font-mono">
              {t.fontFamily} · {t.fontSize}px · {t.fontWeight}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
