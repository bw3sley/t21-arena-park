export enum Role {
    MEMBER = "MEMBER",
    ADMIN = "ADMIN"
}

export function mapRole(key: string) {
    const map = {
        MEMBER: "Voluntário",
        ADMIN: "Administrador"
    }

    return map[key as keyof typeof map];
}
