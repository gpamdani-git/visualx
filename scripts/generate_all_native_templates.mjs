/**
 * generate_all_native_templates.mjs
 * 
 * Generates fully-decomposed native CanvasNode blueprints for ALL Hudbird marketing components.
 * Each component is broken into individually-selectable Frame/Text/Button/Image nodes.
 * 
 * Run: node scripts/generate_all_native_templates.mjs
 */
import fs from 'fs';

const OUTPUT_FILE = './src/registry/nativeHudbirdTemplates.ts';

let _counter = 0;
function uid(prefix) {
  _counter++;
  return `${prefix}_${_counter.toString(36)}${Date.now().toString(36).slice(-4)}`;
}

// Minimal responsiveStyles that don't override Tailwind className
function rs(extras = {}) {
  return { base: { opacity: 1, position: 'static', ...extras } };
}

function frame(id, name, parentId, childrenIds, className, rsExtras = {}) {
  return {
    id, type: 'Frame', name,
    parentId, childrenIds,
    props: { className },
    responsiveStyles: rs(rsExtras)
  };
}

function text(id, name, parentId, content, className = '') {
  return {
    id, type: 'Text', name,
    parentId, childrenIds: [],
    props: { text: content, className },
    responsiveStyles: rs()
  };
}

function image(id, name, parentId, src, alt = '', className = '') {
  return {
    id, type: 'Image', name,
    parentId, childrenIds: [],
    props: { src, alt, className },
    responsiveStyles: rs()
  };
}

function hudbirdBtn(id, name, parentId, label, variant = 'solid', color = 'primary', className = '') {
  return {
    id, type: 'Hudbird_Button', name,
    parentId, childrenIds: [],
    props: { children: label, variant, color, className },
    responsiveStyles: rs()
  };
}

// ─────────────────────────────────────────────
// CTA CENTERED
// ─────────────────────────────────────────────
function makeCtaCentered() {
  const sectionId = uid('cta_centered_section');
  const innerId = uid('cta_centered_inner');
  const titleId = uid('cta_centered_title');
  const descId = uid('cta_centered_desc');
  const buttonsId = uid('cta_centered_buttons');
  const primaryBtnId = uid('cta_centered_primary');
  const secondaryBtnId = uid('cta_centered_secondary');

  const nodes = {
    [sectionId]: frame(sectionId, 'CtaCentered Section', null, [innerId],
      'relative overflow-hidden py-24 sm:py-32 bg-white dark:bg-zinc-900 w-full'),
    [innerId]: frame(innerId, 'CTA Content', sectionId, [titleId, descId, buttonsId],
      'mx-auto max-w-3xl text-center flex flex-col items-center gap-6 px-4'),
    [titleId]: text(titleId, 'CTA Title', innerId,
      'Boost your productivity. Start using our app today.',
      'text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl'),
    [descId]: text(descId, 'CTA Description', innerId,
      'Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua proident excepteur commodo.',
      'mx-auto max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400'),
    [buttonsId]: frame(buttonsId, 'CTA Buttons', innerId, [primaryBtnId, secondaryBtnId],
      'flex flex-col sm:flex-row items-center justify-center gap-4 mt-4'),
    [primaryBtnId]: hudbirdBtn(primaryBtnId, 'Get Started Button', buttonsId, 'Get started', 'solid', 'indigo', 'w-full sm:w-auto'),
    [secondaryBtnId]: hudbirdBtn(secondaryBtnId, 'Learn More Button', buttonsId, 'Learn more', 'outline', 'zinc', 'w-full sm:w-auto'),
  };
  return { rootNodeId: sectionId, name: 'CTA Centered', nodeData: nodes };
}

// ─────────────────────────────────────────────
// CTA SPLIT
// ─────────────────────────────────────────────
function makeCtaSplit() {
  const sectionId = uid('cta_split_section');
  const innerId = uid('cta_split_inner');
  const leftId = uid('cta_split_left');
  const titleId = uid('cta_split_title');
  const descId = uid('cta_split_desc');
  const rightId = uid('cta_split_right');
  const imgId = uid('cta_split_img');
  const primaryBtnId = uid('cta_split_primary');
  const secondaryBtnId = uid('cta_split_secondary');

  const nodes = {
    [sectionId]: frame(sectionId, 'CtaSplit Section', null, [innerId],
      'relative overflow-hidden py-16 sm:py-24 bg-white dark:bg-zinc-900 w-full'),
    [innerId]: frame(innerId, 'CTA Split Inner', sectionId, [leftId, rightId],
      'mx-auto max-w-7xl px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-16'),
    [leftId]: frame(leftId, 'CTA Left', innerId, [titleId, descId],
      'flex flex-col gap-4 max-w-2xl'),
    [titleId]: text(titleId, 'CTA Title', leftId,
      'Join thousands of developers.',
      'text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl'),
    [descId]: text(descId, 'CTA Description', leftId,
      'Lorem ipsum dolor sit amet consect adipisicing elit. Possimus magnam voluptatum cupiditate veritatis in accusamus quisquam.',
      'text-lg leading-8 text-zinc-600 dark:text-zinc-400'),
    [rightId]: frame(rightId, 'CTA Right', innerId, [imgId, primaryBtnId, secondaryBtnId],
      'flex flex-col items-start gap-6 shrink-0'),
    [imgId]: image(imgId, 'CTA Image', rightId,
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      'Team working together',
      'rounded-2xl w-full max-w-md object-cover aspect-video shadow-lg'),
    [primaryBtnId]: hudbirdBtn(primaryBtnId, 'Get Started Button', rightId, 'Get started', 'solid', 'indigo', 'w-full sm:w-auto'),
    [secondaryBtnId]: hudbirdBtn(secondaryBtnId, 'Learn More Button', rightId, 'Learn more', 'outline', 'zinc', 'w-full sm:w-auto'),
  };
  return { rootNodeId: sectionId, name: 'CTA Split', nodeData: nodes };
}

