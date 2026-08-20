import type { GetCropCategoryDTO } from "../../interfaces/response/GetCropCategoryDTO";
import type { GetCropCultivarDTO } from "../../interfaces/response/GetCropCultivarDTO";
import type { GetCropSpecieDTO } from "../../interfaces/response/GetCropSpecieDTO";
import { create } from 'zustand';
import { getCropSpecieInCategory } from "../../services/CropSpecieService";
import { getCropCultivarsInSpecie } from "../../services/CropCultivarService";

interface TreeState {
  categories: GetCropCategoryDTO[]
  species: Record<string, GetCropSpecieDTO[]>;
  cultivars: Record<string, GetCropCultivarDTO[]>;
  loading: Record<string, boolean>

  setCategories: (data: GetCropCategoryDTO[]) => void;
  fetchSpecies: (categoryId: string) => Promise<void>;
  addSpecies: (data: GetCropSpecieDTO) => void;
  updateSpecies: (data: GetCropSpecieDTO) => void;
  deleteSpecies: (specie: GetCropSpecieDTO) => void;
  addCultivars: (data: GetCropCultivarDTO) => void;
  updateCultivars: (data: GetCropCultivarDTO) => void;
  deleteCultivars: (cultivar: GetCropCultivarDTO) => void;
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

  addSpecies: async (createdSpecie: GetCropSpecieDTO) => {
    await get().fetchSpecies(createdSpecie.categoryId);

    set((s) => {
      const currentList = s.species[createdSpecie.categoryId] || [];

      const exists = currentList.some(item => item.uid === createdSpecie.uid);
      if (exists) return s;

      return {species: {
        ...s.species,
        [createdSpecie.categoryId]: [
          ...(s.species[createdSpecie.categoryId] || []),
          createdSpecie
        ]
      }}
    });

  },

  updateSpecies: async (updatedSpecie: GetCropSpecieDTO) => {
    await get().fetchCultivars(updatedSpecie.categoryId);
    const {categoryId, uid} = updatedSpecie;

    set((s) => {
      const currentList = s.species[updatedSpecie.categoryId] || [];
      
      const exists = currentList.some(item => item.uid === updatedSpecie.uid);
      if (exists) return s;

      return {species: {
        ...s.species,
        [categoryId]: (s.species[categoryId]).map(specie => specie.uid === uid ? updatedSpecie : specie)
      }
    }});
  },

  deleteSpecies: async(specieToDelete: GetCropSpecieDTO) => {
    await get().fetchSpecies(specieToDelete.categoryId);
    const specieId = specieToDelete.uid;
    const categoryId = specieToDelete.categoryId;

    set((s) => ({
      species: {
        ...s.species,
        [specieToDelete.categoryId]: (s.species[categoryId]).filter(spec => spec.uid !== specieId)
      }
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

  addCultivars: async (createdCultivar: GetCropCultivarDTO) => {
    await get().fetchCultivars(createdCultivar.specieId);

    set((s) => {
      const currentList = s.cultivars[createdCultivar.specieId] || [];
      
      const exists = currentList.some(item => item.uid === createdCultivar.uid);
      if (exists) return s;

      return {cultivars: {
        ...s.cultivars,
        [createdCultivar.specieId]: [
          ...(s.cultivars[createdCultivar.specieId] || []),
          createdCultivar
        ]
      }};
    });
    },

    updateCultivars: async (updatedCultivar: GetCropCultivarDTO) => {
      await get().fetchCultivars(updatedCultivar.specieId);

      const {specieId, uid} = updatedCultivar;

      set((s) => {
        const currentList = s.cultivars[updatedCultivar.specieId] || [];
      
        const exists = currentList.some(item => item.uid === updatedCultivar.uid);
        if (exists) return s;

        return {cultivars: {
          ...s.cultivars,
          [specieId]: (s.cultivars[specieId]).map(cultivar => cultivar.uid === uid ? updatedCultivar : cultivar)
        }
      }});
    },

    deleteCultivars: async(cultivarToDelete: GetCropCultivarDTO) => {
      await get().fetchCultivars(cultivarToDelete.specieId);

      const cultivarId = cultivarToDelete.uid;
      const specieId = cultivarToDelete.specieId;

      set((s) => ({
        cultivars: {
          ...s.cultivars,
          [specieId]: (s.cultivars[specieId]).filter(cultivar => cultivar.uid !== cultivarId)
        }
      }));
    },
}));
