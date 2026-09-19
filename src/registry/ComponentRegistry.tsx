import React from 'react';
import { CanvasNode, defaultStyle } from '../types/builder';

export type ComponentCategory = 'Atom' | 'Molecule' | 'Section' | 'Template' | 'Layout';
export type PropControlType = 'string' | 'number' | 'boolean' | 'select' | 'object' | 'list';

export interface PropControl {
  type: PropControlType;
  options?: string[]; // for select
  label?: string;
}

export interface ComponentDefinition {
  id: string;
  name: string;
  category: ComponentCategory;
  hidden?: boolean;
  icon: React.ReactNode;
  defaultProps: Record<string, any>;
  propControls?: Record<string, PropControl>;
  defaultStyles?: Record<string, any>;
  onPropChange?: (node: CanvasNode, propKey: string, newValue: any) => Partial<CanvasNode> | void;
  inlineEditProp?: string;
  isStrictWrapper?: boolean;
  render: (props: any, children?: React.ReactNode, editorNodeId?: string) => React.JSX.Element;
  createNodeBlueprint: () => { rootNodeId: string, nodeData: Record<string, CanvasNode> };
}

export const componentRegistry: Record<string, ComponentDefinition> = {};

export function registerComponent(def: ComponentDefinition) {
  componentRegistry[def.id] = def;
}

export const getComponentsByCategory = () => {
  const categorized: Record<ComponentCategory, ComponentDefinition[]> = {
    Atom: [], Molecule: [], Section: [], Template: [], Layout: []
  };
  Object.values(componentRegistry).forEach(def => {
    if (!def.hidden && categorized[def.category]) {
      categorized[def.category].push(def);
    }
  });
  return categorized;
};
