import { create } from 'zustand';

export interface Brand {
  id: string;
  name: string;
  color: string;
  fonts: string[];
  logo?: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  model: string;
  ratio: string;
  style: string;
  timestamp: Date;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  category: string;
  width: number;
  height: number;
  color: string;
}

export interface DesignProject {
  id: string;
  name: string;
  width: number;
  height: number;
  thumbnail?: string;
  lastModified: Date;
}

interface StudioState {
  activeBrandId: string | null;
  brands: Brand[];
  generatedImages: GeneratedImage[];
  selectedImageId: string | null;
  currentProject: DesignProject | null;
  recentProjects: DesignProject[];
  apiKey: string;
  useIdeogram: boolean;
  chatterboxUrl: string;

  setActiveBrand: (id: string | null) => void;
  addBrand: (brand: Brand) => void;
  updateBrand: (id: string, updates: Partial<Brand>) => void;
  addGeneratedImage: (image: GeneratedImage) => void;
  selectImage: (id: string | null) => void;
  setCurrentProject: (project: DesignProject | null) => void;
  addRecentProject: (project: DesignProject) => void;
  setApiKey: (key: string) => void;
  setUseIdeogram: (value: boolean) => void;
  setChatterboxUrl: (url: string) => void;
  getActiveBrand: () => Brand | null;
  getSelectedImage: () => GeneratedImage | null;
}

export const useStudioStore = create<StudioState>((set, get) => ({
  activeBrandId: null,
  brands: [
    {
      id: 'default',
      name: 'My Brand',
      color: '#d4884f',
      fonts: ['Inter', 'Playfair Display'],
    },
  ],
  generatedImages: [],
  selectedImageId: null,
  currentProject: null,
  recentProjects: [],
  apiKey: '',
  useIdeogram: true,
  chatterboxUrl: 'https://techengineerworkstation--chatterbox-tts-chatterbox-serve.modal.run',

  setActiveBrand: (id) => set({ activeBrandId: id }),
  addBrand: (brand) => set((state) => ({ brands: [...state.brands, brand] })),
  updateBrand: (id, updates) =>
    set((state) => ({
      brands: state.brands.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    })),
  addGeneratedImage: (image) =>
    set((state) => ({
      generatedImages: [image, ...state.generatedImages],
      selectedImageId: image.id,
    })),
  selectImage: (id) => set({ selectedImageId: id }),
  setCurrentProject: (project) => set({ currentProject: project }),
  addRecentProject: (project) =>
    set((state) => ({
      recentProjects: [project, ...state.recentProjects.filter((p) => p.id !== project.id)].slice(0, 10),
    })),
  setApiKey: (key) => set({ apiKey: key }),
  setUseIdeogram: (value) => set({ useIdeogram: value }),
  setChatterboxUrl: (url) => set({ chatterboxUrl: url }),
  getActiveBrand: () => {
    const state = get();
    return state.brands.find((b) => b.id === state.activeBrandId) || state.brands[0] || null;
  },
  getSelectedImage: () => {
    const state = get();
    return state.generatedImages.find((img) => img.id === state.selectedImageId) || null;
  },
}));
