import { api } from "@/lib/axios";

export type GetLastWeekAthletesAmountBody = {
  date: string,
  count: number
}[]

export async function getLastWeekAthletesAmount() {
  const response = await api.get<GetLastWeekAthletesAmountBody>("/metrics/last-week-athletes-amount");

  return response.data;
}