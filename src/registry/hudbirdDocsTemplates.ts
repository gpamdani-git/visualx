// AUTO GENERATED FROM BLANK_UI- DOCS
// @ts-nocheck
import { CanvasNode } from '../types/builder';

export const hudbirdDocsTemplates: Record<string, { rootNodeId: string, name: string, nodeData: Record<string, CanvasNode> }[]> = {};

hudbirdDocsTemplates['Cta'] = [
  {
    name: 'centered',
    rootNodeId: 'ctacentered_6lds28u',
    nodeData: {
      "ctacentered_6lds28u": {
        id: "ctacentered_6lds28u",
        type: "Hudbird_CtaCentered",
        name: "CtaCentered",
        parentId: null,
        props: { className: "bg-transparent" },
        childrenIds: ["ctatitle_r5xb91q", "ctadesc_fx57i7v", "ctastack_g98zffj"],
        responsiveStyles: { base: {} }
      },
      "ctatitle_r5xb91q": {
        id: "ctatitle_r5xb91q",
        type: "Text",
        name: "Heading",
        parentId: "ctacentered_6lds28u",
        props: {
          text: "Boost your productivity. Start using our app today.",
          className: "text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-white"
        },
        childrenIds: [],
        responsiveStyles: { base: {} }
      },
      "ctadesc_fx57i7v": {
        id: "ctadesc_fx57i7v",
        type: "Text",
        name: "Subtitle",
        parentId: "ctacentered_6lds28u",
        props: {
          text: "Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam.",
          className: "mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400"
        },
        childrenIds: [],
        responsiveStyles: { base: {} }
      },
      "ctastack_g98zffj": {
        id: "ctastack_g98zffj",
        type: "Stack",
        name: "Actions",
        parentId: "ctacentered_6lds28u",
        props: {
          className: "mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
        },
        childrenIds: ["ctabtnp_zees1bg", "ctabtns_5mlj2go"],
        responsiveStyles: { base: {} }
      },
      "ctabtnp_zees1bg": {
        id: "ctabtnp_zees1bg",
        type: "Hudbird_Button",
        name: "Primary Button",
        parentId: "ctastack_g98zffj",
        props: {
          children: "Get started",
          color: "primary",
          className: "w-full sm:w-auto"
        },
        childrenIds: [],
        responsiveStyles: { base: {} }
      },
      "ctabtns_5mlj2go": {
        id: "ctabtns_5mlj2go",
        type: "Hudbird_Button",
        name: "Secondary Button",
        parentId: "ctastack_g98zffj",
        props: {
          children: "Learn more",
          variant: "outline",
          className: "w-full sm:w-auto"
        },
        childrenIds: [],
        responsiveStyles: { base: {} }
      }
    }
  }
];

