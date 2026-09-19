import React from 'react';
import { LayoutTemplate } from 'lucide-react';
import { Library, BlockSection } from './UILibraryRegistry';

/** Recursively regenerate all node IDs so multiple drops don't share the same IDs */
function deepCloneWithFreshIds(
  rootNodeId: string,
  nodeData: Record<string, any>
): { rootNodeId: string; nodeData: Record<string, any> } {
  const idMap: Record<string, string> = {};
  Object.keys(nodeData).forEach(oldId => {
    idMap[oldId] = `node_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
  });
  const newNodeData: Record<string, any> = {};
  Object.entries(nodeData).forEach(([oldId, node]: [string, any]) => {
    const newId = idMap[oldId];
    newNodeData[newId] = {
      ...node,
      id: newId,
      parentId: node.parentId != null ? (idMap[node.parentId] ?? node.parentId) : null,
      childrenIds: (node.childrenIds || []).map((cid: string) => idMap[cid] ?? cid),
    };
  });
  return { rootNodeId: idMap[rootNodeId] ?? rootNodeId, nodeData: newNodeData };
}

export function getMarketingBlocksLibrary(): Library {
  const blockSections: BlockSection[] = [];



  return {
    id: 'marketing-blocks',
    name: 'Marketing Blocks',
    description: 'Prebuilt components',
    isPrebuilt: true,
    version: '1.0',
    author: 'System',
    blockSections
  };
}
