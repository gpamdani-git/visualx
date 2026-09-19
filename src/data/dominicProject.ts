
import { defaultStyle, CanvasNode, DocumentState } from '../types/builder';
import { ProjectPage } from '../types/project';
import { v4 as uuidv4 } from 'uuid';

export const createDominicDocumentState = (): DocumentState => {
  const rootId = 'root-dominic';
  
  const nodes: Record<string, CanvasNode> = {
    [rootId]: {
      id: rootId,
      type: 'Frame',
      name: 'Portfolio Page',
      parentId: null,
      childrenIds: ['hero-section', 'about-section', 'work-section', 'footer-section'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          backgroundColor: '#0a0a0a',
          layoutDirection: 'column',
          alignItems: 'center',
          overflow: 'hidden'
        }
      }
    },
    'hero-section': {
      id: 'hero-section',
      type: 'Frame',
      name: 'Hero Section',
      parentId: rootId,
      childrenIds: ['bg-image', 'navbar', 'hero-content', 'bottom-text'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fixed',
          heightValue: 900,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#111111'
        }
      }
    },
    'bg-image': {
      id: 'bg-image',
      type: 'Image',
      name: 'Background Image',
      parentId: 'hero-section',
      childrenIds: [],
      props: {
        src: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2070&auto=format&fit=crop',
        alt: 'Portrait Background'
      },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          position: 'absolute',
          top: '0px',
          left: '0px',
          widthType: 'fill',
          heightType: 'fill',
          objectFit: 'cover',
          opacity: 0.6,
          zIndex: 0
        }
      }
    },
    'navbar': {
      id: 'navbar',
      type: 'Frame',
      name: 'Navbar',
      parentId: 'hero-section',
      childrenIds: ['nav-logo', 'nav-menu'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          position: 'absolute',
          top: '40px',
          left: '40px',
          widthType: 'fit-content',
          heightType: 'fixed',
          heightValue: 48,
          backgroundColor: '#1e1e1e',
          borderRadius: { tl: 24, tr: 24, bl: 24, br: 24, isSplit: false },
          padding: { top: 0, right: 20, bottom: 0, left: 20 },
          layoutDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          zIndex: 10,
          borderWidth: 1,
          borderColor: '#333333'
        }
      }
    },
    'nav-logo': {
      id: 'nav-logo',
      type: 'Text',
      name: 'Logo',
      parentId: 'navbar',
      childrenIds: [],
      props: { text: 'Dominic' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          color: '#ffffff',
          fontSize: 16,
          fontWeight: '500'
        }
      }
    },
    'nav-menu': {
      id: 'nav-menu',
      type: 'Text',
      name: 'Menu Icon',
      parentId: 'navbar',
      childrenIds: [],
      props: { text: '☰' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          color: '#ffffff',
          fontSize: 20
        }
      }
    },
    'hero-content': {
      id: 'hero-content',
      type: 'Frame',
      name: 'Hero Content',
      parentId: 'hero-section',
      childrenIds: ['left-col', 'right-col'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          position: 'absolute',
          top: '50%',
          left: '40px',
          right: '40px',
          widthType: 'fill',
          heightType: 'fit-content',
          layoutDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10
        }
      }
    },
    'left-col': {
      id: 'left-col',
      type: 'Frame',
      name: 'Left Content',
      parentId: 'hero-content',
      childrenIds: ['status-pill', 'hero-heading'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fixed',
          widthValue: 500,
          heightType: 'fit-content',
          layoutDirection: 'column',
          alignItems: 'flex-start',
          gap: 24
        }
      }
    },
    'status-pill': {
      id: 'status-pill',
      type: 'Frame',
      name: 'Status',
      parentId: 'left-col',
      childrenIds: ['status-dot', 'status-text'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fit-content',
          heightType: 'fit-content',
          padding: { top: 8, right: 16, bottom: 8, left: 12 },
          backgroundColor: '#1e1e1e',
          borderRadius: { tl: 20, tr: 20, bl: 20, br: 20, isSplit: false },
          layoutDirection: 'row',
          alignItems: 'center',
          gap: 8,
          borderWidth: 1,
          borderColor: '#333333'
        }
      }
    },
    'status-dot': {
      id: 'status-dot',
      type: 'Frame',
      name: 'Dot',
      parentId: 'status-pill',
      childrenIds: [],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fixed',
          widthValue: 8,
          heightType: 'fixed',
          heightValue: 8,
          backgroundColor: '#FF6B35',
          borderRadius: { tl: 4, tr: 4, bl: 4, br: 4, isSplit: false }
        }
      }
    },
    'status-text': {
      id: 'status-text',
      type: 'Text',
      name: 'Status Text',
      parentId: 'status-pill',
      childrenIds: [],
      props: { text: 'Available for Work' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          color: '#aaaaaa',
          fontSize: 12,
          fontWeight: '500'
        }
      }
    },
    'hero-heading': {
      id: 'hero-heading',
      type: 'Text',
      name: 'Heading',
      parentId: 'left-col',
      childrenIds: [],
      props: { text: 'Brand & UI/UX\nDesigner based\nin London' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          color: '#ffffff',
          fontSize: 48,
          fontWeight: '600',
          lineHeight: 1.1
        }
      }
    },
    'right-col': {
      id: 'right-col',
      type: 'Frame',
      name: 'Right Content',
      parentId: 'hero-content',
      childrenIds: ['bio-text', 'cta-btn'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fixed',
          widthValue: 320,
          heightType: 'fit-content',
          layoutDirection: 'column',
          alignItems: 'flex-start',
          gap: 32
        }
      }
    },
    'bio-text': {
      id: 'bio-text',
      type: 'Text',
      name: 'Bio Text',
      parentId: 'right-col',
      childrenIds: [],
      props: { text: 'Hi, I\'m Dominic Wagner - a UI/UX and brand designer passionate about creating seamless digital experiences that connect and convert.' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          color: '#cccccc',
          fontSize: 16,
          lineHeight: 1.5,
          fontWeight: '400'
        }
      }
    },
    'cta-btn': {
      id: 'cta-btn',
      type: 'Frame',
      name: 'CTA Button',
      parentId: 'right-col',
      childrenIds: ['cta-arrow', 'cta-text'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fit-content',
          heightType: 'fit-content',
          padding: { top: 8, right: 24, bottom: 8, left: 8 },
          backgroundColor: '#FF6B35',
          borderRadius: { tl: 32, tr: 32, bl: 32, br: 32, isSplit: false },
          layoutDirection: 'row',
          alignItems: 'center',
          gap: 16,
          cursor: 'pointer'
        }
      }
    },
    'cta-arrow': {
      id: 'cta-arrow',
      type: 'Frame',
      name: 'Arrow Circle',
      parentId: 'cta-btn',
      childrenIds: ['cta-arrow-text'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fixed',
          widthValue: 32,
          heightType: 'fixed',
          heightValue: 32,
          backgroundColor: '#ffffff',
          borderRadius: { tl: 16, tr: 16, bl: 16, br: 16, isSplit: false },
          layoutDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }
    },
    'cta-arrow-text': {
      id: 'cta-arrow-text',
      type: 'Text',
      name: 'Arrow Text',
      parentId: 'cta-arrow',
      childrenIds: [],
      props: { text: '→' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          color: '#FF6B35',
          fontSize: 16,
          fontWeight: 'bold'
        }
      }
    },
    'cta-text': {
      id: 'cta-text',
      type: 'Text',
      name: 'Button Text',
      parentId: 'cta-btn',
      childrenIds: [],
      props: { text: 'See my works' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          color: '#ffffff',
          fontSize: 14,
          fontWeight: '600'
        }
      }
    },
    'bottom-text': {
      id: 'bottom-text',
      type: 'Text',
      name: 'Hero Typography',
      parentId: 'hero-section',
      childrenIds: [],
      props: { text: 'Dominic' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          position: 'absolute',
          bottom: '-40px',
          left: '0px',
          widthType: 'fill',
          color: '#ffffff',
          fontSize: 300,
          fontWeight: '800',
          textAlign: 'center',
          lineHeight: 1,
          zIndex: 5
        }
      }
    },
    'about-section': {
      id: 'about-section',
      type: 'Frame',
      name: 'About Section',
      parentId: rootId,
      childrenIds: ['about-container'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          backgroundColor: '#0a0a0a',
          padding: { top: 120, right: 40, bottom: 120, left: 40 },
          layoutDirection: 'column',
          alignItems: 'center'
        }
      }
    },
    'about-container': {
      id: 'about-container',
      type: 'Frame',
      name: 'Container',
      parentId: 'about-section',
      childrenIds: ['about-title', 'stats-row'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fixed',
          widthValue: 1200,
          heightType: 'fit-content',
          layoutDirection: 'column',
          gap: 64
        }
      }
    },
    'about-title': {
      id: 'about-title',
      type: 'Text',
      name: 'About Heading',
      parentId: 'about-container',
      childrenIds: [],
      props: { text: 'Bridging the gap between aesthetics and function.' },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          color: '#ffffff',
          fontSize: 56,
          fontWeight: '600',
          lineHeight: 1.1,
          widthType: 'fixed',
          widthValue: 800
        }
      }
    },
    'stats-row': {
      id: 'stats-row',
      type: 'Frame',
      name: 'Stats Row',
      parentId: 'about-container',
      childrenIds: ['stat-1', 'stat-2', 'stat-3'],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          layoutDirection: 'row',
          justifyContent: 'space-between',
          borderWidth: 1,
          borderColor: '#222222',
          borderStyle: 'solid',
          padding: { top: 40, right: 0, bottom: 0, left: 0 }
        }
      }
    }
  };

  const addStat = (id: string, label: string, value: string, parent: string) => {
    nodes[id] = {
      id,
      type: 'Frame',
      name: `Stat ${value}`,
      parentId: parent,
      childrenIds: [`${id}-val`, `${id}-lbl`],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fit-content',
          heightType: 'fit-content',
          layoutDirection: 'column',
          gap: 8
        }
      }
    };
    nodes[`${id}-val`] = {
      id: `${id}-val`,
      type: 'Text',
      name: 'Value',
      parentId: id,
      childrenIds: [],
      props: { text: value },
      responsiveStyles: {
        base: { ...defaultStyle, color: '#FF6B35', fontSize: 64, fontWeight: '700' }
      }
    };
    nodes[`${id}-lbl`] = {
      id: `${id}-lbl`,
      type: 'Text',
      name: 'Label',
      parentId: id,
      childrenIds: [],
      props: { text: label },
      responsiveStyles: {
        base: { ...defaultStyle, color: '#888888', fontSize: 16, fontWeight: '500' }
      }
    };
  };

  addStat('stat-1', 'Years of Experience', '08+', 'stats-row');
  addStat('stat-2', 'Satisfied Clients', '120+', 'stats-row');
  addStat('stat-3', 'Projects Completed', '250+', 'stats-row');

  nodes['work-section'] = {
    id: 'work-section',
    type: 'Frame',
    name: 'Selected Works',
    parentId: rootId,
    childrenIds: ['work-container'],
    props: {},
    responsiveStyles: {
      base: {
        ...defaultStyle,
        widthType: 'fill',
        heightType: 'fit-content',
        backgroundColor: '#111111',
        padding: { top: 120, right: 40, bottom: 120, left: 40 },
        layoutDirection: 'column',
        alignItems: 'center'
      }
    }
  };

  nodes['work-container'] = {
    id: 'work-container',
    type: 'Frame',
    name: 'Work Container',
    parentId: 'work-section',
    childrenIds: ['work-header', 'work-grid'],
    props: {},
    responsiveStyles: {
      base: {
        ...defaultStyle,
        widthType: 'fixed',
        widthValue: 1200,
        heightType: 'fit-content',
        layoutDirection: 'column',
        gap: 64
      }
    }
  };

  nodes['work-header'] = {
    id: 'work-header',
    type: 'Frame',
    name: 'Work Header',
    parentId: 'work-container',
    childrenIds: ['work-title', 'work-view-all'],
    props: {},
    responsiveStyles: {
      base: {
        ...defaultStyle,
        widthType: 'fill',
        heightType: 'fit-content',
        layoutDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
      }
    }
  };

  nodes['work-title'] = {
    id: 'work-title',
    type: 'Text',
    name: 'Title',
    parentId: 'work-header',
    childrenIds: [],
    props: { text: 'Selected\nWorks' },
    responsiveStyles: {
      base: { ...defaultStyle, color: '#ffffff', fontSize: 64, fontWeight: '700', lineHeight: 1.1 }
    }
  };

  nodes['work-view-all'] = {
    id: 'work-view-all',
    type: 'Text',
    name: 'View All',
    parentId: 'work-header',
    childrenIds: [],
    props: { text: 'View all projects ↗' },
    responsiveStyles: {
      base: { ...defaultStyle, color: '#FF6B35', fontSize: 16, fontWeight: '600', cursor: 'pointer' }
    }
  };

  nodes['work-grid'] = {
    id: 'work-grid',
    type: 'Frame',
    name: 'Work Grid',
    parentId: 'work-container',
    childrenIds: ['project-1', 'project-2'],
    props: {},
    responsiveStyles: {
      base: {
        ...defaultStyle,
        widthType: 'fill',
        heightType: 'fit-content',
        layoutDirection: 'row',
        gap: 32
      }
    }
  };

  const addProject = (id: string, title: string, category: string, imgUrl: string) => {
    nodes[id] = {
      id,
      type: 'Frame',
      name: `Project ${title}`,
      parentId: 'work-grid',
      childrenIds: [`${id}-img`, `${id}-info`],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: '1fr',
          heightType: 'fit-content',
          layoutDirection: 'column',
          gap: 24,
          cursor: 'pointer'
        }
      }
    };
    nodes[`${id}-img`] = {
      id: `${id}-img`,
      type: 'Image',
      name: 'Project Image',
      parentId: id,
      childrenIds: [],
      props: { src: imgUrl, alt: title },
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fixed',
          heightValue: 480,
          objectFit: 'cover',
          borderRadius: { tl: 16, tr: 16, bl: 16, br: 16, isSplit: false }
        }
      }
    };
    nodes[`${id}-info`] = {
      id: `${id}-info`,
      type: 'Frame',
      name: 'Info',
      parentId: id,
      childrenIds: [`${id}-title`, `${id}-cat`],
      props: {},
      responsiveStyles: {
        base: {
          ...defaultStyle,
          widthType: 'fill',
          heightType: 'fit-content',
          layoutDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }
      }
    };
    nodes[`${id}-title`] = {
      id: `${id}-title`,
      type: 'Text',
      name: 'Title',
      parentId: `${id}-info`,
      childrenIds: [],
      props: { text: title },
      responsiveStyles: {
        base: { ...defaultStyle, color: '#ffffff', fontSize: 24, fontWeight: '600' }
      }
    };
    nodes[`${id}-cat`] = {
      id: `${id}-cat`,
      type: 'Text',
      name: 'Category',
      parentId: `${id}-info`,
      childrenIds: [],
      props: { text: category },
      responsiveStyles: {
        base: { ...defaultStyle, color: '#888888', fontSize: 14 }
      }
    };
  };

  addProject('project-1', 'Neo Banking App', 'UI/UX Design', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop');
  addProject('project-2', 'Aura E-Commerce', 'Branding & Web', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1430&auto=format&fit=crop');

  nodes['footer-section'] = {
    id: 'footer-section',
    type: 'Frame',
    name: 'Footer',
    parentId: rootId,
    childrenIds: ['footer-container'],
    props: {},
    responsiveStyles: {
      base: {
        ...defaultStyle,
        widthType: 'fill',
        heightType: 'fit-content',
        backgroundColor: '#FF6B35',
        padding: { top: 120, right: 40, bottom: 40, left: 40 },
        layoutDirection: 'column',
        alignItems: 'center'
      }
    }
  };

  nodes['footer-container'] = {
    id: 'footer-container',
    type: 'Frame',
    name: 'Container',
    parentId: 'footer-section',
    childrenIds: ['footer-title', 'footer-bottom'],
    props: {},
    responsiveStyles: {
      base: {
        ...defaultStyle,
        widthType: 'fixed',
        widthValue: 1200,
        heightType: 'fit-content',
        layoutDirection: 'column',
        gap: 120
      }
    }
  };

  nodes['footer-title'] = {
    id: 'footer-title',
    type: 'Text',
    name: 'Call to Action',
    parentId: 'footer-container',
    childrenIds: [],
    props: { text: 'Let\'s create\nsomething amazing.' },
    responsiveStyles: {
      base: {
        ...defaultStyle,
        color: '#ffffff',
        fontSize: 96,
        fontWeight: '700',
        lineHeight: 1
      }
    }
  };

  nodes['footer-bottom'] = {
    id: 'footer-bottom',
    type: 'Frame',
    name: 'Bottom Row',
    parentId: 'footer-container',
    childrenIds: ['footer-mail', 'footer-socials'],
    props: {},
    responsiveStyles: {
      base: {
        ...defaultStyle,
        widthType: 'fill',
        heightType: 'fit-content',
        layoutDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ffffff',
        borderStyle: 'solid',
        padding: { top: 40, right: 0, bottom: 0, left: 0 }
      }
    }
  };

  nodes['footer-mail'] = {
    id: 'footer-mail',
    type: 'Text',
    name: 'Email',
    parentId: 'footer-bottom',
    childrenIds: [],
    props: { text: 'hello@dominicwagner.com' },
    responsiveStyles: {
      base: { ...defaultStyle, color: '#ffffff', fontSize: 24, fontWeight: '500' }
    }
  };

  nodes['footer-socials'] = {
    id: 'footer-socials',
    type: 'Frame',
    name: 'Social Links',
    parentId: 'footer-bottom',
    childrenIds: ['soc-1', 'soc-2', 'soc-3'],
    props: {},
    responsiveStyles: {
      base: {
        ...defaultStyle,
        widthType: 'fit-content',
        heightType: 'fit-content',
        layoutDirection: 'row',
        gap: 24
      }
    }
  };

  const addSocial = (id: string, label: string) => {
    nodes[id] = {
      id,
      type: 'Text',
      name: label,
      parentId: 'footer-socials',
      childrenIds: [],
      props: { text: label },
      responsiveStyles: {
        base: { ...defaultStyle, color: '#ffffff', fontSize: 16, fontWeight: '500', cursor: 'pointer' }
      }
    };
  };

  addSocial('soc-1', 'Dribbble');
  addSocial('soc-2', 'Twitter');

  addSocial('soc-3', 'LinkedIn');

  return {
    rootNodeId: rootId,
    nodes,
    selectedNodeId: null,
    clipboardNodeId: null,
    activeBreakpoint: 'lg',
    isPreviewMode: false,
  };
};

export const createDefaultPagesForDominic = (): ProjectPage[] => {
  return [
    {
      id: 'page-home-dominic',
      name: 'Home',
      path: '/',
      documentState: createDominicDocumentState()
    }
  ];
};
