import { Skeleton } from "@/components/ui/skeleton";

import { TabsContent } from "@/components/ui/tabs";

import { Loader2 } from "lucide-react";

export function FormTabContentSkeleton() {
    return (
        <TabsContent value="loading">
            <div className="flex items-center gap-3 mb-8">
                <Loader2 className="size-5 animate-spin" />

                <Skeleton className="w-[280px] h-[28px]" />
            </div>

            <div className="w-full flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="py-10 px-12 border border-slate-700 bg-slate-800 rounded-md space-y-6">
                        <div className="flex flex-col gap-2">
                            <Skeleton className="w-32 h-4" />

                            <div className="min-h-[80px] w-full rounded-md border border-slate-700 bg-slate-900 cursor-progress"></div>
                        </div>
                    </div>
                ))}

                <div className="self-end">
                    <Skeleton className="w-[110px] h-11" />
                </div>
            </div>
        </TabsContent>
    )
}