// Sizing & Responsive Types
export type SizingMode = 'auto' | 'fixed' | 'fill' | 'fit-content' | '1fr' | 'relative';
export type BreakpointKey = 'base' | 'md' | 'lg'; // Mobile, Tablet, Desktop

export interface TransitionSpring {
  basedOn: 'Time' | 'Physics';
  time: number;
  bounce: number;
  delay: number;
}

export interface TransitionEase {
  easeType: 'Ease In Out' | 'Ease In' | 'Ease Out' | 'Linear';
  bezier: string;
  time: number;
  delay: number;
}

export interface AppearEffectConfig {
  enabled: boolean;
  trigger: 'On Appear' | 'On Scroll';
  preset: 'Fade In' | 'Scale In' | 'Slide In' | 'Custom';
  enter: {
    opacity: number;
    scale: number;
    rotate: { is3d: boolean; val: number; x: number; y: number; z: number };
    skew: { x: number; y: number };
    offset: { x: number; y: number };
    transition: {
      type: 'spring' | 'ease';
      spring: TransitionSpring;
      ease: TransitionEase;
    };
  };
}

export interface EffectsConfig {
  appear?: AppearEffectConfig;
  hover?: { enabled: boolean; scale?: number; opacity?: number; y?: number };
  press?: { enabled: boolean; scale?: number; opacity?: number };
  loop?: { enabled: boolean; type?: 'pulse' | 'spin' | 'float'; duration?: number };
}

export interface ShadowItem {
  id: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
}

export interface TransformsConfig {
  scale?: number;
  rotate2d?: number;
  is3d?: boolean;
  rotate3d?: { x: number; y: number; z: number };
  skew?: { x: number; y: number };
  depth?: number;
  perspective?: number;
  backface?: 'visible' | 'hidden';
  preserve3d?: boolean;
  origin?: string;
  activeProps?: string[]; // e.g. ['Scale', 'Rotate', 'Skew', 'Depth', 'Perspective', 'Backface', 'Preserve 3D']
}

export interface OverlayConfig {
  position: 'Center' | 'Top' | 'Bottom' | 'Left' | 'Right';
  align: 'left' | 'center' | 'right';
  offset: { x: number; y: number };
  dismiss: 'Auto' | 'Click';
  collision: 'Auto' | number;
}

export interface ScrollSectionConfig {
  name: string; // # name
  offsetY: number;
}

export interface AccessibilityConfig {
  tag: string; // 'div' | 'section' | 'nav' | 'header' | 'footer' | 'main' | 'article' | 'button' | 'a';
  ariaLabel?: string;
  tabIndex?: number;
  googleBot?: 'Index' | 'No Index' | 'Skip';
}

export interface LinkConfig {
  url: string;
  target?: '_blank' | '_self';
  rel?: string[];
  params?: string;
  tracking?: string;
}

export interface PinningCompass {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  pinned: { t?: boolean; l?: boolean; r?: boolean; b?: boolean };
}

// Flat Dictionary Node Style Properties
export interface NodeStyleProps {
  widthType: SizingMode;
  widthValue: number | string;
  heightType: SizingMode;
  heightValue: number | string;
  
  // Min / Max Constraints
  minWidth?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  minWidthType?: SizingMode;
  maxWidthType?: SizingMode;
  minHeightType?: SizingMode;
  maxHeightType?: SizingMode;
  
  // Layout (Stack / Grid / Masonry)
  layoutType?: 'Stack' | 'Grid';
  layoutDirection: 'row' | 'column';
  justifyContent: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  alignSelf?: 'auto' | 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  flexWrap?: 'nowrap' | 'wrap';
  gap: number;
  gapX?: number;
  gapY?: number;
  
  // Padding & Radius (supporting uniform and split per-side)
  padding: { top: number; right: number; bottom: number; left: number; isSplit?: boolean };
  borderRadius: { tl: number; tr: number; br: number; bl: number; isSplit?: boolean };
  
  // Fill & Appearance
  backgroundColor: string;
  fillConfig?: { 
    type: 'solid' | 'linear' | 'radial' | 'conic' | 'image'; 
    color?: string;
  textStyleId?: string; 
    stops?: {color: string; position: number}[]; 
    handles?: {x: number; y: number}[]; 
    imageSrc?: string;
    imageType?: 'fill' | 'fit' | 'stretch' | 'tile';
    imagePosition?: string;
    imageResolution?: string;
    imageTilePreset?: string;
    imageTileScale?: number;
    imageAlt?: string;
  };
  borderColor: string;
  borderWidth: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  border?: { color: string; width: number; style: 'solid' | 'dashed' | 'dotted' } | null;
  shadows?: ShadowItem[];
  overflow?: 'clip' | 'visible' | 'hidden' | 'scroll';
  
