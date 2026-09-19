const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const filePath = path.join(__dirname, '../src/registry/hudbirdDocsTemplates.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// The goal is to properly rewrite CtaCentered AST to be perfectly flat and use className
function generateId(prefix) {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

// We will manually replace the CtaCentered array in the file for now.
// Because parsing the entire TS file as JS is hard.

const ctaMatch = content.match(/hudbirdDocsTemplates\['Cta'\] = \[([\s\S]*?)\];/);

if (ctaMatch) {
  // Let's just hardcode the perfect AST for CtaCentered to fix the broken state.
  const rootId = generateId('ctacentered');
  const titleId = generateId('ctatitle');
  const descId = generateId('ctadesc');
  const stackId = generateId('ctastack');
  const btn1Id = generateId('ctabtnp');
  const btn2Id = generateId('ctabtns');

  const correctAST = `[
  {
    name: 'centered',
    rootNodeId: '${rootId}',
    nodeData: {
      "${rootId}": {
        id: "${rootId}",
        type: "Hudbird_CtaCentered",
        name: "CtaCentered",
        parentId: null,
        props: { className: "bg-transparent" },
        childrenIds: ["${titleId}", "${descId}", "${stackId}"],
        responsiveStyles: { base: {} }
      },
      "${titleId}": {
        id: "${titleId}",
        type: "Text",
        name: "Heading",
        parentId: "${rootId}",
        props: {
          text: "Boost your productivity. Start using our app today.",
          className: "text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-white"
        },
        childrenIds: [],
        responsiveStyles: { base: {} }
      },
      "${descId}": {
        id: "${descId}",
        type: "Text",
        name: "Subtitle",
        parentId: "${rootId}",
        props: {
          text: "Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam.",
          className: "mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400"
        },
        childrenIds: [],
        responsiveStyles: { base: {} }
      },
      "${stackId}": {
        id: "${stackId}",
        type: "Stack",
        name: "Actions",
        parentId: "${rootId}",
        props: {
          className: "mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
        },
        childrenIds: ["${btn1Id}", "${btn2Id}"],
        responsiveStyles: { base: {} }
      },
      "${btn1Id}": {
        id: "${btn1Id}",
        type: "Hudbird_Button",
        name: "Primary Button",
        parentId: "${stackId}",
        props: {
          children: "Get started",
          color: "primary",
          className: "w-full sm:w-auto"
        },
        childrenIds: [],
        responsiveStyles: { base: {} }
      },
      "${btn2Id}": {
        id: "${btn2Id}",
        type: "Hudbird_Button",
        name: "Secondary Button",
        parentId: "${stackId}",
        props: {
          children: "Learn more",
          variant: "outline",
          className: "w-full sm:w-auto"
        },
        childrenIds: [],
        responsiveStyles: { base: {} }
      }
    }
  }
]`;

  content = content.replace(ctaMatch[0], `hudbirdDocsTemplates['Cta'] = ${correctAST};`);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log("Fixed CtaCentered AST in hudbirdDocsTemplates.ts");
} else {
  console.log("Could not find Cta in hudbirdDocsTemplates.ts");
}
