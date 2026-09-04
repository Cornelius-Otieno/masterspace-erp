import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { api } from '@/lib/api';
import { Card, Field, GhostButton, PrimaryButton, Select, TextArea, TextInput } from '@/components/ui/Form';
import { PageHeader } from '@/components/ui/PageHeader';
import { LineItemsEditor } from '@/components/documents/LineItemsEditor';
import { COMPANY_BANK_ACCOUNTS } from '@/lib/company';
import { formatMoney, toInputDate } from '@/lib/utils';
import type { Client, Invoice, Receipt, ReceiptItem } from '@/types';

const newItem = (): ReceiptItem => ({ description: '', milestone: '', amount: 0 });

export default function ReceiptFormPage() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();

  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [clientId, setClientId] = useState('');
  const [number, setNumber] = useState('');
  const [invoiceId, setInvoiceId] = useState('');
  const [contractNo, setContractNo] = useState('');
  const [issueDate, setIssueDate] = useState(toInputDate(new Date()));
  const [currency, setCurrency] = useState('KES');
  const [bankAccountId, setBankAccountId] = useState('sidian-kes-kenyatta-market');
  const [status, setStatus] = useState('PAID');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [paymentRef, setPaymentRef] = useState('');
  const [preparedBy, setPreparedBy] = useState('');
  const [approvedBy, setApprovedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<ReceiptItem[]>([newItem()]);

  useEffect(() => {
    api.get('/clients', { params: { limit: 200 } }).then((r) => setClients(r.data.data));
    api.get('/invoices', { params: { limit: 200 } }).then((r) => setInvoices(r.data.data));
    if (editing) {
      api.get<Receipt>(`/receipts/${id}`).then((r) => {
        const d = r.data;
        setClientId(d.clientId);
        setNumber(d.number);
        setInvoiceId(d.invoiceId ?? '');
        setContractNo(d.contractNo ?? '');
        setIssueDate(toInputDate(d.issueDate));
        setCurrency(d.currency);
        setBankAccountId(d.bankAccountId ?? 'stanbic-usd-imaara');
        setStatus(d.status);
        setPaymentMethod(d.paymentMethod ?? '');
        setPaymentRef(d.paymentRef ?? '');
        setPreparedBy(d.preparedBy ?? '');
        setApprovedBy(d.approvedBy ?? '');
        setNotes(d.notes ?? '');
        setItems(d.items.map((it) => ({ description: it.description, milestone: it.milestone ?? '', amount: it.amount })));
      });
    }
  }, [id, editing]);

  const total = items.reduce((s, it) => s + Number(it.amount || 0), 0);

  const submit = async () => {
    setError(null);
    if (!clientId) return setError('Please select a client.');
    if (items.some((it) => !it.description.trim())) return setError('Every line item needs a description.');
    setSaving(true);
    const payload = {
      clientId, number: number.trim() || undefined, invoiceId: invoiceId || undefined, contractNo: contractNo || undefined, issueDate, currency, bankAccountId, status,
      paymentMethod: paymentMethod || undefined, paymentRef: paymentRef || undefined,
      preparedBy: preparedBy || undefined, approvedBy: approvedBy || undefined, notes: notes || undefined, items,
    };
    try {
      const res = editing ? await api.patch(`/receipts/${id}`, payload) : await api.post('/receipts', payload);
      navigate(`/receipts/${res.data.id}`);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to save receipt.');
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={editing ? 'Edit Receipt' : 'New Receipt'}
        actions={
          <GhostButton onClick={() => navigate('/receipts')}>
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
            <Field label="Receipt Number">
              <TextInput value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Leave blank to auto-generate" disabled={editing} />
            </Field>
            <Field label="Against Invoice">
              <Select value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)}>
                <option value="">None</option>
                {invoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>{inv.number}</option>
                ))}
              </Select>
            </Field>
            <Field label="Contract / LPO No.">
              <TextInput value={contractNo} onChange={(e) => setContractNo(e.target.value)} placeholder="Optional" />
            </Field>
            <Field label="Issue Date">
              <TextInput type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
            </Field>
            <Field label="Currency">
              <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="KES">KES</option>
                <option value="USD">USD</option>
              </Select>
            </Field>
            <Field label="Receiving Bank Account">
              <Select value={bankAccountId} onChange={(e) => setBankAccountId(e.target.value)}>
                {COMPANY_BANK_ACCOUNTS.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} - {account.branch} ({account.currency})
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Status">
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                {['DRAFT', 'PAID', 'REFUNDED'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </Field>
            <Field label="Payment Method">
              <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                {['Bank Transfer', 'Cheque', 'Cash', 'M-Pesa', 'Card'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </Field>
            <Field label="Payment Reference">
              <TextInput value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} placeholder="Txn / cheque no." />
            </Field>
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 text-sm font-semibold text-navy">Payment Breakdown</h3>
          <LineItemsEditor<ReceiptItem>
            columns={[
              { key: 'description', label: 'Description', placeholder: 'Payment for…', width: '50%' },
              { key: 'milestone', label: 'Milestone', placeholder: 'e.g. 50% deposit', width: '25%' },
              { key: 'amount', label: 'Amount', type: 'number', step: 'any', width: '20%' },
            ]}
            items={items}
            onChange={setItems}
            newItem={newItem}
            rowLabel="Line"
          />
          <div className="mt-4 flex justify-end">
            <div className="w-64 text-sm">
              <div className="flex justify-between border-t border-slate-200 pt-1 font-semibold text-navy"><span>Total Received</span><span>{formatMoney(total, currency)}</span></div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Prepared By">
              <TextInput value={preparedBy} onChange={(e) => setPreparedBy(e.target.value)} placeholder="Name" />
            </Field>
            <Field label="Approved By">
              <TextInput value={approvedBy} onChange={(e) => setApprovedBy(e.target.value)} placeholder="Name" />
            </Field>
            <Field label="Notes">
              <TextInput value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Remarks…" />
            </Field>
          </div>
        </Card>

        <div className="flex justify-end gap-2">
          <GhostButton onClick={() => navigate('/receipts')}>Cancel</GhostButton>
          <PrimaryButton onClick={submit} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving…' : 'Save Receipt'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
