import { api } from "@/lib/axios";

export type GetAthletesQueryParams = {
    pageIndex?: number | null,
    athleteName: string | null,
    gender: string | null
}

export type GetAthletesResponse = {
    athletes: {
        id: string,
        name: string,
        age: number,
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
    }[],

    meta: {
        pageIndex: number,
        perPage: number,
        totalCount: number
    }
}

export async function getAthletes({ pageIndex, athleteName, gender }: GetAthletesQueryParams) {
    const response = await api.get<GetAthletesResponse>("/athletes", {
        params: { pageIndex, athleteName, gender }
    })
    
    return response.data;
}