import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { api } from '@/lib/api';
import { Card, Field, GhostButton, PrimaryButton, Select, TextArea, TextInput } from '@/components/ui/Form';
import { PageHeader } from '@/components/ui/PageHeader';
import { LineItemsEditor } from '@/components/documents/LineItemsEditor';
import { formatMoney, toInputDate } from '@/lib/utils';
import type { Client, Quotation, QuotationItem } from '@/types';

const newItem = (): QuotationItem => ({ description: '', quantity: 1, unitPrice: 0 });

export default function QuotationFormPage() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();

  const [clients, setClients] = useState<Client[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [clientId, setClientId] = useState('');
  const [number, setNumber] = useState('');
  const [issueDate, setIssueDate] = useState(toInputDate(new Date()));
  const [validUntil, setValidUntil] = useState('');
  const [currency, setCurrency] = useState('KES');
  const [taxRate, setTaxRate] = useState(16);
  const [status, setStatus] = useState('DRAFT');
  const [terms, setTerms] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<QuotationItem[]>([newItem()]);

  useEffect(() => {
    api.get('/clients', { params: { limit: 200 } }).then((r) => setClients(r.data.data));
    if (editing) {
      api.get<Quotation>(`/quotations/${id}`).then((r) => {
        const d = r.data;
        setClientId(d.clientId);
        setNumber(d.number);
        setIssueDate(toInputDate(d.issueDate));
        setValidUntil(toInputDate(d.validUntil));
        setCurrency(d.currency);
        setStatus(d.status);
        setTerms(d.terms ?? '');
        setNotes(d.notes ?? '');
        const derivedTax = d.subtotal ? Math.round((d.taxTotal / d.subtotal) * 100) : 16;
        setTaxRate(derivedTax);
        setItems(d.items.map((it) => ({ description: it.description, quantity: it.quantity, unitPrice: it.unitPrice })));
      });
    }
  }, [id, editing]);

  const subtotal = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
  const taxTotal = (subtotal * taxRate) / 100;
  const total = subtotal + taxTotal;

  const submit = async () => {
    setError(null);
    if (!clientId) return setError('Please select a client.');
    if (items.some((it) => !it.description.trim())) return setError('Every line item needs a description.');
    setSaving(true);
    const payload = { clientId, number: number.trim() || undefined, issueDate, validUntil: validUntil || undefined, currency, taxRate, status, terms: terms || undefined, notes: notes || undefined, items };
    try {
      const res = editing ? await api.patch(`/quotations/${id}`, payload) : await api.post('/quotations', payload);
      navigate(`/quotations/${res.data.id}`);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to save quotation.');
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={editing ? 'Edit Quotation' : 'New Quotation'}
        actions={
          <GhostButton onClick={() => navigate('/quotations')}>
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
            <Field label="Quotation Number">
              <TextInput value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Leave blank to auto-generate" disabled={editing} />
            </Field>
            <Field label="Currency">
              <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="KES">KES</option>
                <option value="USD">USD</option>
              </Select>
            </Field>
            <Field label="Tax Rate (%)">
              <TextInput type="number" step="any" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
            </Field>
            <Field label="Issue Date">
              <TextInput type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
            </Field>
            <Field label="Valid Until">
              <TextInput type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
            </Field>
            <Field label="Status">
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                {['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </Field>
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 text-sm font-semibold text-navy">Line Items</h3>
          <LineItemsEditor<QuotationItem>
            columns={[
              { key: 'description', label: 'Description', placeholder: 'Item / service', width: '55%' },
              { key: 'quantity', label: 'Qty', type: 'number', step: 'any', width: '15%' },
              { key: 'unitPrice', label: 'Unit Price', type: 'number', step: 'any', width: '20%' },
            ]}
            items={items}
            onChange={setItems}
            newItem={newItem}
            computeRow={(r) => formatMoney(r.quantity * r.unitPrice, currency)}
            rowLabel="Item"
          />
          <div className="mt-4 flex justify-end">
            <div className="w-64 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>{formatMoney(subtotal, currency)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Tax ({taxRate}%)</span><span>{formatMoney(taxTotal, currency)}</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-1 font-semibold text-navy"><span>Total</span><span>{formatMoney(total, currency)}</span></div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Terms">
              <TextArea rows={3} value={terms} onChange={(e) => setTerms(e.target.value)} placeholder="Validity, delivery terms…" />
            </Field>
            <Field label="Notes">
              <TextArea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Remarks…" />
            </Field>
          </div>
        </Card>

        <div className="flex justify-end gap-2">
          <GhostButton onClick={() => navigate('/quotations')}>Cancel</GhostButton>
          <PrimaryButton onClick={submit} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving…' : 'Save Quotation'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
