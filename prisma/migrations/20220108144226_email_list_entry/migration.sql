-- CreateTable
CREATE TABLE "email_list_entries" (
    "email" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "email_list_entries_email_key" ON "email_list_entries"("email");
