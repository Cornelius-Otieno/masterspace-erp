import { DocumentListView } from '@/components/documents/DocumentListView';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate, formatMoney } from '@/lib/utils';
import type { Quotation } from '@/types';

export default function QuotationsListPage() {
  return (
    <DocumentListView<Quotation>
      title="Quotations"
      subtitle="Price quotations sent to clients"
      endpoint="quotations"
      newLabel="New Quotation"
      statuses={['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED']}
      columns={[
        { header: 'Quote No.', accessor: (r) => <span className="font-semibold text-navy">{r.number}</span> },
        { header: 'Client', accessor: (r) => r.client?.name ?? '—' },
        { header: 'Issue Date', accessor: (r) => formatDate(r.issueDate) },
        { header: 'Valid Until', accessor: (r) => formatDate(r.validUntil) },
        { header: 'Total', accessor: (r) => formatMoney(r.total, r.currency), className: 'text-right' },
        { header: 'Status', accessor: (r) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
