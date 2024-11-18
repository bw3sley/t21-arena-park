export function Error() {
    return (
        <div className="w-screen min-h-screen flex gap-4 items-center justify-center bg-slate-900 overflow-hidden">
            <div className="p-5">
                <div className="space-y-3">
                    <h1 className="text-lime-500 text-7xl md:text-9xl font-bold font-error">
                        Eita!
                    </h1>
                    <h2 className="text-slate-200 text-2xl md:text-4xl font-semibold font-error">
                        Parece que o jogo está no intervalo.
                    </h2>
                </div>

                <span className="mt-12 block text-sm font-semibold uppercase text-slate-300">
                    Comissão técnica avisa:
                </span>

                <div className="mt-6">
                    <p className="flex flex-col gap-1 text-slate-400 text-base">
                        <span>Tivemos um erro no servidor interno.</span>
                        <span>Estamos trabalhando para corrigir isso!</span>
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-3 mt-10">
                    <a
                        href=""
                        className="relative inline-flex flex-shrink-0 cursor-pointer items-center justify-center rounded border-none text-sm bg-slate-600 px-8 py-3 font-bold text-slate-100 transition-colors duration-200 ease-in-out hover:bg-slate-700"
                    >
                        Tentar novamente
                    </a>

                    <a
                        href="/home"
                        className="relative inline-flex flex-shrink-0 cursor-pointer items-center justify-center rounded border-none text-sm bg-lime-600 px-8 py-3 font-bold text-lime-950 transition-colors duration-200 ease-in-out hover:bg-lime-700"
                    >
                        Retornar à home
                    </a>
                </div>
            </div>
        </div>
    )
}