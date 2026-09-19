import { defaultStyle, CanvasNode, DocumentState } from '../types/builder';
import { Project, ProjectPage, PageFolder } from '../types/project';
import { createDominicDocumentState, createDefaultPagesForDominic } from './dominicProject';

// 1. Scalable AST (Dark SaaS Theme)
export const createScalableDocumentState = (): DocumentState => {
  const rootId = 'root-scalable';
  const navId = 'nav-scalable';
  const heroId = 'hero-scalable';
  const heroHeadingId = 'hero-heading-scalable';
  const heroSubId = 'hero-sub-scalable';
  const heroBtnId = 'hero-btn-scalable';
  const previewCardId = 'preview-card-scalable';
  const logosRowId = 'logos-row-scalable';
  const featureBoxId = 'feature-box-scalable';

  const nodes: Record<string, CanvasNode> = {
    [rootId]: {
      id: rootId,
      type: 'Frame',
      name: 'Root Page',
      parentId: null,
      childrenIds: [navId, heroId, previewCardId, logosRowId, featureBoxId],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          backgroundColor: '#09090B',
          padding: { top: 32, right: 32, bottom: 48, left: 32 },
          gap: 32,
          layoutDirection: 'column',
          alignItems: 'center',
        }
      }
    },
    [navId]: {
      id: navId,
      type: 'Frame',
      name: 'Navigation Bar',
      parentId: rootId,
      childrenIds: ['nav-logo', 'nav-links', 'nav-cta'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          layoutDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#121216',
          borderRadius: { tl: 99, tr: 99, br: 99, bl: 99 },
          padding: { top: 10, right: 16, bottom: 10, left: 16 },
          borderColor: '#26262E',
          borderWidth: 1,
        }
      }
    },
    'nav-logo': {
      id: 'nav-logo',
      type: 'Text',
      name: 'Logo Text',
      parentId: navId,
      childrenIds: [],
      props: { text: '✦ Scalable' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fit-content',
          heightType: 'fit-content',
          fontSize: 15,
          fontWeight: 700,
          color: '#FFFFFF',
        }
      }
    },
    'nav-links': {
      id: 'nav-links',
      type: 'Text',
      name: 'Nav Links',
      parentId: navId,
      childrenIds: [],
      props: { text: 'About     Blog     Changelog     Pricing' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fit-content',
          heightType: 'fit-content',
          fontSize: 13,
          fontWeight: 500,
          color: '#9CA3AF',
        }
      }
    },
    'nav-cta': {
      id: 'nav-cta',
      type: 'Button',
      name: 'Book Demo Button',
      parentId: navId,
      childrenIds: [],
      props: { text: 'Book Your Demo' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fit-content',
          heightType: 'fit-content',
          backgroundColor: '#6366F1',
          color: '#FFFFFF',
          borderRadius: { tl: 99, tr: 99, br: 99, bl: 99 },
          padding: { top: 8, right: 16, bottom: 8, left: 16 },
          fontSize: 13,
          fontWeight: 600,
        }
      }
    },
    [heroId]: {
      id: heroId,
      type: 'Frame',
      name: 'Hero Section',
      parentId: rootId,
      childrenIds: [heroHeadingId, heroSubId, heroBtnId],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          layoutDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: { top: 24, right: 16, bottom: 16, left: 16 },
        }
      }
    },
    [heroHeadingId]: {
      id: heroHeadingId,
      type: 'Text',
      name: 'Hero Headline',
      parentId: heroId,
      childrenIds: [],
      props: { text: 'Manage your sales and analytics in one place.' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fit-content',
          heightType: 'fit-content',
          fontSize: 32,
          fontWeight: 700,
          color: '#FFFFFF',
          textAlign: 'center',
        }
      }
    },
    [heroSubId]: {
      id: heroSubId,
      type: 'Text',
      name: 'Hero Subtitle',
      parentId: heroId,
      childrenIds: [],
      props: { text: 'Track custom events, increase form submissions, optimise conversion rates and scale your sales flow with Scalable.' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fit-content',
          heightType: 'fit-content',
          fontSize: 14,
          fontWeight: 400,
          color: '#9CA3AF',
          textAlign: 'center',
        }
      }
    },
    [heroBtnId]: {
      id: heroBtnId,
      type: 'Button',
      name: 'Hero CTA',
      parentId: heroId,
      childrenIds: [],
      props: { text: 'Book Your Demo' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fit-content',
          heightType: 'fit-content',
          backgroundColor: '#6366F1',
          color: '#FFFFFF',
          borderRadius: { tl: 8, tr: 8, br: 8, bl: 8 },
          padding: { top: 12, right: 24, bottom: 12, left: 24 },
          fontSize: 14,
          fontWeight: 600,
        }
      }
    },
    [previewCardId]: {
      id: previewCardId,
      type: 'Frame',
      name: 'Analytics Dashboard Preview',
      parentId: rootId,
      childrenIds: ['stat-1', 'stat-2', 'stat-3'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          backgroundColor: '#13131A',
          borderColor: '#262630',
          borderWidth: 1,
          borderRadius: { tl: 16, tr: 16, br: 16, bl: 16 },
          padding: { top: 20, right: 20, bottom: 20, left: 20 },
          layoutDirection: 'row',
          justifyContent: 'space-between',
          gap: 16,
        }
      }
    },
    'stat-1': {
      id: 'stat-1',
      type: 'Text',
      name: 'Stat MRR',
      parentId: previewCardId,
      childrenIds: [],
      props: { text: 'Total Revenue\n$9,432.25' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          fontSize: 14,
          fontWeight: 600,
          color: '#FFFFFF',
          backgroundColor: '#1C1C24',
          borderRadius: { tl: 10, tr: 10, br: 10, bl: 10 },
          padding: { top: 12, right: 14, bottom: 12, left: 14 },
        }
      }
    },
    'stat-2': {
      id: 'stat-2',
      type: 'Text',
      name: 'Stat ARR',
      parentId: previewCardId,
      childrenIds: [],
      props: { text: 'Total Volume\n$404,585' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          fontSize: 14,
          fontWeight: 600,
          color: '#FFFFFF',
          backgroundColor: '#1C1C24',
          borderRadius: { tl: 10, tr: 10, br: 10, bl: 10 },
          padding: { top: 12, right: 14, bottom: 12, left: 14 },
        }
      }
    },
    'stat-3': {
      id: 'stat-3',
      type: 'Text',
      name: 'Stat Products',
      parentId: previewCardId,
      childrenIds: [],
      props: { text: 'Products Sold\n1,457' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          fontSize: 14,
          fontWeight: 600,
          color: '#FFFFFF',
          backgroundColor: '#1C1C24',
          borderRadius: { tl: 10, tr: 10, br: 10, bl: 10 },
          padding: { top: 12, right: 14, bottom: 12, left: 14 },
        }
      }
    },
    [logosRowId]: {
      id: logosRowId,
      type: 'Text',
      name: 'Brand Partners',
      parentId: rootId,
      childrenIds: [],
      props: { text: 'Amsterdam   •   SAVANNAH   •   MILANO   •   luminous' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fit-content',
          heightType: 'fit-content',
          fontSize: 13,
          fontWeight: 600,
          color: '#6B7280',
          textAlign: 'center',
        }
      }
    },
    [featureBoxId]: {
      id: featureBoxId,
      type: 'Frame',
      name: 'Feature Box',
      parentId: rootId,
      childrenIds: ['feature-title', 'feature-sub'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          backgroundColor: '#121217',
          borderRadius: { tl: 14, tr: 14, br: 14, bl: 14 },
          padding: { top: 20, right: 24, bottom: 20, left: 24 },
          borderColor: '#242430',
          borderWidth: 1,
          layoutDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }
      }
    },
    'feature-title': {
      id: 'feature-title',
      type: 'Text',
      name: 'Feature Title',
      parentId: featureBoxId,
      childrenIds: [],
      props: { text: 'Track the things that matter most to you.' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fit-content',
          heightType: 'fit-content',
          fontSize: 18,
          fontWeight: 700,
          color: '#FFFFFF',
        }
      }
    },
    'feature-sub': {
      id: 'feature-sub',
      type: 'Text',
      name: 'Feature Subtitle',
      parentId: featureBoxId,
      childrenIds: [],
      props: { text: 'From analytics to integrated sales data to report generating, Scalable has it all.' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fit-content',
          heightType: 'fit-content',
          fontSize: 13,
          fontWeight: 400,
          color: '#9CA3AF',
          textAlign: 'center',
        }
      }
    }
  };

  return {
    rootNodeId: rootId,
    nodes,
    selectedNodeId: null,
    activeBreakpoint: 'lg',
    isPreviewMode: false,
    clipboardNodeId: null,
  };
};

