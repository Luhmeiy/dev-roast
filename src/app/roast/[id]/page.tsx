import NumberFlow from "@number-flow/react";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { db } from "@/db";
import { roasts } from "@/db/schema";

export const metadata: Metadata = {
    title: "Roast Results | DevRoast",
    description: "// your code, roasted to perfection",
};

const LANGUAGE_EXTENSIONS: Record<string, string> = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    rust: "rs",
    go: "go",
    java: "java",
    csharp: "cs",
    cpp: "cpp",
    c: "c",
    ruby: "rb",
    php: "php",
    swift: "swift",
    kotlin: "kt",
    scala: "scala",
    sql: "sql",
    bash: "sh",
    shell: "sh",
    json: "json",
    yaml: "yaml",
    yml: "yaml",
    html: "html",
    css: "css",
    scss: "scss",
    markdown: "md",
    plaintext: "txt",
};

function getFileExtension(language: string): string {
    return LANGUAGE_EXTENSIONS[language] || "txt";
}

async function getRoast(id: number) {
    const [roast] = await db
        .select({
            id: roasts.id,
            code: roasts.code,
            language: roasts.language,
            score: roasts.score,
            scoreStatus: roasts.scoreStatus,
            roastMode: roasts.roastMode,
            verdict: roasts.verdict,
            issues: roasts.issues,
            suggestedFix: roasts.suggestedFix,
        })
        .from(roasts)
        .where(eq(roasts.id, id));

    return roast || null;
}

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

