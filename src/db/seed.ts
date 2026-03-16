import { faker } from "@faker-js/faker";
import postgres from "postgres";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);

const languages = [
    "javascript",
    "typescript",
    "python",
    "java",
    "csharp",
    "cpp",
    "go",
    "rust",
    "ruby",
    "php",
    "sql",
    "bash",
] as const;

type Language = (typeof languages)[number];

const roastMessages: Record<string, string[]> = {
    excellent: [
        "Clean code! Almost as clean as your empty wallet after buying indie games.",
        "Great job! Though I'm still gonna roast it a little bit.",
        "Solid code! Would love to work with this on a team.",
    ],
    good: [
        "Not bad! Could be worse, could be better.",
        "Decent work. Keep practicing and you'll get there.",
        "Pretty good! But I could still find some things to roast.",
    ],
    fair: [
        "It works, but... why though?",
        "Functional at least. That's what counts, right?",
        "I've seen worse, but not today apparently.",
    ],
    poor: [
        "This is... a choice. A bad one.",
        "Did you write this while sleepwalking?",
        "My grandma codes better than this, and she's been dead for 20 years.",
    ],
    critical: [
        "This is a security vulnerability wrapped in a crime against programming.",
        "I'd roast this more, but I don't have enough disk space for all the issues.",
        "This code is so bad even Stack Overflow is ashamed to show it.",
        "If this code were a movie, it'd be rated R for restricted.",
    ],
};

const codeSnippets: Record<Language, string[]> = {
    javascript: [
        `var x = prompt("Enter your password"); eval(x);`,
        `if (user.isAdmin == true) { return true; }`,
        `document.write('<script>alert("xss")</script>');`,
        `function getData() { return database.query("SELECT * FROM users"); }`,
        `const config = { apiKey: "sk-1234567890abcdef" };`,
        `setInterval(() => { eval(location.hash); }, 1000);`,
    ],
    typescript: [
        `const data: any = JSON.parse(userInput);`,
        `function login(user: string, pass: string) { return true; }`,
        `interface User { password: string; }`,
        `const secret = process.env.API_KEY as string;`,
    ],
    python: [
        `eval(input("Enter code: "))`,
        `import os; os.system("rm -rf /")`,
        `def auth(user, pass): return True`,
        `with open("passwords.txt", "w") as f: f.write(password)`,
        `exec("import os; os.system('rm -rf /')")`,
    ],
    java: [
        `String query = "SELECT * FROM users WHERE id=" + id;`,
        `public boolean isAdmin(String user) { return true; }`,
        `Connection conn = DriverManager.getConnection("jdbc:mysql://root:root@localhost/db");`,
        `new File("/").delete();`,
    ],
    csharp: [
        `var cmd = "SELECT * FROM Users WHERE id=" + id;`,
        `public bool IsAdmin(string user) => true;`,
        `string connStr = "Server=localhost;Uid=root;Pwd=password;";`,
    ],
    cpp: [
        `char buffer[100]; gets(buffer);`,
        `system("rm -rf /");`,
        `strcpy(password, input);`,
    ],
    go: [
        `exec.Command("rm", "-rf", "/")`,
        `query := "SELECT * FROM users WHERE id=" + id`,
        `func Auth(user, pass string) bool { return true }`,
    ],
    rust: [
        `let query = format!("SELECT * FROM users WHERE id={}", id);`,
        `unsafe { *(ptr as *mut Vec<u8>) }`,
    ],
    ruby: [
        `eval(params[:code])`,
        `system("rm -rf /")`,
        `User.find_by_sql("SELECT * FROM users WHERE " + params[:filter])`,
    ],
    php: [
        `$result = mysql_query($_GET['query']);`,
        `include $_POST['page'];`,
        `eval($_REQUEST['code']);`,
    ],
    sql: [
        `SELECT * FROM users WHERE id=` + "1",
        `DROP TABLE users;`,
        `SELECT password FROM users WHERE '1'='1'`,
        `INSERT INTO users (admin) VALUES (true);`,
    ],
    bash: [
        `rm -rf /`,
        `curl $URL | bash`,
        `chmod 777 $FILE`,
        `wget -O- $MALICIOUS_URL | sh`,
    ],
};

