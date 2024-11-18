import { removeAthleteObservation } from "@/api/remove-athlete-observation";
import { updateAthleteObservation } from "@/api/update-athlete-observation";

import { errorHandler } from "@/error-handler";

import { queryClient } from "@/lib/react-query";

import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";

import { ChevronDown } from "lucide-react";

import { useState } from "react";

import { useForm } from "react-hook-form";

import { toast } from "sonner";

import { z } from "zod";

import { AthleteObservationItem } from "./athlete-observation-item";

interface AthleteObservationProps {
    threads: {
        thread: {
            id: number,

            observations: [
                {
                    id: number,
                    content: string,
                    edited: boolean,
                    createdAt: string,

                    member: {
                        id: string,
                        name: string
                    }
                }
            ],

            createdAt: string
        } | null
    },

    athleteId: string,

    area: string
}

const AthleteObservationSchema = z.object({
    content: z.string().min(1, "O campo de observação não pode estar vazio")
})

type AthleteObservation = z.infer<typeof AthleteObservationSchema>;

export function AthleteObservation({ threads, athleteId, area }: AthleteObservationProps) {
    const [observationId, setObservationId] = useState<number | null>(null);

    const { handleSubmit, control, setValue } = useForm<AthleteObservation>({
        resolver: zodResolver(AthleteObservationSchema),

        defaultValues: { content: "" }
    })

    const { mutateAsync: updateAthleteObservationFn } = useMutation({
        mutationFn: updateAthleteObservation,

        onSuccess: () => {
            toast.success("Observação atualizada com sucesso!");

            queryClient.invalidateQueries({
                queryKey: ["threads", area]
            })

            setObservationId(null);
        }
    })

    const { mutateAsync: removeAthleteObservationFn } = useMutation({
        mutationFn: removeAthleteObservation,

        onSuccess: () => {
            toast.success("Observação removida com sucesso!");

            queryClient.invalidateQueries({
                queryKey: ["threads", area]
            })
        }
    })

    function onEditClick(observationId: number, content: string) {
        setObservationId(observationId);

        setValue("content", content);
    }

    async function onRemoveClick(observationId: number) {
        try {
            await removeAthleteObservationFn({
                athleteId,
                observationId,
                areaName: area
            })        
        }

        catch (error) { errorHandler(error) }
    }

    async function handleUpdateObservation(data: AthleteObservation) {
        try {
            await updateAthleteObservationFn({
                athleteId,
                observationId,

                content: data.content,

                areaName: area
            })
        }

        catch (error) { errorHandler(error) }
    }

    return (
        <details className="border-t border-slate-700 p-4" open>
            <summary className="flex items-center justify-between">
                <strong className="text-md text-slate-200">Observações cadastradas</strong>

                <div className="size-8 cursor-pointer hover:bg-slate-700 flex items-center justify-center transition-colors rounded-md">
                    <ChevronDown className="size-5 text-slate-400" />
                </div>
            </summary>

            <div className="flex flex-col gap-4 py-3 px-1">
                {threads?.thread?.observations.map(observation => (
                    <AthleteObservationItem 
                        key={observation.id} 
                    
                        observation={observation}

                        states={{
                            control,
                            
                            handleSubmit,
                            handleUpdateObservation,
                            
                            observationId,

                            onEditClick,
                            onRemoveClick,
                            
                            setObservationId
                        }}
                    />
                ))}
            </div>
        </details>
    )
}