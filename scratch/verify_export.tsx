import { generateReactCode, generateHtmlCode } from '../src/utils/exportUtils';
import { componentRegistry } from '../src/registry/ComponentRegistry';
import { defaultStyle } from '../src/types/builder';

// Build a mini tree: Pricing section blueprint + a Button, mimicking canvas nodes
const btnDef = componentRegistry['Hudbird_Button'];
const pricingDef = componentRegistry['Hudbird_Pricing'];
const btnBp = btnDef.createNodeBlueprint();
await new Promise(r => setTimeout(r, 5)); // avoid Date.now() key collision between blueprints
const pricingBp = pricingDef.createNodeBlueprint();

// Simulate a user edit via properties panel (must not touch registry defaults)
const btnRoot = btnBp.nodeData[btnBp.rootNodeId];
(btnRoot.props as any).color = 'success';
(btnRoot.props as any).children = 'Buy now';
console.log('registry defaults untouched:', JSON.stringify((componentRegistry['Hudbird_Button'] as any).defaultProps));

const nodes: any = { ...btnBp.nodeData, ...pricingBp.nodeData };
const rootId = 'root-test';
nodes[rootId] = {
  id: rootId, type: 'Frame', name: 'Root', parentId: null,
  childrenIds: [btnBp.rootNodeId, pricingBp.rootNodeId], props: {},
  responsiveStyles: { base: { ...defaultStyle } },
};

const reactCode = generateReactCode(nodes, rootId);
console.log('---REACT EXPORT---');
console.log(reactCode.split('\n').slice(0, 25).join('\n'));
console.log('... (total lines:', reactCode.split('\n').length + ')');
if (!reactCode.includes("from './hudbird-ui'")) throw new Error('missing hudbird import');
if (!reactCode.includes('<Button') || !reactCode.includes('color="success"') || !reactCode.includes('Buy now')) throw new Error('button props lost');
if (!reactCode.includes('<PricingSection')) throw new Error('pricing alias wrong');

const htmlCode = generateHtmlCode(nodes, rootId);
if (!htmlCode.includes('Hudbird:Button') || !htmlCode.includes('Hudbird:PricingSection')) throw new Error('html comments missing');
if (!htmlCode.includes('Buy now')) throw new Error('html text lost');
console.log('---HTML EXPORT OK---');
console.log('EXPORT SMOKE PASS');
