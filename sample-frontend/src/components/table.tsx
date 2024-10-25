import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Attribute, ConstraintType, Entity } from '@/lib/types';

interface EntityTableProps {
    entity: Entity;
    records: Record<string, any>[];
}

const formatCellContent = (value: any, type: Attribute): string => {
    if (value === null || value === undefined) return '';

    if (type.endsWith('[]')) {
        return Array.isArray(value) ? value.join(', ') : String(value);
    }

    switch (type) {
        case 'Date':
            return value ? new Date(value).toDateString() : new Date().toDateString();
        case 'boolean':
            return value ? 'Yes' : 'No';
        default:
            return String(value);
    }
}

const getConstraintBadge = (constraint?: { value?: string; type: ConstraintType }) => {
    if (!constraint) return null;

    const badgeVariant = constraint.type === 'required' ? 'destructive' : 'secondary';
    return (
        <Badge variant={badgeVariant} className="ml-2">
            {constraint.type}{constraint.value ? `: ${constraint.value}` : ''}
        </Badge>
    );
}

export default function EntityTable({ entity, records }: EntityTableProps) {
    return (
        <ScrollArea className="h-[400px] w-full rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {entity.attributes.map((attr) => (
                            <TableHead key={attr.name} className="min-w-[150px]">
                                {attr.name}
                                {getConstraintBadge(attr.constraint)}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {records.map((record, index) => (
                        <TableRow key={index}>
                            {entity.attributes.map((attr) => (
                                <TableCell key={attr.name}>
                                    {formatCellContent(record[attr.name], attr.type)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </ScrollArea>
    )
}