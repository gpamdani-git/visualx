import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Code, FileCode2, Loader2, RefreshCw } from 'lucide-react';

export interface Action {
  type: string;
  description: string;
  status: 'pending' | 'generating' | 'completed';
}

interface AiProgressState {
  currentTask: string;
  actions: Action[];
}

export const AiProgressDisplay: React.FC<AiProgressState> = ({ currentTask, actions }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="w-full bg-zinc-50 dark:bg-[#1A1A1A] border border-zinc-200 dark:border-[#333] rounded-lg overflow-hidden mt-2">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center justify-between border-b border-zinc-200 dark:border-[#333]/50"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronUp className="w-4 h-4 text-zinc-500" />}
          <span className="text-[13px] font-medium text-zinc-900 dark:text-white">{currentTask}</span>
        </div>
        <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
      </button>
      
      {isExpanded && (
        <div className="bg-zinc-100 dark:bg-[#141414] p-2 space-y-1">
          {actions.map((action, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[12px] text-zinc-700 dark:text-gray-300 px-2 py-1.5 rounded hover:bg-zinc-200 dark:hover:bg-[#2A2A2A]">
              {action.status === 'generating' ? (
                <RefreshCw className="w-3 h-3 animate-spin text-purple-500" />
              ) : (
                <Code className="w-3 h-3 text-zinc-400" />
              )}
              <span>{action.description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