// 2. Majd AST (Light Minimalist Portfolio)
export const createMajdDocumentState = (): DocumentState => {
  const rootId = 'root-majd';
  const topPillId = 'top-pill-majd';
  const titleId = 'title-majd';
  const imageBoxId = 'image-box-majd';
  const footerRowId = 'footer-row-majd';

  const nodes: Record<string, CanvasNode> = {
    [rootId]: {
      id: rootId,
      type: 'Frame',
      name: 'Portfolio Page',
      parentId: null,
      childrenIds: [topPillId, titleId, imageBoxId, footerRowId],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fill',
          backgroundColor: '#F3F4F6',
          padding: { top: 32, right: 32, bottom: 32, left: 32 },
          gap: 28,
          layoutDirection: 'column',
          alignItems: 'center',
        }
      }
    },
    [topPillId]: {
      id: topPillId,
      type: 'Text',
      name: 'Header Pill',
      parentId: rootId,
      childrenIds: [],
      props: { text: 'Majd  •  Portfolio' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fit-content',
          heightType: 'fit-content',
          backgroundColor: '#111827',
          color: '#FFFFFF',
          borderRadius: { tl: 99, tr: 99, br: 99, bl: 99 },
          padding: { top: 6, right: 16, bottom: 6, left: 16 },
          fontSize: 13,
          fontWeight: 600,
        }
      }
    },
    [titleId]: {
      id: titleId,
      type: 'Text',
      name: 'Headline',
      parentId: rootId,
      childrenIds: [],
      props: { text: '✦ SOFTWARE\nENGINEER ⚡' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fit-content',
          heightType: 'fit-content',
          fontSize: 36,
          fontWeight: 800,
          color: '#111827',
          textAlign: 'center',
          lineHeight: 1.2,
        }
      }
    },
    [imageBoxId]: {
      id: imageBoxId,
      type: 'Image',
      name: 'Profile Picture',
      parentId: rootId,
      childrenIds: [],
      props: {
        src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
        alt: 'Majd portrait'
      },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fixed',
          widthValue: 180,
          heightType: 'fixed',
          heightValue: 180,
          borderRadius: { tl: 16, tr: 16, br: 16, bl: 16 },
        }
      }
    },
    [footerRowId]: {
      id: footerRowId,
      type: 'Text',
      name: 'Footer Credits',
      parentId: rootId,
      childrenIds: [],
      props: { text: '©2026 • CREATING SINCE 2020 • Use for Free' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fit-content',
          heightType: 'fit-content',
          fontSize: 12,
          fontWeight: 500,
          color: '#6B7280',
          textAlign: 'center',
        }
      }
    }
  };

  return {
    rootNodeId: rootId,
    nodes,
    selectedNodeId: null,
    activeBreakpoint: 'lg',
    isPreviewMode: false,
    clipboardNodeId: null,
  };
};

