"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import {
	detectLanguage,
	getStoredLanguage,
	highlightCode,
	type LanguageId,
	setStoredLanguage,
} from "@/utils/languageDetection";

const Editor = dynamic(
	() => import("react-simple-code-editor").then((mod) => mod.default),
	{ ssr: false },
);

export interface CodeEditorProps {
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
	maxLines?: number;
	maxChars?: number;
}

const DEFAULT_MAX_LINES = 30;
const LINE_HEIGHT = 18;
const DEFAULT_MAX_CHARS = 2000;

export function CodeEditor({
	value = "",
	onChange,
	className,
	maxLines = DEFAULT_MAX_LINES,
	maxChars = DEFAULT_MAX_CHARS,
}: CodeEditorProps) {
	const [language, setLanguage] = useState<LanguageId>("plaintext");
	const lines = value ? value.split("\n") : [];
	const lineCount = Math.max(lines.length, 16);
	const charCount = value.length;
	const isOverLimit = charCount > maxChars;

	useEffect(() => {
		const stored = getStoredLanguage();
		setLanguage(stored);
	}, []);

	useEffect(() => {
		if (value && language === "plaintext") {
			const detected = detectLanguage(value);
			if (detected !== "plaintext") {
				setLanguage(detected);
				setStoredLanguage(detected);
			}
		}
	}, [value, language]);

	const handleLanguageChange = useCallback((newLanguage: LanguageId) => {
		setLanguage(newLanguage);
		setStoredLanguage(newLanguage);
	}, []);

	const handleChange = useCallback(
		(newValue: string) => {
			onChange?.(newValue);
		},
		[onChange],
	);

	const highlighted = highlightCode(value, language);

	return (
		<div
			className={`flex w-full max-w-[780px] flex-col border border-zinc-800 bg-zinc-900 overflow-hidden ${className || ""}`}
		>
			<div className="flex h-10 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4">
				<div className="flex items-center gap-4">
					<div className="flex gap-2">
						<span className="h-3 w-3 rounded-full bg-red-500" />
						<span className="h-3 w-3 rounded-full bg-amber-500" />
						<span className="h-3 w-3 rounded-full bg-emerald-500" />
					</div>
					<LanguageSelector
						value={language}
						onChange={handleLanguageChange}
					/>
				</div>
			</div>
			<div
				className="flex max-h-[924px] overflow-y-auto"
				style={{ maxHeight: maxLines * LINE_HEIGHT + 24 }}
			>
				<div className="flex flex-col border-r border-zinc-800 bg-zinc-950 px-4 py-3 text-right select-none">
					{Array.from({ length: lineCount }, (_, i) => (
						<span
							key={i}
							className="font-mono text-xs leading-normal text-zinc-600"
						>
							{i + 1}
						</span>
					))}
				</div>
				<div className="flex-1" suppressHydrationWarning>
					<Editor
						value={value}
						onValueChange={handleChange}
						highlight={(_code) => highlighted}
						padding={12}
						className="font-mono text-xs leading-normal text-zinc-50"
						textareaClassName="focus:outline-none text-zinc-50"
						style={{
							minHeight: "100%",
							background: "transparent",
							color: "#e4e4e7",
						}}
						spellCheck={false}
						placeholder="// paste your code here..."
					/>
				</div>
			</div>
			<div
				className={`flex justify-end border-t border-zinc-800 bg-zinc-900 px-3 py-1 text-xs ${isOverLimit ? "text-red-400" : "text-zinc-500"}`}
			>
				<span>
					{charCount} / {maxChars}
				</span>
			</div>
		</div>
	);
}

function LanguageSelector({
	value,
	onChange,
}: {
	value: LanguageId;
	onChange: (lang: LanguageId) => void;
}) {
	const [isOpen, setIsOpen] = useState(false);

	const languages: { id: LanguageId; label: string }[] = [
		{ id: "plaintext", label: "Plain Text" },
		{ id: "javascript", label: "JavaScript" },
		{ id: "typescript", label: "TypeScript" },
		{ id: "sql", label: "SQL" },
		{ id: "python", label: "Python" },
		{ id: "rust", label: "Rust" },
	];

	const currentLabel =
		languages.find((l) => l.id === value)?.label || "Plain Text";

	return (
		<div className="relative">
			<button
				type="button"
				className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
				onClick={() => setIsOpen(!isOpen)}
			>
				<span>{currentLabel}</span>
				<svg
					aria-hidden="true"
					className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>
			{isOpen && (
				<div className="absolute top-full left-0 z-10 mt-1 min-w-[120px] rounded border border-zinc-700 bg-zinc-800 py-1">
					{languages.map((lang) => (
						<button
							key={lang.id}
							type="button"
							className="block w-full px-3 py-1.5 text-left text-xs text-zinc-300 hover:bg-zinc-700"
							onClick={() => {
								onChange(lang.id);
								setIsOpen(false);
							}}
						>
							{lang.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
}

