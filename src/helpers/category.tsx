import { create } from 'zustand';

interface CategoryType {
  file: string;
  name: string;
  setFile: (file: string) => void;
  setName: (name: string) => void;
}

export const useCategory = create<CategoryType>((set) => ({
  file: '',
  name: '',
  setFile: (file: string) => set({ file }),
  setName: (name: string) => set({ name }),
}));
