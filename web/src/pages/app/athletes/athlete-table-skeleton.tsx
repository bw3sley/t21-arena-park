import { Skeleton } from '@/components/ui/skeleton'

import { TableCell, TableRow } from '@/components/ui/table'

import { Search } from 'lucide-react'

export function AthleteTableSkeleton() {
    return Array.from({ length: 10 }).map((_, index) => (
        <TableRow key={index}>
            <TableCell className="w-[64px] flex items-center justify-center">
                <div className="size-9 flex-shrink-0 border border-slate-700 rounded-md flex items-center justify-center">
                    <Search className="size-4" />
                </div>
            </TableCell>

            <TableCell>
                <Skeleton className="h-4 w-[300px]" />
            </TableCell>

            <TableCell>
                <Skeleton className="h-4 w-[120px]" />
            </TableCell>

            <TableCell>
                <Skeleton className="h-4 w-[110px]" />
            </TableCell>

            <TableCell>
                <Skeleton className="h-4 w-[110px]" />
            </TableCell>

            <TableCell>
                <Skeleton className="h-4 w-[200px]" />
            </TableCell>

            <TableCell>
                <Skeleton className="h-4 w-[64px]" />
            </TableCell>
        </TableRow>
    ))
}