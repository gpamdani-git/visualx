import React, { useMemo, useState } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { generateFullJSXFile } from '../../utils/jsxGenerator';
import { Copy, Check, TerminalSquare } from 'lucide-react';
import { showToast } from '../../store/toastStore';

export const CodeTab = () => {
  const selectedNodeId = useBuilderStore(s => s.selectedNodeId);
  const nodes = useBuilderStore(s => s.nodes);
  
  const [copied, setCopied] = useState(false);

  const jsxCode = useMemo(() => {
    if (!selectedNodeId) return '';
    return generateFullJSXFile(selectedNodeId, nodes);
  }, [selectedNodeId, nodes]);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsxCode);
    setCopied(true);
    showToast('JSX Copied to Clipboard!', 'You can now paste it into your IDE', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!selectedNodeId) return null;

  return (
    <div className="flex flex-col h-full bg-[#1A1A1E]">
      <div className="flex items-center justify-between p-3 border-b border-[#222]">
        <div className="flex items-center gap-2 text-zinc-400">
          <TerminalSquare size={14} />
          <span className="text-xs font-medium">React JSX</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#252528] hover:bg-[#333] border border-[#333] hover:border-[#444] rounded text-[11px] font-medium text-white transition-all"
        >
          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-4">
        <pre className="text-[11px] font-mono leading-relaxed text-[#D4D4D4] whitespace-pre-wrap">
          {jsxCode.split('\n').map((line, i) => {
            // Very simple pseudo-syntax highlighting for tags and props
            // In a production app, we'd use PrismJS or similar
            const isImport = line.startsWith('import');
            const isFunction = line.includes('export default function');
            const isTag = line.trim().startsWith('<') || line.trim().startsWith('</');
            
            let colorClass = "text-[#D4D4D4]";
            if (isImport) colorClass = "text-[#C586C0]";
            else if (isFunction) colorClass = "text-[#569CD6]";
            else if (isTag) colorClass = "text-[#80CBC4]";

            return (
              <div key={i} className={colorClass}>{line}</div>
            );
          })}
        </pre>
      </div>
      
      <div className="p-3 border-t border-[#222] bg-[#111]">
        <p className="text-[10px] text-zinc-500 leading-tight">
          This JSX code is auto-generated based on your visual design. You can copy it directly into any Next.js or Vite React project that uses Hudbird UI.
        </p>
      </div>
    </div>
  );
};
