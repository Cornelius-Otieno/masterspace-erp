import { DocumentListView } from '@/components/documents/DocumentListView';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate, formatMoney } from '@/lib/utils';
import type { PurchaseOrder } from '@/types';

export default function PurchaseOrdersListPage() {
  return (
    <DocumentListView<PurchaseOrder>
      title="Purchase Orders"
      subtitle="Local purchase / service orders to suppliers"
      endpoint="purchase-orders"
      newLabel="New Purchase Order"
      statuses={['DRAFT', 'SENT', 'APPROVED', 'RECEIVED', 'CANCELLED']}
      columns={[
        { header: 'Order No.', accessor: (r) => <span className="font-semibold text-navy">{r.number}</span> },
        { header: 'Supplier', accessor: (r) => r.supplier?.name ?? '—' },
        { header: 'Issue Date', accessor: (r) => formatDate(r.issueDate) },
        { header: 'Expected', accessor: (r) => formatDate(r.expectedDate) },
        { header: 'Total', accessor: (r) => formatMoney(r.total, r.currency), className: 'text-right' },
        { header: 'Status', accessor: (r) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
