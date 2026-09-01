import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ShoppingCart,
  FileSpreadsheet,
  Truck,
  Receipt,
  Wrench,
  Users,
  Building2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/ui/PageHeader';
import { formatNumber } from '@/lib/utils';
import type { DashboardStats } from '@/types';

const CARDS = [
  { key: 'invoices', label: 'Invoices', icon: FileText, to: '/invoices', currency: true },
  { key: 'purchaseOrders', label: 'Purchase Orders', icon: ShoppingCart, to: '/purchase-orders', currency: true },
  { key: 'quotations', label: 'Quotations', icon: FileSpreadsheet, to: '/quotations', currency: true },
  { key: 'deliveryNotes', label: 'Delivery Notes', icon: Truck, to: '/delivery-notes', currency: false },
  { key: 'receipts', label: 'Receipts', icon: Receipt, to: '/receipts', currency: true },
  { key: 'workOrders', label: 'Work Orders', icon: Wrench, to: '/work-orders', currency: false },
] as const;

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<DashboardStats>('/dashboard/stats')
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your documents and activity" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => {
          const Icon = card.icon;
          const data = stats?.[card.key] as { count: number; total: number } | undefined;
          return (
            <Link
              key={card.key}
              to={card.to}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-light text-primary">
                  <Icon size={22} />
                </div>
                <span className="text-3xl font-bold text-navy">
                  {loading ? '—' : data?.count ?? 0}
                </span>
              </div>
              <h3 className="mt-4 font-semibold text-slate-700 group-hover:text-primary">
                {card.label}
              </h3>
              {card.currency && (
                <p className="mt-1 text-sm text-slate-500">
                  Value: KES {loading ? '—' : formatNumber(data?.total ?? 0)}
                </p>
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-light text-primary">
              <Users size={22} />
            </div>
            <span className="font-semibold text-slate-700">Clients</span>
          </div>
          <span className="text-2xl font-bold text-navy">{loading ? '—' : stats?.clients ?? 0}</span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-light text-primary">
              <Building2 size={22} />
            </div>
            <span className="font-semibold text-slate-700">Suppliers</span>
          </div>
          <span className="text-2xl font-bold text-navy">{loading ? '—' : stats?.suppliers ?? 0}</span>
        </div>
      </div>
    </div>
  );
}
