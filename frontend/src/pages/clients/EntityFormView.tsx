import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { api } from '@/lib/api';
import { Card, Field, GhostButton, PrimaryButton, TextArea, TextInput } from '@/components/ui/Form';
import { PageHeader } from '@/components/ui/PageHeader';
import type { Client } from '@/types';

interface Props {
  endpoint: 'clients' | 'suppliers';
  singular: string;
}

export function EntityFormView({ endpoint, singular }: Props) {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Client>>({ country: 'Kenya' });

  useEffect(() => {
    if (editing) {
      api.get<Client>(`/${endpoint}/${id}`).then((r) => setForm(r.data));
    }
  }, [id, editing, endpoint]);

  const set = (key: keyof Client, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async () => {
    setError(null);
    if (!form.name?.trim()) return setError(`${singular} name is required.`);
    setSaving(true);
    try {
      if (editing) await api.patch(`/${endpoint}/${id}`, form);
      else await api.post(`/${endpoint}`, form);
      navigate(`/${endpoint}`);
    } catch (e: any) {
      setError(e?.response?.data?.message || `Failed to save ${singular.toLowerCase()}.`);
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={editing ? `Edit ${singular}` : `New ${singular}`}
        actions={
          <GhostButton onClick={() => navigate(`/${endpoint}`)}>
            <ArrowLeft size={16} /> Back
          </GhostButton>
        }
      />
      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

      <Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Name" className="md:col-span-2">
            <TextInput value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} placeholder={`${singular} name`} />
          </Field>
          <Field label="Email">
            <TextInput type="email" value={form.email ?? ''} onChange={(e) => set('email', e.target.value)} />
          </Field>
          <Field label="Phone">
            <TextInput value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} />
          </Field>
          <Field label="City">
            <TextInput value={form.city ?? ''} onChange={(e) => set('city', e.target.value)} />
          </Field>
          <Field label="Country">
            <TextInput value={form.country ?? ''} onChange={(e) => set('country', e.target.value)} />
          </Field>
          <Field label="Tax PIN">
            <TextInput value={form.taxPin ?? ''} onChange={(e) => set('taxPin', e.target.value)} />
          </Field>
          <Field label="Address" className="md:col-span-2">
            <TextArea rows={2} value={form.address ?? ''} onChange={(e) => set('address', e.target.value)} />
          </Field>
          <Field label="Notes" className="md:col-span-2">
            <TextArea rows={2} value={form.notes ?? ''} onChange={(e) => set('notes', e.target.value)} />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <GhostButton onClick={() => navigate(`/${endpoint}`)}>Cancel</GhostButton>
          <PrimaryButton onClick={submit} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving…' : `Save ${singular}`}
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
}
