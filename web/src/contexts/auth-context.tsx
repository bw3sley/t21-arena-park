import { createContext, useEffect, useState, type ReactNode } from "react";

import cookies from "js-cookie";

type AuthContextType = {
    authenticated: boolean | null,
    loading: boolean
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoadingPage, setIsLoadingPage] = useState(true);

    useEffect(() => {
        const token = cookies.get("t21-arena-park.session-token");

        if (token) {
            setIsAuthenticated(true);
        }

        else {
            setIsAuthenticated(false);
        }

        setIsLoadingPage(false);
    }, []);

    return (
        <AuthContext.Provider value={{ authenticated: isAuthenticated, loading: isLoadingPage }}>
            {children}
        </AuthContext.Provider>
    )
}