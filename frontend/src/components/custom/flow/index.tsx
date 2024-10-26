"use client";
import {
  addEdge,
  Background,
  BackgroundVariant,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { useCallback, useEffect } from "react";
import EntityNode, { EntityNodeProps } from "./entity-node";
import RelationEdge, { RelationEdgeProps } from "./relation-edge";
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { GenerateFormData } from "@/lib/types/generate-form";
import { generateProjectFolder } from "@/lib/utils";
import DownloadButton from "./download-button";
import Toolbar from "./toolbar";
import { UseFormReturn } from "react-hook-form";
import { FaWandMagicSparkles } from "react-icons/fa6";

const defaultInitialNodes: EntityNodeProps[] = [
  {
    id: "1",
    position: { x: 10, y: 10 },
    data: { name: "", attributes: [{ name: "", type: "string" }], open: true },
    type: "entity",
  },
  {
    id: "2",
    position: { x: 400, y: 400 },
    data: { name: "", attributes: [{ name: "", type: "string" }], open: true },
    type: "entity",
  },
];
const defaultInitialEdges: RelationEdgeProps[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "relation",
    data: { type: "1-m" },
  },
];

const edgeTypes = {
  relation: RelationEdge,
};

const nodeTypes = {
  entity: EntityNode,
};

interface FlowProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form?: UseFormReturn<GenerateFormData, any, undefined>;
}

export default function Flow({ form }: FlowProps) {
  const initialNodes: EntityNodeProps[] =
    form && form.getValues("entities").length
      ? form.getValues("entities").map((entity, index) => ({
          id: index.toString(),
          position: { x: 100 + index * 300, y: 100 + index * 300 },
          data: {
            name: entity.name,
            attributes: entity.attributes,
            open: true,
          },
          type: "entity",
        }))
      : defaultInitialNodes;
  const initialEdges: RelationEdgeProps[] =
    form && form.getValues("relations").length
      ? form
          .getValues("relations")
          .map((relation, index) => {
            const source = initialNodes.find(
              (node) => node.data.name === relation.from
            )?.id;
            const target = initialNodes.find(
              (node) => node.data.name === relation.to
            )?.id;
            if (!source || !target) return false;
            return {
              id: index.toString(),
              source,
              target,
              type: "relation" as const,
              data: { type: relation.type },
            };
          })
          .filter((relation) => !!relation)
      : defaultInitialEdges;

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [auth, setAuth] = React.useState(true);

  const onConnect = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (params: any) =>
      setEdges((eds) =>
        addEdge({ ...params, type: "relation", data: { type: "1-m" } }, eds)
      ),
    [setEdges]
  );

  useEffect(() => {
    if (!form) return;
    form.setValue(
      "entities",
      nodes.map((node) => ({
        name: node.data.name,
        attributes: node.data.attributes,
      }))
    );
  }, [nodes]);

  useEffect(() => {
    if (!form) return;
    form.setValue(
      "relations",
      edges
        .map((edge) => {
          const from = nodes.find((node) => node.id === edge.source)?.data.name;
          const to = nodes.find((node) => node.id === edge.target)?.data.name;
          const type = edge?.data?.type;
          if (!from || !to || !type) return false;
          return {
            from,
            to,
            type,
            name: `${from}To${to}`,
          };
        })
        .filter((edge) => !!edge)
    );
  }, [edges]);

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
              };
            }),
          };
        }),
        relations: edges
          .map((edge) => {
            const { data } = edge as RelationEdgeProps;
            const from = nodes.find((node) => node.id === edge.source)?.data
              .name;
            const to = nodes.find((node) => node.id === edge.target)?.data.name;
            if (!from || !to) return false;
            return {
              from,
              to,
              type: data?.type || "1-m",
              name: `${from}To${to}`,
            };
          })
          .filter((edge) => edge !== false),
      };

      await generateProjectFolder(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  }

  return (
    <>
      <div className="w-full relative flex-grow bg-transparent border h-[80vh] rounded mt-4">
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
          <MiniMap
            style={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
            nodeColor={() => "#777"} // Color for nodes in the minimap
            nodeStrokeWidth={2} // Optional: makes nodes more visible
            maskColor="#333"
          />
          <Toolbar />
          <DownloadButton />
        </ReactFlow>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2 items-center">
          <Label className="text-xl font-semibold">Authentication:</Label>
          <Switch
            checked={auth}
            onCheckedChange={() => {
              setAuth((prev) => !prev);
            }}
          />
        </div>
        <Button
          onClick={generateProject}
          type="button"
          className="text-white gap-2 bg-gradient-to-r from-purple-500 to-pink-500 border"
        >
          Generate Project <FaWandMagicSparkles />
        </Button>
      </div>
    </>
  );
}
