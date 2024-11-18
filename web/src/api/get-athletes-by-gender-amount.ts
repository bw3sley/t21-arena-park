import { api } from "@/lib/axios";

export type GetAthletesByGenderAmountResponse = {
    gender: "male" | "female",
    amount: number
}[]

export async function getAthletesByGenderAmount() {
    const response = await api.get<GetAthletesByGenderAmountResponse>("/metrics/athletes-gender-amount");

    return response.data;
}