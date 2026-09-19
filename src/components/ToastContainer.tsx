import React from 'react';
import { useToastStore } from '../store/toastStore';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Sparkles, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  const getIcon = (type?: string, title?: string) => {
    if (title?.toLowerCase().includes('agent') || title?.toLowerCase().includes('ai')) {
      return <Sparkles size={16} className="text-zinc-900 dark:text-white shrink-0 animate-pulse" />;
    }
    if (type === 'success') {
      return <CheckCircle2 size={16} className="text-zinc-900 dark:text-white shrink-0" />;
    }
    if (type === 'warning') {
      return <AlertCircle size={16} className="text-zinc-900 dark:text-white shrink-0" />;
    }
    if (type === 'error') {
      return <AlertCircle size={16} className="text-rose-400 shrink-0" />;
    }
    return <Info size={16} className="text-zinc-900 dark:text-white shrink-0" />;
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999999] flex flex-col gap-2 pointer-events-none select-none max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="pointer-events-auto flex items-start gap-2.5 px-3.5 py-2.5 bg-zinc-900/95 dark:bg-[#1C1C1F]/95 border border-zinc-700/80 dark:border-[#333] text-white rounded-lg shadow-2xl backdrop-blur-md"
          >
            <div className="pt-0.5">{getIcon(toast.type, toast.title)}</div>
            <div className="flex-1 min-w-0 pr-1">
              <p className="text-xs font-medium text-white leading-tight truncate">
                {toast.title}
              </p>
              {toast.description && (
                <p className="text-[11px] text-zinc-400 dark:text-zinc-400 mt-0.5 leading-tight">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-0.5 -mr-1 -mt-0.5 text-zinc-400 hover:text-white rounded hover:bg-white/10 transition-colors"
            >
              <X size={12} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
