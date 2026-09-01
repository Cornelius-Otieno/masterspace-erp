import type { DeliveryNote } from '@/types';
import { COMPANY } from '@/lib/company';
import { Logo } from '@/components/ui/Logo';
import { formatDate, formatNumber } from '@/lib/utils';

export function DeliveryNoteTemplate({ note }: { note: DeliveryNote }) {
  return (
    <div className="doc-sheet print-area font-sans">
      <div className="flex items-start justify-between">
        <Logo />
        <div className="text-right">
          <h1 className="text-3xl font-extrabold tracking-tight text-navy">DELIVERY NOTE</h1>
          <p className="text-xs font-medium tracking-wide text-primary">PROOF OF DELIVERY</p>
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
              ['POD NO.', note.number],
              ['DATE', formatDate(note.issueDate)],
              ['DELIVERY DATE', formatDate(note.deliveryDate)],
              ['STATUS', note.status],
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
          <p className="text-xs font-bold tracking-wide text-primary">DELIVER TO</p>
          <p className="mt-1 font-bold text-slate-800">{note.client?.name}</p>
          {note.client?.address && <p className="text-sm text-slate-600">{note.client.address}</p>}
          {note.client?.city && <p className="text-sm text-slate-600">{note.client.city}, {note.client.country}</p>}
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-bold tracking-wide text-primary">DELIVERED BY</p>
          <p className="mt-1 font-bold text-slate-800">{note.deliveredBy || COMPANY.name}</p>
          <p className="text-sm text-slate-600">Delivery date: {formatDate(note.deliveryDate)}</p>
        </div>
      </div>

      <table className="mt-5 w-full border-collapse text-sm">
        <thead>
          <tr className="bg-navy text-left text-white">
            <th className="px-3 py-3">#</th>
            <th className="px-3 py-3">ITEM DESCRIPTION</th>
            <th className="px-3 py-3 text-center">QTY</th>
            <th className="px-3 py-3 text-center">UNIT</th>
            <th className="px-3 py-3">REMARKS</th>
          </tr>
        </thead>
        <tbody>
          {note.items.map((it, i) => (
            <tr key={it.id ?? i} className="border-b border-slate-100 align-top">
              <td className="px-3 py-4 text-slate-500">{i + 1}</td>
              <td className="px-3 py-4 font-semibold text-slate-800">{it.description}</td>
              <td className="px-3 py-4 text-center text-slate-600">{formatNumber(it.quantity)}</td>
              <td className="px-3 py-4 text-center text-slate-600">{it.unit || '—'}</td>
              <td className="px-3 py-4 text-slate-600">{it.remarks || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {note.notes && (
        <div className="mt-6 rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-bold tracking-wide text-primary">NOTES &amp; TERMS</p>
          <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{note.notes}</p>
        </div>
      )}

      <div className="mt-12 grid grid-cols-2 gap-10">
        <div className="border-t-2 border-slate-800 pt-2 text-sm">
          Delivered By — <span className="font-bold">{note.deliveredBy || '—'}</span>
        </div>
        <div className="border-t-2 border-slate-800 pt-2 text-sm">
          Received By — <span className="font-bold">&nbsp;</span>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-200 pt-3 text-center text-[10px] text-slate-400">
        <p>{COMPANY.addressShort} | KRA PIN: {COMPANY.kraPin} | {COMPANY.tagline}</p>
      </div>
    </div>
  );
}
