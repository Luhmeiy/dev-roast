import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { getRoastById } from "@/db/roasts";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params;
    const id = parseInt(params.id, 10);

    if (Number.isNaN(id)) {
        return {
            title: "Roast Results | DevRoast",
            description: "// your code, roasted to perfection",
        };
    }

    const roast = await getRoastById(id);

    if (!roast) {
        return {
            title: "Roast Not Found | DevRoast",
            description: "// your code, roasted to perfection",
        };
    }

    const issues = (roast.issues || []) as Array<{ type: string }>;
    const issueCount = issues.filter((i) => i.type === "error").length;
    const warningCount = issues.filter((i) => i.type === "warning").length;
    const lineCount = roast.code.split("\n").length;

    const verdictType =
        roast.score <= 2
            ? "needs_serious_help"
            : roast.score <= 4
              ? "needs_work"
              : "not_bad";

    const description = `Score: ${roast.score}/10 | ${lineCount} lines | ${issueCount} issues | ${warningCount} warnings | verdict: ${verdictType}`;

    return {
        title: `Roast #${roast.id} | DevRoast`,
        description: description,
        openGraph: {
            title: `DevRoast - Score: ${roast.score}/10`,
            description: roast.verdict || "Code roasted to perfection",
            type: "website",
            images: [
                {
                    url: `/api/og/${roast.id}`,
                    width: 1200,
                    height: 630,
                    alt: `Roast result for ${roast.language} code - Score ${roast.score}/10`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `DevRoast - Score: ${roast.score}/10`,
            description: roast.verdict || "Code roasted to perfection",
            images: [`/api/og/${roast.id}`],
        },
    };
}

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

export default async function RoastResultsPage(props: PageProps) {
    const params = await props.params;
    const id = parseInt(params.id, 10);

    if (Number.isNaN(id)) {
        notFound();
    }

    const roast = await getRoastById(id);

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
                            <Badge
                                variant={
                                    roast.score <= 2
                                        ? "critical"
                                        : roast.score <= 4
                                          ? "warning"
                                          : "good"
                                }
                            >
                                verdict: {verdictType}
                            </Badge>
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
                                    <Card
                                        // biome-ignore lint/suspicious/noArrayIndexKey: static data
                                        key={`issue-${i}`}
                                        status={
                                            issue.type === "error"
                                                ? "critical"
                                                : issue.type === "success" ||
                                                    issue.type === "good"
                                                  ? "good"
                                                  : "warning"
                                        }
                                        label={issue.type}
                                        cardTitle={issue.title}
                                        cardDescription={issue.description}
                                    />
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
                                        <DiffLine
                                            // biome-ignore lint/suspicious/noArrayIndexKey: static data
                                            key={`diff-${i}`}
                                            variant={
                                                line.type as
                                                    | "removed"
                                                    | "added"
                                                    | "context"
                                            }
                                            prefixChar={
                                                line.type === "removed"
                                                    ? "-"
                                                    : line.type === "added"
                                                      ? "+"
                                                      : " "
                                            }
                                        >
                                            {line.code}
                                        </DiffLine>
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
