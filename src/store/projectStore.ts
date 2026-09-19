import { create } from 'zustand';
import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid';
import { Project, Folder, ViewMode, ProjectPage, PageFolder } from '../types/project';
import { db } from './dbClient';
import { 
  INITIAL_PROJECTS, 
  createBlankDocumentState,
  createScalableDocumentState,
  createMajdDocumentState,
  createHighMemoryDocumentState,
  createDefaultPagesForProject,
  createDefaultPagesForScalable,
  createDefaultPagesForMajd
} from '../data/defaultProjects';
import { DocumentState } from '../types/builder';
import { useBuilderStore } from './builderStore';
import { showToast } from './toastStore';

// Legacy localStorage keys (kept only for reference, no longer used for main storage)
const _LEGACY_STORAGE_KEY = 'canvas_website_builder_projects_v1';

function formatTimeAgo(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    return `Viewed ${Math.max(1, diffMin)}m ago`;
  }
  if (diffHours < 24) {
    return `Viewed ${diffHours}h ago`;
  }
  if (diffDays === 1) {
    return `Viewed 1 day ago`;
  }
  return `Viewed ${diffDays} days ago`;
}

export const DEFAULT_COLOR_TOKENS: import('../types/project').ColorToken[] = [
  { id: 'token-bg', name: 'Background', lightValue: '#ffffff', darkValue: '#0a0a0a', type: 'solid' },
  { id: 'token-ui', name: 'UI', lightValue: '#f4f4f5', darkValue: '#141414', type: 'solid' },
  { id: 'token-ui2', name: 'UI 2', lightValue: '#e4e4e7', darkValue: '#1f1f23', type: 'solid' },
  { id: 'token-ui3', name: 'UI 3', lightValue: '#d4d4d8', darkValue: '#27272a', type: 'solid' },
  { id: 'token-heading', name: 'Heading', lightValue: '#09090b', darkValue: '#ffffff', type: 'solid' },
  { id: 'token-text', name: 'Text', lightValue: '#71717a', darkValue: '#a1a1aa', type: 'solid' },
  { id: 'token-border', name: 'Border', lightValue: '#e4e4e7', darkValue: '#27272a', type: 'solid' },
  { id: 'token-accent', name: 'Accent', lightValue: '#0099ff', darkValue: '#0099ff', type: 'solid' },
  { id: 'token-brand-primary', name: 'Brand/Primary', lightValue: '#4f46e5', darkValue: '#6366f1', type: 'solid' },
  { id: 'token-brand-secondary', name: 'Brand/Secondary', lightValue: '#7c3aed', darkValue: '#8b5cf6', type: 'solid' },
  { id: 'token-brand-green-100', name: 'Brand/Success/green-100', lightValue: '#dcfce7', darkValue: '#14532d', type: 'solid' },
  { id: 'token-brand-green-500', name: 'Brand/Success/green-500', lightValue: '#22c55e', darkValue: '#22c55e', type: 'solid' },
  // Hudbird UI semantic colors (match buttonVariants solid + Tailwind v4 theme)
  { id: 'token-hudbird-primary', name: 'Hudbird/Primary', lightValue: '#4f46e5', darkValue: '#6366f1', type: 'solid' },
  { id: 'token-hudbird-secondary', name: 'Hudbird/Secondary', lightValue: '#7c3aed', darkValue: '#8b5cf6', type: 'solid' },
  { id: 'token-hudbird-success', name: 'Hudbird/Success', lightValue: '#059669', darkValue: '#10b981', type: 'solid' },
  { id: 'token-hudbird-info', name: 'Hudbird/Info', lightValue: '#0284c7', darkValue: '#0ea5e9', type: 'solid' },
  { id: 'token-hudbird-warning', name: 'Hudbird/Warning', lightValue: '#d97706', darkValue: '#f59e0b', type: 'solid' },
  { id: 'token-hudbird-destructive', name: 'Hudbird/Destructive', lightValue: '#e11d48', darkValue: '#f43f5e', type: 'solid' },
];

export const DEFAULT_TEXT_TOKENS: import('../types/project').TextToken[] = [
  { id: 'text-h1', name: 'Heading 1', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 36, lineHeight: '1.2', letterSpacing: -0.5 },
  { id: 'text-h2', name: 'Heading 2', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 24, lineHeight: '1.3', letterSpacing: -0.3 },
  { id: 'text-body', name: 'Body', fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 15, lineHeight: '1.6', letterSpacing: 0 },
  { id: 'text-caption', name: 'Caption', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 12, lineHeight: '1.4', letterSpacing: 0 }
];

