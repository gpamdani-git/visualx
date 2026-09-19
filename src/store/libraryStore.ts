import { create } from 'zustand';
import { Library, getPrebuiltHudbirdLibrary, Template } from '../registry/UILibraryRegistry';
import { getMarketingBlocksLibrary } from '../registry/MarketingBlocksLibrary';
import { db } from './dbClient';

interface LibraryStore {
  libraries: Library[];
  activeLibraryId: string;
  dbLoaded: boolean;
  loadFromDb: () => Promise<void>;
  setActiveLibraryId: (id: string) => void;
  addCustomLibrary: (lib: Library) => void;
  deleteCustomLibrary: (id: string) => void;
  addTemplateToLibrary: (template: Template) => void;
}

const saveCustomLibraries = async (libs: Library[]) => {
  try {
    const custom = libs.filter(l => !l.isPrebuilt);
    await db.libraries.saveAll(custom);
  } catch (e) {
    console.error('Failed to save UI libraries', e);
  }
};

export const useLibraryStore = create<LibraryStore>((set, get) => ({
  libraries: [getPrebuiltHudbirdLibrary(), getMarketingBlocksLibrary()],
  activeLibraryId: 'marketing-blocks-prebuilt',
  dbLoaded: false,
  
  loadFromDb: async () => {
    try {
      const customLibs = await db.libraries.getAll();
      set((state) => ({
        libraries: [getPrebuiltHudbirdLibrary(), getMarketingBlocksLibrary(), ...customLibs],
        dbLoaded: true
      }));
    } catch (err) {
      console.error('Failed to load UI libraries from DB', err);
      set({ dbLoaded: true });
    }
  },

  setActiveLibraryId: (id) => set({ activeLibraryId: id }),
  
  addCustomLibrary: (lib) => set((state) => {
    const next = [...state.libraries, lib];
    saveCustomLibraries(next);
    return { libraries: next };
  }),
  
  deleteCustomLibrary: (id) => set((state) => {
    const next = state.libraries.filter(l => l.id !== id);
    saveCustomLibraries(next);
    return { 
      libraries: next, 
      activeLibraryId: state.activeLibraryId === id ? 'hudbird-ui-prebuilt' : state.activeLibraryId 
    };
  }),

  addTemplateToLibrary: (template) => set((state) => {
    const MY_CUSTOM_LIB_ID = 'my-custom-templates';
    
    let libIndex = state.libraries.findIndex(l => l.id === MY_CUSTOM_LIB_ID);
    let libraries = [...state.libraries];

    if (libIndex === -1) {
      const newLib: Library = {
        id: MY_CUSTOM_LIB_ID,
        name: 'My Custom Templates',
        description: 'Your saved custom blocks and templates',
        isPrebuilt: false,
        version: '1.0',
        author: 'User',
        blockSections: [
          {
            id: 'sec-custom-blocks',
            name: 'My Blocks',
            categories: [
              {
                id: 'cat-saved',
                name: 'Saved Templates',
                templates: [template]
              }
            ]
          }
        ]
      };
      libraries.push(newLib);
    } else {
      const lib = { ...libraries[libIndex] };
      if (!lib.blockSections || lib.blockSections.length === 0) {
        lib.blockSections = [{ id: 'sec-custom-blocks', name: 'My Blocks', categories: [] }];
      }
      const section = lib.blockSections[0];
      if (section.categories.length === 0) {
        section.categories.push({ id: 'cat-saved', name: 'Saved Templates', templates: [] });
      }
      section.categories[0].templates.push(template);
      libraries[libIndex] = lib;
    }

    saveCustomLibraries(libraries);
    return { libraries };
  })
}));
