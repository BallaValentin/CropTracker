import type { GetCropCategoryDTO } from "../interfaces/response/GetCropCategoryDTO";
import type { GetCropCultivarDTO } from "../interfaces/response/GetCropCultivarDTO";
import type { GetCropSpecieDTO } from "../interfaces/response/GetCropSpecieDTO";
import { create } from 'zustand';
import { createCropSpecie, deleteCropSpecie, getCropSpecieInCategory, updateCropSpecie } from "../services/CropSpecieService";
import { createCropCultivar, deleteCropCultivar, getCropCultivarsInSpecie, updateCropCultivar } from "../services/CropCultivarService";
import type { CreateCropSpecieDTO } from "../interfaces/request/CreateCropSpecieDTO";
import type { CreateCropCultivarDTO } from "../interfaces/request/CreateCropCultivarDTO";
import type { UpdateCropSpecieDTO } from "../interfaces/request/UpdateCropSpecieDTO";
import type { UpdateCropCultivarDTO } from "../interfaces/request/UpdateCropCultivarDTO";

interface TreeState {
  categories: GetCropCategoryDTO[]
  species: Record<string, GetCropSpecieDTO[]>;
  cultivars: Record<string, GetCropCultivarDTO[]>;
  loading: Record<string, boolean>

  setCategories: (data: GetCropCategoryDTO[]) => void;
  fetchSpecies: (categoryId: string) => Promise<void>;
  addSpecies: (data: CreateCropSpecieDTO) => void;
  updateSpecies: (data: UpdateCropSpecieDTO, specieId: string) => void;
  deleteSpecies: (specie: GetCropSpecieDTO) => void;
  addCultivars: (data: CreateCropCultivarDTO) => void;
  updateCultivars: (data: UpdateCropCultivarDTO, cultivarId: string) => void;
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

  addSpecies: async(newCropSpecie: CreateCropSpecieDTO) => {
    const createdSpecie = await  createCropSpecie(newCropSpecie);

    set((s) => ({
      species: {
        ...s.species,
        [createdSpecie.categoryId]: [
          ...(s.species[createdSpecie.categoryId] || []),
          createdSpecie
        ]
      }
    }));

  },

  updateSpecies: async (specieUpdates: UpdateCropSpecieDTO, specieId: string) => {
    const updatedSpecie = await updateCropSpecie(specieUpdates, specieId);
    const categoryId = updatedSpecie.categoryId;

    set((s) => ({
      species: {
        ...s.species,
        [categoryId]: (s.species[categoryId]).map(specie => specie.uid === updatedSpecie.uid ? updatedSpecie : specie)
      }
    }));
  },

  deleteSpecies: async(specie: GetCropSpecieDTO) => {
    const specieId = specie.uid;
    const categoryId = specie.categoryId;
    await deleteCropSpecie(specieId);

    set((s) => ({
      species: {
        ...s.species,
        [specie.categoryId]: (s.species[categoryId]).filter(spec => spec.uid !== specieId)
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

  addCultivars: async(newCropCultivar: CreateCropCultivarDTO) => {
    const createdCultivar = await  createCropCultivar(newCropCultivar);

    set((s) => ({
      cultivars: {
        ...s.cultivars,
        [createdCultivar.specieId]: [
          ...(s.cultivars[createdCultivar.specieId] || []),
          createdCultivar
        ]
      }
    }));
    },

    updateCultivars: async (cultivarUpdates: UpdateCropCultivarDTO, cultivarId: string) => {
      const updatedCultivar = await updateCropCultivar(cultivarUpdates, cultivarId);
      const specieId = updatedCultivar.specieId;

      set((s) => ({
        cultivars: {
          ...s.cultivars,
          [specieId]: (s.cultivars[specieId]).map(cultivar => cultivar.uid === updatedCultivar.uid ? updatedCultivar : cultivar)
        }
      }));
    },

    deleteCultivars: async(cultivarToDelete: GetCropCultivarDTO) => {
      const cultivarId = cultivarToDelete.uid;
      const specieId = cultivarToDelete.specieId;
      await deleteCropCultivar(cultivarId);

      set((s) => ({
        cultivars: {
          ...s.cultivars,
          [specieId]: (s.cultivars[specieId]).filter(cultivar => cultivar.uid !== cultivarId)
        }
      }));
    },
}));
