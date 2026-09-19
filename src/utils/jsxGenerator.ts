import { CanvasNode } from '../types/builder';
import { componentRegistry } from '../registry/ComponentRegistry';

interface GenerateOptions {
  indentLevel?: number;
  indentSize?: number;
}

export function generateJSX(nodeId: string, allNodes: Record<string, CanvasNode>, options: GenerateOptions = {}): string {
  const node = allNodes[nodeId];
  if (!node) return '';

  const indentLevel = options.indentLevel || 0;
  const indentSize = options.indentSize || 2;
  const indent = ' '.repeat(indentLevel * indentSize);

  let type = node.type;
  if (!type || type === 'Layer') type = 'div';
  
  // Format props
  const propsToRender: string[] = [];
  const props = node.props || {};
  
  Object.entries(props).forEach(([key, value]) => {
    // Skip internal or empty props
    if (key === 'className' && !value) return;
    if (key === 'content' && type === 'Text') return; // Handled as children
    if (key === 'text' && type === 'Button') return; // Handled as children
    if (value === undefined || value === null) return;
    
    // Check if it's the default value from componentRegistry
    const def = componentRegistry[type];
    if (def?.defaultProps?.[key] === value) return; // Don't print default props
    
    if (typeof value === 'string') {
      propsToRender.push(`${key}="${value}"`);
    } else if (typeof value === 'boolean') {
      if (value) propsToRender.push(key);
      else propsToRender.push(`${key}={false}`);
    } else {
      propsToRender.push(`${key}={${JSON.stringify(value)}}`);
    }
  });

  const propsString = propsToRender.length > 0 ? ' ' + propsToRender.join(' ') : '';
  const childrenIds = node.childrenIds || [];

  // Special handling for Text/Button content
  let textContent = '';
  if (type === 'Text') {
    textContent = props.content || '';
  } else if (type === 'Button' && childrenIds.length === 0) {
    textContent = props.text || props.content || 'Button';
  }

  // If no children and no text content, self-close
  if (childrenIds.length === 0 && !textContent) {
    return `${indent}<${type}${propsString} />`;
  }

  const openingTag = `${indent}<${type}${propsString}>`;
  const closingTag = `${indent}</${type}>`;

  if (textContent) {
    // If it's just text content, inline it
    return `${openingTag}${textContent.trim()}</${type}>`;
  }

  // Has children
  const childrenJSX = childrenIds
    .map(id => generateJSX(id, allNodes, { ...options, indentLevel: indentLevel + 1 }))
    .filter(Boolean)
    .join('\n');

  return `${openingTag}\n${childrenJSX}\n${closingTag}`;
}

// Generate the full file with imports
export function generateFullJSXFile(nodeId: string, allNodes: Record<string, CanvasNode>): string {
  const jsx = generateJSX(nodeId, allNodes);
  
  // Find all used components to generate imports
  const usedTypes = new Set<string>();
  const traverse = (id: string) => {
    const n = allNodes[id];
    if (!n) return;
    if (n.type && n.type !== 'Layer' && n.type !== 'div' && n.type !== 'Text') {
      usedTypes.add(n.type);
    }
    (n.childrenIds || []).forEach(traverse);
  };
  traverse(nodeId);
  
  const imports: string[] = ["import React from 'react';"];
  
  if (usedTypes.size > 0) {
    imports.push(`import { ${Array.from(usedTypes).join(', ')} } from 'hudbird-ui';`);
  }
  
  return `${imports.join('\n')}\n\nexport default function MyComponent() {\n  return (\n${jsx.split('\n').map(l => '    ' + l).join('\n')}\n  );\n}`;
}
