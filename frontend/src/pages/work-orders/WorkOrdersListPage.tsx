import { DocumentListView } from '@/components/documents/DocumentListView';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate } from '@/lib/utils';
import type { WorkOrder } from '@/types';

export default function WorkOrdersListPage() {
  return (
    <DocumentListView<WorkOrder>
      title="Work Orders"
      subtitle="Site work orders and task assignments"
      endpoint="work-orders"
      newLabel="New Work Order"
      statuses={['DRAFT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']}
      columns={[
        { header: 'Order No.', accessor: (r) => <span className="font-semibold text-navy">{r.number}</span> },
        { header: 'Client', accessor: (r) => r.client?.name ?? '—' },
        { header: 'Issue Date', accessor: (r) => formatDate(r.issueDate) },
        { header: 'Expected', accessor: (r) => formatDate(r.expectedDate) },
        { header: 'Tasks', accessor: (r) => r.tasks?.length ?? 0, className: 'text-right' },
        { header: 'Status', accessor: (r) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
