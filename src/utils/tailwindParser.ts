import { NodeStyleProps } from '../types/builder';

export function parseTailwindToStyles(className: string): Partial<NodeStyleProps> {
  const styles: Partial<NodeStyleProps> = {};
  if (!className) return styles;

  const classes = className.split(/\s+/).filter(Boolean);
  
  // Base spacing scale (Tailwind 1 = 4px)
  const parseSpacing = (val: string) => {
    if (val === 'px') return 1;
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num * 4;
  };

  let padding = { top: 0, right: 0, bottom: 0, left: 0, isSplit: false };
  let hasPadding = false;

  classes.forEach(cls => {
    // Flex/Grid
    if (cls === 'flex') styles.display = 'flex';
    if (cls === 'grid') styles.display = 'grid';
    if (cls === 'flex-col') styles.layoutDirection = 'column';
    if (cls === 'flex-row') styles.layoutDirection = 'row';
    if (cls === 'flex-wrap') styles.flexWrap = 'wrap';
    
    // Alignment
    if (cls.startsWith('items-')) {
      const align = cls.replace('items-', '');
      styles.alignItems = align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : align as any;
    }
    if (cls.startsWith('justify-')) {
      const justify = cls.replace('justify-', '');
      styles.justifyContent = justify === 'start' ? 'flex-start' : justify === 'end' ? 'flex-end' : justify as any;
    }

    // Gap
    if (cls.startsWith('gap-')) {
      const parts = cls.split('-');
      if (parts.length === 2) styles.gap = parseSpacing(parts[1]);
      if (parts.length === 3 && parts[1] === 'x') styles.gapX = parseSpacing(parts[2]);
      if (parts.length === 3 && parts[1] === 'y') styles.gapY = parseSpacing(parts[2]);
    }

    // Sizing
    if (cls === 'w-full') { styles.widthType = 'fill'; styles.widthValue = '100%'; }
    if (cls === 'w-fit') { styles.widthType = 'fit-content'; styles.widthValue = 'fit-content'; }
    if (cls === 'h-full') { styles.heightType = 'fill'; styles.heightValue = '100%'; }
    if (cls === 'h-fit') { styles.heightType = 'fit-content'; styles.heightValue = 'fit-content'; }

    // Padding
    if (cls.startsWith('p-')) {
      const val = parseSpacing(cls.replace('p-', ''));
      padding = { top: val, right: val, bottom: val, left: val, isSplit: false };
      hasPadding = true;
    }
    if (cls.startsWith('px-')) {
      const val = parseSpacing(cls.replace('px-', ''));
      padding.left = val; padding.right = val; padding.isSplit = true; hasPadding = true;
    }
    if (cls.startsWith('py-')) {
      const val = parseSpacing(cls.replace('py-', ''));
      padding.top = val; padding.bottom = val; padding.isSplit = true; hasPadding = true;
    }
    if (cls.startsWith('pt-')) { padding.top = parseSpacing(cls.replace('pt-', '')); padding.isSplit = true; hasPadding = true; }
    if (cls.startsWith('pr-')) { padding.right = parseSpacing(cls.replace('pr-', '')); padding.isSplit = true; hasPadding = true; }
    if (cls.startsWith('pb-')) { padding.bottom = parseSpacing(cls.replace('pb-', '')); padding.isSplit = true; hasPadding = true; }
    if (cls.startsWith('pl-')) { padding.left = parseSpacing(cls.replace('pl-', '')); padding.isSplit = true; hasPadding = true; }
  });

  if (hasPadding) {
    styles.padding = padding;
  }

  return styles;
}

export function syncStylesToTailwind(className: string | undefined, styles: Partial<NodeStyleProps>): string {
  let classes = (className || '').split(/\s+/).filter(Boolean);
  
  const removePrefix = (prefix: string | RegExp) => {
    classes = classes.filter(c => typeof prefix === 'string' ? !c.startsWith(prefix) : !prefix.test(c));
  };

  // Layout Direction
  if (styles.display === 'flex' || styles.display === 'grid') {
    removePrefix(/^(flex|grid|hidden|block)$/);
    classes.push(styles.display);
  }
  
  if (styles.layoutDirection) {
    removePrefix('flex-row'); removePrefix('flex-col');
    classes.push(styles.layoutDirection === 'column' ? 'flex-col' : 'flex-row');
  }

  if (styles.flexWrap === 'wrap') {
    if (!classes.includes('flex-wrap')) classes.push('flex-wrap');
  } else if (styles.flexWrap === 'nowrap') {
    removePrefix('flex-wrap');
  }

  // Alignment
  if (styles.alignItems) {
    removePrefix('items-');
    let align = styles.alignItems.replace('flex-', '');
    classes.push(`items-${align}`);
  }
  if (styles.justifyContent) {
    removePrefix('justify-');
    let justify = styles.justifyContent.replace('flex-', '');
    if (justify === 'space-between') justify = 'between';
    if (justify === 'space-around') justify = 'around';
    if (justify === 'space-evenly') justify = 'evenly';
    classes.push(`justify-${justify}`);
  }

  // Gap
  const formatSpacing = (px: number) => {
    if (px === 1) return 'px';
    return String(px / 4);
  };
  
  if (styles.gap !== undefined) {
    removePrefix(/^gap-\d+/);
    classes.push(`gap-${formatSpacing(styles.gap)}`);
  }
  
  // Padding
  if (styles.padding) {
    removePrefix(/^p[trblxy]?-\d+/);
    const p = styles.padding;
    if (!p.isSplit && p.top === p.bottom && p.top === p.left && p.top === p.right) {
      if (p.top > 0) classes.push(`p-${formatSpacing(p.top)}`);
    } else {
      if (p.top === p.bottom && p.top > 0) classes.push(`py-${formatSpacing(p.top)}`);
      else {
        if (p.top > 0) classes.push(`pt-${formatSpacing(p.top)}`);
        if (p.bottom > 0) classes.push(`pb-${formatSpacing(p.bottom)}`);
      }
      
      if (p.left === p.right && p.left > 0) classes.push(`px-${formatSpacing(p.left)}`);
      else {
        if (p.left > 0) classes.push(`pl-${formatSpacing(p.left)}`);
        if (p.right > 0) classes.push(`pr-${formatSpacing(p.right)}`);
      }
    }
  }

  // Sizing
  if (styles.widthType) {
    removePrefix(/^w-/);
    if (styles.widthType === 'fill') classes.push('w-full');
    else if (styles.widthType === 'fit-content') classes.push('w-fit');
    else if (styles.widthValue && typeof styles.widthValue === 'number') classes.push(`w-[${styles.widthValue}px]`);
  }
  
  if (styles.heightType) {
    removePrefix(/^h-/);
    if (styles.heightType === 'fill') classes.push('h-full');
    else if (styles.heightType === 'fit-content') classes.push('h-fit');
    else if (styles.heightValue && typeof styles.heightValue === 'number') classes.push(`h-[${styles.heightValue}px]`);
  }

  return classes.join(' ');
}
