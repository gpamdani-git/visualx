import React, { useState, useRef, useEffect, memo } from 'react';
import { 
  Maximize2, 
  RotateCw, 
  QrCode, 
  Share2, 
  Check, 
  Copy, 
  ExternalLink,
  Sliders,
  Smartphone,
  Tablet,
  Monitor,
  Eye,
  EyeOff
} from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import { useProjectStore } from '../store/projectStore';
import { BreakpointKey } from '../types/builder';
import { getNodeEffectiveStyle, getStyleFromProps } from '../utils/styleUtils';
import { componentRegistry } from '../registry/ComponentRegistry';
import * as LucideIcons from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

// Web-Native Interactive Node Renderer for Preview Mode
const PreviewInteractiveNode = memo(({ id, breakpoint, isRoot = false }: { id: string; breakpoint: BreakpointKey; isRoot?: boolean }) => {
  const node = useBuilderStore((state) => state?.nodes?.[id]);
  const [btnActive, setBtnActive] = useState(false);

  if (!node) return null;

  const effectiveStyles = getNodeEffectiveStyle(node, breakpoint);
  const reactStyles = getStyleFromProps(effectiveStyles);

  // If this is the root document node, ensure it spans full width & natural height without clipping
  if (isRoot) {
    reactStyles.minHeight = '100%';
    reactStyles.width = '100%';
    if (reactStyles.height === '100%') {
      delete reactStyles.height;
    }
  }

  const [isHovered, setIsHovered] = useState(false);
  const hasHoverStyles = effectiveStyles.hover && Object.keys(effectiveStyles.hover).length > 0;
  const hoverStyles = {
    ...getStyleFromProps(effectiveStyles.hover || {}),
    opacity: (effectiveStyles.hover?.opacity ?? 100) / 100,
  };

  const finalReactStyles = {
    ...reactStyles,
    ...(isHovered && hasHoverStyles ? hoverStyles : {}),
  };

  const effects = effectiveStyles.effects;
  let motionProps: any = {};
  if (effects) {
    if (effects.appear?.enabled) {
      const enter = effects.appear.enter;
      motionProps.initial = { 
        opacity: enter.opacity ?? 0, 
        scale: enter.scale ?? 1,
        y: enter.offset?.y ?? 0,
        x: enter.offset?.x ?? 0,
        rotateX: enter.rotate?.is3d ? enter.rotate.x : enter.rotate?.val ?? 0,
        rotateY: enter.rotate?.is3d ? enter.rotate.y : 0,
        rotateZ: enter.rotate?.is3d ? enter.rotate.z : enter.rotate?.val ?? 0,
        skewX: enter.skew?.x ?? 0,
        skewY: enter.skew?.y ?? 0
      };
      
      motionProps.animate = { opacity: 1, scale: 1, y: 0, x: 0, rotateX: 0, rotateY: 0, rotateZ: 0, skewX: 0, skewY: 0 };
      
      if (enter.transition?.type === 'spring') {
        motionProps.transition = {
          type: 'spring',
          duration: enter.transition.spring.time ?? 0.8,
          bounce: enter.transition.spring.bounce ?? 0.2,
          delay: enter.transition.spring.delay ?? 0
        };
      } else if (enter.transition?.type === 'ease') {
        let ease = "easeInOut";
        if (enter.transition.ease.easeType === "Ease In") ease = "easeIn";
        if (enter.transition.ease.easeType === "Ease Out") ease = "easeOut";
        if (enter.transition.ease.easeType === "Linear") ease = "linear";
        
        motionProps.transition = {
          type: 'tween',
          ease,
          duration: enter.transition.ease.time ?? 0.6,
          delay: enter.transition.ease.delay ?? 0
        };
      }
    }

    if (effects.hover?.enabled) {
      motionProps.whileHover = {
        scale: effects.hover.scale ?? 1.05,
        opacity: effects.hover.opacity ?? 1,
        y: effects.hover.y ?? -4
      };
    }

    if (effects.press?.enabled) {
      motionProps.whileTap = {
        scale: effects.press.scale ?? 0.95
      };
    }

    if (effects.loop?.enabled) {
      motionProps.animate = { ...motionProps.animate, scale: [1, 1.05, 1] };
      motionProps.transition = { ...motionProps.transition, repeat: Infinity, duration: effects.loop.duration ?? 2 };
    }
  }

  const reviveProps = (p: any): any => {
    if (Array.isArray(p)) return p.map(reviveProps);
    if (p && typeof p === 'object') {
      if (p._type === 'LucideIcon') {
        const IconComp = (LucideIcons as any)[p.name];
        return IconComp ? <IconComp size={p.size || 24} /> : null;
      }
      const revived: any = {};
      for (const key in p) revived[key] = reviveProps(p[key]);
      return revived;
    }
    return p;
  };

  const renderContent = () => {
    // Registry Components Rendering (e.g. Native_Navbar)
    const CompDef = componentRegistry[node.type];
    if (CompDef) {
      return CompDef.render(
        reviveProps(node.props || CompDef.defaultProps),
        node.childrenIds && node.childrenIds.length > 0
          ? node.childrenIds.map((childId) => (
              <PreviewInteractiveNode key={childId} id={childId} breakpoint={breakpoint} isRoot={false} />
            ))
          : undefined
      );
    }
    switch (node.type) {
      case 'Frame':
      case 'Stack':
      case 'Grid':
        return (
          <>
            {node.childrenIds.map((childId) => (
              <PreviewInteractiveNode key={childId} id={childId} breakpoint={breakpoint} isRoot={false} />
            ))}
          </>
        );
      case 'Masonry':
        return (
          <>
            {node.childrenIds.map((childId) => (
              <div key={childId} style={{ breakInside: 'avoid', marginBottom: `${effectiveStyles.gap || 16}px` }}>
                <PreviewInteractiveNode id={childId} breakpoint={breakpoint} isRoot={false} />
              </div>
            ))}
          </>
        );
      case 'Text':
        return <span>{node.props.content || node.props.text || 'Custom Text'}</span>;
      case 'Button':
        return (
          <button 
            onMouseDown={() => setBtnActive(true)}
            onMouseUp={() => setBtnActive(false)}
            onMouseLeave={() => setBtnActive(false)}
            className={`w-full h-full border-none bg-transparent cursor-pointer font-inherit flex items-center justify-center text-inherit transition-transform duration-100 ${btnActive ? 'scale-95' : 'hover:scale-[1.02]'}`}
          >
            {node.props.text || 'Action Button'}
          </button>
        );
      case 'Image':
        const imageSource = effectiveStyles.fillConfig?.imageSrc || 
          (effectiveStyles.backgroundColor?.startsWith('url(') 
            ? effectiveStyles.backgroundColor.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '') 
            : null) || 
          node.props.src;
        return imageSource ? (
          <img 
            src={imageSource} 
            alt={node.props.alt || "Preview Image"} 
            className="w-full h-full object-cover select-none"
            style={{ 
              objectFit: effectiveStyles.objectFit || 'cover',
              objectPosition: effectiveStyles.fillConfig?.imagePosition ? effectiveStyles.fillConfig.imagePosition.toLowerCase() : 'center',
              borderRadius: 'inherit'
            }}
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs">
            No Image
          </div>
        );

      case 'Video':
        return node.props.src ? (
          <div className="relative w-full h-full overflow-hidden" style={{ borderRadius: 'inherit' }}>
            <video 
              src={node.props.src} 
              className="w-full h-full"
              style={{ objectFit: effectiveStyles.objectFit || 'cover' }}
              autoPlay={node.props.autoPlay ?? true} 
              loop={node.props.loop ?? true} 
              muted={node.props.muted ?? true}
              playsInline
            />
          </div>
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs">
            No Video
          </div>
        );
      default:
        return null;
    }
  };

  // If node has link, wrap in an anchor tag
  if (effectiveStyles.link && effectiveStyles.link.url) {
    return (
      <motion.a 
        href={effectiveStyles.link.url}
        target={effectiveStyles.link.target || '_blank'}
        rel={effectiveStyles.link.rel?.join(' ') || 'noopener noreferrer'}
        style={{ ...finalReactStyles, textDecoration: 'none', color: 'inherit' }}
        className={clsx("transition-all duration-150 ease-out inline-block cursor-pointer", isRoot && "box-border", node.props.className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...motionProps}
      >
        {renderContent()}
      </motion.a>
    );
  }

  return (
    <motion.div 
      style={finalReactStyles} 
      className={clsx("transition-all duration-150 ease-out", isRoot && "box-border", node.props.className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...motionProps}
    >
      {renderContent()}
    </motion.div>
  );
});

export default function PreviewArea() {
  const rootNodeId = useBuilderStore((state) => state?.rootNodeId);
  const activeBreakpoint = useBuilderStore((state) => state?.activeBreakpoint ?? 'lg');
  const previewWidth = useBuilderStore((state) => state?.previewWidth ?? 1200);
  const previewHeight = useBuilderStore((state) => state?.previewHeight ?? 735);
  const setPreviewWidth = useBuilderStore((state) => state?.setPreviewWidth);
  const setPreviewHeight = useBuilderStore((state) => state?.setPreviewHeight);
  const previewFullscreen = useBuilderStore((state) => state?.previewFullscreen ?? false);
  const previewShowUI = useBuilderStore((state) => state?.previewShowUI ?? true);
  const setPreviewShowUI = useBuilderStore((state) => state?.setPreviewShowUI);
  const setPreviewFullscreen = useBuilderStore((state) => state?.setPreviewFullscreen);
  const previewRefreshKey = useBuilderStore((state) => state?.previewRefreshKey ?? 0);
  const canvasTheme = useBuilderStore((state) => state?.canvasTheme ?? 'dark');

  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [resizingDimensions, setResizingDimensions] = useState<{ w: number; h: number }>({ w: previewWidth, h: previewHeight });
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync resizing dimensions with store
  useEffect(() => {
    setResizingDimensions({ w: previewWidth, h: previewHeight });
  }, [previewWidth, previewHeight]);

  // Determine current effective breakpoint dynamically from width
  const getEffectiveBreakpoint = (width: number): BreakpointKey => {
    if (width >= 1200) return 'lg';
    if (width >= 810) return 'md';
    return 'base';
  };

  const currentBreakpoint = getEffectiveBreakpoint(previewWidth);

  // Drag-to-resize handles logic (Left, Right, Bottom)
  const handleResizeStart = (e: React.MouseEvent, handle: 'left' | 'right' | 'bottom') => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(handle);
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = previewWidth;
    const startHeight = previewHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (handle === 'right') {
        const deltaX = moveEvent.clientX - startX;
        const newWidth = Math.max(320, Math.min(2560, Math.round(startWidth + deltaX * 2)));
        setPreviewWidth(newWidth);
        setResizingDimensions(prev => ({ ...prev, w: newWidth }));
      } else if (handle === 'left') {
        const deltaX = moveEvent.clientX - startX;
        const newWidth = Math.max(320, Math.min(2560, Math.round(startWidth - deltaX * 2)));
        setPreviewWidth(newWidth);
        setResizingDimensions(prev => ({ ...prev, w: newWidth }));
      } else if (handle === 'bottom') {
        const deltaY = moveEvent.clientY - startY;
        const newHeight = Math.max(300, Math.min(2000, Math.round(startHeight + deltaY)));
        setPreviewHeight(newHeight);
        setResizingDimensions(prev => ({ ...prev, h: newHeight }));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div 
      ref={containerRef}
      className={clsx(
        "flex-1 w-full h-full relative flex flex-col items-center justify-start overflow-y-auto overflow-x-auto select-none custom-scrollbar overscroll-none transition-colors",
        !previewFullscreen && "py-8 px-6",
        canvasTheme === 'dark' ? 'dark bg-[#0A0A0C]' : 'bg-zinc-100'
      )}
    >
      {/* FULLSCREEN 'SHOW UI' TOGGLE BUTTON */}
      {previewFullscreen && !previewShowUI && (
        <button
          onClick={() => setPreviewShowUI(true)}
          className="fixed top-4 left-4 z-50 px-3 py-1.5 bg-white/95 dark:bg-[#18181B]/95 hover:bg-zinc-100 dark:hover:bg-[#27272A] border border-zinc-200 dark:border-[#2E2E34] text-zinc-900 dark:text-white text-xs font-semibold rounded-lg shadow-2xl backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
        >
          <Eye className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
          <span>Show UI</span>
        </button>
      )}

      {/* FLOATING ACTION PILLS: QR Code & Mobile Testing */}
      {!previewFullscreen && (
        <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
          <button
            onClick={() => setQrModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white/90 dark:bg-[#18181B]/90 hover:bg-zinc-100 dark:hover:bg-[#25252B] border border-zinc-200 dark:border-[#2E2E34] text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white text-xs rounded-md shadow-md backdrop-blur-sm transition-colors cursor-pointer"
            title="Scan QR to Preview on Mobile"
          >
            <QrCode className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
            <span className="hidden sm:inline">Mobile QR</span>
          </button>
        </div>
      )}

      {/* QR PREVIEW MODAL */}
      {qrModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-[#2E2E34] rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-[#0099FF]/10 text-zinc-900 dark:text-white flex items-center justify-center mb-3">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-zinc-900 dark:text-white font-semibold text-base mb-1">Preview on Mobile</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-4">
              Scan this QR code with your mobile camera or copy the live preview URL.
            </p>

            {/* Generated QR Code Box */}
            <div className="bg-white p-4 rounded-xl shadow-inner border border-zinc-200 dark:border-transparent mb-4 flex items-center justify-center">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href)}`} 
                alt="QR Code" 
                className="w-36 h-36"
              />
            </div>

            <div className="flex gap-2 w-full">
              <button
                onClick={handleCopyShareLink}
                className="flex-1 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-[#27272A] dark:hover:bg-[#333338] text-zinc-800 dark:text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
              <button
                onClick={() => setQrModalOpen(false)}
                className="py-2 px-4 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN PREVIEW VIEWPORT CONTAINER (Ensuring no top cutoff) */}
      <div 
        className={clsx(
          "relative transition-all duration-100 ease-out flex flex-col shrink-0 mb-8",
          previewFullscreen ? "w-full h-full p-0 !max-w-none !max-h-none !mb-0" : ""
        )}
        style={previewFullscreen ? { width: '100vw', height: '100vh' } : {
          width: `${previewWidth}px`,
          minHeight: `${previewHeight}px`,
          maxWidth: '100%',
        }}
      >
        {/* RESIZE HANDLE: LEFT */}
        {!previewFullscreen && (
          <div 
            onMouseDown={(e) => handleResizeStart(e, 'left')}
            className={clsx(
              "absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-24 cursor-ew-resize flex items-center justify-center z-40 group",
              isResizing === 'left' ? "opacity-100" : "opacity-60 hover:opacity-100"
            )}
            title="Drag to resize width"
          >
            <div className="w-1.5 h-16 rounded-full bg-zinc-400 dark:bg-zinc-600 group-hover:bg-[#0099FF] shadow-md transition-colors" />
          </div>
        )}

        {/* RESIZE HANDLE: RIGHT */}
        {!previewFullscreen && (
          <div 
            onMouseDown={(e) => handleResizeStart(e, 'right')}
            className={clsx(
              "absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-24 cursor-ew-resize flex items-center justify-center z-40 group",
              isResizing === 'right' ? "opacity-100" : "opacity-60 hover:opacity-100"
            )}
            title="Drag to resize width"
          >
            <div className="w-1.5 h-16 rounded-full bg-zinc-400 dark:bg-zinc-600 group-hover:bg-[#0099FF] shadow-md transition-colors" />
          </div>
        )}

        {/* RESIZE HANDLE: BOTTOM */}
        {!previewFullscreen && (
          <div 
            onMouseDown={(e) => handleResizeStart(e, 'bottom')}
            className={clsx(
              "absolute -bottom-4 left-1/2 -translate-x-1/2 h-4 w-24 cursor-ns-resize flex items-center justify-center z-40 group",
              isResizing === 'bottom' ? "opacity-100" : "opacity-60 hover:opacity-100"
            )}
            title="Drag to resize height"
          >
            <div className="h-1.5 w-16 rounded-full bg-zinc-400 dark:bg-zinc-600 group-hover:bg-[#0099FF] shadow-md transition-colors" />
          </div>
        )}

        {/* REAL-TIME DIMENSION BADGE WHILE DRAGGING */}
        {isResizing && (
          <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#0099FF] text-white text-xs font-mono font-bold px-2.5 py-1 rounded-md shadow-2xl z-50 flex items-center gap-1.5 animate-in fade-in zoom-in duration-100">
            <span>{resizingDimensions.w}</span>
            <span className="opacity-70">×</span>
            <span>{resizingDimensions.h}</span>
          </div>
        )}

        {/* THE NATIVE LIVE WEB FRAME SURFACE */}
        <div 
          key={previewRefreshKey}
          className={clsx(
            "w-full h-full flex flex-col overflow-y-auto overflow-x-hidden select-text relative custom-scrollbar",
            canvasTheme === 'dark' ? "bg-[#0A0A0A] text-white" : "bg-white text-zinc-900",
            previewFullscreen 
              ? "rounded-none shadow-none" 
              : "rounded-xl border border-zinc-300 dark:border-[#242428] shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
          )}
        >
          <PreviewInteractiveNode id={rootNodeId} breakpoint={currentBreakpoint} isRoot={true} />
        </div>
      </div>
    </div>
  );
}
