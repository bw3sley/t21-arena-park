import { useUser } from "./use-user";

interface Params {
    permission: string,
    area?: string,
    observationOwnerId?: string
}

export function usePermission(params: Params): boolean {
    const { permission, area, observationOwnerId } = params;

    const { id, role, areas } = useUser();

    switch (permission) {
        case "view:members-page":
            return role !== "MEMBER";

        case "view:observation":
            return true;

        case "create:observation":
            return area ? areas.includes(area) : false;

        case "edit:observation":
            return observationOwnerId === id;

        case "delete:observation":
            return observationOwnerId === id;

        default:
            return false;
    }

    return false;
}