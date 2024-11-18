import { api } from "@/lib/axios";

export type ChangeMemberAreaBody = {
    memberId: string,

    areas: ("UNSPECIFIED" | "PSYCHOLOGY" | "PHYSIOTHERAPY" | "NUTRITION" | "NURSING" | "PSYCHOPEDAGOGY" | "PHYSICAL_EDUCATION")[]
}

export async function changeMemberArea({ memberId, areas }: ChangeMemberAreaBody) {
    await api.patch(`/members/${memberId}/change-area`, { areas });
}