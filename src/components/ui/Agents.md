# UI Component Guidelines

This document outlines the patterns for creating UI components in this project.

## Tech Stack

- **TailwindCSS v4** - Styling
- **tailwind-variants** - Component variants and class merging
- **TypeScript** - Type safety
- **React 19** - Component API

## Component Structure

All UI components live in `src/components/ui/`.

### File Naming

- Use **kebab-case** for file names: `button.tsx`, `input.tsx`, `card.tsx`
- Use **PascalCase** for component names: `Button`, `Input`, `Card`
- Use **named exports** only (never default exports)

### Component Template

```tsx
import { type HTMLAttributes, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const componentName = tv({
    base: "base classes shared by all variants",
    variants: {
        variant: {
            primary: "classes for primary variant",
            secondary: "classes for secondary variant",
            outline: "classes for outline variant",
        },
        size: {
            sm: "classes for small size",
            md: "classes for medium size",
            lg: "classes for large size",
        },
    },
    defaultVariants: {
        variant: "primary",
        size: "md",
    },
});

export interface ComponentNameProps
    extends HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof componentName> {}

export const ComponentName = forwardRef<
    HTMLDivElement,
    ComponentNameProps
>(({ className, variant, size, ...props }, ref) => {
    return (
        <div
            className={componentName({ variant, size, className })}
            ref={ref}
            {...props}
        />
    );
});

ComponentName.displayName = "ComponentName";
```

## Using tailwind-variants

### Key Points

1. **Pass `className` directly to `tv()`** - tailwind-variants handles merging automatically
2. **Don't use `twMerge`** - It's unnecessary when using tailwind-variants
3. **Don't use `clsx`** - Not needed, tailwind-variants handles conditional classes via variants

### Defining Variants

```ts
const button = tv({
    base: "inline-flex items-center justify-center font-medium transition-colors",
    variants: {
        variant: {
            primary: "bg-green-500 text-white hover:bg-green-600",
            secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
            outline: "border border-zinc-300 bg-transparent hover:bg-zinc-100",
        },
        size: {
            sm: "px-3 py-1 text-sm",
            md: "px-4 py-2 text-base",
            lg: "px-6 py-3 text-lg",
        },
        disabled: {
            true: "opacity-50 pointer-events-none",
        },
    },
    defaultVariants: {
        variant: "primary",
        size: "md",
    },
});
```

### Using Variants

```tsx
// All three approaches work:
<Button variant="primary" size="md" />
<Button variant="primary" />
<Button /> // uses defaults
```

## Extending Native HTML Attributes

Extend the appropriate HTML attribute interface:

- `div` → `HTMLAttributes<HTMLDivElement>`
- `button` → `ButtonHTMLAttributes<HTMLButtonElement>`
- `input` → `InputHTMLAttributes<HTMLInputElement>`
- `img` → `ImgHTMLAttributes<HTMLImageElement>`
- `a` → `AnchorHTMLAttributes<HTMLAnchorElement>`

## CSS Variables (Tailwind @theme)

Define design tokens in `src/app/globals.css` using `@theme` (Tailwind v4):

```css
@theme {
    --color-button-primary: #10B981;
    --color-button-text: #0A0A0A;
    --color-brand: #3B82F6;
}
```

Use them in components as Tailwind utility classes:

```ts
const button = tv({
    variants: {
        variant: {
            primary: "bg-button-primary text-button-text",
        },
    },
});
```

The variable name becomes the utility class:
- `--color-button-primary` → `bg-button-primary`
- `--color-button-text` → `text-button-text`
- `--color-toggle-on` → `bg-toggle-on`, `text-toggle-on`

## Forwarding Refs

Always use `forwardRef` for components that need to accept refs:

```tsx
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
```

## Linting

Run linting before committing:

```bash
pnpm lint      # Check for issues
pnpm lint:fix  # Auto-fix issues
pnpm format    # Format code
```

## Adding New Components

1. Create file in `src/components/ui/component-name.tsx`
2. Follow the component template above
3. Add CSS variables to `globals.css` if needed
4. Add component to the example page at `src/app/components/page.tsx`
5. Run `pnpm lint:fix` to ensure code quality

## Tailwind Important Syntax

When overriding styles from external HTML (like Shiki syntax highlighting), use the `!` suffix correctly:

```tsx
// WRONG - using ! after the property value
className="[&_pre]:!bg-transparent"

// CORRECT - using ! at the end before the semicolon equivalent
className="[&_pre]:bg-transparent!"
```

The pattern is `[&_selector]:property-value!` - the exclamation mark goes at the end of the entire class, not in the middle.

## Server Components

Some components (like CodeBlock using Shiki) are async server components. When using them in a client component page:

```tsx
import dynamic from "next/dynamic";

const CodeBlock = dynamic(
    () => import("@/components/ui/code-block").then((mod) => mod.CodeBlock),
    { ssr: false },
);
```

This prevents the "async Client Component" error.
