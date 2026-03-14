import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const badge = tv({
    base: "inline-flex items-center gap-2 font-mono text-[12px]",
    variants: {
        variant: {
            critical: "text-red-500",
            warning: "text-amber-500",
            good: "text-emerald-500",
            verdict: "text-red-500",
        },
    },
});

const dot = tv({
    base: "rounded-full",
    variants: {
        variant: {
            critical: "bg-red-500",
            warning: "bg-amber-500",
            good: "bg-emerald-500",
            verdict: "bg-red-500",
        },
    },
});

export interface BadgeProps
    extends HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badge> {}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = "good", children, ...props }, ref) => {
        return (
            <div className={badge({ variant, className })} ref={ref} {...props}>
                <span
                    className={dot({ variant })}
                    style={{ width: 8, height: 8 }}
                />
                {children}
            </div>
        );
    },
);

Badge.displayName = "Badge";
