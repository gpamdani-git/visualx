import { CanvasNode, NodeStyleProps } from '../types/builder';

export interface LayoutConflict {
  id: string;
  type: 'grid_flex' | 'size_constraint' | 'position_flow' | 'leaf_layout';
  severity: 'warning' | 'info';
  title: string;
  description: string;
  activePropertyUsed: string;
  ignoredPropertyNotice: string;
  precedenceExplanation: string;
  conflictingKeys: string[];
  precedentKey: string;
  precedentValue: string;
  ignoredProperties: string[];
  resolutionAction?: {
    label: string;
    cleanseStyles: Partial<NodeStyleProps>;
  };
}

/**
 * Detects conflicting and redundant layout properties in a node's effective styles.
 * E.g., both grid and flex properties, min/max dimension collisions, or absolute positioning
 * that overrides parent flex alignment.
 */
export function detectLayoutConflicts(
  node: CanvasNode | null | undefined,
  styles: NodeStyleProps | null | undefined
): LayoutConflict[] {
  if (!node || !styles) return [];
  const conflicts: LayoutConflict[] = [];

  const isExplicitGrid = styles.layoutType === 'Grid' || styles.display === 'grid';
  const isExplicitStack = styles.layoutType === 'Stack' || styles.display === 'flex';

  // 1. Grid vs Flex / Stack Conflict
  // Case A: Element is set to Grid, but has active flex direction / wrap / flex alignment rules
  if (isExplicitGrid) {
    const hasFlexDirection = Boolean(styles.layoutDirection && styles.layoutDirection === 'row');
    const hasFlexWrap = styles.flexWrap === 'wrap';
    const hasFlexProperties = hasFlexDirection || hasFlexWrap;

    if (hasFlexProperties) {
      conflicts.push({
        id: 'grid-overrides-flex',
        type: 'grid_flex',
        severity: 'info',
        title: 'Grid Overrides Flexbox Styles',
        description: 'Both Grid layout and Flexbox direction/wrap properties are applied.',
        activePropertyUsed: `Grid Layout (display: grid, ${styles.gridColumns || 2} columns)`,
        ignoredPropertyNotice: `Flex Direction (${styles.layoutDirection || 'row'}) & Wrap (${styles.flexWrap || 'nowrap'}) are ignored`,
        precedenceExplanation: 'In CSS and Tailwind export, "display: grid" (grid-cols-*) takes precedence over Flexbox. The Grid layout with configured columns and gap will be rendered; flex-direction and flex-wrap will not take effect.',
        conflictingKeys: ['layoutDirection', 'flexWrap', 'layoutType'],
        precedentKey: 'layoutType',
        precedentValue: 'Grid',
        ignoredProperties: [
          hasFlexDirection ? `Direction: ${styles.layoutDirection}` : '',
          hasFlexWrap ? `Wrap: ${styles.flexWrap}` : ''
        ].filter(Boolean),
        resolutionAction: {
          label: 'Clean Inactive Flex Styles',
          cleanseStyles: {
            layoutDirection: 'column',
            flexWrap: 'nowrap'
          }
        }
      });
    }
  }

  // Case B: Element is set to Stack / Flex, but has leftover Grid column/row/masonry tracks
  if (isExplicitStack) {
    const hasGridCols = typeof styles.gridColumns === 'number' && styles.gridColumns > 0;
    const hasGridRows = typeof styles.gridRows === 'number' && styles.gridRows > 0;
    const hasGridMasonry = Boolean(styles.gridMasonry || styles.masonryColumns);
    const hasGridAutoFlow = Boolean(styles.gridAutoFlow);

    if (hasGridCols || hasGridRows || hasGridMasonry || hasGridAutoFlow) {
      conflicts.push({
        id: 'flex-overrides-grid',
        type: 'grid_flex',
        severity: 'info',
        title: 'Stack (Flexbox) Overrides Grid Tracks',
        description: 'Leftover Grid column/row tracks exist while element is in Stack mode.',
        activePropertyUsed: `Flexbox Stack (display: flex, ${styles.layoutDirection === 'row' ? 'Horizontal Row' : 'Vertical Column'})`,
        ignoredPropertyNotice: `Grid Tracks (${hasGridCols ? `${styles.gridColumns} cols` : ''}${hasGridRows ? `, ${styles.gridRows} rows` : ''}) are inactive`,
        precedenceExplanation: 'In CSS and Tailwind export, "display: flex" (flex-row / flex-col) takes precedence. The Flexbox Stack layout will be rendered; grid column and row tracks will be omitted.',
        conflictingKeys: ['gridColumns', 'gridRows', 'gridMasonry', 'gridAutoFlow', 'masonryColumns', 'layoutType'],
        precedentKey: 'layoutType',
        precedentValue: 'Stack (Flexbox)',
        ignoredProperties: [
          hasGridCols ? `Columns (${styles.gridColumns})` : '',
          hasGridRows ? `Rows (${styles.gridRows})` : '',
          hasGridMasonry ? 'Masonry' : '',
          hasGridAutoFlow ? `AutoFlow (${styles.gridAutoFlow})` : ''
        ].filter(Boolean),
        resolutionAction: {
          label: 'Clean Inactive Grid Tracks',
          cleanseStyles: {
            gridColumns: undefined,
            gridRows: undefined,
            gridMasonry: false,
            gridAutoFlow: undefined,
            masonryColumns: undefined
          }
        }
      });
    }
  }

  // 2. Width Min vs Max Constraint Inversion
  if (
    typeof styles.minWidth === 'number' &&
    typeof styles.maxWidth === 'number' &&
    styles.minWidth > styles.maxWidth
  ) {
    conflicts.push({
      id: 'min-width-exceeds-max-width',
      type: 'size_constraint',
      severity: 'warning',
      title: 'Min Width Exceeds Max Width',
      description: `Min Width (${styles.minWidth}px) is set larger than Max Width (${styles.maxWidth}px).`,
      activePropertyUsed: `Min Width: ${styles.minWidth}px (Enforced by W3C CSS)`,
      ignoredPropertyNotice: `Max Width (${styles.maxWidth}px) is overridden`,
      precedenceExplanation: 'According to W3C CSS specifications, "min-width" takes precedence over "max-width". The element width will not shrink below the min-width value.',
      conflictingKeys: ['minWidth', 'maxWidth'],
      precedentKey: 'minWidth',
      precedentValue: `${styles.minWidth}px`,
      ignoredProperties: [`Max Width: ${styles.maxWidth}px`],
      resolutionAction: {
        label: 'Align Max Width with Min Width',
        cleanseStyles: {
          maxWidth: styles.minWidth
        }
      }
    });
  }

  // 3. Height Min vs Max Constraint Inversion
  if (
    typeof styles.minHeight === 'number' &&
    typeof styles.maxHeight === 'number' &&
    styles.minHeight > styles.maxHeight
  ) {
    conflicts.push({
      id: 'min-height-exceeds-max-height',
      type: 'size_constraint',
      severity: 'warning',
      title: 'Min Height Exceeds Max Height',
      description: `Min Height (${styles.minHeight}px) is set larger than Max Height (${styles.maxHeight}px).`,
      activePropertyUsed: `Min Height: ${styles.minHeight}px (Enforced by W3C CSS)`,
      ignoredPropertyNotice: `Max Height (${styles.maxHeight}px) is overridden`,
      precedenceExplanation: 'According to W3C CSS specifications, "min-height" takes precedence over "max-height". The element height will not shrink below the min-height value.',
      conflictingKeys: ['minHeight', 'maxHeight'],
      precedentKey: 'minHeight',
      precedentValue: `${styles.minHeight}px`,
      ignoredProperties: [`Max Height: ${styles.maxHeight}px`],
      resolutionAction: {
        label: 'Align Max Height with Min Height',
        cleanseStyles: {
          maxHeight: styles.minHeight
        }
      }
    });
  }

  // 4. Position Absolute overriding Flex Flow distribution
  if (styles.position === 'absolute' || styles.position === 'fixed') {
    if (styles.alignSelf && styles.alignSelf !== 'auto') {
      conflicts.push({
        id: 'absolute-overrides-alignself',
        type: 'position_flow',
        severity: 'info',
        title: 'Absolute Pinning Overrides Alignment',
        description: `Element has position: ${styles.position} with alignSelf: ${styles.alignSelf}.`,
        activePropertyUsed: `Coordinate Pinning (${styles.position} top/left/right/bottom)`,
        ignoredPropertyNotice: `alignSelf (${styles.alignSelf}) is ignored`,
        precedenceExplanation: 'Absolute and fixed elements are removed from parent layout flow. Coordinate pinning takes precedence over parent flexbox alignment rules.',
        conflictingKeys: ['position', 'alignSelf'],
        precedentKey: 'position',
        precedentValue: styles.position,
        ignoredProperties: [`alignSelf: ${styles.alignSelf}`],
        resolutionAction: {
          label: 'Reset Align Self to Auto',
          cleanseStyles: {
            alignSelf: 'auto'
          }
        }
      });
    }
  }

  // 5. Leaf element with Layout Container styles
  const isLeaf = node.type === 'Text' || node.type === 'Image' || node.type === 'Button';
  const hasNoChildren = !node.childrenIds || node.childrenIds.length === 0;
  if (isLeaf && hasNoChildren && (styles.gridColumns || (styles.layoutType === 'Grid'))) {
    conflicts.push({
      id: 'leaf-node-grid-conflict',
      type: 'leaf_layout',
      severity: 'info',
      title: 'Grid on Leaf Element',
      description: `Grid layout is configured on a leaf element (${node.type}) without children.`,
      activePropertyUsed: `Direct Semantic Element (${node.type})`,
      ignoredPropertyNotice: `Grid container tracks (${styles.gridColumns || 2} cols) are unused`,
      precedenceExplanation: 'During code export, leaf elements render directly as semantic tags (<button/>, <img/>, <span/>) without internal children. Direct styling will be used.',
      conflictingKeys: ['layoutType', 'gridColumns'],
      precedentKey: 'node.type',
      precedentValue: node.type,
      ignoredProperties: ['gridColumns', 'gridRows'],
      resolutionAction: {
        label: 'Remove Inactive Grid Properties',
        cleanseStyles: {
          layoutType: 'Stack',
          gridColumns: undefined,
          gridRows: undefined,
          gridMasonry: false
        }
      }
    });
  }

  return conflicts;
}
