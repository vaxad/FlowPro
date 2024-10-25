export const files: {path:string, content:string}[] = [{
    path: 'frontend/src/app/error.tsx',
    content: `"use client"

import { useRouter } from "next/navigation";
import React from "react";
import { useEffect } from "react";

export default function Error() {
    const router = useRouter();
    useEffect(() => {
        router.replace("/");
    }, [router])

    return (<></>)
}
`
}
,{
    path: 'frontend/src/app/not-found.tsx',
    content: `import { redirect } from "next/navigation";

export default function NotFound() {
    redirect("/");
}
`
}
]