// ─────────────────────────────────────────────
// CTA GLASS
// ─────────────────────────────────────────────
function makeCtaGlass() {
  const wrapperId = uid('cta_glass_wrapper');
  const orb1Id = uid('cta_glass_orb1');
  const orb2Id = uid('cta_glass_orb2');
  const glassId = uid('cta_glass_card');
  const innerId = uid('cta_glass_inner');
  const titleId = uid('cta_glass_title');
  const descId = uid('cta_glass_desc');
  const buttonsId = uid('cta_glass_buttons');
  const primaryBtnId = uid('cta_glass_primary');
  const secondaryBtnId = uid('cta_glass_secondary');

  const nodes = {
    [wrapperId]: frame(wrapperId, 'CtaGlass Wrapper', null, [orb1Id, orb2Id, glassId],
      'relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-950 dark:to-indigo-950/20 py-24'),
    [orb1Id]: frame(orb1Id, 'Orb Left', wrapperId, [],
      'absolute top-0 left-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/30 blur-[100px] pointer-events-none'),
    [orb2Id]: frame(orb2Id, 'Orb Right', wrapperId, [],
      'absolute right-1/4 bottom-0 h-96 w-96 translate-x-1/2 rounded-full bg-cyan-500/30 blur-[100px] pointer-events-none'),
    [glassId]: frame(glassId, 'Glass Card', wrapperId, [innerId],
      'relative mx-auto max-w-3xl rounded-2xl bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-2xl p-10 sm:p-16'),
    [innerId]: frame(innerId, 'Glass Content', glassId, [titleId, descId, buttonsId],
      'flex flex-col items-center text-center gap-6'),
    [titleId]: text(titleId, 'Glass Title', innerId,
      'Ready to Take Control of Your Health?',
      'text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl'),
    [descId]: text(descId, 'Glass Description', innerId,
      'Get expert care for weight loss, sexual health, wellness, and more — all from the comfort of home, no insurance needed.',
      'max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-300'),
    [buttonsId]: frame(buttonsId, 'Glass Buttons', innerId, [primaryBtnId, secondaryBtnId],
      'flex flex-col sm:flex-row items-center justify-center gap-4 mt-2'),
    [primaryBtnId]: hudbirdBtn(primaryBtnId, 'Start Now Button', buttonsId, 'Start Now', 'solid', 'indigo', 'w-full sm:w-auto'),
    [secondaryBtnId]: hudbirdBtn(secondaryBtnId, 'Contact Button', buttonsId, 'Contact Us', 'outline', 'zinc', 'w-full sm:w-auto'),
  };
  return { rootNodeId: wrapperId, name: 'CTA Glass', nodeData: nodes };
}

// ─────────────────────────────────────────────
// HERO MINIMALIST
// ─────────────────────────────────────────────
function makeHeroMinimalist() {
  const heroId = uid('hero_min_section');
  const bgId = uid('hero_min_bg');
  const bodyId = uid('hero_min_body');
  const contentId = uid('hero_min_content');
  const badgeId = uid('hero_min_badge');
  const titleId = uid('hero_min_title');
  const descId = uid('hero_min_desc');
  const actionsId = uid('hero_min_actions');
  const primaryBtnId = uid('hero_min_primary');
  const secondaryBtnId = uid('hero_min_secondary');

  const nodes = {
    [heroId]: frame(heroId, 'Hero Section', null, [bgId, bodyId],
      'relative flex h-screen flex-col overflow-hidden bg-white dark:bg-[#050505] w-full'),
    [bgId]: image(bgId, 'Hero Background', heroId,
      '/assets/marketing-section/hero-bg.webp', 'Hero background',
      'absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-30 pointer-events-none'),
    [bodyId]: frame(bodyId, 'Hero Body', heroId, [contentId],
      'relative flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8'),
    [contentId]: frame(contentId, 'Hero Content', bodyId, [badgeId, titleId, descId, actionsId],
      'mx-auto max-w-3xl text-center flex flex-col items-center gap-6'),
    [badgeId]: text(badgeId, 'Hero Badge', contentId,
      'Announcing our next round of funding. Read more →',
      'inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20 ring-inset'),
    [titleId]: text(titleId, 'Hero Title', contentId,
      'Data to enrich your online business',
      'text-5xl sm:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight'),
    [descId]: text(descId, 'Hero Description', contentId,
      'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat.',
      'max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400'),
    [actionsId]: frame(actionsId, 'Hero Actions', contentId, [primaryBtnId, secondaryBtnId],
      'flex flex-col sm:flex-row items-center justify-center gap-4 mt-2'),
    [primaryBtnId]: hudbirdBtn(primaryBtnId, 'Get Started Button', actionsId, 'Get started →', 'solid', 'primary', 'w-full sm:w-auto'),
    [secondaryBtnId]: hudbirdBtn(secondaryBtnId, 'Learn More Button', actionsId, 'Learn more →', 'light', 'zinc', 'w-full sm:w-auto'),
  };
  return { rootNodeId: heroId, name: 'Hero Minimalist', nodeData: nodes };
}

