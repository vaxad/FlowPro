import { GraphData, Node, Link } from "@/lib/types/graph"

export function neo4jToRFG(data: any): GraphData {
    const nodes: Node[] = [];
    const links: Link[] = [];

    data.records.forEach((record: any) => {
        const node = record.get('node');
        const nodeData: Node = {
            id: node.identity.low,
            name: node.properties.name,
            val: node.properties.val,
            color: node.properties.color,
            x: Math.random() * 1000,
            y: Math.random() * 1000
        };
        nodes.push(nodeData);

        record.get('links').forEach((link: any) => {
            const linkData: Link = {
                source: node.identity.low,
                target: link.end.low,
                width: link.type === 'RELATED' ? 2 : 1
            };
            links.push(linkData);
        });
    });

    return { nodes, links };
}