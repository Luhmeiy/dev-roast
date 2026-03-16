"use client";

import NumberFlow from "@number-flow/react";
import Link from "next/link";

interface LeaderboardFooterProps {
    totalCount: number;
}

export function LeaderboardFooter({ totalCount }: LeaderboardFooterProps) {
    return (
        <div className="flex items-center justify-center gap-1.5 pt-4 font-mono text-xs text-zinc-500">
            <span>showing top 3 of</span>
            <span suppressHydrationWarning>
                <NumberFlow value={totalCount ?? 0} />
            </span>
            <span>·</span>
            <Link href="/leaderboard" className=" hover:text-zinc-300">
                view full leaderboard <span>››</span>
            </Link>
        </div>
    );
}
