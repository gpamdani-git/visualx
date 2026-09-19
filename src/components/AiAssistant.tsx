import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Search, Sparkles } from 'lucide-react';

export default function AiAssistant({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('');

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[400px] bg-white dark:bg-gradient-to-b dark:from-[#0A192F] dark:to-[#020617] rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-blue-900/30 flex flex-col items-center p-8 pt-12"
          >
            {/* AI Orb Animation */}
            <div className="relative w-32 h-32 mb-8">
               <motion.div 
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 via-cyan-400 to-transparent opacity-80 blur-md"
                  style={{ mixBlendMode: 'screen' }}
               />
               <motion.div 
                  animate={{ 
                    rotate: -360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full bg-gradient-to-bl from-purple-600 via-blue-400 to-transparent opacity-60 blur-md"
                  style={{ mixBlendMode: 'screen' }}
               />
               <div className="absolute inset-2 bg-white dark:bg-[#020617] rounded-full z-10 shadow-inner flex items-center justify-center">
                 <Sparkles className="w-8 h-8 text-zinc-900 dark:text-white dark:text-white opacity-90" />
               </div>
            </div>

            <div className="text-center mb-8">
               <p className="text-zinc-500 dark:text-gray-400 text-sm mb-2">Hello, I'm Canvas AI</p>
               <h2 className="text-3xl font-medium text-zinc-900 dark:text-white tracking-tight leading-tight">
                 How can I help you<br/>build today?
               </h2>
            </div>

            <div className="w-full relative">
               <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-900 blur-xl rounded-full" />
               <div className="relative bg-zinc-100 dark:bg-white/10 border border-zinc-200 dark:border-white/20 rounded-full flex items-center px-4 py-3 backdrop-blur-md">
                 <Search className="w-5 h-5 text-zinc-500 dark:text-gray-400 mr-3" />
                 <input 
                   type="text"
                   value={query}
                   onChange={(e) => setQuery(e.target.value)}
                   placeholder="Ask anything..."
                   className="flex-1 bg-transparent text-zinc-900 dark:text-white placeholder-zinc-400 outline-none text-base"
                   autoFocus
                 />
                 <button className="p-2 bg-white/60 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 rounded-full transition-colors ml-2 cursor-pointer shadow-xs">
                   <Mic className="w-4 h-4 text-zinc-800 dark:text-white" />
                 </button>
               </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
               <span className="text-xs bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full px-3 py-1.5 text-zinc-700 dark:text-gray-300 cursor-pointer hover:bg-zinc-200 dark:hover:bg-white/10 transition">Generate pricing section</span>
               <span className="text-xs bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full px-3 py-1.5 text-zinc-700 dark:text-gray-300 cursor-pointer hover:bg-zinc-200 dark:hover:bg-white/10 transition">Make layout responsive</span>
               <span className="text-xs bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full px-3 py-1.5 text-zinc-700 dark:text-gray-300 cursor-pointer hover:bg-zinc-200 dark:hover:bg-white/10 transition">Optimize SEO tags</span>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