function ScoreRing({ score }: { score: number }) {
    const scoreColor =
        score <= 2 ? "#EF4444" : score <= 4 ? "#F59E0B" : "#10B981";

    const percent = (score / 10) * 100;
    const degrees = (percent / 100) * 360;

    return (
        <div className="relative flex h-[180px] w-[180px] items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-[#1F1F1F]" />
            <div
                className="absolute inset-0 rounded-full border-4"
                style={{
                    borderTopColor: degrees >= 0 ? scoreColor : "transparent",
                    borderRightColor: degrees > 90 ? scoreColor : "transparent",
                    borderBottomColor:
                        degrees > 180 ? scoreColor : "transparent",
                    borderLeftColor:
                        degrees >= 270 ? scoreColor : "transparent",
                    transform: "rotate(-90deg)",
                }}
            />
            <div className="flex flex-col items-center">
                <span
                    className="font-mono text-[48px] font-bold"
                    style={{ color: scoreColor }}
                >
                    <span suppressHydrationWarning>
                        <NumberFlow value={score} />
                    </span>
                </span>
                <span className="font-mono text-base text-[#525252]">/10</span>
            </div>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-[#0C0C0C]">
            <main className="mx-auto flex w-[960px] max-w-full flex-col gap-10 px-20 py-10">
                <section className="flex items-center gap-12">
                    <div className="relative flex h-[180px] w-[180px] items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-[#1F1F1F]" />
                        <div className="flex flex-col items-center">
                            <span className="font-mono text-[48px] font-bold text-[#525252]">
                                <span suppressHydrationWarning>
                                    <NumberFlow value={0} />
                                </span>
                            </span>
                            <span className="font-mono text-base text-[#525252]">
                                /10
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-[#525252]" />
                            <span className="font-mono text-sm text-[#525252]">
                                verdict: analyzing...
                            </span>
                        </div>
                        <div className="h-8 w-3/4 animate-pulse rounded bg-[#262626]" />
                        <div className="flex items-center gap-4">
                            <div className="h-3 w-16 animate-pulse rounded bg-[#262626]" />
                            <div className="h-3 w-12 animate-pulse rounded bg-[#262626]" />
                            <div className="h-3 w-20 animate-pulse rounded bg-[#262626]" />
                        </div>
                    </div>
                </section>

                <div className="h-px w-full bg-[#1F1F1F]" />

                <section className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-16 animate-pulse rounded bg-[#262626]" />
                    </div>
                    <div className="flex flex-col gap-2 rounded border border-[#1F1F1F] bg-[#111111] p-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-3 animate-pulse rounded bg-[#262626]"
                                style={{ width: `${70 - i * 15}%` }}
                            />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default async function RoastResultsPage(props: PageProps) {
    const params = await props.params;
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
        notFound();
    }

    const roast = await getRoast(id);

    if (!roast) {
        notFound();
    }

    const issues = (roast.issues || []) as Array<{
        type: string;
        title: string;
        description: string;
    }>;
    const suggestedFix = (roast.suggestedFix || []) as Array<{
        type: string;
        code: string;
    }>;

    const scoreColor =
        roast.score <= 2 ? "#EF4444" : roast.score <= 4 ? "#F59E0B" : "#10B981";

    const verdictType =
        roast.score <= 2
            ? "needs_serious_help"
            : roast.score <= 4
              ? "needs_work"
              : "not_bad";

    const ext = getFileExtension(roast.language);

    return (
        <div className="min-h-screen bg-[#0C0C0C]">
            <main className="mx-auto flex w-[960px] max-w-full flex-col gap-10 px-20 py-10">
                <section className="flex items-center gap-12">
                    <ScoreRing score={roast.score} />
                    <div className="flex flex-1 flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: scoreColor }}
                            />
                            <span
                                className="font-mono text-sm"
                                style={{ color: scoreColor }}
                            >
                                verdict: {verdictType}
                            </span>
                        </div>
                        <p className="font-mono text-xl text-[#E5E5E5] leading-relaxed">
                            {roast.verdict || "No verdict available."}
                        </p>
                        <div className="flex items-center gap-4">
                            <span className="font-mono text-xs text-[#737373]">
                                lang: {roast.language}
                            </span>
                            <span className="font-mono text-xs text-[#737373]">
                                {"\u00b7"}
                            </span>
                            <span className="font-mono text-xs text-[#737373]">
                                {roast.code.split("\n").length} lines
                            </span>
                            <span className="font-mono text-xs text-[#737373]">
                                {"\u00b7"}
                            </span>
                            <span className="font-mono text-xs text-[#737373]">
                                {roast.roastMode ? "roast mode" : "honest mode"}
                            </span>
                        </div>
                    </div>
                </section>

                <div className="h-px w-full bg-[#1F1F1F]" />

                <section className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-[#10B981]">
                            {"//"}
                        </span>
                        <span className="font-mono text-sm font-bold text-[#E5E5E5]">
                            your_submission
                        </span>
                    </div>
                    <div className="flex overflow-hidden rounded border border-[#1F1F1F] bg-[#111111]">
                        <CodeBlock
                            code={roast.code}
                            language={roast.language}
                        />
                    </div>
                </section>

                {issues.length > 0 && (
                    <>
                        <div className="h-px w-full bg-[#1F1F1F]" />

                        <section className="flex flex-col gap-6">
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-bold text-[#10B981]">
                                    {"//"}
                                </span>
                                <span className="font-mono text-sm font-bold text-[#E5E5E5]">
                                    detailed_analysis
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                {issues.map((issue, i) => (
                                    <div
                                        // biome-ignore lint/suspicious/noArrayIndexKey: static data
                                        key={`issue-${i}`}
                                        className="flex flex-col gap-3 rounded border border-[#1F1F1F] bg-[#0F0F0F] p-5"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`h-2 w-2 rounded-full ${
                                                    issue.type === "error"
                                                        ? "bg-[#EF4444]"
                                                        : "bg-[#10B981]"
                                                }`}
                                            />
                                            <span className="font-mono text-sm text-[#E5E5E5]">
                                                {issue.title}
                                            </span>
                                        </div>
                                        <p className="font-mono text-xs text-[#A3A3A3] leading-relaxed">
                                            {issue.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                )}

                {suggestedFix.length > 0 && (
                    <>
                        <div className="h-px w-full bg-[#1F1F1F]" />

                        <section className="flex flex-col gap-6">
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-bold text-[#10B981]">
                                    {"//"}
                                </span>
                                <span className="font-mono text-sm font-bold text-[#E5E5E5]">
                                    suggested_fix
                                </span>
                            </div>
                            <div className="flex flex-col rounded border border-[#1F1F1F] bg-[#111111]">
                                <div className="flex h-10 items-center justify-between border-b border-[#1F1F1F] px-4">
                                    <span className="font-mono text-xs text-[#A3A3A3]">
                                        your_code.{ext} → improved_code.{ext}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    {suggestedFix.map((line, i) => (
                                        <div
                                            // biome-ignore lint/suspicious/noArrayIndexKey: static data
                                            key={`diff-${i}`}
                                            className={`flex h-7 items-center px-4 font-mono text-xs ${
                                                line.type === "removed"
                                                    ? "bg-[#EF4444]/10 text-[#EF4444]"
                                                    : line.type === "added"
                                                      ? "bg-[#10B981]/10 text-[#10B981]"
                                                      : "text-[#737373]"
                                            }`}
                                        >
                                            <span className="w-5">
                                                {line.type === "context"
                                                    ? "  "
                                                    : line.type === "removed"
                                                      ? "- "
                                                      : "+ "}
                                            </span>
                                            <span>{line.code}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}
