ALTER TABLE "fb_fe_actions_findings" ALTER COLUMN "campaignId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "fb_fe_actions_findings" ALTER COLUMN "actionId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "fb_fe_actions_findings" ALTER COLUMN "findingId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "fb_fe_findings" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "fb_fe_findings" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "fb_fe_findings" ALTER COLUMN "moreInfoURL" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "fb_fe_campaigns" ADD COLUMN "startedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "fb_fe_campaigns" ADD COLUMN "endedAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "fb_fe_findings" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "fb_fe_hints" ADD COLUMN "value" text;--> statement-breakpoint
ALTER TABLE "fb_fe_hints" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "fb_fe_hints" DROP COLUMN "formValues";