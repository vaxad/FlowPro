"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { capitalize } from "@/lib/utils"

export const description = "A bar chart with a label"

type BarData = {
    key: string,
    value: number,
}


interface BarChartProps {
    data: BarData[],
    label: string,
    title: string
}

export function BarChartMap({ data, label }: BarChartProps) {

    const chartConfig = {
        value: {
            label,
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{ } Bar Chart</CardTitle>
                {/* <CardDescription>January - June 2024</CardDescription> */}
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            top: 20,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey={"key"}
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey={"value"} fill={`var(--color-value)`} radius={8}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}

                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
