import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { api } from '@/lib/api';
import { Card, Field, GhostButton, PrimaryButton, Select, TextArea, TextInput } from '@/components/ui/Form';
import { PageHeader } from '@/components/ui/PageHeader';
import { LineItemsEditor } from '@/components/documents/LineItemsEditor';
import { toInputDate } from '@/lib/utils';
import type { Client, WorkOrder, WorkOrderTask } from '@/types';

const newTask = (): WorkOrderTask => ({ task: '', description: '', assignedTo: '', estimatedHours: 0 });

export default function WorkOrderFormPage() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();

  const [clients, setClients] = useState<Client[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [clientId, setClientId] = useState('');
  const [number, setNumber] = useState('');
  const [siteDetails, setSiteDetails] = useState('');
  const [issueDate, setIssueDate] = useState(toInputDate(new Date()));
  const [expectedDate, setExpectedDate] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [authorizedBy, setAuthorizedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [tasks, setTasks] = useState<WorkOrderTask[]>([newTask()]);

  useEffect(() => {
    api.get('/clients', { params: { limit: 200 } }).then((r) => setClients(r.data.data));
    if (editing) {
      api.get<WorkOrder>(`/work-orders/${id}`).then((r) => {
        const d = r.data;
        setClientId(d.clientId);
        setNumber(d.number);
        setSiteDetails(d.siteDetails ?? '');
        setIssueDate(toInputDate(d.issueDate));
        setExpectedDate(toInputDate(d.expectedDate));
        setStatus(d.status);
        setAuthorizedBy(d.authorizedBy ?? '');
        setNotes(d.notes ?? '');
        setTasks(d.tasks.map((t) => ({ task: t.task, description: t.description ?? '', assignedTo: t.assignedTo ?? '', estimatedHours: t.estimatedHours })));
      });
    }
  }, [id, editing]);

  const totalHours = tasks.reduce((s, t) => s + Number(t.estimatedHours || 0), 0);

  const submit = async () => {
    setError(null);
    if (!clientId) return setError('Please select a client.');
    if (tasks.some((t) => !t.task.trim())) return setError('Every task needs a title.');
    setSaving(true);
    const payload = { clientId, number: number.trim() || undefined, siteDetails: siteDetails || undefined, issueDate, expectedDate: expectedDate || undefined, status, authorizedBy: authorizedBy || undefined, notes: notes || undefined, tasks };
    try {
      const res = editing ? await api.patch(`/work-orders/${id}`, payload) : await api.post('/work-orders', payload);
      navigate(`/work-orders/${res.data.id}`);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to save work order.');
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={editing ? 'Edit Work Order' : 'New Work Order'}
        actions={
          <GhostButton onClick={() => navigate('/work-orders')}>
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
            <Field label="Work Order Number">
              <TextInput value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Leave blank to auto-generate" disabled={editing} />
            </Field>
            <Field label="Authorized By">
              <TextInput value={authorizedBy} onChange={(e) => setAuthorizedBy(e.target.value)} placeholder="Name" />
            </Field>
            <Field label="Status">
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                {['DRAFT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </Select>
            </Field>
            <Field label="Issue Date">
              <TextInput type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
            </Field>
            <Field label="Expected Completion">
              <TextInput type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} />
            </Field>
            <Field label="Site Details" className="md:col-span-3">
              <TextInput value={siteDetails} onChange={(e) => setSiteDetails(e.target.value)} placeholder="Site / location details" />
            </Field>
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 text-sm font-semibold text-navy">Tasks</h3>
          <LineItemsEditor<WorkOrderTask>
            columns={[
              { key: 'task', label: 'Task', placeholder: 'Task title', width: '30%' },
              { key: 'description', label: 'Description', placeholder: 'Details', width: '35%' },
              { key: 'assignedTo', label: 'Assigned To', placeholder: 'Technician', width: '20%' },
              { key: 'estimatedHours', label: 'Hours', type: 'number', step: 'any', width: '12%' },
            ]}
            items={tasks}
            onChange={setTasks}
            newItem={newTask}
            rowLabel="Task"
          />
          <div className="mt-4 flex justify-end">
            <div className="w-64 text-sm">
              <div className="flex justify-between border-t border-slate-200 pt-1 font-semibold text-navy"><span>Total Est. Hours</span><span>{totalHours}</span></div>
            </div>
          </div>
        </Card>

        <Card>
          <Field label="Notes">
            <TextArea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Scope, materials, remarks…" />
          </Field>
        </Card>

        <div className="flex justify-end gap-2">
          <GhostButton onClick={() => navigate('/work-orders')}>Cancel</GhostButton>
          <PrimaryButton onClick={submit} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving…' : 'Save Work Order'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
