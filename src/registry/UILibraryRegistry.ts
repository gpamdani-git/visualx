import React from 'react';
import { ComponentDefinition, componentRegistry, getComponentsByCategory } from './ComponentRegistry';
import { CanvasNode } from '../types/builder';

export interface Template {
  id: string;
  name: string;
  componentType: string;
  previewImage?: string;
  createBlueprint: () => { rootNodeId: string, nodeData: Record<string, CanvasNode> };
  icon?: React.ReactNode;
}

export interface Category {
  id: string;
  name: string;
  templates: Template[];
}

export interface BlockSection {
  id: string;
  name: string;
  categories: Category[];
}

export interface Library {
  id: string;
  name: string;
  description?: string;
  version: string;
  author: string;
  isPrebuilt: boolean;
  blockSections: BlockSection[];
}

export const getPrebuiltHudbirdLibrary = (): Library => {
  const categoriesMap = getComponentsByCategory();
  
  // Group by sections for Hudbird
  // We'll map Atom/Molecule to "Components" block section
  // Layout to "Layout" block section
  // Section/Template to "Blocks" block section
  
  const componentCategories: Category[] = [];
  const layoutCategories: Category[] = [];
  const blockCategories: Category[] = [];
  
  Object.entries(categoriesMap).forEach(([catName, comps]) => {
    if (comps.length === 0) return;
    
    const category: Category = {
      id: `cat-${catName.toLowerCase()}`,
      name: catName,
      templates: comps.map(c => ({
        id: `tpl-${c.id}`,
        name: c.name,
        componentType: c.id,
        icon: c.icon,
        createBlueprint: c.createNodeBlueprint
      }))
    };
    
    if (catName === 'Atom' || catName === 'Molecule') {
      componentCategories.push(category);
    } else if (catName === 'Layout') {
      layoutCategories.push(category);
    } else {
      blockCategories.push(category);
    }
  });

  return {
    id: 'hudbird-ui-prebuilt',
    name: 'Hudbird UI (Raw Components)',
    version: '1.0.0',
    author: 'Hudbird',
    isPrebuilt: true,
    blockSections: [
      {
        id: 'sec-components',
        name: 'Components',
        categories: componentCategories
      },
      {
        id: 'sec-layout',
        name: 'Layout',
        categories: layoutCategories
      },
      {
        id: 'sec-blocks',
        name: 'Blocks',
        categories: blockCategories
      }
    ]
  };
};
