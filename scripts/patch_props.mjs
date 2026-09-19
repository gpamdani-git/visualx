import fs from 'fs';
import path from 'path';

const filePath = './src/registry/hudbirdPropControls.ts';
let content = fs.readFileSync(filePath, 'utf8');

// We will replace the empty or incomplete objects with full ones based on BlankUI docs

const updates = {
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
  "FooterSimple": {},
  "FooterMega": {},
  "FooterGlass": {},
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

const defaultsUpdates = {
  "BentoGrid": {},
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

// Evaluate the exported constants from the file
// A dirty but effective way to patch it without a full AST parser for this specific task
const controlsRegex = /export const hudbirdPropControls: Record<string, any> = (\{[\s\S]*?\n\});\n\nexport const hudbirdDefaultProps/;
const match = content.match(controlsRegex);

if (match) {
  const controlsJsonStr = match[1];
  // Note: the file has it as a JS object, not strict JSON. But generate_hudbird_props.js outputs using JSON.stringify.
  // So it should be valid JSON except it might have been formatted. Let's regenerate it completely using generate_hudbird_props logic + our patch.
}

console.log("Will just update generate_hudbird_props.js instead.");
