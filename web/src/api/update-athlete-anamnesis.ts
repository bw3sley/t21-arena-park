import { api } from "@/lib/axios"

export type UpdateAthleteAnamnesisBody = {
    athleteId: string,
    slug: string,

    questions: Record<number, {
        answer?: string | string[],
        observation?: string
    } | null>
}

export async function updateAthleteAnamnesis({ athleteId, slug, questions }: UpdateAthleteAnamnesisBody) {
    await api.put(`/athletes/${athleteId}/forms/${slug}/answers`, { questions });
}