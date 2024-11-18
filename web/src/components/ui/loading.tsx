import { Loader2 } from "lucide-react";

export function Loading() {
    return (
        <div className="w-screen min-h-screen flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-slate-600" />
        </div>
    )
}