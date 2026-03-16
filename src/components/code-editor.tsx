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

export type { LanguageId };

const Editor = dynamic(
	() => import("react-simple-code-editor").then((mod) => mod.default),
	{ ssr: false },
);

export interface CodeEditorProps {
	value?: string;
	onChange?: (value: string) => void;
	language?: LanguageId;
	onLanguageChange?: (language: LanguageId) => void;
	className?: string;
	maxLines?: number;
	maxChars?: number;
	disabled?: boolean;
}

const DEFAULT_MAX_LINES = 30;
const LINE_HEIGHT = 18;
const DEFAULT_MAX_CHARS = 2000;

export function CodeEditor({
	value = "",
	onChange,
	language: controlledLanguage,
	onLanguageChange,
	className,
	maxLines = DEFAULT_MAX_LINES,
	maxChars = DEFAULT_MAX_CHARS,
	disabled = false,
}: CodeEditorProps) {
	const [internalLanguage, setInternalLanguage] =
		useState<LanguageId>("auto");
	const setLanguage = useCallback(
		(newLang: LanguageId) => {
			if (onLanguageChange) {
				onLanguageChange(newLang);
			} else {
				setInternalLanguage(newLang);
			}
			setStoredLanguage(newLang);
		},
		[onLanguageChange],
	);

	const lines = value ? value.split("\n") : [];
	const lineCount = Math.max(lines.length, maxLines);
	const charCount = value.length;
	const isOverLimit = charCount > maxChars;

	useEffect(() => {
		if (!controlledLanguage) {
			const stored = getStoredLanguage();
			setInternalLanguage(stored);
		}
	}, [controlledLanguage]);

	useEffect(() => {
		// Only auto-detect if parent hasn't explicitly set a language (controlledLanguage is undefined or "auto")
		// When controlledLanguage is explicitly set to a specific language, don't auto-detect
		if (!controlledLanguage || controlledLanguage === "auto") {
			if (value) {
				const detected = detectLanguage(value);
				if (detected !== "plaintext") {
					setInternalLanguage(detected);
					if (onLanguageChange) {
						onLanguageChange(detected);
					}
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	const handleLanguageChange = useCallback(
		(newLanguage: LanguageId) => {
			setLanguage(newLanguage);
		},
		[setLanguage],
	);

	const handleChange = useCallback(
		(newValue: string) => {
			onChange?.(newValue);
		},
		[onChange],
	);

	// Use detected language if controlled is "auto" or undefined
	const displayLanguage =
		!controlledLanguage || controlledLanguage === "auto"
			? internalLanguage
			: controlledLanguage;

	const highlighted =
		displayLanguage === "auto" || displayLanguage === "plaintext"
			? highlightCode(value, "plaintext")
			: highlightCode(value, displayLanguage);

	return (
		<div
			className={`flex w-full max-w-[780px] flex-col border border-zinc-800 bg-zinc-900 overflow-hidden font-mono text-xs ${className || ""}`}
		>
			<div className="flex h-10 items-center justify-between border-b border-zinc-800 px-4">
				<div className="flex items-center gap-4">
					<div className="flex gap-2">
						<span className="h-3 w-3 rounded-full bg-red-500" />
						<span className="h-3 w-3 rounded-full bg-amber-500" />
						<span className="h-3 w-3 rounded-full bg-emerald-500" />
					</div>
					<LanguageSelector
						value={displayLanguage}
						onChange={handleLanguageChange}
						disabled={disabled}
					/>
				</div>
			</div>
			<div
				className="flex max-h-[924px] overflow-y-auto"
				style={{ maxHeight: maxLines * LINE_HEIGHT + 24 }}
			>
				<div className="h-full flex flex-col items-end w-10 border-r border-zinc-800 bg-zinc-950 px-3 py-3 select-none text-zinc-600 leading-normal">
					{Array.from({ length: lineCount }, (_, i) => (
						<span key={i}>{i + 1}</span>
					))}
				</div>
				<div className="flex-1 bg-zinc-900" suppressHydrationWarning>
					<Editor
						value={value}
						onValueChange={handleChange}
						highlight={(_code) => highlighted}
						padding={12}
						className="leading-normal text-zinc-50"
						textareaClassName={`focus:outline-none text-zinc-50 ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
						style={{
							minHeight: "100%",
							background: "transparent",
							color: "#e4e4e7",
						}}
						spellCheck={false}
						placeholder="// paste your code here..."
						readOnly={disabled}
					/>
				</div>
			</div>
			<div
				className={`flex justify-end border-t border-zinc-800 bg-zinc-900 px-3 py-1 ${isOverLimit ? "text-red-400" : "text-zinc-500"}`}
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
	disabled = false,
}: {
	value: LanguageId;
	onChange: (lang: LanguageId) => void;
	disabled?: boolean;
}) {
	const [isOpen, setIsOpen] = useState(false);

	const languages: { id: LanguageId; label: string }[] = [
		{ id: "auto", label: "Auto Detect" },
		{ id: "plaintext", label: "Plain Text" },
		{ id: "javascript", label: "JavaScript" },
		{ id: "typescript", label: "TypeScript" },
		{ id: "sql", label: "SQL" },
		{ id: "python", label: "Python" },
		{ id: "rust", label: "Rust" },
	];

	const currentLabel =
		languages.find((l) => l.id === value)?.label || "Auto Detect";

	return (
		<div className="relative">
			<button
				type="button"
				className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${
					disabled
						? "cursor-not-allowed text-zinc-600"
						: "cursor-pointer text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
				}`}
				onClick={() => !disabled && setIsOpen(!isOpen)}
				disabled={disabled}
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

