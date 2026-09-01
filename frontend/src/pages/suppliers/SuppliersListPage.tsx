import { EntityListView } from '@/pages/clients/EntityListView';

export default function SuppliersListPage() {
  return (
    <EntityListView
      title="Suppliers"
      subtitle="Vendors you raise purchase orders to"
      endpoint="suppliers"
      newLabel="New Supplier"
    />
  );
}
