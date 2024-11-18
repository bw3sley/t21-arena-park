import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";

import { usePermission } from "@/hooks/use-permission";

import { getNameInitials } from "@/utils/get-name-initials";

import { format, formatDistanceToNow } from "date-fns";

import { ptBR } from "date-fns/locale";

import { Pencil, Trash } from "lucide-react";

import { Controller } from "react-hook-form";

interface AthleteObservationItemProps {
    observation: {
        id: number,
        content: string,
        edited: boolean,
        createdAt: string,

        member: {
          id: string,
          name: string
        }
    },

    states: {
        onEditClick: (id: number, content: string) => void,
        onRemoveClick: (id: number) => void,

        observationId: number | null,

        control: any,

        handleSubmit: any,
        handleUpdateObservation: any,

        setObservationId: (id: number | null) => void
    }
}

export function AthleteObservationItem({ observation, states }: AthleteObservationItemProps) {
    const hasAbilityTo = usePermission({ permission: "edit:observation", observationOwnerId: observation.member.id });

    return (
        <div key={observation.id} className="group flex gap-4">
            <div className="size-8 bg-slate-600 border border-slate-700 flex items-center justify-center rounded-full">
                <span className="text-xs font-semibold">{getNameInitials(observation.member.name)}</span>
            </div>

            <div className="bg-slate-800 flex flex-col gap-1 w-full rounded-md px-4 py-3 border border-slate-700">
                <div className="flex items-center justify-between gap-2 min-h-6">
                    <div className="flex items-center gap-2">
                        <strong className="text-sm">{observation.member.name}</strong>

                        <time
                            title={format(new Date(observation.createdAt), "d 'de' LLLL 'às' HH:mm'h'", { locale: ptBR })}
                            dateTime={observation.createdAt}
                            className="text-xs text-slate-400"
                        >
                            {formatDistanceToNow(new Date(observation.createdAt), {
                                locale: ptBR,
                                addSuffix: true
                            })}
                        </time>

                        {observation.edited && <span className="text-xs text-slate-400">(editado)</span>}
                    </div>

                    {hasAbilityTo && (
                        <div className="hidden group-hover:flex">
                            <Button type="button" size="icon" className="size-6 rounded-sm" onClick={() => states.onEditClick(observation.id, observation.content)}>
                                <Pencil className="size-3.5 text-slate-400" />
                            </Button>

                            <Button type="button" size="icon" className="size-6 rounded-sm" onClick={() => states.onRemoveClick(observation.id)}>
                                <Trash className="size-3.5 text-red-500" />
                            </Button>
                        </div>
                    )}
                </div>

                {states.observationId === observation.id ? (
                    <form method="POST" onSubmit={states.handleSubmit(states.handleUpdateObservation)}>
                        <Controller
                            name="content"
                            control={states.control}
                            render={({ field }) => (
                                <Textarea {...field} className="min-h-fit" />
                            )}
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <Button
                                type="button"
                                size="xs"
                                variant="ghost"

                                onClick={() => states.setObservationId(null)}
                            >
                                Cancelar
                            </Button>

                            <Button type="submit" size="xs" variant="primary">
                                Salvar
                            </Button>
                        </div>
                    </form>
                ) : (
                    <p className="text-sm text-justify text-slate-300">
                        {observation.content}
                    </p>
                )}
            </div>
        </div>
    )
}