// 3. High Memory AST (Minimalist Blank Dark Canvas)
export const createHighMemoryDocumentState = (): DocumentState => {
  const rootId = 'root-high-memory';
  const centerLogoId = 'center-logo-hm';

  const nodes: Record<string, CanvasNode> = {
    [rootId]: {
      id: rootId,
      type: 'Frame',
      name: 'Canvas Root',
      parentId: null,
      childrenIds: [centerLogoId],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fill',
          backgroundColor: '#161618',
          padding: { top: 40, right: 40, bottom: 40, left: 40 },
          layoutDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }
      }
    },
    [centerLogoId]: {
      id: centerLogoId,
      type: 'Text',
      name: 'Framer Symbol',
      parentId: rootId,
      childrenIds: [],
      props: { text: '✦' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fit-content',
          heightType: 'fit-content',
          fontSize: 48,
          fontWeight: 800,
          color: '#4B5563',
          textAlign: 'center',
        }
      }
    }
  };

  return {
    rootNodeId: rootId,
    nodes,
    selectedNodeId: null,
    activeBreakpoint: 'lg',
    isPreviewMode: false,
    clipboardNodeId: null,
  };
};

// 4. About Page AST
export const createAboutDocumentState = (): DocumentState => {
  const rootId = 'root-about';
  const headerId = 'header-about';
  const badgeId = 'badge-about';
  const titleId = 'title-about';
  const subId = 'sub-about';
  const statsId = 'stats-about';
  const valuesId = 'values-about';

  const nodes: Record<string, CanvasNode> = {
    [rootId]: {
      id: rootId,
      type: 'Frame',
      name: 'Page',
      parentId: null,
      childrenIds: [headerId, statsId, valuesId],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          backgroundColor: '#09090B',
          padding: { top: 48, right: 32, bottom: 64, left: 32 },
          gap: 36,
          layoutDirection: 'column',
          alignItems: 'center',
        }
      }
    },
    [headerId]: {
      id: headerId,
      type: 'Frame',
      name: 'Hero Section',
      parentId: rootId,
      childrenIds: [badgeId, titleId, subId],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          layoutDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }
      }
    },
    [badgeId]: {
      id: badgeId,
      type: 'Text',
      name: 'About Badge',
      parentId: headerId,
      childrenIds: [],
      props: { text: '✦ ABOUT US' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fit-content',
          heightType: 'fit-content',
          fontSize: 12,
          fontWeight: 600,
          color: '#818CF8',
          backgroundColor: '#1E1B4B',
          borderColor: '#3730A3',
          borderWidth: 1,
          borderRadius: { tl: 99, tr: 99, br: 99, bl: 99 },
          padding: { top: 4, right: 12, bottom: 4, left: 12 },
        }
      }
    },
    [titleId]: {
      id: titleId,
      type: 'Text',
      name: 'Headline',
      parentId: headerId,
      childrenIds: [],
      props: { text: 'We are engineering the future of visual web architecture.' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          fontSize: 32,
          fontWeight: 800,
          color: '#FFFFFF',
          textAlign: 'center',
          lineHeight: 1.25,
        }
      }
    },
    [subId]: {
      id: subId,
      type: 'Text',
      name: 'Story Subtitle',
      parentId: headerId,
      childrenIds: [],
      props: { text: 'Empowering designers and engineers with zero-runtime overhead AST compiling and instantaneous layout rendering.' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          fontSize: 14,
          fontWeight: 400,
          color: '#9CA3AF',
          textAlign: 'center',
        }
      }
    },
    [statsId]: {
      id: statsId,
      type: 'Grid',
      name: 'Stats Grid',
      parentId: rootId,
      childrenIds: ['stat-1', 'stat-2', 'stat-3'],
      props: { columns: 3 },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          display: 'grid',
          gridColumns: 3,
          gap: 16,
          widthType: 'fill',
          heightType: 'fit-content',
        }
      }
    },
    'stat-1': {
      id: 'stat-1',
      type: 'Frame',
      name: 'Stat 100k+',
      parentId: statsId,
      childrenIds: ['stat-val-1', 'stat-lbl-1'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          backgroundColor: '#121216',
          borderColor: '#22222A',
          borderWidth: 1,
          borderRadius: { tl: 12, tr: 12, br: 12, bl: 12 },
          padding: { top: 20, right: 20, bottom: 20, left: 20 },
          layoutDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }
      }
    },
    'stat-val-1': {
      id: 'stat-val-1',
      type: 'Text',
      name: 'Value 100k',
      parentId: 'stat-1',
      childrenIds: [],
      props: { text: '120k+' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 28, fontWeight: 800, color: '#6366F1' }
      }
    },
    'stat-lbl-1': {
      id: 'stat-lbl-1',
      type: 'Text',
      name: 'Label Creators',
      parentId: 'stat-1',
      childrenIds: [],
      props: { text: 'Active Creators' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 12, fontWeight: 500, color: '#9CA3AF' }
      }
    },
    'stat-2': {
      id: 'stat-2',
      type: 'Frame',
      name: 'Stat Uptime',
      parentId: statsId,
      childrenIds: ['stat-val-2', 'stat-lbl-2'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          backgroundColor: '#121216',
          borderColor: '#22222A',
          borderWidth: 1,
          borderRadius: { tl: 12, tr: 12, br: 12, bl: 12 },
          padding: { top: 20, right: 20, bottom: 20, left: 20 },
          layoutDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }
      }
    },
    'stat-val-2': {
      id: 'stat-val-2',
      type: 'Text',
      name: 'Value Uptime',
      parentId: 'stat-2',
      childrenIds: [],
      props: { text: '99.99%' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 28, fontWeight: 800, color: '#10B981' }
      }
    },
    'stat-lbl-2': {
      id: 'stat-lbl-2',
      type: 'Text',
      name: 'Label Uptime',
      parentId: 'stat-2',
      childrenIds: [],
      props: { text: 'System Availability' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 12, fontWeight: 500, color: '#9CA3AF' }
      }
    },
    'stat-3': {
      id: 'stat-3',
      type: 'Frame',
      name: 'Stat Latency',
      parentId: statsId,
      childrenIds: ['stat-val-3', 'stat-lbl-3'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          backgroundColor: '#121216',
          borderColor: '#22222A',
          borderWidth: 1,
          borderRadius: { tl: 12, tr: 12, br: 12, bl: 12 },
          padding: { top: 20, right: 20, bottom: 20, left: 20 },
          layoutDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }
      }
    },
    'stat-val-3': {
      id: 'stat-val-3',
      type: 'Text',
      name: 'Value Latency',
      parentId: 'stat-3',
      childrenIds: [],
      props: { text: '12ms' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 28, fontWeight: 800, color: '#38BDF8' }
      }
    },
    'stat-lbl-3': {
      id: 'stat-lbl-3',
      type: 'Text',
      name: 'Label Latency',
      parentId: 'stat-3',
      childrenIds: [],
      props: { text: 'AST Compile Latency' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 12, fontWeight: 500, color: '#9CA3AF' }
      }
    },
    [valuesId]: {
      id: valuesId,
      type: 'Frame',
      name: 'Mission Card',
      parentId: rootId,
      childrenIds: ['mission-title', 'mission-desc'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          backgroundColor: '#13131A',
          borderColor: '#242430',
          borderWidth: 1,
          borderRadius: { tl: 16, tr: 16, br: 16, bl: 16 },
          padding: { top: 28, right: 28, bottom: 28, left: 28 },
          layoutDirection: 'column',
          gap: 12,
        }
      }
    },
    'mission-title': {
      id: 'mission-title',
      type: 'Text',
      name: 'Mission Title',
      parentId: valuesId,
      childrenIds: [],
      props: { text: 'Our Core Philosophy' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 18, fontWeight: 700, color: '#FFFFFF' }
      }
    },
    'mission-desc': {
      id: 'mission-desc',
      type: 'Text',
      name: 'Mission Description',
      parentId: valuesId,
      childrenIds: [],
      props: { text: 'We believe code and canvas should be unified seamlessly. By maintaining a flat AST dictionary and zero unnecessary canvas re-renders, creators can build complex production-ready experiences with absolute speed.' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 13, fontWeight: 400, color: '#A1A1AA', lineHeight: 1.6 }
      }
    }
  };

  return {
    rootNodeId: rootId,
    nodes,
    selectedNodeId: null,
    activeBreakpoint: 'lg',
    isPreviewMode: false,
    clipboardNodeId: null,
  };
};

