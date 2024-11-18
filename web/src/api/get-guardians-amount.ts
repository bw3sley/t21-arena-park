import { api } from "@/lib/axios";

export type GetGuardiansAmountResponse = {
    amount: number
}

export async function getGuardiansAmount() {
    const response = await api.get<GetGuardiansAmountResponse>("/metrics/guardians-amount");

    return response.data;
}