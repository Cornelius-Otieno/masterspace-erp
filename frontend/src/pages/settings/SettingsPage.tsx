import { Building2, CreditCard, Mail, MapPin, Phone, ShieldCheck, User as UserIcon } from 'lucide-react';
import { Card } from '@/components/ui/Form';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';
import { COMPANY, COMPANY_BANK_ACCOUNTS } from '@/lib/company';

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <span className="mt-0.5 text-primary">{icon}</span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-sm text-slate-700">{value}</p>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader title="Settings" subtitle="Company profile and account details" />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-4">
            <Logo />
          </div>
          <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
            <Row icon={<Building2 size={18} />} label="Legal Name" value={COMPANY.name} />
            <Row icon={<ShieldCheck size={18} />} label="KRA PIN" value={COMPANY.kraPin} />
            <Row icon={<MapPin size={18} />} label="Address" value={COMPANY.addressLines.join(', ')} />
            <Row icon={<Mail size={18} />} label="Email" value={COMPANY.email} />
            <Row icon={<Phone size={18} />} label="Phone" value={COMPANY.phone} />
            <Row icon={<Building2 size={18} />} label="Tagline" value={COMPANY.tagline} />
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-navy">
              <CreditCard size={16} className="text-primary" /> Bank Details
            </h3>
            <div className="space-y-3">
              {COMPANY_BANK_ACCOUNTS.map((account) => (
                <div key={account.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <p className="text-sm font-semibold text-navy">{account.name} - {account.branch} ({account.currency})</p>
                  <p className="text-sm text-slate-700">{account.accountName} | Account No. {account.accountNumber}</p>
                  {account.swift && <p className="text-sm text-slate-700">SWIFT: {account.swift}</p>}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-navy">
            <UserIcon size={16} className="text-primary" /> Current User
          </h3>
          {user ? (
            <div className="space-y-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-light text-xl font-bold text-primary">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-base font-semibold text-navy">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Role</span>
                <StatusBadge status={user.role} />
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Not signed in.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
