# Hudbird UI Library Editor - Development Plan
**Based on Windframe Architecture Analysis**  
**Reference:** https://windframe.dev/docs  
**Target:** Transform current Hudbird Canvas into a full Hudbird UI Library Editor

---

## Executive Summary

Windframe is a **visual Tailwind CSS builder** with:
1. **Left Sidebar** → Layers + Template Library + UI Library Manager
2. **Canvas** → Visual editing with toolbar (Import, Add Element, Code Switch)
3. **Right Sidebar** → Element Quick Actions + Property Inspector + Styles
4. **UI Library System** → Custom libraries with block sections & categories
5. **JSX Component Import** → Paste JSX → Visual editing

**Current Hudbird Canvas** has similar structure but lacks:
- True UI Library management (categories, versioning, publishing)
- Element Quick Actions on canvas selection
- Live JSX code editor sync
- Component import/export workflow
- Template/Block marketplace structure

---

## Phase 1: UI Library Management System (Week 1-2)

### 1.1 Library Registry & Categories
```
src/registry/UILibraryRegistry.ts
- Library: { id, name, version, author, blocks: BlockSection[] }
- BlockSection: Marketing | Admin | E-Commerce | Custom
- Category: { id, name, blockSection, templates: Template[] }
- Template: { id, name, componentType, jsxCode, previewImage, props }
```

### 1.2 Left Sidebar Restructure
```
LeftSidebar/
├── LibrarySelector.tsx      // Dropdown: Prebuilt / Custom / "Add UI Library"
├── LibraryManager.tsx       // Create/Edit/Delete libraries & categories
├── CategoryTree.tsx         // Nested: BlockSection > Categories > Templates
├── LayerPanel.tsx           // Existing + Library template drag source
└── TemplateCard.tsx         // Preview + drag-to-canvas
```

### 1.3 Hudbird Prebuilt Library
- Auto-generate from `ComponentRegistry` (54 visible components)
- Group by Category: Atoms, Molecules, Sections
- Each component = Template with defaultProps + propControls

### 1.4 Custom Library Persistence
- localStorage / IndexedDB for user libraries
- Export/Import .json library files

---

## Phase 2: Canvas Element Quick Actions (Week 2-3)

### 2.1 Quick Action Bar (on element select)
```
CanvasQuickActions.tsx
- Position: floating near selected element
- Actions: Delete, Duplicate, Export Code, Move Up/Down, Drag, Ask AI
- Hudbird-specific: "Edit Variants", "Convert to Native", "Extract Component"
```

### 2.2 Integration with DnD
- Show on `selectedNodeId` change
- Hide on canvas click / escape
- Keyboard shortcuts (Del, Cmd+D, etc.)

---

## Phase 3: Right Sidebar Property Inspector Enhancement (Week 3-4)

### 3.1 Unified Property Tabs
```
RightSidebar/
├── Tabs: [Design] [Layout] [Style] [Advanced] [Code]
├── Design: Hudbird variant props (variant, color, size, radius, icon)
├── Layout: Flex/Grid/Gap/Padding/Margin (existing responsiveStyles)
├── Style: Typography, Background, Border, Effects (existing)
├── Advanced: Accessibility, Custom CSS, CSS Variables
├── Code: Live JSX editor (read-only preview + copy)
```

### 3.2 Hudbird Variant Controls
- Auto-generate from `propControls` in registry
- Select: dropdown with preview swatches
- Color: swatch picker + Hudbird semantic colors
- Size/Radius: segmented control

### 3.3 Live JSX Preview
- Read-only generated JSX for selected node
- Sync with property changes (debounced)
- "Copy JSX" button

---

## Phase 4: Live Code Editor & Sync (Week 4-5)

### 4.1 Canvas Toolbar (Top of Canvas)
```
CanvasToolbar.tsx
- Import: HTML/JSX/Tailwind Config
- Add Element: Native + Hudbird atoms
- Code Switch: Visual ↔ JSX Editor (split view)
- Export: React/HTML/Tailwind
- Preview Toggle
```

