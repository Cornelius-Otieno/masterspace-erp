-- Preserve the account shown on existing invoices before introducing selection.
ALTER TABLE "Invoice" ADD COLUMN "bankAccountId" TEXT NOT NULL DEFAULT 'stanbic-usd-imaara';

ALTER TABLE "Receipt" ADD COLUMN "bankAccountId" TEXT NOT NULL DEFAULT 'stanbic-usd-imaara';