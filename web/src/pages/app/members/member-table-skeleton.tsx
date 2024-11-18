import { Skeleton } from "@/components/ui/skeleton";

import { TableCell, TableRow } from "@/components/ui/table";

export function MemberTableSkeleton() {
    return Array.from({ length: 10 }).map((_, index) => (
        <TableRow key={index}>
            <TableCell className="w-[400px] flex items-center gap-4">
                <div className="size-10 flex-shrink-0">
                    <Skeleton className="h-full w-full rounded-full" />
                </div>

                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-[160px]" />

                    <Skeleton className="h-4 w-[120px]" />
                </div>
            </TableCell>

            <TableCell>
                <Skeleton className="h-4 w-[220px]" />
            </TableCell>

            <TableCell>
                <Skeleton className="h-4 w-[64px]" />
            </TableCell>

            <TableCell>
                <Skeleton className="h-4 w-[240px]" />
            </TableCell>

            <TableCell>
                <Skeleton className="h-4 w-[64px]" />
            </TableCell>
        </TableRow>
    ))
}