// ─────────────────────────────────────────────
// HERO SPLIT (Two Column)
// ─────────────────────────────────────────────
function makeHeroSplit() {
  const heroId = uid('hero_split_section');
  const innerId = uid('hero_split_inner');
  const leftId = uid('hero_split_left');
  const badgeId = uid('hero_split_badge');
  const titleId = uid('hero_split_title');
  const descId = uid('hero_split_desc');
  const actionsId = uid('hero_split_actions');
  const primaryBtnId = uid('hero_split_primary');
  const rightId = uid('hero_split_right');
  const imgId = uid('hero_split_img');

  const nodes = {
    [heroId]: frame(heroId, 'Hero Split Section', null, [innerId],
      'relative min-h-screen flex flex-col bg-zinc-50 dark:bg-[#050505] overflow-hidden w-full'),
    [innerId]: frame(innerId, 'Hero Split Inner', heroId, [leftId, rightId],
      'relative flex flex-1 flex-col lg:flex-row items-center justify-between gap-12 mx-auto max-w-7xl px-6 lg:px-8 py-24'),
    [leftId]: frame(leftId, 'Hero Left Content', innerId, [badgeId, titleId, descId, actionsId],
      'flex flex-col gap-6 max-w-xl'),
    [badgeId]: text(badgeId, 'Hero Badge', leftId,
      'New Feature Release',
      'inline-flex items-center rounded-full bg-white/50 dark:bg-white/10 px-3 py-1 text-sm font-medium text-zinc-600 dark:text-zinc-200 ring-1 ring-zinc-200 dark:ring-white/20 backdrop-blur-md'),
    [titleId]: text(titleId, 'Hero Title', leftId,
      'Build faster with Hudbird UI',
      'text-5xl sm:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white text-left'),
    [descId]: text(descId, 'Hero Description', leftId,
      'Deploy your next web application in minutes with our premium React components. Beautifully designed, accessible, and ready for production.',
      'text-lg leading-8 text-zinc-500 dark:text-zinc-400 text-left'),
    [actionsId]: frame(actionsId, 'Hero Actions', leftId, [primaryBtnId],
      'flex items-center gap-4'),
    [primaryBtnId]: hudbirdBtn(primaryBtnId, 'Start Building Button', actionsId, 'Start building →', 'solid', 'primary', ''),
    [rightId]: frame(rightId, 'Hero Right Media', innerId, [imgId],
      'relative flex items-center justify-center w-full lg:w-auto'),
    [imgId]: image(imgId, 'Hero Image', rightId,
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
      'App screenshot',
      'rounded-3xl shadow-2xl w-full max-w-2xl object-cover aspect-video'),
  };
  return { rootNodeId: heroId, name: 'Hero Split', nodeData: nodes };
}

