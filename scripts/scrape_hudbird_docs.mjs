import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import { createRequire } from 'module';
const traverse = _traverse.default || _traverse;
const require = createRequire(import.meta.url);

const BLANK_UI_DOCS_PATH = '/Users/daniakbar/Documents/AISTUDIO APP/BlankUI-/apps/docs/src/pages/marketing';
const TEMPLATES_PATH = '/Users/daniakbar/Documents/AISTUDIO APP/BlankUI-/apps/docs/src/components/templates';
const OUTPUT_FILE = './src/registry/hudbirdDocsTemplates.ts';

// Load actual Lucide icon names to avoid mis-tagging Hudbird components as icons
const lucideExports = require('lucide-react');
const LUCIDE_ICON_NAMES = new Set(
  Object.keys(lucideExports).filter(k => !k.startsWith('Lucide') && !k.endsWith('Icon') && /^[A-Z]/.test(k))
);

// Whitelist of actual Hudbird UI component names (scraped from the source files)
// Any component NOT in this list will be skipped/treated as a native element
const KNOWN_HUDBIRD_COMPONENTS = new Set([
  'Accordion','AccordionItem','Alert','Avatar','Badge','BentoCard','BentoCardBackground',
  'BentoCardContent','BentoGrid','BentoGridGlass','Button','Card','CardBody','CardFooter',
  'CardHeader','Checkbox','ComboBox','CtaCentered','CtaGlass','CtaSplit','DescriptionList',
  'DescriptionListItem','DescriptionListLabel','DescriptionListValue','Dialog','DialogContent',
  'DialogDescription','DialogFooter','DialogHeader','DialogTitle','Divider','Dropdown',
  'DropdownItem','DropdownMenu','DropdownSection','DropdownTrigger','Faq','FaqCategorized',
  'FaqGlass','FaqWithIllustration','FeatureAlternating','FeatureBadge','FeatureCard',
  'FeatureCardDescription','FeatureCardTitle','FeatureDescription','FeatureGlass','FeatureGrid',
  'FeatureHeader','FeatureIcon','FeatureRow','FeatureRowContent','FeatureRowMedia',
  'FeatureSection','FeatureTitle','Fieldset','FieldsetContent','FieldsetErrorText',
  'FieldsetHeader','FieldsetHelperText','FieldsetLegend','FieldsetRow','FooterGlass',
  'FooterMega','FooterSimple','Heading','Hero','HeroActions','HeroBackground','HeroBadge',
  'HeroBody','HeroContent','HeroDescription','HeroGlass','HeroHeader','HeroMedia','HeroTitle',
  'HudbirdProvider','InfiniteScroll','Input','LogoCloud','LogoCloudGlass','LogoCloudGrid',
  'LogoCloudItem','LogoCloudTicker','LogoCloudTitle','Navbar','NavbarBrand','NavbarContent',
  'NavbarDropdownMenu','NavbarItem','NavbarMegaMenu','NavbarMenu','NavbarMenuItem',
  'NavbarMenuToggle','Pagination','PricingBadge','PricingDescription','PricingGlass',
  'PricingGrid','PricingHeader','PricingSection','PricingTier','PricingTierDescription',
  'PricingTierFeature','PricingTierFeatures','PricingTierHeader','PricingTierName',
  'PricingTierPrice','PricingTitle','PricingToggle','Radio','RadioGroup','Select','SelectItem',
  'Sidebar','SidebarContent','SidebarFooter','SidebarHeader','SidebarItem','SidebarNav',
  'SidebarToggle','Skeleton','Switch','Tab','TabList','TabPanel','Table','TableBody',
  'TableCaption','TableCell','TableFooter','TableHead','TableHeader','TableRow','Tabs',
  'TestimonialCard','TestimonialGlass','Testimonials','TestimonialsFlat','TestimonialsMarquee',
  'TestimonialsSideBySide','Text','Textarea','Tooltip'
]);

