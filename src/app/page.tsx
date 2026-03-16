import Link from "next/link";
import { Suspense } from "react";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { MetricsSection } from "@/components/metrics-section";
import { RoastForm } from "@/components/roast-form";
import { caller, prefetchMetrics } from "@/trpc/server";

function MetricsFallback() {
    return (
        <div className="flex items-center justify-center gap-6 text-xs text-zinc-500">
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />
            <span>·</span>
            <div className="h-4 w-20 animate-pulse rounded bg-zinc-800" />
        </div>
    );
}

function LeaderboardFallback() {
    return (
        <div className="w-full border border-zinc-800 bg-zinc-900">
            <div className="flex h-10 items-center border-b border-zinc-800 bg-zinc-950 px-5">
                <span className="font-mono text-xs font-medium text-zinc-500 text-left">
                    #
                </span>
                <span className="font-mono text-xs font-medium text-zinc-500 text-left ml-5">
                    score
                </span>
                <span className="font-mono text-xs font-medium text-zinc-500 text-left ml-5">
                    code
                </span>
                <span className="font-mono text-xs font-medium text-zinc-500 text-right ml-auto">
                    lang
                </span>
            </div>
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="flex items-center border-b border-zinc-800 px-5 py-4"
                >
                    <span className="w-[50px] font-mono text-xs text-zinc-500">
                        {i}
                    </span>
                    <span className="w-[70px] font-mono text-xs text-zinc-500 ml-5">
                        <div className="h-3 w-8 animate-pulse rounded bg-zinc-800" />
                    </span>
                    <div className="flex-1 font-mono text-xs ml-5">
                        <div className="h-3 w-3/4 animate-pulse rounded bg-zinc-800 mb-2" />
                        <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-800" />
                    </div>
                    <span className="w-[100px] font-mono text-xs text-zinc-500 text-right">
                        <div className="h-3 w-12 animate-pulse rounded bg-zinc-800 ml-auto" />
                    </span>
                </div>
            ))}
        </div>
    );
}

export default async function Home() {
    await prefetchMetrics();
    const leaderboardData = await caller.leaderboard();

    return (
        <div className="min-h-screen bg-zinc-950">
            <main className="mx-auto flex w-[780px] max-w-full flex-col gap-8 px-10 py-20">
                <section className="flex flex-col gap-3">
                    <h1 className="font-mono text-[36px] font-bold text-zinc-50">
                        <span className="text-emerald-500">$</span> paste your
                        code. get roasted.
                    </h1>
                    <p className="font-mono text-sm text-zinc-500">
                        {
                            "// drop your code below and we'll rate it — brutally honest or full roast mode"
                        }
                    </p>
                </section>

                <RoastForm />

                <section className="flex items-center justify-center gap-6 text-xs text-zinc-500">
                    <Suspense fallback={<MetricsFallback />}>
                        <MetricsSection />
                    </Suspense>
                </section>

                <section className="mt-10 flex w-[960px] max-w-full flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-emerald-500">
                                //
                            </span>
                            <span className="font-mono text-sm font-bold text-zinc-50">
                                shame_leaderboard
                            </span>
                        </div>
                        <Link
                            href="/leaderboard"
                            className="font-mono flex items-center gap-1 border border-zinc-800 px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300"
                        >
                            $ view_all <span>›</span>
                        </Link>
                    </div>
                    <p className="font-mono text-sm text-zinc-500">
                        {"// the worst code on the internet, ranked by shame"}
                    </p>
                    <LeaderboardTable entries={leaderboardData} />
                    <div className="flex justify-center pt-4">
                        <Link
                            href="/leaderboard"
                            className="font-mono text-xs text-zinc-500 hover:text-zinc-300"
                        >
                            showing top 3 of 2,847 · view full leaderboard{" "}
                            <span>››</span>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
