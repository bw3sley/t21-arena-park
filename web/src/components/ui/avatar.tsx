import * as React from 'react'

import * as AvatarPrimitive from '@radix-ui/react-avatar'

import { cn } from '@/lib/utils'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    initials: string | React.ReactNode
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
    ({ initials, className, ...props }, ref) => {
        return (
            <AvatarPrimitive.Avatar
                ref={ref}
                className={cn("size-12 border cursor-pointer border-slate-700 rounded-full overflow-hidden flex items-center justify-center", className)}
                {...props}
            >
                <AvatarPrimitive.Fallback className="text-slate-300 leading-1 flex h-full w-full items-center justify-center bg-slate-600 text-lg font-medium">
                    {initials}
                </AvatarPrimitive.Fallback>
            </AvatarPrimitive.Avatar>
        )
    },
)

Avatar.displayName = 'Avatar'