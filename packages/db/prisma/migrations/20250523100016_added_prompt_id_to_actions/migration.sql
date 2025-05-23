-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "promptId" TEXT;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE SET NULL ON UPDATE CASCADE;
