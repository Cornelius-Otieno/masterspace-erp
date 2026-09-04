import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { PrimaryButton, TextInput } from '@/components/ui/Form';

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (newPassword.length < 8) return setError('Use at least 8 characters.');
    if (newPassword !== confirmation) return setError('New passwords do not match.');
    setSaving(true);
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      logout();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || 'Unable to change password.');
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-md pt-10">
      <h1 className="text-2xl font-bold text-navy">Set your password</h1>
      <p className="mt-1 text-sm text-slate-500">Your temporary password must be replaced before you can use the system.</p>
      <form onSubmit={submit} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div><label className="mb-1 block text-sm font-medium text-slate-600">Temporary password</label><TextInput type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required /></div>
        <div><label className="mb-1 block text-sm font-medium text-slate-600">New password</label><TextInput type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required /></div>
        <div><label className="mb-1 block text-sm font-medium text-slate-600">Confirm new password</label><TextInput type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required /></div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <PrimaryButton type="submit" disabled={saving} className="w-full justify-center">{saving ? 'Saving...' : 'Update Password'}</PrimaryButton>
      </form>
    </div>
  );
}