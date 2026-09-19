import React from 'react';
import { CanvasNode, BreakpointKey, NodeStyleProps } from '../types/builder';

export function getNodeEffectiveStyle(node: CanvasNode | undefined | null, breakpoint: BreakpointKey): NodeStyleProps {
  if (!node) return {} as NodeStyleProps;
  const styles = (node.responsiveStyles || { base: {} }) as { base: any; md?: any; lg?: any };
  const base = styles?.base || {};
  const lg = (styles as any).lg || {};
  const md = (styles as any).md || {};

  // Hierarchy: Base -> Desktop (Parent) -> Tablet (Child) -> Phone (Grandchild)
  if (breakpoint === 'lg') {
    return { ...base, ...lg } as NodeStyleProps;
  }
  if (breakpoint === 'md') {
    return { ...base, ...lg, ...md } as NodeStyleProps;
  }
  // Phone ('base')
  return { ...base, ...lg, ...md, ...(styles.base || {}) } as NodeStyleProps;
}

export function getStyleFromProps(props: NodeStyleProps): React.CSSProperties {
  const getSizing = (type?: string, val?: string | number) => {
    if (type === 'fill') return '100%';
    if (type === 'fit-content') return 'fit-content';
    if (type === '1fr') return '1fr';
    if (type === 'relative') return typeof val === 'number' ? `${val}%` : val || '100%';
    return typeof val === 'number' ? `${val}px` : (val || 'auto');
  };

  // Build Shadows string
  let boxShadow: string | undefined = undefined;
  if (props.shadows && props.shadows.length > 0) {
    boxShadow = props.shadows.map(s => `${s.x}px ${s.y}px ${s.blur}px ${s.spread || 0}px ${s.color}`).join(', ');
  }

  // Build Transforms string
  let transform: string | undefined = undefined;
  let transformStyle: 'preserve-3d' | 'flat' | undefined = undefined;
  let backfaceVisibility: 'visible' | 'hidden' | undefined = undefined;

  if (props.transforms) {
    const t = props.transforms;
    const parts: string[] = [];
    if (t.perspective) parts.push(`perspective(${t.perspective}px)`);
    if (t.scale !== undefined && t.scale !== 1) parts.push(`scale(${t.scale})`);
    if (t.is3d && t.rotate3d) {
      if (t.rotate3d.x) parts.push(`rotateX(${t.rotate3d.x}deg)`);
      if (t.rotate3d.y) parts.push(`rotateY(${t.rotate3d.y}deg)`);
      if (t.rotate3d.z) parts.push(`rotateZ(${t.rotate3d.z}deg)`);
    } else if (t.rotate2d) {
      parts.push(`rotate(${t.rotate2d}deg)`);
    }
    if (t.skew) {
      if (t.skew.x) parts.push(`skewX(${t.skew.x}deg)`);
      if (t.skew.y) parts.push(`skewY(${t.skew.y}deg)`);
    }
    if (t.depth) parts.push(`translateZ(${t.depth}px)`);
    if (parts.length > 0) transform = parts.join(' ');
    if (t.preserve3d) transformStyle = 'preserve-3d';
    if (t.backface) backfaceVisibility = t.backface;
  }

  // Pinning Compass calculation for absolute positions
  let topVal = props.top;
  let leftVal = props.left;
  let rightVal = props.right;
  let bottomVal = props.bottom;

  if (props.position === 'absolute' && props.pinning) {
    const pin = props.pinning;
    if (pin.pinned.t && pin.top !== undefined) topVal = `${pin.top}px`;
    if (pin.pinned.l && pin.left !== undefined) leftVal = `${pin.left}px`;
    if (pin.pinned.r && pin.right !== undefined) rightVal = `${pin.right}px`;
    if (pin.pinned.b && pin.bottom !== undefined) bottomVal = `${pin.bottom}px`;
  } else if (props.position === 'sticky' && props.stickyTop !== undefined) {
    topVal = `${props.stickyTop}px`;
  }

  // Overflow conversion
  let overflowStyle: React.CSSProperties['overflow'] = undefined;
  if (props.overflow === 'clip') overflowStyle = 'hidden';
  else if (props.overflow) overflowStyle = props.overflow as React.CSSProperties['overflow'];

  const styleObj: React.CSSProperties = {
    width: getSizing(props.widthType, props.widthValue),
    height: getSizing(props.heightType, props.heightValue),
    minWidth: props.minWidth ? getSizing(props.minWidthType || 'fixed', props.minWidth) : undefined,
    maxWidth: props.maxWidth ? getSizing(props.maxWidthType || 'fixed', props.maxWidth) : undefined,
    minHeight: props.minHeight ? getSizing(props.minHeightType || 'fixed', props.minHeight) : undefined,
    maxHeight: props.maxHeight ? getSizing(props.maxHeightType || 'fixed', props.maxHeight) : undefined,
    
    display: props.display || undefined, // changed from 'flex' default
    flexDirection: props.layoutDirection,
    justifyContent: props.justifyContent,
    alignItems: props.alignItems,
    columnGap: props.gapX !== undefined ? `${props.gapX}px` : (props.gap !== undefined ? `${props.gap}px` : undefined),
    rowGap: props.gapY !== undefined ? `${props.gapY}px` : (props.gap !== undefined ? `${props.gap}px` : undefined),
    
    paddingTop: props.padding?.top !== undefined ? `${props.padding.top}px` : undefined,
    paddingRight: props.padding?.right !== undefined ? `${props.padding.right}px` : undefined,
    paddingBottom: props.padding?.bottom !== undefined ? `${props.padding.bottom}px` : undefined,
    paddingLeft: props.padding?.left !== undefined ? `${props.padding.left}px` : undefined,

    
    backgroundColor: (props.backgroundColor && !props.backgroundColor.includes('gradient') && !props.backgroundColor.includes('url('))
      ? props.backgroundColor
      : (props.fillConfig?.type === 'image' ? 'transparent' : undefined),
    backgroundImage: props.fillConfig?.type === 'image' && props.fillConfig.imageSrc
      ? `url('${props.fillConfig.imageSrc}')`
      : (props.backgroundColor?.includes('gradient') || props.backgroundColor?.includes('url('))
        ? props.backgroundColor
        : undefined,
    backgroundSize: props.fillConfig?.type === 'image' && props.fillConfig.imageSrc
      ? (props.fillConfig.imageType === 'fit' ? 'contain' : 
         props.fillConfig.imageType === 'stretch' ? '100% 100%' : 
         props.fillConfig.imageType === 'tile' ? `${(props.fillConfig.imageTileScale || 1) * 100}%` : 'cover')
      : undefined,
    backgroundRepeat: props.fillConfig?.type === 'image' && props.fillConfig.imageSrc
      ? (props.fillConfig.imageType === 'tile' ? 'repeat' : 'no-repeat')
      : undefined,
    backgroundPosition: props.fillConfig?.type === 'image' && props.fillConfig.imageSrc
      ? (props.fillConfig.imagePosition ? props.fillConfig.imagePosition.replace('top center', 'top').replace('bottom center', 'bottom') : 'center')
      : undefined,
      
    borderTopLeftRadius: `${props.borderRadius?.tl || 0}px`,
    borderTopRightRadius: `${props.borderRadius?.tr || 0}px`,
    borderBottomRightRadius: `${props.borderRadius?.br || 0}px`,
    borderBottomLeftRadius: `${props.borderRadius?.bl || 0}px`,
    
    borderColor: props.border?.color || props.borderColor,
    borderWidth: props.border?.width !== undefined ? `${props.border.width}px` : (props.borderWidth ? `${props.borderWidth}px` : 0),
    borderStyle: props.border?.style || props.borderStyle || (props.borderWidth ? 'solid' : 'none'),
    
    boxShadow,
    overflow: overflowStyle,
    opacity: props.opacity,
    visibility: props.visible !== false ? 'visible' : 'hidden',
    zIndex: props.zIndex,
    cursor: props.cursor || (props.link?.url ? 'pointer' : undefined),

    position: props.position,
    top: topVal,
    left: leftVal,
    right: rightVal,
    bottom: bottomVal,

    transform,
    transformStyle,
    backfaceVisibility,
    
    fontFamily: props.fontFamily,
    fontSize: props.fontSize ? `${props.fontSize}px` : undefined,
    fontWeight: props.fontWeight,
    lineHeight: props.lineHeight,
    color: props.color,
    textAlign: props.textAlign,
    letterSpacing: props.letterSpacing ? `${props.letterSpacing}px` : undefined,
    textTransform: props.textTransform,
    textDecoration: props.textDecoration,
    flexWrap: props.flexWrap,
    boxSizing: 'border-box',
    objectFit: props.objectFit as React.CSSProperties['objectFit'],
    aspectRatio: props.aspectRatio,
  };

  // Grid specific styling
  if (props.layoutType === 'Grid' || props.display === 'grid' || props.gridColumns) {
    styleObj.display = 'grid';
    const cols = props.gridColumns || 2;
    styleObj.gridTemplateColumns = typeof cols === 'number' ? `repeat(${cols}, minmax(0, 1fr))` : String(cols);
    if (props.gridRows) {
      styleObj.gridTemplateRows = typeof props.gridRows === 'number' ? `repeat(${props.gridRows}, minmax(0, 1fr))` : String(props.gridRows);
    }
  }

  // Masonry specific styling (CSS Column Layout)
  if (props.masonryColumns || props.gridMasonry) {
    styleObj.display = 'block';
    styleObj.columnCount = props.masonryColumns || (typeof props.gridColumns === 'number' ? props.gridColumns : 3);
    styleObj.columnGap = props.gapX !== undefined ? `${props.gapX}px` : (props.gap !== undefined ? `${props.gap}px` : '16px');
  }

  return styleObj;
}
