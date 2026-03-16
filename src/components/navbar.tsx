import Link from "next/link";

export function Navbar() {
    return (
        <nav className="flex items-center h-14 px-6 border-b border-zinc-800 bg-zinc-950 font-mono">
            <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-bold text-emerald-500">&gt;</span>
                <span className="text-lg text-zinc-50">devroast</span>
            </Link>
            <div className="flex-1" />
            <Link
                href="/leaderboard"
                className="text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
                leaderboard
            </Link>
        </nav>
    );
}
