import { codeToHtml } from "shiki";

export interface CodeBlockProps {
    code: string;
    language?: string;
    filename?: string;
    showLineNumbers?: boolean;
}

export async function CodeBlock({
    code,
    language = "javascript",
    filename,
    showLineNumbers = true,
}: CodeBlockProps) {
    const html = await codeToHtml(code, {
        lang: language,
        theme: "vesper",
    });

    const lines = code.split("\n");

    return (
        <div className="rounded-none border border-zinc-800 bg-zinc-900 overflow-hidden w-full max-w-[560px]">
            <div className="flex items-center gap-3 h-10 px-4 border-b border-zinc-800">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <div className="flex-1" />
                {filename && (
                    <span className="font-mono text-[12px] text-zinc-500">
                        {filename}
                    </span>
                )}
            </div>
            <div className="flex">
                {showLineNumbers && (
                    <div className="w-10 px-2.5 py-3 border-r border-zinc-800 text-right">
                        {lines.map((_line, i) => (
                            <span
                                // biome-ignore lint/suspicious/noArrayIndexKey: Line index is stable for static code
                                key={i}
                                className="block font-mono text-[13px] text-zinc-600 leading-[1.5]"
                            >
                                {i + 1}
                            </span>
                        ))}
                    </div>
                )}
                <div
                    className="flex-1 p-3 [&_pre]:bg-transparent! [&_pre]:m-0! [&_pre]:p-0! [&_code]:bg-transparent! [&_code]:text-zinc-50! [&_code]:font-mono! [&_code]:text-[13px]!"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki provides safe HTML output
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </div>
        </div>
    );
}
