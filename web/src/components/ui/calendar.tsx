import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { DayPicker } from "react-day-picker"

import { ptBR } from "date-fns/locale";

import { cn } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            locale={ptBR}
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-between pt-1 relative items-center",
                caption_label: "text-sm capitalize font-medium text-slate-200",
                nav: "space-x-1 gap-2 flex items-center",
                nav_button: cn(
                    buttonVariants({ variant: "outline" }),
                    "size-7 [&>svg]:size-5 bg-transparent border-slate-600 p-0 opacity-50 hover:opacity-100"
                ),
                nav_button_previous: "absolute text-slate-200 left-1",
                nav_button_next: "absolute text-slate-200 right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                    "text-slate-300 rounded-md capitalize w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-slate-800/50 [&:has([aria-selected])]:bg-slate-800 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
                ),
                day_range_end: "day-range-end",
                day_selected:
                    "bg-lime-600 text-lime-50 hover:bg-lime-600 hover:text-lime-50 focus:bg-lime-600 focus:text-lime-50",
                day_today: "bg-slate-600/80 text-slate-200",
                day_outside:
                    "day-outside text-slate-400 opacity-50 aria-selected:bg-accent/50 aria-selected:text-slate-400 aria-selected:opacity-30",
                day_disabled: "text-slate-500 opacity-50",
                day_range_middle:
                    "aria-selected:bg-slate-800 aria-selected:text-slate-400",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                IconLeft: ({ ...props }) => (
                    <ChevronLeft className="h-4 w-4" {...props} />
                ),
                IconRight: ({ ...props }) => (
                    <ChevronRight className="h-4 w-4" {...props} />
                ),
            }}
            {...props}
        />
    )
}
Calendar.displayName = "Calendar"

export { Calendar }
