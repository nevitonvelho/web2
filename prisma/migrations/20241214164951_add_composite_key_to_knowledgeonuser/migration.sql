/*
  Warnings:

  - A unique constraint covering the columns `[userId,knowledgeId]` on the table `KnowledgeOnUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeOnUser_userId_knowledgeId_key" ON "KnowledgeOnUser"("userId", "knowledgeId");
