import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { capitalize } from "@/lib/utils";

interface SelectMapProps {
    value: string;
    onChange: (value: string) => void;
    values: string[];
    label?: string;
}

export function SelectMap({ onChange, value, values, label }: SelectMapProps) {
    return (
        <Select onValueChange={onChange} value={value}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {values.map((v, i) => (
                        <SelectItem key={i} value={v}>{capitalize(v)}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