function generateRandomId(prefix) {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

let currentScope = {};

function astToJson(astNode) {
  if (!astNode) return undefined;
  if (astNode.type === 'StringLiteral') return astNode.value;
  if (astNode.type === 'NumericLiteral') return astNode.value;
  if (astNode.type === 'BooleanLiteral') return astNode.value;
  if (astNode.type === 'NullLiteral') return null;
  
  if (astNode.type === 'Identifier') {
    if (currentScope[astNode.name]) {
       return astToJson(currentScope[astNode.name]);
    }
    return undefined;
  }
  
  if (astNode.type === 'ArrayExpression') {
    return astNode.elements.map(astToJson).filter(x => x !== undefined);
  }
  
  if (astNode.type === 'ObjectExpression') {
    const obj = {};
    astNode.properties.forEach(prop => {
      if (prop.type === 'ObjectProperty') {
        const key = prop.key.type === 'Identifier' ? prop.key.name : 
                    (prop.key.type === 'StringLiteral' ? prop.key.value : null);
        if (key) {
          const val = astToJson(prop.value);
          if (val !== undefined) obj[key] = val;
        }
      }
    });
    return Object.keys(obj).length > 0 ? obj : undefined;
  }
  if (astNode.type === 'JSXElement') {
    let name = '';
    if (astNode.openingElement.name.type === 'JSXIdentifier') {
      name = astNode.openingElement.name.name;
    }
    // Only capture if name is an actual Lucide icon (not a Hudbird component like Button, HeroContent etc)
    if (name && LUCIDE_ICON_NAMES.has(name)) {
      let size = 24;
      astNode.openingElement.attributes.forEach(attr => {
        if (attr.type === 'JSXAttribute' && attr.name.name === 'size') {
          if (attr.value && attr.value.type === 'JSXExpressionContainer' && attr.value.expression.type === 'NumericLiteral') {
            size = attr.value.expression.value;
          }
        }
      });
      return { _type: 'LucideIcon', name, size };
    }
    return undefined;
  }
  
  return undefined;
}

// Converts a Babel JSX AST into CanvasNode Blueprint format
function processJsxNode(node, parentId = null) {
  if (node.type === 'JSXElement') {
    let name = '';
    if (node.openingElement.name.type === 'JSXIdentifier') {
      name = node.openingElement.name.name;
    } else if (node.openingElement.name.type === 'JSXMemberExpression') {
      name = `${node.openingElement.name.object.name}.${node.openingElement.name.property.name}`;
    }

    // Only treat as Hudbird component if it's in our known whitelist
    const isHudbird = KNOWN_HUDBIRD_COMPONENTS.has(name);
    let type = name;
    
    // Convert common standard tags to basic canvas nodes if needed, 
    // or wrap them in 'Frame', 'Text' depending on element type.
    if (name === 'div' || name === 'section' || name === 'header' || name === 'nav' || name === 'footer' || name === '' || name === 'ul' || name === 'ol' || name === 'li') {
      type = 'Frame';
    } else if (name === 'a') {
      type = 'Frame'; // links become frames (Canvas doesn't have a link node type)
    } else if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'button'].includes(name)) {
      type = 'Text';
    } else if (isHudbird) {
      // Add Hudbird_ prefix for our custom components if not already
      type = name.startsWith('Hudbird_') ? name : `Hudbird_${name}`;
    } else if (/^[A-Z]/.test(name)) {
      // Unknown capitalized component (e.g. TemplateThemeToggle, Motion.div, etc.) — skip
      return { rootId: null, nodes: {} };
    }

    const id = generateRandomId(name.toLowerCase().replace('.', '_') || 'node');
    const props = {};
    const childrenIds = [];
    const childrenNodes = {};

    // Process Attributes
    node.openingElement.attributes.forEach(attr => {
      if (attr.type === 'JSXAttribute') {
        const propName = attr.name.name;
        if (attr.value === null) {
          props[propName] = true;
        } else if (attr.value.type === 'StringLiteral') {
          props[propName] = attr.value.value;
        } else if (attr.value.type === 'JSXExpressionContainer') {
          const val = astToJson(attr.value.expression);
          if (val !== undefined) {
            props[propName] = val;
          }
        }
      }
    });

    // We collect the text children for Text and Button components
    let textContent = '';

    node.children.forEach(child => {
      if (child.type === 'JSXText') {
        const text = child.value.trim();
        if (text) textContent += text + ' ';
      } else if (child.type === 'JSXElement') {
        const { rootId, nodes } = processJsxNode(child, id);
        if (rootId) {
          childrenIds.push(rootId);
          Object.assign(childrenNodes, nodes);
        }
      } else if (child.type === 'JSXExpressionContainer' && child.expression.type === 'StringLiteral') {
         textContent += child.expression.value + ' ';
      }
    });

    // Capture text children for ALL Hudbird components and text nodes
    // This ensures HeroTitle, HeroDescription, HeroBadge etc. all get their text
    const isHudbirdComponent = type.startsWith('Hudbird_');
    const isTextNode = type === 'Text';
    
    if (textContent.trim() && (isHudbirdComponent || isTextNode)) {
       // Only store as children if there are no structural child nodes (pure text leaf)
       // OR if it's a known text-content component
       if (childrenIds.length === 0) {
         props.children = textContent.trim();
       }
    }

    const nodeData = {
      [id]: {
        id,
        type,
        name,
        parentId,
        props,
        childrenIds,
        responsiveStyles: { base: {} }
      },
      ...childrenNodes
    };

    return { rootId: id, nodes: nodeData };
  }
  return { rootId: null, nodes: {} };
}

