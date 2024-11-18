export function NotFound() {
    return (
        <div className="w-screen min-h-screen flex gap-4 items-center justify-center bg-slate-900 overflow-hidden">
            <div className="p-5">
                <div className="space-y-3">
                    <h1 className="text-lime-500 text-7xl md:text-9xl font-bold font-error">
                        404...
                    </h1>
                    <h2 className="text-slate-200 text-2xl md:text-4xl font-semibold font-error">
                        Esse não é o nosso estádio.
                    </h2>
                </div>

                <span className="mt-12 block text-sm font-semibold uppercase text-slate-300">
                    Comissão técnica avisa:
                </span>

                <div className="mt-6">
                    <p className="flex flex-col gap-1 text-slate-400 text-base">
                        <span>A página que você queria torcer sumiu do estádio.</span>
                        <span>Vamos voltar para a torcida principal?</span>
                    </p>
                </div>

                <div className="mt-10">
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