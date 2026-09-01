import { DocumentListView } from '@/components/documents/DocumentListView';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate } from '@/lib/utils';
import type { DeliveryNote } from '@/types';

export default function DeliveryNotesListPage() {
  return (
    <DocumentListView<DeliveryNote>
      title="Delivery Notes"
      subtitle="Proof-of-delivery notes for dispatched goods"
      endpoint="delivery-notes"
      newLabel="New Delivery Note"
      statuses={['DRAFT', 'DISPATCHED', 'DELIVERED', 'CANCELLED']}
      columns={[
        { header: 'Note No.', accessor: (r) => <span className="font-semibold text-navy">{r.number}</span> },
        { header: 'Client', accessor: (r) => r.client?.name ?? '—' },
        { header: 'Issue Date', accessor: (r) => formatDate(r.issueDate) },
        { header: 'Delivery Date', accessor: (r) => formatDate(r.deliveryDate) },
        { header: 'Items', accessor: (r) => r.items?.length ?? 0, className: 'text-right' },
        { header: 'Status', accessor: (r) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
