import { api } from "@/lib/axios";

import { parse } from "date-fns";

export type CreateAthleteBody = {
    name: string,
    birthDate: string,
    gender: "MALE" | "FEMALE" | "none",
    handedness: "RIGHT" | "LEFT" | "none",
    bloodType: "A_POSITIVE" |
        "A_NEGATIVE" |
        "B_POSITIVE" |
        "B_NEGATIVE" |
        "AB_POSITIVE" |
        "AB_NEGATIVE" |
        "O_POSITIVE" |
        "O_NEGATIVE" | "none"
}

export async function createAthlete({ name, gender, handedness, bloodType, birthDate }: CreateAthleteBody) {
    await api.post("/athletes", {
        name,
        gender,
        handedness,
        bloodType,
        birthDate: parse(birthDate, 'dd/MM/yyyy', new Date()).toISOString()
    })
}