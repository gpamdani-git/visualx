import React from 'react';

export type UIElementType = 'frame' | 'text' | 'image' | 'button' | 'component';

export interface UIElement {
  id: string;
  type: UIElementType;
  name: string;
  children?: UIElement[];
  styles?: React.CSSProperties;
  content?: string;
  className?: string;
}

export interface Breakpoint {
  id: string;
  name: string;
  width: number;
}
