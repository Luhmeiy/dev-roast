"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { CodeEditor, type LanguageId } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

export function RoastForm() {
	const [code, setCode] = useState("");
	const [language, setLanguage] = useState<LanguageId>("auto");
	const [roastMode, setRoastMode] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const MAX_CHARS = 2000;
	const isOverLimit = code.length > MAX_CHARS;
	const isEmpty = code.trim().length === 0;

	const handleLanguageChange = useCallback((lang: LanguageId) => {
		setLanguage(lang);
	}, []);

	const handleSubmit = async () => {
		if (isOverLimit || isEmpty) return;

		setIsLoading(true);

		try {
			const base =
				typeof window !== "undefined"
					? window.location.origin
					: process.env.VERCEL_URL
						? `https://${process.env.VERCEL_URL}`
						: "http://localhost:3000";

			const response = await fetch(`${base}/api/trpc/createRoast`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ code, language, roastMode }),
			});

			const result = await response.json();

			if (!response.ok || result.error) {
				let errorMessage = "Failed to create roast";
				try {
					errorMessage =
						result.error?.message || result.message || errorMessage;
				} catch {}
				alert(`Error: ${errorMessage}`);
				setIsLoading(false);
				return;
			}

			const id =
				result?.result?.data?.json?.id ??
				result?.result?.data?.id ??
				result?.id;

			if (!id) {
				console.error("Unexpected response structure:", result);
				alert("Invalid response from server");
				setIsLoading(false);
				return;
			}

			router.push(`/roast/${id}`);
		} catch (error) {
			console.error("Failed to create roast:", error);
			const message =
				error instanceof Error ? error.message : "Unknown error";
			alert(`Error: ${message}`);
			setIsLoading(false);
		}
	};

	return (
		<>
			<section className="flex w-[780px] max-w-full flex-col">
				<CodeEditor
					value={code}
					onChange={setCode}
					language={language}
					onLanguageChange={handleLanguageChange}
					maxChars={MAX_CHARS}
					disabled={isLoading}
				/>
			</section>

			<section className="flex w-[780px] max-w-full items-center justify-between">
				<div className="flex items-center gap-4">
					<Toggle
						checked={roastMode}
						onCheckedChange={setRoastMode}
						disabled={isLoading}
					>
						roast mode
					</Toggle>
					<span className="text-zinc-500 font-mono text-sm">
						{roastMode
							? "// maximum sarcasm enabled"
							: "// honest feedback mode"}
					</span>
				</div>
				<Button
					variant="primary"
					size="default"
					disabled={isOverLimit || isEmpty || isLoading}
					onClick={handleSubmit}
				>
					{isLoading ? "$ roasting..." : "$ roast_my_code"}
				</Button>
			</section>

			{isLoading && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
					<div className="flex flex-col items-center gap-6 rounded-lg border border-zinc-800 bg-zinc-900 p-8">
						<div className="flex flex-col items-center gap-4">
							<div className="h-16 w-16 animate-spin rounded-full border-4 border-zinc-700 border-t-emerald-500" />
							<div className="flex flex-col items-center gap-2">
								<span className="font-mono text-lg text-zinc-50">
									roasting your code...
								</span>
								<span className="font-mono text-sm text-zinc-500">
									this may take 10-15 seconds
								</span>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

