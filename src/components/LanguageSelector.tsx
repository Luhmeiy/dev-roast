"use client";

import { useEffect, useRef, useState } from "react";
import {
    type LanguageId,
    SUPPORTED_LANGUAGES,
} from "@/utils/languageDetection";

interface LanguageSelectorProps {
    value: LanguageId;
    onChange: (language: LanguageId) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedLanguage = SUPPORTED_LANGUAGES.find((l) => l.id === value);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            >
                <span>{selectedLanguage?.name || "Plain Text"}</span>
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
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full z-50 mt-1 max-h-60 w-40 overflow-auto rounded border border-zinc-700 bg-zinc-900 shadow-lg">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                        <button
                            key={lang.id}
                            type="button"
                            onClick={() => {
                                onChange(lang.id);
                                setIsOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-left text-xs hover:bg-zinc-800 ${
                                lang.id === value
                                    ? "text-emerald-400 bg-zinc-800"
                                    : "text-zinc-300"
                            }`}
                        >
                            {lang.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