// Normalize a raw project from DB into the full Project shape
function normalizeProject(p: any): Project {
  let pages = p.pages;
  if (!pages || pages.length === 0) {
    pages = p.id === 'proj-scalable' ? createDefaultPagesForScalable() :
            p.id === 'proj-majd' ? createDefaultPagesForMajd() :
            [{
              id: 'page-home',
              name: 'Home',
              path: '/',
              isHome: true,
              documentState: p.documentState || createBlankDocumentState(p.title)
            }];
  }
  return {
    ...p,
    pages,
    activePageId: p.activePageId || pages[0]?.id,
    pageFolders: p.pageFolders || [],
    colorTokens: p.colorTokens?.length > 0 ? p.colorTokens : DEFAULT_COLOR_TOKENS,
    textTokens:  p.textTokens?.length  > 0 ? p.textTokens  : DEFAULT_TEXT_TOKENS,
    customAssets: p.customAssets || [],
  };
}

// Persist a single project to the backend DB
async function persistProject(project: Project) {
  try { await db.projects.save(project); } catch (e) { console.error('[DB] save project failed', e); }
}

// Persist a single folder to the backend DB
async function persistFolder(folder: Folder) {
  try { await db.folders.save(folder); } catch (e) { console.error('[DB] save folder failed', e); }
}

export type SortFilter = 'last_viewed' | 'alphabetical' | 'oldest' | 'newest';
export type DashboardTab = 'all' | 'archive' | string; // string is folderId

interface ProjectState {
  viewMode: ViewMode;
  isAiPanelOpen: boolean;
  activeProjectId: string | null;
  projects: Project[];
  folders: Folder[];
  currentTab: DashboardTab;
  searchQuery: string;
  sortBy: SortFilter;
  isSaving: boolean;
  lastSavedAt: string | null;
  dbLoaded: boolean;
  loadFromDb: () => Promise<void>;

  // Actions
  setViewMode: (mode: ViewMode) => void;
  setAiPanelOpen: (isOpen: boolean) => void;
  setCurrentTab: (tab: DashboardTab) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: SortFilter) => void;
  
  openProject: (projectId: string) => void;
  goToDashboard: () => void;
  saveActiveProject: (customState?: DocumentState, options?: { showNotification?: boolean }) => void;
  exportProjectJson: (id: string) => void;
  importProjectJson: (jsonString: string) => boolean;
  createProject: (title?: string, templateType?: 'blank' | 'saas' | 'portfolio' | 'minimal') => string;
  duplicateProject: (id: string) => void;
  archiveProject: (id: string) => void;
  unarchiveProject: (id: string) => void;
  deleteProject: (id: string) => void;
  renameProject: (id: string, newTitle: string) => void;
  addFolder: (name: string) => void;
  deleteFolder: (folderId: string) => void;
  moveProjectToFolder: (projectId: string, folderId: string | null) => void;

  // Multi-Page Management Actions
  setActivePage: (pageId: string) => void;
  addPage: (name?: string, path?: string, folderId?: string | null) => string;
  duplicatePage: (pageId: string) => string;
  deletePage: (pageId: string) => void;
  renamePage: (pageId: string, newName: string, newPath?: string) => void;
  setHomePage: (pageId: string) => void;
  togglePageDraft: (pageId: string) => void;
  addPageFolder: (name?: string) => string;
  renamePageFolder: (folderId: string, newName: string) => void;
  deletePageFolder: (folderId: string) => void;
  togglePageFolderExpanded: (folderId: string) => void;
  movePageToFolder: (pageId: string, folderId: string | null) => void;
  sortPagesAlphabetically: (folderId?: string | null) => void;

  // Design Tokens
  addColorToken: (token: Omit<import('../types/project').ColorToken, 'id'>) => string;
  updateColorToken: (id: string, updates: Partial<import('../types/project').ColorToken>) => void;
  deleteColorToken: (id: string) => void;
  
  addTextToken: (token: Omit<import('../types/project').TextToken, 'id'>) => string;
  updateTextToken: (id: string, updates: Partial<import('../types/project').TextToken>) => void;
  deleteTextToken: (id: string) => void;
  
  // Custom Assets
  addCustomAsset: (name: string, rootNodeId: string, nodeData: Record<string, any>) => string;
  deleteCustomAsset: (id: string) => void;
}

