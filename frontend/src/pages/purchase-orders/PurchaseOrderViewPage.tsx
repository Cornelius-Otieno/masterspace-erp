import { DocumentViewShell } from '@/components/documents/DocumentViewShell';

export default function PurchaseOrderViewPage() {
  return (
    <DocumentViewShell
      type="purchase-order"
      endpoint="purchase-orders"
      title="Purchase Order"
      statuses={['DRAFT', 'SENT', 'APPROVED', 'RECEIVED', 'CANCELLED']}
    />
  );
}
