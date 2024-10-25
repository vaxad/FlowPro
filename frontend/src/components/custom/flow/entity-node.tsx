import React, { ChangeEvent } from 'react';
import { Handle, Node, NodeProps, Position, useReactFlow } from '@xyflow/react';
import { Attribute, ConstraintType } from '@/lib/types/project';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ExpandIcon, PlusIcon, ShrinkIcon, Trash2Icon, Scaling } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { attributeTypes } from '@/lib/maps/project';
import { Grip } from 'lucide-react';

export type EntityNodeProps = Node<{
    name: string;
    attributes: Array<{ name: string; type: Attribute, constraint?: { value?: string, type: ConstraintType } }>;
    open: boolean;
},
    'entity'
>;

export default function EntityNode({ data, id }: NodeProps<EntityNodeProps>) {
    const { setNodes, setEdges } = useReactFlow();
    const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setNodes((nodes) => {
            const nodeIndex = nodes.findIndex((node) => node.id === id);
            if (nodeIndex === -1) return nodes;
            const node = nodes[nodeIndex];
            return [
                ...nodes.slice(0, nodeIndex),
                { ...node, data: { ...node.data, [evt.target.name]: evt.target.value } },
                ...nodes.slice(nodeIndex + 1),
            ];
        });
    }

    const onAttributeChange = (index: number, name: string, value: string) => {
        setNodes((nodes: Node[]) => {
            const nodeIndex = nodes.findIndex((node) => node.id === id);
            if (nodeIndex === -1) return nodes;
            const node = nodes[nodeIndex];
            return [
                ...nodes.slice(0, nodeIndex),
                {
                    ...node,
                    data: {
                        ...node.data,
                        attributes: ((node as EntityNodeProps).data.attributes || []).map((attr, i) => i === index ? { ...attr, [name]: value } : attr)
                    }
                },
                ...nodes.slice(nodeIndex + 1),
            ];
        });
    }

    const onAddAttribute = () => {
        setNodes((nodes: Node[]) => {
            const nodeIndex = nodes.findIndex((node) => node.id === id);
            if (nodeIndex === -1) return nodes;
            const node = nodes[nodeIndex];
            return [
                ...nodes.slice(0, nodeIndex),
                {
                    ...node,
                    data: {
                        ...node.data,
                        attributes: [...((node as EntityNodeProps).data.attributes || []), { name: '', type: 'string' }]
                    }
                },
                ...nodes.slice(nodeIndex + 1),
            ];
        });
    }

    const onOpenChange = () => {
        setNodes((nodes: Node[]) => {
            const nodeIndex = nodes.findIndex((node) => node.id === id);
            if (nodeIndex === -1) return nodes;
            const node = nodes[nodeIndex];
            return [
                ...nodes.slice(0, nodeIndex),
                {
                    ...node,
                    data: {
                        ...node.data,
                        open: !node.data.open
                    }
                },
                ...nodes.slice(nodeIndex + 1),
            ];
        })
    }

    const deleteNode = () => {
        setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
        setNodes((nodes: Node[]) => {
            return nodes.filter((node) => node.id !== id);
        });
    }

    const onRemoveAttribute = (index: number) => {
        setNodes((nodes: Node[]) => {
            const nodeIndex = nodes.findIndex((node) => node.id === id);
            if (nodeIndex === -1) return nodes;
            const node = nodes[nodeIndex];
            return [
                ...nodes.slice(0, nodeIndex),
                {
                    ...node,
                    data: {
                        ...node.data,
                        attributes: ((node as EntityNodeProps).data.attributes || []).filter((_, i) => i !== index)
                    }
                },
                ...nodes.slice(nodeIndex + 1),
            ];
        });
    }

    return (
        <>
            <Handle type="target" position={Position.Top} />
            <div className='border border-gray-600 shadow-xl shadow-black rounded-xl p-3 bg-gradient-to-b from-[#150031] to-[#07010F]'>
                <div className='flex justify-between'>
                <Input className='font-semibold w-fit' placeholder='Entity Name' name="name" variant='underlined' value={data.name} onChange={onChange} />
                <Grip className='opacity-60 h-4'/>
                </div>
                
                {data.open && <div className='mt-2 flex flex-col gap-2'>
                    {data.attributes.map((attr, index) => (
                        <div key={index} className='grid grid-cols-[2fr_1fr_0.25fr] gap-2'>
                            <Input name="name" value={attr.name} placeholder='Attribute Name' onChange={(e) => onAttributeChange(index, e.target.name, e.target.value)} />
                            <Select value={String(attr.type)} defaultValue={attributeTypes[0]} onValueChange={(v) => onAttributeChange(index, 'type', v)}  >
                                <SelectTrigger>
                                    {attr.type}
                                </SelectTrigger>
                                <SelectContent>
                                    {attributeTypes.map((attrType, idx) => (<SelectItem key={`attribute-type-select-${idx}`} value={String(attrType)}>{String(attrType)}</SelectItem>))}
                                </SelectContent>
                            </Select>
                            <Button variant="destructive" className='bg-white/10' onClick={() => onRemoveAttribute(index)}>
                                <Trash2Icon size={20} />
                            </Button>
                        </div>
                    ))}
                    {/* <Button onClick={onAddAttribute} className='w-full col-span-2 mt-2'><PlusIcon size={20} /></Button> */}

                    <div className='grid grid-cols-3 items-center justify-center my-3' >
                        <div className='w-full  border'></div>
                        <div className='text-center text-sm rounded-lg border bg-white text-black font-medium px-2 py-1 cursor-pointer'  onClick={onAddAttribute}>+ Add More</div>
                        <div className='w-full  border'></div>
                    </div>
                </div>
                }
                <div className='flex gap-2 mt-2'>

                    <Button onClick={deleteNode} className='w-full mt-2 bg-red-700/10 text-red-600 '>
                        <Trash2Icon className='h-4 '/> Delete
                    </Button>
                    <Button onClick={onOpenChange} className='w-full mt-2 bg-transparent border border-gray-600 text-gray-400 hover:text-black'>
                        <Scaling className="h-4" /> Resize
                    </Button>   
                </div>
            </div>
            <Handle type="source" position={Position.Bottom} id="a" />
        </>
    );
}