export const useProjectStore = create<ProjectState>()((set, get) => ({
  viewMode: 'dashboard',
  isAiPanelOpen: false,
  activeProjectId: null,
  projects: [],
  folders: [],
  currentTab: 'all',
  searchQuery: '',
  sortBy: 'last_viewed',
  isSaving: false,
  lastSavedAt: null,
  dbLoaded: false,
  loadFromDb: async () => {
    console.log('[loadFromDb] START');
    try {
      console.log('[loadFromDb] fetching projects and folders from API...');
      const [dbProjects, dbFolders] = await Promise.all([
        db.projects.getAll(),
        db.folders.getAll()
      ]);
      console.log('[loadFromDb] dbProjects:', dbProjects);
      const projects = dbProjects.map(normalizeProject);
      console.log('[loadFromDb] normalized projects:', projects);
      
      if (projects.length === 0) {
        console.log('[loadFromDb] no projects found, creating initial ones...');
        const initial = INITIAL_PROJECTS.map(normalizeProject);
        console.log('[loadFromDb] initial generated:', initial);
        await Promise.all(initial.map(p => db.projects.save(p)));
        console.log('[loadFromDb] saved initial to DB');
        set({ projects: initial, folders: dbFolders, dbLoaded: true });
      } else {
        set({ projects, folders: dbFolders, dbLoaded: true });
      }
      console.log('[loadFromDb] FINISHED');
    } catch (err) {
      console.error('Failed to load from DB', err);
      set({ dbLoaded: true });
    }
  },

  setViewMode: (mode) => set({ viewMode: mode }),
  setAiPanelOpen: (isOpen) => set({ isAiPanelOpen: isOpen }),
  setCurrentTab: (tab) => set({ currentTab: tab }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sort) => set({ sortBy: sort }),

  openProject: (projectId: string) => {
    const project = get().projects.find(p => p.id === projectId);
    if (!project) return;

    // Ensure pages exist
    let pages = project.pages || [];
    if (pages.length === 0) {
      pages = project.id === 'proj-scalable' ? createDefaultPagesForScalable() :
              project.id === 'proj-majd' ? createDefaultPagesForMajd() :
              [{
                id: 'page-home',
                name: 'Home',
                path: '/',
                isHome: true,
                documentState: project.documentState || createBlankDocumentState(project.title)
              }];
    }

    const activePageId = project.activePageId && pages.some(p => p.id === project.activePageId)
      ? project.activePageId
      : pages[0].id;

    const activePage = pages.find(p => p.id === activePageId) || pages[0];

    // 1. Update project's last viewed
    const now = Date.now();
    const updatedProjects = get().projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          pages,
          activePageId,
          pageFolders: p.pageFolders || [],
          lastViewedTimestamp: now,
          lastViewed: 'Viewed just now',
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });

    // 2. Load active page into builder store
    const docState = activePage.documentState;
    useBuilderStore.setState({
      rootNodeId: docState.rootNodeId,
      nodes: docState.nodes,
      selectedNodeId: null,
      activeBreakpoint: docState.activeBreakpoint || 'lg',
      isPreviewMode: false,
      clipboardNodeId: null,
    });

    set({
      projects: updatedProjects,
      activeProjectId: projectId,
      viewMode: 'editor'
    });

    try {
      updatedProjects.forEach(persistProject);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  goToDashboard: () => {
    // 1. Automatically save current builder state before leaving
    const { activeProjectId } = get();
    if (activeProjectId) {
      get().saveActiveProject(undefined, { showNotification: false });
    }

    set({ viewMode: 'dashboard' });
  },

  saveActiveProject: (customState, options) => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return;

    set({ isSaving: true });

    // Grab current builder store state
    const builderState = useBuilderStore.getState();
    const currentState: DocumentState = customState || {
      rootNodeId: builderState.rootNodeId,
      nodes: builderState.nodes,
      selectedNodeId: builderState.selectedNodeId,
      selectedNodeIds: builderState.selectedNodeIds,
      activeBreakpoint: builderState.activeBreakpoint,
      enabledBreakpoints: builderState.enabledBreakpoints,
      breakpointWidths: builderState.breakpointWidths,
      comments: builderState.comments,
      canvasTheme: builderState.canvasTheme,
      isPreviewMode: false,
      clipboardNodeId: null,
    };

    const now = Date.now();
    let savedTitle = 'Project';
    const updatedProjects = projects.map(p => {
      if (p.id === activeProjectId) {
        savedTitle = p.title;
        const pages = (p.pages || []).map(page => {
          if (page.id === p.activePageId) {
            return {
              ...page,
              documentState: currentState,
              updatedAt: new Date().toISOString()
            };
          }
          return page;
        });

        return {
          ...p,
          pages,
          documentState: currentState,
          updatedAt: new Date().toISOString(),
          lastViewedTimestamp: now,
          lastViewed: 'Viewed just now',
        };
      }
      return p;
    });

    try {
      updatedProjects.forEach(persistProject);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTimeout(() => {
      set({
        projects: updatedProjects,
        isSaving: false,
        lastSavedAt: timeStr,
      });
      if (options?.showNotification !== false) {
        showToast(`Saved '${savedTitle}'`, `All changes saved at ${timeStr}`, 'success');
      }
    }, 120);
  },

  createProject: (title = 'Untitled', templateType: 'blank' | 'saas' | 'portfolio' | 'minimal' = 'blank') => {
    const id = 'proj-' + uuidv4().substring(0, 8);
    const now = Date.now();
    let previewGradient = 'bg-gradient-to-b from-[#18181B] to-[#09090B]';

    const { pages, activePageId, pageFolders } = createDefaultPagesForProject(title, templateType);

    if (templateType === 'saas') {
      previewGradient = 'bg-gradient-to-b from-[#0B0B0F] via-[#101018] to-[#0A0A0E]';
    } else if (templateType === 'portfolio') {
      previewGradient = 'bg-gradient-to-b from-[#FAF5F0] to-[#EAE4DC]';
    } else if (templateType === 'minimal') {
      previewGradient = 'bg-[#18181A]';
    }

    const activePage = pages.find(p => p.id === activePageId) || pages[0];
    const newDocState = activePage.documentState;

    const newProject: Project = {
      id,
      title: title || (templateType === 'saas' ? 'Scalable SaaS' : templateType === 'portfolio' ? 'Portfolio' : 'New Project'),
      slug: (title || 'new-project').toLowerCase().replace(/\s+/g, '-'),
      badge: 'FREE',
      lastViewed: 'Viewed just now',
      lastViewedTimestamp: now,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      previewGradient,
      pages,
      activePageId,
      pageFolders,
      documentState: newDocState,
    };

    const updatedProjects = [newProject, ...get().projects];

    // Load into builder
    useBuilderStore.setState({
      rootNodeId: newDocState.rootNodeId,
      nodes: newDocState.nodes,
      selectedNodeId: null,
      activeBreakpoint: 'lg',
      isPreviewMode: false,
      clipboardNodeId: null,
    });

    set({
      projects: updatedProjects,
      activeProjectId: id,
      viewMode: 'editor',
    });

    try {
      updatedProjects.forEach(persistProject);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }

    return id;
  },

  duplicateProject: (id: string) => {
    const project = get().projects.find(p => p.id === id);
    if (!project) return;

    const newId = 'proj-' + uuidv4().substring(0, 8);
    const duplicated: Project = {
      ...JSON.parse(JSON.stringify(project)),
      id: newId,
      title: `${project.title} (copy)`,
      lastViewed: 'Viewed just now',
      lastViewedTimestamp: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedProjects = [duplicated, ...get().projects];
    set({ projects: updatedProjects });

    try {
      updatedProjects.forEach(persistProject);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  archiveProject: (id: string) => {
    const updatedProjects = get().projects.map(p => {
      if (p.id === id) return { ...p, isArchived: true };
      return p;
    });
    set({ projects: updatedProjects });
    try {
      updatedProjects.forEach(persistProject);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  unarchiveProject: (id: string) => {
    const updatedProjects = get().projects.map(p => {
      if (p.id === id) return { ...p, isArchived: false };
      return p;
    });
    set({ projects: updatedProjects });
    try {
      updatedProjects.forEach(persistProject);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  deleteProject: (id: string) => {
    const { activeProjectId, viewMode, projects } = get();
    const updatedProjects = projects.filter(p => p.id !== id);
    db.projects.delete(id).catch(e => console.error(e));

    const isCurrentActive = activeProjectId === id;
    set({
      projects: updatedProjects,
      activeProjectId: isCurrentActive ? null : activeProjectId,
      viewMode: isCurrentActive ? 'dashboard' : viewMode,
    });

    try {
      updatedProjects.forEach(persistProject);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  exportProjectJson: (id: string) => {
    const project = get().projects.find(p => p.id === id);
    if (!project) {
      showToast('Export failed', 'Project not found', 'error');
      return;
    }
    try {
      const exportData = {
        version: 'canvas-export-v1',
        exportedAt: new Date().toISOString(),
        project: {
          ...project,
          badge: project.badge || 'FREE',
        }
      };
      const jsonStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cleanSlug = (project.slug || project.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      a.download = `${cleanSlug}-backup.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Project Exported', `Downloaded '${project.title}' as JSON backup`, 'success');
    } catch (e) {
      console.error('Project export failed:', e);
      showToast('Export error', 'Could not export project data', 'error');
    }
  },

  importProjectJson: (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      const rawProject = parsed.project || parsed;
      if (!rawProject || (!rawProject.title && !rawProject.name)) {
        showToast('Invalid file', 'The uploaded file is not a valid Canvas project JSON', 'error');
        return false;
      }

      const newId = 'proj-' + uuidv4().substring(0, 8);
      const now = Date.now();
      const title = rawProject.title || rawProject.name || 'Imported Project';

      let pages = rawProject.pages;
      if (!Array.isArray(pages) || pages.length === 0) {
        pages = [{
          id: 'page-home',
          name: 'Home',
          path: '/',
          isHome: true,
          documentState: rawProject.documentState || createBlankDocumentState(title)
        }];
      }

      const newProject: Project = {
        ...rawProject,
        id: newId,
        title: `${title} (Imported)`,
        slug: (title + '-imported').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastViewedTimestamp: now,
        lastViewed: 'Viewed just now',
        pages,
        activePageId: pages[0].id,
        documentState: pages[0].documentState,
        colorTokens: rawProject.colorTokens && rawProject.colorTokens.length > 0 ? rawProject.colorTokens : DEFAULT_COLOR_TOKENS,
        textTokens: rawProject.textTokens && rawProject.textTokens.length > 0 ? rawProject.textTokens : DEFAULT_TEXT_TOKENS,
        customAssets: rawProject.customAssets || [],
        isArchived: false,
      };

      const updated = [newProject, ...get().projects];
      set({ projects: updated });
      try {
        updated.forEach(persistProject);
      } catch (e) {
        console.warn('Storage save failed:', e);
      }

      showToast('Project Imported', `Successfully imported '${newProject.title}'`, 'success');
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      showToast('Import error', 'Could not parse project JSON file', 'error');
      return false;
    }
  },

  renameProject: (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    const updatedProjects = get().projects.map(p => {
      if (p.id === id) {
        return {
          ...p,
          title: newTitle.trim(),
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });
    set({ projects: updatedProjects });
    try {
      updatedProjects.forEach(persistProject);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  addFolder: (name: string) => {
    if (!name.trim()) return;
    const newFolder: Folder = {
      id: 'folder-' + uuidv4().substring(0, 8),
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };
    const updatedFolders = [...get().folders, newFolder];
    set({ folders: updatedFolders });
    try {
      updatedFolders.forEach(persistFolder);
    } catch (e) {
      console.warn('Folder save failed:', e);
    }
  },

  deleteFolder: (folderId: string) => {
    const updatedFolders = get().folders.filter(f => f.id !== folderId);
    // Unassign projects in this folder
    const updatedProjects = get().projects.map(p => {
      if (p.folderId === folderId) return { ...p, folderId: null };
      return p;
    });
    set({ folders: updatedFolders, projects: updatedProjects, currentTab: 'all' });
    try {
      updatedFolders.forEach(persistFolder);
      updatedProjects.forEach(persistProject);
    } catch (e) {
      console.warn('Delete folder failed:', e);
    }
  },

  moveProjectToFolder: (projectId: string, folderId: string | null) => {
    const updatedProjects = get().projects.map(p => {
      if (p.id === projectId) return { ...p, folderId };
      return p;
    });
    set({ projects: updatedProjects });
    try {
      updatedProjects.forEach(persistProject);
    } catch (e) {
      console.warn('Move to folder failed:', e);
    }
  },

  // Multi-Page Management Implementation
  setActivePage: (pageId: string) => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return;

    const project = projects.find(p => p.id === activeProjectId);
    if (!project) return;

    const pages = project.pages || [];
    const targetPage = pages.find(p => p.id === pageId);
    if (!targetPage) return;

    // 1. Snapshot current builder state to current active page
    const builderState = useBuilderStore.getState();
    const currentDocState: DocumentState = {
      rootNodeId: builderState.rootNodeId,
      nodes: builderState.nodes,
      selectedNodeId: null,
      activeBreakpoint: builderState.activeBreakpoint,
      isPreviewMode: false,
      clipboardNodeId: null,
    };

    const updatedProjects = projects.map(p => {
      if (p.id === activeProjectId) {
        const updatedPages = (p.pages || []).map(pg => {
          if (pg.id === p.activePageId) {
            return { ...pg, documentState: currentDocState };
          }
          return pg;
        });

        return {
          ...p,
          pages: updatedPages,
          activePageId: pageId,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });

    // 2. Load target page AST into builderStore
    const targetDoc = targetPage.documentState;
    useBuilderStore.setState({
      rootNodeId: targetDoc.rootNodeId,
      nodes: targetDoc.nodes,
      selectedNodeId: null,
      activeBreakpoint: targetDoc.activeBreakpoint || 'lg',
      isPreviewMode: false,
      clipboardNodeId: null,
    });

    set({ projects: updatedProjects });

    try {
      updatedProjects.forEach(persistProject);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  addPage: (name = '/page', path, folderId = null) => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return '';

    const pageId = 'page-' + uuidv4().substring(0, 8);
    const formattedName = name.startsWith('/') ? name : (name === 'Home' ? 'Home' : `/${name}`);
    const formattedPath = path || (formattedName === 'Home' ? '/' : formattedName);

    const newDocState = createBlankDocumentState(formattedName);

    const newPage: ProjectPage = {
      id: pageId,
      name: formattedName,
      path: formattedPath,
      folderId,
      documentState: newDocState,
      updatedAt: new Date().toISOString()
    };

    // Save current page state first
    const builderState = useBuilderStore.getState();
    const currentDocState: DocumentState = {
      rootNodeId: builderState.rootNodeId,
      nodes: builderState.nodes,
      selectedNodeId: null,
      activeBreakpoint: builderState.activeBreakpoint,
      isPreviewMode: false,
      clipboardNodeId: null,
    };

    const updatedProjects = projects.map(p => {
      if (p.id === activeProjectId) {
        const currentPages = (p.pages || []).map(pg => {
          if (pg.id === p.activePageId) {
            return { ...pg, documentState: currentDocState };
          }
          return pg;
        });

        return {
          ...p,
          pages: [...currentPages, newPage],
          activePageId: pageId,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });

    // Set builder to new page
    useBuilderStore.setState({
      rootNodeId: newDocState.rootNodeId,
      nodes: newDocState.nodes,
      selectedNodeId: null,
      activeBreakpoint: 'lg',
      isPreviewMode: false,
      clipboardNodeId: null,
    });

    set({ projects: updatedProjects });

    try {
      updatedProjects.forEach(persistProject);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }

    return pageId;
  },

  duplicatePage: (pageId: string) => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return '';

    const project = projects.find(p => p.id === activeProjectId);
    if (!project) return '';

    const pageToDup = (project.pages || []).find(p => p.id === pageId);
    if (!pageToDup) return '';

    // Snapshot if duplicating current active page
    let dupDocState: DocumentState;
    if (project.activePageId === pageId) {
      const bState = useBuilderStore.getState();
      dupDocState = JSON.parse(JSON.stringify({
        rootNodeId: bState.rootNodeId,
        nodes: bState.nodes,
        selectedNodeId: null,
        activeBreakpoint: bState.activeBreakpoint,
        isPreviewMode: false,
        clipboardNodeId: null,
      }));
    } else {
      dupDocState = JSON.parse(JSON.stringify(pageToDup.documentState));
    }

    const newPageId = 'page-' + uuidv4().substring(0, 8);
    const newPage: ProjectPage = {
      id: newPageId,
      name: `${pageToDup.name}-copy`,
      path: `${pageToDup.path}-copy`,
      folderId: pageToDup.folderId || null,
      documentState: dupDocState,
      updatedAt: new Date().toISOString()
    };

    const targetIdx = (project.pages || []).findIndex(p => p.id === pageId);
    const newPages = [...(project.pages || [])];
    newPages.splice(targetIdx + 1, 0, newPage);

    const updatedProjects = projects.map(p => {
      if (p.id === activeProjectId) {
        return {
          ...p,
          pages: newPages,
          activePageId: newPageId,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });

    useBuilderStore.setState({
      rootNodeId: dupDocState.rootNodeId,
      nodes: dupDocState.nodes,
      selectedNodeId: null,
      activeBreakpoint: 'lg',
      isPreviewMode: false,
      clipboardNodeId: null,
    });

    set({ projects: updatedProjects });

    try {
      updatedProjects.forEach(persistProject);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }

    return newPageId;
  },

  deletePage: (pageId: string) => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return;

    const project = projects.find(p => p.id === activeProjectId);
    if (!project || !project.pages || project.pages.length <= 1) return; // Prevent deleting only page

    const remainingPages = project.pages.filter(p => p.id !== pageId);
    let nextActiveId = project.activePageId;

    if (project.activePageId === pageId) {
      nextActiveId = remainingPages[0].id;
      const targetDoc = remainingPages[0].documentState;
      useBuilderStore.setState({
        rootNodeId: targetDoc.rootNodeId,
        nodes: targetDoc.nodes,
        selectedNodeId: null,
        activeBreakpoint: targetDoc.activeBreakpoint || 'lg',
        isPreviewMode: false,
        clipboardNodeId: null,
      });
    }

    const updatedProjects = projects.map(p => {
      if (p.id === activeProjectId) {
        return {
          ...p,
          pages: remainingPages,
          activePageId: nextActiveId,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });

    set({ projects: updatedProjects });

    try {
      updatedProjects.forEach(persistProject);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  renamePage: (pageId: string, newName: string, newPath?: string) => {
    if (!newName.trim()) return;
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return;

    const formattedName = newName.startsWith('/') || newName === 'Home' ? newName.trim() : `/${newName.trim()}`;
    const formattedPath = newPath || (formattedName === 'Home' ? '/' : formattedName);

    const updatedProjects = projects.map(p => {
      if (p.id === activeProjectId) {
        const pages = (p.pages || []).map(pg => {
          if (pg.id === pageId) {
            return {
              ...pg,
              name: formattedName,
              path: formattedPath,
              updatedAt: new Date().toISOString()
            };
          }
          return pg;
        });
        return { ...p, pages, updatedAt: new Date().toISOString() };
      }
      return p;
    });

    set({ projects: updatedProjects });

    try {
      updatedProjects.forEach(persistProject);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  setHomePage: (pageId: string) => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return;

    const updatedProjects = projects.map(p => {
      if (p.id === activeProjectId) {
        const pages = (p.pages || []).map(pg => {
          if (pg.id === pageId) {
            return { ...pg, isHome: true, name: 'Home', path: '/' };
          }
          return { ...pg, isHome: false };
        });
        return { ...p, pages, updatedAt: new Date().toISOString() };
      }
      return p;
    });

    set({ projects: updatedProjects });

    try {
      updatedProjects.forEach(persistProject);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  togglePageDraft: (pageId: string) => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return;

    const updatedProjects = projects.map(p => {
      if (p.id === activeProjectId) {
        const pages = (p.pages || []).map(pg => {
          if (pg.id === pageId) {
            return { ...pg, isDraft: !pg.isDraft };
          }
          return pg;
        });
        return { ...p, pages, updatedAt: new Date().toISOString() };
      }
      return p;
    });

    set({ projects: updatedProjects });

    try {
      updatedProjects.forEach(persistProject);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  addPageFolder: (name = '/new-folder') => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return '';

    const folderId = 'pfolder-' + uuidv4().substring(0, 8);
    const formattedName = name.startsWith('/') ? name : `/${name}`;

    const newFolder: PageFolder = {
      id: folderId,
      name: formattedName,
      isExpanded: true,
      createdAt: new Date().toISOString(),
    };

    const updatedProjects = projects.map(p => {
      if (p.id === activeProjectId) {
        const pageFolders = [...(p.pageFolders || []), newFolder];
        return { ...p, pageFolders, updatedAt: new Date().toISOString() };
      }
      return p;
    });

    set({ projects: updatedProjects });

    try {
      updatedProjects.forEach(persistProject);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }

    return folderId;
  },

  renamePageFolder: (folderId: string, newName: string) => {
    if (!newName.trim()) return;
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return;

    const formattedName = newName.startsWith('/') ? newName.trim() : `/${newName.trim()}`;

    const updatedProjects = projects.map(p => {
      if (p.id === activeProjectId) {
        const pageFolders = (p.pageFolders || []).map(f => {
          if (f.id === folderId) {
            return { ...f, name: formattedName };
          }
          return f;
        });
        return { ...p, pageFolders, updatedAt: new Date().toISOString() };
      }
      return p;
    });

    set({ projects: updatedProjects });

    try {
      updatedProjects.forEach(persistProject);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  deletePageFolder: (folderId: string) => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return;

    const updatedProjects = projects.map(p => {
      if (p.id === activeProjectId) {
        const pageFolders = (p.pageFolders || []).filter(f => f.id !== folderId);
        // Un-nest pages inside this folder
        const pages = (p.pages || []).map(pg => {
          if (pg.folderId === folderId) {
            return { ...pg, folderId: null };
          }
          return pg;
        });
        return { ...p, pageFolders, pages, updatedAt: new Date().toISOString() };
      }
      return p;
    });

    set({ projects: updatedProjects });

    try {
      updatedProjects.forEach(persistProject);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  togglePageFolderExpanded: (folderId: string) => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return;

    const updatedProjects = projects.map(p => {
      if (p.id === activeProjectId) {
        const pageFolders = (p.pageFolders || []).map(f => {
          if (f.id === folderId) {
            return { ...f, isExpanded: f.isExpanded === false ? true : false };
          }
          return f;
        });
        return { ...p, pageFolders };
      }
      return p;
    });

    set({ projects: updatedProjects });

    try {
      updatedProjects.forEach(persistProject);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  movePageToFolder: (pageId: string, folderId: string | null) => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return;

    const updatedProjects = projects.map(p => {
      if (p.id === activeProjectId) {
        const pages = (p.pages || []).map(pg => {
          if (pg.id === pageId) {
            return { ...pg, folderId };
          }
          return pg;
        });
        return { ...p, pages, updatedAt: new Date().toISOString() };
      }
      return p;
    });

    set({ projects: updatedProjects });

    try {
      updatedProjects.forEach(persistProject);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  sortPagesAlphabetically: (folderId = null) => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return;

    const updatedProjects = projects.map(p => {
      if (p.id === activeProjectId) {
        const pages = [...(p.pages || [])];
        pages.sort((a, b) => {
          if (a.isHome) return -1;
          if (b.isHome) return 1;
          return a.name.localeCompare(b.name);
        });
        return { ...p, pages, updatedAt: new Date().toISOString() };
      }
      return p;
    });

    set({ projects: updatedProjects });

    try {
      updatedProjects.forEach(persistProject);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  addColorToken: (tokenData) => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return '';
    const id = `color-${uuidv4()}`;
    const token = { id, ...tokenData };
    
    const updatedProjects = projects.map(p => {
      if (p.id === activeProjectId) {
        const colorTokens = p.colorTokens || [];
        return { ...p, colorTokens: [...colorTokens, token], updatedAt: new Date().toISOString() };
      }
      return p;
    });
    set({ projects: updatedProjects });
    try { updatedProjects.forEach(persistProject); } catch (e) {}
    return id;
  },

  updateColorToken: (id, updates) => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return;
    
    const updatedProjects = projects.map(p => {
      if (p.id === activeProjectId) {
        const colorTokens = (p.colorTokens || []).map(t => t.id === id ? { ...t, ...updates } : t);
        return { ...p, colorTokens, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    set({ projects: updatedProjects });
    try { updatedProjects.forEach(persistProject); } catch (e) {}
  },

  deleteColorToken: (id) => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return;
    
    const updatedProjects = projects.map(p => {
      if (p.id === activeProjectId) {
        const colorTokens = (p.colorTokens || []).filter(t => t.id !== id);
        return { ...p, colorTokens, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    set({ projects: updatedProjects });
    try { updatedProjects.forEach(persistProject); } catch (e) {}
  },

  addTextToken: (tokenData) => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return '';
    const id = `text-${uuidv4()}`;
    const token = { id, ...tokenData };
    
    const updatedProjects = projects.map(p => {
      if (p.id === activeProjectId) {
        const textTokens = p.textTokens || [];
        return { ...p, textTokens: [...textTokens, token], updatedAt: new Date().toISOString() };
      }
      return p;
    });
    set({ projects: updatedProjects });
    try { updatedProjects.forEach(persistProject); } catch (e) {}
    return id;
  },

  updateTextToken: (id, updates) => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return;
    
    const updatedProjects = projects.map(p => {
      if (p.id === activeProjectId) {
        const textTokens = (p.textTokens || []).map(t => t.id === id ? { ...t, ...updates } : t);
        return { ...p, textTokens, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    set({ projects: updatedProjects });
    try { updatedProjects.forEach(persistProject); } catch (e) {}
  },

  addCustomAsset: (name, rootNodeId, nodeData) => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return '';
    const id = `asset-${uuidv4()}`;
    const asset = { id, name, rootNodeId, nodeData };
    
    set({
      projects: projects.map(p => {
        if (p.id === activeProjectId) {
          const customAssets = [...(p.customAssets || []), asset];
          return { ...p, customAssets, updatedAt: new Date().toISOString() };
        }
        return p;
      })
    });
    return id;
  },
  deleteCustomAsset: (id) => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return;
    set({
      projects: projects.map(p => {
        if (p.id === activeProjectId) {
          const customAssets = (p.customAssets || []).filter(a => a.id !== id);
          return { ...p, customAssets, updatedAt: new Date().toISOString() };
        }
        return p;
      })
    });
  },

  deleteTextToken: (id) => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return;
    
    const updatedProjects = projects.map(p => {
      if (p.id === activeProjectId) {
        const textTokens = (p.textTokens || []).filter(t => t.id !== id);
        return { ...p, textTokens, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    set({ projects: updatedProjects });
    try { updatedProjects.forEach(persistProject); } catch (e) {}
  }
}));

