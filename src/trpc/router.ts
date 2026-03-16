import { avg, count } from "drizzle-orm";
import { db } from "@/db";
import { roasts } from "@/db/schema";
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

    leaderboard: baseProcedure.query(async () => {
        const result = await db
            .select({
                id: roasts.id,
                code: roasts.code,
                language: roasts.language,
                score: roasts.score,
                scoreStatus: roasts.scoreStatus,
            })
            .from(roasts)
            .orderBy(roasts.score)
            .limit(3);

        return result.map((roast, index) => ({
            rank: index + 1,
            score: roast.score,
            scoreStatus: roast.scoreStatus as "critical" | "warning" | "good",
            code: roast.code.split("\n").slice(0, 3),
            language: roast.language,
        }));
    }),
});

export type AppRouter = typeof appRouter;
