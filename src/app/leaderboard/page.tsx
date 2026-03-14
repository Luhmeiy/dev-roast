import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/ui/code-block";

export const metadata: Metadata = {
    title: "Shame Leaderboard | DevRoast",
    description: "// the most roasted code on the internet",
};

const leaderboardData = [
    {
        rank: 1,
        score: 1.2,
        code: 'eval(prompt("enter code"))\ndocument.write(response)\n// trust the user lol',
        language: "javascript",
    },
    {
        rank: 2,
        score: 1.8,
        code: "if (x == true) { return true; }\nelse if (x == false) { return false; }\nelse { return !false; }",
        language: "typescript",
    },
    {
        rank: 3,
        score: 2.1,
        code: "SELECT * FROM users WHERE 1=1\n-- TODO: add authentication",
        language: "sql",
    },
    {
        rank: 4,
        score: 2.5,
        code: "catch (e) {\n// ignore\n}",
        language: "javascript",
    },
    {
        rank: 5,
        score: 2.8,
        code: "const sleep = (ms) =>\n  new Date(Date.now() + ms)\n  while(new Date() < end) {}",
        language: "javascript",
    },
];

export default function LeaderboardPage() {
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
                            2,847 submissions
                        </span>
                        <span className="font-mono text-xs text-[#737373]">
                            {"\u00b7"}
                        </span>
                        <span className="font-mono text-xs text-[#737373]">
                            avg score: 4.2/10
                        </span>
                    </div>
                </section>

                <section className="flex flex-col gap-5">
                    {leaderboardData.map((entry) => (
                        <div
                            key={entry.rank}
                            className="flex flex-col border border-[#1F1F1F] bg-[#0F0F0F]"
                        >
                            <div className="flex h-12 items-center justify-between border-b border-[#1F1F1F] px-5">
                                <div className="flex items-center gap-4">
                                    <span className="font-mono text-xs font-bold text-[#737373]">
                                        #{entry.rank}
                                    </span>
                                    <span
                                        className={`font-mono text-xs font-bold ${
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
                                        {entry.code.split("\n").length} lines
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
