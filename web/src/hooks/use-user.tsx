import { useEffect, useState } from "react";

import type { JWTPayload } from "@/@types/jwt";

import cookies from "js-cookie";

import { useNavigate } from "react-router-dom";

interface User {
    id: string,
    role: string,
    areas: string[]
}

export function useUser() {
    const [user, setUser] = useState<User>({ id: "", role: "", areas: [] });

    const navigate = useNavigate();

    useEffect(() => {
        const token = cookies.get("t21-arena-park.session-token");

        if (!token) {
            return navigate("/");
        }

        try {
            const payload = JSON.parse(atob(token.split(".")[1])) as JWTPayload;

            const { sub, role, area } = payload;

            setUser({
                id: sub, role, areas: area ?? []
            })
        }

        catch (error) { navigate("/home") }
    }, [navigate])

    return user;
}