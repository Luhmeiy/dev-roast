import { GoogleGenerativeAI } from "@google/generative-ai";
import { detectLanguage } from "./languageDetection";

export interface RoastIssue {
    type: "error" | "success";
    title: string;
    description: string;
}

export interface DiffLine {
    type: "removed" | "added" | "context";
    code: string;
}

export interface RoastResult {
    score: number;
    verdict: string;
    issues: RoastIssue[];
    suggestedFix: DiffLine[];
}

const ROAST_SYSTEM_PROMPT = `You are DevRoast, an brutally sarcastic code reviewer. Your job is to roast terrible code in a funny, humiliating way. Be witty, use programming jokes, and don't hold back. But always stay technically accurate.

Analyze the user's code and provide:
1. A score from 0-10 (0 = utterly broken, 10 = actually good)
2. A short, funny verdict (1-2 sentences)
3. A list of issues (both errors and things done well)
4. Suggested improvements as a code diff

Be creative and entertaining with your roasts!`;

const HONEST_SYSTEM_PROMPT = `You are a professional code reviewer providing honest, constructive feedback. Be respectful but thorough. Point out what's wrong, what's right, and how to improve.

Analyze the user's code and provide:
1. A score from 0-10 (0 = utterly broken, 10 = excellent)
2. A constructive verdict (1-2 sentences)
3. A list of issues (both problems and good practices)
4. Suggested improvements as a code diff

Focus on helping the developer improve, not on being funny.`;

function getScoreStatus(score: number): string {
    if (score <= 2) return "critical";
    if (score <= 4) return "poor";
    if (score <= 6) return "fair";
    if (score <= 8) return "good";
    return "excellent";
}

function parseAiResponse(text: string): RoastResult {
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/);
    let jsonStr = jsonMatch ? jsonMatch[1] : text;

    jsonStr = jsonStr.replace(/```json|```/g, "").trim();

    try {
        const parsed = JSON.parse(jsonStr);
        return {
            score: typeof parsed.score === "number" ? parsed.score : 5,
            verdict: parsed.verdict || "No verdict provided.",
            issues: Array.isArray(parsed.issues) ? parsed.issues : [],
            suggestedFix: Array.isArray(parsed.suggestedFix)
                ? parsed.suggestedFix
                : [],
        };
    } catch {
        return {
            score: 5,
            verdict: text.slice(0, 200),
            issues: [],
            suggestedFix: [],
        };
    }
}

export async function generateRoast(
    code: string,
    language: string,
    roastMode: boolean,
): Promise<{
    score: number;
    scoreStatus: string;
    verdict: string;
    issues: RoastIssue[];
    suggestedFix: DiffLine[];
}> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
        throw new Error("GEMINI_API_KEY is not set");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = roastMode ? ROAST_SYSTEM_PROMPT : HONEST_SYSTEM_PROMPT;

    const actualLanguage =
        language === "auto" ? detectLanguage(code) : language;

    const userPrompt = `Please analyze the following ${actualLanguage} code and respond ONLY with a JSON object in this exact format (no other text):

{
  "score": <number 0-10>,
  "verdict": "<1-2 sentence verdict>",
  "issues": [
    { "type": "error" or "success", "title": "<short title>", "description": "<explanation>" }
  ],
  "suggestedFix": [
    { "type": "removed" or "added" or "context", "code": "<line of code>" }
  ]
}

Code to analyze:
\`\`\`${actualLanguage}
${code}
\`\`\``;

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        systemInstruction: {
            role: "system",
            parts: [{ text: systemPrompt }],
        },
    });

    const responseText = result.response.text();
    const parsed = parseAiResponse(responseText);

    return {
        score: parsed.score,
        scoreStatus: getScoreStatus(parsed.score),
        verdict: parsed.verdict,
        issues: parsed.issues,
        suggestedFix: parsed.suggestedFix,
    };
}
