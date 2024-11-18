import {
    DropdownMenuContent,
    DropdownMenuItem,
} from "./ui/dropdown-menu";

import { NavLink } from "./nav-link";

import { Home, UsersRound } from "lucide-react";

export function LinksMenu() {
    return (
        <DropdownMenuContent
            align="start"
            className="flex w-[280px] md:w-[328px] flex-col gap-2 animate-slide-up-and-fade"
        >
            <DropdownMenuItem
                className="flex items-center cursor-pointer gap-4 md:px-4 px-4 py-3 hover:bg-slate-700 transition outline-none text-slate-400 data-[current='true']:text-lime-400"
                asChild
            >
                <NavLink to="/home">
                    <Home className="size-5" />
                    Dashboard
                </NavLink>
            </DropdownMenuItem>

            <DropdownMenuItem
                className="flex items-center cursor-pointer gap-4 md:px-4 px-4 py-3 hover:bg-slate-700 transition outline-none text-slate-400 data-[current='true']:text-lime-400"
                asChild
            >
                <NavLink to="/athletes">
                    <UsersRound className="size-5" />
                    Atletas
                </NavLink>
            </DropdownMenuItem>
        </DropdownMenuContent>
    )
}