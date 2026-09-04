import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Card, Field, GhostButton, PrimaryButton, Select, TextInput } from '@/components/ui/Form';
import { PageHeader } from '@/components/ui/PageHeader';
import type { Role, User } from '@/types';

const roles: Role[] = ['ADMIN', 'FINANCE', 'SALES', 'PROCUREMENT', 'WAREHOUSE'];
const temporaryPassword = 'Masterspace@2026';

type UserForm = { name: string; email: string; username: string; role: Role; active: boolean; password: string };
const emptyForm = (): UserForm => ({ name: '', email: '', username: '', role: 'SALES', active: true, password: temporaryPassword });

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<UserForm>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.get<User[]>('/users').then((response) => setUsers(response.data)).catch(() => setError('Unable to load users.'));
  useEffect(() => { load(); }, []);

  const updateForm = <K extends keyof UserForm>(key: K, value: UserForm[K]) => setForm((current) => ({ ...current, [key]: value }));
  const startEdit = (user: User) => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, username: user.username, role: user.role, active: user.active, password: '' });
    setError(null);
  };
  const cancel = () => { setEditingId(null); setForm(emptyForm()); setError(null); };
  const submit = async () => {
    setError(null);
    if (!form.name.trim() || !form.email.trim() || !form.username.trim()) return setError('Name, username, and email are required.');
    if (!editingId && form.password.length < 8) return setError('Temporary password must be at least 8 characters.');
    setSaving(true);
    try {
      const payload = { ...form, password: form.password || undefined };
      if (editingId !== 'new') await api.patch(`/users/${editingId}`, payload);
      else await api.post('/users', payload);
      cancel();
      load();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || 'Unable to save user.');
    } finally { setSaving(false); }
  };
  const remove = async (user: User) => {
    if (!window.confirm(`Deactivate and soft-delete ${user.name}?`)) return;
    try { await api.delete(`/users/${user.id}`); load(); } catch (requestError: any) { setError(requestError?.response?.data?.message || 'Unable to delete user.'); }
  };

  return (
    <div>
      <PageHeader title="User Management" subtitle="Create, update, deactivate, and remove user accounts" actions={!editingId ? <PrimaryButton onClick={() => { setEditingId('new'); setForm(emptyForm()); }}><Plus size={16} /> New User</PrimaryButton> : undefined} />
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {editingId && <Card className="mb-5">
        <h2 className="mb-4 text-base font-semibold text-navy">{editingId === 'new' ? 'Create User' : 'Edit User'}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Field label="Full Name"><TextInput value={form.name} onChange={(event) => updateForm('name', event.target.value)} /></Field>
          <Field label="Email"><TextInput type="email" value={form.email} onChange={(event) => updateForm('email', event.target.value)} /></Field>
          <Field label="Username"><TextInput value={form.username} onChange={(event) => updateForm('username', event.target.value)} /></Field>
          <Field label="Role"><Select value={form.role} onChange={(event) => updateForm('role', event.target.value as Role)}>{roles.map((role) => <option key={role}>{role}</option>)}</Select></Field>
          <Field label={editingId === 'new' ? 'Temporary Password' : 'Reset Password'}><TextInput type="password" value={form.password} onChange={(event) => updateForm('password', event.target.value)} placeholder={editingId === 'new' ? undefined : 'Leave blank to keep current password'} /></Field>
          <Field label="Account Status"><Select value={String(form.active)} onChange={(event) => updateForm('active', event.target.value === 'true')}><option value="true">Active</option><option value="false">Deactivated</option></Select></Field>
        </div>
        <div className="mt-5 flex justify-end gap-2"><GhostButton onClick={cancel}>Cancel</GhostButton><PrimaryButton onClick={submit} disabled={saving}>{saving ? 'Saving...' : 'Save User'}</PrimaryButton></div>
      </Card>}
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Password</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
          <tbody>{users.map((user) => <tr key={user.id} className="border-b border-slate-100 last:border-0"><td className="px-4 py-3"><p className="font-medium text-navy">{user.name}</p><p className="text-slate-500">{user.username} | {user.email}</p></td><td className="px-4 py-3">{user.role}</td><td className="px-4 py-3"><span className={user.active ? 'text-emerald-700' : 'text-slate-500'}>{user.active ? 'Active' : 'Deactivated'}</span></td><td className="px-4 py-3 text-slate-500">{user.mustChangePassword ? 'Change required' : 'Current'}</td><td className="px-4 py-3"><div className="flex justify-end gap-2"><GhostButton title="Edit user" onClick={() => startEdit(user)}><Pencil size={16} /></GhostButton><GhostButton title="Soft-delete user" onClick={() => remove(user)}><Trash2 size={16} /></GhostButton></div></td></tr>)}</tbody>
        </table>
      </Card>
    </div>
  );
}