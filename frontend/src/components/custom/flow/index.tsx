"use client"
import { addEdge, Background, BackgroundVariant, MiniMap, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { useCallback, useEffect } from 'react';
import EntityNode, { EntityNodeProps } from './entity-node';
import RelationEdge, { RelationEdgeProps } from './relation-edge';
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { GenerateFormData } from '@/lib/types/generate-form';
import { generateProjectFolder } from '@/lib/utils';
import DownloadButton from './download-button';
import Toolbar from './toolbar';
import { UseFormReturn } from 'react-hook-form';

const initialNodes: EntityNodeProps[] = [
    { id: '1', position: { x: 10, y: 10 }, data: { name: '', attributes: [{ name: "", type: "string" }], open: true }, type: 'entity' },
    { id: '2', position: { x: 400, y: 400 }, data: { name: '', attributes: [{ name: "", type: "string" }], open: true }, type: 'entity' },
];
const initialEdges: RelationEdgeProps[] = [{ id: 'e1-2', source: '1', target: '2', type: "relation", data: { type: "1-m" } }];

const edgeTypes = {
    'relation': RelationEdge
};

const nodeTypes = {
    'entity': EntityNode,
};

interface FlowProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form?: UseFormReturn<GenerateFormData, any, undefined>
}

export default function Flow({ form }: FlowProps) {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const [auth, setAuth] = React.useState(true);

    const onConnect = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (params: any) => setEdges((eds) => addEdge({ ...params, type: "relation", data: { type: "1-m" } }, eds)),
        [setEdges],
    )

    useEffect(() => {
        if (!form) return;
        form.setValue("entities", nodes.map((node) => ({
            name: node.data.name,
            attributes: node.data.attributes,
        })))
    }, [nodes])

    useEffect(() => {
        if (!form) return;
        form.setValue("relations", edges.map((edge) => {
            const from = nodes.find((node) => node.id === edge.source)?.data.name;
            const to = nodes.find((node) => node.id === edge.target)?.data.name;
            const type = edge?.data?.type;
            if (!from || !to || !type) return false;
            return {
                from,
                to,
                type,
                name: `${from}To${to}`
            }
        }).filter((edge) => !!edge))
    }, [edges])


    async function generateProject() {
        try {
            const data: GenerateFormData = {
                name: "flow-generated-backend",
                description: "This project was generated using FlowPI",
                auth: auth,
                entities: nodes.map((node) => {
                    const { data } = node as EntityNodeProps;
                    return {
                        name: data.name,
                        attributes: data.attributes.map((attr) => {
                            return {
                                name: attr.name,
                                type: attr.type,
                            }
                        })
                    }
                }),
                relations: edges.map((edge) => {
                    const { data } = edge as RelationEdgeProps;
                    const from = nodes.find((node) => node.id === edge.source)?.data.name;
                    const to = nodes.find((node) => node.id === edge.target)?.data.name;
                    if (!from || !to) return false;
                    return {
                        from,
                        to,
                        type: data?.type || "1-m",
                        name: `${from}To${to}`
                    }
                }).filter((edge) => edge !== false)
            }

            await generateProjectFolder(data)
        } catch (error) {
            console.error(error);
            alert("Something went wrong!");
        }
    }

    return (
        <>
            <div className='w-full relative flex-grow bg-purple-400/20 h-[80vh] rounded mt-4'>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                >
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                    <MiniMap />
                    <Toolbar />
                    <DownloadButton />
                </ReactFlow>
            </div>
            <div className="flex justify-between items-center mt-4">
                <div className='flex gap-2 items-center'>
                    <Label className="text-xl font-semibold">Authentication:</Label>
                    <Switch checked={auth} onCheckedChange={() => { setAuth((prev) => !prev) }} />
                </div>
                <Button onClick={generateProject} type="button">Generate Project</Button>
            </div>
        </>
    )
}
