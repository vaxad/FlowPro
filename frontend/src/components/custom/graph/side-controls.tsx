// SliderControls.tsx
import React from 'react';

interface SliderControlsProps {
    nodeSize: number;
    linkWidth: number;
    nodeColor: string;
    nodeCharge: number;
    linkDistance: number;
    onNodeSizeChange: (size: number) => void;
    onLinkWidthChange: (width: number) => void;
    onNodeColorChange: (color: string) => void;
    onNodeChargeChange: (charge: number) => void;
    onLinkDistanceChange: (distance: number) => void;
}

const SliderControls: React.FC<SliderControlsProps> = ({
    nodeSize,
    linkWidth,
    nodeColor,
    nodeCharge,
    linkDistance,
    onNodeSizeChange,
    onLinkWidthChange,
    onNodeColorChange,
    onNodeChargeChange,
    onLinkDistanceChange
}) => {
    return (
        <div style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
            <div>
                <label>Node Size: </label>
                <input
                    type="range"
                    min="1"
                    max="20"
                    value={nodeSize}
                    onChange={e => onNodeSizeChange(Number(e.target.value))}
                />
                {nodeSize}
            </div>
            <div>
                <label>Link Width: </label>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={linkWidth}
                    onChange={e => onLinkWidthChange(Number(e.target.value))}
                />
                {linkWidth}
            </div>
            <div>
                <label>Node Color: </label>
                <input
                    type="color"
                    value={nodeColor}
                    onChange={e => onNodeColorChange(e.target.value)}
                />
                {nodeColor}
            </div>
            <div>
                <label>Node Charge: </label>
                <input
                    type="range"
                    min="-200"
                    max="0"
                    value={nodeCharge}
                    onChange={e => onNodeChargeChange(Number(e.target.value))}
                />
                {nodeCharge}
            </div>
            <div>
                <label>Link Distance: </label>
                <input
                    type="range"
                    min="0"
                    max="300"
                    value={linkDistance}
                    onChange={e => onLinkDistanceChange(Number(e.target.value))}
                />
                {linkDistance}
            </div>
        </div>
    );
}

export default SliderControls;