// ─────────────────────────────────────────────
// HERO GLASS
// ─────────────────────────────────────────────
function makeHeroGlass() {
  const heroId = uid('hero_glass_section');
  const orb1Id = uid('hero_glass_orb1');
  const orb2Id = uid('hero_glass_orb2');
  const bodyId = uid('hero_glass_body');
  const glassId = uid('hero_glass_card');
  const titleId = uid('hero_glass_title');
  const descId = uid('hero_glass_desc');
  const actionsId = uid('hero_glass_actions');
  const primaryBtnId = uid('hero_glass_primary');
  const secondaryBtnId = uid('hero_glass_secondary');

  const nodes = {
    [heroId]: frame(heroId, 'Hero Glass Section', null, [orb1Id, orb2Id, bodyId],
      'relative flex h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950/20 w-full'),
    [orb1Id]: frame(orb1Id, 'Orb 1', heroId, [],
      'absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full bg-indigo-400/20 dark:bg-indigo-500/15 blur-[120px] pointer-events-none'),
    [orb2Id]: frame(orb2Id, 'Orb 2', heroId, [],
      'absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-purple-400/20 dark:bg-purple-500/15 blur-[120px] pointer-events-none'),
    [bodyId]: frame(bodyId, 'Hero Glass Body', heroId, [glassId],
      'relative z-10 mx-auto max-w-3xl px-6 text-center'),
    [glassId]: frame(glassId, 'Glass Card', bodyId, [titleId, descId, actionsId],
      'flex flex-col items-center gap-6 rounded-3xl bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-2xl px-8 py-14'),
    [titleId]: text(titleId, 'Hero Glass Title', glassId,
      'The Future of Web Development',
      'text-5xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-6xl'),
    [descId]: text(descId, 'Hero Glass Description', glassId,
      'Build stunning interfaces faster than ever with our comprehensive component library. Production-ready, accessible, and beautiful by default.',
      'max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-300'),
    [actionsId]: frame(actionsId, 'Hero Glass Actions', glassId, [primaryBtnId, secondaryBtnId],
      'flex flex-col sm:flex-row items-center gap-4'),
    [primaryBtnId]: hudbirdBtn(primaryBtnId, 'Get Started Button', actionsId, 'Get started', 'solid', 'indigo', 'w-full sm:w-auto'),
    [secondaryBtnId]: hudbirdBtn(secondaryBtnId, 'View Demo Button', actionsId, 'View demo →', 'light', 'zinc', 'w-full sm:w-auto'),
  };
  return { rootNodeId: heroId, name: 'Hero Glass', nodeData: nodes };
}

// ─────────────────────────────────────────────
// FAQ BASIC
// ─────────────────────────────────────────────
function makeFaqBasic() {
  const sectionId = uid('faq_section');
  const headerId = uid('faq_header');
  const labelId = uid('faq_label');
  const titleId = uid('faq_title');
  const descId = uid('faq_desc');
  const faqsId = uid('faq_list');
  
  // Create 3 FAQ items
  const items = [
    { q: 'How does the pricing work?', a: 'Our pricing is based on a monthly subscription model. You can choose between our Starter, Pro, and Enterprise plans. There are no hidden fees.' },
    { q: 'Can I cancel my subscription at any time?', a: 'Yes, you can cancel your subscription at any time from your account settings. You will continue to have access until the end of your billing cycle.' },
    { q: 'Is there a free trial available?', a: 'Yes! We offer a 14-day free trial on all plans. No credit card required to get started.' },
  ];
  
  const itemNodes = {};
  const itemIds = items.map((item, i) => {
    const itemId = uid(`faq_item_${i}`);
    const qId = uid(`faq_q_${i}`);
    const aId = uid(`faq_a_${i}`);
    itemNodes[itemId] = frame(itemId, `FAQ Item ${i + 1}`, faqsId, [qId, aId],
      'border-b border-zinc-200 dark:border-zinc-800 py-6');
    itemNodes[qId] = text(qId, `Question ${i + 1}`, itemId,
      item.q, 'text-lg font-semibold text-zinc-900 dark:text-white');
    itemNodes[aId] = text(aId, `Answer ${i + 1}`, itemId,
      item.a, 'mt-3 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed');
    return itemId;
  });

  const nodes = {
    [sectionId]: frame(sectionId, 'FAQ Section', null, [headerId, faqsId],
      'relative overflow-hidden py-24 sm:py-32 bg-white dark:bg-zinc-900 w-full'),
    [headerId]: frame(headerId, 'FAQ Header', sectionId, [labelId, titleId, descId],
      'mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center gap-4 mb-16'),
    [labelId]: text(labelId, 'FAQ Label', headerId,
      'FAQ', 'text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400'),
    [titleId]: text(titleId, 'FAQ Title', headerId,
      'Frequently Asked Questions',
      'text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl'),
    [descId]: text(descId, 'FAQ Description', headerId,
      "Have questions? We're here to help. If you can't find your answer below, reach out to our support team.",
      'text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl'),
    [faqsId]: frame(faqsId, 'FAQ List', sectionId, itemIds,
      'mx-auto max-w-3xl px-6 lg:px-8 divide-y divide-zinc-200 dark:divide-zinc-800'),
    ...itemNodes
  };
  return { rootNodeId: sectionId, name: 'FAQ Basic', nodeData: nodes };
}

