import { DocumentListView } from '@/components/documents/DocumentListView';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate, formatMoney } from '@/lib/utils';
import type { Receipt } from '@/types';

export default function ReceiptsListPage() {
  return (
    <DocumentListView<Receipt>
      title="Receipts"
      subtitle="Payment receipts issued to clients"
      endpoint="receipts"
      newLabel="New Receipt"
      statuses={['DRAFT', 'PAID', 'REFUNDED']}
      columns={[
        { header: 'Receipt No.', accessor: (r) => <span className="font-semibold text-navy">{r.number}</span> },
        { header: 'Client', accessor: (r) => r.client?.name ?? '—' },
        { header: 'Issue Date', accessor: (r) => formatDate(r.issueDate) },
        { header: 'Method', accessor: (r) => r.paymentMethod ?? '—' },
        { header: 'Total', accessor: (r) => formatMoney(r.total, r.currency), className: 'text-right' },
        { header: 'Status', accessor: (r) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
