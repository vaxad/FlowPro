'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { FLASK_API } from '@/lib/constants'

const formSchema = z.object({
    query: z.string().min(1, {
        message: "Query must be at least 1 character.",
    }),
})

export default function QueryForm() {
    const [resp, setResp] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            query: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Here you would typically send the form data to your server
        console.log(values)
        setLoading(true)
        try {
            const resp = await fetch(`${FLASK_API}/nlp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...values })
            })
            const data = await resp.json();
            setResp(data.result)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)]">
            <div className="py-2 pl-2 pr-4 bg-cyan-400/20 rounded-full mb-2 text-xs text-cyan-300">
                <span className="bg-cyan-300 text-black text-xs font-semibold px-2 py-0.5 rounded-full mr-2">QNA!</span>
                Ask your queries related to generated backend.
            </div>
            <h1 className="text-center text-4xl font-semibold mb-10 bg-clip-text bg-gradient-to-b from-white to-slate-500 text-transparent">
                Any queries about the generated backend?
            </h1>
            <div className="w-full max-w-4xl px-4 border focus-within:border-white transition-colors rounded-2xl">
                <Form {...form}>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="query"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter your query here..."
                                            className="min-h-[40px] mt-3 resize-y"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex justify-end p-4'>
                            <Button type="button" onClick={() => onSubmit(form.getValues())} className="w-fit">Submit</Button>
                        </div>
                    </div>
                </Form>
                {!!(resp || loading) && <div className='bg-background/50 my-4 p-4 rounded-2xl'>
                    {resp ? <h4><b>Response: </b>{resp}</h4> : loading ? <h4>Loading...</h4> : null}
                </div>}
            </div>
        </div>
    )
}