### 4.2 JSX Code Editor Panel
```
CodeEditorPanel.tsx
- Monaco Editor / CodeMirror
- Two-way sync: Canvas ↔ Code
- Error highlighting
- Format on save (Prettier)
- Hudbird import auto-insert
```

### 4.3 Import Workflow
```
ImportModal.tsx
- Tabs: [HTML] [JSX] [Tailwind Config] [CSS] [JS]
- Paste → Parse → Generate ComponentRegistry entry → Add to Custom Library
- JSX: babel-standalone transform → extract component + props
```

---

## Phase 5: Template/Block System (Week 5-6)

### 5.1 Block Templates (Marketing/Admin/E-Commerce)
- Pre-built pages: Hero, Features, Pricing, Footer, etc.
- Each = Compound blueprint (already have 6)
- Thumbnail preview in sidebar

### 5.2 Custom Template Creation
- Select nodes → "Save as Template"
- Auto-extract props interface
- Add to Custom Library category

### 5.3 Snippet Library
- Reusable sub-components (Button groups, Form fields, etc.)
- Searchable, taggable

---

## Phase 6: AI Integration (Week 6-7)

### 6.1 Ask AI (Element Quick Action)
- Predefined prompts: "Center this", "Make responsive", "Apply dark mode"
- Custom prompt input
- Stream response → apply to node props/styles

### 6.2 AI Design Generation
- Prompt → Full page/layout
- Uses Hudbird components + Tailwind
- Iterative refinement chat

---

## Phase 7: Multi-page & Publishing (Week 7-8)

### 7.1 Project Structure
- Pages tree (Home, About, Contact, etc.)
- Subpages support
- Shared layouts (Navbar, Footer)

### 7.2 Export & Publish
- Export: ZIP (React + Vite + Tailwind)
- Publish: Netlify/Vercel integration
- Preview URL generation

---

## Technical Architecture

### State Management
```
builderStore (Zustand + Immer)
├── canvas: nodes, selection, zoom, pan
├── libraries: prebuilt, custom, activeLibrary
├── editor: activeTab, codeView, quickActions
├── project: pages, currentPage, settings
└── history: undo/redo (zundo)
```

### Component Registry (Single Source of Truth)
```
ComponentDefinition {
  id, name, category, icon
  defaultProps, propControls
  inlineEditProp, isHudbird
  render, createNodeBlueprint
  // NEW:
  jsxTemplate: string  // for code generation
  importPath: string   // './hudbird-ui'
  exportName: string   // 'Button'
  variantProps: string[]  // ['variant', 'color', 'size', 'radius']
}
```

### Data Flow
```
Drag Template → createNodeBlueprint() → insertAsset() → Canvas Node
                                      ↓
                              RightSidebar reads propControls
                                      ↓
                              User edits → updateNodeProps()
                                      ↓
                              CodeEditor generates JSX from node
                                      ↓
                              Export serializes project
```

---

## Hudbird-Specific Advantages to Leverage

1. **Variant System** → Native dropdown controls with preview
2. **32 Color Palette** → Semantic color picker (Primary/Success/Warning...)
3. **Compound Components** → Blueprint-aware (Accordion→Items, Tabs→List/Panels)
3. **Tailwind v4 Theme** → CSS variables auto-injected
4. **Responsive Styles** → Mobile/Tablet/Desktop breakpoints native

---

## Migration Checklist from Current State

