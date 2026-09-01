import type { Invoice } from '@/types';
import { COMPANY } from '@/lib/company';
import { Logo } from '@/components/ui/Logo';
import { formatDate, formatNumber } from '@/lib/utils';

const cur = (c: string) => (c === 'USD' ? '$' : c === 'KES' ? 'KES ' : `${c} `);

export function InvoiceTemplate({ invoice }: { invoice: Invoice }) {
  const symbol = cur(invoice.currency);
  return (
    <div className="doc-sheet print-area font-sans">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold italic text-primary">Invoice</h1>
          {invoice.contractNo && (
            <p className="mt-1 text-xs font-semibold text-slate-700">
              CONTRACT NO. {invoice.contractNo}
            </p>
          )}
          <div className="mt-4 space-y-1 text-sm">
            <div className="flex gap-3">
              <span className="w-24 font-bold text-slate-800">Invoice No</span>
              <span className="text-slate-600">{invoice.number}</span>
            </div>
            <div className="flex gap-3">
              <span className="w-24 font-bold text-slate-800">Invoice Date</span>
              <span className="text-slate-600">{formatDate(invoice.issueDate)}</span>
            </div>
            <div className="flex gap-3">
              <span className="w-24 font-bold text-slate-800">Due Date</span>
              <span className="text-slate-600">{formatDate(invoice.dueDate)}</span>
            </div>
          </div>
        </div>
        <Logo />
      </div>

      {/* Billed By / Billed To */}
      <div className="mt-8 grid grid-cols-2 gap-5">
        <div className="rounded-lg bg-teal-light p-4">
          <h2 className="mb-2 text-lg font-semibold text-primary">Billed By</h2>
          <p className="font-semibold text-slate-800">{COMPANY.name}</p>
          <p className="text-sm text-slate-600">Mombasa Road, Ramis Centre, 2nd Floor,</p>
          <p className="text-sm text-slate-600">P.O. Box 57933-00200,</p>
          <p className="text-sm text-slate-600">Nairobi, Kenya</p>
          <p className="mt-2 text-sm text-slate-700">
            <span className="font-semibold">VAT Number:</span> {COMPANY.kraPin}
          </p>
          <p className="text-sm text-slate-700">
            <span className="font-semibold">Email:</span> {COMPANY.email}
          </p>
          <p className="text-sm text-slate-700">
            <span className="font-semibold">Phone:</span> {COMPANY.phone}
          </p>
        </div>
        <div className="rounded-lg bg-teal-light p-4">
          <h2 className="mb-2 text-lg font-semibold text-primary">Billed To</h2>
          <p className="font-semibold uppercase text-slate-800">{invoice.client?.name}</p>
          {invoice.client?.address && (
            <p className="text-sm text-slate-600">{invoice.client.address}</p>
          )}
          {invoice.client?.city && (
            <p className="text-sm text-slate-600">{invoice.client.city}</p>
          )}
          {invoice.client?.country && (
            <p className="text-sm text-slate-600">{invoice.client.country}</p>
          )}
          {invoice.client?.taxPin && (
            <p className="mt-2 text-sm text-slate-700">
              <span className="font-semibold">PIN:</span> {invoice.client.taxPin}
            </p>
          )}
        </div>
      </div>

      {/* Items table */}
      <table className="mt-6 w-full border-collapse text-sm">
        <thead>
          <tr className="bg-primary text-left text-white">
            <th className="rounded-l-md px-3 py-3 font-semibold">Item</th>
            <th className="px-2 py-3 text-center font-semibold">Local Tax Rate</th>
            <th className="px-2 py-3 text-center font-semibold">Quantity</th>
            <th className="px-2 py-3 text-right font-semibold">Rate</th>
            <th className="px-2 py-3 text-right font-semibold">Amount</th>
            <th className="px-2 py-3 text-right font-semibold">Local Tax</th>
            <th className="rounded-r-md px-3 py-3 text-right font-semibold">Total</th>
          </tr>
        </thead>
        <tbody className="bg-teal-light/60">
          {invoice.items.map((it, i) => (
            <tr key={it.id ?? i} className="align-top">
              <td className="px-3 py-4 text-slate-700">
                <span className="mr-1 font-semibold">{i + 1}.</span>
                <span className="whitespace-pre-line">{it.description}</span>
              </td>
              <td className="px-2 py-4 text-center text-slate-700">{it.taxRate}%</td>
              <td className="px-2 py-4 text-center text-slate-700">{formatNumber(it.quantity)}</td>
              <td className="px-2 py-4 text-right text-slate-700">{symbol}{formatNumber(it.rate)}</td>
              <td className="px-2 py-4 text-right text-slate-700">{symbol}{formatNumber(it.amount ?? 0)}</td>
              <td className="px-2 py-4 text-right text-slate-700">{symbol}{formatNumber(it.taxAmount ?? 0)}</td>
              <td className="px-3 py-4 text-right font-semibold text-slate-800">{symbol}{formatNumber(it.total ?? 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals + words */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="text-sm">
          <span className="font-bold text-slate-800">Total (in words) : </span>
          <span className="uppercase text-slate-700">{invoice.totalInWords}</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Amount</span>
            <span className="text-slate-800">{symbol}{formatNumber(invoice.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Local Tax</span>
            <span className="text-slate-800">{symbol}{formatNumber(invoice.taxTotal)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t-2 border-slate-800 pt-2">
            <span className="text-lg font-bold text-slate-900">Total ({invoice.currency})</span>
            <span className="text-lg font-bold text-slate-900">{symbol}{formatNumber(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Bank details */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="rounded-lg bg-teal-light p-4">
          <h3 className="mb-2 text-base font-semibold text-primary">Bank Details</h3>
          <div className="grid grid-cols-[130px_1fr] gap-y-1 text-sm">
            <span className="font-bold text-slate-800">Account Name</span>
            <span className="text-slate-700">{COMPANY.bank.accountName}</span>
            <span className="font-bold text-slate-800">Account Number</span>
            <span className="text-slate-700">{COMPANY.bank.accountNumber}</span>
            <span className="font-bold text-slate-800">SWIFT Code</span>
            <span className="text-slate-700">{COMPANY.bank.swift}</span>
            <span className="font-bold text-slate-800">Bank</span>
            <span className="text-slate-700">{COMPANY.bank.name}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mt-6">
          <h3 className="text-base font-semibold text-primary">Additional Notes</h3>
          <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{invoice.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-10 border-t border-dashed border-slate-300 pt-3 text-[11px] text-slate-500">
        <div className="flex justify-between">
          <div>
            <p><span className="text-slate-400">Invoice No</span> {invoice.number}</p>
            <p><span className="text-slate-400">Invoice Date</span> {formatDate(invoice.issueDate)}</p>
            <p><span className="text-slate-400">Billed To</span> {invoice.client?.name}</p>
          </div>
          <div className="self-end">Page 1 of 1</div>
        </div>
        <p className="mt-2 text-center text-slate-400">
          This is an electronically generated document, no signature is required.
        </p>
      </div>
    </div>
  );
}