// ─────────────────────────────────────────────
// FEATURE SECTION
// ─────────────────────────────────────────────
function makeFeatureSection() {
  const sectionId = uid('feature_section');
  const headerId = uid('feature_header');
  const labelId = uid('feature_label');
  const titleId = uid('feature_title');
  const descId = uid('feature_desc');
  const gridId = uid('feature_grid');
  
  const features = [
    { icon: '⚡', title: 'Lightning Fast', desc: 'Built with performance in mind. Every component is optimized for the fastest possible render times.' },
    { icon: '🔒', title: 'Secure by Default', desc: 'Security-first design patterns built into every component, so you can focus on building your product.' },
    { icon: '🌍', title: 'Global Ready', desc: 'Full internationalization support with RTL layouts and built-in locale handling.' },
    { icon: '📱', title: 'Mobile First', desc: 'Responsive design built into every component with a mobile-first approach.' },
    { icon: '☁️', title: 'Cloud Native', desc: 'Deploy anywhere with our cloud-native architecture. Works seamlessly with any hosting provider.' },
    { icon: '🔌', title: 'Plugin System', desc: 'Extend functionality with our powerful plugin system. Build custom integrations with ease.' },
  ];
  
  const featureNodes = {};
  const featureIds = features.map((feat, i) => {
    const cardId = uid(`feature_card_${i}`);
    const iconId = uid(`feature_icon_${i}`);
    const ftitleId = uid(`feature_ftitle_${i}`);
    const fdescId = uid(`feature_fdesc_${i}`);
    featureNodes[cardId] = frame(cardId, `Feature ${i + 1}`, gridId, [iconId, ftitleId, fdescId],
      'flex flex-col gap-3 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700');
    featureNodes[iconId] = text(iconId, `Feature Icon ${i + 1}`, cardId, feat.icon, 'text-4xl');
    featureNodes[ftitleId] = text(ftitleId, `Feature Title ${i + 1}`, cardId, feat.title, 'text-lg font-semibold text-zinc-900 dark:text-white');
    featureNodes[fdescId] = text(fdescId, `Feature Desc ${i + 1}`, cardId, feat.desc, 'text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed');
    return cardId;
  });

  const nodes = {
    [sectionId]: frame(sectionId, 'Feature Section', null, [headerId, gridId],
      'relative overflow-hidden py-24 sm:py-32 bg-white dark:bg-zinc-900 w-full'),
    [headerId]: frame(headerId, 'Feature Header', sectionId, [labelId, titleId, descId],
      'mx-auto max-w-2xl text-center mb-16 px-4 flex flex-col items-center gap-4'),
    [labelId]: text(labelId, 'Feature Label', headerId,
      'FEATURES', 'text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400'),
    [titleId]: text(titleId, 'Feature Title', headerId,
      'Everything you need to build faster',
      'text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl'),
    [descId]: text(descId, 'Feature Description', headerId,
      'Our component library ships with everything you need to build modern, accessible, and beautiful web applications.',
      'text-lg text-zinc-600 dark:text-zinc-400'),
    [gridId]: frame(gridId, 'Features Grid', sectionId, featureIds,
      'mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'),
    ...featureNodes
  };
  return { rootNodeId: sectionId, name: 'Feature Section', nodeData: nodes };
}

// ─────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────
function makeTestimonials() {
  const sectionId = uid('testimonials_section');
  const headerId = uid('testimonials_header');
  const titleId = uid('testimonials_title');
  const descId = uid('testimonials_desc');
  const gridId = uid('testimonials_grid');

  const testimonials = [
    { name: 'Sarah Chen', role: 'CTO at TechCorp', avatar: 'SC', quote: 'This component library has transformed our development workflow. We ship features 3x faster than before.' },
    { name: 'Marcus Johnson', role: 'Lead Developer', avatar: 'MJ', quote: 'The quality of components is outstanding. Every detail is polished and the documentation is excellent.' },
    { name: 'Emily Rodriguez', role: 'Product Manager', avatar: 'ER', quote: 'Our team loves how easy it is to create beautiful interfaces. The design consistency across components is perfect.' },
  ];

  const testimonialNodes = {};
  const testimonialIds = testimonials.map((t, i) => {
    const cardId = uid(`testi_card_${i}`);
    const quoteId = uid(`testi_quote_${i}`);
    const authorId = uid(`testi_author_${i}`);
    const avatarId = uid(`testi_avatar_${i}`);
    const nameId = uid(`testi_name_${i}`);
    const roleId = uid(`testi_role_${i}`);
    testimonialNodes[cardId] = frame(cardId, `Testimonial ${i + 1}`, gridId, [quoteId, authorId],
      'flex flex-col gap-6 p-8 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm');
    testimonialNodes[quoteId] = text(quoteId, `Quote ${i + 1}`, cardId, `"${t.quote}"`,
      'text-base text-zinc-700 dark:text-zinc-300 leading-relaxed italic');
    testimonialNodes[authorId] = frame(authorId, `Author ${i + 1}`, cardId, [avatarId, nameId, roleId],
      'flex items-center gap-3');
    testimonialNodes[avatarId] = text(avatarId, `Avatar ${i + 1}`, authorId, t.avatar,
      'flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center justify-center');
    testimonialNodes[nameId] = text(nameId, `Name ${i + 1}`, authorId, t.name,
      'font-semibold text-zinc-900 dark:text-white text-sm');
    testimonialNodes[roleId] = text(roleId, `Role ${i + 1}`, authorId, t.role,
      'text-sm text-zinc-500 dark:text-zinc-400');
    return cardId;
  });

  const nodes = {
    [sectionId]: frame(sectionId, 'Testimonials Section', null, [headerId, gridId],
      'relative py-24 sm:py-32 bg-zinc-50 dark:bg-zinc-950 w-full overflow-hidden'),
    [headerId]: frame(headerId, 'Testimonials Header', sectionId, [titleId, descId],
      'mx-auto max-w-2xl text-center mb-16 px-4 flex flex-col items-center gap-4'),
    [titleId]: text(titleId, 'Testimonials Title', headerId,
      "What They're Saying",
      'text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl'),
    [descId]: text(descId, 'Testimonials Desc', headerId,
      "Don't just take our word for it. Hear what our customers have to say about their experience.",
      'text-lg text-zinc-600 dark:text-zinc-400'),
    [gridId]: frame(gridId, 'Testimonials Grid', sectionId, testimonialIds,
      'mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'),
    ...testimonialNodes
  };
  return { rootNodeId: sectionId, name: 'Testimonials', nodeData: nodes };
}