// 5. Blog Page AST
export const createBlogDocumentState = (): DocumentState => {
  const rootId = 'root-blog';
  const heroId = 'hero-blog';
  const gridId = 'grid-blog';

  const nodes: Record<string, CanvasNode> = {
    [rootId]: {
      id: rootId,
      type: 'Frame',
      name: 'Page',
      parentId: null,
      childrenIds: [heroId, gridId],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          backgroundColor: '#09090B',
          padding: { top: 48, right: 32, bottom: 64, left: 32 },
          gap: 32,
          layoutDirection: 'column',
        }
      }
    },
    [heroId]: {
      id: heroId,
      type: 'Frame',
      name: 'Blog Header',
      parentId: rootId,
      childrenIds: ['blog-badge', 'blog-title', 'blog-sub'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          layoutDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }
      }
    },
    'blog-badge': {
      id: 'blog-badge',
      type: 'Text',
      name: 'Badge',
      parentId: heroId,
      childrenIds: [],
      props: { text: '✦ ARTICLES & INSIGHTS' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          fontSize: 12,
          fontWeight: 600,
          color: '#60A5FA',
          backgroundColor: '#1E293B',
          borderColor: '#2563EB',
          borderWidth: 1,
          borderRadius: { tl: 99, tr: 99, br: 99, bl: 99 },
          padding: { top: 4, right: 12, bottom: 4, left: 12 },
        }
      }
    },
    'blog-title': {
      id: 'blog-title',
      type: 'Text',
      name: 'Title',
      parentId: heroId,
      childrenIds: [],
      props: { text: 'Latest from our engineering desk' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 32, fontWeight: 800, color: '#FFFFFF', textAlign: 'center' }
      }
    },
    'blog-sub': {
      id: 'blog-sub',
      type: 'Text',
      name: 'Subtitle',
      parentId: heroId,
      childrenIds: [],
      props: { text: 'Tutorials, architecture deep-dives, and performance design patterns.' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 14, fontWeight: 400, color: '#9CA3AF', textAlign: 'center' }
      }
    },
    [gridId]: {
      id: gridId,
      type: 'Grid',
      name: 'Articles Grid',
      parentId: rootId,
      childrenIds: ['post-1', 'post-2'],
      props: { columns: 2 },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          display: 'grid',
          gridColumns: 2,
          gap: 20,
          widthType: 'fill',
          heightType: 'fit-content',
        }
      }
    },
    'post-1': {
      id: 'post-1',
      type: 'Frame',
      name: 'Article Card 1',
      parentId: gridId,
      childrenIds: ['p1-tag', 'p1-title', 'p1-desc', 'p1-btn'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          backgroundColor: '#131318',
          borderColor: '#22222E',
          borderWidth: 1,
          borderRadius: { tl: 12, tr: 12, br: 12, bl: 12 },
          padding: { top: 24, right: 24, bottom: 24, left: 24 },
          layoutDirection: 'column',
          gap: 12,
        }
      }
    },
    'p1-tag': {
      id: 'p1-tag',
      type: 'Text',
      name: 'Tag Architecture',
      parentId: 'post-1',
      childrenIds: [],
      props: { text: 'Architecture • 5 min read' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 11, fontWeight: 600, color: '#818CF8' }
      }
    },
    'p1-title': {
      id: 'p1-title',
      type: 'Text',
      name: 'Post Title',
      parentId: 'post-1',
      childrenIds: [],
      props: { text: 'Building a Zero-Rerender Visual AST in React 18' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 18, fontWeight: 700, color: '#FFFFFF' }
      }
    },
    'p1-desc': {
      id: 'p1-desc',
      type: 'Text',
      name: 'Post Summary',
      parentId: 'post-1',
      childrenIds: [],
      props: { text: 'How flat dictionary state representations eliminate render cascading across complex visual trees.' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 13, fontWeight: 400, color: '#9CA3AF' }
      }
    },
    'p1-btn': {
      id: 'p1-btn',
      type: 'Button',
      name: 'Read More',
      parentId: 'post-1',
      childrenIds: [],
      props: { text: 'Read Article →' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          fontSize: 12,
          fontWeight: 600,
          color: '#6366F1',
          backgroundColor: 'transparent',
          padding: { top: 6, right: 0, bottom: 6, left: 0 },
        }
      }
    },
    'post-2': {
      id: 'post-2',
      type: 'Frame',
      name: 'Article Card 2',
      parentId: gridId,
      childrenIds: ['p2-tag', 'p2-title', 'p2-desc', 'p2-btn'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          backgroundColor: '#131318',
          borderColor: '#22222E',
          borderWidth: 1,
          borderRadius: { tl: 12, tr: 12, br: 12, bl: 12 },
          padding: { top: 24, right: 24, bottom: 24, left: 24 },
          layoutDirection: 'column',
          gap: 12,
        }
      }
    },
    'p2-tag': {
      id: 'p2-tag',
      type: 'Text',
      name: 'Tag Design Systems',
      parentId: 'post-2',
      childrenIds: [],
      props: { text: 'Design Systems • 8 min read' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 11, fontWeight: 600, color: '#34D399' }
      }
    },
    'p2-title': {
      id: 'p2-title',
      type: 'Text',
      name: 'Post Title',
      parentId: 'post-2',
      childrenIds: [],
      props: { text: 'From Figma Tokens to Production CSS-in-JS' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 18, fontWeight: 700, color: '#FFFFFF' }
      }
    },
    'p2-desc': {
      id: 'p2-desc',
      type: 'Text',
      name: 'Post Summary',
      parentId: 'post-2',
      childrenIds: [],
      props: { text: 'A deep dive into modern dynamic styling pipelines that preserve developer ergonomics and execution speed.' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 13, fontWeight: 400, color: '#9CA3AF' }
      }
    },
    'p2-btn': {
      id: 'p2-btn',
      type: 'Button',
      name: 'Read More',
      parentId: 'post-2',
      childrenIds: [],
      props: { text: 'Read Article →' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          fontSize: 12,
          fontWeight: 600,
          color: '#34D399',
          backgroundColor: 'transparent',
          padding: { top: 6, right: 0, bottom: 6, left: 0 },
        }
      }
    }
  };

  return {
    rootNodeId: rootId,
    nodes,
    selectedNodeId: null,
    activeBreakpoint: 'lg',
    isPreviewMode: false,
    clipboardNodeId: null,
  };
};

