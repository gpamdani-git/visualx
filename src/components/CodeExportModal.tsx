import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import { generateReactCode, generateHtmlCode } from '../utils/exportUtils';

export default function CodeExportModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [format, setFormat] = useState<'html' | 'react'>('html');
  const nodes = useBuilderStore((state) => state?.nodes) || {};
  const rootNodeId = useBuilderStore((state) => state?.rootNodeId);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const code = format === 'react' ? generateReactCode(nodes, rootNodeId) : generateHtmlCode(nodes, rootNodeId);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-[#222] rounded-xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-200 dark:border-[#222] flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-zinc-900 dark:text-white font-medium">Export Code</h2>
            <div className="flex bg-zinc-100 dark:bg-[#222] rounded-md p-0.5 border border-zinc-200 dark:border-[#333]">
              <button 
                onClick={() => setFormat('html')}
                className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors ${format === 'html' ? 'bg-white dark:bg-[#333] text-zinc-900 dark:text-white shadow-xs' : 'text-zinc-500 dark:text-[#888] hover:text-zinc-900 dark:hover:text-white'}`}
              >
                HTML + Tailwind
              </button>
              <button 
                onClick={() => setFormat('react')}
                className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors ${format === 'react' ? 'bg-white dark:bg-[#333] text-zinc-900 dark:text-white shadow-xs' : 'text-zinc-500 dark:text-[#888] hover:text-zinc-900 dark:hover:text-white'}`}
              >
                React
              </button>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-zinc-100 dark:hover:bg-[#222] rounded-md text-zinc-500 dark:text-[#999] hover:text-zinc-900 dark:hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="relative flex-1 bg-zinc-900 dark:bg-[#0A0A0A] p-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <pre className="text-sm font-mono text-zinc-200">
            <code>{code}</code>
          </pre>
          
          <button 
            onClick={handleCopy}
            className="absolute top-4 right-4 flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 dark:bg-[#222] dark:hover:bg-[#333] border border-zinc-700 dark:border-[#444] px-3 py-1.5 rounded-md text-white transition-colors cursor-pointer shadow-md"
          >
            {copied ? <Check className="w-4 h-4 text-zinc-900 dark:text-white" /> : <Copy className="w-4 h-4" />}
            <span className="text-xs font-medium">{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
        
        <div className="px-4 py-3 border-t border-zinc-200 dark:border-[#222] flex justify-end bg-zinc-50 dark:bg-[#111]">
          <button onClick={onClose} className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-[#222] dark:hover:bg-[#333] text-zinc-800 dark:text-white rounded-md text-sm font-medium transition-colors cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
