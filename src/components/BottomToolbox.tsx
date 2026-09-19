import React, { useState, useRef, useEffect } from 'react';
import { 
  MousePointer2, 
  Hand, 
  MessageCircle, 
  Moon, 
  Sun, 
  ChevronDown, 
  Check, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Scan, 
  Sparkles,
  Layers,
  Grid
} from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import clsx from 'clsx';

// Framer Tooltip Component
interface TooltipProps {
  label: string;
  shortcut?: string;
  children: React.ReactNode;
  theme?: 'dark' | 'light';
}

const Tooltip: React.FC<TooltipProps> = ({ label, shortcut, children, theme = 'dark' }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div 
          className={clsx(
            "absolute bottom-full mb-2.5 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xl pointer-events-none z-50 whitespace-nowrap animate-in fade-in zoom-in-95 duration-100",
            theme === 'dark' 
              ? "bg-[#1F1F23] text-white border border-[#333338]" 
              : "bg-white text-zinc-900 border border-zinc-200 shadow-lg"
          )}
        >
          <span>{label}</span>
          {shortcut && (
            <span 
              className={clsx(
                "px-1.5 py-0.5 rounded text-[10px] font-mono",
                theme === 'dark' ? "bg-[#2E2E35] text-[#9999A5]" : "bg-zinc-100 text-zinc-500"
              )}
            >
              {shortcut}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default function BottomToolbox() {
  const canvasTool = useBuilderStore((state) => state?.canvasTool);
  const setCanvasTool = useBuilderStore((state) => state?.setCanvasTool);
  const editorTheme = useBuilderStore((state) => state?.editorTheme ?? 'dark');
  const toggleEditorTheme = useBuilderStore((state) => state?.toggleEditorTheme);
  const toggleCanvasTheme = useBuilderStore((state) => state?.toggleCanvasTheme);
  const showGrid = useBuilderStore((state) => state?.showGrid ?? false);
  const setShowGrid = useBuilderStore((state) => state?.setShowGrid);
  const zoom = useBuilderStore((state) => state?.zoom) || 1;
  const setZoom = useBuilderStore((state) => state?.setZoom);
  const zoomIn = useBuilderStore((state) => state?.zoomIn);
  const zoomOut = useBuilderStore((state) => state?.zoomOut);
  const zoomTo100 = useBuilderStore((state) => state?.zoomTo100);
  const zoomToFit = useBuilderStore((state) => state?.zoomToFit);
  const zoomToSelection = useBuilderStore((state) => state?.zoomToSelection);
  const isPreviewMode = useBuilderStore((state) => state?.isPreviewMode ?? false);

  const [zoomMenuOpen, setZoomMenuOpen] = useState(false);
  const [fastZoom, setFastZoom] = useState(false);
  const [nudgeAmount, setNudgeAmount] = useState<1 | 10>(10);
  const [showNudgeSubmenu, setShowNudgeSubmenu] = useState(false);
  
  const zoomMenuRef = useRef<HTMLDivElement>(null);

  // Close zoom dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (zoomMenuRef.current && !zoomMenuRef.current.contains(e.target as Node)) {
        setZoomMenuOpen(false);
        setShowNudgeSubmenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcuts for toolbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key.toLowerCase() === 'v' && !e.metaKey && !e.ctrlKey) {
        setCanvasTool('select');
      } else if (e.key.toLowerCase() === 'h' && !e.metaKey && !e.ctrlKey) {
        setCanvasTool('hand');
      } else if (e.key.toLowerCase() === 'c' && !e.metaKey && !e.ctrlKey) {
        setCanvasTool('comment');
      } else if (e.key.toLowerCase() === 'z' && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
        setZoomMenuOpen(prev => !prev);
      } else if ((e.metaKey || e.ctrlKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        zoomIn();
      } else if ((e.metaKey || e.ctrlKey) && e.key === '-') {
        e.preventDefault();
        zoomOut();
      } else if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault();
        zoomTo100();
      } else if ((e.metaKey || e.ctrlKey) && e.key === '1') {
        e.preventDefault();
        zoomToFit();
      } else if ((e.metaKey || e.ctrlKey) && e.key === '2') {
        e.preventDefault();
        zoomToSelection();
      } else if (e.shiftKey && e.key.toLowerCase() === 'g' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShowGrid?.(!showGrid);
      } else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        toggleEditorTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCanvasTool, toggleEditorTheme, zoomIn, zoomOut, zoomTo100, zoomToFit, zoomToSelection, showGrid, setShowGrid]);

  if (isPreviewMode) return null;

  const isDark = editorTheme === 'dark';
  const zoomPercentage = Math.round(zoom * 100);

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 select-none">
      {/* Framer Bottom Toolbox Pill */}
      <div 
        className={clsx(
          "flex items-center gap-1 px-1.5 py-1.5 rounded-2xl shadow-2xl backdrop-blur-xl transition-all border",
          isDark 
            ? "bg-[#141416]/90 border-[#27272A] text-white" 
            : "bg-white/95 border-zinc-200 text-zinc-800 shadow-zinc-300/40"
        )}
      >
        {/* 1. SELECT TOOL (V) */}
        <Tooltip label="Select" shortcut="V" theme={editorTheme}>
          <button
            onClick={() => setCanvasTool('select')}
            className={clsx(
              "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
              canvasTool === 'select'
                ? isDark 
                  ? "bg-[#27272A] text-white shadow-sm" 
                  : "bg-zinc-100 text-zinc-900 shadow-sm"
                : isDark 
                  ? "text-[#9999A5] hover:text-white hover:bg-[#202024]" 
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
            )}
          >
            <MousePointer2 size={16} strokeWidth={2.2} />
          </button>
        </Tooltip>

        {/* 2. PAN / HAND TOOL (H) */}
        <Tooltip label="Hand" shortcut="H" theme={editorTheme}>
          <button
            onClick={() => setCanvasTool('hand')}
            className={clsx(
              "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
              canvasTool === 'hand'
                ? isDark 
                  ? "bg-[#27272A] text-white shadow-sm" 
                  : "bg-zinc-100 text-zinc-900 shadow-sm"
                : isDark 
                  ? "text-[#9999A5] hover:text-white hover:bg-[#202024]" 
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
            )}
          >
            <Hand size={16} strokeWidth={2.2} />
          </button>
        </Tooltip>

        {/* 3. COMMENT TOOL (C) */}
        <Tooltip label="Comment" shortcut="C" theme={editorTheme}>
          <button
            onClick={() => setCanvasTool('comment')}
            className={clsx(
              "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
              canvasTool === 'comment'
                ? isDark 
                  ? "bg-[#27272A] text-white shadow-sm" 
                  : "bg-zinc-100 text-zinc-900 shadow-sm"
                : isDark 
                  ? "text-[#9999A5] hover:text-white hover:bg-[#202024]" 
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
            )}
          >
            <MessageCircle size={16} strokeWidth={2.2} />
          </button>
        </Tooltip>

        {/* GRID TOGGLE */}
        <Tooltip label="Grid Overlay" shortcut="⇧G" theme={editorTheme}>
          <button
            onClick={() => setShowGrid?.(!showGrid)}
            className={clsx(
              "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
              showGrid
                ? isDark ? "bg-[#333338] text-white" : "bg-zinc-200 text-zinc-900"
                : isDark ? "text-[#9999A5] hover:text-white hover:bg-[#202024]" : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
            )}
          >
            <Grid size={16} strokeWidth={2.2} />
          </button>
        </Tooltip>

        <div className="w-[1px] h-4 mx-0.5 bg-zinc-200 dark:bg-[#333338]" />

        {/* 4. THEME TOGGLE (^⌘N) */}
        <Tooltip label="Theme" shortcut="^⌘N" theme={editorTheme}>
          <button
            onClick={() => {
              toggleEditorTheme?.();
              toggleCanvasTheme?.();
            }}
            className={clsx(
              "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
              isDark 
                ? "text-[#9999A5] hover:text-white hover:bg-[#202024]" 
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
            )}
          >
            {isDark ? (
              <Moon size={16} strokeWidth={2.2} />
            ) : (
              <Sun size={16} strokeWidth={2.2} className="text-zinc-900 dark:text-white" />
            )}
          </button>
        </Tooltip>

        {/* 5. ZOOM PERCENTAGE & DROPDOWN MENU */}
        <div className="relative" ref={zoomMenuRef}>
          <button
            onClick={() => setZoomMenuOpen(!zoomMenuOpen)}
            className={clsx(
              "h-8 px-2.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-all",
              zoomMenuOpen
                ? isDark 
                  ? "bg-[#27272A] text-white" 
                  : "bg-zinc-100 text-zinc-900"
                : isDark 
                  ? "text-[#CCC] hover:text-white hover:bg-[#202024]" 
                  : "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"
            )}
          >
            <span>{zoomPercentage}%</span>
            <ChevronDown size={13} className={clsx("transition-transform duration-150", zoomMenuOpen && "rotate-180")} />
          </button>

          {/* ZOOM DROPDOWN MENU (Gambar 5) */}
          {zoomMenuOpen && (
            <div 
              className={clsx(
                "absolute bottom-full mb-2.5 right-0 w-56 rounded-xl border shadow-2xl py-1.5 z-50 text-xs select-none animate-in fade-in zoom-in-95 duration-100",
                isDark 
                  ? "bg-[#18181B] border-[#2E2E35] text-[#E4E4E7]" 
                  : "bg-white border-zinc-200 text-zinc-800 shadow-xl"
              )}
            >
              {/* Preset Zoom Options */}
              <div 
                onClick={() => {
                  zoomIn();
                  setZoomMenuOpen(false);
                }}
                className={clsx(
                  "flex items-center justify-between px-3.5 py-1.5 cursor-pointer transition-colors",
                  isDark ? "hover:bg-[#27272A] text-white" : "hover:bg-zinc-100 text-zinc-900"
                )}
              >
                <span>Zoom In</span>
                <span className={clsx("text-[10px] font-mono", isDark ? "text-[#888]" : "text-zinc-400")}>⌘ +</span>
              </div>

              <div 
                onClick={() => {
                  zoomOut();
                  setZoomMenuOpen(false);
                }}
                className={clsx(
                  "flex items-center justify-between px-3.5 py-1.5 cursor-pointer transition-colors",
                  isDark ? "hover:bg-[#27272A] text-white" : "hover:bg-zinc-100 text-zinc-900"
                )}
              >
                <span>Zoom Out</span>
                <span className={clsx("text-[10px] font-mono", isDark ? "text-[#888]" : "text-zinc-400")}>⌘ −</span>
              </div>

              <div className={clsx("h-px my-1", isDark ? "bg-[#27272A]" : "bg-zinc-100")} />

              {/* Granular Zoom Values */}
              <div className="grid grid-cols-3 gap-1 px-2 py-1">
                {[0.25, 0.5, 0.75, 1.0, 1.5, 2.0].map((val) => {
                  const pct = Math.round(val * 100);
                  const isCurrent = Math.abs(zoom - val) < 0.04;
                  return (
                    <button
                      key={pct}
                      onClick={() => {
                        setZoom(val);
                        setZoomMenuOpen(false);
                      }}
                      className={clsx(
                        "py-1 rounded-md text-[11px] font-mono font-medium transition-colors text-center cursor-pointer",
                        isCurrent
                          ? "bg-[#0099FF] text-white"
                          : isDark
                            ? "hover:bg-[#27272A] text-[#BBB]"
                            : "hover:bg-zinc-100 text-zinc-700"
                      )}
                    >
                      {pct}%
                    </button>
                  );
                })}
              </div>

              <div className={clsx("h-px my-1", isDark ? "bg-[#27272A]" : "bg-zinc-100")} />

              <div 
                onClick={() => {
                  zoomTo100();
                  setZoomMenuOpen(false);
                }}
                className={clsx(
                  "flex items-center justify-between px-3.5 py-1.5 cursor-pointer transition-colors",
                  isDark ? "hover:bg-[#27272A] text-white" : "hover:bg-zinc-100 text-zinc-900"
                )}
              >
                <span>Zoom to 100%</span>
                <span className={clsx("text-[10px] font-mono", isDark ? "text-[#888]" : "text-zinc-400")}>⌘ 0</span>
              </div>

              <div 
                onClick={() => {
                  zoomToFit();
                  setZoomMenuOpen(false);
                }}
                className={clsx(
                  "flex items-center justify-between px-3.5 py-1.5 cursor-pointer transition-colors",
                  isDark ? "hover:bg-[#27272A] text-white" : "hover:bg-zinc-100 text-zinc-900"
                )}
              >
                <span>Zoom to Fit</span>
                <span className={clsx("text-[10px] font-mono", isDark ? "text-[#888]" : "text-zinc-400")}>⌘ 1</span>
              </div>

              <div 
                onClick={() => {
                  zoomToSelection();
                  setZoomMenuOpen(false);
                }}
                className={clsx(
                  "flex items-center justify-between px-3.5 py-1.5 cursor-pointer transition-colors",
                  isDark ? "hover:bg-[#27272A] text-white" : "hover:bg-zinc-100 text-zinc-900"
                )}
              >
                <span>Zoom to Selection</span>
                <span className={clsx("text-[10px] font-mono", isDark ? "text-[#888]" : "text-zinc-400")}>⌘ 2</span>
              </div>

              <div className={clsx("h-px my-1", isDark ? "bg-[#27272A]" : "bg-zinc-100")} />

              <div 
                onClick={() => setFastZoom(!fastZoom)}
                className={clsx(
                  "flex items-center justify-between px-3.5 py-2 cursor-pointer transition-colors",
                  isDark ? "hover:bg-[#27272A] text-white" : "hover:bg-zinc-100 text-zinc-900"
                )}
              >
                <span>Fast Zoom</span>
                {fastZoom && <Check size={13} className="text-zinc-900 dark:text-white" />}
              </div>

              {/* Nudge Amount with Submenu */}
              <div 
                className="relative"
                onMouseEnter={() => setShowNudgeSubmenu(true)}
                onMouseLeave={() => setShowNudgeSubmenu(false)}
              >
                <div 
                  className={clsx(
                    "flex items-center justify-between px-3.5 py-2 cursor-pointer transition-colors",
                    isDark ? "hover:bg-[#27272A] text-white" : "hover:bg-zinc-100 text-zinc-900"
                  )}
                >
                  <span>Nudge Amount</span>
                  <span className={clsx("text-[10px]", isDark ? "text-[#888]" : "text-zinc-400")}>{nudgeAmount}px</span>
                </div>

                {showNudgeSubmenu && (
                  <div 
                    className={clsx(
                      "absolute right-full bottom-0 mr-1 w-32 rounded-xl border shadow-2xl py-1 z-50 text-xs select-none",
                      isDark 
                        ? "bg-[#1E1E22] border-[#2E2E35] text-[#E4E4E7]" 
                        : "bg-white border-zinc-200 text-zinc-800 shadow-xl"
                    )}
                  >
                    <div 
                      onClick={() => {
                        setNudgeAmount(1);
                        setShowNudgeSubmenu(false);
                      }}
                      className={clsx(
                        "flex items-center justify-between px-3 py-1.5 cursor-pointer",
                        isDark ? "hover:bg-[#27272A]" : "hover:bg-zinc-100"
                      )}
                    >
                      <span>1px (Fine)</span>
                      {nudgeAmount === 1 && <Check size={12} className="text-zinc-900 dark:text-white" />}
                    </div>
                    <div 
                      onClick={() => {
                        setNudgeAmount(10);
                        setShowNudgeSubmenu(false);
                      }}
                      className={clsx(
                        "flex items-center justify-between px-3 py-1.5 cursor-pointer",
                        isDark ? "hover:bg-[#27272A]" : "hover:bg-zinc-100"
                      )}
                    >
                      <span>10px (Default)</span>
                      {nudgeAmount === 10 && <Check size={12} className="text-zinc-900 dark:text-white" />}
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
