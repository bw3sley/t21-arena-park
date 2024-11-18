import { api } from "@/lib/axios";

export type CreateAthleteObservationBody = {
    athleteId: string,
    content: string,
    area: string
}

export async function createAthleteObservation({ athleteId, content, area }: CreateAthleteObservationBody) {
    await api.post(`/athletes/${athleteId}/areas/${area}/thread/observations`, { content });
}