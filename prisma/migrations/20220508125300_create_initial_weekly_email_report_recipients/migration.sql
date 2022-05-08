INSERT INTO "weekly_email_report_recipients" (
  "id",
  "email",
  "origin_id",
  "updated_at"
) SELECT
  uuid_generate_v4(),
  "users"."email",
  "origins"."id",
  NOW()
  FROM "origin_users"
  LEFT JOIN "users" ON "origin_users"."user_id" = "users"."id"
  LEFT JOIN "origins" ON "origin_users"."origin_id" = "origins"."id"
  WHERE "origins"."weekly_email_reports_enabled" = TRUE
