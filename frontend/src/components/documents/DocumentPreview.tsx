import type {
  Invoice,
  PurchaseOrder,
  Quotation,
  DeliveryNote,
  Receipt,
  WorkOrder,
} from '@/types';
import { InvoiceTemplate } from './InvoiceTemplate';
import { PurchaseOrderTemplate } from './PurchaseOrderTemplate';
import { QuotationTemplate } from './QuotationTemplate';
import { DeliveryNoteTemplate } from './DeliveryNoteTemplate';
import { ReceiptTemplate } from './ReceiptTemplate';
import { WorkOrderTemplate } from './WorkOrderTemplate';

type DocType = 'invoice' | 'purchase-order' | 'quotation' | 'delivery-note' | 'receipt' | 'work-order';

interface DocumentPreviewProps {
  type: DocType;
  data: any;
}

/** Routes to the correct print-ready template based on document type. */
export function DocumentPreview({ type, data }: DocumentPreviewProps) {
  switch (type) {
    case 'invoice':
      return <InvoiceTemplate invoice={data as Invoice} />;
    case 'purchase-order':
      return <PurchaseOrderTemplate po={data as PurchaseOrder} />;
    case 'quotation':
      return <QuotationTemplate quotation={data as Quotation} />;
    case 'delivery-note':
      return <DeliveryNoteTemplate note={data as DeliveryNote} />;
    case 'receipt':
      return <ReceiptTemplate receipt={data as Receipt} />;
    case 'work-order':
      return <WorkOrderTemplate workOrder={data as WorkOrder} />;
    default:
      return null;
  }
}
