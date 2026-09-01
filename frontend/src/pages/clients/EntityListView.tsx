import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DocumentTable } from '@/components/ui/DocumentTable';
import { PrimaryButton, TextInput } from '@/components/ui/Form';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useDocuments, deleteDocument } from '@/hooks/useDocuments';
import type { Client } from '@/types';

interface Props {
  title: string;
  subtitle: string;
  endpoint: 'clients' | 'suppliers';
  newLabel: string;
}

export function EntityListView({ title, subtitle, endpoint, newLabel }: Props) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { data, loading, refetch } = useDocuments<Client>({ endpoint, search });
  const [toDelete, setToDelete] = useState<Client | null>(null);

  const confirmDelete = async () => {
    if (!toDelete) return;
    await deleteDocument(endpoint, toDelete.id);
    setToDelete(null);
    refetch();
  };

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <PrimaryButton onClick={() => navigate(`/${endpoint}/new`)}>
            <Plus size={16} /> {newLabel}
          </PrimaryButton>
        }
      />

      <div className="mb-4 relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <TextInput placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <DocumentTable<Client>
        columns={[
          { header: 'Name', accessor: (r) => <span className="font-semibold text-navy">{r.name}</span> },
          { header: 'Email', accessor: (r) => r.email || '—' },
          { header: 'Phone', accessor: (r) => r.phone || '—' },
          { header: 'City', accessor: (r) => r.city || '—' },
          { header: 'Tax PIN', accessor: (r) => r.taxPin || '—' },
          {
            header: 'Actions',
            className: 'text-right',
            accessor: (r) => (
              <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => navigate(`/${endpoint}/${r.id}/edit`)} className="rounded p-1.5 text-slate-500 hover:bg-teal-light hover:text-primary" title="Edit">
                  <Pencil size={15} />
                </button>
                <button onClick={() => setToDelete(r)} className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600" title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            ),
          },
        ]}
        rows={data}
        loading={loading}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title={`Delete ${title.replace(/s$/, '')}`}
        message={`Delete ${toDelete?.name}? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
