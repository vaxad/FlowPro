"use client";
import { ForceGraph2D } from 'react-force-graph';
import React, { useEffect, useState } from 'react';
import { GraphData, Node, Link } from '@/lib/types/graph';
function Graph({ graphData }: { graphData: GraphData }) {
    const [height, _] = useState(window.innerHeight - 100);
    const [width, __] = useState(window.innerWidth);
    // useEffect(() => {
    //     fetch('/api/neo4jData')
    //         .then(res => res.json())
    //         .then(neo4jData => {
    //             const rfgData = neo4jToRFG(neo4jData);
    //             if (isValidGraphData(rfgData)) {
    //                 setGraphData(rfgData);
    //             } else {
    //                 console.error('Invalid graph data');
    //             }
    //         })
    //         .catch(err => console.error('Failed to fetch graph data:', err));
    // }, []);

    return (
        <ForceGraph2D
            width={width}
            height={height}
            graphData={graphData}
            nodeRelSize={8}
            nodeVal={(node: Node) => node.val}
            nodeCanvasObject={(node: Node, ctx: CanvasRenderingContext2D, globalScale: number) => {
                const label = node.name;
                const fontSize = 10 / globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = node.color;
                ctx.beginPath();
                if (node.x && node.y) {
                    ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false);
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
                    ctx.fillText(label ? label : "", node.x, node.y);
                }
            }}
            linkWidth={(link: Link) => link.width}
        />
    );
}

export default Graph;