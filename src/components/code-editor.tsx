import { forwardRef, type TextareaHTMLAttributes } from "react";

export interface CodeEditorProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const CodeEditor = forwardRef<HTMLTextAreaElement, CodeEditorProps>(
    ({ className, value, ...props }, ref) => {
        const lines = value ? String(value).split("\n") : [];
        const lineCount = Math.max(lines.length, 16);

        return (
            <div className="flex w-full max-w-[780px] border border-zinc-800 bg-zinc-900 overflow-hidden">
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
        );
    },
);

CodeEditor.displayName = "CodeEditor";
