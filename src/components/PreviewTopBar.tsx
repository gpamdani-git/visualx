import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  ChevronDown, 
  Check, 
  Play, 
  ExternalLink,
  Share2,
  Monitor,
  Tablet,
  Smartphone
} from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import { useProjectStore } from '../store/projectStore';
import { BreakpointKey } from '../types/builder';

export default function PreviewTopBar() {
  const setPreviewMode = useBuilderStore((state) => state?.setPreviewMode);
  const activeBreakpoint = useBuilderStore((state) => state?.activeBreakpoint ?? 'lg');
  const setBreakpoint = useBuilderStore((state) => state?.setBreakpoint);
  const previewWidth = useBuilderStore((state) => state?.previewWidth ?? 1200);
  const previewHeight = useBuilderStore((state) => state?.previewHeight ?? 735);
  const setPreviewWidth = useBuilderStore((state) => state?.setPreviewWidth);
  const setPreviewHeight = useBuilderStore((state) => state?.setPreviewHeight);
  const previewFullscreen = useBuilderStore((state) => state?.previewFullscreen ?? false);
  const setPreviewFullscreen = useBuilderStore((state) => state?.setPreviewFullscreen);
  const setPreviewShowUI = useBuilderStore((state) => state?.setPreviewShowUI);
  const refreshPreview = useBuilderStore((state) => state?.refreshPreview);
  const nextBreakpoint = useBuilderStore((state) => state?.nextBreakpoint);
  const previousBreakpoint = useBuilderStore((state) => state?.previousBreakpoint);

  const projects = useProjectStore((state) => state?.projects) || [];
  const activeProjectId = useProjectStore((state) => state?.activeProjectId);
  const saveActiveProject = useProjectStore((state) => state?.saveActiveProject);
  const currentProject = projects.find(p => p.id === activeProjectId);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fullscreenTooltip, setFullscreenTooltip] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [widthInput, setWidthInput] = useState(String(previewWidth));
  const [heightInput, setHeightInput] = useState(String(previewHeight));
  const [isRotating, setIsRotating] = useState(false);

  // Sync inputs with store
  useEffect(() => {
    setWidthInput(String(previewWidth));
  }, [previewWidth]);

  useEffect(() => {
    setHeightInput(String(previewHeight));
  }, [previewHeight]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation inside preview (⌘. for next, ⌘, for previous, Esc for exit/fullscreen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === '.' || e.code === 'Period')) {
        e.preventDefault();
        nextBreakpoint();
      } else if ((e.metaKey || e.ctrlKey) && (e.key === ',' || e.code === 'Comma')) {
        e.preventDefault();
        previousBreakpoint();
      } else if (e.key === 'Escape') {
        if (previewFullscreen) {
          setPreviewFullscreen(false);
          setPreviewShowUI(true);
        } else {
          setPreviewMode(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextBreakpoint, previousBreakpoint, previewFullscreen, setPreviewFullscreen, setPreviewShowUI, setPreviewMode]);

  const handleWidthBlur = () => {
    const val = parseInt(widthInput, 10);
    if (!isNaN(val) && val >= 320 && val <= 2560) {
      setPreviewWidth(val);
    } else {
      setWidthInput(String(previewWidth));
    }
  };

  const handleHeightBlur = () => {
    const val = parseInt(heightInput, 10);
    if (!isNaN(val) && val >= 300 && val <= 2000) {
      setPreviewHeight(val);
    } else {
      setHeightInput(String(previewHeight));
    }
  };

  const handleReload = () => {
    setIsRotating(true);
    refreshPreview();
    setTimeout(() => setIsRotating(false), 500);
  };

  const handleToggleFullscreen = () => {
    const nextState = !previewFullscreen;
    setPreviewFullscreen(nextState);
    if (nextState) {
      // In fullscreen, user can toggle Show UI
      setPreviewShowUI(false);
    } else {
      setPreviewShowUI(true);
    }
  };

  const getBreakpointLabel = () => {
    if (previewWidth >= 1200) return 'Desktop';
    if (previewWidth >= 810) return 'Tablet';
    return 'Phone';
  };

  return (
    <header className="h-12 bg-white dark:bg-[#121214] border-b border-zinc-200 dark:border-[#222226] flex items-center justify-between px-3 flex-shrink-0 z-50 select-none text-zinc-800 dark:text-[#E1E1E6] transition-colors">
      {/* 1. LEFT CONTROLS: Back, Reload, Fullscreen */}
      <div className="flex items-center space-x-1.5">
        {/* Back to Canvas Editor */}
        <button
          onClick={() => setPreviewMode(false)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-[#202024] text-zinc-600 hover:text-zinc-900 dark:text-[#C4C4CC] dark:hover:text-white transition-colors text-xs font-medium cursor-pointer"
          title="Back to Editor (Esc)"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Reload Preview Frame */}
        <button
          onClick={handleReload}
          className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-[#202024] text-zinc-500 hover:text-zinc-900 dark:text-[#A8A8B3] dark:hover:text-white transition-colors cursor-pointer"
          title="Reload preview"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
        </button>

        {/* Fullscreen Toggle */}
        <div className="relative">
          <button
            onClick={handleToggleFullscreen}
            onMouseEnter={() => setFullscreenTooltip(true)}
            onMouseLeave={() => setFullscreenTooltip(false)}
            className={`p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-[#202024] transition-colors cursor-pointer ${previewFullscreen ? 'text-zinc-900 dark:text-white bg-zinc-100 dark:bg-[#202024]' : 'text-zinc-500 hover:text-zinc-900 dark:text-[#A8A8B3] dark:hover:text-white'}`}
          >
            {previewFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Fullscreen Tooltip */}
          {fullscreenTooltip && (
            <div className="absolute top-9 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-[#202024] text-white text-[11px] font-medium px-2 py-1 rounded shadow-xl border border-zinc-700 dark:border-[#2E2E34] whitespace-nowrap z-50 pointer-events-none">
              Fullscreen
            </div>
          )}
        </div>
      </div>

      {/* 2. CENTER CONTROLS: Breakpoint Dropdown & Dimension Inputs (W / H) */}
      <div className="flex items-center space-x-2">
        {/* Breakpoint Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-[#1C1C20] hover:bg-zinc-200 dark:hover:bg-[#25252B] border border-zinc-200 dark:border-[#2E2E34] text-xs font-medium text-zinc-900 dark:text-white transition-colors cursor-pointer"
          >
            <span>{getBreakpointLabel()}</span>
            <ChevronDown className="w-3 h-3 text-zinc-400 dark:text-[#8E8E93]" />
          </button>

          {/* Breakpoint Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-48 bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-[#2A2A2E] rounded-xl shadow-2xl py-1 z-50 text-xs backdrop-blur-md">
              <button
                onClick={() => {
                  setBreakpoint('lg');
                  setPreviewWidth(1200);
                  setDropdownOpen(false);
                }}
                className="flex items-center justify-between w-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#27272A] text-left text-zinc-700 hover:text-zinc-900 dark:text-[#E1E1E6] dark:hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Monitor className="w-3.5 h-3.5 text-zinc-400 dark:text-[#888]" />
                  <span>Desktop</span>
                </div>
                {getBreakpointLabel() === 'Desktop' && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />}
              </button>

              <button
                onClick={() => {
                  setBreakpoint('md');
                  setPreviewWidth(810);
                  setDropdownOpen(false);
                }}
                className="flex items-center justify-between w-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#27272A] text-left text-zinc-700 hover:text-zinc-900 dark:text-[#E1E1E6] dark:hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Tablet className="w-3.5 h-3.5 text-zinc-400 dark:text-[#888]" />
                  <span>Tablet</span>
                </div>
                {getBreakpointLabel() === 'Tablet' && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />}
              </button>

              <button
                onClick={() => {
                  setBreakpoint('base');
                  setPreviewWidth(390);
                  setDropdownOpen(false);
                }}
                className="flex items-center justify-between w-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#27272A] text-left text-zinc-700 hover:text-zinc-900 dark:text-[#E1E1E6] dark:hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-zinc-400 dark:text-[#888]" />
                  <span>Phone</span>
                </div>
                {getBreakpointLabel() === 'Phone' && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />}
              </button>

              <div className="h-px bg-zinc-200 dark:bg-[#27272A] my-1" />

              <button
                onClick={() => {
                  nextBreakpoint();
                  setDropdownOpen(false);
                }}
                className="flex items-center justify-between w-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#27272A] text-left text-zinc-600 hover:text-zinc-900 dark:text-[#C4C4CC] dark:hover:text-white transition-colors cursor-pointer"
              >
                <span>Next</span>
                <span className="text-[10px] font-mono text-zinc-500 dark:text-[#71717A] bg-zinc-100 dark:bg-[#222226] px-1 py-0.5 rounded">⌘.</span>
              </button>

              <button
                onClick={() => {
                  previousBreakpoint();
                  setDropdownOpen(false);
                }}
                className="flex items-center justify-between w-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#27272A] text-left text-zinc-600 hover:text-zinc-900 dark:text-[#C4C4CC] dark:hover:text-white transition-colors cursor-pointer"
              >
                <span>Previous</span>
                <span className="text-[10px] font-mono text-zinc-500 dark:text-[#71717A] bg-zinc-100 dark:bg-[#222226] px-1 py-0.5 rounded">⌘,</span>
              </button>
            </div>
          )}
        </div>

        {/* Width Numeric Box */}
        <div className="flex items-center bg-zinc-100 dark:bg-[#1C1C20] border border-zinc-200 dark:border-[#2E2E34] rounded-md px-2 py-0.5 text-xs text-zinc-900 dark:text-white focus-within:border-[#0099FF]">
          <input
            type="text"
            value={widthInput}
            onChange={(e) => setWidthInput(e.target.value)}
            onBlur={handleWidthBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleWidthBlur();
            }}
            className="w-11 bg-transparent text-right outline-none text-xs font-mono font-medium text-zinc-900 dark:text-white"
          />
          <span className="text-zinc-400 dark:text-[#71717A] ml-1 text-[11px] font-medium">W</span>
        </div>

        {/* Height Numeric Box */}
        <div className="flex items-center bg-zinc-100 dark:bg-[#1C1C20] border border-zinc-200 dark:border-[#2E2E34] rounded-md px-2 py-0.5 text-xs text-zinc-900 dark:text-white focus-within:border-[#0099FF]">
          <input
            type="text"
            value={heightInput}
            onChange={(e) => setHeightInput(e.target.value)}
            onBlur={handleHeightBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleHeightBlur();
            }}
            className="w-10 bg-transparent text-right outline-none text-xs font-mono font-medium text-zinc-900 dark:text-white"
          />
          <span className="text-zinc-400 dark:text-[#71717A] ml-1 text-[11px] font-medium">H</span>
        </div>
      </div>

      {/* 3. RIGHT CONTROLS: User Avatar, Play Icon, Invite, Publish */}
      <div className="flex items-center space-x-2.5">
        {/* User Avatar Circle */}
        <div className="w-6 h-6 rounded-full bg-[#0099FF] flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-1 ring-white/20">
          DC
        </div>

        {/* Mini Live Preview Icon */}
        <button 
          onClick={handleReload}
          className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-[#202024] text-zinc-500 hover:text-zinc-900 dark:text-[#A8A8B3] dark:hover:text-white transition-colors cursor-pointer"
          title="Interactive Preview Active"
        >
          <Play className="w-3.5 h-3.5 fill-current text-zinc-900 dark:text-white" />
        </button>

        {/* Invite Button */}
        <button className="px-2.5 py-1 text-xs font-medium text-zinc-700 hover:text-zinc-900 dark:text-[#C4C4CC] dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-[#1C1C20] dark:hover:bg-[#25252B] border border-zinc-200 dark:border-[#2E2E34] rounded-md transition-colors cursor-pointer">
          Invite
        </button>

        {/* Publish Button */}
        <button 
          onClick={() => saveActiveProject(undefined, { showNotification: true })}
          className="px-3 py-1 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 text-xs font-semibold rounded-md transition-all shadow-sm cursor-pointer"
        >
          Publish
        </button>
      </div>
    </header>
  );
}
