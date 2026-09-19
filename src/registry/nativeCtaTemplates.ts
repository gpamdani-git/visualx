// AUTO GENERATED - Native Canvas CTA Templates
// @ts-nocheck
import { CanvasNode } from '../types/builder';

export const nativeCtaTemplates: { rootNodeId: string, name: string, nodeData: Record<string, CanvasNode> }[] = [
  {
    name: "CtaCentered (Editable)",
    rootNodeId: "cta_centered_section_wglmoqo",
    nodeData: {
    "cta_centered_section_wglmoqo": {
        "id": "cta_centered_section_wglmoqo",
        "type": "Frame",
        "name": "CtaCentered Section",
        "parentId": null,
        "childrenIds": [
            "cta_centered_inner_honf0wz"
        ],
        "props": {
            "className": "relative overflow-hidden py-24 sm:py-32 bg-white dark:bg-zinc-900 w-full"
        },
        "responsiveStyles": {
            "base": {
                "paddingTop": 0,
                "paddingRight": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "marginTop": 0,
                "marginRight": 0,
                "marginBottom": 0,
                "marginLeft": 0,
                "opacity": 1,
                "overflow": "visible",
                "position": "static"
            }
        }
    },
    "cta_centered_inner_honf0wz": {
        "id": "cta_centered_inner_honf0wz",
        "type": "Frame",
        "name": "CTA Content",
        "parentId": "cta_centered_section_wglmoqo",
        "childrenIds": [
            "cta_centered_title_bbe5gg9",
            "cta_centered_desc_x8h7oe5",
            "cta_centered_buttons_ct4tu07"
        ],
        "props": {
            "className": "mx-auto max-w-3xl text-center flex flex-col items-center gap-6"
        },
        "responsiveStyles": {
            "base": {
                "paddingTop": 0,
                "paddingRight": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "marginTop": 0,
                "marginRight": 0,
                "marginBottom": 0,
                "marginLeft": 0,
                "opacity": 1,
                "overflow": "visible",
                "position": "static",
                "display": "flex",
                "layoutDirection": "column",
                "alignItems": "center",
                "gap": 24
            }
        }
    },
    "cta_centered_title_bbe5gg9": {
        "id": "cta_centered_title_bbe5gg9",
        "type": "Text",
        "name": "CTA Title",
        "parentId": "cta_centered_inner_honf0wz",
        "childrenIds": [],
        "props": {
            "text": "Boost your productivity. Start using our app today.",
            "className": "text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl"
        },
        "responsiveStyles": {
            "base": {
                "paddingTop": 0,
                "paddingRight": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "marginTop": 0,
                "marginRight": 0,
                "marginBottom": 0,
                "marginLeft": 0,
                "opacity": 1,
                "overflow": "visible",
                "position": "static"
            }
        }
    },
    "cta_centered_desc_x8h7oe5": {
        "id": "cta_centered_desc_x8h7oe5",
        "type": "Text",
        "name": "CTA Description",
        "parentId": "cta_centered_inner_honf0wz",
        "childrenIds": [],
        "props": {
            "text": "Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam.",
            "className": "mx-auto max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400"
        },
        "responsiveStyles": {
            "base": {
                "paddingTop": 0,
                "paddingRight": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "marginTop": 0,
                "marginRight": 0,
                "marginBottom": 0,
                "marginLeft": 0,
                "opacity": 1,
                "overflow": "visible",
                "position": "static"
            }
        }
    },
    "cta_centered_buttons_ct4tu07": {
        "id": "cta_centered_buttons_ct4tu07",
        "type": "Frame",
        "name": "CTA Buttons",
        "parentId": "cta_centered_inner_honf0wz",
        "childrenIds": [
            "cta_centered_primary_btn_wjtqjy3",
            "cta_centered_secondary_btn_so3wcsr"
        ],
        "props": {
            "className": "flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-4"
        },
        "responsiveStyles": {
            "base": {
                "paddingTop": 0,
                "paddingRight": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "marginTop": 0,
                "marginRight": 0,
                "marginBottom": 0,
                "marginLeft": 0,
                "opacity": 1,
                "overflow": "visible",
                "position": "static",
                "display": "flex",
                "layoutDirection": "row",
                "alignItems": "center",
                "justifyContent": "center",
                "gap": 16
            }
        }
    },
    "cta_centered_primary_btn_wjtqjy3": {
        "id": "cta_centered_primary_btn_wjtqjy3",
        "type": "Hudbird_Button",
        "name": "Primary Button",
        "parentId": "cta_centered_buttons_ct4tu07",
        "childrenIds": [],
        "props": {
            "children": "Get started",
            "variant": "solid",
            "color": "indigo",
            "className": "w-full sm:w-auto"
        },
        "responsiveStyles": {
            "base": {
                "paddingTop": 0,
                "paddingRight": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "marginTop": 0,
                "marginRight": 0,
                "marginBottom": 0,
                "marginLeft": 0,
                "opacity": 1,
                "overflow": "visible",
                "position": "static",
                "widthType": "auto",
                "heightType": "auto"
            }
        }
    },
    "cta_centered_secondary_btn_so3wcsr": {
        "id": "cta_centered_secondary_btn_so3wcsr",
        "type": "Hudbird_Button",
        "name": "Secondary Button",
        "parentId": "cta_centered_buttons_ct4tu07",
        "childrenIds": [],
        "props": {
            "children": "Learn more",
            "variant": "outline",
            "color": "zinc",
            "className": "w-full sm:w-auto"
        },
        "responsiveStyles": {
            "base": {
                "paddingTop": 0,
                "paddingRight": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "marginTop": 0,
                "marginRight": 0,
                "marginBottom": 0,
                "marginLeft": 0,
                "opacity": 1,
                "overflow": "visible",
                "position": "static",
                "widthType": "auto",
                "heightType": "auto"
            }
        }
    }
}
  },
  {
    name: "CtaSplit (Editable)",
    rootNodeId: "cta_split_section_c6pzzkj",
    nodeData: {
    "cta_split_section_c6pzzkj": {
        "id": "cta_split_section_c6pzzkj",
        "type": "Frame",
        "name": "CtaSplit Section",
        "parentId": null,
        "childrenIds": [
            "cta_split_inner_xufewac"
        ],
        "props": {
            "className": "relative overflow-hidden py-16 sm:py-24 bg-indigo-600 w-full"
        },
        "responsiveStyles": {
            "base": {
                "paddingTop": 0,
                "paddingRight": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "marginTop": 0,
                "marginRight": 0,
                "marginBottom": 0,
                "marginLeft": 0,
                "opacity": 1,
                "overflow": "visible",
                "position": "static"
            }
        }
    },
    "cta_split_inner_xufewac": {
        "id": "cta_split_inner_xufewac",
        "type": "Frame",
        "name": "CTA Split Inner",
        "parentId": "cta_split_section_c6pzzkj",
        "childrenIds": [
            "cta_split_left_xgss5d3",
            "cta_split_right_g4x7w7d"
        ],
        "props": {
            "className": "mx-auto max-w-7xl px-6 lg:px-8 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between"
        },
        "responsiveStyles": {
            "base": {
                "paddingTop": 0,
                "paddingRight": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "marginTop": 0,
                "marginRight": 0,
                "marginBottom": 0,
                "marginLeft": 0,
                "opacity": 1,
                "overflow": "visible",
                "position": "static",
                "display": "flex",
                "layoutDirection": "row",
                "alignItems": "center",
                "gap": 40
            }
        }
    },
    "cta_split_left_xgss5d3": {
        "id": "cta_split_left_xgss5d3",
        "type": "Frame",
        "name": "CTA Left",
        "parentId": "cta_split_inner_xufewac",
        "childrenIds": [
            "cta_split_title_mf8hglh",
            "cta_split_desc_cs11gvm"
        ],
        "props": {
            "className": "flex flex-col gap-4 max-w-2xl"
        },
        "responsiveStyles": {
            "base": {
                "paddingTop": 0,
                "paddingRight": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "marginTop": 0,
                "marginRight": 0,
                "marginBottom": 0,
                "marginLeft": 0,
                "opacity": 1,
                "overflow": "visible",
                "position": "static",
                "display": "flex",
                "layoutDirection": "column",
                "gap": 16
            }
        }
    },
    "cta_split_title_mf8hglh": {
        "id": "cta_split_title_mf8hglh",
        "type": "Text",
        "name": "CTA Title",
        "parentId": "cta_split_left_xgss5d3",
        "childrenIds": [],
        "props": {
            "text": "Boost your productivity. Start using our app today.",
            "className": "text-3xl font-bold tracking-tight text-white sm:text-4xl"
        },
        "responsiveStyles": {
            "base": {
                "paddingTop": 0,
                "paddingRight": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "marginTop": 0,
                "marginRight": 0,
                "marginBottom": 0,
                "marginLeft": 0,
                "opacity": 1,
                "overflow": "visible",
                "position": "static"
            }
        }
    },
    "cta_split_desc_cs11gvm": {
        "id": "cta_split_desc_cs11gvm",
        "type": "Text",
        "name": "CTA Description",
        "parentId": "cta_split_left_xgss5d3",
        "childrenIds": [],
        "props": {
            "text": "Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam.",
            "className": "text-lg leading-8 text-indigo-200"
        },
        "responsiveStyles": {
            "base": {
                "paddingTop": 0,
                "paddingRight": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "marginTop": 0,
                "marginRight": 0,
                "marginBottom": 0,
                "marginLeft": 0,
                "opacity": 1,
                "overflow": "visible",
                "position": "static"
            }
        }
    },
    "cta_split_right_g4x7w7d": {
        "id": "cta_split_right_g4x7w7d",
        "type": "Frame",
        "name": "CTA Right (Buttons)",
        "parentId": "cta_split_inner_xufewac",
        "childrenIds": [
            "cta_split_primary_btn_lahojuq",
            "cta_split_secondary_btn_khxy5vi"
        ],
        "props": {
            "className": "flex flex-col sm:flex-row items-center gap-4 shrink-0"
        },
        "responsiveStyles": {
            "base": {
                "paddingTop": 0,
                "paddingRight": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "marginTop": 0,
                "marginRight": 0,
                "marginBottom": 0,
                "marginLeft": 0,
                "opacity": 1,
                "overflow": "visible",
                "position": "static",
                "display": "flex",
                "layoutDirection": "row",
                "alignItems": "center",
                "gap": 16
            }
        }
    },
    "cta_split_primary_btn_lahojuq": {
        "id": "cta_split_primary_btn_lahojuq",
        "type": "Hudbird_Button",
        "name": "Primary Button",
        "parentId": "cta_split_right_g4x7w7d",
        "childrenIds": [],
        "props": {
            "children": "Get started",
            "variant": "solid",
            "color": "white",
            "className": "w-full sm:w-auto"
        },
        "responsiveStyles": {
            "base": {
                "paddingTop": 0,
                "paddingRight": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "marginTop": 0,
                "marginRight": 0,
                "marginBottom": 0,
                "marginLeft": 0,
                "opacity": 1,
                "overflow": "visible",
                "position": "static",
                "widthType": "auto",
                "heightType": "auto"
            }
        }
    },
    "cta_split_secondary_btn_khxy5vi": {
        "id": "cta_split_secondary_btn_khxy5vi",
        "type": "Hudbird_Button",
        "name": "Secondary Button",
        "parentId": "cta_split_right_g4x7w7d",
        "childrenIds": [],
        "props": {
            "children": "Learn more",
            "variant": "ghost",
            "color": "white",
            "className": "w-full sm:w-auto text-white"
        },
        "responsiveStyles": {
            "base": {
                "paddingTop": 0,
                "paddingRight": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "marginTop": 0,
                "marginRight": 0,
                "marginBottom": 0,
                "marginLeft": 0,
                "opacity": 1,
                "overflow": "visible",
                "position": "static",
                "widthType": "auto",
                "heightType": "auto"
            }
        }
    }
}
  },
];
