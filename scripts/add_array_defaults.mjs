import fs from 'fs';
import path from 'path';

const files = [
  'src/components/hudbird-ui/Footer/FooterMega.tsx',
  'src/components/hudbird-ui/Footer/FooterGlass.tsx',
  'src/components/hudbird-ui/Footer/FooterSimple.tsx',
  'src/components/hudbird-ui/Testimonials/TestimonialGlass.tsx',
  'src/components/hudbird-ui/Testimonials/TestimonialsSideBySide.tsx',
  'src/components/hudbird-ui/Testimonials/Testimonials.tsx',
  'src/components/hudbird-ui/Testimonials/TestimonialsMarquee.tsx',
  'src/components/hudbird-ui/Testimonials/TestimonialsFlat.tsx',
  'src/components/hudbird-ui/Faq/FaqGlass.tsx',
  'src/components/hudbird-ui/Faq/FaqCategorized.tsx',
  'src/components/hudbird-ui/Faq/FaqWithIllustration.tsx',
  'src/components/hudbird-ui/Faq/Faq.tsx',
  'src/components/hudbird-ui/Hero/Hero.tsx',
  'src/components/hudbird-ui/LogoCloud/LogoCloudGlass.tsx',
  'src/components/hudbird-ui/Pricing/PricingGlass.tsx'
];

const arrayProps = ['testimonials', 'faqs', 'categories', 'linkGroups', 'links', 'socials', 'logos', 'tiers', 'stats', 'row1', 'row2'];

for (const file of files) {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;
  
  // Find destructured props like: { items, features, ... }
  // We can do a simple regex replace for the arrayProps
  for (const prop of arrayProps) {
    // Regex matches: `{ ..., prop, ... }` or `{ prop, ... }` or `{ ..., prop }`
    // We want to replace `prop` with `prop = []` if it doesn't already have a default
    // We only want to do this inside the component signature
    const regex = new RegExp(`\\b${prop}\\b(?!\\s*=)(?=\\s*[,}])`, 'g');
    
    // We only want to apply this to the first occurrence (which is usually the component signature)
    // Actually, it's safer to just replace it if it's inside a destructured object
    const match = content.match(regex);
    if (match) {
       // Only replace the first match which is usually the props definition
       content = content.replace(regex, (match, offset) => {
          // If we're early in the file (e.g. first 2000 chars), it's the props definition
          if (offset < 2000) {
             changed = true;
             return `${prop} = []`;
          }
          return match;
       });
    }
  }
  
  if (changed) {
     fs.writeFileSync(filePath, content, 'utf-8');
     console.log(`Updated ${file}`);
  }
}
