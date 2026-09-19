import { twMerge } from 'tailwind-merge';

// Helper to extract a value from a class string based on a regex pattern
function extractByPattern(className: string | undefined, pattern: RegExp): string | null {
  if (!className) return null;
  const classes = className.split(/\s+/);
  for (const cls of classes) {
    const match = cls.match(pattern);
    if (match) {
      return match[1] || cls; 
    }
  }
  return null;
}

// 1. TYPOGRAPHY
export function getFontSize(className: string | undefined): string | null {
  return extractByPattern(className, /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/);
}
export function getFontWeight(className: string | undefined): string | null {
  return extractByPattern(className, /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/);
}
export function getTextAlign(className: string | undefined): string | null {
  return extractByPattern(className, /^text-(left|center|right|justify|start|end)$/);
}

// 2. LAYOUT
export function getFlexDirection(className: string | undefined): string | null {
  return extractByPattern(className, /^flex-(row|col|row-reverse|col-reverse)$/);
}
export function getAlignItems(className: string | undefined): string | null {
  return extractByPattern(className, /^items-(start|end|center|baseline|stretch)$/);
}
export function getJustifyContent(className: string | undefined): string | null {
  return extractByPattern(className, /^justify-(normal|start|end|center|between|around|evenly|stretch)$/);
}

// 3. UNIVERSAL GET/SET
export function hasExactClass(className: string | undefined, exactClass: string): boolean {
  if (!className) return false;
  return className.split(/\s+/).includes(exactClass);
}

/**
 * Safely adds, replaces, or removes a Tailwind class using tailwind-merge to resolve conflicts.
 * e.g. setTailwindClass("text-sm text-red-500", "text-lg") -> "text-red-500 text-lg"
 */
export function setTailwindClass(className: string | undefined, newClass: string | null): string {
  if (!newClass) return className || '';
  return twMerge(className || '', newClass);
}

/**
 * Removes a specific exact class.
 */
export function removeExactClass(className: string | undefined, classToRemove: string): string {
  if (!className) return '';
  return className.split(/\s+/).filter(c => c !== classToRemove).join(' ');
}

export function toggleExactClass(className: string | undefined, exactClass: string, force?: boolean): string {
  const currentClasses = (className || '').trim().split(/\s+/).filter(Boolean);
  const hasClass = currentClasses.includes(exactClass);
  
  const shouldAdd = force !== undefined ? force : !hasClass;
  
  if (shouldAdd && !hasClass) {
    currentClasses.push(exactClass);
  } else if (!shouldAdd && hasClass) {
    const idx = currentClasses.indexOf(exactClass);
    currentClasses.splice(idx, 1);
  }
  
  return currentClasses.join(' ');
}

// Legacy helpers that might be used by other parts of the app
export function extractTailwindValue(className: string | undefined, prefix: string): string | null {
  const regex = new RegExp(`^${prefix}(.+)$`);
  return extractByPattern(className, regex);
}
export function updateTailwindClass(className: string | undefined, prefix: string, newValue: string | null): string {
  if (newValue === null || newValue === '') {
    // If clearing, we must remove all classes starting with prefix. (twMerge can't do this easily without knowing the full class)
    const regex = new RegExp(`^${prefix}.*$`);
    return (className || '').split(/\s+/).filter(c => !regex.test(c)).join(' ');
  }
  return twMerge(className || '', `${prefix}${newValue}`);
}

