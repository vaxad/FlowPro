export type Node = {
    id: string;
    name?: string;
    val: number;
    color: string;
    label?: string;
    x?: number;
    y?: number;
}

export type Link = {
    source: string;
    target: string;
    color?: string;
    width: number;
}

export type GraphData = {
    nodes: Node[];
    links: Link[];
}