import { useState } from "react";

import { NotebookPen } from "lucide-react";

import * as Tabs from "@radix-ui/react-tabs";

import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";

import { useForm, Controller } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { mapArea } from "@/utils/mappings/map-area-name";

import { useMutation, useQuery } from "@tanstack/react-query";

import { toast } from "sonner";

import { errorHandler } from "@/error-handler";

import { createAthleteObservation } from "@/api/create-athlete-observation";
import { getAthleteObservations } from "@/api/get-athlete-observations";

import { queryClient } from "@/lib/react-query";

import { AthleteObservation } from "./athlete-observation";

import { usePermission } from "@/hooks/use-permission";

const athleteThreadFormSchema = z.object({
    content: z.string().min(1, "O campo de observação não pode estar vazio")
})

type AthleteThreadForm = z.infer<typeof athleteThreadFormSchema>;

interface AthleteThreadCardProps {
    athleteId: string
}

export function AthleteObservationCard({ athleteId }: AthleteThreadCardProps) {
    const [activeArea, setActiveArea] = useState<string>("PSYCHOLOGY");

    const { handleSubmit, control, reset, formState: { errors } } = useForm<AthleteThreadForm>({
        resolver: zodResolver(athleteThreadFormSchema),

        defaultValues: { content: "" }
    })

    const { data: threads } = useQuery({
        queryKey: ["threads", activeArea],
        queryFn: () => getAthleteObservations({ athleteId, areaName: activeArea })
    })

    const { mutateAsync: createAthleteObservationFn } = useMutation({
        mutationFn: createAthleteObservation,

        onSuccess: () => {
            toast.success("Observação cadastrada com sucesso!");

            queryClient.invalidateQueries({
                queryKey: ["threads", activeArea]
            })

            reset();
        }
    })

    async function handleNewThread(data: AthleteThreadForm) {
        try {
            await createAthleteObservationFn({
                area: activeArea,
                content: data.content,

                athleteId
            })
        }

        catch (error) { errorHandler(error) }
    }

    const hasAbilityTo = usePermission({ permission: "create:observation", area: activeArea });

    return (
        <div className="flex flex-col bg-slate-800 border border-slate-700 rounded p-6 relative gap-6">
            <div className="flex items-start gap-4">
                <div className="size-14 flex items-center border-slate-700 justify-center border rounded-full flex-shrink-0">
                    <NotebookPen className="size-7 text-slate-400" />
                </div>

                <div className="space-y-1">
                    <h2 className="font-bold text-xl">Observações do atleta</h2>

                    <p className="text-slate-400 text-md text-justify">
                        Comente e acompanhe o histórico de observações sobre o atleta. Cada voluntário pode adicionar e editar suas próprias observações, criando uma sequência de anotações para um acompanhamento detalhado.
                    </p>
                </div>
            </div>

            <Tabs.Root
                defaultValue="PSYCHOLOGY"
                onValueChange={(value) => setActiveArea(value)}
                className="bg-slate-900 border border-slate-700 rounded-md overflow-hidden"
            >
                <div className="hover:overflow-x-auto scrollbar-custom">
                    <Tabs.List className="flex h-12 flex-nowrap">
                        {[
                            "PSYCHOLOGY",
                            "NUTRITION",
                            "PHYSIOTHERAPY",
                            "NURSING",
                            "PSYCHOPEDAGOGY",
                            "PHYSICAL_EDUCATION",
                        ].map((area) => (
                            <Tabs.Trigger
                                key={area}
                                value={area}
                                className="flex-shrink-0 flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm lg:py-3 lg:px-6 transition-colors text-slate-300 font-normal data-[state=active]:font-semibold data-[state=active]:text-slate-200 data-[state=active]:bg-slate-800/80 data-[state=active]:border-b-2 data-[state=active]:border-b-lime-500"
                            >
                                {mapArea(area)}
                            </Tabs.Trigger>
                        ))}
                    </Tabs.List>
                </div>

                <div className="border-t border-slate-700 bg-slate-900">
                    {["PSYCHOLOGY", "NUTRITION", "PHYSIOTHERAPY", "NURSING", "PSYCHOPEDAGOGY", "PHYSICAL_EDUCATION"].map((area) => (
                        <Tabs.Content key={area} value={area}>
                            <form
                                method="POST"
                                className="group w-full p-4 flex flex-col gap-4"
                                onSubmit={handleSubmit(handleNewThread)}
                            >
                                <Controller
                                    name="content"
                                    control={control}
                                    render={({ field }) => (
                                        <Textarea
                                            {...field}
                                            disabled={!hasAbilityTo}
                                            placeholder={`Digite uma observação para ${mapArea(area).toLowerCase()}...`}
                                            className="bg-slate-800 placeholder:text-slate-400"
                                        />
                                    )}
                                />
                                <div className="group-focus-within:flex justify-between hidden gap-2">
                                    <div>
                                        {errors.content && (
                                            <span className="text-red-500 text-sm">{errors.content.message}</span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button type="button" size="xs" variant="ghost" onClick={() => reset()}>
                                            Cancelar
                                        </Button>

                                        <Button type="submit" size="xs" variant="primary">
                                            Salvar
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </Tabs.Content>
                    ))}
                </div>

                {threads && threads.thread && threads.thread.observations.length > 0 && (
                    <AthleteObservation
                        threads={threads}
                        area={activeArea}
                        athleteId={athleteId}
                    />
                )}
            </Tabs.Root>
        </div>
    );
}
