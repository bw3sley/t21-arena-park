import { api } from "@/lib/axios"

export type GetAnamnesisAmountResponse = {
    amount: number
}

export async function getAnamnesisAmount() {
    const response = await api.get<GetAnamnesisAmountResponse>("/metrics/anamnesis-amount");

    return response.data;
}