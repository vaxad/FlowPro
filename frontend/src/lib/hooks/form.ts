import { zodResolver } from "@hookform/resolvers/zod";
import { GenerateFormData, GenerateFormDataSchema } from "../types/generate-form";
import { useForm } from "react-hook-form";

export function useGenerateForm() {
    const form = useForm<GenerateFormData>({
        resolver: zodResolver(GenerateFormDataSchema),
        defaultValues: {
            name: "",
            description: "",
            entities: [{ name: '', attributes: [] }],
            relations: [],
            auth: true,
        },
    });

    return form;
}