import { api } from "@/lib/axios";

export type GetAthleteParams = {
    athleteId: string
}

export type GetAthleteResponse = {
    athlete: {
        id: string,
        name: string,
        observation: string | null,
        birthDate: string,
        handedness: "RIGHT" | "LEFT",
        gender: "MALE" | "FEMALE",
        bloodType:
            "A_POSITIVE" |
            "A_NEGATIVE" |
            "B_POSITIVE" |
            "B_NEGATIVE" |
            "AB_POSITIVE" |
            "AB_NEGATIVE" |
            "O_POSITIVE" |
            "O_NEGATIVE"
    },

    anamnesis: {
        id: string,
        progress: number,
        slug: string
    },

    address: {
        number: string | null,
        street: string | null,
        neighborhood: string | null,
        country: string | null,
        postalCode: string | null,
        complement: string | null,
        city: string | null,
        uf: string | null
    } | null,
    
    guardian: {
        name: string | null,
        email: string | null,
        relationshipDegree: string | null,
        gender: "MALE" | "FEMALE",
        cpf: string | null,
        rg: string | null
    } | null,
}

export async function getAthlete({ athleteId }: GetAthleteParams) {
    const response = await api.get<GetAthleteResponse>(`/athletes/${athleteId}`);

    return response.data;
}