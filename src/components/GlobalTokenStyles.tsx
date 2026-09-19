import React from 'react';
import { useProjectStore } from '../store/projectStore';
import { useBuilderStore } from '../store/builderStore';

export default function GlobalTokenStyles() {
  const activeProjectId = useProjectStore(state => state.activeProjectId);
  const projects = useProjectStore(state => state.projects);
  const activeProject = projects.find(p => p.id === activeProjectId);
  
  const canvasTheme = useBuilderStore(state => state.canvasTheme ?? 'dark');

  if (!activeProject) return null;

  const { colorTokens, textTokens } = activeProject;

  let cssStr = ':root {\n';
  
  // Inject colors
  colorTokens?.forEach(token => {
    // Generate both light and dark, but map the main variable based on theme,
    // OR we can just use CSS variables that automatically switch.
    // Actually, framer creates specific variables. Let's make `--color-TOKENNAME`
    // respond to the canvasTheme, or we just emit the right value.
    const val = canvasTheme === 'light' ? (token.lightValue || token.darkValue) : (token.darkValue || token.lightValue);
    
    // Create a safe project token variable
    cssStr += `  --project-color-${token.id}: ${val};\n`;
    
    // Legacy support: map the name-based token to the new project token,
    // EXCEPT for reserved Tailwind color names that would break the UI
    let safeName = token.name.replace(/\s+/g, '-').toLowerCase();
    
    // Map Hudbird semantic names specifically for Tailwind v4 @theme compatibility
    if (safeName.startsWith('hudbird/')) {
      safeName = safeName.replace('hudbird/', 'hudbird-');
    }

    const reservedNames = ['white', 'black', 'transparent', 'current', 'inherit', 'blue-500', 'blue-400', 'blue-600', 'emerald-500', 'emerald-400', 'amber-500', 'amber-400'];
    if (!reservedNames.includes(safeName)) {
      cssStr += `  --color-${safeName}: var(--project-color-${token.id});\n`;
    }
  });

  // Inject text styles if needed
  cssStr += '}\n';

  return <style dangerouslySetInnerHTML={{ __html: cssStr }} />;
}