// 6. Contact Page AST
export const createContactDocumentState = (): DocumentState => {
  const rootId = 'root-contact';
  const cardId = 'card-contact';

  const nodes: Record<string, CanvasNode> = {
    [rootId]: {
      id: rootId,
      type: 'Frame',
      name: 'Page',
      parentId: null,
      childrenIds: [cardId],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          backgroundColor: '#09090B',
          padding: { top: 64, right: 32, bottom: 64, left: 32 },
          layoutDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }
      }
    },
    [cardId]: {
      id: cardId,
      type: 'Frame',
      name: 'Contact Box',
      parentId: rootId,
      childrenIds: ['c-badge', 'c-title', 'c-sub', 'c-email-fld', 'c-msg-fld', 'c-btn'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          backgroundColor: '#121218',
          borderColor: '#242434',
          borderWidth: 1,
          borderRadius: { tl: 16, tr: 16, br: 16, bl: 16 },
          padding: { top: 36, right: 32, bottom: 36, left: 32 },
          layoutDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }
      }
    },
    'c-badge': {
      id: 'c-badge',
      type: 'Text',
      name: 'Badge',
      parentId: cardId,
      childrenIds: [],
      props: { text: '✦ GET IN TOUCH' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          fontSize: 12,
          fontWeight: 600,
          color: '#F43F5E',
          backgroundColor: '#3F121C',
          borderColor: '#881337',
          borderWidth: 1,
          borderRadius: { tl: 99, tr: 99, br: 99, bl: 99 },
          padding: { top: 4, right: 12, bottom: 4, left: 12 },
        }
      }
    },
    'c-title': {
      id: 'c-title',
      type: 'Text',
      name: 'Title',
      parentId: cardId,
      childrenIds: [],
      props: { text: "Let's build something exceptional" },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 26, fontWeight: 800, color: '#FFFFFF', textAlign: 'center' }
      }
    },
    'c-sub': {
      id: 'c-sub',
      type: 'Text',
      name: 'Subtitle',
      parentId: cardId,
      childrenIds: [],
      props: { text: 'Have questions, feedback, or need enterprise support? Our team responds within 24 hours.' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 13, fontWeight: 400, color: '#9CA3AF', textAlign: 'center' }
      }
    },
    'c-email-fld': {
      id: 'c-email-fld',
      type: 'Text',
      name: 'Email Input Label',
      parentId: cardId,
      childrenIds: [],
      props: { text: 'support@canvasbuilder.dev' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          fontSize: 14,
          fontWeight: 600,
          color: '#6366F1',
          backgroundColor: '#1A1A24',
          borderColor: '#2F2F45',
          borderWidth: 1,
          borderRadius: { tl: 8, tr: 8, br: 8, bl: 8 },
          padding: { top: 10, right: 20, bottom: 10, left: 20 },
        }
      }
    },
    'c-msg-fld': {
      id: 'c-msg-fld',
      type: 'Text',
      name: 'Discord Label',
      parentId: cardId,
      childrenIds: [],
      props: { text: 'Join our Community Discord → discord.gg/canvasbuilder' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 12, fontWeight: 400, color: '#9CA3AF', textAlign: 'center' }
      }
    },
    'c-btn': {
      id: 'c-btn',
      type: 'Button',
      name: 'Submit Button',
      parentId: cardId,
      childrenIds: [],
      props: { text: 'Send Inquiries' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          fontSize: 13,
          fontWeight: 600,
          color: '#FFFFFF',
          backgroundColor: '#6366F1',
          borderRadius: { tl: 8, tr: 8, br: 8, bl: 8 },
          padding: { top: 10, right: 24, bottom: 10, left: 24 },
        }
      }
    }
  };

  return {
    rootNodeId: rootId,
    nodes,
    selectedNodeId: null,
    activeBreakpoint: 'lg',
    isPreviewMode: false,
    clipboardNodeId: null,
  };
};

