import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import clojure from "highlight.js/lib/languages/clojure";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import css from "highlight.js/lib/languages/css";
import dart from "highlight.js/lib/languages/dart";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import elixir from "highlight.js/lib/languages/elixir";
import fsharp from "highlight.js/lib/languages/fsharp";
import go from "highlight.js/lib/languages/go";
import haskell from "highlight.js/lib/languages/haskell";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import kotlin from "highlight.js/lib/languages/kotlin";
import lua from "highlight.js/lib/languages/lua";
import makefile from "highlight.js/lib/languages/makefile";
import markdown from "highlight.js/lib/languages/markdown";
import objectivec from "highlight.js/lib/languages/objectivec";
import perl from "highlight.js/lib/languages/perl";
import php from "highlight.js/lib/languages/php";
import python from "highlight.js/lib/languages/python";
import r from "highlight.js/lib/languages/r";
import ruby from "highlight.js/lib/languages/ruby";
import rust from "highlight.js/lib/languages/rust";
import scala from "highlight.js/lib/languages/scala";
import scss from "highlight.js/lib/languages/scss";
import shell from "highlight.js/lib/languages/shell";
import sql from "highlight.js/lib/languages/sql";
import swift from "highlight.js/lib/languages/swift";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("css", css);
hljs.registerLanguage("scss", scss);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("json", json);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("shell", shell);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("go", go);
hljs.registerLanguage("java", java);
hljs.registerLanguage("c", c);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("csharp", csharp);
hljs.registerLanguage("ruby", ruby);
hljs.registerLanguage("php", php);
hljs.registerLanguage("swift", swift);
hljs.registerLanguage("kotlin", kotlin);
hljs.registerLanguage("scala", scala);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("dockerfile", dockerfile);
hljs.registerLanguage("makefile", makefile);
hljs.registerLanguage("perl", perl);
hljs.registerLanguage("lua", lua);
hljs.registerLanguage("r", r);
hljs.registerLanguage("objectivec", objectivec);
hljs.registerLanguage("dart", dart);
hljs.registerLanguage("elixir", elixir);
hljs.registerLanguage("haskell", haskell);
hljs.registerLanguage("clojure", clojure);
hljs.registerLanguage("fsharp", fsharp);

export const SUPPORTED_LANGUAGES = [
    { id: "plaintext", name: "Plain Text" },
    { id: "javascript", name: "JavaScript" },
    { id: "typescript", name: "TypeScript" },
    { id: "python", name: "Python" },
    { id: "css", name: "CSS" },
    { id: "scss", name: "SCSS" },
    { id: "html", name: "HTML" },
    { id: "json", name: "JSON" },
    { id: "bash", name: "Bash" },
    { id: "shell", name: "Shell" },
    { id: "markdown", name: "Markdown" },
    { id: "sql", name: "SQL" },
    { id: "rust", name: "Rust" },
    { id: "go", name: "Go" },
    { id: "java", name: "Java" },
    { id: "c", name: "C" },
    { id: "cpp", name: "C++" },
    { id: "csharp", name: "C#" },
    { id: "ruby", name: "Ruby" },
    { id: "php", name: "PHP" },
    { id: "swift", name: "Swift" },
    { id: "kotlin", name: "Kotlin" },
    { id: "scala", name: "Scala" },
    { id: "yaml", name: "YAML" },
    { id: "dockerfile", name: "Dockerfile" },
    { id: "makefile", name: "Makefile" },
    { id: "perl", name: "Perl" },
    { id: "lua", name: "Lua" },
    { id: "r", name: "R" },
    { id: "objectivec", name: "Objective-C" },
    { id: "dart", name: "Dart" },
    { id: "elixir", name: "Elixir" },
    { id: "haskell", name: "Haskell" },
    { id: "clojure", name: "Clojure" },
    { id: "fsharp", name: "F#" },
] as const;

export type LanguageId = (typeof SUPPORTED_LANGUAGES)[number]["id"];

const STORAGE_KEY = "devroast-code-language";

export function detectLanguage(code: string): LanguageId {
    if (!code || code.trim().length === 0) {
        return "plaintext";
    }

    const result = hljs.highlightAuto(code);
    const detectedLanguage = result.language;

    if (
        detectedLanguage &&
        SUPPORTED_LANGUAGES.some((l) => l.id === detectedLanguage)
    ) {
        return detectedLanguage as LanguageId;
    }

    return "plaintext";
}

export function highlightCode(code: string, languageId: LanguageId): string {
    if (languageId === "plaintext" || !code) {
        return escapeHtml(code);
    }

    try {
        const result = hljs.highlight(code, { language: languageId });
        return result.value;
    } catch {
        return escapeHtml(code);
    }
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export function getStoredLanguage(): LanguageId {
    if (typeof window === "undefined") return "plaintext";
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.some((l) => l.id === stored)) {
        return stored as LanguageId;
    }
    return "plaintext";
}

export function setStoredLanguage(languageId: LanguageId): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, languageId);
}
