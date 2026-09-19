import React, { useRef, useState, useEffect, memo } from 'react';
import { Project } from '../types/project';
import { CanvasNode, DocumentState, NodeStyleProps } from '../types/builder';
import { defaultStyle } from '../store/builderStore';
import { getStyleFromProps } from '../utils/styleUtils';
import { Play, Sparkles } from 'lucide-react';

interface ProjectCardPreviewProps {
  project: Project;
}

/**
 * Checks if a color string has light luminance to ensure proper contrast
 */
function isLightColor(colorStr?: string): boolean {
  if (!colorStr) return false;
  const c = colorStr.trim().toLowerCase();
  if (['#ffffff', '#fff', 'white', '#faf5f0', '#f3f4f6', '#f9fafb', '#f4f4f5', '#e5e7eb'].includes(c)) return true;
  if (c.startsWith('#') && (c.length === 7 || c.length === 4)) {
    const r = parseInt(c.length === 7 ? c.slice(1, 3) : c[1] + c[1], 16) || 0;
    const g = parseInt(c.length === 7 ? c.slice(3, 5) : c[2] + c[2], 16) || 0;
    const b = parseInt(c.length === 7 ? c.slice(5, 7) : c[3] + c[3], 16) || 0;
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 175;
  }
  return false;
}

/**
 * Recursive mini AST node renderer for canvas card preview
 */
const MiniAstNode = memo(({
  nodeId,
  nodes,
  depth = 0,
}: {
  nodeId: string;
  nodes: Record<string, CanvasNode>;
  depth?: number;
}) => {
  const node = nodes[nodeId];
  if (!node) return null;

  const baseStyle: NodeStyleProps = node.responsiveStyles?.base || defaultStyle;
  const computedStyle = getStyleFromProps(baseStyle);

  const renderContent = () => {
    switch (node.type) {
      case 'Frame':
      case 'Stack':
      case 'Grid':
      case 'Masonry':
        return (
          <>
            {node.childrenIds.map((childId) => (
              <MiniAstNode
                key={childId}
                nodeId={childId}
                nodes={nodes}
                depth={depth + 1}
              />
            ))}
          </>
        );

      case 'Text':
        return (
          <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', display: 'inline-block' }}>
            {node.props?.text || ''}
          </span>
        );

      case 'Button':
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              textAlign: 'center',
              userSelect: 'none',
            }}
          >
            {node.props?.text || 'Button'}
          </div>
        );

      case 'Image':
        return node.props?.src ? (
          <img
            src={node.props.src}
            alt={node.props.alt || ''}
            style={{
              width: '100%',
              height: '100%',
              objectFit: (baseStyle.objectFit as React.CSSProperties['objectFit']) || 'cover',
              borderRadius: 'inherit',
              display: 'block',
            }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center text-[10px] text-gray-500 rounded">
            Image
          </div>
        );

      case 'Video':
        return node.props?.src ? (
          <div
            className="relative w-full h-full overflow-hidden bg-black/60 flex items-center justify-center group"
            style={{ borderRadius: 'inherit' }}
          >
            <video
              src={node.props.src}
              className="w-full h-full"
              style={{ objectFit: (baseStyle.objectFit as React.CSSProperties['objectFit']) || 'cover' }}
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                <Play className="w-3 h-3 fill-white ml-0.5" />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-black/40 flex items-center justify-center text-[10px] text-gray-500 rounded">
            Video
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        ...computedStyle,
        boxSizing: 'border-box',
      }}
    >
      {renderContent()}
    </div>
  );
});

MiniAstNode.displayName = 'MiniAstNode';

/**
 * Live scaled AST Mini Canvas Preview
 */
const LiveAstPreview: React.FC<{
  documentState: DocumentState;
  title: string;
}> = ({ documentState, title }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.35);

  const rootId = documentState.rootNodeId;
  const nodes = documentState.nodes || {};
  const rootNode = nodes[rootId];

  const bgColor = rootNode?.responsiveStyles?.base?.backgroundColor || '#09090B';
  const isLight = isLightColor(bgColor);

  useEffect(() => {
    if (!containerRef.current) return;
    const calculateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        // Standard virtual preview canvas width = 840px
        const newScale = Math.max(0.2, Math.min(0.55, width / 840));
        setScale(newScale);
      }
    };
    calculateScale();
    const observer = new ResizeObserver(calculateScale);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // If there are no nodes or root has 0 children
  const hasChildren = rootNode && rootNode.childrenIds && rootNode.childrenIds.length > 0;

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden flex items-start justify-center select-none"
      style={{
        backgroundColor: isLight ? '#F0EFEA' : '#0B0B0E',
      }}
    >
      {/* Background dot grid pattern for aesthetic framing */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${isLight ? '#000000' : '#FFFFFF'} 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      />

      {/* Live scaled canvas tree */}
      <div
        className="transition-transform duration-150 origin-top shadow-xl"
        style={{
          width: '840px',
          minHeight: '525px',
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          pointerEvents: 'none',
          userSelect: 'none',
          marginTop: '6px',
          borderRadius: '8px',
          overflow: 'hidden',
          border: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {rootId && nodes[rootId] ? (
          <MiniAstNode nodeId={rootId} nodes={nodes} />
        ) : (
          <div
            className="w-full h-full min-h-[525px] flex flex-col items-center justify-center p-8"
            style={{ backgroundColor: bgColor }}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${isLight ? 'bg-black/5 text-gray-800' : 'bg-white/10 text-white'}`}>
              <Sparkles className="w-6 h-6" />
            </div>
            <div className={`text-base font-bold text-center mb-1 ${isLight ? 'text-gray-900' : 'text-white'}`}>
              {title}
            </div>
            <div className={`text-xs ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
              Canvas Ready
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ProjectCardPreview: React.FC<ProjectCardPreviewProps> = ({ project }) => {
  // 1. If explicit thumbnail screenshot or image url exists
  if (project.thumbnail && (project.thumbnail.startsWith('http') || project.thumbnail.startsWith('data:'))) {
    return (
      <div className="w-full h-full relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // 2. Render Live AST Mini-Canvas for any project with documentState
  if (project.documentState?.nodes && project.documentState?.rootNodeId) {
    return <LiveAstPreview documentState={project.documentState} title={project.title} />;
  }

  // 3. Fallback preview
  return (
    <div className="w-full h-full bg-[#121216] flex flex-col items-center justify-center p-4 select-none">
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 mb-2">
        <Sparkles className="w-5 h-5 text-zinc-900 dark:text-white" />
      </div>
      <span className="text-xs font-semibold text-gray-200 truncate max-w-[90%]">
        {project.title}
      </span>
      <span className="text-[10px] text-gray-500 mt-0.5">Website Project</span>
    </div>
  );
};
