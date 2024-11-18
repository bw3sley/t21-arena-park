import { createBrowserRouter } from "react-router-dom";

import { AuthLayout } from "./pages/layouts/auth";
import { AppLayout } from "./pages/layouts/app";

import { SignIn } from "./pages/auth/sign-in";
import { RequestPasswordReset } from "./pages/auth/request-password-reset";
import { ResetPassword } from "./pages/auth/reset-password";

import { Dashboard } from "./pages/app/dashboard/dashboard";
import { Athletes } from "./pages/app/athletes/athletes";
import { Athlete } from "./pages/app/athlete/athlete";
import { Account } from "./pages/app/account/account";
import { Members } from "./pages/app/members/members";
import { Form } from "./pages/app/forms/form";

import { Error } from "./pages/app/error";
import { NotFound } from "./pages/app/404";

import { AuthProvider } from "./contexts/auth-context";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthLayout />,

        errorElement: <Error />,

        children: [
            {
                path: "/",
                element: <SignIn />
            },

            {
                path: "/forgot",
                element: <RequestPasswordReset />
            },

            {
                path: "/new-password",
                element: <ResetPassword />
            }
        ]
    },

    {
        path: "/",
        element: (
            <AuthProvider>
                <AppLayout />
            </AuthProvider>
        ),

        errorElement: <Error />,

        children: [
            {
                path: "/home",
                element: <Dashboard /> 
            },

            {
                path: "/athletes",
                element: <Athletes />
            },

            {
                path: "/athletes/:athleteId",
                element: <Athlete />
            },

            {
                path: "/athletes/:athleteId/forms/anamnesis",
                element: <Form />
            },

            {
                path: "/members",
                element: <Members />
            },

            {
                path: "/account",
                element: <Account />
            }
        ]
    },

    {
        path: "*",
        element: <NotFound />
    }
])