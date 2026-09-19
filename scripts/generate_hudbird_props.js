import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uiDir = path.join(__dirname, '../src/components/hudbird-ui');
const outputFile = path.join(__dirname, '../src/registry/hudbirdPropControls.ts');

const controls = {};
const defaults = {};

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const compNameMatch = filePath.match(/\/([A-Z][a-zA-Z0-9]+)\/[A-Z][a-zA-Z0-9]+\.tsx$/);
  if (!compNameMatch) return;
  const compName = compNameMatch[1];
  
  if (!controls[compName]) controls[compName] = {};
  if (!defaults[compName]) defaults[compName] = {};

  // Find literal types: export type ButtonVariant = "solid" | "outline";
  const typeRegex = /export\s+type\s+[A-Za-z]+(Variant|Color|Size|Radius|Placement|Orientation|State)\s*=\s*([^;]+);/g;
  let match;
  while ((match = typeRegex.exec(content)) !== null) {
    const propKey = match[1].toLowerCase();
    const rawOptions = match[2];
    // extract strings between quotes
    const optionMatches = [...rawOptions.matchAll(/["']([^"']+)["']/g)];
    const options = optionMatches.map(m => m[1]);
    
    if (options.length > 0) {
      controls[compName][propKey] = {
        type: 'select',
        options: options
      };
      
      // Default to the first option, or let's try to extract defaults from cva if possible.
      // For now, set the first option as default, or if there is a 'defaultVariants' we can parse it.
      defaults[compName][propKey] = options[0];
    }
  }

  // Find defaultVariants in cva: defaultVariants: { variant: "solid", size: "md" }
  const defaultVariantsRegex = /defaultVariants:\s*{([^}]+)}/g;
  let defMatch;
  while ((defMatch = defaultVariantsRegex.exec(content)) !== null) {
    const inner = defMatch[1];
    const pairs = [...inner.matchAll(/([a-zA-Z]+):\s*["']([^"']+)["']/g)];
    for (const p of pairs) {
      const key = p[1];
      const val = p[2];
      defaults[compName][key] = val;
    }
  }

  // Extract boolean props from interfaces
  // Quick and dirty regex: `isSomething?: boolean;`
  const boolRegex = /([a-zA-Z0-9_]+)\??:\s*boolean/g;
  let bMatch;
  while ((bMatch = boolRegex.exec(content)) !== null) {
    const key = bMatch[1];
    if (key.startsWith('is') || key.startsWith('has') || key.startsWith('with')) {
      controls[compName][key] = { type: 'boolean' };
      defaults[compName][key] = false;
    }
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') && !fullPath.includes('index.tsx')) {
      processFile(fullPath);
    }
  }
}

walkDir(uiDir);

for (const comp in controls) {
  // If the component accepts text content, we can infer it if it has no children, but let's just add it manually where needed.
  if (['Button', 'Badge', 'Text', 'Heading'].includes(comp)) {
    controls[comp]['children'] = { type: 'string', label: 'Text' };
    defaults[comp]['children'] = comp;
  }
}

// Add the marketing component props manually to match BlankUI docs
const marketingUpdates = {
  "BentoGrid": {
    "className": { "type": "string" },
    "children": { "type": "string", "label": "Text" }
  },
  "CtaCentered": {
    "badge": { "type": "string" },
    "title": { "type": "string" },
    "description": { "type": "string" },
    "primaryAction": { "type": "object" },
    "secondaryAction": { "type": "object" }
  },
  "CtaSplit": {
    "badge": { "type": "string" },
    "title": { "type": "string" },
    "description": { "type": "string" },
    "imageSrc": { "type": "string" },
    "primaryAction": { "type": "object" },
    "secondaryAction": { "type": "object" }
  },
  "CtaGlass": {
    "badge": { "type": "string" },
    "title": { "type": "string" },
    "description": { "type": "string" },
    "primaryAction": { "type": "object" },
    "secondaryAction": { "type": "object" }
  },
  "Faq": {
    "label": { "type": "string" },
    "title": { "type": "string" },
    "description": { "type": "string" },
    "variant": { "type": "select", "options": ["centered", "side-by-side"] }
  },
  "FaqCategorized": {
    "label": { "type": "string" },
    "title": { "type": "string" },
    "description": { "type": "string" }
  },
  "FaqWithIllustration": {
    "title": { "type": "string" },
    "description": { "type": "string" }
  },
  "FeatureSection": {
    "variant": { "type": "select", "options": ["default", "subtle", "transparent"] }
  },
  "Hero": {
    "size": { "type": "select", "options": ["full", "auto", "fixed"] },
    "withBlobs": { "type": "boolean" }
  },
  "HeroGlass": {
    "badge": { "type": "string" },
    "title": { "type": "string" },
    "description": { "type": "string" },
    "primaryAction": { "type": "object" },
    "secondaryAction": { "type": "object" }
  },
  "LogoCloud": {
    "variant": { "type": "select", "options": ["default", "subtle", "transparent"] }
  },
  "Pricing": {
    "variant": { "type": "select", "options": ["default", "subtle", "transparent"] },
    "isAnnual": { "type": "boolean" }
  },
  "Testimonials": {
    "title": { "type": "string" },
    "description": { "type": "string" }
  },
  "TestimonialGlass": {
    "title": { "type": "string" },
    "description": { "type": "string" }
  }
};

const marketingDefaults = {
  "CtaCentered": {
    "title": "Boost your productivity",
    "description": "Start using our app today."
  },
  "CtaSplit": {
    "title": "Join thousands of developers",
    "description": "Start building today.",
    "imageSrc": "https://images.unsplash.com/photo-1522071820081-009f0129c71c"
  },
  "CtaGlass": {
    "title": "Ready to Take Control?",
    "description": "Get expert care."
  },
  "Faq": {
    "label": "FAQ",
    "title": "Frequently asked questions",
    "variant": "centered"
  },
  "FaqCategorized": {
    "label": "HOW TO GET STARTED",
    "title": "Frequently asked questions"
  },
  "FaqWithIllustration": {
    "title": "Frequently asked questions"
  },
  "FeatureSection": {
    "variant": "default"
  },
  "Hero": {
    "size": "full",
    "withBlobs": false
  },
  "HeroGlass": {
    "title": "The Future of Web Development",
    "description": "Build stunning interfaces faster."
  },
  "LogoCloud": {
    "variant": "default"
  },
  "Pricing": {
    "variant": "default",
    "isAnnual": false
  },
  "Testimonials": {
    "title": "What They're Saying"
  },
  "TestimonialGlass": {
    "title": "What They're Saying"
  }
};

for (const comp in marketingUpdates) {
  controls[comp] = { ...(controls[comp] || {}), ...marketingUpdates[comp] };
}
for (const comp in marketingDefaults) {
  defaults[comp] = { ...(defaults[comp] || {}), ...marketingDefaults[comp] };
}

const fileContent = `// AUTO-GENERATED FILE
// Do not edit manually. Run node scripts/generate_hudbird_props.js to update.

export const hudbirdPropControls: Record<string, any> = ${JSON.stringify(controls, null, 2)};

export const hudbirdDefaultProps: Record<string, any> = ${JSON.stringify(defaults, null, 2)};
`;

fs.writeFileSync(outputFile, fileContent);
console.log('Successfully generated hudbirdPropControls.ts!');
