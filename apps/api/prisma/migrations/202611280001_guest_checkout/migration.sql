ALTER TABLE "Order"
    ALTER COLUMN "userId" DROP NOT NULL,
    ADD COLUMN "guestKey" UUID;

ALTER TABLE "Order" ADD CONSTRAINT "Order_owner_check"
    CHECK (("userId" IS NULL) <> ("guestKey" IS NULL));

CREATE UNIQUE INDEX "Order_guestKey_requestId_key" ON "Order"("guestKey", "requestId");

CREATE TABLE "OrderConfirmation" (
    "orderId" UUID NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    CONSTRAINT "OrderConfirmation_pkey" PRIMARY KEY ("orderId"),
    CONSTRAINT "OrderConfirmation_orderId_fkey" FOREIGN KEY ("orderId")
        REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "OrderConfirmation_sentAt_nextAttemptAt_idx"
    ON "OrderConfirmation"("sentAt", "nextAttemptAt");
