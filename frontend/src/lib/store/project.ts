import { create } from 'zustand';
import { GenerateFormData } from '../types/generate-form';

interface FormState {
  form: GenerateFormData;
  setForm: (form: GenerateFormData) => void;
}

const useFormStore = create<FormState>((set) => ({
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

export default useFormStore;
