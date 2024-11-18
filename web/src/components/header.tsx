import { Button } from "@/components/ui/button";

import MenuRightIcon from "@/assets/menu-right.svg";
import MenuLeftIcon from "@/assets/menu-left.svg";

import { AccountMenu } from "./account-menu";

import { AlignJustify, ChevronLeft } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { Link, useNavigate } from "react-router-dom";

import { LinksMenu } from "./links-menu";

interface HeaderProps {
    hasGoBack?: boolean,
    isOpen?: boolean,

    onClickOpen?: (isOpen: boolean) => void
}

export function Header({
    hasGoBack,
    isOpen,
    onClickOpen,
}: HeaderProps) {
    const navigate = useNavigate();

    return (
        <div className="col-span-full h-[72px] lg:[80px] px-4 lg:pr-8 bg-slate-800 border border-transparent border-b-slate-700 flex items-center justify-between">
            {hasGoBack ? (
                <div className="flex items-center gap-5">
                    <button
                        type="button"
                        className="h-10 w-10 bg-slate-700 hover:enabled:bg-slate-700/80 items-center text-sm font-medium transition-colors flex-shrink-0 duration-200 ease-in-out relative inline-flex cursor-pointer justify-center rounded border border-transparent"
                        title="Voltar para a última página"
                        onClick={() => navigate(-1)}
                    >
                        <ChevronLeft className="size-5" color="#C4C4CC" />
                    </button>

                    <Link to="/home" className="flex items-center gap-3">
                        <img src="/logo.svg" className="size-8" alt="" />

                        <strong className="font-bold font-error text-xl">
                            T21 Arena Park
                        </strong>
                    </Link>
                </div>
            ) : (
                <DropdownMenu>
                    <div className="flex items-center gap-5">
                        <Button
                            size="icon"
                            variant="icon"
                            className="hidden lg:flex"
                            title="Expandir menu de navegação"
                            onClick={() => onClickOpen && onClickOpen(!isOpen)}
                        >
                            <img src={isOpen ? MenuLeftIcon : MenuRightIcon} alt="" />
                        </Button>

                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="lg:hidden h-10 w-10 bg-slate-700 hover:enabled:bg-slate-700/80 items-center text-sm font-medium transition-colors flex-shrink-0 duration-200 ease-in-out relative inline-flex cursor-pointer justify-center rounded border border-transparent"
                                title="Abrir menu de navegação"
                            >
                                <AlignJustify color="#C4C4CC" className="size-5" />
                            </button>
                        </DropdownMenuTrigger>

                        <Link to="/home" className="flex items-center gap-3">
                            <img src="/logo.svg" className="size-8" alt="" />

                            <strong className="font-bold font-error text-xl">
                                T21 Arena Park
                            </strong>
                        </Link>
                    </div>

                    <LinksMenu />
                </DropdownMenu>
            )}

            <AccountMenu />
        </div>
    )
}