import type { Receipt } from '@/types';
import { COMPANY } from '@/lib/company';
import { Logo } from '@/components/ui/Logo';
import { formatDate, formatNumber } from '@/lib/utils';

export function ReceiptTemplate({ receipt }: { receipt: Receipt }) {
  const symbol = receipt.currency === 'USD' ? '$' : `${receipt.currency} `;
  return (
    <div className="doc-sheet print-area font-sans">
      {/* Header */}
      <div className="flex items-start justify-between">
        <Logo />
        <div className="text-right">
          <h1 className="text-4xl font-extrabold tracking-[0.3em] text-navy">RECEIPT</h1>
          <p className="mt-1 text-[11px] font-medium tracking-[0.25em] text-primary">
            OFFICIAL PAYMENT ACKNOWLEDGEMENT
          </p>
        </div>
      </div>
      <div className="mt-3 h-1 w-full rounded bg-navy" />

      {/* Company + Receipt details */}
      <div className="mt-5 grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{COMPANY.name}</h2>
          <p className="text-sm italic text-primary">{COMPANY.tagline}</p>
          <p className="mt-2 text-sm text-slate-600">2nd Floor, Suite #A, RAMIS CENTER</p>
          <p className="text-sm text-slate-600">Mombasa Road, Nairobi, Kenya</p>
          <p className="text-sm text-slate-600">P.O. Box 57933-00200, Nairobi, Kenya</p>
          <p className="text-sm text-slate-600">KRA PIN: {COMPANY.kraPin}</p>
        </div>
        <table className="h-fit w-full border-collapse text-sm">
          <tbody>
            {[
              ['RECEIPT NO.', receipt.number],
              ['RECEIPT DATE', formatDate(receipt.issueDate)],
              ['AGAINST INVOICE', receipt.invoice?.number || '—'],
              ['CONTRACT NO.', receipt.contractNo || '—'],
              ['CURRENCY', receipt.currency],
            ].map(([k, v]) => (
              <tr key={k}>
                <td className="w-2/5 border border-slate-200 bg-teal-light px-3 py-2 font-semibold text-primary">{k}</td>
                <td className="border border-slate-200 px-3 py-2 font-semibold text-slate-800">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Received From / Payment Into */}
      <div className="mt-5 grid grid-cols-2 gap-6">
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-bold tracking-[0.2em] text-primary">RECEIVED FROM</p>
          <p className="mt-1 font-bold text-slate-800">{receipt.client?.name}</p>
          {receipt.client?.address && <p className="text-sm text-slate-600">{receipt.client.address}</p>}
          {receipt.client?.city && <p className="text-sm text-slate-600">{receipt.client.city}, {receipt.client.country}</p>}
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-bold tracking-[0.2em] text-primary">PAYMENT RECEIVED INTO</p>
          <p className="mt-1 font-bold text-slate-800">{COMPANY.bank.accountName}</p>
          <p className="text-sm text-slate-600">{COMPANY.bank.name} — {COMPANY.bank.branch}</p>
          <p className="text-sm text-slate-600">Account No: {COMPANY.bank.accountNumber}</p>
          <p className="text-sm text-slate-600">SWIFT Code: {COMPANY.bank.swift}</p>
        </div>
      </div>

      {/* Total banner */}
      <div className="mt-5 flex items-center justify-between rounded-lg bg-navy px-6 py-5 text-white">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Total Amount Received</p>
          <p className="text-3xl font-extrabold">{symbol}{formatNumber(receipt.total)}</p>
        </div>
        <div className="rounded-lg border-2 border-white px-6 py-3 text-xl font-bold tracking-[0.2em]">
          {receipt.status}
        </div>
      </div>

      {/* Items */}
      <table className="mt-5 w-full border-collapse text-sm">
        <thead>
          <tr className="bg-navy text-left text-white">
            <th className="px-3 py-3">#</th>
            <th className="px-3 py-3">DESCRIPTION</th>
            <th className="px-3 py-3 text-center">MILESTONE</th>
            <th className="px-3 py-3 text-right">AMOUNT ({receipt.currency})</th>
          </tr>
        </thead>
        <tbody>
          {receipt.items.map((it, i) => (
            <tr key={it.id ?? i} className="border-b border-slate-100 align-top">
              <td className="px-3 py-4 text-slate-500">{i + 1}</td>
              <td className="px-3 py-4 text-slate-700">
                <p className="font-semibold text-slate-800">{it.description}</p>
              </td>
              <td className="px-3 py-4 text-center text-slate-600">{it.milestone || '—'}</td>
              <td className="px-3 py-4 text-right font-semibold text-slate-800">{formatNumber(it.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mt-5 flex justify-end">
        <div className="w-1/2 space-y-2">
          <div className="flex justify-between rounded bg-slate-100 px-4 py-2 text-sm">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-semibold text-slate-800">{symbol}{formatNumber(receipt.subtotal)}</span>
          </div>
          <div className="flex justify-between rounded bg-navy px-4 py-3 text-white">
            <span className="font-bold">Total Amount Paid</span>
            <span className="font-bold">{symbol}{formatNumber(receipt.total)}</span>
          </div>
        </div>
      </div>

      {/* Payment / Beneficiary */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-bold tracking-[0.2em] text-primary">PAYMENT DETAILS</p>
          <div className="mt-2 grid grid-cols-[110px_1fr] gap-y-1 text-sm">
            <span className="text-slate-500">Method</span>
            <span className="font-semibold text-slate-800">{receipt.paymentMethod || '—'}</span>
            <span className="text-slate-500">Value Date</span>
            <span className="font-semibold text-slate-800">{formatDate(receipt.issueDate)}</span>
            <span className="text-slate-500">Payment Ref</span>
            <span className="font-semibold text-slate-800">{receipt.paymentRef || '—'}</span>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-bold tracking-[0.2em] text-primary">BENEFICIARY BANK</p>
          <div className="mt-2 grid grid-cols-[110px_1fr] gap-y-1 text-sm">
            <span className="text-slate-500">Bank</span>
            <span className="font-semibold text-slate-800">{COMPANY.bank.name}</span>
            <span className="text-slate-500">Branch</span>
            <span className="font-semibold text-slate-800">{COMPANY.bank.branch}</span>
            <span className="text-slate-500">Account Name</span>
            <span className="font-semibold text-slate-800">{COMPANY.bank.accountName}</span>
            <span className="text-slate-500">Account No</span>
            <span className="font-semibold text-slate-800">{COMPANY.bank.accountNumber}</span>
            <span className="text-slate-500">SWIFT</span>
            <span className="font-semibold text-slate-800">{COMPANY.bank.swift}</span>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="mt-12 grid grid-cols-2 gap-10">
        <div className="border-t-2 border-slate-800 pt-2 text-sm">
          Prepared By — <span className="font-bold">{receipt.preparedBy || '—'}</span>
        </div>
        <div className="border-t-2 border-slate-800 pt-2 text-sm">
          Approved By — <span className="font-bold">{receipt.approvedBy || '—'}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 border-t border-slate-200 pt-3 text-center text-[10px] text-slate-400">
        <p>This receipt confirms funds received in full as stated above and is issued by {COMPANY.name}.</p>
        <p>{COMPANY.addressShort} | KRA PIN: {COMPANY.kraPin} | {COMPANY.tagline}</p>
      </div>
    </div>
  );
}
