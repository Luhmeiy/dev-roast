import { type ButtonHTMLAttributes, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
    base: "inline-flex items-center justify-center gap-2 font-mono text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variants: {
        variant: {
            primary:
                "bg-button-primary text-button-text hover:opacity-90 active:opacity-80",
            secondary:
                "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:bg-zinc-300",
            outline:
                "border border-zinc-300 bg-transparent hover:bg-zinc-100 active:bg-zinc-200",
            ghost: "bg-transparent hover:bg-zinc-100 active:bg-zinc-200",
            destructive:
                "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
        },
        size: {
            default: "py-2.5 px-6",
            sm: "py-2 px-4 text-xs",
            lg: "py-3 px-8 text-base",
            icon: "h-10 w-10",
        },
    },
    defaultVariants: {
        variant: "primary",
        size: "default",
    },
});

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof button> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={button({ variant, size, className })}
                ref={ref}
                {...props}
            />
        );
    },
);

Button.displayName = "Button";
