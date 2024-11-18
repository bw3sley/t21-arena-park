import { ArrowRight, BookHeart } from "lucide-react";

import { Link } from "react-router-dom";

export interface AnamnesisCardProps {
    anamnesis: {
        id: string,
        progress: number,
        slug: string
    },

    athleteId: string
}

export function AthleteAnamnesisCard({ athleteId, anamnesis }: AnamnesisCardProps) {
    return (
        <div className="flex bg-slate-800 border border-slate-700 rounded p-6 relative gap-4">
            <div className="size-14 flex items-center border-slate-700 justify-center border rounded-full flex-shrink-0">
                <BookHeart className="size-7 text-slate-400" />
            </div>

            <div className="space-y-1">
                <div className="flex justify-between gap-2 items-center">
                    <h2 className="font-bold text-xl">Anamnese do atleta</h2>

                    {anamnesis.id && (
                        <Link to={`/athletes/${athleteId}/forms/anamnesis`}>
                            <div className="font-bold inline-flex justify-center items-center gap-2 flex-shrink-0 text-sm text-lime-500 cursor-pointer">
                                Visualizar Anamnese
                                <ArrowRight className="size-4" />
                            </div>
                        </Link>
                    )}
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