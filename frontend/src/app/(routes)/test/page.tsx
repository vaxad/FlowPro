import Graph from '@/components/custom/graph'
import { FLASK_API } from '@/lib/constants'
import { GraphData } from '@/lib/types/graph'
import React from 'react'

export default async function page() {
    const data = await fetch(`${FLASK_API}/get_graph_data`, { next: { revalidate: 1 } })
    const graphData = await data.json()
    console.log("fetching")
    function isValidGraphData(data: any): data is GraphData {
        return 'nodes' in data && 'links' in data;
    }
    console.log(graphData, isValidGraphData(graphData))

    return isValidGraphData(data) && (
        <div>
            <Graph graphData={graphData} />
        </div>
    )
}
