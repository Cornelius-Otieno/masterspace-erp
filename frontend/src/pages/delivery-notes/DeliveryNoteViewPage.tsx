import { DocumentViewShell } from '@/components/documents/DocumentViewShell';

export default function DeliveryNoteViewPage() {
  return (
    <DocumentViewShell
      type="delivery-note"
      endpoint="delivery-notes"
      title="Delivery Note"
      statuses={['DRAFT', 'DISPATCHED', 'DELIVERED', 'CANCELLED']}
    />
  );
}
