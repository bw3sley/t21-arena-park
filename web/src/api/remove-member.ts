import { api } from "@/lib/axios";

export type RemoverMemberParams = {
    memberId: string
}

export async function removeMember({ memberId }: RemoverMemberParams) {
    await api.delete(`/members/${memberId}`);
}