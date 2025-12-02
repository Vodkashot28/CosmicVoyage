CREATE TABLE "analytics_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_id" varchar(255),
	"wallet_address" varchar(255),
	"event_type" varchar(100) NOT NULL,
	"event_data" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "daily_analytics_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" varchar(10),
	"total_new_players" integer DEFAULT 0,
	"total_discoveries" integer DEFAULT 0,
	"total_nfts_minted" integer DEFAULT 0,
	"total_star_distributed" integer DEFAULT 0,
	"total_star_burned" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "daily_analytics_stats_date_unique" UNIQUE("date")
);
--> statement-breakpoint
CREATE TABLE "daily_login_rewards" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"wallet_address" text NOT NULL,
	"streak" integer DEFAULT 1,
	"last_login_date" timestamp DEFAULT now(),
	"total_login_days" integer DEFAULT 1,
	"total_rewards_claimed" integer DEFAULT 0,
	"last_claimed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "email_verifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"verified_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "email_verifications_email_unique" UNIQUE("email"),
	CONSTRAINT "email_verifications_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_username_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "orbital_offsets" text;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "username";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "password";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");