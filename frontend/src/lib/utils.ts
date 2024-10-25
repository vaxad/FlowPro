import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { GenerateFormData } from "./types/generate-form";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const checkData = (data:GenerateFormData) => {
  if(data.entities.length === 0 ) {
      toast.error("Please add at least one entity");
      return false;
  }

  if(data.entities.find(entity => entity.name.trim().length === 0)) {
      toast.error("Please add a name to each entity");
      return false;
  }

  if(data.entities.find(entity => entity.attributes.length === 0)) {
      toast.error("Please add at least one attribute to each entity");
      return false;
  }

  if(data.entities.find(entity => entity.attributes.find(attr => attr.name === ""))) {
      toast.error("Please add a name to each attribute");
      return false;
  }

  return true;
}

export async function generateProjectFolder(data: GenerateFormData) {
  if (!checkData(data)) return;
    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok || !response.body) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const chunks = [];
    let done = false;

    while (!done) {
        const { value, done: readerDone } = await reader.read();
        if (value) {
            chunks.push(value); // Add each chunk to the array
        }
        done = readerDone;
    }
    const blob = new Blob(chunks, { type: 'application/zip' });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.name.trim()}.zip`;
    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(a);
}