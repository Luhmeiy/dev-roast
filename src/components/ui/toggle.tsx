"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { type ButtonHTMLAttributes, forwardRef, useId, useState } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const toggle = tv({
    base: "inline-flex items-center gap-3 font-mono text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-50",
    variants: {
        checked: {
            true: "text-toggle-on",
            false: "text-zinc-500",
        },
    },
});

const track = tv({
    base: "relative h-[22px] w-[40px] rounded-full transition-colors cursor-pointer",
    variants: {
        checked: {
            true: "bg-toggle-on",
            false: "bg-zinc-700",
        },
    },
});

const thumb = tv({
    base: "block h-[18px] w-[18px] rounded-full bg-white transition-transform duration-100",
    variants: {
        checked: {
            true: "translate-x-[18px]",
            false: "translate-x-[2px]",
        },
    },
});

export interface ToggleProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof toggle> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    defaultChecked?: boolean;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
    (
        {
            className,
            checked: controlledChecked,
            onCheckedChange,
            defaultChecked = false,
            children,
            ...props
        },
        ref,
    ) => {
        const [uncontrolledChecked, setUncontrolledChecked] =
            useState(defaultChecked);
        const id = useId();

        const isControlled = controlledChecked !== undefined;
        const isChecked = isControlled
            ? controlledChecked
            : uncontrolledChecked;

        const handleCheckedChange = (checked: boolean) => {
            if (!isControlled) {
                setUncontrolledChecked(checked);
            }
            onCheckedChange?.(checked);
        };

        return (
            <div className={toggle({ checked: isChecked, className })}>
                <SwitchPrimitive.Root
                    id={id}
                    className={track({ checked: isChecked })}
                    checked={isChecked}
                    onCheckedChange={handleCheckedChange}
                    ref={ref}
                    {...props}
                >
                    <SwitchPrimitive.Thumb
                        className={thumb({ checked: isChecked })}
                    />
                </SwitchPrimitive.Root>
                <label htmlFor={id} className="cursor-pointer">
                    {children}
                </label>
            </div>
        );
    },
);

Toggle.displayName = "Toggle";
