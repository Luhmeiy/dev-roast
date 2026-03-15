# DevRoast - Code Roasting Platform

A web application that roasts your code — brutally honest or full roast mode.

## Tech Stack

- **Next.js 16** - React framework
- **Tailwind CSS v4** - Styling
- **Biome** - Linting & formatting
- **Radix UI** - Accessible components
- **Shiki** - Server-side syntax highlighting

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── page.tsx     # Homepage
│   ├── layout.tsx   # Root layout with Navbar
│   └── components/  # Components showcase page
├── components/
│   ├── ui/          # Reusable UI components
│   │   ├── button.tsx
│   │   ├── toggle.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── code-block.tsx
│   │   ├── diff-line.tsx
│   │   ├── score-ring.tsx
│   │   └── table-row.tsx
│   ├── code-editor.tsx
│   ├── leaderboard-table.tsx
│   └── navbar.tsx
```

## Scripts

```bash
pnpm dev      # Start dev server
pnpm build    # Production build
pnpm lint     # Run Biome check
pnpm lint:fix # Auto-fix lint issues
pnpm format   # Format code
```

## UI Components

Located in `src/components/ui/`:
- Button - Multiple variants (primary, secondary, outline, ghost, destructive)
- Toggle - Radix-based switch with controlled/uncontrolled modes
- Badge - Status indicators (critical, warning, good)
- Card - Generic card component
- CodeBlock - Server-rendered syntax highlighting with Shiki
- DiffLine - Code diff visualization
- ScoreRing - Circular progress display
- TableRow - Leaderboard row component

## Design Tokens

Defined in `src/app/globals.css` using Tailwind @theme:
- `--color-button-primary`
- `--color-button-text`
- `--color-toggle-on`

---

## Patterns

### 1. tRPC with TanStack React Query + Next.js Server Components

Located in `src/trpc/`:
- `init.ts` - Base tRPC setup with context and procedures
- `router.ts` - AppRouter definition with procedures
- `client.tsx` - Client provider (TRPCReactProvider)
- `server.ts` - Server utilities (trpc, getQueryClient, prefetch)
- `query-client.ts` - QueryClient factory

**API Handler:**
```typescript
// src/app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/trpc/router";
import { createTRPCContext } from "@/trpc/init";

const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        createContext: createTRPCContext,
    });

export { handler as GET, handler as POST };
```

**Server Component Prefetching:**
```typescript
// src/app/page.tsx
import { prefetchMetrics } from "@/trpc/server";

export default async function Home() {
    await prefetchMetrics();
    return <HomeContent />;
}
```

**Client Component Usage:**
```typescript
// src/components/metrics-section.tsx
"use client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export function MetricsSection() {
    const trpc = useTRPC();
    const { data } = useQuery(trpc.metrics.queryOptions());
    // ...
}
```

---

### 2. Code Editor with SSR Handling

**Problem:** react-simple-code-editor causes hydration mismatch (autoCapitalize attribute differs between server/client).

**Solution:** Use dynamic import with `ssr: false`:
```typescript
// src/components/code-editor.tsx
import dynamic from "next/dynamic";

const Editor = dynamic(
    () => import("react-simple-code-editor").then((mod) => mod.default),
    { ssr: false },
);
```

---

### 3. Metrics with NumberFlow Animation

**Pattern:** Start at 0, animate to actual value without skeleton:
```typescript
// src/components/metrics-section.tsx
"use client";
import NumberFlow from "@number-flow/react";

export function MetricsSection() {
    const { data } = useQuery(trpc.metrics.queryOptions());

    return (
        <div className="flex items-center justify-center gap-6 font-mono text-xs text-zinc-500">
            <p>
                <span suppressHydrationWarning>
                    <NumberFlow value={data?.totalRoasts ?? 0} />
                </span>
                <span> codes roasted</span>
            </p>
        </div>
    );
}
```

**Key:** Use `suppressHydrationWarning` on wrapper and provide default value (`?? 0`) so NumberFlow always renders.

---

### 4. SSR Page + Client Component Split

**Structure:**
```
src/app/page.tsx (SSR)
├── Static content (headings, paragraphs)
├── prefetchMetrics()
├── Suspense for client components
└── ClientComponent (interactive)

src/components/client-component.tsx ("use client")
└── Interactive elements (forms, state)
```

**Example:**
```typescript
// src/app/page.tsx - SSR
import { RoastForm } from "@/components/roast-form";

export default async function Home() {
    await prefetchMetrics();
    return (
        <main>
            <h1>$ paste your code...</h1>
            <RoastForm />
        </main>
    );
}

// src/components/roast-form.tsx - Client
"use client";
export function RoastForm() {
    const [code, setCode] = useState("");
    // interactive elements
}
```

---

### 5. Scroll Sync: Line Numbers + Code Editor

Wrap both in a shared scrollable container:
```typescript
<div className="flex max-h-[924px] overflow-y-auto">
    <div className="flex flex-col ...line numbers..." />
    <div className="flex-1">{/* Editor */}</div>
</div>
```

---

### 6. Hydration Warning Fixes

**For dynamic client-only components:**
- Use `suppressHydrationWarning` on wrapper div
- Use dynamic import with `{ ssr: false }`

**For user input fields:**
- Use `suppressHydrationWarning` on components that render differently on server vs client

---

## Specs Directory

Specs are stored in `specs/` and follow this format:

```
# [Feature Name] - Specification

## 1. Research Summary
### 1.1 [Source/Option]
- Key findings and analysis

### 1.2 Alternative Options Researched
| Option | Criteria... |

### 1.3 Recommended Approach

---

## 2. Feature Specification
### 2.1 Core Requirements
### 2.2 User Flow

---

## 3. Implementation Notes
### 3.1 Integration
### 3.2 Key Packages
```bash
npm install ...
```

---

## 4. Open Questions (Answered)
- [x] Question → Answer

---

## 5. Tasks / Todos
- [ ] Task
```

**Conventions:**
- Numbered sections (1, 2, 3...) with subsections (1.1, 1.2)
- Checkboxes: `- [ ]` pending, `- [x]` completed
- Code blocks for commands, tables for comparisons