  // Typography properties (applicable mainly to Text & Button nodes)
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number | string;
  lineHeight?: number | string;
  color?: string;
  textStyleId?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  letterSpacing?: number | string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration?: 'none' | 'underline' | 'line-through';

  // Visual / Extras
  opacity?: number;
  visible?: boolean;
  zIndex?: number;

  // Positioning
  position?: 'relative' | 'absolute' | 'fixed' | 'sticky';
  pinning?: PinningCompass;
  stickyTop?: number;
  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;
  
  // Layout type
  display?: 'flex' | 'grid' | 'block' | 'inline-block';
  
  // Grid layout properties
  gridColumns?: number | string;
  gridRows?: number | string;
  gridAutoFlow?: 'row' | 'column' | 'dense';
  gridMasonry?: boolean;
  
  // Masonry layout properties
  masonryColumns?: number;
  
  // Media / Sizing props
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  aspectRatio?: string;

  // Advanced Framer properties
  link?: LinkConfig | null;
  effects?: EffectsConfig | null;
  transforms?: TransformsConfig | null;
  overlay?: OverlayConfig | null;
  scrollSection?: ScrollSectionConfig | null;
  accessibility?: AccessibilityConfig | null;
  cursor?: 'default' | 'pointer' | 'text' | 'not-allowed' | 'grab' | 'custom';
}

export type CanvasNodeType = 'Frame' | 'Stack' | 'Grid' | 'Masonry' | 'Text' | 'Button' | 'Image' | 'Video' | (string & {});

export interface CanvasNode {
  id: string;
  type: CanvasNodeType;
  name: string;
  parentId: string | null;     // Parent relation (null for root)
  childrenIds: string[];       // Array of child IDs for rendering order and nesting
  props: Record<string, any>;  // Specific content properties (text content, image src, etc)
  responsiveStyles: {
    base: NodeStyleProps;      // Base styles (mobile-first approach)
    md?: Partial<NodeStyleProps>; // Tablet overrides
    lg?: Partial<NodeStyleProps>; // Desktop overrides
  };
}

export type CanvasTool = 'select' | 'hand' | 'comment';
export type CanvasTheme = 'dark' | 'light';

export interface CanvasComment {
  id: string;
  x: number;
  y: number;
  text: string;
  author: string;
  timestamp: number;
  resolved?: boolean;
  breakpoint?: BreakpointKey;
}

export interface BreakpointConfig {
  id: BreakpointKey;
  name: string;
  width: number;
  rangeLabel: string;
  isPrimary?: boolean;
}

export interface DocumentState {
  rootNodeId: string;
  nodes: Record<string, CanvasNode>; // Flat Dictionary O(1) Access
  selectedNodeId: string | null;
  selectedNodeIds?: string[];
  highlightedNodeIds?: string[];
  activeBreakpoint: BreakpointKey;
  enabledBreakpoints?: BreakpointKey[];
  breakpointWidths?: Record<BreakpointKey, number>;
  isPreviewMode: boolean;
  clipboardNodeId: string | null;
  canvasTool?: CanvasTool;
  canvasTheme?: CanvasTheme;
  editorTheme?: CanvasTheme;
  showGrid?: boolean;
  zoom?: number;
  panOffset?: { x: number; y: number };
  comments?: CanvasComment[];
  previewWidth?: number;
  previewHeight?: number;
  previewFullscreen?: boolean;
  previewShowUI?: boolean;
  previewRefreshKey?: number;
  isAiGenerating?: boolean;
  guides?: { x: number[], y: number[] };
}

export const defaultStyle: NodeStyleProps = {
  widthType: 'fill',
  widthValue: '100%',
  heightType: 'fit-content',
  heightValue: 'auto',
  layoutDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  gap: 0,
  padding: { top: 0, right: 0, bottom: 0, left: 0 },
  backgroundColor: 'transparent',
  borderRadius: { tl: 0, tr: 0, br: 0, bl: 0 },
  borderColor: 'transparent',
  borderWidth: 0,
  visible: true,
  opacity: 1,
  position: 'relative',
};
