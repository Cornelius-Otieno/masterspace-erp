// Central enum definitions.
// SQLite (via Prisma) does not support native enums, so document status/role
// columns are stored as strings. These TypeScript enums give us the same
// type-safety and validation across the codebase.

export enum Role {
  ADMIN = 'ADMIN',
  FINANCE = 'FINANCE',
  SALES = 'SALES',
  PROCUREMENT = 'PROCUREMENT',
  WAREHOUSE = 'WAREHOUSE',
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum PurchaseOrderStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  APPROVED = 'APPROVED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

export enum QuotationStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export enum DeliveryStatus {
  DRAFT = 'DRAFT',
  DISPATCHED = 'DISPATCHED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum ReceiptStatus {
  DRAFT = 'DRAFT',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

export enum WorkOrderStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
