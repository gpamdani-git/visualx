import { CanvasNode, NodeStyleProps } from '../types/builder';
import { getStyleFromProps } from './styleUtils';

/**
 * Clean & Context-Aware Tailwind ClassName Generator
 * Mengubah spesifikasi style AST menjadi Tailwind class yang idiomatik,
 * bebas dari junk classes (seperti spam flex-col pada text/img/button).
 */
export const nodeToTailwind = (node: CanvasNode, styles: NodeStyleProps): string => {
  const classes: string[] = [];
  const isText = node.type === 'Text';
  const isButton = node.type === 'Button';
  const isImage = node.type === 'Image';
  const isVideo = node.type === 'Video';
  const isContainer = node.type === 'Frame' || node.type === 'Stack' || node.type === 'Grid' || node.type === 'Masonry';
  const hasChildren = Boolean(node.childrenIds && node.childrenIds.length > 0);

  // 1. Layout & Display (HANYA untuk container atau elemen dengan tata letak eksplisit)
  const shouldApplyLayout = isContainer || hasChildren || ((isText || isButton || isImage) && (styles.display === 'flex' || styles.display === 'grid'));
  if (shouldApplyLayout) {
    const isGrid = styles.layoutType === 'Grid' || styles.display === 'grid';
    
    if (isGrid) {
      classes.push('grid');
      const cols = typeof styles.gridColumns === 'number' ? styles.gridColumns : 2;
      if (cols <= 12) {
        classes.push(`grid-cols-${cols}`);
      } else {
        classes.push(`grid-cols-[repeat(${cols},minmax(0,1fr))]`);
      }

      // Grid Gaps
      const gapX = styles.gapX !== undefined ? styles.gapX : styles.gap;
      const gapY = styles.gapY !== undefined ? styles.gapY : styles.gap;
      if (gapX !== undefined && gapY !== undefined && gapX === gapY) {
        if (gapX > 0) classes.push(formatSpacing('gap', gapX));
      } else {
        if (gapX && gapX > 0) classes.push(formatSpacing('gap-x', gapX));
        if (gapY && gapY > 0) classes.push(formatSpacing('gap-y', gapY));
      }
    } else {
      // Flex / Stack
      classes.push('flex');
      if (styles.layoutDirection === 'row') {
        classes.push('flex-row');
      } else if (hasChildren || isContainer) {
        classes.push('flex-col');
      }

      // Justify Content (Hanya jika bukan default justify-start)
      if (styles.justifyContent === 'center') classes.push('justify-center');
      else if (styles.justifyContent === 'flex-end') classes.push('justify-end');
      else if (styles.justifyContent === 'space-between') classes.push('justify-between');
      else if (styles.justifyContent === 'space-around') classes.push('justify-around');
      else if (styles.justifyContent === 'space-evenly') classes.push('justify-evenly');

      // Align Items (Hanya jika bukan default)
      if (styles.alignItems === 'center') classes.push('items-center');
      else if (styles.alignItems === 'flex-end') classes.push('items-end');
      else if (styles.alignItems === 'stretch') classes.push('items-stretch');
      else if (styles.alignItems === 'baseline') classes.push('items-baseline');

      // Flex Wrap
      if (styles.flexWrap === 'wrap') classes.push('flex-wrap');

      // Flex Gap
      if (styles.gap && styles.gap > 0) {
        classes.push(formatSpacing('gap', styles.gap));
      }
    }
  } else if (isButton) {
    classes.push('inline-flex items-center justify-center font-medium transition-colors cursor-pointer');
  }

  // 2. Sizing & Dimensions
  if (styles.widthType === 'fill') {
    classes.push('w-full');
  } else if (styles.widthType === 'fit-content') {
    classes.push('w-fit');
  } else if (styles.widthType === 'fixed' && styles.widthValue) {
    classes.push(`w-[${styles.widthValue}px]`);
  }

  if (styles.heightType === 'fill') {
    classes.push('h-full');
  } else if (styles.heightType === 'fit-content') {
    classes.push('h-fit');
  } else if (styles.heightType === 'fixed' && styles.heightValue) {
    classes.push(`h-[${styles.heightValue}px]`);
  }

  if (styles.maxWidth && styles.maxWidth !== 'none') {
    classes.push(`max-w-[${styles.maxWidth}px]`);
  }
  if (styles.minHeight && styles.minHeight !== 0) {
    classes.push(`min-h-[${styles.minHeight}px]`);
  }

  // 3. Padding
  const pad = styles.padding;
  if (pad) {
    const t = pad.top || 0;
    const r = pad.right || 0;
    const b = pad.bottom || 0;
    const l = pad.left || 0;

    if (t === r && t === b && t === l && t > 0) {
      classes.push(formatSpacing('p', t));
    } else if (t === b && l === r && (t > 0 || l > 0)) {
      if (l > 0) classes.push(formatSpacing('px', l));
      if (t > 0) classes.push(formatSpacing('py', t));
    } else {
      if (t > 0) classes.push(formatSpacing('pt', t));
      if (r > 0) classes.push(formatSpacing('pr', r));
      if (b > 0) classes.push(formatSpacing('pb', b));
      if (l > 0) classes.push(formatSpacing('pl', l));
    }
  }

  // 4. Background & Fill
  if (styles.fillConfig) {
    if (styles.fillConfig.type === 'solid' && styles.fillConfig.color && styles.fillConfig.color !== 'transparent') {
      classes.push(formatColor('bg', styles.fillConfig.color));
    } else if (styles.fillConfig.type === 'image' && styles.fillConfig.imageSrc) {
      if (isImage) {
        if (styles.fillConfig.imageType === 'fit') classes.push('object-contain');
        else if (styles.fillConfig.imageType === 'stretch') classes.push('object-fill');
        else classes.push('object-cover');
        if (styles.fillConfig.imagePosition) classes.push('object-' + styles.fillConfig.imagePosition.toLowerCase());
      } else {
        classes.push('bg-cover bg-center');
      }
    }
  } else if (styles.backgroundColor && styles.backgroundColor !== 'transparent' && !styles.backgroundColor.includes('rgba(0, 0, 0, 0)')) {
    classes.push(formatColor('bg', styles.backgroundColor));
  }

  // 5. Border Radius
  const rad = styles.borderRadius;
  if (rad) {
    const tl = rad.tl || 0;
    const tr = rad.tr || 0;
    const br = rad.br || 0;
    const bl = rad.bl || 0;

    if (tl === tr && tl === br && tl === bl && tl > 0) {
      classes.push(formatRadius(tl));
    } else {
      if (tl > 0) classes.push(`rounded-tl-[${tl}px]`);
      if (tr > 0) classes.push(`rounded-tr-[${tr}px]`);
      if (br > 0) classes.push(`rounded-br-[${br}px]`);
      if (bl > 0) classes.push(`rounded-bl-[${bl}px]`);
    }
  }

  // 6. Border & Stroke
  if (styles.borderWidth && styles.borderWidth > 0) {
    if (styles.borderWidth === 1) classes.push('border');
    else classes.push(`border-[${styles.borderWidth}px]`);

    if (styles.borderColor && styles.borderColor !== 'transparent') {
      classes.push(formatColor('border', styles.borderColor));
    }
    if (styles.borderStyle === 'dashed') classes.push('border-dashed');
    if (styles.borderStyle === 'dotted') classes.push('border-dotted');
  }

  // 7. Typography (Khusus untuk Text & Button)
  if (isText || isButton) {
    if (styles.fontSize) {
      classes.push(formatFontSize(styles.fontSize));
    }
    if (styles.fontWeight) {
      classes.push(formatFontWeight(styles.fontWeight));
    }
    if (styles.color && styles.color !== 'inherit') {
      classes.push(formatColor('text', styles.color));
    }
    if (styles.textAlign && styles.textAlign !== 'left') {
      classes.push(`text-${styles.textAlign}`);
    }
    if (styles.letterSpacing && styles.letterSpacing !== 0) {
      classes.push(`tracking-[${styles.letterSpacing}px]`);
    }
  }

  // 8. Image Specifics
  if (isImage && !styles.fillConfig) {
    classes.push(styles.objectFit === 'contain' ? 'object-contain' : 'object-cover');
  }

  // 9. Opacity & Overflow
  if (styles.opacity !== undefined && styles.opacity < 1) {
    const op = Math.round(styles.opacity * 100);
    classes.push(`opacity-${op}`);
  }
  if (styles.overflow === 'hidden' || styles.overflow === 'clip') {
    classes.push('overflow-hidden');
  }

  // 9.5 Z-Index
  if (styles.zIndex !== undefined && styles.zIndex !== 0) {
    if ([10, 20, 30, 40, 50].includes(styles.zIndex)) {
      classes.push(`z-${styles.zIndex}`);
    } else {
      classes.push(`z-[${styles.zIndex}]`);
    }
  }

  // 10. Shadows
  if (styles.shadows && styles.shadows.length > 0) {
    const s = styles.shadows[0];
    if (s.blur >= 20) classes.push('shadow-2xl');
    else if (s.blur >= 12) classes.push('shadow-xl');
    else if (s.blur >= 8) classes.push('shadow-lg');
    else if (s.blur >= 4) classes.push('shadow-md');
    else classes.push('shadow-sm');
  }

  return classes.filter(Boolean).join(' ');
};

