"use client";

import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useMemo, useState } from "react";
import { makeQueryClient } from "./query-client";
import type { AppRouter } from "./router";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient;
let browserTrpcClient: ReturnType<typeof createTRPCClient<AppRouter>> | null =
    null;

function getQueryClient() {
    if (typeof window === "undefined") {
        return makeQueryClient();
    }
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
}

function getTrpcClient() {
    if (typeof window === "undefined") {
        return createTRPCClient<AppRouter>({
            links: [httpBatchLink({ url: getUrl() })],
        });
    }
    if (!browserTrpcClient) {
        browserTrpcClient = createTRPCClient<AppRouter>({
            links: [httpBatchLink({ url: getUrl() })],
        });
    }
    return browserTrpcClient;
}

function getUrl() {
    const base = (() => {
        if (typeof window !== "undefined") return "";
        if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
        return "http://localhost:3000";
    })();
    return `${base}/api/trpc`;
}

export function TRPCReactProvider(props: { children: React.ReactNode }) {
    const queryClient = getQueryClient();
    const trpcClient = useMemo(() => getTrpcClient(), []);

    return (
        <QueryClientProvider client={queryClient}>
            <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
                {props.children}
            </TRPCProvider>
        </QueryClientProvider>
    );
}

export const trpc = createTRPCClient<AppRouter>({
    links: [httpBatchLink({ url: getUrl() })],
});
