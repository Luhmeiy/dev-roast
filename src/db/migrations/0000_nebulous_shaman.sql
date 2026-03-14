CREATE TYPE "public"."language" AS ENUM('javascript', 'typescript', 'python', 'java', 'csharp', 'cpp', 'c', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'scala', 'html', 'css', 'sql', 'bash', 'powershell', 'json', 'yaml', 'markdown', 'plaintext');--> statement-breakpoint
CREATE TYPE "public"."score_status" AS ENUM('excellent', 'good', 'fair', 'poor', 'critical');--> statement-breakpoint
CREATE TABLE "roasts" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"language" "language" DEFAULT 'plaintext' NOT NULL,
	"score" real NOT NULL,
	"score_status" "score_status" NOT NULL,
	"roast_mode" boolean DEFAULT true NOT NULL,
	"roast_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"share_id" uuid NOT NULL,
	CONSTRAINT "roasts_share_id_unique" UNIQUE("share_id")
);