// ─────────────────────────────────────────────
// LOGO CLOUD
// ─────────────────────────────────────────────
function makeLogoCloud() {
  const sectionId = uid('logocloud_section');
  const labelId = uid('logocloud_label');
  const logosId = uid('logocloud_logos');

  const logos = ['Vercel', 'Stripe', 'GitHub', 'Figma', 'Notion', 'Linear'];
  const logoNodes = {};
  const logoIds = logos.map((name, i) => {
    const logoId = uid(`logocloud_logo_${i}`);
    logoNodes[logoId] = text(logoId, `${name} Logo`, logosId, name,
      'text-xl font-bold text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors');
    return logoId;
  });

  const nodes = {
    [sectionId]: frame(sectionId, 'Logo Cloud Section', null, [labelId, logosId],
      'relative py-16 bg-white dark:bg-zinc-900 w-full border-y border-zinc-200 dark:border-zinc-800'),
    [labelId]: text(labelId, 'Logo Cloud Label', sectionId,
      'Trusted by the world\'s most innovative companies',
      'text-center text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-8 mx-auto'),
    [logosId]: frame(logosId, 'Logos Row', sectionId, logoIds,
      'mx-auto max-w-7xl px-6 lg:px-8 flex flex-wrap items-center justify-center gap-8 lg:gap-12'),
    ...logoNodes
  };
  return { rootNodeId: sectionId, name: 'Logo Cloud', nodeData: nodes };
}

// ─────────────────────────────────────────────
// PRICING SECTION
// ─────────────────────────────────────────────
function makePricingSection() {
  const sectionId = uid('pricing_section');
  const headerId = uid('pricing_header');
  const labelId = uid('pricing_label');
  const titleId = uid('pricing_title');
  const descId = uid('pricing_desc');
  const tiersId = uid('pricing_tiers');

  const tiers = [
    { name: 'Starter', price: '$9', desc: 'Perfect for individuals and small projects.', color: 'bg-white dark:bg-zinc-800', features: ['5 projects', '10GB storage', 'Basic analytics', 'Email support'] },
    { name: 'Pro', price: '$29', desc: 'For growing teams that need more power.', color: 'bg-indigo-600', features: ['Unlimited projects', '100GB storage', 'Advanced analytics', 'Priority support', 'Custom domains'], featured: true },
    { name: 'Enterprise', price: '$99', desc: 'For large organizations with custom needs.', color: 'bg-white dark:bg-zinc-800', features: ['Everything in Pro', 'Unlimited storage', 'Custom integrations', 'Dedicated support', 'SLA guarantee'] },
  ];

  const tierNodes = {};
  const tierIds = tiers.map((tier, i) => {
    const tierId = uid(`pricing_tier_${i}`);
    const tierNameId = uid(`pricing_tier_name_${i}`);
    const tierPriceId = uid(`pricing_tier_price_${i}`);
    const tierDescId = uid(`pricing_tier_desc_${i}`);
    const tierFeaturesId = uid(`pricing_tier_features_${i}`);
    const tierBtnId = uid(`pricing_tier_btn_${i}`);
    
    const featureNodes = {};
    const featureIds = tier.features.map((feat, j) => {
      const featId = uid(`pricing_feat_${i}_${j}`);
      featureNodes[featId] = text(featId, `Feature ${j + 1}`, tierFeaturesId, `✓ ${feat}`,
        tier.featured ? 'text-sm text-indigo-200' : 'text-sm text-zinc-600 dark:text-zinc-400');
      return featId;
    });

    tierNodes[tierId] = frame(tierId, `${tier.name} Tier`, tiersId, [tierNameId, tierPriceId, tierDescId, tierFeaturesId, tierBtnId],
      `relative flex flex-col gap-6 rounded-3xl p-8 ${tier.featured ? 'bg-indigo-600 shadow-2xl scale-105 z-10' : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700'}`);
    tierNodes[tierNameId] = text(tierNameId, 'Tier Name', tierId, tier.name,
      `text-lg font-semibold ${tier.featured ? 'text-indigo-200' : 'text-zinc-600 dark:text-zinc-400'}`);
    tierNodes[tierPriceId] = text(tierPriceId, 'Tier Price', tierId, tier.price,
      `text-5xl font-bold ${tier.featured ? 'text-white' : 'text-zinc-900 dark:text-white'}`);
    tierNodes[tierDescId] = text(tierDescId, 'Tier Description', tierId, tier.desc,
      `text-sm ${tier.featured ? 'text-indigo-200' : 'text-zinc-500 dark:text-zinc-400'}`);
    tierNodes[tierFeaturesId] = frame(tierFeaturesId, 'Tier Features', tierId, featureIds, 'flex flex-col gap-3');
    tierNodes[tierBtnId] = hudbirdBtn(tierBtnId, 'Tier CTA Button', tierId, 'Get started',
      tier.featured ? 'solid' : 'outline',
      tier.featured ? 'white' : 'indigo', 'w-full mt-2');
    Object.assign(tierNodes, featureNodes);
    return tierId;
  });

  const nodes = {
    [sectionId]: frame(sectionId, 'Pricing Section', null, [headerId, tiersId],
      'relative py-24 sm:py-32 bg-zinc-50 dark:bg-zinc-950 w-full overflow-hidden'),
    [headerId]: frame(headerId, 'Pricing Header', sectionId, [labelId, titleId, descId],
      'mx-auto max-w-2xl text-center mb-16 px-4 flex flex-col items-center gap-4'),
    [labelId]: text(labelId, 'Pricing Label', headerId,
      'PRICING', 'text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400'),
    [titleId]: text(titleId, 'Pricing Title', headerId,
      'Simple, transparent pricing',
      'text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl'),
    [descId]: text(descId, 'Pricing Description', headerId,
      'Choose the plan that fits your needs. No hidden fees, no long-term contracts.',
      'text-lg text-zinc-600 dark:text-zinc-400'),
    [tiersId]: frame(tiersId, 'Pricing Tiers', sectionId, tierIds,
      'mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 gap-6 lg:grid-cols-3 items-center'),
    ...tierNodes
  };
  return { rootNodeId: sectionId, name: 'Pricing Section', nodeData: nodes };
}

