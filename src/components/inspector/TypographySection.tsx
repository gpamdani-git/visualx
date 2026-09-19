import React from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { NodeStyleProps } from '../../types/builder';
import { ChevronDown, AlignLeft, AlignCenter, AlignRight, AlignJustify, Type } from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';
import FontSelector from './FontSelector';
import TextStyleSelector from './TextStyleSelector';
import TextStyleEditor from './TextStyleEditor';
import { TextToken } from '../../types/project';
import ColorPopover from './ColorPopover';
import SectionContextMenu from './SectionContextMenu';

interface TypographySectionProps {
  effectiveStyles: NodeStyleProps;
}

export default function TypographySection({ effectiveStyles }: TypographySectionProps) {
  const selectedNodeId = useBuilderStore((state) => state?.selectedNodeId);
  const activeBreakpoint = useBuilderStore((state) => state?.activeBreakpoint ?? 'lg');
  const updateNodeStyle = useBuilderStore((state) => state?.updateNodeStyle);
  
  const projects = useProjectStore((state) => state.projects);
  const activeProjectId = useProjectStore((state) => state.activeProjectId);
  const addTextToken = useProjectStore((state) => state.addTextToken);

  const textTokens = React.useMemo(() => {
    return projects?.find(p => p.id === activeProjectId)?.textTokens || [];
  }, [projects, activeProjectId]);
  
  const [showFontSelector, setShowFontSelector] = React.useState<boolean>(false);
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [showStyleMenu, setShowStyleMenu] = React.useState<{top: number, left: number} | null>(null);
  const [editingStyle, setEditingStyle] = React.useState<TextToken | null>(null);
  
  const handleApplyStyle = (token: TextToken) => {
    if (!selectedNodeId) return;
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      fontFamily: token.fontFamily,
      fontWeight: token.fontWeight,
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
      letterSpacing: token.letterSpacing,
      color: token.color,
      textAlign: token.textAlign,
      textTransform: token.textTransform,
      textDecoration: token.textDecoration,
      textStyleId: token.id
    });
    setShowStyleMenu(null);
  };
  
  const handleCreateNewStyle = () => {
    if (!activeProjectId) return;
    const newStyleData = {
      name: 'New Style',
      fontFamily: effectiveStyles.fontFamily || 'Inter, sans-serif',
      fontWeight: Number(effectiveStyles.fontWeight || 400),
      fontSize: Number(effectiveStyles.fontSize || 16),
      lineHeight: String(effectiveStyles.lineHeight || '1.5'),
      letterSpacing: Number(effectiveStyles.letterSpacing || 0),
      color: effectiveStyles.color || '#FFFFFF',
      textAlign: effectiveStyles.textAlign as any,
      textTransform: effectiveStyles.textTransform as any,
      textDecoration: effectiveStyles.textDecoration as any
    };
    const newId = addTextToken(newStyleData);
    setEditingStyle({ id: newId, ...newStyleData });
  };


  if (!selectedNodeId) return null;

  const fontFamily = effectiveStyles.fontFamily || 'Inter, sans-serif';
  const fontWeight = effectiveStyles.fontWeight || 400;
  const fontSize = effectiveStyles.fontSize || 16;
  const lineHeight = effectiveStyles.lineHeight || '1.5';
  const letterSpacing = effectiveStyles.letterSpacing !== undefined ? effectiveStyles.letterSpacing : 0;
  const color = effectiveStyles.color || '#FFFFFF';
  const textAlign = effectiveStyles.textAlign || 'left';

  const fonts = [
    'Inter, sans-serif',
    'Syne, sans-serif',
    'Plus Jakarta Sans, sans-serif',
    'Instrument Sans, sans-serif',
    'Playfair Display, serif',
    'Outfit, sans-serif',
    'system-ui, sans-serif',
    'monospace'
  ];

  const weights = [
    { label: 'Thin (100)', val: 100 },
    { label: 'Extra Light (200)', val: 200 },
    { label: 'Light (300)', val: 300 },
    { label: 'Regular (400)', val: 400 },
    { label: 'Medium (500)', val: 500 },
    { label: 'Semi Bold (600)', val: 600 },
    { label: 'Bold (700)', val: 700 },
    { label: 'Extra Bold (800)', val: 800 },
    { label: 'Black (900)', val: 900 },
  ];

  return (

    <div className="border-b border-zinc-200 dark:border-[#1E1E1E] py-2.5 px-3 flex flex-col gap-3 relative">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-semibold text-zinc-500 dark:text-white font-bold tracking-wider capitalize">Text</span>
        <SectionContextMenu 
          isLinked={!!effectiveStyles.textStyleId}
          onDetach={() => {
            if (selectedNodeId) updateNodeStyle(selectedNodeId, activeBreakpoint, { textStyleId: undefined });
          }}
          onReset={() => {
            if (selectedNodeId) updateNodeStyle(selectedNodeId, activeBreakpoint, {
              fontFamily: undefined, fontWeight: undefined, fontSize: undefined,
              lineHeight: undefined, letterSpacing: undefined, color: undefined,
              textAlign: undefined, textTransform: undefined, textDecoration: undefined,
              textStyleId: undefined
            });
          }}
        />
      </div>
      
      {/* Styles Dropdown */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-zinc-600 dark:text-[#A0A0A0] w-14">Styles</span>
        <div className="relative flex-1">
          <button 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setShowStyleMenu({ top: rect.bottom + 5, left: rect.left - 200 });
            }}
            className="w-full flex items-center gap-2 bg-zinc-50 dark:bg-[#222] border border-zinc-200 dark:border-[#222] hover:dark:border-[#333] hover:border-[#0099FF] dark:hover:border-[#0099FF] text-zinc-900 dark:text-white text-xs px-2 py-1.5 rounded-md outline-none"
          >
            <div className="w-4 h-4 rounded bg-zinc-200 dark:bg-[#333] flex items-center justify-center shrink-0">
              <Type size={10} className="text-zinc-500 dark:text-[#888]" />
            </div>
            <span className="flex-1 text-left text-zinc-500 dark:text-[#888]">
               {effectiveStyles.textStyleId ? textTokens.find(t => t.id === effectiveStyles.textStyleId)?.name || 'Select...' : 'Select...'}
            </span>
            <ChevronDown size={12} className="text-zinc-400" />
          </button>
          
          {showStyleMenu && (
            <TextStyleSelector 
              tokens={textTokens}
              onSelect={handleApplyStyle}
              onClose={() => setShowStyleMenu(null)}
              onEdit={(token) => {
                setShowStyleMenu(null);
                setEditingStyle(token);
              }}
              onCreateNew={handleCreateNewStyle}
              top={showStyleMenu.top}
              left={showStyleMenu.left}
            />
          )}

          {editingStyle && (
            <TextStyleEditor
              token={editingStyle}
              position={{ top: showStyleMenu?.top || 180, left: showStyleMenu?.left || 270 }}
              onClose={() => setEditingStyle(null)}
            />
          )}
        </div>
      </div>

      {/* Font Family */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-zinc-600 dark:text-[#A0A0A0] w-14">Font</span>
        <div className="relative flex-1">
          <button 
            onClick={() => setShowFontSelector(true)}
            className="w-full text-left bg-zinc-50 dark:bg-[#222] border border-zinc-200 dark:border-[#222] hover:dark:border-[#333] hover:border-[#0099FF] dark:hover:border-[#0099FF] text-zinc-900 dark:text-white text-xs px-2.5 py-1.5 rounded-md outline-none flex items-center justify-between"
          >
            <span className="truncate" style={{ fontFamily }}>{fontFamily.split(',')[0]}</span>
            <ChevronDown size={12} className="text-zinc-400 shrink-0" />
          </button>
          {showFontSelector && (
            <FontSelector 
              value={fontFamily}
              onChange={(val) => updateNodeStyle(selectedNodeId, activeBreakpoint, { fontFamily: val })}
              onClose={() => setShowFontSelector(false)}
              
               // CSS position absolute will handle actual positioning if wrapped, but here we can just use fixed positioned logic from FontSelector or tweak it
            />
          )}
        </div>
      </div>

      {/* Weight & Size */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-zinc-600 dark:text-[#A0A0A0] w-14">Weight</span>
        <div className="relative flex-1">
          <select
            value={fontWeight}
            onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, { fontWeight: Number(e.target.value) })}
            className="w-full appearance-none bg-zinc-50 dark:bg-[#222] border border-zinc-200 dark:border-[#222] hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-1.5 pr-6 rounded-md outline-none cursor-pointer"
          >
            {weights.map((w) => (
              <option key={w.val} value={w.val}>{w.label}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
        </div>
      </div>
      
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-zinc-600 dark:text-[#A0A0A0] w-14">Color</span>
        <div className="relative flex-1">
          <button 
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-full flex items-center gap-2 bg-zinc-50 dark:bg-[#222] border border-zinc-200 dark:border-[#222] hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2 py-1.5 rounded-md"
          >
            <div className="w-4 h-4 rounded shadow-sm border border-black/10 shrink-0" style={{ backgroundColor: color }} />
            <span className="uppercase font-mono flex-1 text-left truncate">{color}</span>
          </button>
          {showColorPicker && (
            <ColorPopover 
              color={color}
              onChange={(c) => updateNodeStyle(selectedNodeId, activeBreakpoint, { color: c })}
              onClose={() => setShowColorPicker(false)}
              singleOnly={true}
              top={200}
            />
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs text-zinc-600 dark:text-[#A0A0A0] w-14 shrink-0">Size</span>
          <input
            type="number"
            value={fontSize}
            onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, { fontSize: Number(e.target.value) })}
            className="w-full bg-zinc-50 dark:bg-[#222] border border-zinc-200 dark:border-[#222] hover:dark:border-[#333] rounded-md px-2 py-1.5 text-zinc-900 dark:text-white text-xs text-right outline-none"
          />
          <span className="text-xs text-zinc-400 shrink-0">px</span>
        </div>
      </div>

      {/* Line Height & Letter Spacing */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs text-zinc-600 dark:text-[#A0A0A0] w-14 shrink-0">Line</span>
          <input
            type="text"
            value={lineHeight}
            onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, { lineHeight: e.target.value })}
            className="w-full bg-zinc-50 dark:bg-[#222] border border-zinc-200 dark:border-[#222] hover:dark:border-[#333] rounded-md px-2 py-1.5 text-zinc-900 dark:text-white text-xs text-right outline-none"
          />
          <span className="text-xs text-zinc-400 shrink-0">em</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs text-zinc-600 dark:text-[#A0A0A0] w-14 shrink-0">Letter</span>
          <input
            type="number"
            step="0.5"
            value={letterSpacing}
            onChange={(e) => updateNodeStyle(selectedNodeId, activeBreakpoint, { letterSpacing: Number(e.target.value) })}
            className="w-full bg-zinc-50 dark:bg-[#222] border border-zinc-200 dark:border-[#222] hover:dark:border-[#333] rounded-md px-2 py-1.5 text-zinc-900 dark:text-white text-xs text-right outline-none"
          />
          <span className="text-xs text-zinc-400 shrink-0">px</span>
        </div>
      </div>

      {/* Text Alignment */}
      <div className="flex items-center justify-between gap-2 mt-1">
        <span className="text-xs text-zinc-600 dark:text-[#A0A0A0] w-14">Align</span>
        <div className="flex-1 flex bg-zinc-100 dark:bg-[#222] p-0.5 rounded-lg border border-zinc-200 dark:border-[#222]">
          {[
            { val: 'left', icon: <AlignLeft size={12} /> },
            { val: 'center', icon: <AlignCenter size={12} /> },
            { val: 'right', icon: <AlignRight size={12} /> },
            { val: 'justify', icon: <AlignJustify size={12} /> },
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => updateNodeStyle(selectedNodeId, activeBreakpoint, { textAlign: item.val as any })}
              className={`flex-1 flex items-center justify-center p-1.5 rounded transition-colors ${
                textAlign === item.val ? 'bg-white dark:bg-[#333] text-zinc-900 dark:text-white shadow-sm rounded-md' : 'text-zinc-500 dark:text-[#777] hover:text-zinc-800 dark:hover:text-[#BBB]'
              }`}
            >
              {item.icon}
            </button>
          ))}
        </div>
      </div>
    </div>

  );
}
