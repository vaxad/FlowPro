import { Tooltip as UiTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import * as TooltipPrimitive from "@radix-ui/react-tooltip"

interface TooltipProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
    title: string;
    children: React.ReactNode;
}

export default function Tooltip({ children, title, ...props }: TooltipProps) {
    return (
        <TooltipProvider>
            <UiTooltip>
                <TooltipTrigger>
                    {children}
                </TooltipTrigger>
                <TooltipContent {...props}>
                    <p>{title}</p>
                </TooltipContent>
            </UiTooltip>
        </TooltipProvider>
    )
}