// ─────────────────────────────────────────────
// FOOTER SIMPLE
// ─────────────────────────────────────────────
function makeFooterSimple() {
  const footerId = uid('footer_section');
  const topId = uid('footer_top');
  const logoId = uid('footer_logo');
  const navId = uid('footer_nav');
  const bottomId = uid('footer_bottom');
  const copyrightId = uid('footer_copyright');

  const navLinks = ['Product', 'Features', 'Pricing', 'Company', 'Blog', 'Support'];
  const linkNodes = {};
  const linkIds = navLinks.map((link, i) => {
    const linkId = uid(`footer_link_${i}`);
    linkNodes[linkId] = text(linkId, `${link} Link`, navId, link,
      'text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer');
    return linkId;
  });

  const nodes = {
    [footerId]: frame(footerId, 'Footer', null, [topId, bottomId],
      'bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 w-full'),
    [topId]: frame(topId, 'Footer Top', footerId, [logoId, navId],
      'mx-auto max-w-7xl px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8'),
    [logoId]: text(logoId, 'Footer Logo', topId, 'YourBrand',
      'text-xl font-bold text-zinc-900 dark:text-white'),
    [navId]: frame(navId, 'Footer Nav', topId, linkIds,
      'flex flex-wrap gap-6'),
    [bottomId]: frame(bottomId, 'Footer Bottom', footerId, [copyrightId],
      'mx-auto max-w-7xl px-6 lg:px-8 py-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between'),
    [copyrightId]: text(copyrightId, 'Copyright', bottomId,
      '© 2024 YourBrand. All rights reserved.',
      'text-sm text-zinc-500 dark:text-zinc-400'),
    ...linkNodes
  };
  return { rootNodeId: footerId, name: 'Footer Simple', nodeData: nodes };
}

