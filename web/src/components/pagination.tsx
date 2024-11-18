import {
    ChevronsLeft,
    ChevronLeft,
    ChevronsRight,
    ChevronRight,
} from 'lucide-react'

interface PaginationProps {
    pageIndex: number
    totalCount: number
    perPage: number

    onPageChange: (pageIndex: number) => Promise<void> | void
}

export function Pagination({
    pageIndex,
    perPage,
    totalCount,
    onPageChange,
}: PaginationProps) {
    const pages = Math.ceil(totalCount / perPage) || 1

    return (
        <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">
                Total de {totalCount} item(s)
            </div>

            <div className="flex items-center gap-6 lg:gap-8">
                <div className="text-sm font-medium text-slate-400">
                    Página {pageIndex + 1} de {pages}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="size-8 p-0 flex items-center justify-center disabled:text-slate-400 text-slate-300 rounded-md border border-slate-800 hover:enabled:bg-slate-800/50 hover:enabled:text-slate-300"
                        disabled={pageIndex === 0}
                        onClick={() => onPageChange(0)}
                    >
                        <ChevronsLeft className="size-4" />
                        <span className="sr-only">Primeira página</span>
                    </button>

                    <button
                        type="button"
                        className="size-8 p-0 flex items-center justify-center disabled:text-slate-400 text-slate-300 rounded-md border border-slate-800 hover:enabled:bg-slate-800/50 hover:enabled:text-slate-300"
                        disabled={pageIndex === 0}
                        onClick={() => onPageChange(pageIndex - 1)}
                    >
                        <ChevronLeft className="size-4" />
                        <span className="sr-only">Primeira anterior</span>
                    </button>

                    <button
                        type="button"
                        className="size-8 p-0 flex items-center justify-center disabled:text-slate-400 text-slate-300 rounded-md border border-slate-800 hover:enabled:bg-slate-800/50 hover:enabled:text-slate-300"
                        disabled={pages <= pageIndex + 1}
                        onClick={() => onPageChange(pageIndex + 1)}
                    >
                        <ChevronRight className="size-4" />
                        <span className="sr-only">Próxima página</span>
                    </button>

                    <button
                        type="button"
                        className="size-8 p-0 flex items-center justify-center disabled:text-slate-400 text-slate-300 rounded-md border border-slate-800 hover:enabled:bg-slate-800/50 hover:enabled:text-slate-300"
                        disabled={pages <= pageIndex + 1}
                        onClick={() => onPageChange(pages - 1)}
                    >
                        <ChevronsRight className="size-4" />
                        <span className="sr-only">Última página</span>
                    </button>
                </div>
            </div>
        </div>
    )
}