import { api } from "@/lib/axios";

export type ChangeEmailBody = {
    email: string,
    password: string
}

export async function changeEmail({ email, password }: ChangeEmailBody) {
    await api.patch("/account/change-email", { email, password });
}