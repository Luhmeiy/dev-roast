"use client";

import NumberFlow from "@number-flow/react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function MetricsSection() {
	const trpc = useTRPC();
	const { data } = useQuery(trpc.metrics.queryOptions());

	return (
		<div className="flex items-center justify-center gap-6 font-mono text-xs text-zinc-500">
			<p>
				<span suppressHydrationWarning>
					<NumberFlow value={data?.totalRoasts ?? 0} />
				</span>
				<span> codes roasted</span>
			</p>
			<span>·</span>
			<p>
				<span>avg score: </span>
				<span suppressHydrationWarning>
					<NumberFlow value={data?.avgScore ?? 0} />
				</span>
				<span>/10</span>
			</p>
		</div>
	);
}

