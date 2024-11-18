import { Header } from "@/components/header";

import { Navbar } from "@/components/navbar";

import { Loading } from "@/components/ui/loading";

import { useAuth } from "@/hooks/use-auth";
import { usePermission } from "@/hooks/use-permission";

import { api } from "@/lib/axios";

import { isAxiosError } from "axios";

import clsx from "clsx";

import { useEffect, useState } from "react";

import { Outlet, useMatch, useNavigate } from "react-router-dom";

export function AppLayout() {
    const navigate = useNavigate();

    const match = useMatch("/athletes/:id/anamnesis");

    const isMembersPage = useMatch("/members");

    const hasAbilityTo = usePermission({ permission: "view:members-page" });

    const { authenticated, loading } = useAuth();

    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    useEffect(() => {
        if (!loading && authenticated === false) {
            navigate("/", { replace: true });
        }

        if (isMembersPage && !hasAbilityTo) {
            navigate("/404", { replace: true });
        }

        const interceptorId = api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (isAxiosError(error)) {
                    const status = error.response?.status;

                    if (status === 403 || status === 401) {
                        navigate("/404", { replace: true });
                    }
                }
            },
        )

        return () => {
            api.interceptors.response.eject(interceptorId);
        }
    }, [authenticated, loading, navigate, isMembersPage]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className={clsx("grid grid-cols-1 grid-rows-[auto_1fr] h-full min-h-screen bg-slate-900 text-slate-200", match === null && "lg:grid-cols-[auto_1fr]")}>
            <Header isOpen={isNavbarOpen} onClickOpen={setIsNavbarOpen} hasGoBack={match !== null} />

            {match === null && <Navbar isOpen={isNavbarOpen} />}

            <div className="overflow-auto h-[calc(100vh-72px)] lg:h-[calc(100vh-80px)]">
                <Outlet />
            </div>
        </div>
    )
}