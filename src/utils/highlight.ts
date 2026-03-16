import { codeToHtml } from "shiki";

export async function highlightCode(
    code: string,
    language: string,
): Promise<string> {
    const lines = code.split("\n");

    const result: string[] = [];

    for (const line of lines) {
        if (line.trim() === "") {
            result.push("<span>&nbsp;</span>");
            continue;
        }

        const lineHtml = await codeToHtml(line, {
            lang: language,
            theme: "vesper",
        });

        const preMatch = lineHtml.match(
            /<pre[^>]*><code[^>]*>([\s\S]*)<\/code><\/pre>/,
        );
        const codeContent = preMatch ? preMatch[1] : lineHtml;

        result.push(codeContent);
    }

    return result.join("");
}
