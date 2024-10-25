"use client"
import React, { createContext, useContext, ReactNode } from 'react';
import { GenerateFormData } from '../types/generate-form';
import { useGenerateForm } from '../hooks/form';
import { UseFormReturn } from 'react-hook-form';

interface FormState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<GenerateFormData, any, undefined>;
}

const FormContext = createContext<FormState | undefined>(undefined);

interface FormProviderProps {
  children: ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const form = useGenerateForm()

  return (
    <FormContext.Provider value={{ form }}>
      {children}
    </FormContext.Provider>
  );
};


export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}