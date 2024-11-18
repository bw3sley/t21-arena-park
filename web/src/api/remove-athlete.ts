import { api } from "@/lib/axios";

export type RemoveAthleteParams = {
    athleteId: string
}

export async function removeAthlete({ athleteId }: RemoveAthleteParams) {
    await api.delete(`/athletes/${athleteId}`);
}