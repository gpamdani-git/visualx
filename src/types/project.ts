import { DocumentState } from './builder';

export interface ColorToken {
  id: string;
  name: string; // e.g. "Brand/Primary"
  lightValue: string; // e.g. "linear-gradient(...)" or "#HEX"
  darkValue: string; // e.g. "linear-gradient(...)" or "#HEX"
  type?: 'solid' | 'linear' | 'radial' | 'conic' | 'image';
}

export interface TextToken {
  id: string;
  name: string; // e.g. "Heading 1"
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  lineHeight: string;
  letterSpacing: number;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration?: 'none' | 'underline' | 'line-through';
}

export interface ProjectPage {
  id: string;
  name: string;        // e.g. "Home", "About", "Blog", "Contact", "Coming Soon", "Legal", "404"
  path: string;        // e.g. "/", "/about", "/blog", "/contact", "/coming-soon", "/legal", "/404"
  isHome?: boolean;    // true for Home page (home icon 🏠)
  isDraft?: boolean;   // true if draft page
  folderId?: string | null; // parent folder id if placed in a page folder
  documentState: DocumentState; // AST tree for this page
  updatedAt?: string;
}

export interface PageFolder {
  id: string;
  name: string;        // e.g. "/new-folder"
  isExpanded?: boolean;
  createdAt?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  previewGradient?: string;
  badge?: 'FREE' | 'PRO';
  lastViewed: string;
  lastViewedTimestamp: number;
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
  folderId?: string | null;
  // Multi-page architecture
  activePageId?: string;
  pages?: ProjectPage[];
  pageFolders?: PageFolder[];
  documentState: DocumentState;
  colorTokens?: ColorToken[];
  textTokens?: TextToken[];
  customAssets?: CustomAsset[];
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

export interface CustomAsset {
  id: string;
  name: string;
  nodeData: Record<string, any>;
  rootNodeId: string;
}

export type ViewMode = 'dashboard' | 'editor' | 'vibe' | 'figma';

