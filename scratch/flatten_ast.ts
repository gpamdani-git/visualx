import fs from 'fs';
import path from 'path';

// Using dynamic import so tsx compiles the imported file on the fly
import { hudbirdDocsTemplates } from '../src/registry/hudbirdDocsTemplates';

function flattenNode(node: any, flatMap: any) {
  if (!node || !node.id) return;
  
  // Copy the node without its nested children objects
  const flatNode = { ...node };
  
  // Check if there are any keys in the node that look like child IDs
  const keysToRemove: string[] = [];
  
  if (flatNode.childrenIds) {
    flatNode.childrenIds.forEach((childId: string) => {
      if (flatNode[childId]) {
        // Flatten it
        flattenNode(flatNode[childId], flatMap);
        keysToRemove.push(childId);
      }
    });
  }
  
  keysToRemove.forEach(k => delete flatNode[k]);
  
  flatMap[flatNode.id] = flatNode;
}

// Iterate over all categories
for (const category of Object.keys(hudbirdDocsTemplates)) {
  const blocks = hudbirdDocsTemplates[category];
  for (const block of blocks) {
    if (!block || !block.nodeData) continue;
    
    const newFlatData: any = {};
    const rootNode = block.nodeData[block.rootNodeId];
    
    if (rootNode) {
      flattenNode(rootNode, newFlatData);
    } else {
      // If rootNode is undefined, maybe it's already flat? Or rootNodeId is wrong?
      // Just copy it over if it exists
      for (const key of Object.keys(block.nodeData)) {
         newFlatData[key] = block.nodeData[key];
      }
    }
    
    block.nodeData = newFlatData;
  }
}

const filePath = path.join(process.cwd(), 'src/registry/hudbirdDocsTemplates.ts');

let outputTS = `import { CanvasNode } from '../types/builder';\n\nexport const hudbirdDocsTemplates: Record<string, any[]> = {};\n\n`;

for (const category of Object.keys(hudbirdDocsTemplates)) {
  const stringified = JSON.stringify(hudbirdDocsTemplates[category], null, 2);
  outputTS += `hudbirdDocsTemplates['${category}'] = ${stringified};\n\n`;
}

fs.writeFileSync(filePath, outputTS, 'utf-8');
console.log("Successfully flattened all Hudbird templates!");
