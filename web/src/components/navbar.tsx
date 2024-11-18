import { Home, UsersRound } from 'lucide-react'

import { NavLink } from './nav-link'

import { twMerge } from 'tailwind-merge'

interface NavbarProps {
    isOpen: boolean
}

export function Navbar({ isOpen }: NavbarProps) {
    return (
        <div
            className={twMerge(
                'hidden lg:flex border p-3 pt-6 border-transparent border-r-slate-700 transition-all duration-300',
                isOpen ? 'w-[216px]' : 'w-[76px]',
            )}
        >
            <nav className="flex flex-col gap-3 flex-1">
                <NavLink
                    to="/home"
                    className="flex items-center gap-4 w-full p-3 rounded transition-all text-slate-400 hover:bg-slate-700 data-[current=true]:font-medium data-[current=true]:text-lime-400 data-[current=true]:bg-slate-800/80"
                >
                    <Home className="size-6" />

                    {isOpen && <span className="text-sm">Dashboard</span>}
                </NavLink>

                <NavLink
                    to="/athletes"
                    className="flex items-center gap-4 w-full p-3 rounded transition-all text-slate-400 hover:bg-slate-800 data-[current=true]:text-lime-500 data-[current=true]:bg-slate-800/80"
                >
                    <UsersRound className="size-6" />

                    {isOpen && <span className="text-sm">Atletas</span>}
                </NavLink>
            </nav>
        </div>
    )
}