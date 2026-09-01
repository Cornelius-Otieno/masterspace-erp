import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { api } from '@/lib/api';
import { Card, Field, GhostButton, PrimaryButton, Select, TextArea, TextInput } from '@/components/ui/Form';
import { PageHeader } from '@/components/ui/PageHeader';
import { LineItemsEditor } from '@/components/documents/LineItemsEditor';
import { formatMoney, toInputDate } from '@/lib/utils';
import type { Client, Invoice, InvoiceItem } from '@/types';

const newItem = (): InvoiceItem => ({ description: '', taxRate: 16, quantity: 1, rate: 0 });

export default function InvoiceFormPage() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();

  const [clients, setClients] = useState<Client[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [clientId, setClientId] = useState('');
  const [number, setNumber] = useState('');
  const [contractNo, setContractNo] = useState('');
  const [issueDate, setIssueDate] = useState(toInputDate(new Date()));
  const [dueDate, setDueDate] = useState('');
  const [currency, setCurrency] = useState('KES');
  const [status, setStatus] = useState('DRAFT');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([newItem()]);

  useEffect(() => {
    api.get('/clients', { params: { limit: 200 } }).then((r) => setClients(r.data.data));
    if (editing) {
      api.get<Invoice>(`/invoices/${id}`).then((r) => {
        const d = r.data;
        setClientId(d.clientId);
        setNumber(d.number);
        setContractNo(d.contractNo ?? '');
        setIssueDate(toInputDate(d.issueDate));
        setDueDate(toInputDate(d.dueDate));
        setCurrency(d.currency);
        setStatus(d.status);
        setNotes(d.notes ?? '');
        setItems(d.items.map((it) => ({ description: it.description, taxRate: it.taxRate, quantity: it.quantity, rate: it.rate })));
      });
    }
  }, [id, editing]);

  const subtotal = items.reduce((s, it) => s + it.quantity * it.rate, 0);
  const taxTotal = items.reduce((s, it) => s + (it.quantity * it.rate * it.taxRate) / 100, 0);
  const total = subtotal + taxTotal;

  const submit = async () => {
    setError(null);
    if (!clientId) return setError('Please select a client.');
    if (items.some((it) => !it.description.trim())) return setError('Every line item needs a description.');
    setSaving(true);
    const payload = { clientId, number: number.trim() || undefined, contractNo: contractNo || undefined, issueDate, dueDate: dueDate || undefined, currency, status, notes: notes || undefined, items };
    try {
      const res = editing ? await api.patch(`/invoices/${id}`, payload) : await api.post('/invoices', payload);
      navigate(`/invoices/${res.data.id}`);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to save invoice.');
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={editing ? 'Edit Invoice' : 'New Invoice'}
        actions={
          <GhostButton onClick={() => navigate('/invoices')}>
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
            <Field label="Contract / LPO No.">
              <TextInput value={contractNo} onChange={(e) => setContractNo(e.target.value)} placeholder="Optional" />
            </Field>
            <Field label="Invoice Number">
              <TextInput value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Leave blank to auto-generate" disabled={editing} />
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
            <Field label="Due Date">
              <TextInput type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </Field>
            <Field label="Status">
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                {['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </Field>
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 text-sm font-semibold text-navy">Line Items</h3>
          <LineItemsEditor<InvoiceItem>
            columns={[
              { key: 'description', label: 'Description', placeholder: 'Item / service', width: '45%' },
              { key: 'quantity', label: 'Qty', type: 'number', step: 'any', width: '12%' },
              { key: 'rate', label: 'Rate', type: 'number', step: 'any', width: '18%' },
              { key: 'taxRate', label: 'Tax %', type: 'number', step: 'any', width: '12%' },
            ]}
            items={items}
            onChange={setItems}
            newItem={newItem}
            computeRow={(r) => formatMoney(r.quantity * r.rate, currency)}
            rowLabel="Item"
          />
          <div className="mt-4 flex justify-end">
            <div className="w-64 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>{formatMoney(subtotal, currency)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Tax</span><span>{formatMoney(taxTotal, currency)}</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-1 font-semibold text-navy"><span>Total</span><span>{formatMoney(total, currency)}</span></div>
            </div>
          </div>
        </Card>

        <Card>
          <Field label="Notes">
            <TextArea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Payment terms, remarks…" />
          </Field>
        </Card>

        <div className="flex justify-end gap-2">
          <GhostButton onClick={() => navigate('/invoices')}>Cancel</GhostButton>
          <PrimaryButton onClick={submit} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving…' : 'Save Invoice'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
