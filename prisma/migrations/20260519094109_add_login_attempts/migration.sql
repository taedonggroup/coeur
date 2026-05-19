-- CreateTable
CREATE TABLE "LoginAttempt" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "ok" BOOLEAN NOT NULL,
    "username" TEXT,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LoginAttempt_ip_attemptedAt_idx" ON "LoginAttempt"("ip", "attemptedAt");

-- CreateIndex
CREATE INDEX "LoginAttempt_attemptedAt_idx" ON "LoginAttempt"("attemptedAt");
