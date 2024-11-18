import { api } from "@/lib/axios";

export type ChangePasswordBody = {
    currentPassword: string,
    newPassword: string
} 

export async function changePassword({ currentPassword, newPassword }: ChangePasswordBody) {
    await api.patch("/account/change-password", { currentPassword, newPassword });
}