// 7. Coming Soon AST
export const createComingSoonDocumentState = (): DocumentState => {
  const rootId = 'root-coming-soon';
  const cardId = 'card-coming-soon';

  const nodes: Record<string, CanvasNode> = {
    [rootId]: {
      id: rootId,
      type: 'Frame',
      name: 'Page',
      parentId: null,
      childrenIds: [cardId],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fill',
          backgroundColor: '#0A0A0E',
          padding: { top: 64, right: 32, bottom: 64, left: 32 },
          layoutDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }
      }
    },
    [cardId]: {
      id: cardId,
      type: 'Frame',
      name: 'Coming Soon Box',
      parentId: rootId,
      childrenIds: ['cs-badge', 'cs-title', 'cs-sub', 'cs-btn'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          backgroundColor: '#12121A',
          borderColor: '#262638',
          borderWidth: 1,
          borderRadius: { tl: 20, tr: 20, br: 20, bl: 20 },
          padding: { top: 40, right: 32, bottom: 40, left: 32 },
          layoutDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }
      }
    },
    'cs-badge': {
      id: 'cs-badge',
      type: 'Text',
      name: 'Badge',
      parentId: cardId,
      childrenIds: [],
      props: { text: '✦ LAUNCHING Q3' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          fontSize: 12,
          fontWeight: 600,
          color: '#F59E0B',
          backgroundColor: '#451A03',
          borderColor: '#78350F',
          borderWidth: 1,
          borderRadius: { tl: 99, tr: 99, br: 99, bl: 99 },
          padding: { top: 4, right: 12, bottom: 4, left: 12 },
        }
      }
    },
    'cs-title': {
      id: 'cs-title',
      type: 'Text',
      name: 'Title',
      parentId: cardId,
      childrenIds: [],
      props: { text: 'Something incredible is taking shape' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 28, fontWeight: 800, color: '#FFFFFF', textAlign: 'center' }
      }
    },
    'cs-sub': {
      id: 'cs-sub',
      type: 'Text',
      name: 'Subtitle',
      parentId: cardId,
      childrenIds: [],
      props: { text: 'Join 15,000+ engineers on the waitlist for instant early access to our next-gen editor.' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 13, fontWeight: 400, color: '#9CA3AF', textAlign: 'center' }
      }
    },
    'cs-btn': {
      id: 'cs-btn',
      type: 'Button',
      name: 'Waitlist Button',
      parentId: cardId,
      childrenIds: [],
      props: { text: 'Join VIP Waitlist →' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          fontSize: 13,
          fontWeight: 600,
          color: '#000000',
          backgroundColor: '#F59E0B',
          borderRadius: { tl: 8, tr: 8, br: 8, bl: 8 },
          padding: { top: 10, right: 22, bottom: 10, left: 22 },
        }
      }
    }
  };

  return {
    rootNodeId: rootId,
    nodes,
    selectedNodeId: null,
    activeBreakpoint: 'lg',
    isPreviewMode: false,
    clipboardNodeId: null,
  };
};

// 8. Legal & Terms AST
export const createLegalDocumentState = (): DocumentState => {
  const rootId = 'root-legal';
  const cardId = 'card-legal';

  const nodes: Record<string, CanvasNode> = {
    [rootId]: {
      id: rootId,
      type: 'Frame',
      name: 'Page',
      parentId: null,
      childrenIds: [cardId],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          backgroundColor: '#09090B',
          padding: { top: 48, right: 32, bottom: 64, left: 32 },
          layoutDirection: 'column',
          alignItems: 'center',
        }
      }
    },
    [cardId]: {
      id: cardId,
      type: 'Frame',
      name: 'Terms Document',
      parentId: rootId,
      childrenIds: ['l-title', 'l-sub', 'l-sec1-t', 'l-sec1-d', 'l-sec2-t', 'l-sec2-d'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          backgroundColor: '#111116',
          borderColor: '#22222C',
          borderWidth: 1,
          borderRadius: { tl: 16, tr: 16, br: 16, bl: 16 },
          padding: { top: 32, right: 32, bottom: 32, left: 32 },
          layoutDirection: 'column',
          gap: 16,
        }
      }
    },
    'l-title': {
      id: 'l-title',
      type: 'Text',
      name: 'Title',
      parentId: cardId,
      childrenIds: [],
      props: { text: 'Terms of Service & Privacy Policy' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 24, fontWeight: 700, color: '#FFFFFF' }
      }
    },
    'l-sub': {
      id: 'l-sub',
      type: 'Text',
      name: 'Updated Date',
      parentId: cardId,
      childrenIds: [],
      props: { text: 'Last updated: September 2026' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 12, fontWeight: 400, color: '#71717A' }
      }
    },
    'l-sec1-t': {
      id: 'l-sec1-t',
      type: 'Text',
      name: 'Section 1 Title',
      parentId: cardId,
      childrenIds: [],
      props: { text: '1. Data Privacy & Local Storage' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 16, fontWeight: 600, color: '#E4E4E7' }
      }
    },
    'l-sec1-d': {
      id: 'l-sec1-d',
      type: 'Text',
      name: 'Section 1 Description',
      parentId: cardId,
      childrenIds: [],
      props: { text: 'All design trees, AST nodes, and styling rules are processed securely and stored via standard browser key-value persistence without third-party tracking.' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 13, fontWeight: 400, color: '#A1A1AA', lineHeight: 1.6 }
      }
    },
    'l-sec2-t': {
      id: 'l-sec2-t',
      type: 'Text',
      name: 'Section 2 Title',
      parentId: cardId,
      childrenIds: [],
      props: { text: '2. Intellectual Property & Commercial License' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 16, fontWeight: 600, color: '#E4E4E7' }
      }
    },
    'l-sec2-d': {
      id: 'l-sec2-d',
      type: 'Text',
      name: 'Section 2 Description',
      parentId: cardId,
      childrenIds: [],
      props: { text: 'You own all code exported and visual components authored using this platform. No vendor lock-in is imposed.' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 13, fontWeight: 400, color: '#A1A1AA', lineHeight: 1.6 }
      }
    }
  };

  return {
    rootNodeId: rootId,
    nodes,
    selectedNodeId: null,
    activeBreakpoint: 'lg',
    isPreviewMode: false,
    clipboardNodeId: null,
  };
};

