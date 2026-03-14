export type ScoreStatus = "excellent" | "good" | "fair" | "poor" | "critical";
export type Language =
    | "javascript"
    | "typescript"
    | "python"
    | "java"
    | "csharp"
    | "cpp"
    | "c"
    | "go"
    | "rust"
    | "ruby"
    | "php"
    | "swift"
    | "kotlin"
    | "scala"
    | "html"
    | "css"
    | "sql"
    | "bash"
    | "powershell"
    | "json"
    | "yaml"
    | "markdown"
    | "plaintext";

export interface CreateRoastInput {
    code: string;
    language: Language;
    roastMode: boolean;
}

export interface CreateRoastOutput {
    id: number;
    shareId: string;
    score: number;
    scoreStatus: ScoreStatus;
    roastMessage: string;
}

export interface LeaderboardEntry {
    id: number;
    score: number;
    scoreStatus: ScoreStatus;
    code: string;
    language: Language;
    createdAt: Date;
}

export interface GlobalStats {
    totalRoasts: number;
    averageScore: number;
}
