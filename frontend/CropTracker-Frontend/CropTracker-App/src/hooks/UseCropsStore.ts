import type { GetCropCategoryDTO } from "../interfaces/response/GetCropCategoryDTO";
import type { GetCropCultivarDTO } from "../interfaces/response/GetCropCultivarDTO";
import type { GetCropSpecieDTO } from "../interfaces/response/GetCropSpecieDTO";
import { create } from 'zustand';
import { getCropSpecieInCategory } from "../services/CropSpecieService";
import { getCropCultivarsInSpecie } from "../services/CropCultivarService";

interface TreeState {
  categories: GetCropCategoryDTO[]
  species: Record<string, GetCropSpecieDTO[]>;
  cultivars: Record<string, GetCropCultivarDTO[]>;
  loading: Record<string, boolean>

  setCategories: (data: GetCropCategoryDTO[]) => void;
  fetchSpecies: (categoryId: string) => Promise<void>;
  fetchCultivars: (specieId: string) => Promise<void>;
}

export const useCropsStore = create<TreeState>((set, get) => ({
  categories: [],
  species: {},
  cultivars: {},
  loading: {},

  setCategories: (data) => set({categories: data}),

  fetchSpecies: async(categoryId) => {
    if (get().species[categoryId]) return;
    set((s) => ({loading: {...s.loading, [categoryId]: true}}));

    const response = await getCropSpecieInCategory(categoryId);

    set((s) => ({
      species: {...s.species,  [categoryId]: response},
      loading: {...s.loading, [categoryId]: false}
      
    }));
  }, 

  fetchCultivars: async(specieId) => {
    if (get().cultivars[specieId]) return;
    set((s) => ({loading: {...s.loading, [specieId]: true}}));

    const response = await getCropCultivarsInSpecie(specieId);

    set((s) => ({
      cultivars: {...s.cultivars,  [specieId]: response},
      loading: {...s.loading, [specieId]: false}
      
    }));
  }, 
}));