// Helper spacing formatter: mapping pixel to standard tailwind when matched
function formatSpacing(prefix: string, px: number): string {
  const map: Record<number, string> = {
    0: '0',
    2: '0.5',
    4: '1',
    6: '1.5',
    8: '2',
    10: '2.5',
    12: '3',
    14: '3.5',
    16: '4',
    20: '5',
    24: '6',
    28: '7',
    32: '8',
    36: '9',
    40: '10',
    44: '11',
    48: '12',
    56: '14',
    64: '16',
    80: '20',
    96: '24'
  };
  if (map[px] !== undefined) {
    return `${prefix}-${map[px]}`;
  }
  return `${prefix}-[${px}px]`;
}

function formatRadius(px: number): string {
  if (px === 2) return 'rounded-xs';
  if (px === 4) return 'rounded-sm';
  if (px === 6) return 'rounded';
  if (px === 8) return 'rounded-md';
  if (px === 12) return 'rounded-lg';
  if (px === 16) return 'rounded-xl';
  if (px === 24) return 'rounded-2xl';
  if (px === 32) return 'rounded-3xl';
  if (px >= 999) return 'rounded-full';
  return `rounded-[${px}px]`;
}

function formatFontSize(px: number): string {
  if (px <= 12) return 'text-xs';
  if (px === 14) return 'text-sm';
  if (px === 16) return 'text-base';
  if (px === 18) return 'text-lg';
  if (px === 20) return 'text-xl';
  if (px === 24) return 'text-2xl';
  if (px === 30) return 'text-3xl';
  if (px === 36) return 'text-4xl';
  if (px === 48) return 'text-5xl';
  if (px === 60) return 'text-6xl';
  return `text-[${px}px]`;
}

