import { Outlet } from 'react-router-dom'

export function AuthLayout() {
    return (
        <div className="min-h-screen w-screen flex items-stretch bg-slate-900 text-slate-200">
            <div className="flex-1 bg-gradient-to-r from-sky-800 to-lime-400 max-[1100px]:hidden flex p-5"></div>

            <div className="dark:bg-slate-800 flex-[560px_1_0] max-[1100px]:flex-1 min-[1101px]:max-w-[560px]">
                <Outlet />
            </div>
        </div>
    )
}