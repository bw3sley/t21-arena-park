import { api } from "@/lib/axios"

import { parse } from "date-fns";

export type UpdateAthleteBody = {
    athleteId: string,
    name: string,
    birthDate: string,
    handedness: "RIGHT" | "LEFT" | "none",
    gender: "MALE" | "FEMALE" | "none",
    bloodType: "A_POSITIVE" |
        "A_NEGATIVE" |
        "B_POSITIVE" |
        "B_NEGATIVE" |
        "AB_POSITIVE" |
        "AB_NEGATIVE" |
        "O_POSITIVE" |
        "O_NEGATIVE" | "none"
}

export async function updateAthlete({ athleteId, name, birthDate, handedness, bloodType, gender }: UpdateAthleteBody) {
    await api.put(`/athletes/${athleteId}`, {
        name,
        birthDate: parse(birthDate, 'dd/MM/yyyy', new Date()),
        bloodType,
        handedness,
        gender
    })
}