import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/ui/code-block";

export const metadata: Metadata = {
    title: "Roast Results | DevRoast",
    description: "// your code, roasted to perfection",
};

const staticCode = `var total = 0;
for (var i = 0; i < items.length; i++) {
  total = total + items[i].price;
}
return total;`;

const staticIssues = [
    {
        type: "error" as const,
        title: "using var instead of const/let",
        description:
            "var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
    },
    {
        type: "error" as const,
        title: "imperative loop pattern",
        description:
            "for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations.",
    },
    {
        type: "success" as const,
        title: "clear naming conventions",
        description:
            "calculateTotal and items are descriptive, self-documenting names that communicate intent without comments.",
    },
    {
        type: "success" as const,
        title: "single responsibility",
        description:
            "the function does one thing well — calculates a total. no side effects, no mixed concerns, no hidden complexity.",
    },
];

const diffLines = [
    { type: "context" as const, code: "function calculateTotal(items) {" },
    { type: "removed" as const, code: "  var total = 0;" },
    {
        type: "removed" as const,
        code: "  for (var i = 0; i < items.length; i++) {",
    },
    { type: "removed" as const, code: "    total = total + items[i].price;" },
    { type: "removed" as const, code: "  }" },
    { type: "removed" as const, code: "  return total;" },
    {
        type: "added" as const,
        code: "  return items.reduce((sum, item) => sum + item.price, 0);",
    },
    { type: "context" as const, code: "}" },
];

export default function RoastResultsPage() {
    return (
        <div className="min-h-screen bg-[#0C0C0C]">
            <nav className="flex h-14 items-center justify-between border-b border-[#1F1F1F] bg-[#0C0C0C] px-10">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-xl font-bold text-[#10B981]">
                        {">"}
                    </span>
                    <span className="font-mono text-lg font-medium text-[#E5E5E5]">
                        devroast
                    </span>
                </div>
                <Link
                    href="/leaderboard"
                    className="font-mono text-sm text-[#A3A3A3] hover:text-[#E5E5E5]"
                >
                    leaderboard
                </Link>
            </nav>

            <main className="mx-auto flex w-[960px] max-w-full flex-col gap-10 px-20 py-10">
                <section className="flex items-center gap-12">
                    <div className="relative flex h-[180px] w-[180px] items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-[#1F1F1F]" />
                        <div
                            className="absolute inset-0 rounded-full border-4"
                            style={{
                                borderTopColor: "#10B981",
                                borderRightColor: "#10B981",
                                borderBottomColor: "#F97316",
                                borderLeftColor: "#EF4444",
                            }}
                        />
                        <div className="flex flex-col items-center">
                            <span className="font-mono text-[48px] font-bold text-[#F59E0B]">
                                3.5
                            </span>
                            <span className="font-mono text-base text-[#525252]">
                                /10
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-[#EF4444]" />
                            <span className="font-mono text-sm font-medium text-[#EF4444]">
                                verdict: needs_serious_help
                            </span>
                        </div>
                        <p className="font-mono text-xl text-[#E5E5E5] leading-relaxed">
                            {
                                '"this code looks like it was written during a power outage... in 2005."'
                            }
                        </p>
                        <div className="flex items-center gap-4">
                            <span className="font-mono text-xs text-[#737373]">
                                lang: javascript
                            </span>
                            <span className="font-mono text-xs text-[#737373]">
                                {"\u00b7"}
                            </span>
                            <span className="font-mono text-xs text-[#737373]">
                                7 lines
                            </span>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                className="flex items-center gap-1.5 rounded border border-[#1F1F1F] px-4 py-2 font-mono text-xs text-[#E5E5E5] hover:bg-[#1F1F1F]"
                            >
                                <span>$</span>
                                <span>share_roast</span>
                            </button>
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
                        <CodeBlock code={staticCode} language="javascript" />
                    </div>
                </section>

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
                        {staticIssues.map((issue, i) => (
                            <div
                                // biome-ignore lint/suspicious/noArrayIndexKey: static data from design
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
                                    <span className="font-mono text-sm font-medium text-[#E5E5E5]">
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
                                your_code.ts → improved_code.ts
                            </span>
                        </div>
                        <div className="flex flex-col">
                            {diffLines.map((line, i) => (
                                <div
                                    // biome-ignore lint/suspicious/noArrayIndexKey: static data from design
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
            </main>
        </div>
    );
}
