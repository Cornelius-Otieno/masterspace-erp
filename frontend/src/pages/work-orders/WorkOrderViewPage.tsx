import { DocumentViewShell } from '@/components/documents/DocumentViewShell';

export default function WorkOrderViewPage() {
  return (
    <DocumentViewShell
      type="work-order"
      endpoint="work-orders"
      title="Work Order"
      statuses={['DRAFT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']}
    />
  );
}
