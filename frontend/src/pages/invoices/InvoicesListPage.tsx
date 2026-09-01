import { DocumentListView } from '@/components/documents/DocumentListView';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate, formatMoney } from '@/lib/utils';
import type { Invoice } from '@/types';

export default function InvoicesListPage() {
  return (
    <DocumentListView<Invoice>
      title="Invoices"
      subtitle="Tax invoices issued to clients"
      endpoint="invoices"
      newLabel="New Invoice"
      statuses={['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']}
      columns={[
        { header: 'Invoice No.', accessor: (r) => <span className="font-semibold text-navy">{r.number}</span> },
        { header: 'Client', accessor: (r) => r.client?.name ?? '—' },
        { header: 'Issue Date', accessor: (r) => formatDate(r.issueDate) },
        { header: 'Due Date', accessor: (r) => formatDate(r.dueDate) },
        { header: 'Total', accessor: (r) => formatMoney(r.total, r.currency), className: 'text-right' },
        { header: 'Status', accessor: (r) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
