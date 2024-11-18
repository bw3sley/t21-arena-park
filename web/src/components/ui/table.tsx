import { ComponentProps } from 'react'

import { twMerge } from 'tailwind-merge'

interface TableProps extends ComponentProps<'table'> { }

export function Table(props: TableProps) {
    return (
        <table {...props} className={twMerge('w-full text-sm', props.className)} />
    )
}

interface TableHeaderProps extends ComponentProps<'thead'> { }

export function TableHeader(props: TableHeaderProps) {
    return <thead {...props} />
}

interface TableHeadProps extends ComponentProps<'th'> { }

export function TableHead(props: TableHeadProps) {
    return (
        <th
            {...props}
            className={twMerge(
                'text-left py-3 px-4 font-medium bg-slate-800 text-slate-200',
                props.className,
            )}
        />
    )
}

interface TableBodyProps extends ComponentProps<'tbody'> { }

export function TableBody(props: TableBodyProps) {
    return (
        <tbody
            {...props}
            className={twMerge('[&_tr:last-child]:border-0', props.className)}
        />
    )
}

interface TableRowProps extends ComponentProps<'tr'> { }

export function TableRow(props: TableRowProps) {
    return (
        <tr
            className={twMerge('border-b border-slate-700', props.className)}
            {...props}
        />
    )
}

interface TableCellProps extends ComponentProps<'td'> { }

export function TableCell(props: TableCellProps) {
    return <td {...props} className={twMerge('py-3 px-4', props.className)} />
}