function formatFontWeight(w: number | string): string {
  const num = typeof w === 'number' ? w : parseInt(w, 10);
  if (num <= 300) return 'font-light';
  if (num === 400) return 'font-normal';
  if (num === 500) return 'font-medium';
  if (num === 600) return 'font-semibold';
  if (num === 700) return 'font-bold';
  if (num >= 800) return 'font-extrabold';
  return 'font-normal';
}

function formatColor(prefix: string, color: string): string {
  if (color === '#ffffff' || color.toLowerCase() === '#fff' || color === 'white') return `${prefix}-white`;
  if (color === '#000000' || color.toLowerCase() === '#000' || color === 'black') return `${prefix}-black`;
  if (color === '#09090b' || color === '#111111') return `${prefix}-zinc-950`;
  if (color === '#18181b' || color === '#1a1a1a') return `${prefix}-zinc-900`;
  if (color === '#27272a' || color === '#222222') return `${prefix}-zinc-800`;
  if (color === '#71717a' || color === '#888888') return `${prefix}-zinc-500`;
  if (color === '#a1a1aa' || color === '#aaaaaa') return `${prefix}-zinc-400`;
  if (color === '#f4f4f5' || color === '#f5f5f5') return `${prefix}-zinc-100`;
  return `${prefix}-[${color}]`;
}

/**
 * Hudbird UI export helpers — maps canvas nodes to the real library components
 * so exported code renders identically to the editor.
 */
const HUDBIRD_EXPORT_ALIAS: Record<string, string> = {
  Hudbird_Cta: 'CtaCentered',
  Hudbird_Footer: 'FooterSimple',
  Hudbird_Pricing: 'PricingSection',
};

// Props that only exist for the canvas editor (icons/preview triggers/legacy compat)
const HUDBIRD_EDITOR_ONLY_PROPS = new Set(['iconName', 'iconPosition', 'trigger', 'level', 'fallback']);

function hudbirdExportName(type: string): string {
  if (HUDBIRD_EXPORT_ALIAS[type]) return HUDBIRD_EXPORT_ALIAS[type];
  return type.replace(/^Hudbird_/, '');
}

function serializeJsxAttr(key: string, value: any): string {
  if (value === undefined) return '';
  if (typeof value === 'string') {
    if (!value.includes('"') && !value.includes('\n') && !value.includes('{')) {
      return ` ${key}="${value}"`;
    }
    return ` ${key}={${JSON.stringify(value)}}`;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return ` ${key}={${String(value)}}`;
  }
  if (value === null) return ` ${key}={null}`;
  return ` ${key}={${JSON.stringify(value)}}`;
}