hudbirdDocsTemplates['Footer'] = [
  {
    name: 'simple',
    rootNodeId: 'footersimple_f2yyfmk',
    nodeData: {
  "footersimple_f2yyfmk": {
    "id": "footersimple_f2yyfmk",
    "type": "Hudbird_FooterSimple",
    "name": "FooterSimple",
    "parentId": null,
    "props": {
      "links": [
        {
          "label": "About",
          "href": "#"
        },
        {
          "label": "Blog",
          "href": "#"
        },
        {
          "label": "Jobs",
          "href": "#"
        }
      ],
      "socials": [
        {
          "label": "Twitter",
          "href": "#",
          "icon": {
            "_type": "LucideIcon",
            "name": "Twitter",
            "size": 24
          }
        },
        {
          "label": "GitHub",
          "href": "#",
          "icon": {
            "_type": "LucideIcon",
            "name": "Github",
            "size": 24
          }
        }
      ],
      "copyright": "© 2026 Your Company, Inc. All rights reserved."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  }
}
  },
  {
    name: 'mega',
    rootNodeId: 'footermega_arxoxn2',
    nodeData: {
  "footermega_arxoxn2": {
    "id": "footermega_arxoxn2",
    "type": "Hudbird_FooterMega",
    "name": "FooterMega",
    "parentId": null,
    "props": {
      "brandName": "Hudbird UI",
      "description": "Making the world a better place through elegant hierarchies.",
      "linkGroups": [
        {
          "title": "Solutions",
          "links": [
            {
              "label": "Marketing",
              "href": "#"
            },
            {
              "label": "Analytics",
              "href": "#"
            }
          ]
        },
        {
          "title": "Support",
          "links": [
            {
              "label": "Pricing",
              "href": "#"
            },
            {
              "label": "Documentation",
              "href": "#"
            }
          ]
        }
      ],
      "socials": [
        {
          "label": "Twitter",
          "href": "#",
          "icon": {
            "_type": "LucideIcon",
            "name": "Twitter",
            "size": 24
          }
        }
      ],
      "copyright": "© 2026 Your Company, Inc. All rights reserved."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  }
}
  },
];

hudbirdDocsTemplates['Hero'] = [
  {
    name: 'minimalist',
    rootNodeId: 'hero_wm4qt84',
    nodeData: {
  "hero_wm4qt84": {
    "id": "hero_wm4qt84",
    "type": "Hudbird_Hero",
    "name": "Hero",
    "parentId": null,
    "props": {
      "size": "full"
    },
    "childrenIds": [
      "herobackground_fudxx8b",
      "heroheader_zqfm3ka",
      "herobody_p176cti"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herobackground_fudxx8b": {
    "id": "herobackground_fudxx8b",
    "type": "Hudbird_HeroBackground",
    "name": "HeroBackground",
    "parentId": "hero_wm4qt84",
    "props": {
      "src": "/assets/marketing-section/hero-bg.webp",
      "overlayClassName": "bg-white/40 dark:bg-zinc-950/80 backdrop-blur-md"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "heroheader_zqfm3ka": {
    "id": "heroheader_zqfm3ka",
    "type": "Hudbird_HeroHeader",
    "name": "HeroHeader",
    "parentId": "hero_wm4qt84",
    "props": {
      "links": [
        {
          "label": "Product",
          "href": "#"
        },
        {
          "label": "Features",
          "items": [
            {
              "label": "Analytics",
              "href": "#"
            },
            {
              "label": "Security",
              "href": "#"
            },
            {
              "label": "Integrations",
              "href": "#"
            }
          ]
        },
        {
          "label": "Company",
          "href": "#"
        }
      ]
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herobody_p176cti": {
    "id": "herobody_p176cti",
    "type": "Hudbird_HeroBody",
    "name": "HeroBody",
    "parentId": "hero_wm4qt84",
    "props": {
      "align": "center"
    },
    "childrenIds": [
      "herobadge_omdgm5g",
      "herotitle_6q0s1m6",
      "herodescription_p0uh8s7",
      "heroactions_md2he5i"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herobadge_omdgm5g": {
    "id": "herobadge_omdgm5g",
    "type": "Hudbird_HeroBadge",
    "name": "HeroBadge",
    "parentId": "herobody_p176cti",
    "props": {},
    "childrenIds": [
      "a_vdo07u9"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "a_vdo07u9": {
    "id": "a_vdo07u9",
    "type": "Frame",
    "name": "a",
    "parentId": "herobadge_omdgm5g",
    "props": {
      "href": "#",
      "className": "font-semibold text-indigo-600 dark:text-indigo-400 ml-1"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herotitle_6q0s1m6": {
    "id": "herotitle_6q0s1m6",
    "type": "Hudbird_HeroTitle",
    "name": "HeroTitle",
    "parentId": "herobody_p176cti",
    "props": {
      "children": "Data to enrich your online business"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herodescription_p0uh8s7": {
    "id": "herodescription_p0uh8s7",
    "type": "Hudbird_HeroDescription",
    "name": "HeroDescription",
    "parentId": "herobody_p176cti",
    "props": {
      "className": "max-w-xl mx-auto",
      "children": "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "heroactions_md2he5i": {
    "id": "heroactions_md2he5i",
    "type": "Hudbird_HeroActions",
    "name": "HeroActions",
    "parentId": "herobody_p176cti",
    "props": {
      "className": "justify-center"
    },
    "childrenIds": [
      "button_90ykhn9",
      "button_0kr13px"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "button_90ykhn9": {
    "id": "button_90ykhn9",
    "type": "Hudbird_Button",
    "name": "Button",
    "parentId": "heroactions_md2he5i",
    "props": {
      "color": "primary",
      "children": "Get started"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "button_0kr13px": {
    "id": "button_0kr13px",
    "type": "Hudbird_Button",
    "name": "Button",
    "parentId": "heroactions_md2he5i",
    "props": {
      "variant": "light",
      "children": "Learn more"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  }
}
  },
  {
    name: 'split',
    rootNodeId: 'hero_yf1q38a',
    nodeData: {
  "hero_yf1q38a": {
    "id": "hero_yf1q38a",
    "type": "Hudbird_Hero",
    "name": "Hero",
    "parentId": null,
    "props": {
      "size": "full",
      "withBlobs": false,
      "className": "bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-white"
    },
    "childrenIds": [
      "heroheader_vbjnegz",
      "herobody_lo6xrmw"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "heroheader_vbjnegz": {
    "id": "heroheader_vbjnegz",
    "type": "Hudbird_HeroHeader",
    "name": "HeroHeader",
    "parentId": "hero_yf1q38a",
    "props": {
      "links": [
        {
          "label": "Product",
          "href": "#"
        },
        {
          "label": "Features",
          "href": "#"
        }
      ],
      "className": "[&_a]:text-zinc-600 dark:[&_a]:text-white [&_button]:text-zinc-900 dark:[&_button]:text-white"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herobody_lo6xrmw": {
    "id": "herobody_lo6xrmw",
    "type": "Hudbird_HeroBody",
    "name": "HeroBody",
    "parentId": "hero_yf1q38a",
    "props": {},
    "childrenIds": [
      "div_g3eiz1k"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_g3eiz1k": {
    "id": "div_g3eiz1k",
    "type": "Frame",
    "name": "div",
    "parentId": "herobody_lo6xrmw",
    "props": {
      "className": "grid lg:grid-cols-2 gap-12 items-center"
    },
    "childrenIds": [
      "herocontent_0p3u30l",
      "heromedia_gzvqmjf"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herocontent_0p3u30l": {
    "id": "herocontent_0p3u30l",
    "type": "Hudbird_HeroContent",
    "name": "HeroContent",
    "parentId": "div_g3eiz1k",
    "props": {
      "align": "left"
    },
    "childrenIds": [
      "herobadge_dn09xqw",
      "herotitle_37eqdx3",
      "herodescription_xvq5tbm",
      "heroactions_j6tgvif"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herobadge_dn09xqw": {
    "id": "herobadge_dn09xqw",
    "type": "Hudbird_HeroBadge",
    "name": "HeroBadge",
    "parentId": "herocontent_0p3u30l",
    "props": {
      "className": "text-zinc-600 dark:text-zinc-200 ring-zinc-200 dark:ring-white/20 hover:ring-zinc-300 dark:hover:ring-white/30 bg-white/50 dark:bg-white/10 backdrop-blur-md",
      "children": "New Feature Release"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herotitle_37eqdx3": {
    "id": "herotitle_37eqdx3",
    "type": "Hudbird_HeroTitle",
    "name": "HeroTitle",
    "parentId": "herocontent_0p3u30l",
    "props": {
      "className": "text-left text-5xl sm:text-6xl text-zinc-900 dark:text-white",
      "children": "Build faster with Hudbird UI"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herodescription_xvq5tbm": {
    "id": "herodescription_xvq5tbm",
    "type": "Hudbird_HeroDescription",
    "name": "HeroDescription",
    "parentId": "herocontent_0p3u30l",
    "props": {
      "className": "text-left text-zinc-500 dark:text-zinc-400",
      "children": "Deploy your next web application in minutes with our premium React components. Beautifully designed, accessible, and ready for production."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "heroactions_j6tgvif": {
    "id": "heroactions_j6tgvif",
    "type": "Hudbird_HeroActions",
    "name": "HeroActions",
    "parentId": "herocontent_0p3u30l",
    "props": {},
    "childrenIds": [
      "button_x6609gm"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "button_x6609gm": {
    "id": "button_x6609gm",
    "type": "Hudbird_Button",
    "name": "Button",
    "parentId": "heroactions_j6tgvif",
    "props": {
      "color": "primary",
      "className": "flex items-center gap-1",
      "children": "Start building"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "heromedia_gzvqmjf": {
    "id": "heromedia_gzvqmjf",
    "type": "Hudbird_HeroMedia",
    "name": "HeroMedia",
    "parentId": "div_g3eiz1k",
    "props": {
      "className": "relative flex items-center justify-center"
    },
    "childrenIds": [
      "motion_div_l30qoqp"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "motion_div_l30qoqp": {
    "id": "motion_div_l30qoqp",
    "type": "motion.div",
    "name": "motion.div",
    "parentId": "heromedia_gzvqmjf",
    "props": {
      "initial": {
        "opacity": 0,
        "y": 20
      },
      "whileInView": {
        "opacity": 1,
        "y": 0
      },
      "transition": {
        "duration": 0.8,
        "ease": "easeOut"
      },
      "className": "relative w-full"
    },
    "childrenIds": [
      "img_a5z7w1n",
      "img_99zc41s"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "img_a5z7w1n": {
    "id": "img_a5z7w1n",
    "type": "img",
    "name": "img",
    "parentId": "motion_div_l30qoqp",
    "props": {
      "src": "/assets/marketing-section/split-screen-light.webp",
      "alt": "App screenshot",
      "className": "w-full h-auto max-h-[80vh] object-cover rounded-3xl shadow-xl transition-opacity duration-700 ease-in-out dark:opacity-0"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "img_99zc41s": {
    "id": "img_99zc41s",
    "type": "img",
    "name": "img",
    "parentId": "motion_div_l30qoqp",
    "props": {
      "src": "/assets/marketing-section/split-screen-dark.webp",
      "alt": "App screenshot",
      "className": "absolute top-0 left-0 w-full h-full object-cover rounded-3xl shadow-2xl ring-1 ring-white/10 transition-opacity duration-700 ease-in-out opacity-0 dark:opacity-100"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  }
}
  },
  {
    name: 'overlay',
    rootNodeId: 'hero_hznc6f5',
    nodeData: {
  "hero_hznc6f5": {
    "id": "hero_hznc6f5",
    "type": "Hudbird_Hero",
    "name": "Hero",
    "parentId": null,
    "props": {
      "size": "full",
      "withBlobs": false
    },
    "childrenIds": [
      "herobackground_blot16i",
      "heroheader_2n5bbvb",
      "herobody_5rgnjac"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herobackground_blot16i": {
    "id": "herobackground_blot16i",
    "type": "Hudbird_HeroBackground",
    "name": "HeroBackground",
    "parentId": "hero_hznc6f5",
    "props": {
      "src": "/assets/marketing-section/hero-bg.webp",
      "overlayClassName": "bg-zinc-900/80 dark:bg-zinc-950/90 backdrop-blur-sm"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "heroheader_2n5bbvb": {
    "id": "heroheader_2n5bbvb",
    "type": "Hudbird_HeroHeader",
    "name": "HeroHeader",
    "parentId": "hero_hznc6f5",
    "props": {
      "links": [
        {
          "label": "Product",
          "href": "#"
        },
        {
          "label": "Features",
          "href": "#"
        }
      ],
      "className": "[&_a]:text-white [&_button]:text-white"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herobody_5rgnjac": {
    "id": "herobody_5rgnjac",
    "type": "Hudbird_HeroBody",
    "name": "HeroBody",
    "parentId": "hero_hznc6f5",
    "props": {
      "align": "center"
    },
    "childrenIds": [
      "herobadge_1q205fs",
      "herotitle_oba8qg9",
      "herodescription_hzytxdf",
      "heroactions_uxdvh2d"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herobadge_1q205fs": {
    "id": "herobadge_1q205fs",
    "type": "Hudbird_HeroBadge",
    "name": "HeroBadge",
    "parentId": "herobody_5rgnjac",
    "props": {
      "className": "text-zinc-200 ring-white/20 hover:ring-white/30 bg-white/10 backdrop-blur-md",
      "children": "Available now"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herotitle_oba8qg9": {
    "id": "herotitle_oba8qg9",
    "type": "Hudbird_HeroTitle",
    "name": "HeroTitle",
    "parentId": "herobody_5rgnjac",
    "props": {
      "className": "text-white",
      "children": "Experience the future"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herodescription_hzytxdf": {
    "id": "herodescription_hzytxdf",
    "type": "Hudbird_HeroDescription",
    "name": "HeroDescription",
    "parentId": "herobody_5rgnjac",
    "props": {
      "className": "text-zinc-300 max-w-xl mx-auto",
      "children": "Immersive, full-screen background images create a stunning first impression for your marketing campaigns."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "heroactions_uxdvh2d": {
    "id": "heroactions_uxdvh2d",
    "type": "Hudbird_HeroActions",
    "name": "HeroActions",
    "parentId": "herobody_5rgnjac",
    "props": {
      "className": "justify-center"
    },
    "childrenIds": [
      "button_o5ysgt5",
      "button_y58u4ic"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "button_o5ysgt5": {
    "id": "button_o5ysgt5",
    "type": "Hudbird_Button",
    "name": "Button",
    "parentId": "heroactions_uxdvh2d",
    "props": {
      "color": "primary",
      "children": "Get started"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "button_y58u4ic": {
    "id": "button_y58u4ic",
    "type": "Hudbird_Button",
    "name": "Button",
    "parentId": "heroactions_uxdvh2d",
    "props": {
      "variant": "plain",
      "className": "text-white hover:bg-white/10",
      "children": "Watch video"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  }
}
  },
  {
    name: 'three',
    rootNodeId: 'hero_d8262qt',
    nodeData: {
  "hero_d8262qt": {
    "id": "hero_d8262qt",
    "type": "Hudbird_Hero",
    "name": "Hero",
    "parentId": null,
    "props": {
      "size": "full",
      "withBlobs": false
    },
    "childrenIds": [
      "heroheader_n11716z",
      "herobody_vaet4v1"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "heroheader_n11716z": {
    "id": "heroheader_n11716z",
    "type": "Hudbird_HeroHeader",
    "name": "HeroHeader",
    "parentId": "hero_d8262qt",
    "props": {
      "links": [
        {
          "label": "Product",
          "href": "#"
        },
        {
          "label": "Features",
          "href": "#"
        }
      ],
      "className": "[&_a]:text-white [&_button]:text-white"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herobody_vaet4v1": {
    "id": "herobody_vaet4v1",
    "type": "Hudbird_HeroBody",
    "name": "HeroBody",
    "parentId": "hero_d8262qt",
    "props": {
      "align": "center"
    },
    "childrenIds": [
      "herobadge_0p9o8bh",
      "herotitle_j34a961",
      "herodescription_2jqg7df",
      "heroactions_fu0l6rv"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herobadge_0p9o8bh": {
    "id": "herobadge_0p9o8bh",
    "type": "Hudbird_HeroBadge",
    "name": "HeroBadge",
    "parentId": "herobody_vaet4v1",
    "props": {
      "className": "text-zinc-200 ring-white/20 hover:ring-white/30 bg-white/10 backdrop-blur-md",
      "children": "Interactive WebGL"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herotitle_j34a961": {
    "id": "herotitle_j34a961",
    "type": "Hudbird_HeroTitle",
    "name": "HeroTitle",
    "parentId": "herobody_vaet4v1",
    "props": {
      "className": "text-white",
      "children": "Stand out from the crowd"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herodescription_2jqg7df": {
    "id": "herodescription_2jqg7df",
    "type": "Hudbird_HeroDescription",
    "name": "HeroDescription",
    "parentId": "herobody_vaet4v1",
    "props": {
      "className": "text-zinc-300 max-w-xl mx-auto",
      "children": "Add a premium touch with high-performance 3D particle backgrounds powered by React Three Fiber."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "heroactions_fu0l6rv": {
    "id": "heroactions_fu0l6rv",
    "type": "Hudbird_HeroActions",
    "name": "HeroActions",
    "parentId": "herobody_vaet4v1",
    "props": {
      "className": "justify-center"
    },
    "childrenIds": [
      "button_17f9cuf"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "button_17f9cuf": {
    "id": "button_17f9cuf",
    "type": "Hudbird_Button",
    "name": "Button",
    "parentId": "heroactions_fu0l6rv",
    "props": {
      "color": "primary",
      "children": "Get started"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  }
}
  },
  {
    name: 'fullImageSplit',
    rootNodeId: 'hero_klcu1me',
    nodeData: {
  "hero_klcu1me": {
    "id": "hero_klcu1me",
    "type": "Hudbird_Hero",
    "name": "Hero",
    "parentId": null,
    "props": {
      "size": "full",
      "withBlobs": false,
      "className": "bg-zinc-50 dark:bg-zinc-950 p-0 overflow-hidden"
    },
    "childrenIds": [
      "div_ndmco2m"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_ndmco2m": {
    "id": "div_ndmco2m",
    "type": "Frame",
    "name": "div",
    "parentId": "hero_klcu1me",
    "props": {
      "className": "grid lg:grid-cols-2 min-h-screen"
    },
    "childrenIds": [
      "div_ym9i1ue",
      "div_z0wyxd1"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_ym9i1ue": {
    "id": "div_ym9i1ue",
    "type": "Frame",
    "name": "div",
    "parentId": "div_ndmco2m",
    "props": {
      "className": "flex flex-col px-6 sm:px-12 xl:px-24 pt-8 pb-16 justify-center relative z-10 min-h-[50vh]"
    },
    "childrenIds": [
      "heroheader_nwucwx6",
      "herocontent_ujcr9eu",
      "div_ohppma2"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "heroheader_nwucwx6": {
    "id": "heroheader_nwucwx6",
    "type": "Hudbird_HeroHeader",
    "name": "HeroHeader",
    "parentId": "div_ym9i1ue",
    "props": {
      "links": [
        {
          "label": "Product",
          "href": "#"
        },
        {
          "label": "Features",
          "href": "#"
        }
      ],
      "className": "mb-auto pb-12 w-full max-w-xl mx-auto"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herocontent_ujcr9eu": {
    "id": "herocontent_ujcr9eu",
    "type": "Hudbird_HeroContent",
    "name": "HeroContent",
    "parentId": "div_ym9i1ue",
    "props": {
      "align": "left",
      "className": "max-w-xl mx-auto"
    },
    "childrenIds": [
      "div_xmhrxo0",
      "div_ai2iqdz",
      "p_ixdwwo1",
      "div_sia2ah5"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_xmhrxo0": {
    "id": "div_xmhrxo0",
    "type": "Frame",
    "name": "div",
    "parentId": "herocontent_ujcr9eu",
    "props": {
      "className": "inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 px-3 py-1 text-sm text-zinc-600 dark:text-zinc-300 backdrop-blur-md mb-6"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_ai2iqdz": {
    "id": "div_ai2iqdz",
    "type": "Frame",
    "name": "div",
    "parentId": "herocontent_ujcr9eu",
    "props": {
      "className": "mb-3 flex items-center gap-3"
    },
    "childrenIds": [
      "h1_y3npdda",
      "span_y5sb2lb"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "h1_y3npdda": {
    "id": "h1_y3npdda",
    "type": "Text",
    "name": "h1",
    "parentId": "div_ai2iqdz",
    "props": {
      "className": "text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50",
      "children": "Redefining digital experiences."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "span_y5sb2lb": {
    "id": "span_y5sb2lb",
    "type": "Text",
    "name": "span",
    "parentId": "div_ai2iqdz",
    "props": {
      "className": "rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400",
      "children": "New"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "p_ixdwwo1": {
    "id": "p_ixdwwo1",
    "type": "Text",
    "name": "p",
    "parentId": "herocontent_ujcr9eu",
    "props": {
      "className": "text-base text-zinc-600 dark:text-zinc-400 pr-32 sm:pr-40",
      "children": "Create breathtaking web experiences that engage users and drive conversions with our expertly crafted UI toolkit."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_sia2ah5": {
    "id": "div_sia2ah5",
    "type": "Frame",
    "name": "div",
    "parentId": "herocontent_ujcr9eu",
    "props": {
      "className": "flex items-center gap-4"
    },
    "childrenIds": [
      "button_0acvln7",
      "button_coa1vck"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "button_0acvln7": {
    "id": "button_0acvln7",
    "type": "Hudbird_Button",
    "name": "Button",
    "parentId": "div_sia2ah5",
    "props": {
      "color": "primary",
      "className": "flex items-center gap-1 shadow-lg shadow-primary/20",
      "children": "Get Started"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "button_coa1vck": {
    "id": "button_coa1vck",
    "type": "Hudbird_Button",
    "name": "Button",
    "parentId": "div_sia2ah5",
    "props": {
      "variant": "light",
      "className": "font-semibold text-zinc-700 dark:text-zinc-300",
      "children": "View Demo"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_ohppma2": {
    "id": "div_ohppma2",
    "type": "Frame",
    "name": "div",
    "parentId": "div_ym9i1ue",
    "props": {
      "className": "mt-auto"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_z0wyxd1": {
    "id": "div_z0wyxd1",
    "type": "Frame",
    "name": "div",
    "parentId": "div_ndmco2m",
    "props": {
      "className": "relative w-full h-full min-h-[50vh] lg:min-h-screen border-l border-zinc-200 dark:border-zinc-800"
    },
    "childrenIds": [
      "img_hqujgdg"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "img_hqujgdg": {
    "id": "img_hqujgdg",
    "type": "img",
    "name": "img",
    "parentId": "div_z0wyxd1",
    "props": {
      "src": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069",
      "alt": "Office Minimalist",
      "className": "absolute inset-0 w-full h-full object-cover"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  }
}
  },
  {
    name: 'bentoGrid',
    rootNodeId: 'hero_dzckjdg',
    nodeData: {
  "hero_dzckjdg": {
    "id": "hero_dzckjdg",
    "type": "Hudbird_Hero",
    "name": "Hero",
    "parentId": null,
    "props": {
      "size": "full",
      "withBlobs": true,
      "className": "bg-zinc-50 dark:bg-zinc-950 overflow-hidden"
    },
    "childrenIds": [
      "heroheader_5rp878s",
      "herobody_e91ye8k"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "heroheader_5rp878s": {
    "id": "heroheader_5rp878s",
    "type": "Hudbird_HeroHeader",
    "name": "HeroHeader",
    "parentId": "hero_dzckjdg",
    "props": {
      "links": [
        {
          "label": "Products",
          "href": "#"
        },
        {
          "label": "App",
          "href": "#"
        },
        {
          "label": "About",
          "href": "#"
        },
        {
          "label": "FAQ",
          "href": "#"
        }
      ]
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herobody_e91ye8k": {
    "id": "herobody_e91ye8k",
    "type": "Hudbird_HeroBody",
    "name": "HeroBody",
    "parentId": "hero_dzckjdg",
    "props": {
      "className": "pt-10"
    },
    "childrenIds": [
      "div_yf2rjd8"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_yf2rjd8": {
    "id": "div_yf2rjd8",
    "type": "Frame",
    "name": "div",
    "parentId": "herobody_e91ye8k",
    "props": {
      "className": "w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 p-4"
    },
    "childrenIds": [
      "motion_div_hq5a6mz",
      "div_aqjfare"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "motion_div_hq5a6mz": {
    "id": "motion_div_hq5a6mz",
    "type": "motion.div",
    "name": "motion.div",
    "parentId": "div_yf2rjd8",
    "props": {
      "initial": {
        "opacity": 0,
        "y": 20
      },
      "whileInView": {
        "opacity": 1,
        "y": 0
      },
      "viewport": {
        "once": true
      },
      "transition": {
        "duration": 0.5,
        "ease": "easeOut"
      },
      "className": "md:col-span-12 lg:col-span-7 bg-[#111] dark:bg-black rounded-[2rem] p-8 sm:p-12 min-h-[450px] flex flex-col justify-between relative overflow-hidden group"
    },
    "childrenIds": [
      "div_8c85zlg",
      "div_8mrzzzo",
      "div_z2o4v07"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_8c85zlg": {
    "id": "div_8c85zlg",
    "type": "Frame",
    "name": "div",
    "parentId": "motion_div_hq5a6mz",
    "props": {
      "className": "relative z-10 text-white max-w-md"
    },
    "childrenIds": [
      "div_64448eo",
      "h2_pdvck57"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_64448eo": {
    "id": "div_64448eo",
    "type": "Frame",
    "name": "div",
    "parentId": "div_8c85zlg",
    "props": {
      "className": "text-xs font-semibold tracking-wider text-zinc-400 mb-4 uppercase"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "h2_pdvck57": {
    "id": "h2_pdvck57",
    "type": "Text",
    "name": "h2",
    "parentId": "div_8c85zlg",
    "props": {
      "className": "text-4xl sm:text-5xl font-medium tracking-tight leading-[1.1] mb-8",
      "children": "Hudbird UI is built on top of modern web technologies"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_8mrzzzo": {
    "id": "div_8mrzzzo",
    "type": "Frame",
    "name": "div",
    "parentId": "motion_div_hq5a6mz",
    "props": {
      "className": "relative z-10 mt-12 sm:mt-0"
    },
    "childrenIds": [
      "div_1ykngno"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_1ykngno": {
    "id": "div_1ykngno",
    "type": "Frame",
    "name": "div",
    "parentId": "div_8mrzzzo",
    "props": {
      "className": "bg-white text-black inline-flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-semibold shadow-lg hover:bg-zinc-100 transition-colors cursor-pointer"
    },
    "childrenIds": [
      "span_j4waivq",
      "svg_jt2oxfu"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "span_j4waivq": {
    "id": "span_j4waivq",
    "type": "Text",
    "name": "span",
    "parentId": "div_1ykngno",
    "props": {
      "children": "Explore editor"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "svg_jt2oxfu": {
    "id": "svg_jt2oxfu",
    "type": "svg",
    "name": "svg",
    "parentId": "div_1ykngno",
    "props": {
      "width": "18",
      "height": "18",
      "viewBox": "0 0 24 24",
      "fill": "none",
      "stroke": "currentColor",
      "strokeWidth": "2"
    },
    "childrenIds": [
      "path_p254tw9",
      "line_zzc6dt8",
      "path_vlyebez"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "path_p254tw9": {
    "id": "path_p254tw9",
    "type": "path",
    "name": "path",
    "parentId": "svg_jt2oxfu",
    "props": {
      "d": "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "line_zzc6dt8": {
    "id": "line_zzc6dt8",
    "type": "line",
    "name": "line",
    "parentId": "svg_jt2oxfu",
    "props": {
      "x1": "3",
      "y1": "6",
      "x2": "21",
      "y2": "6"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "path_vlyebez": {
    "id": "path_vlyebez",
    "type": "path",
    "name": "path",
    "parentId": "svg_jt2oxfu",
    "props": {
      "d": "M16 10a4 4 0 0 1-8 0"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_z2o4v07": {
    "id": "div_z2o4v07",
    "type": "Frame",
    "name": "div",
    "parentId": "motion_div_hq5a6mz",
    "props": {
      "className": "absolute -right-4 -bottom-4 sm:right-4 sm:bottom-4 w-full max-w-[320px] h-[280px] bg-zinc-900 rounded-xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden opacity-90 group-hover:scale-105 group-hover:-translate-y-2 transition-transform duration-700 pointer-events-none"
    },
    "childrenIds": [
      "div_i408djk",
      "div_3wemv8a"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_i408djk": {
    "id": "div_i408djk",
    "type": "Frame",
    "name": "div",
    "parentId": "div_z2o4v07",
    "props": {
      "className": "h-8 border-b border-zinc-800 flex items-center px-3 gap-1.5 bg-zinc-900/50"
    },
    "childrenIds": [
      "div_uvjkwgz",
      "div_4gramzf",
      "div_690da9n"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_uvjkwgz": {
    "id": "div_uvjkwgz",
    "type": "Frame",
    "name": "div",
    "parentId": "div_i408djk",
    "props": {
      "className": "w-2.5 h-2.5 rounded-full bg-red-500/80"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_4gramzf": {
    "id": "div_4gramzf",
    "type": "Frame",
    "name": "div",
    "parentId": "div_i408djk",
    "props": {
      "className": "w-2.5 h-2.5 rounded-full bg-yellow-500/80"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_690da9n": {
    "id": "div_690da9n",
    "type": "Frame",
    "name": "div",
    "parentId": "div_i408djk",
    "props": {
      "className": "w-2.5 h-2.5 rounded-full bg-green-500/80"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_3wemv8a": {
    "id": "div_3wemv8a",
    "type": "Frame",
    "name": "div",
    "parentId": "div_z2o4v07",
    "props": {
      "className": "flex-1 flex bg-zinc-950 p-4 gap-4"
    },
    "childrenIds": [
      "div_9lgfgcc",
      "div_f4jl9ee"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_9lgfgcc": {
    "id": "div_9lgfgcc",
    "type": "Frame",
    "name": "div",
    "parentId": "div_3wemv8a",
    "props": {
      "className": "flex-1 border border-zinc-800/50 rounded-lg flex items-center justify-center relative overflow-hidden bg-zinc-900/20"
    },
    "childrenIds": [
      "motion_div_052dvnm"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "motion_div_052dvnm": {
    "id": "motion_div_052dvnm",
    "type": "motion.div",
    "name": "motion.div",
    "parentId": "div_9lgfgcc",
    "props": {
      "animate": {
        "scale": [
          1,
          1.1,
          1
        ],
        "rotate": [
          0,
          5,
          0
        ]
      },
      "transition": {
        "duration": 6,
        "ease": "easeInOut"
      },
      "className": "w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center"
    },
    "childrenIds": [
      "div_13efg1h"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_13efg1h": {
    "id": "div_13efg1h",
    "type": "Frame",
    "name": "div",
    "parentId": "motion_div_052dvnm",
    "props": {
      "className": "w-8 h-8 rounded-full bg-indigo-400 blur-sm"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_f4jl9ee": {
    "id": "div_f4jl9ee",
    "type": "Frame",
    "name": "div",
    "parentId": "div_3wemv8a",
    "props": {
      "className": "w-20 space-y-3"
    },
    "childrenIds": [
      "div_rgwg1i7",
      "motion_div_es8tqz6",
      "div_19wff73",
      "div_4cfnkbe",
      "div_txyp8qs",
      "div_pz3zkfm"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_rgwg1i7": {
    "id": "div_rgwg1i7",
    "type": "Frame",
    "name": "div",
    "parentId": "div_f4jl9ee",
    "props": {
      "className": "h-3 bg-zinc-800 rounded w-full"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "motion_div_es8tqz6": {
    "id": "motion_div_es8tqz6",
    "type": "motion.div",
    "name": "motion.div",
    "parentId": "div_f4jl9ee",
    "props": {
      "animate": {
        "width": [
          "100%",
          "60%",
          "100%"
        ]
      },
      "transition": {
        "duration": 4,
        "ease": "easeInOut"
      },
      "className": "h-2 bg-zinc-800 rounded"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_19wff73": {
    "id": "div_19wff73",
    "type": "Frame",
    "name": "div",
    "parentId": "div_f4jl9ee",
    "props": {
      "className": "h-2 bg-zinc-800 rounded w-4/5"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_4cfnkbe": {
    "id": "div_4cfnkbe",
    "type": "Frame",
    "name": "div",
    "parentId": "div_f4jl9ee",
    "props": {
      "className": "h-2 bg-zinc-800 rounded w-full"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_txyp8qs": {
    "id": "div_txyp8qs",
    "type": "Frame",
    "name": "div",
    "parentId": "div_f4jl9ee",
    "props": {
      "className": "h-2 bg-zinc-800 rounded w-3/4"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_pz3zkfm": {
    "id": "div_pz3zkfm",
    "type": "Frame",
    "name": "div",
    "parentId": "div_f4jl9ee",
    "props": {
      "className": "mt-6 space-y-2"
    },
    "childrenIds": [
      "div_5ehwyl3",
      "div_z4r8hc7"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_5ehwyl3": {
    "id": "div_5ehwyl3",
    "type": "Frame",
    "name": "div",
    "parentId": "div_pz3zkfm",
    "props": {
      "className": "flex justify-between items-center"
    },
    "childrenIds": [
      "div_3iupj3w",
      "div_4qud5fj"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_3iupj3w": {
    "id": "div_3iupj3w",
    "type": "Frame",
    "name": "div",
    "parentId": "div_5ehwyl3",
    "props": {
      "className": "w-5 h-5 rounded bg-zinc-800"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_4qud5fj": {
    "id": "div_4qud5fj",
    "type": "Frame",
    "name": "div",
    "parentId": "div_5ehwyl3",
    "props": {
      "className": "w-10 h-5 rounded bg-zinc-800"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_z4r8hc7": {
    "id": "div_z4r8hc7",
    "type": "Frame",
    "name": "div",
    "parentId": "div_pz3zkfm",
    "props": {
      "className": "flex justify-between items-center"
    },
    "childrenIds": [
      "div_pnyoo4p",
      "div_kbwq0yx"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_pnyoo4p": {
    "id": "div_pnyoo4p",
    "type": "Frame",
    "name": "div",
    "parentId": "div_z4r8hc7",
    "props": {
      "className": "w-5 h-5 rounded bg-zinc-800"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_kbwq0yx": {
    "id": "div_kbwq0yx",
    "type": "Frame",
    "name": "div",
    "parentId": "div_z4r8hc7",
    "props": {
      "className": "w-10 h-5 rounded bg-zinc-800"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_aqjfare": {
    "id": "div_aqjfare",
    "type": "Frame",
    "name": "div",
    "parentId": "div_yf2rjd8",
    "props": {
      "className": "md:col-span-12 lg:col-span-5 grid grid-cols-2 grid-rows-2 gap-4 lg:gap-6"
    },
    "childrenIds": [
      "motion_div_t9ysf7u",
      "motion_div_8xusozl",
      "motion_div_z8cjbmz"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "motion_div_t9ysf7u": {
    "id": "motion_div_t9ysf7u",
    "type": "motion.div",
    "name": "motion.div",
    "parentId": "div_aqjfare",
    "props": {
      "initial": {
        "opacity": 0,
        "y": 20
      },
      "whileInView": {
        "opacity": 1,
        "y": 0
      },
      "viewport": {
        "once": true
      },
      "transition": {
        "duration": 0.5,
        "delay": 0.1,
        "ease": "easeOut"
      },
      "className": "col-span-2 row-span-1 bg-zinc-200/50 dark:bg-zinc-900 rounded-[2rem] p-6 relative overflow-hidden group hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
    },
    "childrenIds": [
      "div_cbxxvsg",
      "h3_yfqbn20",
      "div_8mz1vry",
      "div_5cu529g"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_cbxxvsg": {
    "id": "div_cbxxvsg",
    "type": "Frame",
    "name": "div",
    "parentId": "motion_div_t9ysf7u",
    "props": {
      "className": "text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 relative z-10"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "h3_yfqbn20": {
    "id": "h3_yfqbn20",
    "type": "Text",
    "name": "h3",
    "parentId": "motion_div_t9ysf7u",
    "props": {
      "className": "text-3xl font-medium text-zinc-900 dark:text-white mt-4 relative z-10",
      "children": "Layer Management"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_8mz1vry": {
    "id": "div_8mz1vry",
    "type": "Frame",
    "name": "div",
    "parentId": "motion_div_t9ysf7u",
    "props": {
      "className": "mt-8 space-y-3 relative z-10"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_5cu529g": {
    "id": "div_5cu529g",
    "type": "Frame",
    "name": "div",
    "parentId": "motion_div_t9ysf7u",
    "props": {
      "className": "absolute -bottom-10 -right-10 w-48 h-48 bg-zinc-300 dark:bg-zinc-700 rounded-full blur-xl opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "motion_div_8xusozl": {
    "id": "motion_div_8xusozl",
    "type": "motion.div",
    "name": "motion.div",
    "parentId": "div_aqjfare",
    "props": {
      "initial": {
        "opacity": 0,
        "y": 20
      },
      "whileInView": {
        "opacity": 1,
        "y": 0
      },
      "viewport": {
        "once": true
      },
      "transition": {
        "duration": 0.5,
        "delay": 0.2,
        "ease": "easeOut"
      },
      "className": "col-span-1 row-span-1 bg-[#a77dfa] rounded-[2rem] p-6 flex flex-col justify-between relative overflow-hidden group hover:bg-[#9760ff] transition-colors"
    },
    "childrenIds": [
      "div_tub3wot",
      "div_gvvybdt"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_tub3wot": {
    "id": "div_tub3wot",
    "type": "Frame",
    "name": "div",
    "parentId": "motion_div_8xusozl",
    "props": {},
    "childrenIds": [
      "div_yqhxb6o",
      "h3_6tlhesv"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_yqhxb6o": {
    "id": "div_yqhxb6o",
    "type": "Frame",
    "name": "div",
    "parentId": "div_tub3wot",
    "props": {
      "className": "text-[10px] font-bold text-white/70 uppercase tracking-wider mb-2 relative z-10"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "h3_6tlhesv": {
    "id": "h3_6tlhesv",
    "type": "Text",
    "name": "h3",
    "parentId": "div_tub3wot",
    "props": {
      "className": "text-2xl font-medium text-white relative z-10",
      "children": "Colors"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_gvvybdt": {
    "id": "div_gvvybdt",
    "type": "Frame",
    "name": "div",
    "parentId": "motion_div_8xusozl",
    "props": {
      "className": "mt-6 flex gap-2 relative z-10 justify-center"
    },
    "childrenIds": [
      "motion_div_uhn3rlv",
      "motion_div_xlj3nzi",
      "motion_div_mx2o5f5"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "motion_div_uhn3rlv": {
    "id": "motion_div_uhn3rlv",
    "type": "motion.div",
    "name": "motion.div",
    "parentId": "div_gvvybdt",
    "props": {
      "animate": {
        "y": [
          0,
          0
        ]
      },
      "transition": {
        "duration": 2,
        "ease": "easeInOut"
      },
      "className": "w-10 h-10 rounded-full bg-white shadow-lg border-4 border-purple-200"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "motion_div_xlj3nzi": {
    "id": "motion_div_xlj3nzi",
    "type": "motion.div",
    "name": "motion.div",
    "parentId": "div_gvvybdt",
    "props": {
      "animate": {
        "y": [
          0,
          0
        ]
      },
      "transition": {
        "duration": 2,
        "delay": 0.2,
        "ease": "easeInOut"
      },
      "className": "w-10 h-10 rounded-full bg-black shadow-lg border-4 border-purple-800"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "motion_div_mx2o5f5": {
    "id": "motion_div_mx2o5f5",
    "type": "motion.div",
    "name": "motion.div",
    "parentId": "div_gvvybdt",
    "props": {
      "animate": {
        "y": [
          0,
          0
        ]
      },
      "transition": {
        "duration": 2,
        "delay": 0.4,
        "ease": "easeInOut"
      },
      "className": "w-10 h-10 rounded-full bg-[#a3ff47] shadow-lg border-4 border-[#8cee2c]"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "motion_div_z8cjbmz": {
    "id": "motion_div_z8cjbmz",
    "type": "motion.div",
    "name": "motion.div",
    "parentId": "div_aqjfare",
    "props": {
      "initial": {
        "opacity": 0,
        "y": 20
      },
      "whileInView": {
        "opacity": 1,
        "y": 0
      },
      "viewport": {
        "once": true
      },
      "transition": {
        "duration": 0.5,
        "delay": 0.3,
        "ease": "easeOut"
      },
      "className": "col-span-1 row-span-1 bg-[#a3ff47] rounded-[2rem] p-6 flex flex-col justify-between relative overflow-hidden group hover:bg-[#8cee2c] transition-colors"
    },
    "childrenIds": [
      "div_yijcl5e",
      "div_7ev8iiw"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_yijcl5e": {
    "id": "div_yijcl5e",
    "type": "Frame",
    "name": "div",
    "parentId": "motion_div_z8cjbmz",
    "props": {},
    "childrenIds": [
      "div_xq3y2ng",
      "h3_z8dadwm"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_xq3y2ng": {
    "id": "div_xq3y2ng",
    "type": "Frame",
    "name": "div",
    "parentId": "div_yijcl5e",
    "props": {
      "className": "text-[10px] font-bold text-black/60 uppercase tracking-wider mb-2 relative z-10"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "h3_z8dadwm": {
    "id": "h3_z8dadwm",
    "type": "Text",
    "name": "h3",
    "parentId": "div_yijcl5e",
    "props": {
      "className": "text-2xl font-medium text-black relative z-10",
      "children": "Responsive"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_7ev8iiw": {
    "id": "div_7ev8iiw",
    "type": "Frame",
    "name": "div",
    "parentId": "motion_div_z8cjbmz",
    "props": {
      "className": "mt-8 flex items-end justify-center gap-3 relative z-10"
    },
    "childrenIds": [
      "motion_div_w1y7sq4",
      "motion_div_styk1am",
      "motion_div_ousfnvs"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "motion_div_w1y7sq4": {
    "id": "motion_div_w1y7sq4",
    "type": "motion.div",
    "name": "motion.div",
    "parentId": "div_7ev8iiw",
    "props": {
      "animate": {
        "height": [
          "40px",
          "60px",
          "40px"
        ]
      },
      "transition": {
        "duration": 3,
        "ease": "easeInOut"
      },
      "className": "w-8 bg-black/80 rounded-t-lg"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "motion_div_styk1am": {
    "id": "motion_div_styk1am",
    "type": "motion.div",
    "name": "motion.div",
    "parentId": "div_7ev8iiw",
    "props": {
      "animate": {
        "height": [
          "60px",
          "80px",
          "60px"
        ]
      },
      "transition": {
        "duration": 3,
        "delay": 0.5,
        "ease": "easeInOut"
      },
      "className": "w-12 bg-black/60 rounded-t-lg"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "motion_div_ousfnvs": {
    "id": "motion_div_ousfnvs",
    "type": "motion.div",
    "name": "motion.div",
    "parentId": "div_7ev8iiw",
    "props": {
      "animate": {
        "height": [
          "30px",
          "50px",
          "30px"
        ]
      },
      "transition": {
        "duration": 3,
        "delay": 1,
        "ease": "easeInOut"
      },
      "className": "w-6 bg-black/40 rounded-t-lg"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  }
}
  },
];

hudbirdDocsTemplates['LogoCloud'] = [
  {
    name: 'staticGrid',
    rootNodeId: 'logocloud_1ubsn2r',
    nodeData: {
  "logocloud_1ubsn2r": {
    "id": "logocloud_1ubsn2r",
    "type": "Hudbird_LogoCloud",
    "name": "LogoCloud",
    "parentId": null,
    "props": {},
    "childrenIds": [
      "logocloudtitle_z3j8spq",
      "logocloudgrid_6w3t0mp"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "logocloudtitle_z3j8spq": {
    "id": "logocloudtitle_z3j8spq",
    "type": "Hudbird_LogoCloudTitle",
    "name": "LogoCloudTitle",
    "parentId": "logocloud_1ubsn2r",
    "props": {
      "children": "Trusted by the world's most innovative teams"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "logocloudgrid_6w3t0mp": {
    "id": "logocloudgrid_6w3t0mp",
    "type": "Hudbird_LogoCloudGrid",
    "name": "LogoCloudGrid",
    "parentId": "logocloud_1ubsn2r",
    "props": {},
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  }
}
  },
  {
    name: 'ticker',
    rootNodeId: 'logocloud_8ag0mup',
    nodeData: {
  "logocloud_8ag0mup": {
    "id": "logocloud_8ag0mup",
    "type": "Hudbird_LogoCloud",
    "name": "LogoCloud",
    "parentId": null,
    "props": {},
    "childrenIds": [
      "logocloudtitle_taqxxds",
      "logocloudticker_w3vu00p"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "logocloudtitle_taqxxds": {
    "id": "logocloudtitle_taqxxds",
    "type": "Hudbird_LogoCloudTitle",
    "name": "LogoCloudTitle",
    "parentId": "logocloud_8ag0mup",
    "props": {
      "children": "Join thousands of companies building with us"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "logocloudticker_w3vu00p": {
    "id": "logocloudticker_w3vu00p",
    "type": "Hudbird_LogoCloudTicker",
    "name": "LogoCloudTicker",
    "parentId": "logocloud_8ag0mup",
    "props": {
      "speed": "normal",
      "direction": "left"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  }
}
  },
];

hudbirdDocsTemplates['Pricing'] = [
  {
    name: 'threeTier',
    rootNodeId: 'pricingsection_md19q1p',
    nodeData: {
  "pricingsection_md19q1p": {
    "id": "pricingsection_md19q1p",
    "type": "Hudbird_PricingSection",
    "name": "PricingSection",
    "parentId": null,
    "props": {
      "variant": "subtle"
    },
    "childrenIds": [
      "pricingheader_ibcfbn1",
      "pricinggrid_yueeb46"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingheader_ibcfbn1": {
    "id": "pricingheader_ibcfbn1",
    "type": "Hudbird_PricingHeader",
    "name": "PricingHeader",
    "parentId": "pricingsection_md19q1p",
    "props": {},
    "childrenIds": [
      "pricingbadge_3s9secm",
      "pricingtitle_2u7wq6u",
      "pricingdescription_ftrn57b",
      "pricingtoggle_2k8fbaj"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingbadge_3s9secm": {
    "id": "pricingbadge_3s9secm",
    "type": "Hudbird_PricingBadge",
    "name": "PricingBadge",
    "parentId": "pricingheader_ibcfbn1",
    "props": {
      "children": "Pricing"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtitle_2u7wq6u": {
    "id": "pricingtitle_2u7wq6u",
    "type": "Hudbird_PricingTitle",
    "name": "PricingTitle",
    "parentId": "pricingheader_ibcfbn1",
    "props": {
      "children": "Pricing that grows with you"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingdescription_ftrn57b": {
    "id": "pricingdescription_ftrn57b",
    "type": "Hudbird_PricingDescription",
    "name": "PricingDescription",
    "parentId": "pricingheader_ibcfbn1",
    "props": {
      "children": "Choose an affordable plan that's packed with the best features for engaging your audience, creating customer loyalty, and driving sales."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtoggle_2k8fbaj": {
    "id": "pricingtoggle_2k8fbaj",
    "type": "Hudbird_PricingToggle",
    "name": "PricingToggle",
    "parentId": "pricingheader_ibcfbn1",
    "props": {},
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricinggrid_yueeb46": {
    "id": "pricinggrid_yueeb46",
    "type": "Hudbird_PricingGrid",
    "name": "PricingGrid",
    "parentId": "pricingsection_md19q1p",
    "props": {},
    "childrenIds": [
      "pricingtier_9bx1cng",
      "pricingtier_pfqmno8",
      "pricingtier_u8npk13"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtier_9bx1cng": {
    "id": "pricingtier_9bx1cng",
    "type": "Hudbird_PricingTier",
    "name": "PricingTier",
    "parentId": "pricinggrid_yueeb46",
    "props": {
      "index": 0
    },
    "childrenIds": [
      "pricingtierheader_0vzdhni",
      "button_2cy282m",
      "pricingtierfeatures_ftjvj1z"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierheader_0vzdhni": {
    "id": "pricingtierheader_0vzdhni",
    "type": "Hudbird_PricingTierHeader",
    "name": "PricingTierHeader",
    "parentId": "pricingtier_9bx1cng",
    "props": {},
    "childrenIds": [
      "pricingtiername_qc0vr4w",
      "pricingtierdescription_savgeo8",
      "pricingtierprice_m939k7t"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtiername_qc0vr4w": {
    "id": "pricingtiername_qc0vr4w",
    "type": "Hudbird_PricingTierName",
    "name": "PricingTierName",
    "parentId": "pricingtierheader_0vzdhni",
    "props": {
      "children": "Freelancer"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierdescription_savgeo8": {
    "id": "pricingtierdescription_savgeo8",
    "type": "Hudbird_PricingTierDescription",
    "name": "PricingTierDescription",
    "parentId": "pricingtierheader_0vzdhni",
    "props": {
      "children": "The essentials to provide your best work for clients."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierprice_m939k7t": {
    "id": "pricingtierprice_m939k7t",
    "type": "Hudbird_PricingTierPrice",
    "name": "PricingTierPrice",
    "parentId": "pricingtierheader_0vzdhni",
    "props": {},
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "button_2cy282m": {
    "id": "button_2cy282m",
    "type": "Hudbird_Button",
    "name": "Button",
    "parentId": "pricingtier_9bx1cng",
    "props": {
      "variant": "outline",
      "className": "w-full mt-2",
      "children": "Buy plan"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeatures_ftjvj1z": {
    "id": "pricingtierfeatures_ftjvj1z",
    "type": "Hudbird_PricingTierFeatures",
    "name": "PricingTierFeatures",
    "parentId": "pricingtier_9bx1cng",
    "props": {},
    "childrenIds": [
      "pricingtierfeature_hjikbru",
      "pricingtierfeature_syp2ouw",
      "pricingtierfeature_jc08tel",
      "pricingtierfeature_9p1jlts"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_hjikbru": {
    "id": "pricingtierfeature_hjikbru",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_ftjvj1z",
    "props": {
      "children": "5 products"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_syp2ouw": {
    "id": "pricingtierfeature_syp2ouw",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_ftjvj1z",
    "props": {
      "children": "Up to 1,000 subscribers"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_jc08tel": {
    "id": "pricingtierfeature_jc08tel",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_ftjvj1z",
    "props": {
      "children": "Basic analytics"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_9p1jlts": {
    "id": "pricingtierfeature_9p1jlts",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_ftjvj1z",
    "props": {
      "children": "48-hour support response time"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtier_pfqmno8": {
    "id": "pricingtier_pfqmno8",
    "type": "Hudbird_PricingTier",
    "name": "PricingTier",
    "parentId": "pricinggrid_yueeb46",
    "props": {
      "index": 1,
      "popular": true
    },
    "childrenIds": [
      "pricingtierheader_0lri7cf",
      "button_vp85yj7",
      "pricingtierfeatures_o1xz4cl"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierheader_0lri7cf": {
    "id": "pricingtierheader_0lri7cf",
    "type": "Hudbird_PricingTierHeader",
    "name": "PricingTierHeader",
    "parentId": "pricingtier_pfqmno8",
    "props": {},
    "childrenIds": [
      "pricingtiername_t13njxj",
      "pricingtierdescription_wxwfw2f",
      "pricingtierprice_xxkwsax"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtiername_t13njxj": {
    "id": "pricingtiername_t13njxj",
    "type": "Hudbird_PricingTierName",
    "name": "PricingTierName",
    "parentId": "pricingtierheader_0lri7cf",
    "props": {
      "popular": true,
      "children": "Startup"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierdescription_wxwfw2f": {
    "id": "pricingtierdescription_wxwfw2f",
    "type": "Hudbird_PricingTierDescription",
    "name": "PricingTierDescription",
    "parentId": "pricingtierheader_0lri7cf",
    "props": {
      "popular": true,
      "children": "A plan that scales with your rapidly growing business."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierprice_xxkwsax": {
    "id": "pricingtierprice_xxkwsax",
    "type": "Hudbird_PricingTierPrice",
    "name": "PricingTierPrice",
    "parentId": "pricingtierheader_0lri7cf",
    "props": {
      "popular": true
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "button_vp85yj7": {
    "id": "button_vp85yj7",
    "type": "Hudbird_Button",
    "name": "Button",
    "parentId": "pricingtier_pfqmno8",
    "props": {
      "color": "primary",
      "className": "w-full mt-2 ring-1 ring-white/20",
      "children": "Buy plan"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeatures_o1xz4cl": {
    "id": "pricingtierfeatures_o1xz4cl",
    "type": "Hudbird_PricingTierFeatures",
    "name": "PricingTierFeatures",
    "parentId": "pricingtier_pfqmno8",
    "props": {
      "popular": true
    },
    "childrenIds": [
      "pricingtierfeature_kjcfagx",
      "pricingtierfeature_qdi70r8",
      "pricingtierfeature_dz1eyr2",
      "pricingtierfeature_i51t91g",
      "pricingtierfeature_hnk34x5"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_kjcfagx": {
    "id": "pricingtierfeature_kjcfagx",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_o1xz4cl",
    "props": {
      "popular": true,
      "children": "25 products"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_qdi70r8": {
    "id": "pricingtierfeature_qdi70r8",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_o1xz4cl",
    "props": {
      "popular": true,
      "children": "Up to 10,000 subscribers"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_dz1eyr2": {
    "id": "pricingtierfeature_dz1eyr2",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_o1xz4cl",
    "props": {
      "popular": true,
      "children": "Advanced analytics"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_i51t91g": {
    "id": "pricingtierfeature_i51t91g",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_o1xz4cl",
    "props": {
      "popular": true,
      "children": "24-hour support response time"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_hnk34x5": {
    "id": "pricingtierfeature_hnk34x5",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_o1xz4cl",
    "props": {
      "popular": true,
      "children": "Marketing automations"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtier_u8npk13": {
    "id": "pricingtier_u8npk13",
    "type": "Hudbird_PricingTier",
    "name": "PricingTier",
    "parentId": "pricinggrid_yueeb46",
    "props": {
      "index": 2
    },
    "childrenIds": [
      "pricingtierheader_8k46hzf",
      "button_s1zrh58",
      "pricingtierfeatures_lnov9hz"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierheader_8k46hzf": {
    "id": "pricingtierheader_8k46hzf",
    "type": "Hudbird_PricingTierHeader",
    "name": "PricingTierHeader",
    "parentId": "pricingtier_u8npk13",
    "props": {},
    "childrenIds": [
      "pricingtiername_iw3qm21",
      "pricingtierdescription_zzab0e3",
      "pricingtierprice_jkher47"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtiername_iw3qm21": {
    "id": "pricingtiername_iw3qm21",
    "type": "Hudbird_PricingTierName",
    "name": "PricingTierName",
    "parentId": "pricingtierheader_8k46hzf",
    "props": {
      "children": "Enterprise"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierdescription_zzab0e3": {
    "id": "pricingtierdescription_zzab0e3",
    "type": "Hudbird_PricingTierDescription",
    "name": "PricingTierDescription",
    "parentId": "pricingtierheader_8k46hzf",
    "props": {
      "children": "Dedicated support and infrastructure for your company."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierprice_jkher47": {
    "id": "pricingtierprice_jkher47",
    "type": "Hudbird_PricingTierPrice",
    "name": "PricingTierPrice",
    "parentId": "pricingtierheader_8k46hzf",
    "props": {},
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "button_s1zrh58": {
    "id": "button_s1zrh58",
    "type": "Hudbird_Button",
    "name": "Button",
    "parentId": "pricingtier_u8npk13",
    "props": {
      "variant": "outline",
      "className": "w-full mt-2",
      "children": "Buy plan"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeatures_lnov9hz": {
    "id": "pricingtierfeatures_lnov9hz",
    "type": "Hudbird_PricingTierFeatures",
    "name": "PricingTierFeatures",
    "parentId": "pricingtier_u8npk13",
    "props": {},
    "childrenIds": [
      "pricingtierfeature_hxuevjp",
      "pricingtierfeature_hwe3g2j",
      "pricingtierfeature_n138mqu",
      "pricingtierfeature_589ckv5",
      "pricingtierfeature_r81vtqq",
      "pricingtierfeature_05i6fcc"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_hxuevjp": {
    "id": "pricingtierfeature_hxuevjp",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_lnov9hz",
    "props": {
      "children": "Unlimited products"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_hwe3g2j": {
    "id": "pricingtierfeature_hwe3g2j",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_lnov9hz",
    "props": {
      "children": "Unlimited subscribers"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_n138mqu": {
    "id": "pricingtierfeature_n138mqu",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_lnov9hz",
    "props": {
      "children": "Advanced analytics"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_589ckv5": {
    "id": "pricingtierfeature_589ckv5",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_lnov9hz",
    "props": {
      "children": "1-hour, dedicated support response time"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_r81vtqq": {
    "id": "pricingtierfeature_r81vtqq",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_lnov9hz",
    "props": {
      "children": "Marketing automations"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_05i6fcc": {
    "id": "pricingtierfeature_05i6fcc",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_lnov9hz",
    "props": {
      "children": "Custom reporting tools"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  }
}
  },
];

hudbirdDocsTemplates['FullTemplates'] = [
  {
    name: 'DigitalAgencyTemplate',
    rootNodeId: 'div_v1f86vh',
    nodeData: {
  "div_v1f86vh": {
    "id": "div_v1f86vh",
    "type": "Frame",
    "name": "div",
    "parentId": null,
    "props": {
      "className": "relative flex min-h-screen w-full flex-col overflow-hidden bg-zinc-50 font-sans selection:bg-purple-500/30 dark:bg-zinc-950"
    },
    "childrenIds": [
      "div_410sj7k",
      "div_yg0u7vd",
      "div_6e7r9lg"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_410sj7k": {
    "id": "div_410sj7k",
    "type": "Frame",
    "name": "div",
    "parentId": "div_v1f86vh",
    "props": {
      "className": "pointer-events-none fixed top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-purple-400/30 blur-[120px] dark:bg-purple-600/20"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_yg0u7vd": {
    "id": "div_yg0u7vd",
    "type": "Frame",
    "name": "div",
    "parentId": "div_v1f86vh",
    "props": {
      "className": "pointer-events-none fixed right-[-10%] bottom-[-10%] h-[50%] w-[50%] rounded-full bg-pink-400/30 blur-[120px] dark:bg-pink-600/20"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_6e7r9lg": {
    "id": "div_6e7r9lg",
    "type": "Frame",
    "name": "div",
    "parentId": "div_v1f86vh",
    "props": {
      "className": "relative z-10 flex flex-col"
    },
    "childrenIds": [
      "heroheader_73i0nn1",
      "heroglass_g0cfy3t",
      "div_h0idkj5",
      "div_5izgd79",
      "div_ispk170",
      "div_jsdiuqm",
      "footermega_8zczv2c"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "heroheader_73i0nn1": {
    "id": "heroheader_73i0nn1",
    "type": "Hudbird_HeroHeader",
    "name": "HeroHeader",
    "parentId": "div_6e7r9lg",
    "props": {
      "className": "relative sticky top-0 z-50 border-b border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/60",
      "links": [
        {
          "label": "Work",
          "href": "#",
          "className": "text-zinc-700 font-medium dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        },
        {
          "label": "Studio",
          "href": "#",
          "className": "text-zinc-700 font-medium dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        },
        {
          "label": "Contact",
          "href": "#",
          "className": "text-zinc-700 font-medium dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        }
      ]
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "heroglass_g0cfy3t": {
    "id": "heroglass_g0cfy3t",
    "type": "Hudbird_HeroGlass",
    "name": "HeroGlass",
    "parentId": "div_6e7r9lg",
    "props": {
      "className": "border-b border-zinc-200/50 bg-transparent py-32 dark:border-white/5 dark:bg-transparent",
      "description": "Neon Studio is a creative design and engineering agency based in New York. We partner with ambitious brands to create digital products that push boundaries."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_h0idkj5": {
    "id": "div_h0idkj5",
    "type": "Frame",
    "name": "div",
    "parentId": "div_6e7r9lg",
    "props": {
      "className": "relative border-b border-zinc-200/50 py-12 dark:border-white/5"
    },
    "childrenIds": [
      "bentogridglass_unh8qzn"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "bentogridglass_unh8qzn": {
    "id": "bentogridglass_unh8qzn",
    "type": "Hudbird_BentoGridGlass",
    "name": "BentoGridGlass",
    "parentId": "div_h0idkj5",
    "props": {
      "description": "A curated selection of our recent digital projects spanning branding, web design, and product engineering.",
      "items": [
        {
          "title": "Lumina Fragrances",
          "description": "E-Commerce Experience",
          "className": "md:col-span-2 md:row-span-2 xl:col-span-2 xl:row-span-2"
        },
        {
          "title": "Aura Design System",
          "description": "Brand Identity & Web",
          "className": "md:col-span-1"
        },
        {
          "title": "Aura Fintech",
          "description": "Brand Identity",
          "className": "md:col-span-1 md:row-span-1 xl:col-span-2 xl:row-span-1"
        },
        {
          "title": "Nexus Analytics",
          "description": "Web Application",
          "className": "md:col-span-1 md:row-span-1 xl:col-span-2 xl:row-span-1"
        }
      ]
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_5izgd79": {
    "id": "div_5izgd79",
    "type": "Frame",
    "name": "div",
    "parentId": "div_6e7r9lg",
    "props": {
      "className": "border-b border-zinc-200/50 py-12 dark:border-white/5"
    },
    "childrenIds": [
      "featureglass_yqi4pcp"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featureglass_yqi4pcp": {
    "id": "featureglass_yqi4pcp",
    "type": "Hudbird_FeatureGlass",
    "name": "FeatureGlass",
    "parentId": "div_5izgd79",
    "props": {
      "description": "A full-service digital approach. We handle everything from brand identity to complex web application engineering seamlessly.",
      "features": [
        {
          "icon": {
            "_type": "LucideIcon",
            "name": "PenTool",
            "size": 28
          },
          "title": "Brand Identity",
          "description": "We create cohesive brand systems, typography, and visual languages that resonate with your target audience and stand the test of time."
        },
        {
          "icon": {
            "_type": "LucideIcon",
            "name": "Layout",
            "size": 28
          },
          "title": "UX/UI Design",
          "description": "Crafting intuitive and beautiful interfaces. Our design process is rooted in user research, wireframing, and interactive prototyping."
        },
        {
          "icon": {
            "_type": "LucideIcon",
            "name": "Monitor",
            "size": 28
          },
          "title": "Creative Engineering",
          "description": "Bringing designs to life with modern web technologies. We specialize in React, WebGL, and buttery smooth framer motion animations."
        }
      ]
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_ispk170": {
    "id": "div_ispk170",
    "type": "Frame",
    "name": "div",
    "parentId": "div_6e7r9lg",
    "props": {
      "className": "relative border-b border-zinc-200/50 py-24 dark:border-white/5"
    },
    "childrenIds": [
      "testimonialglass_sq9jypn"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "testimonialglass_sq9jypn": {
    "id": "testimonialglass_sq9jypn",
    "type": "Hudbird_TestimonialGlass",
    "name": "TestimonialGlass",
    "parentId": "div_ispk170",
    "props": {
      "testimonials": [
        {
          "quote": "Neon Studio completely transformed our brand identity. Their attention to detail and ability to execute on a vision is unmatched in the industry.",
          "author": "Sarah Jenkins",
          "role": "CMO, Lumina Fragrances",
          "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        {
          "quote": "Working with them felt like an extension of our own team. They delivered our complex web application weeks ahead of schedule with flawless motion design.",
          "author": "David Chen",
          "role": "Founder, FinTrack Mobile",
          "avatar": "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        }
      ]
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_jsdiuqm": {
    "id": "div_jsdiuqm",
    "type": "Frame",
    "name": "div",
    "parentId": "div_6e7r9lg",
    "props": {
      "className": "relative py-32"
    },
    "childrenIds": [
      "ctaglass_b673ijm"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "ctaglass_b673ijm": {
    "id": "ctaglass_b673ijm",
    "type": "Hudbird_CtaGlass",
    "name": "CtaGlass",
    "parentId": "div_jsdiuqm",
    "props": {
      "description": "We are currently accepting new projects for Q3 2026. Reach out to discuss how we can partner to elevate your brand.",
      "primaryAction": {
        "label": "Start a Project",
        "className": "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-full h-14 px-10 text-lg shadow-2xl"
      },
      "secondaryAction": {
        "label": "Send an Email",
        "href": "#",
        "className": "text-zinc-800 dark:text-zinc-200 font-medium hover:text-zinc-900 dark:hover:text-white rounded-full bg-white/60 dark:bg-white/5 border border-zinc-300 dark:border-white/10 hover:bg-white/90 dark:hover:bg-white/10 h-14 backdrop-blur-md px-10 shadow-lg"
      }
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "footermega_8zczv2c": {
    "id": "footermega_8zczv2c",
    "type": "Hudbird_FooterMega",
    "name": "FooterMega",
    "parentId": "div_6e7r9lg",
    "props": {
      "className": "relative z-10 mt-auto border-t border-zinc-200/50 bg-white/30 pt-16 backdrop-blur-lg dark:border-white/5 dark:bg-zinc-950/30",
      "brandName": "",
      "description": "A curated selection of our recent digital projects spanning branding, web design, and product engineering.",
      "linkGroups": [
        {
          "title": "Services",
          "links": [
            {
              "label": "Digital Product Design",
              "href": "#"
            },
            {
              "label": "Web Application Engineering",
              "href": "#"
            },
            {
              "label": "Brand Identity",
              "href": "#"
            },
            {
              "label": "Motion Graphics",
              "href": "#"
            }
          ]
        },
        {
          "title": "Agency",
          "links": [
            {
              "label": "About Us",
              "href": "#"
            },
            {
              "label": "Careers",
              "href": "#"
            },
            {
              "label": "Journal",
              "href": "#"
            },
            {
              "label": "Contact",
              "href": "#"
            }
          ]
        }
      ],
      "socials": [
        {
          "label": "Instagram",
          "href": "#",
          "icon": {
            "_type": "LucideIcon",
            "name": "Camera",
            "size": 24
          }
        }
      ],
      "copyright": "© 2026 Neon Studio, LLC. Made in NYC."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  }
}
  },
  {
    name: 'EcommerceTemplate',
    rootNodeId: 'div_0aaqxyh',
    nodeData: {
  "div_0aaqxyh": {
    "id": "div_0aaqxyh",
    "type": "Frame",
    "name": "div",
    "parentId": null,
    "props": {
      "className": "flex min-h-screen w-full flex-col bg-white dark:bg-zinc-950"
    },
    "childrenIds": [
      "hero_0if1kjn",
      "featuresection_w8psa8j",
      "pricingsection_wrr086m",
      "div_ky2enth",
      "div_yulxgos",
      "footersimple_hrg02fb"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "hero_0if1kjn": {
    "id": "hero_0if1kjn",
    "type": "Hudbird_Hero",
    "name": "Hero",
    "parentId": "div_0aaqxyh",
    "props": {
      "size": "lg",
      "className": "relative overflow-hidden bg-white dark:bg-zinc-950"
    },
    "childrenIds": [
      "div_gx9fvd2",
      "heroheader_42aoxdg",
      "herobody_n6cbqd2"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_gx9fvd2": {
    "id": "div_gx9fvd2",
    "type": "Frame",
    "name": "div",
    "parentId": "hero_0if1kjn",
    "props": {
      "className": "pointer-events-none absolute top-0 left-1/2 h-[500px] w-full -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-100/50 via-transparent to-transparent dark:from-orange-900/20"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "heroheader_42aoxdg": {
    "id": "heroheader_42aoxdg",
    "type": "Hudbird_HeroHeader",
    "name": "HeroHeader",
    "parentId": "hero_0if1kjn",
    "props": {
      "className": "relative z-50",
      "links": [
        {
          "label": "Platform",
          "href": "#"
        },
        {
          "label": "Solutions",
          "href": "#"
        },
        {
          "label": "Pricing",
          "href": "#"
        }
      ]
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herobody_n6cbqd2": {
    "id": "herobody_n6cbqd2",
    "type": "Hudbird_HeroBody",
    "name": "HeroBody",
    "parentId": "hero_0if1kjn",
    "props": {
      "align": "center",
      "className": "relative z-10 mx-auto max-w-4xl pt-32 pb-24 lg:pt-40"
    },
    "childrenIds": [
      "herobadge_g6nemv2",
      "herotitle_488673d",
      "herodescription_2fgcd63",
      "heroactions_hfsj7y2"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herobadge_g6nemv2": {
    "id": "herobadge_g6nemv2",
    "type": "Hudbird_HeroBadge",
    "name": "HeroBadge",
    "parentId": "herobody_n6cbqd2",
    "props": {
      "className": "rounded-full border border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400",
      "children": "New: Global Inventory Sync ⚡️"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herotitle_488673d": {
    "id": "herotitle_488673d",
    "type": "Hudbird_HeroTitle",
    "name": "HeroTitle",
    "parentId": "herobody_n6cbqd2",
    "props": {
      "className": "mt-6 text-6xl font-bold tracking-tight text-zinc-900 md:text-8xl dark:text-white"
    },
    "childrenIds": [
      "br_nkf2fcz"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "br_nkf2fcz": {
    "id": "br_nkf2fcz",
    "type": "br",
    "name": "br",
    "parentId": "herotitle_488673d",
    "props": {},
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herodescription_2fgcd63": {
    "id": "herodescription_2fgcd63",
    "type": "Hudbird_HeroDescription",
    "name": "HeroDescription",
    "parentId": "herobody_n6cbqd2",
    "props": {
      "className": "mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-zinc-600 dark:text-zinc-400",
      "children": "The all-in-one commerce operating system. Build your storefront, process payments\n            globally, and manage complex inventory across 50+ sales channels instantly."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "heroactions_hfsj7y2": {
    "id": "heroactions_hfsj7y2",
    "type": "Hudbird_HeroActions",
    "name": "HeroActions",
    "parentId": "herobody_n6cbqd2",
    "props": {
      "className": "mt-10 justify-center"
    },
    "childrenIds": [
      "button_erj5ykq",
      "button_n3eif90"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "button_erj5ykq": {
    "id": "button_erj5ykq",
    "type": "Hudbird_Button",
    "name": "Button",
    "parentId": "heroactions_hfsj7y2",
    "props": {
      "className": "h-14 rounded-full bg-orange-500 px-8 text-lg text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600",
      "children": "Start your 14-day trial"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "button_n3eif90": {
    "id": "button_n3eif90",
    "type": "Hudbird_Button",
    "name": "Button",
    "parentId": "heroactions_hfsj7y2",
    "props": {
      "variant": "outline",
      "className": "h-14 rounded-full border-zinc-200 px-8 text-lg text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900",
      "children": "Book a Demo"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featuresection_w8psa8j": {
    "id": "featuresection_w8psa8j",
    "type": "Hudbird_FeatureSection",
    "name": "FeatureSection",
    "parentId": "div_0aaqxyh",
    "props": {
      "className": "border-t border-zinc-100 bg-zinc-50 py-32 dark:border-zinc-900 dark:bg-zinc-900/30"
    },
    "childrenIds": [
      "featureheader_3fnb0az",
      "featurealternating_1msh99j"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featureheader_3fnb0az": {
    "id": "featureheader_3fnb0az",
    "type": "Hudbird_FeatureHeader",
    "name": "FeatureHeader",
    "parentId": "featuresection_w8psa8j",
    "props": {},
    "childrenIds": [
      "featurebadge_tp3zl2v",
      "featuretitle_mh18gcz",
      "featuredescription_2396gch"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featurebadge_tp3zl2v": {
    "id": "featurebadge_tp3zl2v",
    "type": "Hudbird_FeatureBadge",
    "name": "FeatureBadge",
    "parentId": "featureheader_3fnb0az",
    "props": {
      "className": "rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
      "children": "Dashboard Overview"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featuretitle_mh18gcz": {
    "id": "featuretitle_mh18gcz",
    "type": "Hudbird_FeatureTitle",
    "name": "FeatureTitle",
    "parentId": "featureheader_3fnb0az",
    "props": {
      "className": "text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-white",
      "children": "Everything at your fingertips."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featuredescription_2396gch": {
    "id": "featuredescription_2396gch",
    "type": "Hudbird_FeatureDescription",
    "name": "FeatureDescription",
    "parentId": "featureheader_3fnb0az",
    "props": {
      "className": "mx-auto mt-6 max-w-2xl text-xl text-zinc-600 dark:text-zinc-400",
      "children": "Stop switching between 10 different apps. CommerceOS unifies your orders, customers, and\n            analytics into one blazing-fast interface."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featurealternating_1msh99j": {
    "id": "featurealternating_1msh99j",
    "type": "Hudbird_FeatureAlternating",
    "name": "FeatureAlternating",
    "parentId": "featuresection_w8psa8j",
    "props": {
      "className": "mt-24"
    },
    "childrenIds": [
      "featurerow_6e0yv99",
      "featurerow_51dqwpr"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featurerow_6e0yv99": {
    "id": "featurerow_6e0yv99",
    "type": "Hudbird_FeatureRow",
    "name": "FeatureRow",
    "parentId": "featurealternating_1msh99j",
    "props": {},
    "childrenIds": [
      "featurerowcontent_2jcb5pe",
      "featurerowmedia_8tf9i1b"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featurerowcontent_2jcb5pe": {
    "id": "featurerowcontent_2jcb5pe",
    "type": "Hudbird_FeatureRowContent",
    "name": "FeatureRowContent",
    "parentId": "featurerow_6e0yv99",
    "props": {},
    "childrenIds": [
      "h3_2yav0np",
      "p_3b8timm",
      "ul_2vkqf1k"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "h3_2yav0np": {
    "id": "h3_2yav0np",
    "type": "Text",
    "name": "h3",
    "parentId": "featurerowcontent_2jcb5pe",
    "props": {
      "className": "text-3xl font-bold tracking-tight text-zinc-900 dark:text-white",
      "children": "Real-time Sales Analytics"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "p_3b8timm": {
    "id": "p_3b8timm",
    "type": "Text",
    "name": "p",
    "parentId": "featurerowcontent_2jcb5pe",
    "props": {
      "className": "mt-6 text-xl leading-relaxed text-zinc-600 dark:text-zinc-400",
      "children": "Watch your revenue grow in real-time. Our streaming analytics engine processes every\n                transaction instantly, providing you with up-to-the-second insights on conversion\n                rates and average order value."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "ul_2vkqf1k": {
    "id": "ul_2vkqf1k",
    "type": "Frame",
    "name": "ul",
    "parentId": "featurerowcontent_2jcb5pe",
    "props": {
      "className": "mt-8 space-y-4 text-lg text-zinc-700 dark:text-zinc-300"
    },
    "childrenIds": [
      "li_w0jtagy",
      "li_0zwfabe",
      "li_5xx0mu6"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "li_w0jtagy": {
    "id": "li_w0jtagy",
    "type": "Frame",
    "name": "li",
    "parentId": "ul_2vkqf1k",
    "props": {
      "className": "flex items-center gap-x-3"
    },
    "childrenIds": [
      "div_wpc8rxl"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_wpc8rxl": {
    "id": "div_wpc8rxl",
    "type": "Frame",
    "name": "div",
    "parentId": "li_w0jtagy",
    "props": {
      "className": "flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "li_0zwfabe": {
    "id": "li_0zwfabe",
    "type": "Frame",
    "name": "li",
    "parentId": "ul_2vkqf1k",
    "props": {
      "className": "flex items-center gap-x-3"
    },
    "childrenIds": [
      "div_l9jiwqg"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_l9jiwqg": {
    "id": "div_l9jiwqg",
    "type": "Frame",
    "name": "div",
    "parentId": "li_0zwfabe",
    "props": {
      "className": "flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "li_5xx0mu6": {
    "id": "li_5xx0mu6",
    "type": "Frame",
    "name": "li",
    "parentId": "ul_2vkqf1k",
    "props": {
      "className": "flex items-center gap-x-3"
    },
    "childrenIds": [
      "div_itw2qis"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_itw2qis": {
    "id": "div_itw2qis",
    "type": "Frame",
    "name": "div",
    "parentId": "li_5xx0mu6",
    "props": {
      "className": "flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featurerowmedia_8tf9i1b": {
    "id": "featurerowmedia_8tf9i1b",
    "type": "Hudbird_FeatureRowMedia",
    "name": "FeatureRowMedia",
    "parentId": "featurerow_6e0yv99",
    "props": {},
    "childrenIds": [
      "div_5329wvm"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_5329wvm": {
    "id": "div_5329wvm",
    "type": "Frame",
    "name": "div",
    "parentId": "featurerowmedia_8tf9i1b",
    "props": {
      "className": "group relative flex h-[450px] w-full flex-col justify-end overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
    },
    "childrenIds": [
      "div_c84esrw",
      "div_tixxgl2"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_c84esrw": {
    "id": "div_c84esrw",
    "type": "Frame",
    "name": "div",
    "parentId": "div_5329wvm",
    "props": {
      "className": "absolute inset-0 bg-gradient-to-t from-orange-50/50 to-transparent dark:from-orange-950/20"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_tixxgl2": {
    "id": "div_tixxgl2",
    "type": "Frame",
    "name": "div",
    "parentId": "div_5329wvm",
    "props": {
      "className": "relative z-10 flex h-full w-full flex-col justify-between pt-4"
    },
    "childrenIds": [
      "div_zis5btk",
      "div_bk8kfal"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_zis5btk": {
    "id": "div_zis5btk",
    "type": "Frame",
    "name": "div",
    "parentId": "div_tixxgl2",
    "props": {
      "className": "flex items-start justify-between"
    },
    "childrenIds": [
      "div_1xmvm3e",
      "div_km1quzg"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_1xmvm3e": {
    "id": "div_1xmvm3e",
    "type": "Frame",
    "name": "div",
    "parentId": "div_zis5btk",
    "props": {
      "className": "flex flex-col"
    },
    "childrenIds": [
      "span_24fdpq0",
      "span_92x8q3l",
      "span_8osyivk"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "span_24fdpq0": {
    "id": "span_24fdpq0",
    "type": "Text",
    "name": "span",
    "parentId": "div_1xmvm3e",
    "props": {
      "className": "font-medium text-zinc-500",
      "children": "Total Sales"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "span_92x8q3l": {
    "id": "span_92x8q3l",
    "type": "Text",
    "name": "span",
    "parentId": "div_1xmvm3e",
    "props": {
      "className": "mt-1 text-4xl font-bold text-zinc-900 dark:text-white",
      "children": "$124,592"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "span_8osyivk": {
    "id": "span_8osyivk",
    "type": "Text",
    "name": "span",
    "parentId": "div_1xmvm3e",
    "props": {
      "className": "mt-2 flex items-center gap-1 text-sm font-semibold text-emerald-500",
      "children": "+24.5% vs last month"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_km1quzg": {
    "id": "div_km1quzg",
    "type": "Frame",
    "name": "div",
    "parentId": "div_zis5btk",
    "props": {
      "className": "rounded-full bg-zinc-100 px-4 py-1.5 text-sm font-medium text-zinc-900 dark:bg-zinc-800 dark:text-white"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_bk8kfal": {
    "id": "div_bk8kfal",
    "type": "Frame",
    "name": "div",
    "parentId": "div_tixxgl2",
    "props": {
      "className": "mt-8 flex h-48 items-end justify-between gap-3"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featurerow_51dqwpr": {
    "id": "featurerow_51dqwpr",
    "type": "Hudbird_FeatureRow",
    "name": "FeatureRow",
    "parentId": "featurealternating_1msh99j",
    "props": {
      "reverse": true,
      "className": "mt-32"
    },
    "childrenIds": [
      "featurerowcontent_ncnr6nt",
      "featurerowmedia_xcp2hin"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featurerowcontent_ncnr6nt": {
    "id": "featurerowcontent_ncnr6nt",
    "type": "Hudbird_FeatureRowContent",
    "name": "FeatureRowContent",
    "parentId": "featurerow_51dqwpr",
    "props": {},
    "childrenIds": [
      "h3_h9j2b1i",
      "p_lddlha0",
      "button_ijzdp1z"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "h3_h9j2b1i": {
    "id": "h3_h9j2b1i",
    "type": "Text",
    "name": "h3",
    "parentId": "featurerowcontent_ncnr6nt",
    "props": {
      "className": "text-3xl font-bold tracking-tight text-zinc-900 dark:text-white",
      "children": "Global Logistics Engine"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "p_lddlha0": {
    "id": "p_lddlha0",
    "type": "Text",
    "name": "p",
    "parentId": "featurerowcontent_ncnr6nt",
    "props": {
      "className": "mt-6 text-xl leading-relaxed text-zinc-600 dark:text-zinc-400",
      "children": "Automate your entire fulfillment process. We automatically route orders to the\n                nearest warehouse, generate shipping labels instantly, and update inventory across\n                all your connected marketplaces."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "button_ijzdp1z": {
    "id": "button_ijzdp1z",
    "type": "Hudbird_Button",
    "name": "Button",
    "parentId": "featurerowcontent_ncnr6nt",
    "props": {
      "className": "mt-8 h-14 rounded-full bg-zinc-900 px-8 text-lg font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950",
      "children": "View Integrations"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featurerowmedia_xcp2hin": {
    "id": "featurerowmedia_xcp2hin",
    "type": "Hudbird_FeatureRowMedia",
    "name": "FeatureRowMedia",
    "parentId": "featurerow_51dqwpr",
    "props": {
      "className": "rounded-[3rem] bg-zinc-100 p-3 sm:p-4 dark:bg-zinc-800/50"
    },
    "childrenIds": [
      "div_h4die36"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_h4die36": {
    "id": "div_h4die36",
    "type": "Frame",
    "name": "div",
    "parentId": "featurerowmedia_xcp2hin",
    "props": {
      "className": "relative flex h-[400px] w-full flex-col justify-center overflow-hidden rounded-[2rem] bg-zinc-900 p-8 shadow-2xl ring-1 ring-white/10"
    },
    "childrenIds": [
      "div_snaexte",
      "div_v4kkuwa"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_snaexte": {
    "id": "div_snaexte",
    "type": "Frame",
    "name": "div",
    "parentId": "div_h4die36",
    "props": {
      "className": "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent dark:from-blue-900/30"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_v4kkuwa": {
    "id": "div_v4kkuwa",
    "type": "Frame",
    "name": "div",
    "parentId": "div_h4die36",
    "props": {
      "className": "relative z-10 flex flex-col gap-4"
    },
    "childrenIds": [
      "span_yt25t56"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "span_yt25t56": {
    "id": "span_yt25t56",
    "type": "Text",
    "name": "span",
    "parentId": "div_v4kkuwa",
    "props": {
      "className": "mb-4 text-xl font-bold text-zinc-900 dark:text-white",
      "children": "Live Orders"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingsection_wrr086m": {
    "id": "pricingsection_wrr086m",
    "type": "Hudbird_PricingSection",
    "name": "PricingSection",
    "parentId": "div_0aaqxyh",
    "props": {
      "className": "border-t border-zinc-200 bg-white py-32 dark:border-zinc-900 dark:bg-zinc-950"
    },
    "childrenIds": [
      "pricingheader_ylhtcuj",
      "div_9d42kgw"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingheader_ylhtcuj": {
    "id": "pricingheader_ylhtcuj",
    "type": "Hudbird_PricingHeader",
    "name": "PricingHeader",
    "parentId": "pricingsection_wrr086m",
    "props": {},
    "childrenIds": [
      "pricingbadge_2tr2xxx",
      "pricingtitle_uqw4tjl",
      "pricingdescription_tc5u1n5",
      "pricingtoggle_ko8wenh"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingbadge_2tr2xxx": {
    "id": "pricingbadge_2tr2xxx",
    "type": "Hudbird_PricingBadge",
    "name": "PricingBadge",
    "parentId": "pricingheader_ylhtcuj",
    "props": {
      "className": "rounded-full bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
      "children": "Transparent Pricing"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtitle_uqw4tjl": {
    "id": "pricingtitle_uqw4tjl",
    "type": "Hudbird_PricingTitle",
    "name": "PricingTitle",
    "parentId": "pricingheader_ylhtcuj",
    "props": {
      "className": "text-5xl font-bold tracking-tight text-zinc-900 dark:text-white",
      "children": "Start small, grow huge."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingdescription_tc5u1n5": {
    "id": "pricingdescription_tc5u1n5",
    "type": "Hudbird_PricingDescription",
    "name": "PricingDescription",
    "parentId": "pricingheader_ylhtcuj",
    "props": {
      "className": "mx-auto max-w-2xl text-xl text-zinc-600 dark:text-zinc-400",
      "children": "No transaction fees on our native payment gateway. Just a flat monthly rate that scales\n            when you do."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtoggle_ko8wenh": {
    "id": "pricingtoggle_ko8wenh",
    "type": "Hudbird_PricingToggle",
    "name": "PricingToggle",
    "parentId": "pricingheader_ylhtcuj",
    "props": {},
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_9d42kgw": {
    "id": "div_9d42kgw",
    "type": "Frame",
    "name": "div",
    "parentId": "pricingsection_wrr086m",
    "props": {
      "className": "mx-auto mt-20 max-w-7xl px-4"
    },
    "childrenIds": [
      "pricinggrid_ij7xcxb"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricinggrid_ij7xcxb": {
    "id": "pricinggrid_ij7xcxb",
    "type": "Hudbird_PricingGrid",
    "name": "PricingGrid",
    "parentId": "div_9d42kgw",
    "props": {
      "className": "grid-cols-1 gap-8 md:grid-cols-3"
    },
    "childrenIds": [
      "pricingtier_sb66rbd",
      "pricingtier_5x00s0o",
      "pricingtier_hvdooah"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtier_sb66rbd": {
    "id": "pricingtier_sb66rbd",
    "type": "Hudbird_PricingTier",
    "name": "PricingTier",
    "parentId": "pricinggrid_ij7xcxb",
    "props": {
      "index": 0,
      "className": "rounded-3xl border-zinc-200 bg-zinc-50 p-10 dark:border-zinc-800 dark:bg-zinc-900/30"
    },
    "childrenIds": [
      "pricingtierheader_98wfmb1",
      "button_2y9gger",
      "pricingtierfeatures_mb2yiul"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierheader_98wfmb1": {
    "id": "pricingtierheader_98wfmb1",
    "type": "Hudbird_PricingTierHeader",
    "name": "PricingTierHeader",
    "parentId": "pricingtier_sb66rbd",
    "props": {},
    "childrenIds": [
      "pricingtiername_3zcsgno",
      "pricingtierdescription_3b5wn5u",
      "pricingtierprice_nlseam3"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtiername_3zcsgno": {
    "id": "pricingtiername_3zcsgno",
    "type": "Hudbird_PricingTierName",
    "name": "PricingTierName",
    "parentId": "pricingtierheader_98wfmb1",
    "props": {
      "className": "text-2xl text-zinc-900 dark:text-white",
      "children": "Creator"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierdescription_3b5wn5u": {
    "id": "pricingtierdescription_3b5wn5u",
    "type": "Hudbird_PricingTierDescription",
    "name": "PricingTierDescription",
    "parentId": "pricingtierheader_98wfmb1",
    "props": {
      "className": "mt-2 text-zinc-600 dark:text-zinc-400",
      "children": "Everything you need to launch your first store."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierprice_nlseam3": {
    "id": "pricingtierprice_nlseam3",
    "type": "Hudbird_PricingTierPrice",
    "name": "PricingTierPrice",
    "parentId": "pricingtierheader_98wfmb1",
    "props": {
      "className": "mt-6 text-zinc-900 dark:text-white"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "button_2y9gger": {
    "id": "button_2y9gger",
    "type": "Hudbird_Button",
    "name": "Button",
    "parentId": "pricingtier_sb66rbd",
    "props": {
      "variant": "outline",
      "className": "mt-8 h-14 w-full rounded-full border-zinc-300 text-lg text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800",
      "children": "Start Free Trial"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeatures_mb2yiul": {
    "id": "pricingtierfeatures_mb2yiul",
    "type": "Hudbird_PricingTierFeatures",
    "name": "PricingTierFeatures",
    "parentId": "pricingtier_sb66rbd",
    "props": {
      "className": "mt-10"
    },
    "childrenIds": [
      "pricingtierfeature_i4og1q0",
      "pricingtierfeature_p8maafa",
      "pricingtierfeature_4ornia5",
      "pricingtierfeature_udgge3t",
      "pricingtierfeature_oq5dtrj"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_i4og1q0": {
    "id": "pricingtierfeature_i4og1q0",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_mb2yiul",
    "props": {
      "className": "text-zinc-700 dark:text-zinc-300",
      "children": "Up to 1,000 products"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_p8maafa": {
    "id": "pricingtierfeature_p8maafa",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_mb2yiul",
    "props": {
      "className": "text-zinc-700 dark:text-zinc-300",
      "children": "Custom domain support"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_4ornia5": {
    "id": "pricingtierfeature_4ornia5",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_mb2yiul",
    "props": {
      "className": "text-zinc-700 dark:text-zinc-300",
      "children": "Basic analytics dashboard"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_udgge3t": {
    "id": "pricingtierfeature_udgge3t",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_mb2yiul",
    "props": {
      "className": "text-zinc-700 dark:text-zinc-300",
      "children": "Standard email support"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_oq5dtrj": {
    "id": "pricingtierfeature_oq5dtrj",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_mb2yiul",
    "props": {
      "className": "text-zinc-400 line-through",
      "children": "Abandoned cart recovery"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtier_5x00s0o": {
    "id": "pricingtier_5x00s0o",
    "type": "Hudbird_PricingTier",
    "name": "PricingTier",
    "parentId": "pricinggrid_ij7xcxb",
    "props": {
      "index": 1,
      "popular": true,
      "className": "relative transform rounded-3xl border-orange-500 bg-white p-10 shadow-2xl md:-translate-y-4 dark:bg-zinc-900"
    },
    "childrenIds": [
      "pricingtierheader_4hr6uh4",
      "button_z6wy5ap",
      "pricingtierfeatures_8xb16m2"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierheader_4hr6uh4": {
    "id": "pricingtierheader_4hr6uh4",
    "type": "Hudbird_PricingTierHeader",
    "name": "PricingTierHeader",
    "parentId": "pricingtier_5x00s0o",
    "props": {},
    "childrenIds": [
      "pricingtiername_41awmiy",
      "pricingtierdescription_x6ll5u1",
      "pricingtierprice_dhrgdus"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtiername_41awmiy": {
    "id": "pricingtiername_41awmiy",
    "type": "Hudbird_PricingTierName",
    "name": "PricingTierName",
    "parentId": "pricingtierheader_4hr6uh4",
    "props": {
      "popular": true,
      "className": "text-2xl text-orange-600 dark:text-orange-400",
      "children": "Scale"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierdescription_x6ll5u1": {
    "id": "pricingtierdescription_x6ll5u1",
    "type": "Hudbird_PricingTierDescription",
    "name": "PricingTierDescription",
    "parentId": "pricingtierheader_4hr6uh4",
    "props": {
      "popular": true,
      "className": "mt-2 text-zinc-600 dark:text-zinc-400",
      "children": "Advanced features for growing brands."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierprice_dhrgdus": {
    "id": "pricingtierprice_dhrgdus",
    "type": "Hudbird_PricingTierPrice",
    "name": "PricingTierPrice",
    "parentId": "pricingtierheader_4hr6uh4",
    "props": {
      "popular": true,
      "priceClassName": "text-zinc-900 dark:text-white mt-6"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "button_z6wy5ap": {
    "id": "button_z6wy5ap",
    "type": "Hudbird_Button",
    "name": "Button",
    "parentId": "pricingtier_5x00s0o",
    "props": {
      "className": "mt-8 h-14 w-full rounded-full bg-orange-500 text-lg text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600",
      "children": "Upgrade to Scale"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeatures_8xb16m2": {
    "id": "pricingtierfeatures_8xb16m2",
    "type": "Hudbird_PricingTierFeatures",
    "name": "PricingTierFeatures",
    "parentId": "pricingtier_5x00s0o",
    "props": {
      "popular": true,
      "className": "mt-10"
    },
    "childrenIds": [
      "pricingtierfeature_beedeop",
      "pricingtierfeature_utl8260",
      "pricingtierfeature_iokjxe9",
      "pricingtierfeature_5a31y4q",
      "pricingtierfeature_h543tlv"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_beedeop": {
    "id": "pricingtierfeature_beedeop",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_8xb16m2",
    "props": {
      "popular": true,
      "className": "font-medium text-zinc-900 dark:text-white",
      "children": "Unlimited products"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_utl8260": {
    "id": "pricingtierfeature_utl8260",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_8xb16m2",
    "props": {
      "popular": true,
      "className": "text-zinc-900 dark:text-white",
      "children": "Multi-currency checkout"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_iokjxe9": {
    "id": "pricingtierfeature_iokjxe9",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_8xb16m2",
    "props": {
      "popular": true,
      "className": "text-zinc-900 dark:text-white",
      "children": "Advanced reporting & API access"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_5a31y4q": {
    "id": "pricingtierfeature_5a31y4q",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_8xb16m2",
    "props": {
      "popular": true,
      "className": "text-zinc-900 dark:text-white",
      "children": "Automated cart recovery workflows"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_h543tlv": {
    "id": "pricingtierfeature_h543tlv",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_8xb16m2",
    "props": {
      "popular": true,
      "className": "text-zinc-900 dark:text-white",
      "children": "24/7 Priority support"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtier_hvdooah": {
    "id": "pricingtier_hvdooah",
    "type": "Hudbird_PricingTier",
    "name": "PricingTier",
    "parentId": "pricinggrid_ij7xcxb",
    "props": {
      "index": 2,
      "className": "rounded-3xl border-zinc-200 bg-zinc-50 p-10 dark:border-zinc-800 dark:bg-zinc-900/30"
    },
    "childrenIds": [
      "pricingtierheader_1ru84h3",
      "button_ak5nmn5",
      "pricingtierfeatures_cfj7un3"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierheader_1ru84h3": {
    "id": "pricingtierheader_1ru84h3",
    "type": "Hudbird_PricingTierHeader",
    "name": "PricingTierHeader",
    "parentId": "pricingtier_hvdooah",
    "props": {},
    "childrenIds": [
      "pricingtiername_5n1uvlo",
      "pricingtierdescription_jfjla2z",
      "pricingtierprice_gs2i5hg"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtiername_5n1uvlo": {
    "id": "pricingtiername_5n1uvlo",
    "type": "Hudbird_PricingTierName",
    "name": "PricingTierName",
    "parentId": "pricingtierheader_1ru84h3",
    "props": {
      "className": "text-2xl text-zinc-900 dark:text-white",
      "children": "Enterprise"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierdescription_jfjla2z": {
    "id": "pricingtierdescription_jfjla2z",
    "type": "Hudbird_PricingTierDescription",
    "name": "PricingTierDescription",
    "parentId": "pricingtierheader_1ru84h3",
    "props": {
      "className": "mt-2 text-zinc-600 dark:text-zinc-400",
      "children": "Custom solutions for massive volume."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierprice_gs2i5hg": {
    "id": "pricingtierprice_gs2i5hg",
    "type": "Hudbird_PricingTierPrice",
    "name": "PricingTierPrice",
    "parentId": "pricingtierheader_1ru84h3",
    "props": {
      "price": "Custom",
      "period": "",
      "className": "mt-6 text-zinc-900 dark:text-white"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "button_ak5nmn5": {
    "id": "button_ak5nmn5",
    "type": "Hudbird_Button",
    "name": "Button",
    "parentId": "pricingtier_hvdooah",
    "props": {
      "variant": "outline",
      "className": "mt-8 h-14 w-full rounded-full border-zinc-300 text-lg text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800",
      "children": "Contact Sales"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeatures_cfj7un3": {
    "id": "pricingtierfeatures_cfj7un3",
    "type": "Hudbird_PricingTierFeatures",
    "name": "PricingTierFeatures",
    "parentId": "pricingtier_hvdooah",
    "props": {
      "className": "mt-10"
    },
    "childrenIds": [
      "pricingtierfeature_d9xi9jo",
      "pricingtierfeature_3671qi2",
      "pricingtierfeature_tc8xv7v",
      "pricingtierfeature_qzzgh17",
      "pricingtierfeature_6yanjdk"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_d9xi9jo": {
    "id": "pricingtierfeature_d9xi9jo",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_cfj7un3",
    "props": {
      "className": "text-zinc-700 dark:text-zinc-300",
      "children": "Unlimited everything"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_3671qi2": {
    "id": "pricingtierfeature_3671qi2",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_cfj7un3",
    "props": {
      "className": "text-zinc-700 dark:text-zinc-300",
      "children": "Dedicated account manager"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_tc8xv7v": {
    "id": "pricingtierfeature_tc8xv7v",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_cfj7un3",
    "props": {
      "className": "text-zinc-700 dark:text-zinc-300",
      "children": "Custom integrations & API"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_qzzgh17": {
    "id": "pricingtierfeature_qzzgh17",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_cfj7un3",
    "props": {
      "className": "text-zinc-700 dark:text-zinc-300",
      "children": "SLA uptime guarantee"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "pricingtierfeature_6yanjdk": {
    "id": "pricingtierfeature_6yanjdk",
    "type": "Hudbird_PricingTierFeature",
    "name": "PricingTierFeature",
    "parentId": "pricingtierfeatures_cfj7un3",
    "props": {
      "className": "text-zinc-700 dark:text-zinc-300",
      "children": "White-glove onboarding"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_ky2enth": {
    "id": "div_ky2enth",
    "type": "Frame",
    "name": "div",
    "parentId": "div_0aaqxyh",
    "props": {
      "className": "border-t border-zinc-200 bg-zinc-50 py-24 dark:border-zinc-900 dark:bg-zinc-900/50"
    },
    "childrenIds": [
      "testimonials_pqnwy21"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "testimonials_pqnwy21": {
    "id": "testimonials_pqnwy21",
    "type": "Hudbird_Testimonials",
    "name": "Testimonials",
    "parentId": "div_ky2enth",
    "props": {},
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_yulxgos": {
    "id": "div_yulxgos",
    "type": "Frame",
    "name": "div",
    "parentId": "div_0aaqxyh",
    "props": {
      "className": "bg-white px-4 py-32 sm:px-6 lg:px-8 dark:bg-zinc-950"
    },
    "childrenIds": [
      "div_168nlmh"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_168nlmh": {
    "id": "div_168nlmh",
    "type": "Frame",
    "name": "div",
    "parentId": "div_yulxgos",
    "props": {
      "className": "relative mx-auto max-w-6xl overflow-hidden rounded-[3rem] bg-zinc-100 shadow-2xl dark:bg-zinc-900"
    },
    "childrenIds": [
      "div_zfd6fx5",
      "ctacentered_cdtfsqx"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_zfd6fx5": {
    "id": "div_zfd6fx5",
    "type": "Frame",
    "name": "div",
    "parentId": "div_168nlmh",
    "props": {
      "className": "pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent dark:from-orange-500/30"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "ctacentered_cdtfsqx": {
    "id": "ctacentered_cdtfsqx",
    "type": "Hudbird_CtaCentered",
    "name": "CtaCentered",
    "parentId": "div_168nlmh",
    "props": {
      "className": "relative z-10 bg-transparent py-24",
      "primaryAction": {
        "label": "Start Free Trial",
        "href": "#",
        "className": "bg-orange-500 text-white hover:bg-orange-600 rounded-full h-14 px-8 text-lg font-medium"
      },
      "secondaryAction": {
        "label": "Book Demo",
        "href": "#",
        "className": "border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full h-14 px-8 text-lg font-medium ml-0 sm:ml-4 mt-4 sm:mt-0"
      }
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "footersimple_hrg02fb": {
    "id": "footersimple_hrg02fb",
    "type": "Hudbird_FooterSimple",
    "name": "FooterSimple",
    "parentId": "div_0aaqxyh",
    "props": {
      "className": "border-t border-zinc-200 bg-white py-12 dark:border-zinc-900 dark:bg-zinc-950",
      "links": [
        {
          "label": "Features",
          "href": "#"
        },
        {
          "label": "Pricing",
          "href": "#"
        },
        {
          "label": "Integrations",
          "href": "#"
        },
        {
          "label": "Help Center",
          "href": "#"
        },
        {
          "label": "API",
          "href": "#"
        }
      ],
      "socials": [
        {
          "label": "Twitter",
          "href": "#",
          "icon": {
            "_type": "LucideIcon",
            "name": "ArrowUpRight",
            "size": 24
          }
        }
      ],
      "copyright": "© 2026 CommerceOS Inc. All rights reserved."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  }
}
  },
  {
    name: 'FintechTemplate',
    rootNodeId: 'div_0f2g1xt',
    nodeData: {
  "div_0f2g1xt": {
    "id": "div_0f2g1xt",
    "type": "Frame",
    "name": "div",
    "parentId": null,
    "props": {
      "className": "flex min-h-screen w-full flex-col bg-zinc-50 dark:bg-zinc-950"
    },
    "childrenIds": [
      "hero_lwzove2",
      "logocloud_cqc3kqm",
      "featuresection_cf0gkyy",
      "div_rto5az7",
      "ctasplit_lwtyab7",
      "footersimple_ycry1q6"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "hero_lwzove2": {
    "id": "hero_lwzove2",
    "type": "Hudbird_Hero",
    "name": "Hero",
    "parentId": "div_0f2g1xt",
    "props": {
      "size": "lg",
      "align": "left",
      "className": "relative overflow-hidden bg-white dark:bg-zinc-950"
    },
    "childrenIds": [
      "div_wt4u6og",
      "heroheader_o8j3z6f",
      "herocontent_wdjy91i"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_wt4u6og": {
    "id": "div_wt4u6og",
    "type": "Frame",
    "name": "div",
    "parentId": "hero_lwzove2",
    "props": {
      "className": "pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/30 via-transparent to-transparent dark:from-emerald-900/10"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "heroheader_o8j3z6f": {
    "id": "heroheader_o8j3z6f",
    "type": "Hudbird_HeroHeader",
    "name": "HeroHeader",
    "parentId": "hero_lwzove2",
    "props": {
      "className": "relative z-50",
      "links": [
        {
          "label": "Send Money",
          "href": "#"
        },
        {
          "label": "Cards",
          "href": "#"
        },
        {
          "label": "Invest",
          "href": "#"
        }
      ]
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herocontent_wdjy91i": {
    "id": "herocontent_wdjy91i",
    "type": "Hudbird_HeroContent",
    "name": "HeroContent",
    "parentId": "hero_lwzove2",
    "props": {
      "className": "relative z-10 mx-auto max-w-7xl"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "logocloud_cqc3kqm": {
    "id": "logocloud_cqc3kqm",
    "type": "Hudbird_LogoCloud",
    "name": "LogoCloud",
    "parentId": "div_0f2g1xt",
    "props": {
      "className": "border-y border-zinc-100 bg-white py-16 dark:border-zinc-900 dark:bg-zinc-950"
    },
    "childrenIds": [
      "logocloudtitle_32pryvz",
      "logocloudticker_l6lb2lx"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "logocloudtitle_32pryvz": {
    "id": "logocloudtitle_32pryvz",
    "type": "Hudbird_LogoCloudTitle",
    "name": "LogoCloudTitle",
    "parentId": "logocloud_cqc3kqm",
    "props": {
      "className": "mb-8 text-sm font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400",
      "children": "Supported by top financial institutions"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "logocloudticker_l6lb2lx": {
    "id": "logocloudticker_l6lb2lx",
    "type": "Hudbird_LogoCloudTicker",
    "name": "LogoCloudTicker",
    "parentId": "logocloud_cqc3kqm",
    "props": {
      "speed": "fast",
      "direction": "left"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featuresection_cf0gkyy": {
    "id": "featuresection_cf0gkyy",
    "type": "Hudbird_FeatureSection",
    "name": "FeatureSection",
    "parentId": "div_0f2g1xt",
    "props": {
      "className": "border-b border-zinc-200 bg-zinc-50 py-32 dark:border-zinc-800 dark:bg-zinc-900"
    },
    "childrenIds": [
      "featureheader_t2nr4rw",
      "featurealternating_6sxa51g"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featureheader_t2nr4rw": {
    "id": "featureheader_t2nr4rw",
    "type": "Hudbird_FeatureHeader",
    "name": "FeatureHeader",
    "parentId": "featuresection_cf0gkyy",
    "props": {},
    "childrenIds": [
      "featurebadge_w3p3ekp",
      "featuretitle_gf58d8b",
      "featuredescription_wgj2rki"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featurebadge_w3p3ekp": {
    "id": "featurebadge_w3p3ekp",
    "type": "Hudbird_FeatureBadge",
    "name": "FeatureBadge",
    "parentId": "featureheader_t2nr4rw",
    "props": {
      "className": "border border-emerald-200 bg-emerald-100 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",
      "children": "Smarter Money"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featuretitle_gf58d8b": {
    "id": "featuretitle_gf58d8b",
    "type": "Hudbird_FeatureTitle",
    "name": "FeatureTitle",
    "parentId": "featureheader_t2nr4rw",
    "props": {
      "className": "text-4xl font-bold text-zinc-900 sm:text-5xl dark:text-white",
      "children": "Finance without the friction."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featuredescription_wgj2rki": {
    "id": "featuredescription_wgj2rki",
    "type": "Hudbird_FeatureDescription",
    "name": "FeatureDescription",
    "parentId": "featureheader_t2nr4rw",
    "props": {
      "className": "mx-auto mt-6 max-w-3xl text-xl text-zinc-600 dark:text-zinc-400",
      "children": "We redesigned banking from the ground up to serve you, not the other way around. No\n            branches, no paperwork, just seamless, automated money management right in your pocket."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featurealternating_6sxa51g": {
    "id": "featurealternating_6sxa51g",
    "type": "Hudbird_FeatureAlternating",
    "name": "FeatureAlternating",
    "parentId": "featuresection_cf0gkyy",
    "props": {
      "className": "mt-24"
    },
    "childrenIds": [
      "featurerow_dymx9dr",
      "featurerow_p1b6bnh"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featurerow_dymx9dr": {
    "id": "featurerow_dymx9dr",
    "type": "Hudbird_FeatureRow",
    "name": "FeatureRow",
    "parentId": "featurealternating_6sxa51g",
    "props": {},
    "childrenIds": [
      "featurerowcontent_pmgxdoc",
      "featurerowmedia_jmpzuwl"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featurerowcontent_pmgxdoc": {
    "id": "featurerowcontent_pmgxdoc",
    "type": "Hudbird_FeatureRowContent",
    "name": "FeatureRowContent",
    "parentId": "featurerow_dymx9dr",
    "props": {},
    "childrenIds": [
      "h3_9gy6oy6",
      "p_wqpmdny",
      "ul_pjq70k4"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "h3_9gy6oy6": {
    "id": "h3_9gy6oy6",
    "type": "Text",
    "name": "h3",
    "parentId": "featurerowcontent_pmgxdoc",
    "props": {
      "className": "text-3xl font-bold tracking-tight text-zinc-900 dark:text-white",
      "children": "Instant Global Transfers"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "p_wqpmdny": {
    "id": "p_wqpmdny",
    "type": "Text",
    "name": "p",
    "parentId": "featurerowcontent_pmgxdoc",
    "props": {
      "className": "mt-6 text-xl leading-relaxed text-zinc-600 dark:text-zinc-400",
      "children": "Send money to 150+ countries at the real exchange rate. Your recipient gets the\n                funds in seconds, not days. We charge a tiny, transparent fee and never hide markups\n                in the exchange rate."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "ul_pjq70k4": {
    "id": "ul_pjq70k4",
    "type": "Frame",
    "name": "ul",
    "parentId": "featurerowcontent_pmgxdoc",
    "props": {
      "className": "mt-8 space-y-4 text-lg text-zinc-700 dark:text-zinc-300"
    },
    "childrenIds": [
      "li_ol763zy",
      "li_djk3foq",
      "li_4cqh791"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "li_ol763zy": {
    "id": "li_ol763zy",
    "type": "Frame",
    "name": "li",
    "parentId": "ul_pjq70k4",
    "props": {
      "className": "flex items-center gap-x-4"
    },
    "childrenIds": [
      "div_0o3pnnh"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_0o3pnnh": {
    "id": "div_0o3pnnh",
    "type": "Frame",
    "name": "div",
    "parentId": "li_ol763zy",
    "props": {
      "className": "flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "li_djk3foq": {
    "id": "li_djk3foq",
    "type": "Frame",
    "name": "li",
    "parentId": "ul_pjq70k4",
    "props": {
      "className": "flex items-center gap-x-4"
    },
    "childrenIds": [
      "div_0rrt2ln"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_0rrt2ln": {
    "id": "div_0rrt2ln",
    "type": "Frame",
    "name": "div",
    "parentId": "li_djk3foq",
    "props": {
      "className": "flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "li_4cqh791": {
    "id": "li_4cqh791",
    "type": "Frame",
    "name": "li",
    "parentId": "ul_pjq70k4",
    "props": {
      "className": "flex items-center gap-x-4"
    },
    "childrenIds": [
      "div_j70qllh"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_j70qllh": {
    "id": "div_j70qllh",
    "type": "Frame",
    "name": "div",
    "parentId": "li_4cqh791",
    "props": {
      "className": "flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featurerowmedia_jmpzuwl": {
    "id": "featurerowmedia_jmpzuwl",
    "type": "Hudbird_FeatureRowMedia",
    "name": "FeatureRowMedia",
    "parentId": "featurerow_dymx9dr",
    "props": {},
    "childrenIds": [
      "div_julegd4"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_julegd4": {
    "id": "div_julegd4",
    "type": "Frame",
    "name": "div",
    "parentId": "featurerowmedia_jmpzuwl",
    "props": {
      "className": "relative flex h-[400px] w-full flex-col justify-center overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-2xl ring-1 ring-zinc-200 dark:bg-zinc-950 dark:ring-zinc-800"
    },
    "childrenIds": [
      "div_9xa7auo",
      "div_jxr1t96"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_9xa7auo": {
    "id": "div_9xa7auo",
    "type": "Frame",
    "name": "div",
    "parentId": "div_julegd4",
    "props": {
      "className": "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent dark:from-blue-900/10"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_jxr1t96": {
    "id": "div_jxr1t96",
    "type": "Frame",
    "name": "div",
    "parentId": "div_julegd4",
    "props": {
      "className": "relative z-10 mx-auto flex w-full max-w-sm flex-col gap-6"
    },
    "childrenIds": [
      "motion_div_d6z0src",
      "div_729j33w",
      "motion_div_f9w1659"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "motion_div_d6z0src": {
    "id": "motion_div_d6z0src",
    "type": "motion.div",
    "name": "motion.div",
    "parentId": "div_jxr1t96",
    "props": {
      "animate": {
        "y": [
          0,
          0
        ]
      },
      "transition": {
        "duration": 4
      },
      "className": "flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
    },
    "childrenIds": [
      "div_n3xzyu0",
      "span_xe51cdr"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_n3xzyu0": {
    "id": "div_n3xzyu0",
    "type": "Frame",
    "name": "div",
    "parentId": "motion_div_d6z0src",
    "props": {
      "className": "flex items-center gap-3"
    },
    "childrenIds": [
      "div_l6snhji",
      "div_ci8mg3k"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_l6snhji": {
    "id": "div_l6snhji",
    "type": "Frame",
    "name": "div",
    "parentId": "div_n3xzyu0",
    "props": {
      "className": "flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30"
    },
    "childrenIds": [
      "span_vnn3m1b"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "span_vnn3m1b": {
    "id": "span_vnn3m1b",
    "type": "Text",
    "name": "span",
    "parentId": "div_l6snhji",
    "props": {
      "className": "text-xl",
      "children": "🇺🇸"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_ci8mg3k": {
    "id": "div_ci8mg3k",
    "type": "Frame",
    "name": "div",
    "parentId": "div_n3xzyu0",
    "props": {
      "className": "flex flex-col"
    },
    "childrenIds": [
      "span_m6dbwt6",
      "span_rr46fpi"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "span_m6dbwt6": {
    "id": "span_m6dbwt6",
    "type": "Text",
    "name": "span",
    "parentId": "div_ci8mg3k",
    "props": {
      "className": "font-bold text-zinc-900 dark:text-white",
      "children": "You send"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "span_rr46fpi": {
    "id": "span_rr46fpi",
    "type": "Text",
    "name": "span",
    "parentId": "div_ci8mg3k",
    "props": {
      "className": "text-sm text-zinc-500",
      "children": "USD"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "span_xe51cdr": {
    "id": "span_xe51cdr",
    "type": "Text",
    "name": "span",
    "parentId": "motion_div_d6z0src",
    "props": {
      "className": "text-2xl font-bold text-zinc-900 dark:text-white",
      "children": "$1,000"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_729j33w": {
    "id": "div_729j33w",
    "type": "Frame",
    "name": "div",
    "parentId": "div_jxr1t96",
    "props": {
      "className": "relative flex justify-center"
    },
    "childrenIds": [
      "div_kezwmlm",
      "motion_div_osmu0c5"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_kezwmlm": {
    "id": "div_kezwmlm",
    "type": "Frame",
    "name": "div",
    "parentId": "div_729j33w",
    "props": {
      "className": "absolute inset-y-0 flex w-full items-center justify-center"
    },
    "childrenIds": [
      "div_8bt15k7"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_8bt15k7": {
    "id": "div_8bt15k7",
    "type": "Frame",
    "name": "div",
    "parentId": "div_kezwmlm",
    "props": {
      "className": "absolute h-full w-px bg-zinc-200 dark:bg-zinc-800"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "motion_div_osmu0c5": {
    "id": "motion_div_osmu0c5",
    "type": "motion.div",
    "name": "motion.div",
    "parentId": "div_729j33w",
    "props": {
      "animate": {
        "rotate": 360
      },
      "transition": {
        "duration": 8,
        "ease": "linear"
      },
      "className": "relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "motion_div_f9w1659": {
    "id": "motion_div_f9w1659",
    "type": "motion.div",
    "name": "motion.div",
    "parentId": "div_jxr1t96",
    "props": {
      "animate": {
        "y": [
          0,
          10,
          0
        ]
      },
      "transition": {
        "duration": 4,
        "delay": 0.5
      },
      "className": "flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
    },
    "childrenIds": [
      "div_fbt6c1p",
      "span_i8s8p7u"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_fbt6c1p": {
    "id": "div_fbt6c1p",
    "type": "Frame",
    "name": "div",
    "parentId": "motion_div_f9w1659",
    "props": {
      "className": "flex items-center gap-3"
    },
    "childrenIds": [
      "div_ag58vpl",
      "div_vs49the"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_ag58vpl": {
    "id": "div_ag58vpl",
    "type": "Frame",
    "name": "div",
    "parentId": "div_fbt6c1p",
    "props": {
      "className": "flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30"
    },
    "childrenIds": [
      "span_k7dhk0z"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "span_k7dhk0z": {
    "id": "span_k7dhk0z",
    "type": "Text",
    "name": "span",
    "parentId": "div_ag58vpl",
    "props": {
      "className": "text-xl",
      "children": "🇪🇺"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_vs49the": {
    "id": "div_vs49the",
    "type": "Frame",
    "name": "div",
    "parentId": "div_fbt6c1p",
    "props": {
      "className": "flex flex-col"
    },
    "childrenIds": [
      "span_qpjnhfq",
      "span_fvpjx3t"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "span_qpjnhfq": {
    "id": "span_qpjnhfq",
    "type": "Text",
    "name": "span",
    "parentId": "div_vs49the",
    "props": {
      "className": "font-bold text-zinc-900 dark:text-white",
      "children": "They receive"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "span_fvpjx3t": {
    "id": "span_fvpjx3t",
    "type": "Text",
    "name": "span",
    "parentId": "div_vs49the",
    "props": {
      "className": "text-sm text-zinc-500",
      "children": "EUR"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "span_i8s8p7u": {
    "id": "span_i8s8p7u",
    "type": "Text",
    "name": "span",
    "parentId": "motion_div_f9w1659",
    "props": {
      "className": "text-2xl font-bold text-emerald-600 dark:text-emerald-400",
      "children": "€912.45"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featurerow_p1b6bnh": {
    "id": "featurerow_p1b6bnh",
    "type": "Hudbird_FeatureRow",
    "name": "FeatureRow",
    "parentId": "featurealternating_6sxa51g",
    "props": {
      "reverse": true,
      "className": "mt-32"
    },
    "childrenIds": [
      "featurerowcontent_emmsnzn",
      "featurerowmedia_eq6vder"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featurerowcontent_emmsnzn": {
    "id": "featurerowcontent_emmsnzn",
    "type": "Hudbird_FeatureRowContent",
    "name": "FeatureRowContent",
    "parentId": "featurerow_p1b6bnh",
    "props": {},
    "childrenIds": [
      "h3_t1ucydn",
      "p_eylxns6",
      "button_vs1eq81"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "h3_t1ucydn": {
    "id": "h3_t1ucydn",
    "type": "Text",
    "name": "h3",
    "parentId": "featurerowcontent_emmsnzn",
    "props": {
      "className": "text-3xl font-bold tracking-tight text-zinc-900 dark:text-white",
      "children": "Smart Spend Tracking"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "p_eylxns6": {
    "id": "p_eylxns6",
    "type": "Text",
    "name": "p",
    "parentId": "featurerowcontent_emmsnzn",
    "props": {
      "className": "mt-6 text-xl leading-relaxed text-zinc-600 dark:text-zinc-400",
      "children": "Stop wondering where your money went. Our AI automatically categorizes every\n                transaction and builds beautiful, interactive charts so you can see your spending\n                habits at a glance."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "button_vs1eq81": {
    "id": "button_vs1eq81",
    "type": "Hudbird_Button",
    "name": "Button",
    "parentId": "featurerowcontent_emmsnzn",
    "props": {
      "variant": "outline",
      "className": "mt-10 h-14 rounded-full border-zinc-300 px-8 text-lg font-medium text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800",
      "children": "Explore budgeting tools"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featurerowmedia_eq6vder": {
    "id": "featurerowmedia_eq6vder",
    "type": "Hudbird_FeatureRowMedia",
    "name": "FeatureRowMedia",
    "parentId": "featurerow_p1b6bnh",
    "props": {},
    "childrenIds": [
      "div_nw6uznp"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_nw6uznp": {
    "id": "div_nw6uznp",
    "type": "Frame",
    "name": "div",
    "parentId": "featurerowmedia_eq6vder",
    "props": {
      "className": "relative flex h-[400px] w-full flex-col justify-end overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-2xl ring-1 ring-zinc-200 dark:bg-zinc-950 dark:ring-zinc-800"
    },
    "childrenIds": [
      "div_6e7mown",
      "div_zb4ny1t"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_6e7mown": {
    "id": "div_6e7mown",
    "type": "Frame",
    "name": "div",
    "parentId": "div_nw6uznp",
    "props": {
      "className": "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-50/50 via-transparent to-transparent dark:from-purple-900/10"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_zb4ny1t": {
    "id": "div_zb4ny1t",
    "type": "Frame",
    "name": "div",
    "parentId": "div_nw6uznp",
    "props": {
      "className": "relative z-10 flex h-full w-full flex-col justify-between pt-4"
    },
    "childrenIds": [
      "div_cb5ggvi",
      "div_6oz9hif"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_cb5ggvi": {
    "id": "div_cb5ggvi",
    "type": "Frame",
    "name": "div",
    "parentId": "div_zb4ny1t",
    "props": {
      "className": "flex items-center justify-between"
    },
    "childrenIds": [
      "span_d205t1d",
      "span_98s6hvj"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "span_d205t1d": {
    "id": "span_d205t1d",
    "type": "Text",
    "name": "span",
    "parentId": "div_cb5ggvi",
    "props": {
      "className": "text-xl font-bold text-zinc-900 dark:text-white",
      "children": "Monthly Spend"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "span_98s6hvj": {
    "id": "span_98s6hvj",
    "type": "Text",
    "name": "span",
    "parentId": "div_cb5ggvi",
    "props": {
      "className": "rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
      "children": "August"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_6oz9hif": {
    "id": "div_6oz9hif",
    "type": "Frame",
    "name": "div",
    "parentId": "div_zb4ny1t",
    "props": {
      "className": "mt-8 flex h-48 items-end justify-between gap-3"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_rto5az7": {
    "id": "div_rto5az7",
    "type": "Frame",
    "name": "div",
    "parentId": "div_0f2g1xt",
    "props": {
      "className": "bg-white py-12 dark:bg-zinc-950"
    },
    "childrenIds": [
      "testimonials_h6brqll"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "testimonials_h6brqll": {
    "id": "testimonials_h6brqll",
    "type": "Hudbird_Testimonials",
    "name": "Testimonials",
    "parentId": "div_rto5az7",
    "props": {},
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "ctasplit_lwtyab7": {
    "id": "ctasplit_lwtyab7",
    "type": "Hudbird_CtaSplit",
    "name": "CtaSplit",
    "parentId": "div_0f2g1xt",
    "props": {
      "className": "border-t border-zinc-800 bg-zinc-900 text-white dark:bg-zinc-900",
      "imageSrc": "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=2850&q=80",
      "primaryAction": {
        "label": "Download the App",
        "href": "#",
        "className": "bg-emerald-500 text-white hover:bg-emerald-600 rounded-full h-14 px-8 text-lg"
      },
      "secondaryAction": {
        "label": "Compare Cards",
        "href": "#",
        "className": "text-white border-zinc-700 hover:bg-zinc-800 rounded-full h-14 px-8 text-lg ml-0 sm:ml-4 mt-4 sm:mt-0"
      }
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "footersimple_ycry1q6": {
    "id": "footersimple_ycry1q6",
    "type": "Hudbird_FooterSimple",
    "name": "FooterSimple",
    "parentId": "div_0f2g1xt",
    "props": {
      "className": "border-t border-zinc-200 bg-zinc-50 dark:border-zinc-900 dark:bg-zinc-950",
      "links": [
        {
          "label": "Personal",
          "href": "#"
        },
        {
          "label": "Business",
          "href": "#"
        },
        {
          "label": "Security",
          "href": "#"
        },
        {
          "label": "Help Center",
          "href": "#"
        },
        {
          "label": "Fees",
          "href": "#"
        }
      ],
      "socials": [
        {
          "label": "Twitter",
          "href": "#",
          "icon": {
            "_type": "LucideIcon",
            "name": "MessageCircle",
            "size": 24
          }
        },
        {
          "label": "LinkedIn",
          "href": "#",
          "icon": {
            "_type": "LucideIcon",
            "name": "Briefcase",
            "size": 24
          }
        }
      ],
      "copyright": "© 2026 SecurePay Financial. All rights reserved."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  }
}
  },
  {
    name: 'ModernAppTemplate',
    rootNodeId: 'div_f1hxq6y',
    nodeData: {
  "div_f1hxq6y": {
    "id": "div_f1hxq6y",
    "type": "Frame",
    "name": "div",
    "parentId": null,
    "props": {
      "className": "flex min-h-screen w-full flex-col bg-zinc-50 dark:bg-zinc-950"
    },
    "childrenIds": [
      "hero_3ysl87u",
      "logocloud_cwmroyn",
      "div_dws36a6",
      "featuresection_ro8ysur",
      "div_awdyb9b",
      "footermega_ch8z4fa"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "hero_3ysl87u": {
    "id": "hero_3ysl87u",
    "type": "Hudbird_Hero",
    "name": "Hero",
    "parentId": "div_f1hxq6y",
    "props": {
      "size": "lg",
      "className": "relative overflow-hidden bg-zinc-50 dark:bg-zinc-950"
    },
    "childrenIds": [
      "div_dg9vb5a",
      "div_argps23",
      "heroheader_e4kqajp",
      "herobody_jgnkozl"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_dg9vb5a": {
    "id": "div_dg9vb5a",
    "type": "Frame",
    "name": "div",
    "parentId": "hero_3ysl87u",
    "props": {
      "className": "pointer-events-none absolute top-0 right-0 h-[800px] w-[800px] translate-x-1/3 -translate-y-12 rounded-full bg-rose-500/10 blur-3xl dark:bg-rose-500/20"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_argps23": {
    "id": "div_argps23",
    "type": "Frame",
    "name": "div",
    "parentId": "hero_3ysl87u",
    "props": {
      "className": "pointer-events-none absolute bottom-0 left-0 h-[600px] w-[600px] -translate-x-1/3 translate-y-1/3 rounded-full bg-orange-500/10 blur-3xl dark:bg-orange-500/20"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "heroheader_e4kqajp": {
    "id": "heroheader_e4kqajp",
    "type": "Hudbird_HeroHeader",
    "name": "HeroHeader",
    "parentId": "hero_3ysl87u",
    "props": {
      "className": "relative z-50",
      "links": [
        {
          "label": "Features",
          "href": "#"
        },
        {
          "label": "Testimonials",
          "href": "#"
        },
        {
          "label": "Download",
          "href": "#"
        }
      ]
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herobody_jgnkozl": {
    "id": "herobody_jgnkozl",
    "type": "Hudbird_HeroBody",
    "name": "HeroBody",
    "parentId": "hero_3ysl87u",
    "props": {
      "align": "center",
      "className": "relative z-10 mx-auto max-w-4xl pt-32 pb-24 lg:pt-40 lg:pb-32"
    },
    "childrenIds": [
      "herotitle_ld55z2k",
      "herodescription_lkgixxk",
      "heroactions_3mr54dr",
      "div_zy1oa9o"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herotitle_ld55z2k": {
    "id": "herotitle_ld55z2k",
    "type": "Hudbird_HeroTitle",
    "name": "HeroTitle",
    "parentId": "herobody_jgnkozl",
    "props": {
      "className": "text-6xl font-bold tracking-tight text-zinc-900 md:text-8xl dark:text-white"
    },
    "childrenIds": [
      "br_87gsq12",
      "span_h0kks26"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "br_87gsq12": {
    "id": "br_87gsq12",
    "type": "br",
    "name": "br",
    "parentId": "herotitle_ld55z2k",
    "props": {},
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "span_h0kks26": {
    "id": "span_h0kks26",
    "type": "Text",
    "name": "span",
    "parentId": "herotitle_ld55z2k",
    "props": {
      "className": "text-rose-500",
      "children": "Pulse."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "herodescription_lkgixxk": {
    "id": "herodescription_lkgixxk",
    "type": "Hudbird_HeroDescription",
    "name": "HeroDescription",
    "parentId": "herobody_jgnkozl",
    "props": {
      "className": "mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-zinc-600 dark:text-zinc-400",
      "children": "The all-in-one communication hub for modern teams and friends. Voice, video, and text\n            messaging combined in a beautifully simple interface."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "heroactions_3mr54dr": {
    "id": "heroactions_3mr54dr",
    "type": "Hudbird_HeroActions",
    "name": "HeroActions",
    "parentId": "herobody_jgnkozl",
    "props": {
      "className": "mt-12 justify-center"
    },
    "childrenIds": [
      "button_c6dajl3",
      "button_437onex"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "button_c6dajl3": {
    "id": "button_c6dajl3",
    "type": "Hudbird_Button",
    "name": "Button",
    "parentId": "heroactions_3mr54dr",
    "props": {
      "className": "flex h-14 items-center gap-2 rounded-full bg-zinc-900 px-8 text-lg text-white shadow-xl shadow-zinc-900/10 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:shadow-white/10 dark:hover:bg-zinc-200",
      "children": "Download for iOS"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "button_437onex": {
    "id": "button_437onex",
    "type": "Hudbird_Button",
    "name": "Button",
    "parentId": "heroactions_3mr54dr",
    "props": {
      "variant": "outline",
      "className": "h-14 rounded-full border-zinc-300 px-8 text-lg text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900",
      "children": "Watch Video"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_zy1oa9o": {
    "id": "div_zy1oa9o",
    "type": "Frame",
    "name": "div",
    "parentId": "herobody_jgnkozl",
    "props": {
      "className": "relative mx-auto mt-24 w-full max-w-5xl"
    },
    "childrenIds": [
      "div_9sp7a5t"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_9sp7a5t": {
    "id": "div_9sp7a5t",
    "type": "Frame",
    "name": "div",
    "parentId": "div_zy1oa9o",
    "props": {
      "className": "rounded-[3rem] border border-white/60 bg-white/40 p-4 shadow-[0_30px_100px_-20px_rgba(225,29,72,0.15)] backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-900/40 dark:shadow-[0_30px_100px_-20px_rgba(225,29,72,0.1)]"
    },
    "childrenIds": [
      "div_c8oz5rb"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_c8oz5rb": {
    "id": "div_c8oz5rb",
    "type": "Frame",
    "name": "div",
    "parentId": "div_9sp7a5t",
    "props": {
      "className": "relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-[2.5rem] border-4 border-zinc-900 bg-zinc-950"
    },
    "childrenIds": [
      "div_e5opijq",
      "div_44r7vl9"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_e5opijq": {
    "id": "div_e5opijq",
    "type": "Frame",
    "name": "div",
    "parentId": "div_c8oz5rb",
    "props": {
      "className": "absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-900/40 via-zinc-950 to-zinc-950"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_44r7vl9": {
    "id": "div_44r7vl9",
    "type": "Frame",
    "name": "div",
    "parentId": "div_c8oz5rb",
    "props": {
      "className": "relative z-10 flex h-[85%] w-[90%] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl"
    },
    "childrenIds": [
      "div_80k8903",
      "div_me69dnw"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_80k8903": {
    "id": "div_80k8903",
    "type": "Frame",
    "name": "div",
    "parentId": "div_44r7vl9",
    "props": {
      "className": "flex w-16 flex-col border-r border-zinc-800 pt-4 md:w-64"
    },
    "childrenIds": [
      "div_hegidw5"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_hegidw5": {
    "id": "div_hegidw5",
    "type": "Frame",
    "name": "div",
    "parentId": "div_80k8903",
    "props": {
      "className": "mb-6 hidden px-4 font-semibold text-white md:flex"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_me69dnw": {
    "id": "div_me69dnw",
    "type": "Frame",
    "name": "div",
    "parentId": "div_44r7vl9",
    "props": {
      "className": "flex flex-1 flex-col"
    },
    "childrenIds": [
      "div_5vysliw",
      "div_vbvs76i"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_5vysliw": {
    "id": "div_5vysliw",
    "type": "Frame",
    "name": "div",
    "parentId": "div_me69dnw",
    "props": {
      "className": "flex h-16 items-center border-b border-zinc-800 px-6"
    },
    "childrenIds": [
      "span_9i7tmc7"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "span_9i7tmc7": {
    "id": "span_9i7tmc7",
    "type": "Text",
    "name": "span",
    "parentId": "div_5vysliw",
    "props": {
      "className": "font-medium text-white",
      "children": "Design Team"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_vbvs76i": {
    "id": "div_vbvs76i",
    "type": "Frame",
    "name": "div",
    "parentId": "div_me69dnw",
    "props": {
      "className": "flex flex-1 flex-col justify-end gap-6 p-6 pb-10"
    },
    "childrenIds": [
      "motion_div_vdaqz9j",
      "motion_div_hxrwndx",
      "motion_div_6tx2squ"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "motion_div_vdaqz9j": {
    "id": "motion_div_vdaqz9j",
    "type": "motion.div",
    "name": "motion.div",
    "parentId": "div_vbvs76i",
    "props": {
      "initial": {
        "opacity": 0,
        "y": 10
      },
      "animate": {
        "opacity": 1,
        "y": 0
      },
      "transition": {
        "delay": 0.5
      },
      "className": "max-w-[70%] self-start rounded-2xl rounded-tl-none bg-zinc-800 p-4"
    },
    "childrenIds": [
      "div_6h2wjd8",
      "div_triloyt"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_6h2wjd8": {
    "id": "div_6h2wjd8",
    "type": "Frame",
    "name": "div",
    "parentId": "motion_div_vdaqz9j",
    "props": {
      "className": "mb-2 h-4 w-48 rounded bg-zinc-700"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_triloyt": {
    "id": "div_triloyt",
    "type": "Frame",
    "name": "div",
    "parentId": "motion_div_vdaqz9j",
    "props": {
      "className": "h-4 w-32 rounded bg-zinc-700"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "motion_div_hxrwndx": {
    "id": "motion_div_hxrwndx",
    "type": "motion.div",
    "name": "motion.div",
    "parentId": "div_vbvs76i",
    "props": {
      "initial": {
        "opacity": 0,
        "y": 10
      },
      "animate": {
        "opacity": 1,
        "y": 0
      },
      "transition": {
        "delay": 1.5
      },
      "className": "max-w-[70%] self-end rounded-2xl rounded-tr-none bg-rose-600 p-4"
    },
    "childrenIds": [
      "div_nk7qo35",
      "div_8zu7jnr"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_nk7qo35": {
    "id": "div_nk7qo35",
    "type": "Frame",
    "name": "div",
    "parentId": "motion_div_hxrwndx",
    "props": {
      "className": "mb-2 h-4 w-56 rounded bg-rose-500"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_8zu7jnr": {
    "id": "div_8zu7jnr",
    "type": "Frame",
    "name": "div",
    "parentId": "motion_div_hxrwndx",
    "props": {
      "className": "h-4 w-40 rounded bg-rose-500"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "motion_div_6tx2squ": {
    "id": "motion_div_6tx2squ",
    "type": "motion.div",
    "name": "motion.div",
    "parentId": "div_vbvs76i",
    "props": {
      "initial": {
        "opacity": 0,
        "y": 10
      },
      "animate": {
        "opacity": 1,
        "y": 0
      },
      "transition": {
        "delay": 2.5
      },
      "className": "flex gap-2 self-start"
    },
    "childrenIds": [
      "div_7ic6n20"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_7ic6n20": {
    "id": "div_7ic6n20",
    "type": "Frame",
    "name": "div",
    "parentId": "motion_div_6tx2squ",
    "props": {
      "className": "flex gap-1 rounded-2xl rounded-tl-none bg-zinc-800 p-3"
    },
    "childrenIds": [
      "motion_div_tw2nsuc",
      "motion_div_k5fnvin",
      "motion_div_gqd0bny"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "motion_div_tw2nsuc": {
    "id": "motion_div_tw2nsuc",
    "type": "motion.div",
    "name": "motion.div",
    "parentId": "div_7ic6n20",
    "props": {
      "animate": {
        "y": [
          0,
          0
        ]
      },
      "transition": {
        "duration": 1,
        "delay": 0
      },
      "className": "h-2 w-2 rounded-full bg-zinc-500"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "motion_div_k5fnvin": {
    "id": "motion_div_k5fnvin",
    "type": "motion.div",
    "name": "motion.div",
    "parentId": "div_7ic6n20",
    "props": {
      "animate": {
        "y": [
          0,
          0
        ]
      },
      "transition": {
        "duration": 1,
        "delay": 0.2
      },
      "className": "h-2 w-2 rounded-full bg-zinc-500"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "motion_div_gqd0bny": {
    "id": "motion_div_gqd0bny",
    "type": "motion.div",
    "name": "motion.div",
    "parentId": "div_7ic6n20",
    "props": {
      "animate": {
        "y": [
          0,
          0
        ]
      },
      "transition": {
        "duration": 1,
        "delay": 0.4
      },
      "className": "h-2 w-2 rounded-full bg-zinc-500"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "logocloud_cwmroyn": {
    "id": "logocloud_cwmroyn",
    "type": "Hudbird_LogoCloud",
    "name": "LogoCloud",
    "parentId": "div_f1hxq6y",
    "props": {
      "className": "overflow-hidden border-y border-zinc-100 bg-white py-20 dark:border-zinc-900 dark:bg-zinc-950"
    },
    "childrenIds": [
      "logocloudtitle_yqlqevs",
      "logocloudticker_arakajs"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "logocloudtitle_yqlqevs": {
    "id": "logocloudtitle_yqlqevs",
    "type": "Hudbird_LogoCloudTitle",
    "name": "LogoCloudTitle",
    "parentId": "logocloud_cwmroyn",
    "props": {
      "className": "mb-10 text-sm font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-400",
      "children": "Loved by teams at"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "logocloudticker_arakajs": {
    "id": "logocloudticker_arakajs",
    "type": "Hudbird_LogoCloudTicker",
    "name": "LogoCloudTicker",
    "parentId": "logocloud_cwmroyn",
    "props": {
      "speed": "fast",
      "direction": "left"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_dws36a6": {
    "id": "div_dws36a6",
    "type": "Frame",
    "name": "div",
    "parentId": "div_f1hxq6y",
    "props": {
      "className": "relative w-full border-b border-zinc-100 bg-zinc-50 px-4 py-32 sm:px-8 dark:border-zinc-900 dark:bg-zinc-950"
    },
    "childrenIds": [
      "div_nbqdrqk"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_nbqdrqk": {
    "id": "div_nbqdrqk",
    "type": "Frame",
    "name": "div",
    "parentId": "div_dws36a6",
    "props": {
      "className": "mx-auto max-w-6xl space-y-16"
    },
    "childrenIds": [
      "div_rdn4cfu",
      "bentogrid_f8v7cvg"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_rdn4cfu": {
    "id": "div_rdn4cfu",
    "type": "Frame",
    "name": "div",
    "parentId": "div_nbqdrqk",
    "props": {
      "className": "mx-auto max-w-3xl text-center"
    },
    "childrenIds": [
      "h2_8y2euds",
      "p_49px3kc"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "h2_8y2euds": {
    "id": "h2_8y2euds",
    "type": "Text",
    "name": "h2",
    "parentId": "div_rdn4cfu",
    "props": {
      "className": "text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-white"
    },
    "childrenIds": [
      "br_4xbm65s"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "br_4xbm65s": {
    "id": "br_4xbm65s",
    "type": "br",
    "name": "br",
    "parentId": "h2_8y2euds",
    "props": {},
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "p_49px3kc": {
    "id": "p_49px3kc",
    "type": "Text",
    "name": "p",
    "parentId": "div_rdn4cfu",
    "props": {
      "className": "mt-6 text-xl text-zinc-600 dark:text-zinc-400",
      "children": "Designed with extreme focus on performance, usability, and delight."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "bentogrid_f8v7cvg": {
    "id": "bentogrid_f8v7cvg",
    "type": "Hudbird_BentoGrid",
    "name": "BentoGrid",
    "parentId": "div_nbqdrqk",
    "props": {
      "className": "gap-6 md:auto-rows-[28rem] md:grid-cols-3"
    },
    "childrenIds": [
      "bentocard_js88vu5",
      "bentocard_43n2hcr"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "bentocard_js88vu5": {
    "id": "bentocard_js88vu5",
    "type": "Hudbird_BentoCard",
    "name": "BentoCard",
    "parentId": "bentogrid_f8v7cvg",
    "props": {
      "className": "group flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white md:col-span-2 dark:border-zinc-800 dark:bg-zinc-900"
    },
    "childrenIds": [
      "div_ijam2x6",
      "bentocardcontent_2bipq76"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_ijam2x6": {
    "id": "div_ijam2x6",
    "type": "Frame",
    "name": "div",
    "parentId": "bentocard_js88vu5",
    "props": {
      "className": "relative flex min-h-[250px] flex-1 items-center justify-center overflow-hidden bg-zinc-100 p-8 dark:bg-zinc-950"
    },
    "childrenIds": [
      "div_s8ihf7m"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_s8ihf7m": {
    "id": "div_s8ihf7m",
    "type": "Frame",
    "name": "div",
    "parentId": "div_ijam2x6",
    "props": {
      "className": "relative flex h-40 w-full max-w-md items-center justify-between"
    },
    "childrenIds": [
      "div_aai3dj4",
      "div_yo7jnul",
      "motion_div_t0bkkvl",
      "div_gusbti0"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_aai3dj4": {
    "id": "div_aai3dj4",
    "type": "Frame",
    "name": "div",
    "parentId": "div_s8ihf7m",
    "props": {
      "className": "relative z-10 flex flex-col items-center gap-4"
    },
    "childrenIds": [
      "div_0b0f761",
      "span_fanfj6v"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_0b0f761": {
    "id": "div_0b0f761",
    "type": "Frame",
    "name": "div",
    "parentId": "div_aai3dj4",
    "props": {
      "className": "flex h-20 w-16 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "span_fanfj6v": {
    "id": "span_fanfj6v",
    "type": "Text",
    "name": "span",
    "parentId": "div_aai3dj4",
    "props": {
      "className": "text-sm font-medium text-zinc-500",
      "children": "Mobile"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_yo7jnul": {
    "id": "div_yo7jnul",
    "type": "Frame",
    "name": "div",
    "parentId": "div_s8ihf7m",
    "props": {
      "className": "absolute top-[38px] right-16 left-16 -z-10 h-0.5 bg-zinc-200 dark:bg-zinc-800"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "motion_div_t0bkkvl": {
    "id": "motion_div_t0bkkvl",
    "type": "motion.div",
    "name": "motion.div",
    "parentId": "div_s8ihf7m",
    "props": {
      "animate": {
        "x": [
          "0%",
          "400%"
        ]
      },
      "transition": {
        "duration": 1.5,
        "ease": "linear"
      },
      "className": "absolute top-[37px] left-16 h-1 w-16 bg-gradient-to-r from-transparent via-rose-500 to-transparent blur-sm"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_gusbti0": {
    "id": "div_gusbti0",
    "type": "Frame",
    "name": "div",
    "parentId": "div_s8ihf7m",
    "props": {
      "className": "relative z-10 flex flex-col items-center gap-4"
    },
    "childrenIds": [
      "div_cy3eolb",
      "span_geud4ky"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_cy3eolb": {
    "id": "div_cy3eolb",
    "type": "Frame",
    "name": "div",
    "parentId": "div_gusbti0",
    "props": {
      "className": "flex h-20 w-32 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "span_geud4ky": {
    "id": "span_geud4ky",
    "type": "Text",
    "name": "span",
    "parentId": "div_gusbti0",
    "props": {
      "className": "text-sm font-medium text-zinc-500",
      "children": "Desktop"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "bentocardcontent_2bipq76": {
    "id": "bentocardcontent_2bipq76",
    "type": "Hudbird_BentoCardContent",
    "name": "BentoCardContent",
    "parentId": "bentocard_js88vu5",
    "props": {
      "className": "border-t border-zinc-100 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900"
    },
    "childrenIds": [
      "div_lms7kfy",
      "text_4hzcagr",
      "text_clp6rdj"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_lms7kfy": {
    "id": "div_lms7kfy",
    "type": "Frame",
    "name": "div",
    "parentId": "bentocardcontent_2bipq76",
    "props": {
      "className": "mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "text_4hzcagr": {
    "id": "text_4hzcagr",
    "type": "Hudbird_Text",
    "name": "Text",
    "parentId": "bentocardcontent_2bipq76",
    "props": {
      "variant": "strong",
      "className": "text-3xl font-bold text-zinc-900 dark:text-white",
      "children": "Lightning Fast Sync"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "text_clp6rdj": {
    "id": "text_clp6rdj",
    "type": "Hudbird_Text",
    "name": "Text",
    "parentId": "bentocardcontent_2bipq76",
    "props": {
      "className": "mt-4 max-w-md text-lg text-zinc-600 dark:text-zinc-400",
      "children": "Your messages sync instantly across all your devices. Start a conversation on your\n                  phone, finish it on your desktop seamlessly."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "bentocard_43n2hcr": {
    "id": "bentocard_43n2hcr",
    "type": "Hudbird_BentoCard",
    "name": "BentoCard",
    "parentId": "bentogrid_f8v7cvg",
    "props": {
      "className": "group flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white md:col-span-1 dark:border-zinc-800 dark:bg-zinc-900"
    },
    "childrenIds": [
      "div_ukr2x9p",
      "bentocardcontent_6dda3fh"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_ukr2x9p": {
    "id": "div_ukr2x9p",
    "type": "Frame",
    "name": "div",
    "parentId": "bentocard_43n2hcr",
    "props": {
      "className": "relative flex min-h-[250px] flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 p-8 dark:from-blue-950/30 dark:to-indigo-950/30"
    },
    "childrenIds": [
      "motion_div_2gvz3i9"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "motion_div_2gvz3i9": {
    "id": "motion_div_2gvz3i9",
    "type": "motion.div",
    "name": "motion.div",
    "parentId": "div_ukr2x9p",
    "props": {
      "animate": {
        "scale": [
          1,
          1.1,
          1
        ]
      },
      "transition": {
        "duration": 4
      },
      "className": "relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-blue-200 dark:border-blue-800"
    },
    "childrenIds": [
      "div_587cw0r"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_587cw0r": {
    "id": "div_587cw0r",
    "type": "Frame",
    "name": "div",
    "parentId": "motion_div_2gvz3i9",
    "props": {
      "className": "absolute inset-0 animate-spin rounded-full border-4 border-blue-500 border-t-transparent",
      "style": {
        "animationDuration": "3s"
      }
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "bentocardcontent_6dda3fh": {
    "id": "bentocardcontent_6dda3fh",
    "type": "Hudbird_BentoCardContent",
    "name": "BentoCardContent",
    "parentId": "bentocard_43n2hcr",
    "props": {
      "className": "border-t border-zinc-100 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900"
    },
    "childrenIds": [
      "text_epn6gyr",
      "text_f5prq2r"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "text_epn6gyr": {
    "id": "text_epn6gyr",
    "type": "Hudbird_Text",
    "name": "Text",
    "parentId": "bentocardcontent_6dda3fh",
    "props": {
      "variant": "strong",
      "className": "text-2xl font-bold text-zinc-900 dark:text-white",
      "children": "End-to-End Encryption"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "text_f5prq2r": {
    "id": "text_f5prq2r",
    "type": "Hudbird_Text",
    "name": "Text",
    "parentId": "bentocardcontent_6dda3fh",
    "props": {
      "className": "mt-4 text-zinc-600 dark:text-zinc-400",
      "children": "Privacy isn't an option, it's the default. Your conversations are secured with\n                  industry-leading protocol encryption."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featuresection_ro8ysur": {
    "id": "featuresection_ro8ysur",
    "type": "Hudbird_FeatureSection",
    "name": "FeatureSection",
    "parentId": "div_f1hxq6y",
    "props": {
      "className": "bg-white py-32 dark:bg-zinc-950"
    },
    "childrenIds": [
      "featurealternating_4xlzxfe"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featurealternating_4xlzxfe": {
    "id": "featurealternating_4xlzxfe",
    "type": "Hudbird_FeatureAlternating",
    "name": "FeatureAlternating",
    "parentId": "featuresection_ro8ysur",
    "props": {},
    "childrenIds": [
      "featurerow_1f7kfvr",
      "featurerow_uke9hcy"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featurerow_1f7kfvr": {
    "id": "featurerow_1f7kfvr",
    "type": "Hudbird_FeatureRow",
    "name": "FeatureRow",
    "parentId": "featurealternating_4xlzxfe",
    "props": {},
    "childrenIds": [
      "featurerowcontent_7iexam4",
      "featurerowmedia_pj8oh6i"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featurerowcontent_7iexam4": {
    "id": "featurerowcontent_7iexam4",
    "type": "Hudbird_FeatureRowContent",
    "name": "FeatureRowContent",
    "parentId": "featurerow_1f7kfvr",
    "props": {},
    "childrenIds": [
      "h3_0bacqwi",
      "p_4dqn05z",
      "button_bi6t3b6"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "h3_0bacqwi": {
    "id": "h3_0bacqwi",
    "type": "Text",
    "name": "h3",
    "parentId": "featurerowcontent_7iexam4",
    "props": {
      "className": "text-4xl font-bold tracking-tight text-zinc-900 dark:text-white",
      "children": "HD Video Calls"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "p_4dqn05z": {
    "id": "p_4dqn05z",
    "type": "Text",
    "name": "p",
    "parentId": "featurerowcontent_7iexam4",
    "props": {
      "className": "mt-6 text-xl leading-relaxed text-zinc-600 dark:text-zinc-400",
      "children": "Connect face-to-face with crystal clear 4K video calling. Our adaptive bitrate\n                technology ensures smooth calls even on weak cellular networks."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "button_bi6t3b6": {
    "id": "button_bi6t3b6",
    "type": "Hudbird_Button",
    "name": "Button",
    "parentId": "featurerowcontent_7iexam4",
    "props": {
      "variant": "outline",
      "className": "mt-8 h-14 rounded-full border-zinc-300 px-8 text-lg font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900",
      "children": "Learn more about calls"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featurerowmedia_pj8oh6i": {
    "id": "featurerowmedia_pj8oh6i",
    "type": "Hudbird_FeatureRowMedia",
    "name": "FeatureRowMedia",
    "parentId": "featurerow_1f7kfvr",
    "props": {},
    "childrenIds": [
      "div_32rjhwd"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_32rjhwd": {
    "id": "div_32rjhwd",
    "type": "Frame",
    "name": "div",
    "parentId": "featurerowmedia_pj8oh6i",
    "props": {
      "className": "relative mx-auto w-72 md:w-80"
    },
    "childrenIds": [
      "div_wz4uiy2"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_wz4uiy2": {
    "id": "div_wz4uiy2",
    "type": "Frame",
    "name": "div",
    "parentId": "div_32rjhwd",
    "props": {
      "className": "relative flex h-[650px] w-full flex-col justify-between overflow-hidden rounded-[3.5rem] border-[16px] border-zinc-900 bg-zinc-950 p-4 shadow-2xl"
    },
    "childrenIds": [
      "div_ex3peye",
      "div_nw69dfi",
      "div_zvqhm4c",
      "div_t69aec4"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_ex3peye": {
    "id": "div_ex3peye",
    "type": "Frame",
    "name": "div",
    "parentId": "div_wz4uiy2",
    "props": {
      "className": "absolute top-0 left-1/2 z-20 h-6 w-32 -translate-x-1/2 rounded-b-3xl bg-zinc-900"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_nw69dfi": {
    "id": "div_nw69dfi",
    "type": "Frame",
    "name": "div",
    "parentId": "div_wz4uiy2",
    "props": {
      "className": "absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=600&h=1200&q=80')] bg-cover bg-center"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_zvqhm4c": {
    "id": "div_zvqhm4c",
    "type": "Frame",
    "name": "div",
    "parentId": "div_wz4uiy2",
    "props": {
      "className": "relative z-10 mt-12 ml-auto h-36 w-24 overflow-hidden rounded-2xl border-2 border-white/20 bg-zinc-800"
    },
    "childrenIds": [
      "img_7xa336q"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "img_7xa336q": {
    "id": "img_7xa336q",
    "type": "img",
    "name": "img",
    "parentId": "div_zvqhm4c",
    "props": {
      "src": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      "className": "h-full w-full object-cover",
      "alt": "pip"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_t69aec4": {
    "id": "div_t69aec4",
    "type": "Frame",
    "name": "div",
    "parentId": "div_wz4uiy2",
    "props": {
      "className": "relative z-10 mb-4 flex w-full justify-center gap-6 rounded-3xl bg-black/40 p-6 backdrop-blur-md"
    },
    "childrenIds": [
      "div_q5huh0j",
      "div_6aqew65",
      "div_yujt37d"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_q5huh0j": {
    "id": "div_q5huh0j",
    "type": "Frame",
    "name": "div",
    "parentId": "div_t69aec4",
    "props": {
      "className": "flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_6aqew65": {
    "id": "div_6aqew65",
    "type": "Frame",
    "name": "div",
    "parentId": "div_t69aec4",
    "props": {
      "className": "flex h-12 w-12 rotate-[135deg] items-center justify-center rounded-full bg-rose-500 text-white"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_yujt37d": {
    "id": "div_yujt37d",
    "type": "Frame",
    "name": "div",
    "parentId": "div_t69aec4",
    "props": {
      "className": "flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featurerow_uke9hcy": {
    "id": "featurerow_uke9hcy",
    "type": "Hudbird_FeatureRow",
    "name": "FeatureRow",
    "parentId": "featurealternating_4xlzxfe",
    "props": {
      "reverse": true,
      "className": "mt-32"
    },
    "childrenIds": [
      "featurerowcontent_d2u5q6g",
      "featurerowmedia_s5gtq0f"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featurerowcontent_d2u5q6g": {
    "id": "featurerowcontent_d2u5q6g",
    "type": "Hudbird_FeatureRowContent",
    "name": "FeatureRowContent",
    "parentId": "featurerow_uke9hcy",
    "props": {},
    "childrenIds": [
      "h3_k7j39e8",
      "p_35px6j9",
      "button_bwfsmdi"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "h3_k7j39e8": {
    "id": "h3_k7j39e8",
    "type": "Text",
    "name": "h3",
    "parentId": "featurerowcontent_d2u5q6g",
    "props": {
      "className": "text-4xl font-bold tracking-tight text-zinc-900 dark:text-white",
      "children": "Smart Organization"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "p_35px6j9": {
    "id": "p_35px6j9",
    "type": "Text",
    "name": "p",
    "parentId": "featurerowcontent_d2u5q6g",
    "props": {
      "className": "mt-6 text-xl leading-relaxed text-zinc-600 dark:text-zinc-400",
      "children": "Pulse automatically organizes your files, links, and media shared in chats into\n                easily accessible galleries. Never lose that important document again."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "button_bwfsmdi": {
    "id": "button_bwfsmdi",
    "type": "Hudbird_Button",
    "name": "Button",
    "parentId": "featurerowcontent_d2u5q6g",
    "props": {
      "variant": "outline",
      "className": "mt-8 h-14 rounded-full border-zinc-300 px-8 text-lg font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900",
      "children": "Explore file sharing"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "featurerowmedia_s5gtq0f": {
    "id": "featurerowmedia_s5gtq0f",
    "type": "Hudbird_FeatureRowMedia",
    "name": "FeatureRowMedia",
    "parentId": "featurerow_uke9hcy",
    "props": {},
    "childrenIds": [
      "div_msridsq"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_msridsq": {
    "id": "div_msridsq",
    "type": "Frame",
    "name": "div",
    "parentId": "featurerowmedia_s5gtq0f",
    "props": {
      "className": "relative mx-auto w-72 md:w-80"
    },
    "childrenIds": [
      "div_47ulnnr"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_47ulnnr": {
    "id": "div_47ulnnr",
    "type": "Frame",
    "name": "div",
    "parentId": "div_msridsq",
    "props": {
      "className": "relative flex h-[650px] w-full flex-col gap-4 overflow-hidden rounded-[3.5rem] border-[16px] border-zinc-900 bg-zinc-950 p-4 pt-16 shadow-2xl"
    },
    "childrenIds": [
      "div_j9ewtqx",
      "span_a87m75b",
      "div_6z8gbpv",
      "div_z4qnmlh"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_j9ewtqx": {
    "id": "div_j9ewtqx",
    "type": "Frame",
    "name": "div",
    "parentId": "div_47ulnnr",
    "props": {
      "className": "absolute top-0 left-1/2 z-20 h-6 w-32 -translate-x-1/2 rounded-b-3xl bg-zinc-900"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "span_a87m75b": {
    "id": "span_a87m75b",
    "type": "Text",
    "name": "span",
    "parentId": "div_47ulnnr",
    "props": {
      "className": "px-2 text-2xl font-bold text-white",
      "children": "Shared Media"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_6z8gbpv": {
    "id": "div_6z8gbpv",
    "type": "Frame",
    "name": "div",
    "parentId": "div_47ulnnr",
    "props": {
      "className": "mb-2 flex gap-2 px-2"
    },
    "childrenIds": [
      "span_ans2bwu",
      "span_euvt2im",
      "span_1f4hk8a"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "span_ans2bwu": {
    "id": "span_ans2bwu",
    "type": "Text",
    "name": "span",
    "parentId": "div_6z8gbpv",
    "props": {
      "className": "rounded-full bg-zinc-800 px-4 py-1.5 text-sm font-medium text-white",
      "children": "Photos"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "span_euvt2im": {
    "id": "span_euvt2im",
    "type": "Text",
    "name": "span",
    "parentId": "div_6z8gbpv",
    "props": {
      "className": "rounded-full bg-transparent px-4 py-1.5 text-sm font-medium text-zinc-500",
      "children": "Links"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "span_1f4hk8a": {
    "id": "span_1f4hk8a",
    "type": "Text",
    "name": "span",
    "parentId": "div_6z8gbpv",
    "props": {
      "className": "rounded-full bg-transparent px-4 py-1.5 text-sm font-medium text-zinc-500",
      "children": "Docs"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_z4qnmlh": {
    "id": "div_z4qnmlh",
    "type": "Frame",
    "name": "div",
    "parentId": "div_47ulnnr",
    "props": {
      "className": "grid flex-1 grid-cols-2 gap-2 pb-4"
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "div_awdyb9b": {
    "id": "div_awdyb9b",
    "type": "Frame",
    "name": "div",
    "parentId": "div_f1hxq6y",
    "props": {
      "className": "border-t border-zinc-100 bg-white px-4 py-24 sm:px-6 dark:border-zinc-900 dark:bg-zinc-950"
    },
    "childrenIds": [
      "ctacentered_4zikirt"
    ],
    "responsiveStyles": {
      "base": {}
    }
  },
  "ctacentered_4zikirt": {
    "id": "ctacentered_4zikirt",
    "type": "Hudbird_CtaCentered",
    "name": "CtaCentered",
    "parentId": "div_awdyb9b",
    "props": {
      "className": "mx-auto max-w-6xl rounded-[3rem] bg-zinc-100 py-24 shadow-2xl dark:bg-zinc-900",
      "primaryAction": {
        "label": "Download Pulse Free",
        "className": "bg-rose-500 text-white hover:bg-rose-600 rounded-full h-14 px-8 text-lg font-medium"
      },
      "secondaryAction": {
        "label": "Use in Browser",
        "href": "#",
        "className": "text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full h-14 px-8 text-lg font-medium mt-4 sm:mt-0 sm:ml-4"
      }
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  },
  "footermega_ch8z4fa": {
    "id": "footermega_ch8z4fa",
    "type": "Hudbird_FooterMega",
    "name": "FooterMega",
    "parentId": "div_f1hxq6y",
    "props": {
      "className": "border-t border-zinc-200 bg-zinc-50 pt-16 dark:border-zinc-900 dark:bg-zinc-950",
      "brandName": "",
      "description": "Building the future of communication. One message at a time.",
      "linkGroups": [
        {
          "title": "Product",
          "links": [
            {
              "label": "Features",
              "href": "#"
            },
            {
              "label": "Security",
              "href": "#"
            },
            {
              "label": "Integrations",
              "href": "#"
            },
            {
              "label": "Pricing",
              "href": "#"
            }
          ]
        },
        {
          "title": "Support",
          "links": [
            {
              "label": "Help Center",
              "href": "#"
            },
            {
              "label": "Community",
              "href": "#"
            },
            {
              "label": "Contact Us",
              "href": "#"
            },
            {
              "label": "Status",
              "href": "#"
            }
          ]
        },
        {
          "title": "Company",
          "links": [
            {
              "label": "About",
              "href": "#"
            },
            {
              "label": "Blog",
              "href": "#"
            },
            {
              "label": "Careers",
              "href": "#"
            },
            {
              "label": "Press",
              "href": "#"
            }
          ]
        }
      ],
      "socials": [
        {
          "label": "Twitter",
          "href": "#",
          "icon": {
            "_type": "LucideIcon",
            "name": "Globe",
            "size": 24
          }
        }
      ],
      "copyright": "© 2026 Pulse Communications Inc. All rights reserved."
    },
    "childrenIds": [],
    "responsiveStyles": {
      "base": {}
    }
  }
}
  },
];

