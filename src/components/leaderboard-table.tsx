import { forwardRef, type HTMLAttributes } from "react";
import { tv } from "tailwind-variants";
import { highlightCode } from "@/utils/highlight";

const table = tv({
    base: "w-full border border-zinc-800 bg-zinc-900",
});

const header = tv({
    base: "flex h-10 items-center border-b border-zinc-800 bg-zinc-950",
});

const headerCell = tv({
    base: "font-mono text-xs font-medium text-zinc-500",
});

const headerCellWrapper = tv({
    base: "flex items-center",
    variants: {
        position: {
            rank: "w-[50px]",
            score: "w-[70px]",
            code: "flex-1 pl-5",
            lang: "w-[100px] text-right",
        },
    },
});

const row = tv({
    base: "flex items-center border-b border-zinc-800",
    variants: {
        padding: {
            normal: "px-5 py-4",
        },
    },
});

const rankCell = tv({
    base: "w-[50px] font-mono text-xs",
    variants: {
        rank: {
            1: "text-red-500",
            2: "text-red-400",
            3: "text-amber-500",
        },
    },
});

const scoreCell = tv({
    base: "w-[70px] font-mono text-xs font-bold",
    variants: {
        score: {
            critical: "text-red-500",
            warning: "text-amber-500",
            good: "text-emerald-500",
        },
    },
});

const codeCell = tv({
    base: "flex-1 font-mono text-xs pl-5",
});

const langCell = tv({
    base: "w-[100px] font-mono text-xs text-zinc-500 text-right",
});

export interface LeaderboardEntry {
    rank: number;
    score: number;
    scoreStatus?: "critical" | "warning" | "good";
    code: string[];
    language: string;
}

export interface LeaderboardTableProps extends HTMLAttributes<HTMLDivElement> {
    entries: LeaderboardEntry[];
}

async function HighlightedLine({
    code,
    language,
}: {
    code: string;
    language: string;
}) {
    const highlighted = await highlightCode(code, language);
    return (
        <div
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki provides safe HTML
            dangerouslySetInnerHTML={{ __html: highlighted }}
        />
    );
}

export const LeaderboardTable = forwardRef<
    HTMLDivElement,
    LeaderboardTableProps
>(({ className, entries, ...props }, ref) => {
    return (
        <div className={table({ className })} ref={ref} {...props}>
            <div className={header()}>
                <span className={headerCellWrapper({ position: "rank" })}>
                    <span className={headerCell()}>#</span>
                </span>
                <span className={headerCellWrapper({ position: "score" })}>
                    <span className={headerCell()}>score</span>
                </span>
                <span className={headerCellWrapper({ position: "code" })}>
                    <span className={headerCell()}>code</span>
                </span>
                <span className={headerCellWrapper({ position: "lang" })}>
                    <span className={headerCell()}>lang</span>
                </span>
            </div>
            {entries.map((entry) => (
                <div key={entry.rank} className={row()}>
                    <span
                        className={rankCell({ rank: entry.rank as 1 | 2 | 3 })}
                    >
                        {entry.rank}
                    </span>
                    <span className={scoreCell({ score: entry.scoreStatus })}>
                        {entry.score.toFixed(1)}
                    </span>
                    <div className={codeCell()}>
                        {entry.code.map((line, i) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: Code lines are stable
                            <HighlightedLine
                                key={i}
                                code={line}
                                language={entry.language}
                            />
                        ))}
                    </div>
                    <span className={langCell()}>{entry.language}</span>
                </div>
            ))}
        </div>
    );
});

LeaderboardTable.displayName = "LeaderboardTable";
