import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { placeholderData } from '@/lib/constants'
import { GenerateFormData } from '@/lib/types/generate-form'
import { generateProjectFolder } from '@/lib/utils'
import { Copy } from 'lucide-react'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

interface JSONProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<GenerateFormData, any, undefined>
}
const placeholder = JSON.stringify(placeholderData, null, 2)

export default function Json({ form }: JSONProps) {
    const [json, setJson] = React.useState(JSON.stringify(form.getValues(), null, 2))
    const [error, setError] = React.useState(false)
    function onUseExample() {
        setJson(placeholder)
        form.setValue("name", placeholderData.name)
        form.setValue("description", placeholderData.description)
        form.setValue("entities", placeholderData.entities)
        form.setValue("relations", placeholderData.relations)
    }
    React.useEffect(() => {
        try {
            const data = JSON.parse(json)
            form.setValue("name", data.name)
            form.setValue("description", data.description)
            form.setValue("entities", data.entities)
            form.setValue("relations", data.relations)
            setError(false)
        } catch (e) {
            console.error(e)
            setError(true)
        }
    }, [json])

    async function generateProject() {
        try {
            const data: GenerateFormData = JSON.parse(json)
            await generateProjectFolder(data)
        } catch (error) {
            toast.error('Invalid JSON')
            console.error(error)
        }
    }
    function onCopy() {
        navigator.clipboard.writeText(json)
        toast.success('Copied to clipboard')
    }
    return (
        <>
            <div className='relative'>
                <Textarea placeholder={placeholder} rows={35} value={json} onChange={(e) => setJson(e.target.value)} />
                <div className='absolute top-4 right-4 flex gap-2'>
                    <Button onClick={onUseExample}>
                        Use Example
                    </Button>
                    <Button onClick={onCopy}>
                        <Copy size={20} />
                    </Button>
                </div>

                {error && <div className='bg-red-500 absolute bottom-4 right-4 py-2 px-4 rounded '>Invalid JSON</div>}
            </div>
            <Button onClick={generateProject} type="button" className='mt-4 w-full'>Generate Project</Button>
        </>
    )
}
