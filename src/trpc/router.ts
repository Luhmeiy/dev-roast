import { avg, count, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { db } from "@/db";
import { roasts } from "@/db/schema";
import { generateRoast } from "@/utils/ai";
import { baseProcedure, createTRPCRouter } from "./init";

export const appRouter = createTRPCRouter({
    metrics: baseProcedure.query(async () => {
        const result = await db
            .select({
                totalCount: count(),
                avgScore: avg(roasts.score),
            })
            .from(roasts)
            .then((rows) => rows[0]);

        return {
            totalRoasts: result?.totalCount ?? 0,
            avgScore: result?.avgScore
                ? Math.round(Number(result.avgScore) * 10) / 10
                : 0,
        };
    }),

    leaderboard: baseProcedure
        .input(
            z.object({
                limit: z.number().default(20),
                offset: z.number().default(0),
            }),
        )
        .query(async ({ input }) => {
            const { limit, offset } = input;

            const [countResult, result] = await Promise.all([
                db
                    .select({ count: count() })
                    .from(roasts)
                    .then((rows) => rows[0]?.count ?? 0),
                db
                    .select({
                        id: roasts.id,
                        code: roasts.code,
                        language: roasts.language,
                        score: roasts.score,
                        scoreStatus: roasts.scoreStatus,
                    })
                    .from(roasts)
                    .orderBy(roasts.score)
                    .limit(limit)
                    .offset(offset),
            ]);

            return {
                entries: result.map((roast, index) => ({
                    rank: offset + index + 1,
                    score: roast.score,
                    scoreStatus: roast.scoreStatus as
                        | "critical"
                        | "warning"
                        | "good",
                    code: roast.code,
                    language: roast.language,
                    lineCount: roast.code.split("\n").length,
                })),
                totalCount: countResult,
            };
        }),

    createRoast: baseProcedure
        .input(
            z.object({
                code: z.string(),
                language: z.string(),
                roastMode: z.boolean(),
            }),
        )
        .mutation(async ({ input }) => {
            const { code, language, roastMode } = input;

            const roastResult = await generateRoast(code, language, roastMode);

            const shareId = uuidv4();

            const [roast] = await db
                .insert(roasts)
                .values({
                    code,
                    language:
                        language as (typeof roasts.language.enumValues)[number],
                    score: roastResult.score,
                    scoreStatus:
                        roastResult.scoreStatus as (typeof roasts.scoreStatus.enumValues)[number],
                    roastMode,
                    roastMessage: roastResult.verdict,
                    verdict: roastResult.verdict,
                    issues: roastResult.issues,
                    suggestedFix: roastResult.suggestedFix,
                    shareId,
                })
                .returning({ id: roasts.id });

            return { id: roast.id };
        }),

    getRoast: baseProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
            const [roast] = await db
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
                    createdAt: roasts.createdAt,
                })
                .from(roasts)
                .where(eq(roasts.id, input.id));

            return roast || null;
        }),
});

export type AppRouter = typeof appRouter;
