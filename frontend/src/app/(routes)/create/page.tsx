"use client"
import Flow from "@/components/custom/flow"
import GenerateForm from "@/components/custom/generate-form"
import Json from "@/components/custom/json";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFormContext } from "@/lib/context/form";

export default function Page() {
    const { form } = useFormContext();
    return (
        <Tabs defaultValue="flow" className="mt-4 mx-4 md:mx-20">
            <TabsList>
                <TabsTrigger value="flow">Flow</TabsTrigger>
                <TabsTrigger value="form">Form</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>
            <TabsContent value="flow"><Flow form={form} /></TabsContent>
            <TabsContent value="form"><GenerateForm form={form} /></TabsContent>
            <TabsContent value="json"><Json form={form} /></TabsContent>
        </Tabs>
    )
}
