import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const diffLine = tv({
    base: "flex font-mono text-[13px]",
    variants: {
        variant: {
            removed: "bg-red-950/50",
            added: "bg-emerald-950/50",
            context: "",
        },
    },
});

const prefix = tv({
    base: "w-4 flex-shrink-0",
    variants: {
        variant: {
            removed: "text-red-500",
            added: "text-emerald-500",
            context: "text-zinc-500",
        },
    },
});

const code = tv({
    base: "flex-1",
    variants: {
        variant: {
            removed: "text-zinc-500",
            added: "text-zinc-50",
            context: "text-zinc-500",
        },
    },
});

export interface DiffLineProps
    extends HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof diffLine> {
    prefixChar?: "+" | "-" | " ";
}

export const DiffLine = forwardRef<HTMLDivElement, DiffLineProps>(
    (
        {
            className,
            variant = "context",
            prefixChar = " ",
            children,
            ...props
        },
        ref,
    ) => {
        return (
            <div
                className={diffLine({ variant, className })}
                ref={ref}
                {...props}
            >
                <span className={prefix({ variant })}>{prefixChar}</span>
                <span className={code({ variant })}>{children}</span>
            </div>
        );
    },
);

DiffLine.displayName = "DiffLine";
