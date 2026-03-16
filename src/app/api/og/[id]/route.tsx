import { ImageResponse } from "@takumi-rs/image-response";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { roasts } from "@/db/schema";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

function getScoreColor(score: number): string {
    return score <= 2 ? "#EF4444" : score <= 4 ? "#F59E0B" : "#10B981";
}

function getVerdictType(score: number): string {
    if (score <= 2) return "needs_serious_help";
    if (score <= 4) return "needs_work";
    return "not_bad";
}

function RoastOGImage({
    score,
    verdict,
    language,
    lineCount,
    issueCount,
    warningCount,
}: {
    score: number;
    verdict: string;
    language: string;
    lineCount: number;
    issueCount: number;
    warningCount: number;
}) {
    const scoreColor = getScoreColor(score);
    const verdictType = getVerdictType(score);

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#0C0C0C",
                padding: "60px",
                fontFamily:
                    "JetBrains Mono, Menlo, Monaco, Courier New, monospace",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "40px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <span
                        style={{
                            fontSize: "28px",
                            fontWeight: "bold",
                            color: "#10B981",
                        }}
                    >
                        &gt;
                    </span>
                    <span
                        style={{
                            fontSize: "28px",
                            fontWeight: "600",
                            color: "#E5E5E5",
                        }}
                    >
                        devroast
                    </span>
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <div
                        style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            backgroundColor: scoreColor,
                        }}
                    />
                    <span
                        style={{
                            fontSize: "18px",
                            color: scoreColor,
                            fontWeight: "500",
                        }}
                    >
                        verdict: {verdictType}
                    </span>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "60px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "220px",
                        height: "220px",
                    }}
                >
                    <svg
                        width="220"
                        height="220"
                        viewBox="0 0 220 220"
                        style={{ position: "absolute" }}
                    >
                        <title>Score: {score}/10</title>
                        <circle
                            cx="110"
                            cy="110"
                            r="100"
                            fill="none"
                            stroke="#1F1F1F"
                            strokeWidth="12"
                        />
                        <circle
                            cx="110"
                            cy="110"
                            r="100"
                            fill="none"
                            stroke={scoreColor}
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={`${(score / 10) * 628.32} 628.32`}
                            transform="rotate(-90 110 110)"
                        />
                    </svg>
                    <span
                        style={{
                            fontSize: "72px",
                            fontWeight: "bold",
                            color: scoreColor,
                        }}
                    >
                        {score}
                    </span>
                    <span
                        style={{
                            fontSize: "24px",
                            color: "#737373",
                        }}
                    >
                        /10
                    </span>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        flex: 1,
                        maxWidth: "600px",
                    }}
                >
                    <p
                        style={{
                            fontSize: "28px",
                            color: "#E5E5E5",
                            lineHeight: 1.4,
                            margin: 0,
                        }}
                    >
                        {verdict || "Code roasted to perfection"}
                    </p>

                    <div
                        style={{
                            display: "flex",
                            gap: "24px",
                            marginTop: "20px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "14px",
                                    color: "#737373",
                                }}
                            >
                                language
                            </span>
                            <span
                                style={{
                                    fontSize: "20px",
                                    color: "#D4D4D8",
                                    fontWeight: "500",
                                }}
                            >
                                {language}
                            </span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "14px",
                                    color: "#737373",
                                }}
                            >
                                lines
                            </span>
                            <span
                                style={{
                                    fontSize: "20px",
                                    color: "#D4D4D8",
                                    fontWeight: "500",
                                }}
                            >
                                {lineCount}
                            </span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "14px",
                                    color: "#737373",
                                }}
                            >
                                issues
                            </span>
                            <span
                                style={{
                                    fontSize: "20px",
                                    color: "#EF4444",
                                    fontWeight: "500",
                                }}
                            >
                                {issueCount}
                            </span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "14px",
                                    color: "#737373",
                                }}
                            >
                                warnings
                            </span>
                            <span
                                style={{
                                    fontSize: "20px",
                                    color: "#F59E0B",
                                    fontWeight: "500",
                                }}
                            >
                                {warningCount}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingTop: "30px",
                    borderTop: "1px solid #1F1F1F",
                }}
            >
                <span
                    style={{
                        fontSize: "16px",
                        color: "#737373",
                    }}
                >
                    devroast.ai/roast
                </span>
            </div>
        </div>
    );
}

async function getRoast(id: number) {
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
        })
        .from(roasts)
        .where(eq(roasts.id, id));

    return roast || null;
}

export async function GET(
    _request: Request,
    { params }: Props,
): Promise<Response> {
    const { id } = await params;
    const roastId = parseInt(id, 10);

    if (Number.isNaN(roastId)) {
        return new ImageResponse(
            <RoastOGImage
                score={0}
                verdict="Invalid roast ID"
                language="unknown"
                lineCount={0}
                issueCount={0}
                warningCount={0}
            />,
            { width: 1200, height: 630 },
        );
    }

    const roast = await getRoast(roastId);

    if (!roast) {
        return new ImageResponse(
            <RoastOGImage
                score={0}
                verdict="Roast not found"
                language="unknown"
                lineCount={0}
                issueCount={0}
                warningCount={0}
            />,
            { width: 1200, height: 630 },
        );
    }

    const issues = (roast.issues || []) as Array<{ type: string }>;
    const issueCount = issues.filter((i) => i.type === "error").length;
    const warningCount = issues.filter((i) => i.type === "warning").length;
    const lineCount = roast.code.split("\n").length;

    return new ImageResponse(
        <RoastOGImage
            score={roast.score}
            verdict={roast.verdict || "Code roasted to perfection"}
            language={roast.language}
            lineCount={lineCount}
            issueCount={issueCount}
            warningCount={warningCount}
        />,
        {
            width: 1200,
            height: 630,
            format: "png",
        },
    );
}
