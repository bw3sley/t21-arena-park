import { api } from "@/lib/axios";

export type GenerateAIObservationParams = {
    athleteId: string
}

export type GenerateAIObservationResponse = {
    observation: string
}

export async function generateAIObservation({ athleteId }: GenerateAIObservationParams) {
    const response = await api.post<GenerateAIObservationResponse>(`/athletes/${athleteId}/anamnesis/ai-observation`);

    return response.data;
}