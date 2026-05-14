import type { GetCropCategoryDTO } from "../interfaces/response/GetCropCategoryDTO";
import type { GetCropCultivarDTO } from "../interfaces/response/GetCropCultivarDTO";
import type { GetCropSpecieDTO } from "../interfaces/response/GetCropSpecieDTO";
import { create } from 'zustand';
import { createCropSpecie, getCropSpecieInCategory } from "../services/CropSpecieService";
import { createCropCultivar, getCropCultivarsInSpecie } from "../services/CropCultivarService";
import type { CreateCropSpecieDTO } from "../interfaces/request/CreateCropSpecieDTO";
import type { CreateCropCultivarDTO } from "../interfaces/request/CreateCropCultivarDTO";

interface TreeState {
  categories: GetCropCategoryDTO[]
  species: Record<string, GetCropSpecieDTO[]>;
  cultivars: Record<string, GetCropCultivarDTO[]>;
  loading: Record<string, boolean>

  setCategories: (data: GetCropCategoryDTO[]) => void;
  fetchSpecies: (categoryId: string) => Promise<void>;
  addSpecies: (data: CreateCropSpecieDTO) => void;
  addCultivars: (data: CreateCropCultivarDTO) => void;
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

  addSpecies: async(newCropSpecie: CreateCropSpecieDTO) => {
    await  createCropSpecie(newCropSpecie);

    set((s) => {
      const newSpecies = {...s.species};
      delete newSpecies[newCropSpecie.categoryId];
      return {species: newSpecies}
    });

    await get().fetchSpecies;
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

  addCultivars: async(newCropCultivar: CreateCropCultivarDTO) => {
      await  createCropCultivar(newCropCultivar);

    set((s) => {
      const newCultivars = {...s.cultivars};
      delete newCultivars[newCropCultivar.specieId];
      return {cultivars: newCultivars};
    });

    await get().fetchCultivars;
    },
}));


