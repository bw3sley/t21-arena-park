import { Skeleton } from "@/components/ui/skeleton";

import { TabsTrigger } from "@/components/ui/tabs";

import { ChevronRight, Loader2 } from "lucide-react";

export function FormTabTriggerSkeleton() {
    return (
        <TabsTrigger value="loading">
            <Loader2 className="size-5 animate-spin" />

            <Skeleton className="hidden lg:flex flex-1" />

            <ChevronRight className="size-4 hidden lg:inline-block" />
        </TabsTrigger>
    )
}