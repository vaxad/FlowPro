'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from 'lucide-react'
import { FLASK_API } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import { useFormContext } from '@/lib/context/form'
import { GenerateFormData } from '@/lib/types/generate-form'

const formSchema = z.object({
    query: z.string().min(1, {
        message: "Query must be at least 1 character.",
    }),
})

const fn = async () => {
    try {
        const res = await fetch("/api/frontend", {
            method: "POST",
        })
    } catch (error) {
        console.error(error)
    }
}

export default function QueryForm() {
    const [file, setFile] = useState<File | null>(null)
    const { form: formContext } = useFormContext();
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            query: "",
        },
    })

    useEffect(() => {
        fn()
    }, [])


    async function handleFile(file: File | null) {
        if (!file) return console.error('No file selected')
        try {
            setFile(file)
            const body = new FormData()
            body.append('file', file)
            const resp = await fetch(`${FLASK_API}/generate_schema`, {
                method: "POST",
                body
            })
            const data: GenerateFormData = await resp.json();
            console.log({ data })
            formContext.reset(data)
            router.push('/create')
        } catch (error) {
            console.error(error)
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Here you would typically send the form data to your server
        console.log(values, file)

        try {
            const resp = await fetch(`${FLASK_API}/query_schema`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...values })
            })
            const data = await resp.json();
            console.log({ data })
            formContext.reset(data)
            router.push('/create')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-full max-w-2xl px-4">
                <Form {...form}>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                    }} className="space-y-4">
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
                                onChange={(e) => handleFile(e.target.files?.[0] || null)}
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
                        <Button type="button" onClick={() => onSubmit(form.getValues())} className="w-full">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}