// ─────────────────────────────────────────────
// BENTO GRID
// ─────────────────────────────────────────────
function makeBentoGrid() {
  const sectionId = uid('bento_section');
  const headerId = uid('bento_header');
  const labelId = uid('bento_label');
  const titleId = uid('bento_title');
  const gridId = uid('bento_grid');

  const cards = [
    { span: 'lg:col-span-2', title: 'Analytics Dashboard', desc: 'Real-time insights with beautiful visualizations.', emoji: '📊', bg: 'bg-gradient-to-br from-indigo-500 to-purple-600', textColor: 'text-white' },
    { span: 'lg:col-span-1', title: 'Collaboration', desc: 'Work together seamlessly.', emoji: '👥', bg: 'bg-white dark:bg-zinc-800', textColor: 'text-zinc-900 dark:text-white' },
    { span: 'lg:col-span-1', title: 'Security First', desc: 'Enterprise-grade security.', emoji: '🔒', bg: 'bg-white dark:bg-zinc-800', textColor: 'text-zinc-900 dark:text-white' },
    { span: 'lg:col-span-2', title: 'Global Infrastructure', desc: 'Deploy globally with edge computing across 200+ cities worldwide.', emoji: '🌍', bg: 'bg-gradient-to-br from-cyan-500 to-blue-600', textColor: 'text-white' },
  ];

  const cardNodes = {};
  const cardIds = cards.map((card, i) => {
    const cardId = uid(`bento_card_${i}`);
    const emojiId = uid(`bento_emoji_${i}`);
    const ctitleId = uid(`bento_ctitle_${i}`);
    const cdescId = uid(`bento_cdesc_${i}`);
    cardNodes[cardId] = frame(cardId, `Bento Card ${i + 1}`, gridId, [emojiId, ctitleId, cdescId],
      `relative flex flex-col gap-3 p-8 rounded-3xl overflow-hidden ${card.span} ${card.bg} border border-zinc-200 dark:border-zinc-700`);
    cardNodes[emojiId] = text(emojiId, `Card Emoji ${i + 1}`, cardId, card.emoji, 'text-4xl');
    cardNodes[ctitleId] = text(ctitleId, `Card Title ${i + 1}`, cardId, card.title,
      `text-xl font-bold ${card.textColor}`);
    cardNodes[cdescId] = text(cdescId, `Card Desc ${i + 1}`, cardId, card.desc,
      `text-sm ${card.textColor === 'text-white' ? 'text-white/80' : 'text-zinc-600 dark:text-zinc-400'} leading-relaxed`);
    return cardId;
  });

  const nodes = {
    [sectionId]: frame(sectionId, 'Bento Grid Section', null, [headerId, gridId],
      'relative py-24 sm:py-32 bg-zinc-50 dark:bg-zinc-950 w-full overflow-hidden'),
    [headerId]: frame(headerId, 'Bento Header', sectionId, [labelId, titleId],
      'mx-auto max-w-2xl text-center mb-16 px-4 flex flex-col items-center gap-4'),
    [labelId]: text(labelId, 'Bento Label', headerId,
      'PLATFORM', 'text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400'),
    [titleId]: text(titleId, 'Bento Title', headerId,
      'Everything you need, beautifully crafted',
      'text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl'),
    [gridId]: frame(gridId, 'Bento Grid', sectionId, cardIds,
      'mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 gap-4 lg:grid-cols-3'),
    ...cardNodes
  };
  return { rootNodeId: sectionId, name: 'Bento Grid', nodeData: nodes };
}

// ─────────────────────────────────────────────
// GENERATE OUTPUT
// ─────────────────────────────────────────────

const allTemplates = [
  // CTA
  makeCtaCentered(),
  makeCtaSplit(),
  makeCtaGlass(),
  // Hero
  makeHeroMinimalist(),
  makeHeroSplit(),
  makeHeroGlass(),
  // Content sections
  makeFaqBasic(),
  makeFeatureSection(),
  makeTestimonials(),
  makeLogoCloud(),
  makePricingSection(),
  makeFooterSimple(),
  makeBentoGrid(),
];

let tsOutput = `// AUTO GENERATED - Native Canvas Templates for ALL Hudbird Marketing Components\n`;
tsOutput += `// @ts-nocheck\n`;
tsOutput += `import { CanvasNode } from '../types/builder';\n\n`;
tsOutput += `export interface NativeTemplate {\n  rootNodeId: string;\n  name: string;\n  category: string;\n  nodeData: Record<string, any>;\n}\n\n`;
tsOutput += `export const nativeHudbirdTemplates: NativeTemplate[] = [\n`;

const categories = {
  'CTA Centered': 'CTA', 'CTA Split': 'CTA', 'CTA Glass': 'CTA',
  'Hero Minimalist': 'Hero', 'Hero Split': 'Hero', 'Hero Glass': 'Hero',
  'FAQ Basic': 'FAQ', 'Feature Section': 'Features', 'Testimonials': 'Testimonials',
  'Logo Cloud': 'Logo Cloud', 'Pricing Section': 'Pricing',
  'Footer Simple': 'Footer', 'Bento Grid': 'Bento Grid'
};

allTemplates.forEach(t => {
  tsOutput += `  {\n    name: ${JSON.stringify(t.name)},\n    category: ${JSON.stringify(categories[t.name] || 'General')},\n    rootNodeId: ${JSON.stringify(t.rootNodeId)},\n    nodeData: ${JSON.stringify(t.nodeData, null, 4)}\n  },\n`;
});

tsOutput += `];\n\n`;
tsOutput += `// Grouped by category for easy lookup\n`;
tsOutput += `export const nativeTemplatesByCategory = nativeHudbirdTemplates.reduce<Record<string, NativeTemplate[]>>(\n`;
tsOutput += `  (acc, t) => { (acc[t.category] = acc[t.category] || []).push(t); return acc; }, {}\n`;
tsOutput += `);\n`;

fs.writeFileSync(OUTPUT_FILE, tsOutput);
console.log(`Generated ${OUTPUT_FILE} with ${allTemplates.length} templates`);
