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
});

export type AppRouter = typeof appRouter;
