import { generateAIObservation } from "@/api/generate-ai-observation";

import { Button } from "@/components/ui/button";

import { errorHandler } from "@/error-handler";

import { queryClient } from "@/lib/react-query";

import { useMutation } from "@tanstack/react-query";

import { RotateCcw, WandSparkles } from "lucide-react";

import { toast } from "sonner";

export type AthleteIAObservationCardProps = {
    data: {
        athlete: {
            id: string,
            observation: string | null
        },

        anamnesis: {
            progress: number
        }
    }
}

export function AthleteAIObservationCard({ data }: AthleteIAObservationCardProps) {
    const { mutateAsync: generateAIObservationFn } = useMutation({
        mutationFn: generateAIObservation,

        onSuccess: () => {
            toast.success("Observação gerada por IA com sucesso!");

            queryClient.invalidateQueries({
                queryKey: ["athletes", data.athlete.id]
            })
        }
    })

    async function handleNewIAObservation(athleteId: string) {
        try {
            await generateAIObservationFn({ athleteId });
        }

        catch (error) { errorHandler(error) }
    }

    return (
        <div className="flex flex-col bg-slate-800 border border-slate-700 rounded p-6 relative gap-6">
            <div className="flex items-start gap-4">
                <div className="size-14 flex items-center border-slate-700 justify-center border rounded-full flex-shrink-0">
                    <WandSparkles className="size-7 text-slate-400" />
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between gap-2 items-center">
                        <h2 className="font-bold text-xl">Observação com IA</h2>

                        {data.athlete.observation && (
                            <button type="button" onClick={() => handleNewIAObservation(data.athlete.id)} className="font-bold inline-flex justify-center items-center gap-2 flex-shrink-0 text-sm text-lime-500 cursor-pointer">
                                <RotateCcw className="size-4" />
                                Gerar novamente
                            </button>
                        )}
                    </div>

                    <p className="text-slate-400 text-md text-justify">
                        A IA analisará os dados preenchidos na anamnese para criar uma observação personalizada sobre o atleta. Certifique-se de que a anamnese esteja pelo menos 90% completa para habilitar esta funcionalidade.
                    </p>
                </div>
            </div>

            {data.athlete.observation ? (
                <div className="flex flex-col gap-2">
                    <div className="bg-slate-900 border border-slate-700 p-4 rounded-md leading-relaxed text-sm text-justify">{data.athlete.observation}</div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-4 min-h-32">
                    <Button
                        type="button"
                        variant="primary"
                        size="md"
                        disabled={data.anamnesis.progress < 80}
                        onClick={() => handleNewIAObservation(data.athlete.id)}
                    >
                        <span>Gerar observação</span>
                    </Button>

                    {data.anamnesis.progress < 80 && <span className="text-sm text-slate-400">Você precisa completar 80% ou mais da anamnese antes</span>}
                </div>
            )}
        </div>
    )
}