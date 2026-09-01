import { DocumentViewShell } from '@/components/documents/DocumentViewShell';

export default function QuotationViewPage() {
  return (
    <DocumentViewShell
      type="quotation"
      endpoint="quotations"
      title="Quotation"
      statuses={['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED']}
    />
  );
}
