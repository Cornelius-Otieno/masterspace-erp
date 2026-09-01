import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DocumentTable, type Column } from '@/components/ui/DocumentTable';
import { PrimaryButton, Select, TextInput } from '@/components/ui/Form';
import { useDocuments } from '@/hooks/useDocuments';

interface Props<T> {
  title: string;
  subtitle?: string;
  endpoint: string;
  newLabel: string;
  statuses: string[];
  columns: Column<T>[];
}

export function DocumentListView<T extends { id: string }>({
  title,
  subtitle,
  endpoint,
  newLabel,
  statuses,
  columns,
}: Props<T>) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const { data, loading } = useDocuments<T>({ endpoint, search, status });

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

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <TextInput
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-48">
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s.replace('_', ' ')}
            </option>
          ))}
        </Select>
      </div>

      <DocumentTable
        columns={columns}
        rows={data}
        loading={loading}
        onRowClick={(row) => navigate(`/${endpoint}/${row.id}`)}
      />
    </div>
  );
}