async function scrapeDocs() {
  const marketingFiles = fs.readdirSync(BLANK_UI_DOCS_PATH).filter(f => f.endsWith('.tsx'));
  
  const extractedTemplates = [];
  
  for (const file of marketingFiles) {
    const filePath = path.join(BLANK_UI_DOCS_PATH, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const compName = file.replace('Doc.tsx', '');
    
    // Find const [something]Code = `...JSX...`
    const codeMatches = [...content.matchAll(/const\s+([a-zA-Z0-9_]+Code)\s*=\s*`([\s\S]*?)`/g)];
    
    if (codeMatches.length > 0) {
      codeMatches.forEach(match => {
        const variantName = match[1];
        const jsxCode = match[2];
        
        try {
          const ast = parse(jsxCode, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript']
          });

          // Note: In marketing files, jsxCode is just a string snippet. 
          // If variables are outside the string, they won't be in this AST.
          // But let's parse whatever is in the AST just in case.
          currentScope = {};
          traverse(ast, {
            VariableDeclarator(path) {
              if (path.node.id.type === 'Identifier' && path.node.init) {
                currentScope[path.node.id.name] = path.node.init;
              }
            }
          });

          let mainJsx = null;
          traverse(ast, {
            ReturnStatement(path) {
              if (!mainJsx && path.node.argument && path.node.argument.type === 'JSXElement') {
                mainJsx = path.node.argument;
              }
            }
          });

          if (mainJsx) {
             const { rootId, nodes } = processJsxNode(mainJsx, null);
             extractedTemplates.push({
               component: compName,
               variant: variantName.replace('Code', ''),
               rootId,
               nodes
             });
          }
        } catch(e) {
          console.error(`Error parsing ${variantName} in ${file}:`, e.message);
        }
      });
    }
  }

  // Parse 6 Full Templates
  const templateFiles = fs.readdirSync(TEMPLATES_PATH).filter(f => f.endsWith('Template.tsx'));
  const fullTemplates = [];

  for (const file of templateFiles) {
    const filePath = path.join(TEMPLATES_PATH, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const templateName = file.replace('.tsx', '');
    
    try {
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
      });

      currentScope = {};
      traverse(ast, {
        VariableDeclarator(path) {
          if (path.node.id.type === 'Identifier' && path.node.init) {
            currentScope[path.node.id.name] = path.node.init;
          }
        }
      });

      let mainJsx = null;
      traverse(ast, {
        ExportDefaultDeclaration(path) {
           // If it's a function declaration exported as default
           path.traverse({
             ReturnStatement(retPath) {
               if (!mainJsx && retPath.node.argument && (retPath.node.argument.type === 'JSXElement' || retPath.node.argument.type === 'JSXFragment')) {
                  // For fragment, get first element if it's a div
                  if(retPath.node.argument.type === 'JSXFragment' && retPath.node.argument.children.length > 0) {
                     mainJsx = retPath.node.argument.children.find(c => c.type === 'JSXElement');
                  } else {
                     mainJsx = retPath.node.argument;
                  }
               }
             }
           });
        },
        // Fallback if not exported default
        VariableDeclarator(path) {
           if(path.node.id.name === templateName || path.node.id.name === 'Template') {
              path.traverse({
                 ReturnStatement(retPath) {
                   if (!mainJsx && retPath.node.argument && retPath.node.argument.type === 'JSXElement') {
                      mainJsx = retPath.node.argument;
                   }
                 }
              });
           }
        }
      });

      if (mainJsx) {
         const { rootId, nodes } = processJsxNode(mainJsx, null);
         fullTemplates.push({
           component: 'FullTemplates',
           variant: templateName,
           rootId,
           nodes
         });
      }
    } catch(e) {
      console.error(`Error parsing template ${file}:`, e.message);
    }
  }

  // Generate TypeScript File
  let tsOutput = `// AUTO GENERATED FROM BLANK_UI- DOCS\n// @ts-nocheck\nimport { CanvasNode } from '../types/builder';\n\n`;
  tsOutput += `export const hudbirdDocsTemplates: Record<string, { rootNodeId: string, name: string, nodeData: Record<string, CanvasNode> }[]> = {};\n\n`;
  
  // Group by component
  const grouped = {};
  extractedTemplates.forEach(t => {
    if(!grouped[t.component]) grouped[t.component] = [];
    grouped[t.component].push(t);
  });
  
  fullTemplates.forEach(t => {
    if(!grouped[t.component]) grouped[t.component] = [];
    grouped[t.component].push(t);
  });

  Object.entries(grouped).forEach(([comp, templates]) => {
     tsOutput += `hudbirdDocsTemplates['${comp}'] = [\n`;
     templates.forEach(t => {
        tsOutput += `  {\n    name: '${t.variant}',\n    rootNodeId: '${t.rootId}',\n    nodeData: ${JSON.stringify(t.nodes, null, 2)}\n  },\n`;
     });
     tsOutput += `];\n\n`;
  });

  fs.writeFileSync(OUTPUT_FILE, tsOutput);
  console.log('Successfully generated', OUTPUT_FILE);
}

scrapeDocs();
