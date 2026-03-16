import NumberFlow from "@number-flow/react";
import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/ui/code-block";
import { caller } from "@/trpc/server";

export const metadata: Metadata = {
    title: "Shame Leaderboard | DevRoast",
    description: "// the most roasted code on the internet",
};

export const revalidate = 3600;

const PAGE_SIZE = 20;

interface PageProps {
    params: Promise<{
        slug?: string[];
    }>;
}

export default async function LeaderboardPage(props: PageProps) {
    const params = await props.params;
    const page = params.slug?.[0] ? parseInt(params.slug[0], 10) : 1;
    const offset = (page - 1) * PAGE_SIZE;

    const [leaderboardData, metricsData] = await Promise.all([
        caller.leaderboard({ limit: PAGE_SIZE, offset }),
        caller.metrics(),
    ]);

    const { entries, totalCount } = leaderboardData;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);
    const currentPage = page;
    const showingFrom = offset + 1;
    const showingTo = Math.min(offset + PAGE_SIZE, totalCount);

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
                        <span className="font-mono text-xs text-[#737373]">
                            <span suppressHydrationWarning>
                                <NumberFlow value={totalCount} />
                            </span>{" "}
                            submissions
                        </span>
                        <span className="font-mono text-xs text-[#737373]">
                            {"\u00b7"}
                        </span>
                        <span className="font-mono text-xs text-[#737373]">
                            avg score:{" "}
                            <span suppressHydrationWarning>
                                <NumberFlow value={metricsData.avgScore} />
                            </span>
                            /10
                        </span>
                    </div>
                </section>

                <section className="flex flex-col gap-5">
                    {entries.map((entry) => (
                        <div
                            key={entry.rank}
                            className="flex flex-col border border-[#1F1F1F] bg-[#0F0F0F]"
                        >
                            <div className="flex h-12 items-center justify-between border-b border-[#1F1F1F] px-5">
                                <div className="flex items-center gap-4">
                                    <span className="font-mono text-xs text-[#737373]">
                                        #{entry.rank}
                                    </span>
                                    <span
                                        className={`font-mono text-xs ${
                                            entry.score <= 2
                                                ? "text-red-500"
                                                : entry.score <= 4
                                                  ? "text-amber-500"
                                                  : "text-emerald-500"
                                        }`}
                                    >
                                        {entry.score.toFixed(1)}/10
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-xs text-[#A3A3A3]">
                                        {entry.language}
                                    </span>
                                    <span className="font-mono text-xs text-[#525252]">
                                        {entry.lineCount} lines
                                    </span>
                                </div>
                            </div>
                            <div className="flex overflow-hidden border border-[#1F1F1F] bg-[#111111]">
                                <CodeBlock
                                    code={entry.code}
                                    language={entry.language}
                                    showLineNumbers
                                />
                            </div>
                        </div>
                    ))}
                </section>

                <section className="flex flex-col items-center gap-4 pt-4">
                    <span className="font-mono text-xs text-[#737373]">
                        showing {showingFrom}-{showingTo} of{" "}
                        <span suppressHydrationWarning>
                            <NumberFlow value={totalCount} />
                        </span>
                    </span>
                    <div className="flex items-center gap-4">
                        {currentPage > 1 ? (
                            <Link
                                href={`/leaderboard/${currentPage - 1}`}
                                className="font-mono text-xs text-[#525252] hover:text-[#A3A3A3]"
                            >
                                {"<"} previous
                            </Link>
                        ) : (
                            <span className="font-mono text-xs text-[#333333] cursor-not-allowed">
                                {"<"} previous
                            </span>
                        )}
                        <span className="font-mono text-xs text-[#737373]">
                            page {currentPage} of {totalPages}
                        </span>
                        {currentPage < totalPages ? (
                            <Link
                                href={`/leaderboard/${currentPage + 1}`}
                                className="font-mono text-xs text-[#525252] hover:text-[#A3A3A3]"
                            >
                                next {">"}
                            </Link>
                        ) : (
                            <span className="font-mono text-xs text-[#333333] cursor-not-allowed">
                                next {">"}
                            </span>
                        )}
                    </div>
                </section>

                <section className="flex items-center justify-center pt-4">
                    <Link
                        href="/"
                        className="font-mono text-xs text-[#525252] hover:text-[#A3A3A3]"
                    >
                        {"<"} back to roaster
                    </Link>
                </section>
            </main>
        </div>
    );
}
