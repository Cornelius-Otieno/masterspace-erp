import type { Quotation } from '@/types';
import { COMPANY } from '@/lib/company';
import { Logo } from '@/components/ui/Logo';
import { formatDate, formatNumber } from '@/lib/utils';

export function QuotationTemplate({ quotation }: { quotation: Quotation }) {
  const symbol = quotation.currency === 'USD' ? '$' : `${quotation.currency} `;
  return (
    <div className="doc-sheet print-area font-sans">
      <div className="flex items-start justify-between">
        <Logo />
        <div className="text-right">
          <h1 className="text-3xl font-extrabold tracking-tight text-navy">QUOTATION</h1>
          <p className="text-xs font-medium tracking-wide text-primary">PRICE PROPOSAL</p>
        </div>
      </div>
      <div className="mt-3 h-1 w-full rounded bg-navy" />

      <div className="mt-5 grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{COMPANY.name}</h2>
          <p className="text-sm italic text-primary">{COMPANY.tagline}</p>
          <p className="mt-2 text-sm text-slate-600">2nd Floor, Suite #A, RAMIS CENTER, Mombasa Road</p>
          <p className="text-sm text-slate-600">P.O Box 57933-00200 - Nairobi, Kenya</p>
          <p className="text-sm text-slate-600">KRA PIN: {COMPANY.kraPin}</p>
        </div>
        <table className="h-fit w-full border-collapse text-sm">
          <tbody>
            {[
              ['QOT NO.', quotation.number],
              ['DATE', formatDate(quotation.issueDate)],
              ['VALID UNTIL', formatDate(quotation.validUntil)],
              ['CURRENCY', quotation.currency],
            ].map(([k, v]) => (
              <tr key={k}>
                <td className="w-2/5 border border-slate-200 bg-teal-light px-3 py-2 font-semibold text-primary">{k}</td>
                <td className="border border-slate-200 px-3 py-2 font-semibold text-slate-800">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-6">
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-bold tracking-wide text-primary">PREPARED FOR</p>
          <p className="mt-1 font-bold text-slate-800">{quotation.client?.name}</p>
          {quotation.client?.address && <p className="text-sm text-slate-600">{quotation.client.address}</p>}
          {quotation.client?.city && <p className="text-sm text-slate-600">{quotation.client.city}, {quotation.client.country}</p>}
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-bold tracking-wide text-primary">PREPARED BY</p>
          <p className="mt-1 font-bold text-slate-800">{COMPANY.name}</p>
          <p className="text-sm text-slate-600">{COMPANY.email}</p>
          <p className="text-sm text-slate-600">{COMPANY.phone}</p>
        </div>
      </div>

      <table className="mt-5 w-full border-collapse text-sm">
        <thead>
          <tr className="bg-primary text-left text-white">
            <th className="px-3 py-3">#</th>
            <th className="px-3 py-3">DESCRIPTION</th>
            <th className="px-3 py-3 text-center">QTY</th>
            <th className="px-3 py-3 text-right">UNIT PRICE</th>
            <th className="px-3 py-3 text-right">AMOUNT ({quotation.currency})</th>
          </tr>
        </thead>
        <tbody>
          {quotation.items.map((it, i) => (
            <tr key={it.id ?? i} className="border-b border-slate-100 align-top">
              <td className="px-3 py-4 text-slate-500">{i + 1}</td>
              <td className="px-3 py-4 font-semibold text-slate-800">{it.description}</td>
              <td className="px-3 py-4 text-center text-slate-600">{formatNumber(it.quantity)}</td>
              <td className="px-3 py-4 text-right text-slate-600">{formatNumber(it.unitPrice)}</td>
              <td className="px-3 py-4 text-right font-semibold text-slate-800">{formatNumber(it.amount ?? 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-5 flex justify-end">
        <div className="w-1/2 space-y-2">
          <div className="flex justify-between rounded bg-slate-100 px-4 py-2 text-sm">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-semibold text-slate-800">{symbol}{formatNumber(quotation.subtotal)}</span>
          </div>
          <div className="flex justify-between px-4 py-1 text-sm">
            <span className="text-slate-600">VAT</span>
            <span className="font-semibold text-slate-800">{symbol}{formatNumber(quotation.taxTotal)}</span>
          </div>
          <div className="flex justify-between rounded bg-primary px-4 py-3 text-white">
            <span className="font-bold">Total</span>
            <span className="font-bold">{symbol}{formatNumber(quotation.total)}</span>
          </div>
        </div>
      </div>

      {(quotation.terms || quotation.notes) && (
        <div className="mt-6 rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-bold tracking-wide text-primary">TERMS &amp; CONDITIONS</p>
          <p className="mt-1 whitespace-pre-line text-sm text-slate-600">
            {quotation.terms || quotation.notes}
          </p>
        </div>
      )}

      <div className="mt-12">
        <div className="w-64 border-t-2 border-slate-800 pt-2 text-sm">
          Authorized Signature — <span className="font-bold">{COMPANY.name}</span>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-200 pt-3 text-center text-[10px] text-slate-400">
        <p>{COMPANY.addressShort} | KRA PIN: {COMPANY.kraPin} | {COMPANY.tagline}</p>
      </div>
    </div>
  );
}
