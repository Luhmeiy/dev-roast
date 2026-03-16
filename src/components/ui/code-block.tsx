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
        <div className="rounded-none border border-[#1F1F1F] bg-[#111111] overflow-hidden w-full">
            <div className="flex">
                {showLineNumbers && (
                    <div className="w-10 px-4 py-4 border-r border-[#1F1F1F] bg-[#171717] flex flex-col gap-1.5 text-right">
                        {lines.map((_line, i) => (
                            <span
                                // biome-ignore lint/suspicious/noArrayIndexKey: Line index is stable for static code
                                key={i}
                                className="font-mono text-xs leading-normal text-[#525252]"
                            >
                                {i + 1}
                            </span>
                        ))}
                    </div>
                )}
                <div
                    className="flex-1 p-3 [&_pre]:bg-transparent! [&_pre]:m-0! [&_pre]:p-0! [&_pre]:leading-normal! [&_code]:bg-transparent! [&_code]:text-[#E5E5E5]! [&_code]:font-mono! [&_code]:text-xs! [&_code]:leading-normal!"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki provides safe HTML output
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </div>
        </div>
    );
}
