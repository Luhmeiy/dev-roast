"use client";

import Link from "next/link";
import { useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

const leaderboardData = [
    {
        rank: 1,
        score: 1.2,
        scoreStatus: "critical" as const,
        code: [
            'eval(prompt("enter code"))',
            "document.write(response)",
            "// trust the user lol",
        ],
        language: "javascript",
    },
    {
        rank: 2,
        score: 1.8,
        scoreStatus: "critical" as const,
        code: [
            "if (x == true) { return true; }",
            "else if (x == false) { return false; }",
            "else { return !false; }",
        ],
        language: "typescript",
    },
    {
        rank: 3,
        score: 2.1,
        scoreStatus: "critical" as const,
        code: ["SELECT * FROM users WHERE 1=1", "-- TODO: add authentication"],
        language: "sql",
    },
];

export default function Home() {
    const [code, setCode] = useState("");

    return (
        <div className="min-h-screen bg-zinc-950">
            <main className="mx-auto flex max-w-4xl flex-col gap-8 px-10 py-20">
                <section className="flex flex-col gap-3">
                    <h1 className="font-mono text-4xl font-bold text-zinc-50">
                        {"// drop your code below and we'll rate it"}
                        <br />— brutally honest or full roast mode
                    </h1>
                </section>

                <section className="flex flex-col gap-4">
                    <div className="flex h-10 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4">
                        <div className="flex gap-2">
                            <span className="h-3 w-3 rounded-full bg-red-500" />
                            <span className="h-3 w-3 rounded-full bg-amber-500" />
                            <span className="h-3 w-3 rounded-full bg-emerald-500" />
                        </div>
                    </div>
                    <CodeEditor
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        rows={16}
                    />
                </section>

                <section className="flex items-center justify-between">
                    <Toggle defaultChecked>roast mode</Toggle>
                    <Button variant="primary" size="default">
                        $ roast_my_code
                    </Button>
                </section>

                <section className="flex items-center justify-center gap-6 text-sm text-zinc-500">
                    <span>2,847 codes roasted</span>
                    <span>·</span>
                    <span>avg score: 4.2/10</span>
                </section>

                <section className="mt-10 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="font-mono text-lg font-bold text-zinc-50">
                            {
                                "// the worst code on the internet, ranked by shame"
                            }
                        </h2>
                    </div>
                    <LeaderboardTable entries={leaderboardData} />
                    <div className="flex justify-center pt-4">
                        <Link
                            href="/leaderboard"
                            className="font-mono text-sm text-zinc-500 hover:text-zinc-300"
                        >
                            View full leaderboard →
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
