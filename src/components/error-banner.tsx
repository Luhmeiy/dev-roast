"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function ErrorBannerInner() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    useEffect(() => {
        if (error) {
            alert(`Error: ${decodeURIComponent(error)}`);
            // Clear the error from URL
            window.history.replaceState({}, "", "/");
        }
    }, [error]);

    return null;
}

export function ErrorBanner() {
    return (
        <Suspense fallback={null}>
            <ErrorBannerInner />
        </Suspense>
    );
}
