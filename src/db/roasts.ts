import { asc, eq, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "./index";
import { roasts } from "./schema";
import type {
    CreateRoastInput,
    CreateRoastOutput,
    GlobalStats,
    Language,
    LeaderboardEntry,
    ScoreStatus,
} from "./types";

const roastMessages: Record<ScoreStatus, string[]> = {
    excellent: [
        "Great code! Keep it up!",
        "Clean and maintainable!",
        "A pleasure to read!",
    ],
    good: [
        "Not bad at all!",
        "Solid work!",
        "Most would be proud of this code.",
    ],
    fair: [
        "Could be worse, could be better.",
        "It works, but... does it really?",
        "We've seen worse, honestly.",
    ],
    poor: [
        "This needs work.",
        "Ouch. Just... ouch.",
        "Did you write this at 3am?",
    ],
    critical: [
        "This is a security vulnerability with extra steps!",
        "I'd roast this, but it would take forever.",
        "This code is a crime against programming.",
    ],
};

function calculateScoreStatus(score: number): ScoreStatus {
    if (score >= 8) return "excellent";
    if (score >= 6) return "good";
    if (score >= 4) return "fair";
    if (score >= 2) return "poor";
    return "critical";
}

function generateRoastMessage(
    scoreStatus: ScoreStatus,
    roastMode: boolean,
): string {
    if (!roastMode) return "Code submitted successfully.";
    const messages = roastMessages[scoreStatus];
    return messages[Math.floor(Math.random() * messages.length)];
}

export function calculateScore(code: string, _language: Language): number {
    let score = 10;

    const dangerousPatterns = [
        { pattern: /eval\s*\(/, penalty: 5 },
        { pattern: /alert\s*\(/, penalty: 2 },
        { pattern: /document\.write/, penalty: 3 },
        { pattern: /var\s+\w+\s*=/, penalty: 1 },
        { pattern: /==\s*(true|false)/, penalty: 1.5 },
        { pattern: /SQL\s*\?\s*["'`]/i, penalty: 4 },
        { pattern: /password\s*=\s*["'][^"']+["']/i, penalty: 3 },
        { pattern: /function\s+\w+\s*\(\s*\)\s*\{\s*\}/, penalty: 1 },
        { pattern: /TODO|FIXME|HACK/, penalty: 0.5 },
        { pattern: /\/\/\s*trust.*user/i, penalty: 5 },
    ];

    for (const { pattern, penalty } of dangerousPatterns) {
        if (pattern.test(code)) {
            score -= penalty;
        }
    }

    const codeLength = code.length;
    if (codeLength > 500) score -= 1;
    if (codeLength > 1000) score -= 1;

    const lineCount = code.split("\n").length;
    if (lineCount > 50) score -= 0.5;
    if (lineCount > 100) score -= 0.5;

    return Math.max(0, Math.min(10, Math.round(score * 10) / 10));
}

export async function createRoast(
    input: CreateRoastInput,
): Promise<CreateRoastOutput> {
    const score = calculateScore(input.code, input.language);
    const scoreStatus = calculateScoreStatus(score);
    const roastMessage = generateRoastMessage(scoreStatus, input.roastMode);
    const shareId = uuidv4();

    const [result] = await db
        .insert(roasts)
        .values({
            code: input.code,
            language: input.language,
            score,
            scoreStatus,
            roastMode: input.roastMode,
            roastMessage,
            shareId,
        })
        .returning({
            id: roasts.id,
            shareId: roasts.shareId,
            score: roasts.score,
            scoreStatus: roasts.scoreStatus,
            roastMessage: roasts.roastMessage,
        });

    return {
        id: result.id,
        shareId: result.shareId,
        score: result.score,
        scoreStatus: result.scoreStatus,
        roastMessage: result.roastMessage ?? "Code submitted successfully.",
    };
}

export async function getRoastByShareId(shareId: string) {
    const [result] = await db
        .select()
        .from(roasts)
        .where(eq(roasts.shareId, shareId));
    return result;
}

export async function getRoastById(id: number) {
    const [result] = await db
        .select({
            id: roasts.id,
            code: roasts.code,
            language: roasts.language,
            score: roasts.score,
            scoreStatus: roasts.scoreStatus,
            roastMode: roasts.roastMode,
            verdict: roasts.verdict,
            issues: roasts.issues,
            suggestedFix: roasts.suggestedFix,
        })
        .from(roasts)
        .where(eq(roasts.id, id));
    return result || null;
}

export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
    const results = await db
        .select({
            id: roasts.id,
            score: roasts.score,
            scoreStatus: roasts.scoreStatus,
            code: roasts.code,
            language: roasts.language,
            createdAt: roasts.createdAt,
        })
        .from(roasts)
        .orderBy(asc(roasts.score))
        .limit(limit);

    return results;
}

export async function getGlobalStats(): Promise<GlobalStats> {
    const [result] = await db
        .select({
            totalRoasts: sql<number>`count(*)`,
            averageScore: sql<number>`coalesce(avg(${roasts.score}), 0)`,
        })
        .from(roasts);

    return {
        totalRoasts: Number(result.totalRoasts),
        averageScore: Math.round(Number(result.averageScore) * 10) / 10,
    };
}
