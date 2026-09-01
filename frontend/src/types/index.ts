// ---------------- Shared enums (string literals mirror backend) ----------------
export type Role = 'ADMIN' | 'FINANCE' | 'SALES' | 'PROCUREMENT' | 'WAREHOUSE';

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type PurchaseOrderStatus = 'DRAFT' | 'SENT' | 'APPROVED' | 'RECEIVED' | 'CANCELLED';
export type QuotationStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
export type DeliveryStatus = 'DRAFT' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
export type ReceiptStatus = 'DRAFT' | 'PAID' | 'REFUNDED';
export type WorkOrderStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type AnyStatus =
  | InvoiceStatus
  | PurchaseOrderStatus
  | QuotationStatus
  | DeliveryStatus
  | ReceiptStatus
  | WorkOrderStatus;

// ---------------- Core entities ----------------
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  taxPin?: string;
  notes?: string;
  createdAt?: string;
}

export interface Supplier extends Client {}

// ---------------- Line items ----------------
export interface InvoiceItem {
  id?: string;
  description: string;
  taxRate: number;
  quantity: number;
  rate: number;
  amount?: number;
  taxAmount?: number;
  total?: number;
}

export interface POItem {
  id?: string;
  description: string;
  unit?: string;
  quantity: number;
  rate: number;
  amount?: number;
}

export interface QuotationItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount?: number;
}

export interface DeliveryItem {
  id?: string;
  description: string;
  quantity: number;
  unit?: string;
  remarks?: string;
}

export interface ReceiptItem {
  id?: string;
  description: string;
  milestone?: string;
  amount: number;
}

export interface WorkOrderTask {
  id?: string;
  task: string;
  description?: string;
  assignedTo?: string;
  estimatedHours: number;
}

// ---------------- Documents ----------------
export interface Invoice {
  id: string;
  number: string;
  contractNo?: string;
  clientId: string;
  client?: Client;
  issueDate: string;
  dueDate?: string;
  currency: string;
  status: InvoiceStatus;
  subtotal: number;
  taxTotal: number;
  total: number;
  totalInWords?: string;
  notes?: string;
  items: InvoiceItem[];
  createdAt?: string;
}

export interface PurchaseOrder {
  id: string;
  number: string;
  supplierId: string;
  supplier?: Supplier;
  deliverTo?: string;
  issueDate: string;
  expectedDate?: string;
  currency: string;
  status: PurchaseOrderStatus;
  subtotal: number;
  total: number;
  notes?: string;
  preparedBy?: string;
  items: POItem[];
  createdAt?: string;
}

export interface Quotation {
  id: string;
  number: string;
  clientId: string;
  client?: Client;
  issueDate: string;
  validUntil?: string;
  currency: string;
  status: QuotationStatus;
  subtotal: number;
  taxTotal: number;
  total: number;
  notes?: string;
  terms?: string;
  items: QuotationItem[];
  createdAt?: string;
}

export interface DeliveryNote {
  id: string;
  number: string;
  clientId: string;
  client?: Client;
  issueDate: string;
  deliveryDate?: string;
  deliveredBy?: string;
  status: DeliveryStatus;
  notes?: string;
  items: DeliveryItem[];
  createdAt?: string;
}

export interface Receipt {
  id: string;
  number: string;
  clientId: string;
  client?: Client;
  invoiceId?: string;
  invoice?: Invoice;
  contractNo?: string;
  issueDate: string;
  currency: string;
  status: ReceiptStatus;
  subtotal: number;
  total: number;
  paymentMethod?: string;
  paymentRef?: string;
  notes?: string;
  preparedBy?: string;
  approvedBy?: string;
  items: ReceiptItem[];
  createdAt?: string;
}

export interface WorkOrder {
  id: string;
  number: string;
  clientId: string;
  client?: Client;
  siteDetails?: string;
  issueDate: string;
  expectedDate?: string;
  status: WorkOrderStatus;
  notes?: string;
  authorizedBy?: string;
  tasks: WorkOrderTask[];
  createdAt?: string;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface DashboardStats {
  invoices: { count: number; totalsByCurrency: Record<string, number> };
  purchaseOrders: { count: number; totalsByCurrency: Record<string, number> };
  quotations: { count: number; totalsByCurrency: Record<string, number> };
  deliveryNotes: { count: number; total: number };
  receipts: { count: number; totalsByCurrency: Record<string, number> };
  workOrders: { count: number; total: number };
  clients: number;
  suppliers: number;
}
