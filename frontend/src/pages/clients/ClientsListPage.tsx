import { EntityListView } from './EntityListView';

export default function ClientsListPage() {
  return (
    <EntityListView
      title="Clients"
      subtitle="Customers and organisations you invoice"
      endpoint="clients"
      newLabel="New Client"
    />
  );
}
