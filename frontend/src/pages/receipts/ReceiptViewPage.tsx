import { DocumentViewShell } from '@/components/documents/DocumentViewShell';

export default function ReceiptViewPage() {
  return (
    <DocumentViewShell
      type="receipt"
      endpoint="receipts"
      title="Receipt"
      statuses={['DRAFT', 'PAID', 'REFUNDED']}
    />
  );
}