function escapeJsxText(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Generate Clean & Production-Ready React Component Code
 */
export const generateReactCode = (nodes: Record<string, CanvasNode>, rootId: string): string => {
  const hudbirdImports = new Set<string>();
  const lucideImports = new Set<string>();

  const renderHudbirdNode = (node: CanvasNode, indent: string, renderChild: (id: string, ind: string) => string): string => {
    const exportName = hudbirdExportName(node.type);
    hudbirdImports.add(exportName);

    const validChildren = Array.from(new Set(node.childrenIds || [])).filter(id => Boolean(nodes[id]));
    const props: Record<string, any> = { ...(node.props || {}) };
    for (const k of HUDBIRD_EDITOR_ONLY_PROPS) delete props[k];

    // Button icon mapping: editor iconName/iconPosition -> Hudbird startContent/endContent
    let iconAttrs = '';
    if (node.type === 'Hudbird_Button' && node.props?.iconName) {
      const iconName = String(node.props.iconName);
      if (/^[A-Z][A-Za-z0-9]*$/.test(iconName)) {
        lucideImports.add(iconName);
        const size = node.props?.size === 'sm' ? 14 : node.props?.size === 'lg' ? 20 : 18;
        const iconEl = `<${iconName} size={${size}} />`;
        if (node.props?.iconPosition === 'right') iconAttrs += ` endContent={${iconEl}}`;
        else iconAttrs += ` startContent={${iconEl}}`;
      }
    }

    let attrs = '';
    for (const [k, v] of Object.entries(props)) {
      if (k === 'children' && validChildren.length > 0) continue; // children come from child nodes
      if (k === 'children' && typeof v === 'string') continue; // emitted as JSX children below
      attrs += serializeJsxAttr(k, v);
    }
    attrs += iconAttrs;

    if (validChildren.length > 0) {
      let childrenCode = '';
      validChildren.forEach(childId => {
        childrenCode += renderChild(childId, indent + '  ');
      });
      return `${indent}<${exportName}${attrs}>\n${childrenCode}${indent}</${exportName}>\n`;
    }
    const textChild = typeof props.children === 'string' && props.children ? escapeJsxText(props.children) : '';
    if (textChild) {
      return `${indent}<${exportName}${attrs}>${textChild}</${exportName}>\n`;
    }
    return `${indent}<${exportName}${attrs} />\n`;
  };

  const renderNode = (nodeId: string, indent: string): string => {
    const node = nodes[nodeId];
    if (!node) return '';

    const styles = node.responsiveStyles?.base || ({} as NodeStyleProps);
    const twClasses = nodeToTailwind(node, styles);
    const classString = twClasses ? ` className="${twClasses}"` : '';

    if (node.type.startsWith('Hudbird_')) {
      const inner = renderHudbirdNode(node, twClasses ? indent + '  ' : indent, renderNode);
      // Preserve the canvas wrapper layout around the component
      if (twClasses) {
        return `${indent}<div${classString}>\n${inner}${indent}</div>\n`;
      }
      return inner;
    }

    if (node.type === 'Text') {
      const textContent = node.props.text || 'Text';
      return `${indent}<span${classString}>${textContent}</span>\n`;
    }
    
    if (node.type === 'Button') {
      const btnText = node.props.text || 'Button';
      return `${indent}<button${classString}>${btnText}</button>\n`;
    }

    if (node.type === 'Image') {
      const src = styles.fillConfig?.imageSrc || (styles.backgroundColor?.startsWith('url(') ? styles.backgroundColor.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '') : null) || node.props.src || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop';
      const alt = node.props.alt || 'Asset';
      return `${indent}<img src="${src}" alt="${alt}"${classString} />\n`;
    }
    
    if (node.type === 'Video') {
      const src = node.props.src || '';
      return `${indent}<video src="${src}" autoPlay loop muted playsInline${classString} />\n`;
    }

    // Container / Frame / Stack / Grid
    const validChildren = Array.from(new Set(node.childrenIds || [])).filter(id => Boolean(nodes[id]));
    if (validChildren.length > 0) {
      let childrenCode = '';
      validChildren.forEach(childId => {
        childrenCode += renderNode(childId, indent + '  ');
      });
      return `${indent}<div${classString}>\n${childrenCode}${indent}</div>\n`;
    } else {
      return `${indent}<div${classString} />\n`;
    }
  };

  const componentBody = renderNode(rootId, '      ');

  // Include Sun/Moon icons for the ThemeSwitcher
  lucideImports.add('Sun');
  lucideImports.add('Moon');

  const hudbirdImport = hudbirdImports.size > 0
    ? `import { ${Array.from(hudbirdImports).sort().join(', ')} } from './hudbird-ui'; // Hudbird UI library (vendored in src/components/hudbird-ui)\n`
    : '';
  const lucideImport = lucideImports.size > 0
    ? `import { ${Array.from(lucideImports).sort().join(', ')} } from 'lucide-react';\n`
    : '';

  return `import React, { useState, useEffect } from 'react';
${hudbirdImport}${lucideImport}
function ThemeSwitcher() {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);
    if (savedTheme === 'dark') document.documentElement.classList.add('dark');
  }, []);
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };
  return (
    <button onClick={toggleTheme} className="fixed bottom-4 right-4 p-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-full shadow-lg border border-zinc-200 dark:border-zinc-700 z-50 transition-colors">
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}

export default function GeneratedComponent() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <ThemeSwitcher />
${componentBody}    </div>
  );
}
`;
};

