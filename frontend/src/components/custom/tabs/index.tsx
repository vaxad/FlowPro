"use client";

import Image from "next/image";
import { Tabs } from "./ui"


export function TabsDemo() {
    const tabs = [
        {
            title: "Flow",
            value: "flow",
            content: (
                <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
                    <p>Make your API using ER-diagram</p>
                    <DummyContent src="/flow.png" />
                </div>
            ),
        },
        {
            title: "Form",
            value: "form",
            content: (
                <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
                    <p>Make your API using a form-based UI</p>
                    <DummyContent src="/form.png" />
                </div>
            ),
        },
        {
            title: "JSON",
            value: "json",
            content: (
                <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
                    <p>Make your API using a JSON</p>
                    <DummyContent src="/json.png" />
                </div>
            ),
        },
        {
            title: "Docs",
            value: "docs",
            content: (
                <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
                    <p>Get help using our docs</p>
                    <DummyContent src="/docs.png" />
                </div>
            ),
        }
    ];

    return (
        <div id="tabs-demo" className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start my-12">
            <Tabs tabs={tabs} />
        </div>
    );
}

const DummyContent = ({ src }: { src: string }) => {
    return (
        <Image
            src={src}
            alt={src}
            width="1000"
            height="1000"
            className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
        />
    );
};
