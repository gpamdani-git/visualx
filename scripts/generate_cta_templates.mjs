/**
 * generate_cta_templates.mjs
 * 
 * Generates native CanvasNode blueprints for CTA components.
 * Instead of single Hudbird_CtaCentered nodes (which are opaque black-boxes),
 * we produce Frame/Text/Button trees that are individually selectable & editable.
 */
import fs from 'fs';
import path from 'path';

const OUTPUT_FILE = './src/registry/nativeCtaTemplates.ts';

function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

function baseStyle(extras = {}) {
  // NOT setting widthType/heightType here — we rely on Tailwind classes for sizing
  // Setting them would emit inline width/height styles that override our className
  return {
    paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0,
    marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 0,
    opacity: 1, overflow: 'visible', position: 'static',
    ...extras
  };
}

// CtaCentered: section > div.max-w-7xl > div.max-w-3xl.text-center > h2 + p + div(buttons)
function makeCtaCentered() {
  const sectionId = uid('cta_centered_section');
  const innerId = uid('cta_centered_inner');
  const titleId = uid('cta_centered_title');
  const descId = uid('cta_centered_desc');
  const buttonsId = uid('cta_centered_buttons');
  const primaryBtnId = uid('cta_centered_primary_btn');
  const secondaryBtnId = uid('cta_centered_secondary_btn');

  const nodeData = {
    [sectionId]: {
      id: sectionId, type: 'Frame', name: 'CtaCentered Section',
      parentId: null,
      childrenIds: [innerId],
      props: {
        className: 'relative overflow-hidden py-24 sm:py-32 bg-white dark:bg-zinc-900 w-full'
      },
      responsiveStyles: { base: { ...baseStyle() } }
    },
    [innerId]: {
      id: innerId, type: 'Frame', name: 'CTA Content',
      parentId: sectionId,
      childrenIds: [titleId, descId, buttonsId],
      props: {
        className: 'mx-auto max-w-3xl text-center flex flex-col items-center gap-6'
      },
      responsiveStyles: { base: { ...baseStyle({ display: 'flex', layoutDirection: 'column', alignItems: 'center', gap: 24 }) } }
    },
    [titleId]: {
      id: titleId, type: 'Text', name: 'CTA Title',
      parentId: innerId,
      childrenIds: [],
      props: {
        text: 'Boost your productivity. Start using our app today.',
        className: 'text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl'
      },
      responsiveStyles: { base: { ...baseStyle() } }
    },
    [descId]: {
      id: descId, type: 'Text', name: 'CTA Description',
      parentId: innerId,
      childrenIds: [],
      props: {
        text: 'Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam.',
        className: 'mx-auto max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400'
      },
      responsiveStyles: { base: { ...baseStyle() } }
    },
    [buttonsId]: {
      id: buttonsId, type: 'Frame', name: 'CTA Buttons',
      parentId: innerId,
      childrenIds: [primaryBtnId, secondaryBtnId],
      props: {
        className: 'flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-4'
      },
      responsiveStyles: { base: { ...baseStyle({ display: 'flex', layoutDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 }) } }
    },
    [primaryBtnId]: {
      id: primaryBtnId, type: 'Hudbird_Button', name: 'Primary Button',
      parentId: buttonsId,
      childrenIds: [],
      props: {
        children: 'Get started',
        variant: 'solid',
        color: 'indigo',
        className: 'w-full sm:w-auto'
      },
      responsiveStyles: { base: { ...baseStyle({ widthType: 'auto', heightType: 'auto' }) } }
    },
    [secondaryBtnId]: {
      id: secondaryBtnId, type: 'Hudbird_Button', name: 'Secondary Button',
      parentId: buttonsId,
      childrenIds: [],
      props: {
        children: 'Learn more',
        variant: 'outline',
        color: 'zinc',
        className: 'w-full sm:w-auto'
      },
      responsiveStyles: { base: { ...baseStyle({ widthType: 'auto', heightType: 'auto' }) } }
    }
  };

  return { rootNodeId: sectionId, name: 'CtaCentered (Editable)', nodeData };
}

