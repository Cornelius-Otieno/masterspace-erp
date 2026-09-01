import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { api } from '@/lib/api';
import { Card, Field, GhostButton, PrimaryButton, Select, TextArea, TextInput } from '@/components/ui/Form';
import { PageHeader } from '@/components/ui/PageHeader';
import { LineItemsEditor } from '@/components/documents/LineItemsEditor';
import { formatMoney, toInputDate } from '@/lib/utils';
import type { POItem, PurchaseOrder, Supplier } from '@/types';

const newItem = (): POItem => ({ description: '', unit: '', quantity: 1, rate: 0 });

export default function PurchaseOrderFormPage() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [supplierId, setSupplierId] = useState('');
  const [deliverTo, setDeliverTo] = useState('');
  const [issueDate, setIssueDate] = useState(toInputDate(new Date()));
  const [expectedDate, setExpectedDate] = useState('');
  const [currency, setCurrency] = useState('KES');
  const [status, setStatus] = useState('DRAFT');
  const [preparedBy, setPreparedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<POItem[]>([newItem()]);

  useEffect(() => {
    api.get('/suppliers', { params: { limit: 200 } }).then((r) => setSuppliers(r.data.data));
    if (editing) {
      api.get<PurchaseOrder>(`/purchase-orders/${id}`).then((r) => {
        const d = r.data;
        setSupplierId(d.supplierId);
        setDeliverTo(d.deliverTo ?? '');
        setIssueDate(toInputDate(d.issueDate));
        setExpectedDate(toInputDate(d.expectedDate));
        setCurrency(d.currency);
        setStatus(d.status);
        setPreparedBy(d.preparedBy ?? '');
        setNotes(d.notes ?? '');
        setItems(d.items.map((it) => ({ description: it.description, unit: it.unit ?? '', quantity: it.quantity, rate: it.rate })));
      });
    }
  }, [id, editing]);

  const total = items.reduce((s, it) => s + it.quantity * it.rate, 0);

  const submit = async () => {
    setError(null);
    if (!supplierId) return setError('Please select a supplier.');
    if (items.some((it) => !it.description.trim())) return setError('Every line item needs a description.');
    setSaving(true);
    const payload = { supplierId, deliverTo: deliverTo || undefined, issueDate, expectedDate: expectedDate || undefined, currency, status, preparedBy: preparedBy || undefined, notes: notes || undefined, items };
    try {
      const res = editing ? await api.patch(`/purchase-orders/${id}`, payload) : await api.post('/purchase-orders', payload);
      navigate(`/purchase-orders/${res.data.id}`);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to save purchase order.');
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={editing ? 'Edit Purchase Order' : 'New Purchase Order'}
        actions={
          <GhostButton onClick={() => navigate('/purchase-orders')}>
            <ArrowLeft size={16} /> Back
          </GhostButton>
        }
      />
      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

      <div className="space-y-5">
        <Card>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Supplier">
              <Select value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
                <option value="">Select supplier…</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Deliver To">
              <TextInput value={deliverTo} onChange={(e) => setDeliverTo(e.target.value)} placeholder="Delivery location" />
            </Field>
            <Field label="Currency">
              <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="KES">KES</option>
                <option value="USD">USD</option>
              </Select>
            </Field>
            <Field label="Issue Date">
              <TextInput type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
            </Field>
            <Field label="Expected Date">
              <TextInput type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} />
            </Field>
            <Field label="Status">
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                {['DRAFT', 'SENT', 'APPROVED', 'RECEIVED', 'CANCELLED'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </Field>
            <Field label="Prepared By">
              <TextInput value={preparedBy} onChange={(e) => setPreparedBy(e.target.value)} placeholder="Name" />
            </Field>
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 text-sm font-semibold text-navy">Line Items</h3>
          <LineItemsEditor<POItem>
            columns={[
              { key: 'description', label: 'Description', placeholder: 'Item / service', width: '45%' },
              { key: 'unit', label: 'Unit', placeholder: 'pcs', width: '13%' },
              { key: 'quantity', label: 'Qty', type: 'number', step: 'any', width: '12%' },
              { key: 'rate', label: 'Rate', type: 'number', step: 'any', width: '18%' },
            ]}
            items={items}
            onChange={setItems}
            newItem={newItem}
            computeRow={(r) => formatMoney(r.quantity * r.rate, currency)}
            rowLabel="Item"
          />
          <div className="mt-4 flex justify-end">
            <div className="w-64 text-sm">
              <div className="flex justify-between border-t border-slate-200 pt-1 font-semibold text-navy"><span>Total</span><span>{formatMoney(total, currency)}</span></div>
            </div>
          </div>
        </Card>

        <Card>
          <Field label="Notes">
            <TextArea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Terms & conditions, remarks…" />
          </Field>
        </Card>

        <div className="flex justify-end gap-2">
          <GhostButton onClick={() => navigate('/purchase-orders')}>Cancel</GhostButton>
          <PrimaryButton onClick={submit} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving…' : 'Save Purchase Order'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
