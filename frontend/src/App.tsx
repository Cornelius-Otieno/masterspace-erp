import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import type { JSX } from 'react';

import LoginPage from '@/pages/auth/LoginPage';
import ChangePasswordPage from '@/pages/auth/ChangePasswordPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';

import InvoicesListPage from '@/pages/invoices/InvoicesListPage';
import InvoiceFormPage from '@/pages/invoices/InvoiceFormPage';
import InvoiceViewPage from '@/pages/invoices/InvoiceViewPage';

import PurchaseOrdersListPage from '@/pages/purchase-orders/PurchaseOrdersListPage';
import PurchaseOrderFormPage from '@/pages/purchase-orders/PurchaseOrderFormPage';
import PurchaseOrderViewPage from '@/pages/purchase-orders/PurchaseOrderViewPage';

import QuotationsListPage from '@/pages/quotations/QuotationsListPage';
import QuotationFormPage from '@/pages/quotations/QuotationFormPage';
import QuotationViewPage from '@/pages/quotations/QuotationViewPage';

import DeliveryNotesListPage from '@/pages/delivery-notes/DeliveryNotesListPage';
import DeliveryNoteFormPage from '@/pages/delivery-notes/DeliveryNoteFormPage';
import DeliveryNoteViewPage from '@/pages/delivery-notes/DeliveryNoteViewPage';

import ReceiptsListPage from '@/pages/receipts/ReceiptsListPage';
import ReceiptFormPage from '@/pages/receipts/ReceiptFormPage';
import ReceiptViewPage from '@/pages/receipts/ReceiptViewPage';

import WorkOrdersListPage from '@/pages/work-orders/WorkOrdersListPage';
import WorkOrderFormPage from '@/pages/work-orders/WorkOrderFormPage';
import WorkOrderViewPage from '@/pages/work-orders/WorkOrderViewPage';

import ClientsListPage from '@/pages/clients/ClientsListPage';
import ClientFormPage from '@/pages/clients/ClientFormPage';
import SuppliersListPage from '@/pages/suppliers/SuppliersListPage';
import SupplierFormPage from '@/pages/suppliers/SupplierFormPage';
import SettingsPage from '@/pages/settings/SettingsPage';
import UsersPage from '@/pages/users/UsersPage';

function Protected({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400">
        Loading…
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (user.mustChangePassword && location.pathname !== '/change-password') return <Navigate to="/change-password" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <Protected>
            <AppLayout />
          </Protected>
        }
      >
        <Route path="/" element={<DashboardPage />} />

        <Route path="/invoices" element={<InvoicesListPage />} />
        <Route path="/invoices/new" element={<InvoiceFormPage />} />
        <Route path="/invoices/:id/edit" element={<InvoiceFormPage />} />
        <Route path="/invoices/:id" element={<InvoiceViewPage />} />

        <Route path="/purchase-orders" element={<PurchaseOrdersListPage />} />
        <Route path="/purchase-orders/new" element={<PurchaseOrderFormPage />} />
        <Route path="/purchase-orders/:id/edit" element={<PurchaseOrderFormPage />} />
        <Route path="/purchase-orders/:id" element={<PurchaseOrderViewPage />} />

        <Route path="/quotations" element={<QuotationsListPage />} />
        <Route path="/quotations/new" element={<QuotationFormPage />} />
        <Route path="/quotations/:id/edit" element={<QuotationFormPage />} />
        <Route path="/quotations/:id" element={<QuotationViewPage />} />

        <Route path="/delivery-notes" element={<DeliveryNotesListPage />} />
        <Route path="/delivery-notes/new" element={<DeliveryNoteFormPage />} />
        <Route path="/delivery-notes/:id/edit" element={<DeliveryNoteFormPage />} />
        <Route path="/delivery-notes/:id" element={<DeliveryNoteViewPage />} />

        <Route path="/receipts" element={<ReceiptsListPage />} />
        <Route path="/receipts/new" element={<ReceiptFormPage />} />
        <Route path="/receipts/:id/edit" element={<ReceiptFormPage />} />
        <Route path="/receipts/:id" element={<ReceiptViewPage />} />

        <Route path="/work-orders" element={<WorkOrdersListPage />} />
        <Route path="/work-orders/new" element={<WorkOrderFormPage />} />
        <Route path="/work-orders/:id/edit" element={<WorkOrderFormPage />} />
        <Route path="/work-orders/:id" element={<WorkOrderViewPage />} />

        <Route path="/clients" element={<ClientsListPage />} />
        <Route path="/clients/new" element={<ClientFormPage />} />
        <Route path="/clients/:id/edit" element={<ClientFormPage />} />

        <Route path="/suppliers" element={<SuppliersListPage />} />
        <Route path="/suppliers/new" element={<SupplierFormPage />} />
        <Route path="/suppliers/:id/edit" element={<SupplierFormPage />} />

        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
