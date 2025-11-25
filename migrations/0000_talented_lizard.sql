CREATE TABLE "burn_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"wallet_address" text NOT NULL,
	"utility" varchar(50) NOT NULL,
	"amount_burned" integer NOT NULL,
	"balance_after" integer NOT NULL,
	"description" text,
	"burned_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "daily_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp DEFAULT now(),
	"total_new_players" integer DEFAULT 0,
	"total_discoveries" integer DEFAULT 0,
	"total_nfts_minted" integer DEFAULT 0,
	"total_star_distributed" integer DEFAULT 0,
	"total_star_burned" integer DEFAULT 0,
	"total_passive_income_claimed" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "discoveries" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"wallet_address" text NOT NULL,
	"celestial_object_name" text NOT NULL,
	"discovery_order" integer NOT NULL,
	"object_type" varchar(20) NOT NULL,
	"token_reward_awarded" integer NOT NULL,
	"discovered_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "game_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"wallet_address" text NOT NULL,
	"total_discovered" integer DEFAULT 0,
	"total_nfts_minted" integer DEFAULT 0,
	"total_star_earned" integer DEFAULT 0,
	"total_star_burned" integer DEFAULT 0,
	"current_phase" varchar(20) DEFAULT 'phase1',
	"last_activity_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "game_progress_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "game_progress_wallet_address_unique" UNIQUE("wallet_address")
);
--> statement-breakpoint
CREATE TABLE "nfts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"wallet_address" text NOT NULL,
	"token_id" text NOT NULL,
	"celestial_object_name" text NOT NULL,
	"object_type" varchar(20) NOT NULL,
	"discovery_order" integer NOT NULL,
	"rarity" varchar(20) NOT NULL,
	"glow_color" text,
	"passive_income_rate" double precision DEFAULT 0.5,
	"minted_at" timestamp DEFAULT now(),
	"last_passive_income_claim" timestamp,
	CONSTRAINT "nfts_token_id_unique" UNIQUE("token_id")
);
--> statement-breakpoint
CREATE TABLE "passive_income_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"wallet_address" text NOT NULL,
	"nft_count" integer NOT NULL,
	"hours_elapsed" double precision NOT NULL,
	"income_earned" integer NOT NULL,
	"claimed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "referral_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"referrer_id" integer NOT NULL,
	"referrer_wallet" text NOT NULL,
	"referred_id" integer NOT NULL,
	"referred_wallet" text NOT NULL,
	"bonus_awarded" integer NOT NULL,
	"tier" integer NOT NULL,
	"referral_code" text,
	"claimed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "set_bonuses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"wallet_address" text NOT NULL,
	"bonus_name" varchar(100) NOT NULL,
	"description" text,
	"nft_count" integer NOT NULL,
	"daily_bonus" integer NOT NULL,
	"achieved_at" timestamp DEFAULT now(),
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"wallet_address" text,
	"star_balance" integer DEFAULT 0,
	"genesis_claimed_at" timestamp,
	"referral_code" text,
	"referred_by_wallet" text,
	"referral_count" integer DEFAULT 0,
	"referral_bonus_earned" integer DEFAULT 0,
	"last_referral_bonus" timestamp,
	"total_passive_income_claimed" integer DEFAULT 0,
	"last_passive_income_claim" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_wallet_address_unique" UNIQUE("wallet_address"),
	CONSTRAINT "users_referral_code_unique" UNIQUE("referral_code")
);
