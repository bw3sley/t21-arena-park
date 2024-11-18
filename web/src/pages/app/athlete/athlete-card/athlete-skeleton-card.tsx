import { Skeleton } from "@/components/ui/skeleton"

export function AthleteSkeletonCard() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex border border-slate-700 rounded flex-col p-0 relative overflow-hidden">
                <div className="h-40 w-full relative overflow-hidden">
                    <div className="h-full bg-lime-500">
                        <div className="flex items-center gap-2 absolute top-4 right-4 z-10"></div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center -mt-20">
                    <div className="relative flex flex-col items-center">
                        <span className="flex justify-center items-center text-slate-200 select-none w-[10rem] h-[10rem]">
                            <Skeleton className="rounded-full flex h-full w-full animate-none" />
                        </span>

                        <div className="flex flex-col gap-2 items-center pt-6 pb-20 w-full">
                            <div className="flex gap-2 items-center justify-center w-full">
                                <Skeleton className="h-8 w-52" />
                            </div>

                            <div className="flex flex-col w-full items-center">
                                <Skeleton className="h-5 w-40" />

                                <div className="flex flex-col w-full items-center">
                                    <div className="flex gap-2 justify-center mt-2 items-center">
                                        <Skeleton className="h-4 w-12" />

                                        <span>|</span>

                                        <Skeleton className="h-4 w-12" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full justify-center py-4 border-t border-slate-700 absolute bottom-0 left-0 opacity-100 visible transition-all ease-in-out duration-300">
                        <div className="px-6">
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}