// 9. 404 Error Page AST
export const create404DocumentState = (): DocumentState => {
  const rootId = 'root-404';
  const cardId = 'card-404';

  const nodes: Record<string, CanvasNode> = {
    [rootId]: {
      id: rootId,
      type: 'Frame',
      name: 'Page',
      parentId: null,
      childrenIds: [cardId],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fill',
          backgroundColor: '#09090B',
          padding: { top: 64, right: 32, bottom: 64, left: 32 },
          layoutDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }
      }
    },
    [cardId]: {
      id: cardId,
      type: 'Frame',
      name: '404 Container',
      parentId: rootId,
      childrenIds: ['e-404', 'e-title', 'e-sub', 'e-btn'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          backgroundColor: '#121218',
          borderColor: '#242432',
          borderWidth: 1,
          borderRadius: { tl: 16, tr: 16, br: 16, bl: 16 },
          padding: { top: 40, right: 32, bottom: 40, left: 32 },
          layoutDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }
      }
    },
    'e-404': {
      id: 'e-404',
      type: 'Text',
      name: '404 Display',
      parentId: cardId,
      childrenIds: [],
      props: { text: '404' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          fontSize: 72,
          fontWeight: 900,
          color: '#6366F1',
          textAlign: 'center',
          lineHeight: 1,
        }
      }
    },
    'e-title': {
      id: 'e-title',
      type: 'Text',
      name: 'Title',
      parentId: cardId,
      childrenIds: [],
      props: { text: 'Page not found' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 22, fontWeight: 700, color: '#FFFFFF', textAlign: 'center' }
      }
    },
    'e-sub': {
      id: 'e-sub',
      type: 'Text',
      name: 'Subtitle',
      parentId: cardId,
      childrenIds: [],
      props: { text: 'The page you are looking for might have been moved or removed.' },
      responsiveStyles: {
        base: { ...defaultStyle, fontSize: 13, fontWeight: 400, color: '#9CA3AF', textAlign: 'center' }
      }
    },
    'e-btn': {
      id: 'e-btn',
      type: 'Button',
      name: 'Return Home',
      parentId: cardId,
      childrenIds: [],
      props: { text: 'Return to Home' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          fontSize: 13,
          fontWeight: 600,
          color: '#FFFFFF',
          backgroundColor: '#6366F1',
          borderRadius: { tl: 8, tr: 8, br: 8, bl: 8 },
          padding: { top: 10, right: 20, bottom: 10, left: 20 },
        }
      }
    }
  };

  return {
    rootNodeId: rootId,
    nodes,
    selectedNodeId: null,
    activeBreakpoint: 'lg',
    isPreviewMode: false,
    clipboardNodeId: null,
  };
};

export const createDefaultPagesForScalable = (): ProjectPage[] => {
  return [
    {
      id: 'page-home',
      name: 'Home',
      path: '/',
      isHome: true,
      documentState: createScalableDocumentState(),
    },
    {
      id: 'page-about',
      name: '/about',
      path: '/about',
      documentState: createAboutDocumentState(),
    },
    {
      id: 'page-blog',
      name: '/blog',
      path: '/blog',
      documentState: createBlogDocumentState(),
    },
    {
      id: 'page-contact',
      name: '/contact',
      path: '/contact',
      documentState: createContactDocumentState(),
    },
    {
      id: 'page-coming-soon',
      name: '/coming-soon',
      path: '/coming-soon',
      documentState: createComingSoonDocumentState(),
    },
    {
      id: 'page-legal',
      name: '/legal',
      path: '/legal',
      documentState: createLegalDocumentState(),
    },
    {
      id: 'page-404',
      name: '/404',
      path: '/404',
      documentState: create404DocumentState(),
    }
  ];
};

export const createDefaultPagesForMajd = (): ProjectPage[] => {
  return [
    {
      id: 'page-majd-home',
      name: 'Home',
      path: '/',
      isHome: true,
      documentState: createMajdDocumentState(),
    },
    {
      id: 'page-majd-about',
      name: '/about',
      path: '/about',
      documentState: createAboutDocumentState(),
    },
    {
      id: 'page-majd-contact',
      name: '/contact',
      path: '/contact',
      documentState: createContactDocumentState(),
    }
  ];
};