| Feature | Current | Target | Effort |
|---------|---------|--------|--------|
| Component Registry | ✅ 54 comps | ✅ + jsxTemplate/importPath | Low |
| Canvas DnD | ✅ | ✅ + Quick Actions | Medium |
| Property Panel | ✅ Basic | ✅ Tabs + Variant UI + Code | Medium |
| Layers Panel | ✅ | ✅ + Library Tree | Low |
| Code Export | ✅ React/HTML | ✅ Live Sync + JSX Editor | High |
| UI Library | ❌ | ✅ Registry + Categories | Medium |
| JSX Import | ❌ | ✅ Babel Transform | High |
| AI Assistant | ❌ | ✅ Quick Action + Chat | Medium |

---

## Recommended Implementation Order

1. **Week 1**: UILibraryRegistry + LeftSidebar restructure (Library Selector + Category Tree)
2. **Week 2**: Hudbird Prebuilt Library population + Custom Library CRUD
3. **Week 3**: Canvas Quick Actions + RightSidebar Tab System
4. **Week 4**: Hudbird Variant Controls (auto-generated) + Live JSX Preview
5. **Week 5**: Canvas Toolbar + Monaco Code Editor + Two-way Sync
6. **Week 6**: Import Modal (JSX/HTML) + Template Save-as
7. **Week 7**: AI Quick Action + AI Chat Panel
8. **Week 8**: Multi-page + Export/Publish + Polish

---

## Key Files to Create/Modify

### New Files
```
src/registry/UILibraryRegistry.ts
src/components/LeftSidebar/LibrarySelector.tsx
src/components/LeftSidebar/CategoryTree.tsx
src/components/LeftSidebar/TemplateCard.tsx
src/components/Canvas/CanvasQuickActions.tsx
src/components/Canvas/CanvasToolbar.tsx
src/components/RightSidebar/PropertyTabs.tsx
src/components/RightSidebar/VariantControls.tsx
src/components/RightSidebar/CodePreview.tsx
src/components/CodeEditor/CodeEditorPanel.tsx
src/components/Modals/ImportModal.tsx
src/components/Modals/LibraryManagerModal.tsx
src/utils/jsxParser.ts
src/utils/codeGenerator.ts
```

### Modify Existing
```
src/registry/ComponentRegistry.tsx  // add jsxTemplate, importPath, exportName
src/components/LeftSidebar.tsx      // restructure: Library + Layers + Templates
src/components/RightSidebar.tsx     // tab system, variant controls
src/components/BreakpointViewport.tsx  // Quick Actions integration
src/components/CanvasArea.tsx       // CanvasToolbar mount
src/store/builderStore.ts           // libraries, activeLibrary, editor state
```

---

## Success Metrics

- [ ] Drag any Hudbird component → canvas → full variant controls in <2 clicks
- [ ] Select element → Quick Action bar appears → "Export Code" copies valid JSX
- [ ] Edit property → Code preview updates in <100ms
- [ ] Paste JSX → Component appears in Custom Library → draggable to canvas
- [ ] "Ask AI" → modifies selected element correctly
- [ ] Export → runs `npm run build` without errors
- [ ] Lint + TypeScript clean across all new code

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| JSX parsing complexity | Use `@babel/standalone` + strict schema validation |
| Two-way sync conflicts | Single source of truth = builderStore nodes; code = derived |
| Performance with 100+ components | Virtualize sidebar lists; memoize prop controls |
| Tailwind v4 CSS variable conflicts | Isolate preview iframe; use `@theme` correctly |
| Compound component blueprints | Test each: Accordion, Tabs, Card, Navbar, Pricing |

---

## Next Immediate Steps

1. **Create `UILibraryRegistry.ts`** with TypeScript types
2. **Add `jsxTemplate`/`importPath`** to Button registry entry as pilot
3. **Build `LibrarySelector`** dropdown in LeftSidebar
4. **Wire `CanvasQuickActions`** to selection state
5. **Add "Design" tab** to RightSidebar with auto-generated variant controls

This plan transforms the current Hudbird Canvas from a "canvas with Hudbird components" into a **purpose-built Hudbird UI Library Editor** matching Windframe's capabilities while leveraging Hudbird's unique variant system and compound component architecture.