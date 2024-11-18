import { api } from "@/lib/axios"

export type GetAthleteObservationsParams = {
    athleteId: string,
    areaName: string
}

export type GetAthleteObservationsResponse = {
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
}

export async function getAthleteObservations({ athleteId, areaName }: GetAthleteObservationsParams) {
    const response = await api.get<GetAthleteObservationsResponse>(`/athletes/${athleteId}/areas/${areaName}/thread/observations`);

    return response.data;
}