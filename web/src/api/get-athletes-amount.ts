import { api } from "@/lib/axios";

export type GetAthletesAmountResponse = {
    amount: number
}

export async function getAthletesAmount() {
    const response = await api.get<GetAthletesAmountResponse>("/metrics/athletes-amount");

    return response.data;
}