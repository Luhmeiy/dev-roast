import { forwardRef, type TextareaHTMLAttributes } from "react";

export interface CodeEditorProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const CodeEditor = forwardRef<HTMLTextAreaElement, CodeEditorProps>(
    ({ className, value, ...props }, ref) => {
        const lines = value ? String(value).split("\n") : [];
        const lineCount = Math.max(lines.length, 16);

        return (
            <div className="flex w-full max-w-[780px] flex-col border border-zinc-800 bg-zinc-900 overflow-hidden">
                <div className="flex h-10 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4">
                    <div className="flex gap-2">
                        <span className="h-3 w-3 rounded-full bg-red-500" />
                        <span className="h-3 w-3 rounded-full bg-amber-500" />
                        <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    </div>
                </div>
                <div className="flex">
                    <div className="flex flex-col border-r border-zinc-800 bg-zinc-950 px-4 py-3 text-right">
                        {Array.from({ length: lineCount }, (_, i) => (
                            <span
                                // biome-ignore lint/suspicious/noArrayIndexKey: Line numbers are stable
                                key={`line-${i}`}
                                className="font-mono text-[12px] leading-[1.5] text-zinc-600"
                            >
                                {i + 1}
                            </span>
                        ))}
                    </div>
                    <textarea
                        ref={ref}
                        value={value}
                        className="flex-1 resize-none bg-zinc-900 p-3 font-mono text-[12px] leading-[1.5] text-zinc-50 placeholder-zinc-600 focus:outline-none"
                        placeholder="// paste your code here..."
                        spellCheck={false}
                        {...props}
                    />
                </div>
            </div>
        );
    },
);

CodeEditor.displayName = "CodeEditor";
