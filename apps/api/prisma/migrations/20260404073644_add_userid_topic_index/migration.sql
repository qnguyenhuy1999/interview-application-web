-- CreateIndex
CREATE INDEX "notes_user_id_topic_idx" ON "notes"("user_id", "topic");
