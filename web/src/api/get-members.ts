import { api } from "@/lib/axios";

export type GetMembersQueryParams = {
    pageIndex?: number | null,
    memberName: string | null,
    role: string | null
}

export type GetMembersResponse = {
    members: {
        id: string,
        name: string,
        email: string,
        role: "ADMIN" | "MEMBER",
        avatarUrl: string | null,
        cpf: string | null,
        phone: string | null,
        gender: "MALE" | "FEMALE" | null,
        birthDate: string | null,
        areas: ("UNSPECIFIED" | "PSYCHOLOGY" | "PHYSIOTHERAPY" | "NUTRITION" | "NURSING" | "PSYCHOPEDAGOGY" | "PHYSICAL_EDUCATION")[]
    }[],

    meta: {
        pageIndex: number,
        perPage: number,
        totalCount: number,
    }
}

export async function getMembers({ pageIndex, memberName, role }: GetMembersQueryParams) {
    const response = await api.get<GetMembersResponse>("/members", {
        params: { pageIndex, memberName, role }
    })
    
    return response.data;
}