function getRandomElement<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function calculateScoreStatus(score: number): string {
    if (score >= 8) return "excellent";
    if (score >= 6) return "good";
    if (score >= 4) return "fair";
    if (score >= 2) return "poor";
    return "critical";
}

interface RoastIssue {
    type: "error" | "success";
    title: string;
    description: string;
}

interface DiffLine {
    type: "removed" | "added" | "context";
    code: string;
}

function generateIssues(scoreStatus: string): RoastIssue[] {
    const allIssues: RoastIssue[] = [
        {
            type: "error",
            title: "using deprecated method",
            description:
                "This code uses a deprecated method that may be removed in future versions.",
        },
        {
            type: "error",
            title: "no error handling",
            description:
                "This code lacks proper error handling, which could lead to unexpected crashes.",
        },
        {
            type: "error",
            title: "security vulnerability",
            description:
                "This code appears to have a security vulnerability that could be exploited.",
        },
        {
            type: "success",
            title: "working code",
            description:
                "At least the code actually works. That's more than I can say for most.",
        },
        {
            type: "success",
            title: "good naming",
            description:
                "The variable names are actually descriptive. Color me surprised.",
        },
    ];

    const count = scoreStatus === "critical" || scoreStatus === "poor" ? 3 : 2;
    return allIssues.sort(() => Math.random() - 0.5).slice(0, count);
}

function generateSuggestedFix(code: string): DiffLine[] {
    const lines = code.split("\n");
    const result: DiffLine[] = [];

    for (let i = 0; i < Math.min(lines.length + 2, 6); i++) {
        if (i === 0) {
            result.push({ type: "context", code: "function improvedCode() {" });
        } else if (i === lines.length + 1) {
            result.push({ type: "context", code: "}" });
        } else if (i - 1 < lines.length) {
            if (Math.random() > 0.5) {
                result.push({ type: "removed", code: `  ${lines[i - 1]}` });
                result.push({
                    type: "added",
                    code: `  // TODO: Fix this line`,
                });
            } else {
                result.push({ type: "context", code: `  ${lines[i - 1]}` });
            }
        }
    }

    return result;
}

function generateRoast(language: Language) {
    const code = getRandomElement(codeSnippets[language]);
    const score = Number((Math.random() * 10).toFixed(1));
    const scoreStatus = calculateScoreStatus(score);
    const roastMode = Math.random() > 0.2;
    const roastMessage = roastMode
        ? getRandomElement(roastMessages[scoreStatus])
        : "Code submitted successfully.";

    const issues = generateIssues(scoreStatus);
    const suggestedFix = generateSuggestedFix(code);

    return {
        code,
        language,
        score,
        scoreStatus,
        roastMode,
        roastMessage,
        verdict: roastMessage,
        issues,
        suggestedFix,
        shareId: faker.string.uuid(),
        createdAt: faker.date.between({
            from: new Date("2024-01-01"),
            to: new Date(),
        }),
    };
}

async function seed() {
    console.log("🌱 Seeding database...");

    // Clear existing roasts
    await client`DELETE FROM roasts`;

    const roasts: ReturnType<typeof generateRoast>[] = [];

    for (let i = 0; i < 100; i++) {
        const language = getRandomElement(languages);
        roasts.push(generateRoast(language));
    }

    for (const roast of roasts) {
        await client`
            INSERT INTO roasts (code, language, score, score_status, roast_mode, roast_message, verdict, issues, suggested_fix, created_at, share_id)
            VALUES (
                ${roast.code},
                ${roast.language},
                ${roast.score},
                ${roast.scoreStatus},
                ${roast.roastMode},
                ${roast.roastMessage},
                ${roast.verdict},
                ${JSON.stringify(roast.issues)},
                ${JSON.stringify(roast.suggestedFix)},
                ${roast.createdAt},
                ${roast.shareId}
            )
        `;
    }

    console.log("✅ Seeded 100 roasts!");

    const result = await client`SELECT COUNT(*) as count FROM roasts`;
    console.log(`📊 Total roasts in database: ${result[0].count}`);

    await client.end();
}

seed().catch(console.error);