export const createDefaultPagesForProject = (title: string, templateType: string = 'blank'): { pages: ProjectPage[], activePageId: string, pageFolders: PageFolder[] } => {
  if (templateType === 'saas') {
    const pages = createDefaultPagesForScalable();
    return {
      pages,
      activePageId: 'page-about', // default to /about matching image 1
      pageFolders: [],
    };
  }

  if (templateType === 'portfolio') {
    const pages = createDefaultPagesForMajd();
    return {
      pages,
      activePageId: pages[0].id,
      pageFolders: [],
    };
  }

  const doc = createBlankDocumentState(title);
  const homePage: ProjectPage = {
    id: 'page-' + Math.random().toString(36).substring(2, 8),
    name: 'Home',
    path: '/',
    isHome: true,
    documentState: doc,
  };
  const aboutPage: ProjectPage = {
    id: 'page-' + Math.random().toString(36).substring(2, 8),
    name: '/about',
    path: '/about',
    documentState: createAboutDocumentState(),
  };

  return {
    pages: [homePage, aboutPage],
    activePageId: homePage.id,
    pageFolders: [],
  };
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-dominic',
    title: 'Dominic Portfolio',
    slug: 'dominic-portfolio',
    badge: 'FREE',
    lastViewed: 'Just now',
    lastViewedTimestamp: Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    previewGradient: 'bg-gradient-to-tr from-[#111111] to-[#333333]',
    activePageId: 'page-home-dominic',
    pages: createDefaultPagesForDominic(),
    pageFolders: [],
    documentState: createDominicDocumentState(),
  },

  {
    id: 'proj-scalable',
    title: 'Scalable (copy)',
    slug: 'scalable-copy',
    badge: 'FREE',
    lastViewed: 'Viewed 11h ago',
    lastViewedTimestamp: Date.now() - 11 * 3600 * 1000,
    createdAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 11 * 3600 * 1000).toISOString(),
    previewGradient: 'bg-gradient-to-b from-[#0B0B0F] via-[#101018] to-[#0A0A0E]',
    activePageId: 'page-about',
    pages: createDefaultPagesForScalable(),
    pageFolders: [],
    documentState: createAboutDocumentState(),
  },
  {
    id: 'proj-majd',
    title: 'Majd (copy)',
    slug: 'majd-copy',
    badge: 'FREE',
    lastViewed: 'Viewed 17h ago',
    lastViewedTimestamp: Date.now() - 17 * 3600 * 1000,
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 17 * 3600 * 1000).toISOString(),
    previewGradient: 'bg-gradient-to-b from-[#FAF5F0] to-[#EAE4DC]',
    activePageId: 'page-majd-home',
    pages: createDefaultPagesForMajd(),
    pageFolders: [],
    documentState: createMajdDocumentState(),
  },
  {
    id: 'proj-high-memory',
    title: 'High Memory',
    slug: 'high-memory',
    badge: 'FREE',
    lastViewed: 'Viewed 19h ago',
    lastViewedTimestamp: Date.now() - 19 * 3600 * 1000,
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 19 * 3600 * 1000).toISOString(),
    previewGradient: 'bg-[#18181A]',
    activePageId: 'page-hm-home',
    pages: [
      {
        id: 'page-hm-home',
        name: 'Home',
        path: '/',
        isHome: true,
        documentState: createHighMemoryDocumentState(),
      }
    ],
    pageFolders: [],
    documentState: createHighMemoryDocumentState(),
  }
];

export const createBlankDocumentState = (title: string): DocumentState => {
  const rootId = 'root-' + Math.random().toString(36).substring(2, 9);
  const heroCardId = 'card-' + Math.random().toString(36).substring(2, 9);
  const badgeId = 'badge-' + Math.random().toString(36).substring(2, 9);
  const headingId = 'heading-' + Math.random().toString(36).substring(2, 9);
  const subId = 'sub-' + Math.random().toString(36).substring(2, 9);
  const btnId = 'btn-' + Math.random().toString(36).substring(2, 9);

  return {
    rootNodeId: rootId,
    nodes: {
      [rootId]: {
        id: rootId,
        type: 'Frame',
        name: 'Page',
        parentId: null,
        childrenIds: [heroCardId],
        props: {},
        responsiveStyles: {
          base: {
            ...defaultStyle,
            widthType: 'fill',
            heightType: 'fill',
            backgroundColor: '#0A0A0E',
            padding: { top: 48, right: 32, bottom: 48, left: 32 },
            layoutDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
          }
        }
      },
      [heroCardId]: {
        id: heroCardId,
        type: 'Frame',
        name: 'Hero Card',
        parentId: rootId,
        childrenIds: [badgeId, headingId, subId, btnId],
        props: {},
        responsiveStyles: {
          base: {
            ...defaultStyle,
            widthType: 'fill',
            heightType: 'fit-content',
            backgroundColor: '#131318',
            borderColor: '#22222C',
            borderWidth: 1,
            borderRadius: { tl: 16, tr: 16, br: 16, bl: 16 },
            padding: { top: 36, right: 32, bottom: 36, left: 32 },
            layoutDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
          }
        }
      },
      [badgeId]: {
        id: badgeId,
        type: 'Text',
        name: 'Badge',
        parentId: heroCardId,
        childrenIds: [],
        props: { text: '✦ Visual Canvas' },
        responsiveStyles: {
          base: {
            ...defaultStyle,
            widthType: 'fit-content',
            heightType: 'fit-content',
            fontSize: 12,
            fontWeight: 600,
            color: '#A5B4FC',
            backgroundColor: '#1E1B4B',
            borderColor: '#3730A3',
            borderWidth: 1,
            borderRadius: { tl: 99, tr: 99, br: 99, bl: 99 },
            padding: { top: 4, right: 12, bottom: 4, left: 12 },
          }
        }
      },
      [headingId]: {
        id: headingId,
        type: 'Text',
        name: 'Heading',
        parentId: heroCardId,
        childrenIds: [],
        props: { text: title || 'Welcome to your new canvas' },
        responsiveStyles: {
          base: {
            ...defaultStyle,
            widthType: 'fit-content',
            heightType: 'fit-content',
            fontSize: 28,
            fontWeight: 800,
            color: '#FFFFFF',
            textAlign: 'center',
            lineHeight: 1.25,
          }
        }
      },
      [subId]: {
        id: subId,
        type: 'Text',
        name: 'Subtitle',
        parentId: heroCardId,
        childrenIds: [],
        props: { text: 'Drag & drop components or use shortcuts (F, S, G, M, I, V, T) to start building.' },
        responsiveStyles: {
          base: {
            ...defaultStyle,
            widthType: 'fit-content',
            heightType: 'fit-content',
            fontSize: 13,
            fontWeight: 400,
            color: '#9CA3AF',
            textAlign: 'center',
          }
        }
      },
      [btnId]: {
        id: btnId,
        type: 'Button',
        name: 'Get Started',
        parentId: heroCardId,
        childrenIds: [],
        props: { text: 'Get Started →' },
        responsiveStyles: {
          base: {
            ...defaultStyle,
            widthType: 'fit-content',
            heightType: 'fit-content',
            backgroundColor: '#0099FF',
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: 600,
            borderRadius: { tl: 8, tr: 8, br: 8, bl: 8 },
            padding: { top: 8, right: 18, bottom: 8, left: 18 },
          }
        }
      }
    },
    selectedNodeId: null,
    activeBreakpoint: 'lg',
    isPreviewMode: false,
    clipboardNodeId: null,
  };
};
