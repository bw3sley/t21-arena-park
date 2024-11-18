import { Skeleton } from "@/components/ui/skeleton";

import { Label } from "@/components/ui/label";

export function AddressSkeletonForm() {
    return (
        <div className="flex flex-col gap-6 lg:gap-y-6 lg:gap-x-6">
            <section className="grid grid-cols-1 lg:grid-flow-col auto-cols-fr gap-4 lg:grid-cols-[180px_1fr]">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="postalCode" className="inline-block text-slate-400">
                        CEP
                    </Label>

                    <Skeleton className="h-12 w-full" />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="street" className="inline-block text-slate-400">
                        Rua
                    </Label>
                    <Skeleton className="h-12 w-full" />
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-flow-col auto-cols-fr gap-4 lg:grid-cols-[180px_1fr]">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="number" className="inline-block text-slate-400">
                        Número
                    </Label>
                    <Skeleton className="h-12 w-full" />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="complement" className="inline-block text-slate-400">
                        Complemento
                    </Label>
                    <Skeleton className="h-12 w-full" />
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-flow-col auto-cols-fr gap-4 lg:grid-cols-[1fr_1fr_80px]">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="neighborhood" className="inline-block text-slate-400">
                        Bairro
                    </Label>
                    <Skeleton className="h-12 w-full" />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="city" className="inline-block text-slate-400">
                        Cidade
                    </Label>
                    <Skeleton className="h-12 w-full" />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="uf" className="inline-block text-slate-400">
                        UF
                    </Label>
                    <Skeleton className="h-12 w-full" />
                </div>
            </section>

            <div className="self-end">
                <Skeleton className="h-10 w-20" />
            </div>
        </div>
    )
}