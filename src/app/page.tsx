import NumberFlow from "@number-flow/react";
import Link from "next/link";
import { LeaderboardFooter } from "@/components/leaderboard-footer";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { RoastForm } from "@/components/roast-form";
import { caller } from "@/trpc/server";

export const revalidate = 3600;

export default async function Home() {
    const leaderboardData = await caller.leaderboard({ limit: 3 });
    const metricsData = await caller.metrics();

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

                <section className="flex items-center justify-center gap-6 font-mono text-xs text-zinc-500">
                    <p>
                        <span suppressHydrationWarning>
                            <NumberFlow value={metricsData.totalRoasts} />
                        </span>
                        <span> codes roasted</span>
                    </p>
                    <span>·</span>
                    <p>
                        <span>avg score: </span>
                        <span suppressHydrationWarning>
                            <NumberFlow value={metricsData.avgScore} />
                        </span>
                        <span>/10</span>
                    </p>
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
                            $ view_all <span>››</span>
                        </Link>
                    </div>
                    <p className="font-mono text-sm text-zinc-500">
                        {"// the worst code on the internet, ranked by shame"}
                    </p>
                    <LeaderboardTable
                        entries={leaderboardData.entries.map((e) => ({
                            ...e,
                            code: e.code.split("\n").slice(0, 3),
                        }))}
                    />
                    <LeaderboardFooter totalCount={metricsData.totalRoasts} />
                </section>
            </main>
        </div>
    );
}
