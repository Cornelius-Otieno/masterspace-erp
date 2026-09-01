import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
      <button
        onClick={onMenu}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>
      <div className="hidden text-sm font-medium text-slate-500 lg:block">
        Masterspace Solutions Limited · ERP
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-sm font-semibold text-navy">{user?.name}</div>
          <div className="text-xs text-slate-400">{user?.role}</div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
          {user?.name?.charAt(0) ?? 'U'}
        </div>
        <button
          onClick={logout}
          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
