import { changeMemberArea } from "@/api/change-member-area";

import { MultiSelect } from "@/components/ui/multi-select";
import { errorHandler } from "@/error-handler";
import { queryClient } from "@/lib/react-query";

import { useMutation } from "@tanstack/react-query";

import { useState } from "react";

import { toast } from "sonner";

import { z } from "zod";

export enum Area {
    UNSPECIFIED = "UNSPECIFIED",
    PSYCHOLOGY = "PSYCHOLOGY",
    PHYSIOTHERAPY = "PHYSIOTHERAPY",
    NUTRITION = "NUTRITION",
    NURSING = "NURSING",
    PSYCHOPEDAGOGY = "PSYCHOPEDAGOGY",
    PHYSICAL_EDUCATION = "PHYSICAL_EDUCATION"
}

export const areas = [
    { label: "Psicologia", value: Area.PSYCHOLOGY },
    { label: "Fisioterapia", value: Area.PHYSIOTHERAPY },
    { label: "Nutrição", value: Area.NUTRITION },
    { label: "Enfermagem", value: Area.NURSING },
    { label: "Psicopedagogia", value: Area.PSYCHOPEDAGOGY },
    { label: "Educação Física", value: Area.PHYSICAL_EDUCATION },
];

const memberAreaSchema = z.object({
    areas: z.array(
        z.enum([
            "PSYCHOLOGY",
            "PHYSIOTHERAPY",
            "NUTRITION",
            "NURSING",
            "PSYCHOPEDAGOGY",
            "PHYSICAL_EDUCATION"
        ])
    ).min(1, "Selecione pelo menos uma área")
})

interface MemberAreasProps {
    member: {
        id: string,

        areas: Area[]
    }
}

export function MemberAreas({ member }: MemberAreasProps) {
    const [selectedAreas, setSelectedAreas] = useState<Area[]>(member.areas);

    const { mutateAsync: changeMemberAreaFn } = useMutation({
        mutationFn: changeMemberArea,

        onSuccess: () => {
            toast.success("A área do voluntário foi atualizada com sucesso!");

            queryClient.invalidateQueries({
                queryKey: ["members"]
            })
        }
    })

    async function handleMemberArea(newAreas: string[]) {
        const typedAreas = newAreas as Area[];

        try {
            const { success, error, data } = memberAreaSchema.safeParse({ areas: newAreas });

            if (!success) {
                return toast.error(error.issues[0].message);
            }

            try {
                await changeMemberAreaFn({
                    memberId: member.id,
                    areas: data.areas
                })

                setSelectedAreas(typedAreas);
            }

            catch (error) { errorHandler(error) }
        }

        catch (error) { errorHandler(error); }
    }

    return (
        <MultiSelect
            defaultValue={selectedAreas}
            value={selectedAreas}
            onValueChange={handleMemberArea}
            options={areas}
            maxCount={2}
            placeholder="Selecione uma área"
        />
    )
}