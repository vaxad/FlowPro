'use client';
import { Button } from '@/components/ui/button';
import { CopyIcon } from 'lucide-react';
import { CodeBlock } from 'react-code-block';
import { toast } from 'sonner';

export default function Code({ code, language = "js" }: { code: string, language?: string }) {
    function onClipboardCopy() {
        navigator.clipboard.writeText(code);
        toast.success('Copied to clipboard');
    }
    return (
        <CodeBlock code={code} language={language}>
            <CodeBlock.Code className="bg-gray-900 p-2 min-h-14 rounded shadow-lg relative mt-4">
                <div className="table-row">
                    <CodeBlock.LineNumber className="table-cell pr-4 text-sm text-gray-500 text-right select-none" />
                    <CodeBlock.LineContent className="table-cell text-wrap">
                        <CodeBlock.Token />
                    </CodeBlock.LineContent>
                </div>
                <Button onClick={onClipboardCopy} className='absolute top-2 right-2 p-2' variant="outline"><CopyIcon size={20} /></Button>
            </CodeBlock.Code>
        </CodeBlock>
    );
}
