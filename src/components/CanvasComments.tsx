import React, { useState } from 'react';
import { MessageCircle, Check, Trash2, X, Send } from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import clsx from 'clsx';

const EMPTY_COMMENTS: any[] = [];

export default function CanvasComments() {
  const comments = useBuilderStore((state) => state?.comments) || EMPTY_COMMENTS;
  const addComment = useBuilderStore((state) => state?.addComment);
  const resolveComment = useBuilderStore((state) => state?.resolveComment);
  const deleteComment = useBuilderStore((state) => state?.deleteComment);
  const canvasTool = useBuilderStore((state) => state?.canvasTool);
  const activeBreakpoint = useBuilderStore((state) => state?.activeBreakpoint ?? 'lg');
  const isPreviewMode = useBuilderStore((state) => state?.isPreviewMode ?? false);

  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [newCommentInput, setNewCommentInput] = useState('');
  const [pendingPin, setPendingPin] = useState<{ x: number; y: number } | null>(null);

  if (isPreviewMode) return null;

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (canvasTool !== 'comment') return;

    // Get coordinates relative to comments layer container
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPendingPin({ x, y });
    setNewCommentInput('');
  };

  const handlePostComment = () => {
    if (!pendingPin || !newCommentInput.trim()) return;

    addComment({
      x: pendingPin.x,
      y: pendingPin.y,
      text: newCommentInput.trim(),
      author: 'You',
      breakpoint: activeBreakpoint
    });

    setPendingPin(null);
    setNewCommentInput('');
  };

  return (
    <div 
      className={clsx(
        "absolute inset-0 pointer-events-none z-30",
        canvasTool === 'comment' && "pointer-events-auto cursor-crosshair"
      )}
      onClick={handleCanvasClick}
    >
      {/* Existing Comments Pins */}
      {comments.map((comment) => {
        const isOpen = activeCommentId === comment.id;

        return (
          <div
            key={comment.id}
            className="absolute pointer-events-auto select-none"
            style={{ left: `${comment.x}px`, top: `${comment.y}px` }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Comment Pin Avatar Badge */}
            <button
              onClick={() => setActiveCommentId(isOpen ? null : comment.id)}
              className={clsx(
                "w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-xl transition-transform hover:scale-110 border-2",
                comment.resolved
                  ? "bg-emerald-600 text-white border-white/40"
                  : "bg-[#0099FF] text-white border-white shadow-[0_0_12px_rgba(0,153,255,0.5)]"
              )}
            >
              {comment.resolved ? <Check size={13} strokeWidth={3} /> : <MessageCircle size={13} />}
            </button>

            {/* Comment Popover Thread */}
            {isOpen && (
              <div className="absolute left-8 top-0 w-64 bg-white dark:bg-[#1C1C20] border border-zinc-200 dark:border-[#333338] text-zinc-900 dark:text-white rounded-xl shadow-2xl p-3 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-[#2A2A30]">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">
                      {comment.author[0]}
                    </div>
                    <span className="font-semibold text-zinc-900 dark:text-white">{comment.author}</span>
                  </div>
                  <button 
                    onClick={() => setActiveCommentId(null)}
                    className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                </div>

                <p className="py-2 text-zinc-700 dark:text-zinc-200 leading-relaxed break-words">{comment.text}</p>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-[#2A2A30] text-[10px] text-zinc-500 dark:text-zinc-400">
                  <button
                    onClick={() => resolveComment(comment.id)}
                    className="flex items-center gap-1 hover:text-zinc-900 dark:text-white dark:hover:text-zinc-900 dark:text-white transition-colors cursor-pointer"
                  >
                    <Check size={12} />
                    <span>{comment.resolved ? 'Reopen' : 'Resolve'}</span>
                  </button>

                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="flex items-center gap-1 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Pending New Comment Input */}
      {pendingPin && (
        <div
          className="absolute pointer-events-auto select-none"
          style={{ left: `${pendingPin.x}px`, top: `${pendingPin.y}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-7 h-7 rounded-full bg-[#0099FF] text-white flex items-center justify-center font-bold text-xs border-2 border-white shadow-xl animate-bounce">
            <MessageCircle size={13} />
          </div>

          <div className="absolute left-8 top-0 w-64 bg-white dark:bg-[#1C1C20] border border-zinc-200 dark:border-[#333338] text-zinc-900 dark:text-white rounded-xl shadow-2xl p-3 z-50 text-xs">
            <span className="font-semibold text-zinc-900 dark:text-white block mb-1.5">New Comment</span>
            <textarea
              value={newCommentInput}
              onChange={(e) => setNewCommentInput(e.target.value)}
              placeholder="Leave a thought or feedback..."
              autoFocus
              className="w-full bg-zinc-50 dark:bg-[#121214] border border-zinc-200 dark:border-[#2A2A30] rounded-lg p-2 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none focus:border-zinc-400 dark:focus:border-zinc-500 resize-none h-16"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handlePostComment();
                }
                if (e.key === 'Escape') {
                  setPendingPin(null);
                }
              }}
            />
            <div className="flex items-center justify-end gap-1.5 mt-2">
              <button
                onClick={() => setPendingPin(null)}
                className="px-2.5 py-1 rounded hover:bg-zinc-100 dark:hover:bg-[#2A2A30] text-zinc-500 dark:text-zinc-400 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePostComment}
                className="px-3 py-1 bg-[#0099FF] hover:bg-blue-600 text-white font-medium rounded-lg text-xs flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <Send size={11} />
                <span>Post</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
