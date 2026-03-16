import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const card = tv({
    base: "rounded-none border border-zinc-800 bg-zinc-900 p-5",
    variants: {
        variant: {
            default: "",
            analysis: "",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

const header = tv({
    base: "inline-flex items-center gap-2 font-mono text-xs",
});

const dot = tv({
    base: "rounded-full",
    variants: {
        status: {
            critical: "bg-red-500",
            warning: "bg-amber-500",
            good: "bg-emerald-500",
        },
    },
});

const title = tv({
    base: "font-mono text-[13px] text-zinc-50",
});

const description = tv({
    base: "font-sans text-xs text-zinc-500 leading-relaxed w-full",
});

export interface CardProps
    extends HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof card> {
    status?: "critical" | "warning" | "good";
    label?: string;
    cardTitle?: string;
    cardDescription?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            className,
            variant,
            status,
            label,
            cardTitle,
            cardDescription,
            children,
            ...props
        },
        ref,
    ) => {
        return (
            <div className={card({ variant, className })} ref={ref} {...props}>
                {label && (
                    <div className={header()}>
                        {status && (
                            <span
                                className={dot({ status })}
                                style={{ width: 8, height: 8 }}
                            />
                        )}
                        <span
                            style={{
                                color:
                                    status === "critical"
                                        ? "#EF4444"
                                        : status === "warning"
                                          ? "#F59E0B"
                                          : status === "good"
                                            ? "#10B981"
                                            : undefined,
                            }}
                        >
                            {label}
                        </span>
                    </div>
                )}
                {cardTitle && <p className={title()}>{cardTitle}</p>}
                {cardDescription && (
                    <p className={description()}>{cardDescription}</p>
                )}
                {children}
            </div>
        );
    },
);

Card.displayName = "Card";
