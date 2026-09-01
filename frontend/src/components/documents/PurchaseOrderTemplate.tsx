import type { PurchaseOrder } from '@/types';
import { COMPANY } from '@/lib/company';
import { Logo } from '@/components/ui/Logo';
import { formatDate, formatNumber } from '@/lib/utils';

export function PurchaseOrderTemplate({ po }: { po: PurchaseOrder }) {
  const symbol = po.currency === 'USD' ? '$' : `${po.currency} `;
  return (
    <div className="doc-sheet print-area font-sans">
      {/* Header */}
      <div className="flex items-start justify-between">
        <Logo />
        <div className="text-right">
          <h1 className="text-3xl font-extrabold tracking-tight text-navy">PURCHASE ORDER</h1>
          <p className="text-xs font-medium tracking-wide text-primary">ORDER FOR PROCUREMENT</p>
        </div>
      </div>
      <div className="mt-3 h-1 w-full rounded bg-navy" />

      {/* Company + PO details */}
      <div className="mt-5 grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{COMPANY.name}</h2>
          <p className="text-sm italic text-primary">{COMPANY.tagline}</p>
          <p className="mt-2 text-sm text-slate-600">2nd Floor, Suite #A, RAMIS CENTER, Mombasa Road</p>
          <p className="text-sm text-slate-600">P.O Box 57933-00200 - Nairobi</p>
          <p className="text-sm text-slate-600">Kenya</p>
          <p className="text-sm text-slate-600">KRA PIN: {COMPANY.kraPin}</p>
        </div>
        <table className="h-fit w-full border-collapse text-sm">
          <tbody>
            {[
              ['PO NO.', po.number],
              ['DATE', formatDate(po.issueDate)],
              ['EXPECTED', formatDate(po.expectedDate)],
              ['CURRENCY', po.currency],
            ].map(([k, v]) => (
              <tr key={k}>
                <td className="w-1/3 border border-slate-200 bg-teal-light px-3 py-2 font-semibold text-primary">{k}</td>
                <td className="border border-slate-200 px-3 py-2 font-semibold text-slate-800">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Supplier / Deliver To */}
      <div className="mt-5 grid grid-cols-2 gap-6">
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-bold tracking-wide text-primary">SUPPLIER</p>
          <p className="mt-1 font-bold text-slate-800">{po.supplier?.name}</p>
          {po.supplier?.address && <p className="text-sm text-slate-600">{po.supplier.address}</p>}
          {po.supplier?.city && <p className="text-sm text-slate-600">{po.supplier.city}, {po.supplier.country}</p>}
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-bold tracking-wide text-primary">DELIVER TO</p>
          <p className="mt-1 font-bold text-slate-800">{po.deliverTo}</p>
          <p className="text-sm text-slate-600">Expected: {formatDate(po.expectedDate)}</p>
        </div>
      </div>

      {/* Total banner */}
      <div className="mt-5 flex items-center justify-between rounded-lg bg-navy px-6 py-5 text-white">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-300">Total Order Value</p>
          <p className="text-3xl font-extrabold">{symbol}{formatNumber(po.total)}</p>
        </div>
        <div className="rounded-lg border-2 border-white px-6 py-3 text-xl font-bold tracking-wide">
          {po.status}
        </div>
      </div>

      {/* Items */}
      <table className="mt-5 w-full border-collapse text-sm">
        <thead>
          <tr className="bg-navy text-left text-white">
            <th className="px-3 py-3">#</th>
            <th className="px-3 py-3">DESCRIPTION</th>
            <th className="px-3 py-3 text-center">UNIT</th>
            <th className="px-3 py-3 text-center">QTY</th>
            <th className="px-3 py-3 text-right">RATE</th>
            <th className="px-3 py-3 text-right">AMOUNT ({po.currency})</th>
          </tr>
        </thead>
        <tbody>
          {po.items.map((it, i) => (
            <tr key={it.id ?? i} className="border-b border-slate-100 align-top">
              <td className="px-3 py-4 text-slate-500">{i + 1}</td>
              <td className="px-3 py-4 font-semibold text-slate-800">{it.description}</td>
              <td className="px-3 py-4 text-center text-slate-600">{it.unit || '—'}</td>
              <td className="px-3 py-4 text-center text-slate-600">{formatNumber(it.quantity)}</td>
              <td className="px-3 py-4 text-right text-slate-600">{formatNumber(it.rate)}</td>
              <td className="px-3 py-4 text-right font-semibold text-slate-800">{formatNumber(it.amount ?? 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mt-5 flex justify-end">
        <div className="w-1/2 space-y-2">
          <div className="flex justify-between rounded bg-slate-100 px-4 py-2 text-sm">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-semibold text-slate-800">{symbol}{formatNumber(po.subtotal)}</span>
          </div>
          <div className="flex justify-between rounded bg-navy px-4 py-3 text-white">
            <span className="font-bold">Grand Total</span>
            <span className="font-bold">{symbol}{formatNumber(po.total)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {po.notes && (
        <div className="mt-6 rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-bold tracking-wide text-primary">NOTES &amp; TERMS</p>
          <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{po.notes}</p>
        </div>
      )}

      {/* Prepared by */}
      <div className="mt-12">
        <div className="w-64 border-t-2 border-slate-800 pt-2 text-sm">
          Prepared By - <span className="font-bold">{po.preparedBy || '—'}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 border-t border-slate-200 pt-3 text-center text-[10px] text-slate-400">
        <p>This purchase order is issued by {COMPANY.name} and is subject to the terms stated above.</p>
        <p>{COMPANY.addressShort} | KRA PIN: {COMPANY.kraPin} | {COMPANY.email}</p>
        <p>{COMPANY.website} | {COMPANY.tagline}</p>
      </div>
    </div>
  );
}
