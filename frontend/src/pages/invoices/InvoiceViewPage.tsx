import { DocumentViewShell } from '@/components/documents/DocumentViewShell';

export default function InvoiceViewPage() {
  return (
    <DocumentViewShell
      type="invoice"
      endpoint="invoices"
      title="Invoice"
      statuses={['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']}
    />
  );
}
