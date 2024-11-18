import { api } from "@/lib/axios";

export type UpdateAthleteObservationBody = {
    athleteId: string,
    areaName: string,
    observationId: number | null,

    content: string
}

export async function updateAthleteObservation({ athleteId, areaName, observationId, content }: UpdateAthleteObservationBody) {
    await api.put(`/athletes/${athleteId}/areas/${areaName}/thread/observations/${observationId}`, { content })
}