import { forwardRef, type HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

const tableRow = tv({
	base: "flex items-center py-4 px-5 border-b border-zinc-800",
});

const rank = tv({
	base: "w-10 font-mono text-[13px] text-zinc-500",
});

const score = tv({
	base: "w-[60px] font-mono text-[13px] font-bold",
	variants: {
		score: {
			critical: "text-red-500",
			warning: "text-amber-500",
			good: "text-emerald-500",
		},
	},
});

const codePreview = tv({
	base: "flex-1 font-mono text-xs text-zinc-500 truncate",
});

const lang = tv({
	base: "w-[100px] font-mono text-xs text-zinc-500 text-right",
});

export interface TableRowProps extends HTMLAttributes<HTMLDivElement> {
	rank: string | number;
	score: string | number;
	scoreStatus?: "critical" | "warning" | "good";
	codePreview: string;
	language: string;
}

export const TableRow = forwardRef<HTMLDivElement, TableRowProps>(
	(
		{
			className,
			rank: rankValue,
			score: scoreValue,
			scoreStatus,
			codePreview: code,
			language,
			...props
		},
		ref,
	) => {
		return (
			<div className={tableRow({ className })} ref={ref} {...props}>
				<span className={rank()}>#{rankValue}</span>
				<span className={score({ score: scoreStatus })}>
					{scoreValue}
				</span>
				<span className={codePreview()}>{code}</span>
				<span className={lang()}>{language}</span>
			</div>
		);
	},
);

TableRow.displayName = "TableRow";

