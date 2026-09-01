import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  FileSpreadsheet,
  Truck,
  Receipt,
  Wrench,
  Users,
  Building2,
  Settings,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/invoices', label: 'Invoices', icon: FileText },
  { to: '/purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
  { to: '/quotations', label: 'Quotations', icon: FileSpreadsheet },
  { to: '/delivery-notes', label: 'Delivery Notes', icon: Truck },
  { to: '/receipts', label: 'Receipts', icon: Receipt },
  { to: '/work-orders', label: 'Work Orders', icon: Wrench },
  { to: '/clients', label: 'Clients', icon: Users },
  { to: '/suppliers', label: 'Suppliers', icon: Building2 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-navy text-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center border-b border-white/10 px-5">
          <Logo dark />
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-full border-t border-white/10 p-4 text-[11px] text-slate-400">
          Masterspace ERP v1.0
        </div>
      </aside>
    </>
  );
}
