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
            <main className="mx-auto flex w-[780px] max-w-full flex-col gap-8 px-10 py-20">
                <section className="flex flex-col gap-3">
                    <h1 className="font-mono text-[36px] font-bold text-zinc-50">
                        $ paste your code. get roasted.
                    </h1>
                    <p className="text-sm text-zinc-500">
                        {
                            "// drop your code below and we'll rate it — brutally honest or full roast mode"
                        }
                    </p>
                </section>

                <section className="flex w-[780px] max-w-full flex-col">
                    <CodeEditor value={code} onChange={setCode} />
                </section>

                <section className="flex w-[780px] max-w-full items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Toggle defaultChecked>roast mode</Toggle>
                        <span className="text-xs text-zinc-500">
                            {"// maximum sarcasm enabled"}
                        </span>
                    </div>
                    <Button variant="primary" size="default">
                        $ roast_my_code
                    </Button>
                </section>

                <section className="flex items-center justify-center gap-6 text-xs text-zinc-500">
                    <span>2,847 codes roasted</span>
                    <span>·</span>
                    <span>avg score: 4.2/10</span>
                </section>

                <section className="mt-10 flex w-[960px] max-w-full flex-col gap-6">
                    <p className="text-sm font-bold text-zinc-50">
                        {"// the worst code on the internet, ranked by shame"}
                    </p>
                    <LeaderboardTable entries={leaderboardData} />
                    <div className="flex justify-center pt-4">
                        <Link
                            href="/leaderboard"
                            className="text-xs text-zinc-500 hover:text-zinc-300"
                        >
                            showing top 3 of 2,847 · view full leaderboard
                            &gt;&gt;
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
