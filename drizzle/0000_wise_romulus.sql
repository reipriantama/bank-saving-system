CREATE TYPE "public"."txn_type" AS ENUM('deposit', 'withdraw');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"packet" text NOT NULL,
	"balance" numeric(18, 2) DEFAULT '0' NOT NULL,
	"customer_id" integer NOT NULL,
	"deposito_type_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deposito_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"yearly_return" numeric(12, 6) NOT NULL,
	CONSTRAINT "deposito_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "txn_type" NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"date" timestamp NOT NULL,
	"account_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_deposito_type_id_deposito_types_id_fk" FOREIGN KEY ("deposito_type_id") REFERENCES "public"."deposito_types"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;