/**
 * Generate Clean HTML5 + Tailwind CSS Output
 */
export const generateHtmlCode = (nodes: Record<string, CanvasNode>, rootId: string): string => {
  const renderHtmlNode = (nodeId: string, indent: string): string => {
    const node = nodes[nodeId];
    if (!node) return '';

    const styles = node.responsiveStyles?.base || ({} as NodeStyleProps);
    const twClasses = nodeToTailwind(node, styles);
    const classAttr = twClasses ? ` class="${twClasses}"` : '';

    if (node.type === 'Text') {
      const textContent = (node.props.text || 'Text').replace(/\n/g, '<br/>');
      return `${indent}<span${classAttr}>${textContent}</span>\n`;
    }
    if (node.type === 'Button') {
      return `${indent}<button${classAttr}>${node.props.text || 'Button'}</button>\n`;
    }
    if (node.type === 'Image') {
      const src = styles.fillConfig?.imageSrc || (styles.backgroundColor?.startsWith('url(') ? styles.backgroundColor.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '') : null) || node.props.src || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop';
      return `${indent}<img src="${src}" alt="${node.props.alt || 'Asset'}"${classAttr} />\n`;
    }
    if (node.type === 'Video') {
      return `${indent}<video src="${node.props.src || ''}" autoPlay loop muted playsInline${classAttr}></video>\n`;
    }

    if (node.type.startsWith('Hudbird_')) {
      // Plain-HTML fallback: keep layout + text content, name the source component.
      // For pixel-identical output use the React export with the Hudbird UI library.
      const exportName = hudbirdExportName(node.type);
      const validChildren = Array.from(new Set(node.childrenIds || [])).filter(id => Boolean(nodes[id]));
      const textKeys = ['children', 'title', 'text', 'description', 'label', 'brandName'];
      let textContent = '';
      for (const k of textKeys) {
        if (typeof node.props?.[k] === 'string' && node.props[k]) { textContent = node.props[k]; break; }
      }
      if (validChildren.length > 0) {
        let childrenCode = '';
        validChildren.forEach(childId => {
          childrenCode += renderHtmlNode(childId, indent + '  ');
        });
        return `${indent}<!-- Hudbird:${exportName} -->\n${indent}<div${classAttr}>\n${childrenCode}${indent}</div>\n`;
      }
      const safeText = textContent.replace(/\n/g, '<br/>');
      if (safeText) {
        return `${indent}<!-- Hudbird:${exportName} -->\n${indent}<div${classAttr}>${safeText}</div>\n`;
      }
      return `${indent}<!-- Hudbird:${exportName} -->\n${indent}<div${classAttr}></div>\n`;
    }

    // Frame/Layout
    const validChildren = Array.from(new Set(node.childrenIds || [])).filter(id => Boolean(nodes[id]));
    if (validChildren.length > 0) {
      let childrenCode = '';
      validChildren.forEach(childId => {
        childrenCode += renderHtmlNode(childId, indent + '  ');
      });
      return `${indent}<div${classAttr}>\n${childrenCode}${indent}</div>\n`;
    } else {
      return `${indent}<div${classAttr}></div>\n`;
    }
  };

  const bodyHtml = renderHtmlNode(rootId, '    ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Design</title>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <style>
  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background-color: #000;
    color: #fff;
    min-height: 100vh;
  }
  * {
    box-sizing: border-box;
  }
  </style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
};
