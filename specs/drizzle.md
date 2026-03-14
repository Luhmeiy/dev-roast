# Drizzle ORM Implementation - Specification

## 1. Overview

This document outlines the implementation of Drizzle ORM with PostgreSQL for the DevRoast application. The database will persist roast submissions, enable leaderboard rankings, and track global statistics.

## 2. Tech Stack

- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Infrastructure**: Docker Compose
- **Migration Tool**: Drizzle Kit

## 3. Database Schema

### 3.1 Enums

```typescript
// Score status based on roast severity
export const scoreStatusEnum = pgEnum("score_status", [
  "excellent",    // 8-10: Great code!
  "good",         // 6-7.9: Not bad
  "fair",         // 4-5.9: Could be worse
  "poor",         // 2-3.9: Needs work
  "critical",     // 0-1.9: Disaster
]);

// Programming languages supported
export const languageEnum = pgEnum("language", [
  "javascript",
  "typescript",
  "python",
  "java",
  "csharp",
  "cpp",
  "c",
  "go",
  "rust",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "scala",
  "html",
  "css",
  "sql",
  "bash",
  "powershell",
  "json",
  "yaml",
  "markdown",
  "plaintext",
]);
```

### 3.2 Tables

#### 3.2.1 Roasts Table

The main table storing all code roast submissions.

```typescript
export const roasts = pgTable("roasts", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  language: languageEnum("language").notNull().default("plaintext"),
  score: real("score").notNull(),
  scoreStatus: scoreStatusEnum("score_status").notNull(),
  roastMode: boolean("roast_mode").notNull().default(true),
  roastMessage: text("roast_message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  shareId: uuid("share_id").notNull().unique(),
});
```

#### 3.2.2 Leaderboard View

Instead of a separate table, create a view or query for the leaderboard:

```typescript
// Queryable leaderboard data (top worst codes)
export const leaderboard = pgTable("leaderboard", {
  // This is a view, not a table
});
```

## 4. Docker Compose Configuration

### 4.1 Services

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    container_name: devroast-db
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast_password
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devroast"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### 4.2 Environment Variables

```env
# .env.local
DATABASE_URL=postgresql://devroast:devroast_password@localhost:5432/devroast
```

## 5. Project Structure

```
src/
├── db/
│   ├── index.ts          # Database connection
│   ├── schema.ts         # Table definitions
│   ├── migrations/       # Drizzle migrations
│   └── seed.ts          # Seed data (optional)
└── lib/
    └── db.ts            # Singleton db instance
```

## 6. Implementation Tasks

### 6.1 Setup Tasks

- [x] Install Drizzle and PostgreSQL packages
  ```bash
  pnpm add drizzle-orm postgres dotenv
  pnpm add -D drizzle-kit
  ```
- [x] Create Docker Compose file for PostgreSQL
- [x] Configure `drizzle.config.ts`
- [x] Create database connection in `src/db/index.ts`
- [x] Define schema in `src/db/schema.ts`

### 6.2 Migration Tasks

- [ ] Generate initial migration
  ```bash
  pnpm db:generate
  ```
- [ ] Run migrations against local PostgreSQL
  ```bash
  pnpm db:migrate
  ```
- [ ] Verify tables created correctly

### 6.3 API/Service Tasks

- [x] Create `createRoast(code, language, roastMode)` function
- [x] Create `getRoastByShareId(shareId)` function
- [x] Create `getLeaderboard(limit)` function
- [x] Create `getGlobalStats()` function
- [x] Create `calculateScore(code, language)` function

### 6.4 Integration Tasks

- [ ] Update Home page to fetch leaderboard from DB
- [ ] Update roast submission to save to DB
- [ ] Add share functionality using shareId
- [ ] Implement global stats counter

## 7. API Design

### 7.1 Create Roast

```typescript
interface CreateRoastInput {
  code: string;
  language: string;
  roastMode: boolean;
}

interface CreateRoastOutput {
  id: number;
  shareId: string;
  score: number;
  scoreStatus: string;
  roastMessage: string;
}
```

### 7.2 Get Leaderboard

```typescript
interface LeaderboardEntry {
  id: number;
  score: number;
  scoreStatus: string;
  code: string;
  language: string;
  createdAt: Date;
}
```

### 7.3 Get Global Stats

```typescript
interface GlobalStats {
  totalRoasts: number;
  averageScore: number;
}
```

## 8. Scoring Logic

The score calculation should happen before storage:

| Score Range | Status    | Description           |
|-------------|-----------|----------------------|
| 8.0 - 10    | excellent | Great code!          |
| 6.0 - 7.9   | good      | Not bad              |
| 4.0 - 5.9   | fair      | Could be worse       |
| 2.0 - 3.9   | poor      | Needs work           |
| 0.0 - 1.9   | critical  | Disaster             |

## 9. Seed Data

Initial mock data for development:

```typescript
const seedRoasts = [
  {
    code: 'eval(prompt("enter code"))',
    language: "javascript",
    score: 1.2,
    scoreStatus: "critical",
    roastMode: true,
    roastMessage: "Using eval? That's a security vulnerability with extra steps!",
  },
  // ... more entries
];
```

## 10. Development Workflow

1. Start Docker Compose: `docker compose up -d`
2. Generate migration: `pnpm drizzle-kit generate`
3. Run migration: `pnpm drizzle-kit migrate`
4. (Optional) Seed data: `pnpm drizzle-kit seed`

## 11. References

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Drizzle Kit CLI](https://orm.drizzle.team/kit-docs/overview)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
