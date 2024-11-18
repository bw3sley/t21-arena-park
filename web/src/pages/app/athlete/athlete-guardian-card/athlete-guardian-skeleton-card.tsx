import { Skeleton } from "@/components/ui/skeleton";

import { ShieldCheck } from "lucide-react";

import { Label } from "@/components/ui/label";

export function AthleteGuardianSkeletonCard() {
    return (
        <div className="flex flex-col bg-slate-800 border border-slate-700 rounded p-6 relative gap-6">
            <div className="flex items-start gap-4">
                <div className="size-14 flex items-center border-slate-700 justify-center border rounded-full flex-shrink-0">
                    <ShieldCheck className="size-7 text-slate-400" />
                </div>

                <div className="space-y-1">
                    <h2 className="font-bold text-xl">Responsável</h2>

                    <p className="text-slate-400 text-md text-justify">
                        Aqui você pode cadastrar ou atualizar os dados do
                        responsável pelo atleta. Essas informações são importantes
                        para manter contato e gerenciar a comunicação com o
                        responsável de forma eficiente.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-y-6 lg:gap-x-6">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name" className="text-sm text-slate-200">
                            Nome
                        </Label>

                        <Skeleton className="h-12 w-full" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email" className="text-sm text-slate-200">
                            Email
                        </Label>

                        <Skeleton className="h-12 w-full" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="rg" className="text-sm text-slate-200">
                            RG
                        </Label>

                        <Skeleton className="h-12 w-full" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="cpf" className="text-sm text-slate-200">
                            CPF
                        </Label>

                        <Skeleton className="h-12 w-full" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="relationshipDegree" className="text-sm text-slate-200">
                            Grau de parentesco
                        </Label>

                        <Skeleton className="h-12 w-full" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="gender" className="text-sm text-slate-200">
                            Gênero
                        </Label>

                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>

                <div className="self-end">
                    <Skeleton className="h-10 w-20" />
                </div>
            </div>
        </div>
    )
}