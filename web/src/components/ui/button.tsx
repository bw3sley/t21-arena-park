import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "disabled:opacity-50 outline-none disabled:cursor-not-allowed disabled:select-none disabled:opacity-70 text-sm font-medium transition-colors flex-shrink-0 duration-200 ease-in-out relative inline-flex cursor-pointer items-center justify-center rounded border border-transparent  whitespace-nowrap  ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 rounded-md",
    {
        variants: {
            variant: {
                ghost:'text-sm bg-slate-800 font-bold text-slate-200 hover:bg-slate-700',
                primary:'bg-lime-600 font-bold text-sm text-lime-950 hover:enabled:bg-lime-700 gap-1',
                secondary: 'bg-slate-700 hover:enabled:bg-slate-600',
                outline:'bg-transparent border border-slate-700 hover:enabled:bg-slate-700',
                link: "text-slate-300 hover:underline",
                icon: 'bg-slate-700 hover:enabled:bg-slate-700/80',
            },

            size: {
                xs: 'h-8 px-2.5',
                sm: 'h-9 px-3',
                md: 'h-10 px-4',
                lg: 'h-11 px-8',
                icon: 'h-10 w-10',
            },
        },

        defaultVariants: {
            variant: 'ghost',
            size: 'md',
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
