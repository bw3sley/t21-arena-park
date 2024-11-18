import { api } from "@/lib/axios";

export type GetAverageAgeAmountResponse = {
    amount: number
}

export async function getAverageAgeAmount() {
    const response = await api.get<GetAverageAgeAmountResponse >("/metrics/average-age-amount");

    return response.data;
}