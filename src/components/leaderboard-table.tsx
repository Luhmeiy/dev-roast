import { forwardRef, type HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

const table = tv({
    base: "w-full border border-zinc-800 bg-zinc-900",
});

const header = tv({
    base: "flex h-10 items-center border-b border-zinc-800 bg-zinc-950 px-5",
});

const headerCell = tv({
    base: "font-mono text-[12px] font-medium text-zinc-500",
    variants: {
        align: {
            left: "text-left",
            center: "text-center",
            right: "text-right",
        },
    },
    defaultVariants: {
        align: "left",
    },
});

const row = tv({
    base: "flex items-center border-b border-zinc-800 px-5 py-4",
});

const rankCell = tv({
    base: "w-[50px] font-mono text-[12px] text-zinc-500",
});

const scoreCell = tv({
    base: "w-[70px] font-mono text-[12px] font-bold",
    variants: {
        score: {
            critical: "text-red-500",
            warning: "text-amber-500",
            good: "text-emerald-500",
        },
    },
});

const codeCell = tv({
    base: "flex-1 font-mono text-[12px] text-zinc-50",
});

const langCell = tv({
    base: "w-[100px] font-mono text-[12px] text-zinc-500 text-right",
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

export const LeaderboardTable = forwardRef<
    HTMLDivElement,
    LeaderboardTableProps
>(({ className, entries, ...props }, ref) => {
    return (
        <div className={table({ className })} ref={ref} {...props}>
            <div className={header()}>
                <span className={headerCell({ align: "left" })}>#</span>
                <span className={headerCell({ align: "left" })}>score</span>
                <span className={headerCell({ align: "left" })}>code</span>
                <span className={headerCell({ align: "right" })}>lang</span>
            </div>
            {entries.map((entry) => (
                <div key={entry.rank} className={row()}>
                    <span className={rankCell()}>{entry.rank}</span>
                    <span className={scoreCell({ score: entry.scoreStatus })}>
                        {entry.score.toFixed(1)}
                    </span>
                    <div className={codeCell()}>
                        {entry.code.map((line, i) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: Code lines are stable
                            <div key={i}>{line}</div>
                        ))}
                    </div>
                    <span className={langCell()}>{entry.language}</span>
                </div>
            ))}
        </div>
    );
});

LeaderboardTable.displayName = "LeaderboardTable";
