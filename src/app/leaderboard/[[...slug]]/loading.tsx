export default function Loading() {
    return (
        <div className="min-h-screen bg-[#0C0C0C]">
            <main className="mx-auto flex w-[960px] max-w-full flex-col gap-10 px-20 py-10">
                <section className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-[32px] font-bold text-[#10B981]">
                            {">"}
                        </span>
                        <h1 className="font-mono text-[28px] font-bold text-[#E5E5E5]">
                            shame_leaderboard
                        </h1>
                    </div>
                    <p className="font-mono text-sm text-[#A3A3A3]">
                        {"// the most roasted code on the internet"}
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-20 animate-pulse rounded bg-[#262626]" />
                        <span className="font-mono text-xs text-[#737373]">
                            {"\u00b7"}
                        </span>
                        <div className="h-3 w-24 animate-pulse rounded bg-[#262626]" />
                    </div>
                </section>

                <section className="flex flex-col gap-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex flex-col border border-[#1F1F1F] bg-[#0F0F0F]"
                        >
                            <div className="flex h-12 items-center justify-between border-b border-[#1F1F1F] px-5">
                                <div className="flex items-center gap-4">
                                    <div className="h-3 w-8 animate-pulse rounded bg-[#262626]" />
                                    <div className="h-3 w-12 animate-pulse rounded bg-[#262626]" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-3 w-16 animate-pulse rounded bg-[#262626]" />
                                    <div className="h-3 w-12 animate-pulse rounded bg-[#262626]" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 border border-[#1F1F1F] bg-[#111111] p-4">
                                <div className="h-3 w-full animate-pulse rounded bg-[#262626]" />
                                <div className="h-3 w-5/6 animate-pulse rounded bg-[#262626]" />
                                <div className="h-3 w-4/6 animate-pulse rounded bg-[#262626]" />
                                <div className="h-3 w-3/6 animate-pulse rounded bg-[#262626]" />
                            </div>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}
