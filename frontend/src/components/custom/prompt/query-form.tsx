'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from 'lucide-react'

const formSchema = z.object({
    query: z.string().min(1, {
        message: "Query must be at least 1 character.",
    }),
})

export default function QueryForm() {
    const [file, setFile] = useState<File | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            query: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Here you would typically send the form data to your server
        console.log(values, file)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-full max-w-2xl px-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="query"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter your query here..."
                                            className="min-h-[100px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center space-x-2">
                            <Input
                                type="file"
                                accept=".pdf"
                                id="pdf-upload"
                                className="hidden"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => document.getElementById('pdf-upload')?.click()}
                            >
                                <Upload className="h-4 w-4" />
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                {file ? file.name : 'Upload PDF (optional)'}
                            </span>
                        </div>
                        <Button type="submit" className="w-full">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}