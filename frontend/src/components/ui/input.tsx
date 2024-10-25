import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "normal" | "underlined",
  sizeVariant?: "sm" | "md" | "lg",
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, sizeVariant, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full text-foreground rounded-md bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          variant === "underlined" && "rounded-none shadow-none  px-0",
          sizeVariant === "lg" && " py-2 text-xl font-semibold",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
