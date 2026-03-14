import { forwardRef, useCallback, useEffect, useState } from "react";
import Editor from "react-simple-code-editor";
import {
    detectLanguage,
    getStoredLanguage,
    highlightCode,
    type LanguageId,
    setStoredLanguage,
} from "@/utils/languageDetection";
import { LanguageSelector } from "./LanguageSelector";

export interface CodeEditorProps {
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
}

export const CodeEditor = forwardRef<HTMLTextAreaElement, CodeEditorProps>(
    ({ value = "", onChange, className }, _ref) => {
        const [language, setLanguage] = useState<LanguageId>("plaintext");
        const lines = value ? value.split("\n") : [];
        const lineCount = Math.max(lines.length, 16);

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
                <div className="flex">
                    <div className="flex flex-col border-r border-zinc-800 bg-zinc-950 px-4 py-3 text-right select-none">
                        {Array.from({ length: lineCount }, (_, i) => (
                            <span
                                // biome-ignore lint/suspicious/noArrayIndexKey: Line numbers are stable
                                key={i}
                                className="font-mono text-[12px] leading-[1.5] text-zinc-600"
                            >
                                {i + 1}
                            </span>
                        ))}
                    </div>
                    <div className="relative flex-1 overflow-auto">
                        <Editor
                            value={value}
                            onValueChange={handleChange}
                            highlight={(_code) => highlighted}
                            padding={12}
                            className="font-mono text-[12px] leading-[1.5] text-zinc-50"
                            textareaClassName="focus:outline-none text-zinc-50"
                            style={{
                                minHeight: "100%",
                                background: "transparent",
                                color: "#e4e4e7", // zinc-200
                            }}
                            spellCheck={false}
                            placeholder="// paste your code here..."
                        />
                    </div>
                </div>
            </div>
        );
    },
);

CodeEditor.displayName = "CodeEditor";
