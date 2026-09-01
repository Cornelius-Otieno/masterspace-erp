import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { api } from '@/lib/api';
import { Card, Field, GhostButton, PrimaryButton, Select, TextArea, TextInput } from '@/components/ui/Form';
import { PageHeader } from '@/components/ui/PageHeader';
import { LineItemsEditor } from '@/components/documents/LineItemsEditor';
import { toInputDate } from '@/lib/utils';
import type { Client, DeliveryItem, DeliveryNote } from '@/types';

const newItem = (): DeliveryItem => ({ description: '', quantity: 1, unit: '', remarks: '' });

export default function DeliveryNoteFormPage() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();

  const [clients, setClients] = useState<Client[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [clientId, setClientId] = useState('');
  const [number, setNumber] = useState('');
  const [issueDate, setIssueDate] = useState(toInputDate(new Date()));
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveredBy, setDeliveredBy] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<DeliveryItem[]>([newItem()]);

  useEffect(() => {
    api.get('/clients', { params: { limit: 200 } }).then((r) => setClients(r.data.data));
    if (editing) {
      api.get<DeliveryNote>(`/delivery-notes/${id}`).then((r) => {
        const d = r.data;
        setClientId(d.clientId);
        setNumber(d.number);
        setIssueDate(toInputDate(d.issueDate));
        setDeliveryDate(toInputDate(d.deliveryDate));
        setDeliveredBy(d.deliveredBy ?? '');
        setStatus(d.status);
        setNotes(d.notes ?? '');
        setItems(d.items.map((it) => ({ description: it.description, quantity: it.quantity, unit: it.unit ?? '', remarks: it.remarks ?? '' })));
      });
    }
  }, [id, editing]);

  const submit = async () => {
    setError(null);
    if (!clientId) return setError('Please select a client.');
    if (items.some((it) => !it.description.trim())) return setError('Every line item needs a description.');
    setSaving(true);
    const payload = { clientId, number: number.trim() || undefined, issueDate, deliveryDate: deliveryDate || undefined, deliveredBy: deliveredBy || undefined, status, notes: notes || undefined, items };
    try {
      const res = editing ? await api.patch(`/delivery-notes/${id}`, payload) : await api.post('/delivery-notes', payload);
      navigate(`/delivery-notes/${res.data.id}`);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to save delivery note.');
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={editing ? 'Edit Delivery Note' : 'New Delivery Note'}
        actions={
          <GhostButton onClick={() => navigate('/delivery-notes')}>
            <ArrowLeft size={16} /> Back
          </GhostButton>
        }
      />
      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

      <div className="space-y-5">
        <Card>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Client">
              <Select value={clientId} onChange={(e) => setClientId(e.target.value)}>
                <option value="">Select client…</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Delivery Note Number">
              <TextInput value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Leave blank to auto-generate" disabled={editing} />
            </Field>
            <Field label="Delivered By">
              <TextInput value={deliveredBy} onChange={(e) => setDeliveredBy(e.target.value)} placeholder="Driver / staff" />
            </Field>
            <Field label="Status">
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                {['DRAFT', 'DISPATCHED', 'DELIVERED', 'CANCELLED'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </Field>
            <Field label="Issue Date">
              <TextInput type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
            </Field>
            <Field label="Delivery Date">
              <TextInput type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
            </Field>
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 text-sm font-semibold text-navy">Delivered Items</h3>
          <LineItemsEditor<DeliveryItem>
            columns={[
              { key: 'description', label: 'Description', placeholder: 'Item delivered', width: '45%' },
              { key: 'quantity', label: 'Qty', type: 'number', step: 'any', width: '12%' },
              { key: 'unit', label: 'Unit', placeholder: 'pcs', width: '13%' },
              { key: 'remarks', label: 'Remarks', placeholder: 'Condition', width: '30%' },
            ]}
            items={items}
            onChange={setItems}
            newItem={newItem}
            rowLabel="Item"
          />
        </Card>

        <Card>
          <Field label="Notes">
            <TextArea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Delivery remarks…" />
          </Field>
        </Card>

        <div className="flex justify-end gap-2">
          <GhostButton onClick={() => navigate('/delivery-notes')}>Cancel</GhostButton>
          <PrimaryButton onClick={submit} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving…' : 'Save Delivery Note'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
