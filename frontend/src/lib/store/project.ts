import { create } from 'zustand';
import { GenerateFormData } from '../types/generate-form';

interface CounterState {
  form: GenerateFormData;
  setForm: (form: GenerateFormData) => void;
}

const useCounterStore = create<CounterState>((set) => ({
  form: {
    name: "",
    description: "",
    entities: [{ name: '', attributes: [] }],
    relations: [],
    auth: true,
},
  setForm: (form: GenerateFormData) => {
    set({ form });
  }
}));

export default useCounterStore;
