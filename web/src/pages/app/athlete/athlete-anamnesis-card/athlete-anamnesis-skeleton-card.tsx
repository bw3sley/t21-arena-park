import { Skeleton } from "@/components/ui/skeleton";

import { BookHeart } from "lucide-react";

export function AthleteAnamnesisSkeletonCard() {
    return (
        <div className="flex bg-slate-800 border border-slate-700 rounded p-6 relative gap-4">
            <div className="size-14 flex items-center border-slate-700 justify-center border rounded-full flex-shrink-0">
                <BookHeart className="size-7 text-slate-400" />
            </div>

            <div className="space-y-1">
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-xl">Anamnese do atleta</h2>

                    <Skeleton className="h-4 w-32" />
                </div>

                <p className="text-slate-400 text-md text-justify">
                    A anamnese é o registro do histórico de saúde e hábitos do
                    atleta. Ela permite um acompanhamento mais preciso de suas
                    condições físicas e orienta os treinamentos de forma
                    personalizada. Preencha com atenção as informações para
                    garantir um melhor suporte ao atleta.
                </p>
            </div>
        </div>
    )
}