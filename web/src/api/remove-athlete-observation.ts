import { api } from "@/lib/axios";

export type RemoveAthleteObservationParams = {
    athleteId: string,
    areaName: string,
    observationId: number
}

export async function removeAthleteObservation({ athleteId, areaName, observationId }: RemoveAthleteObservationParams) {
    await api.delete(`/athletes/${athleteId}/areas/${areaName}/observations/${observationId}`);
}