// CtaSplit: two-column layout - left text, right buttons
function makeCtaSplit() {
  const sectionId = uid('cta_split_section');
  const innerId = uid('cta_split_inner');
  const leftId = uid('cta_split_left');
  const titleId = uid('cta_split_title');
  const descId = uid('cta_split_desc');
  const rightId = uid('cta_split_right');
  const primaryBtnId = uid('cta_split_primary_btn');
  const secondaryBtnId = uid('cta_split_secondary_btn');

  const nodeData = {
    [sectionId]: {
      id: sectionId, type: 'Frame', name: 'CtaSplit Section',
      parentId: null,
      childrenIds: [innerId],
      props: {
        className: 'relative overflow-hidden py-16 sm:py-24 bg-indigo-600 w-full'
      },
      responsiveStyles: { base: { ...baseStyle() } }
    },
    [innerId]: {
      id: innerId, type: 'Frame', name: 'CTA Split Inner',
      parentId: sectionId,
      childrenIds: [leftId, rightId],
      props: {
        className: 'mx-auto max-w-7xl px-6 lg:px-8 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between'
      },
      responsiveStyles: { base: { ...baseStyle({ display: 'flex', layoutDirection: 'row', alignItems: 'center', gap: 40 }) } }
    },
    [leftId]: {
      id: leftId, type: 'Frame', name: 'CTA Left',
      parentId: innerId,
      childrenIds: [titleId, descId],
      props: {
        className: 'flex flex-col gap-4 max-w-2xl'
      },
      responsiveStyles: { base: { ...baseStyle({ display: 'flex', layoutDirection: 'column', gap: 16 }) } }
    },
    [titleId]: {
      id: titleId, type: 'Text', name: 'CTA Title',
      parentId: leftId,
      childrenIds: [],
      props: {
        text: 'Boost your productivity. Start using our app today.',
        className: 'text-3xl font-bold tracking-tight text-white sm:text-4xl'
      },
      responsiveStyles: { base: { ...baseStyle() } }
    },
    [descId]: {
      id: descId, type: 'Text', name: 'CTA Description',
      parentId: leftId,
      childrenIds: [],
      props: {
        text: 'Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam.',
        className: 'text-lg leading-8 text-indigo-200'
      },
      responsiveStyles: { base: { ...baseStyle() } }
    },
    [rightId]: {
      id: rightId, type: 'Frame', name: 'CTA Right (Buttons)',
      parentId: innerId,
      childrenIds: [primaryBtnId, secondaryBtnId],
      props: {
        className: 'flex flex-col sm:flex-row items-center gap-4 shrink-0'
      },
      responsiveStyles: { base: { ...baseStyle({ display: 'flex', layoutDirection: 'row', alignItems: 'center', gap: 16 }) } }
    },
    [primaryBtnId]: {
      id: primaryBtnId, type: 'Hudbird_Button', name: 'Primary Button',
      parentId: rightId,
      childrenIds: [],
      props: {
        children: 'Get started',
        variant: 'solid',
        color: 'white',
        className: 'w-full sm:w-auto'
      },
      responsiveStyles: { base: { ...baseStyle({ widthType: 'auto', heightType: 'auto' }) } }
    },
    [secondaryBtnId]: {
      id: secondaryBtnId, type: 'Hudbird_Button', name: 'Secondary Button',
      parentId: rightId,
      childrenIds: [],
      props: {
        children: 'Learn more',
        variant: 'ghost',
        color: 'white',
        className: 'w-full sm:w-auto text-white'
      },
      responsiveStyles: { base: { ...baseStyle({ widthType: 'auto', heightType: 'auto' }) } }
    }
  };

  return { rootNodeId: sectionId, name: 'CtaSplit (Editable)', nodeData };
}

// Generate output
const templates = [makeCtaCentered(), makeCtaSplit()];

let tsOutput = `// AUTO GENERATED - Native Canvas CTA Templates\n// @ts-nocheck\nimport { CanvasNode } from '../types/builder';\n\n`;
tsOutput += `export const nativeCtaTemplates: { rootNodeId: string, name: string, nodeData: Record<string, CanvasNode> }[] = [\n`;

templates.forEach(t => {
  tsOutput += `  {\n    name: ${JSON.stringify(t.name)},\n    rootNodeId: ${JSON.stringify(t.rootNodeId)},\n    nodeData: ${JSON.stringify(t.nodeData, null, 4)}\n  },\n`;
});

tsOutput += `];\n`;

fs.writeFileSync(OUTPUT_FILE, tsOutput);
console.log('Generated', OUTPUT_FILE);
