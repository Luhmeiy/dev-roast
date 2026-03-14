# tRPC Integration - Specification

## 1. Research Summary

### 1.1 Official tRPC Docs Analysis

Key findings from tRPC documentation:

- **Framework**: tRPC v11 with TanStack React Query integration
- **Server Components**: First-class support via `createTRPCOptionsProxy`
- **Data Fetching**: Two approaches - prefetch (streaming) or fetchQuery (blocking)
- **Providers**: `TRPCProvider` + `QueryClientProvider` wrapping the app
- **Package**: `@trpc/tanstack-react-query` provides the core integration

### 1.2 Alternative Approaches Researched

| Approach | SSR Support | Server Components | Complexity |
|----------|--------------|-------------------|------------|
| **TanStack React Query (Recommended)** | Yes | Yes, via prefetch | Medium |
| Classic React Query integration | Yes | Limited | Low |
| Vanilla tRPC client | No | No | Lowest |

### 1.3 Recommended Approach

**Recommended: TanStack React Query integration with Next.js App Router**

Reasons:
1. **Full SSR/Server Component support** - Prefetch queries in RSC, hydrate to client
2. **Streaming support** - Initiate queries early, stream data as available
3. **Type safety end-to-end** - Full type inference from router to client
4. **Official recommendation** - tRPC recommends this over classic React Query

---

## 2. Feature Specification

### 2.1 Core Requirements

1. **API Route Handler** - Create `/api/trpc/[trpc]` route using fetch adapter
2. **Client Provider** - Wrap app with `TRPCReactProvider` in layout
3. **Server Utilities** - Export `trpc`, `getQueryClient`, `HydrateClient` for RSC
4. **Query Options** - Use `queryOptions()` helper for type-safe queries

### 2.2 Architecture

```
src/
├── trpc/
│   ├── init.ts          # initTRPC, context, base router/procedure
│   ├── router.ts        # AppRouter definition
│   ├── client.tsx       # Client components provider + hooks
│   ├── server.tsx       # Server components utilities + prefetch
│   └── query-client.ts # QueryClient factory
├── app/api/trpc/[trpc]/route.ts  # API handler
└── app/layout.tsx       # Wrap with TRPCReactProvider
```

### 2.3 Data Flow

**Server Components (RSC):**
```
Server Component → prefetchQuery() → HydrationBoundary → Client
```

**Client Components:**
```
useTRPC() → useQuery() → React Query cache → UI
```

### 2.4 User Flow

```
Server Request → prefetch queries → Stream HTML + dehydrated state
                    ↓
Client Hydration → Rehydrate queries → Interactive UI
```

---

## 3. Implementation Notes

### 3.1 Installation

```bash
pnpm add @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query zod superjson
pnpm add -D @types/server-only
```

- `zod` - Input validation
- `superjson` - Data transformer for serialization
- `server-only` - Prevent server code from bundling to client

### 3.2 Key Files

**trpc/init.ts** - Base tRPC setup:
```typescript
import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';

export const createTRPCContext = cache(async () => {
  // Add session/auth logic here
  return {};
});

const t = initTRPC.create();
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
```

**trpc/router.ts** - App router:
```typescript
import { z } from 'zod';
import { createTRPCRouter, baseProcedure } from '../init';

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => ({ greeting: `Hello ${input.text}` })),
});

export type AppRouter = typeof appRouter;
```

**app/api/trpc/[trpc]/route.ts** - API handler:
```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/trpc/router';
import { createTRPCContext } from '@/trpc/init';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
```

**trpc/client.tsx** - Client provider:
```typescript
'use client';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
// ... QueryClient setup from docs
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

export function TRPCReactProvider({ children }) {
  // ... client setup from docs
}
```

**trpc/server.tsx** - Server utilities:
```typescript
import 'server-only';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
// ... getQueryClient, prefetch, HydrateClient helpers
export const trpc = createTRPCOptionsProxy({ /* ... */ });
```

### 3.3 Usage in Components

**Server Component (prefetch + hydrate):**
```typescript
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

export default async function Page() {
  prefetch(trpc.hello.queryOptions({ text: 'world' }));
  return <HydrateClient><ClientComponent /></HydrateClient>;
}
```

**Client Component (hooks):**
```typescript
'use client';
import { useTRPC } from '@/trpc/client';

export function ClientComponent() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.hello.queryOptions({ text: 'world' }));
  return <div>{data?.greeting}</div>;
}
```

---

## 4. Open Questions (Answered)

- [x] Use TanStack React Query or classic client? **→ TanStack React Query (recommended)**
- [x] Prefetch or fetchQuery? **→ prefetch for streaming, fetchQuery if needing data in RSC**
- [x] Add data transformer? **→ Yes, superjson for dates/objects**
- [x] Error handling? **→ Use ErrorBoundary + Suspense pattern**
- [x] Multiple routers or single? **→ Single appRouter, sub-routers for organization**

---

## 5. Tasks / Todos

- [ ] Install tRPC and dependencies
- [ ] Create `trpc/init.ts` with context and base procedures
- [ ] Create `trpc/router.ts` with AppRouter type
- [ ] Create API route handler at `app/api/trpc/[trpc]/route.ts`
- [ ] Create `trpc/query-client.ts` factory
- [ ] Create `trpc/client.tsx` with TRPCReactProvider
- [ ] Create `trpc/server.tsx` with server utilities
- [ ] Wrap app in `TRPCReactProvider` (layout.tsx)
- [ ] Test with sample procedure
- [ ] Add sub-routers for different features (as needed)