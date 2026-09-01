import type { WorkOrder } from '@/types';
import { COMPANY } from '@/lib/company';
import { Logo } from '@/components/ui/Logo';
import { formatDate, formatNumber } from '@/lib/utils';

export function WorkOrderTemplate({ workOrder }: { workOrder: WorkOrder }) {
  const totalHours = workOrder.tasks.reduce((s, t) => s + (t.estimatedHours ?? 0), 0);
  return (
    <div className="doc-sheet print-area font-sans">
      <div className="flex items-start justify-between">
        <Logo />
        <div className="text-right">
          <h1 className="text-3xl font-extrabold tracking-tight text-navy">WORK ORDER</h1>
          <p className="text-xs font-medium tracking-wide text-primary">JOB EXECUTION AUTHORISATION</p>
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
              ['WOR NO.', workOrder.number],
              ['DATE', formatDate(workOrder.issueDate)],
              ['EXPECTED COMPLETION', formatDate(workOrder.expectedDate)],
              ['STATUS', workOrder.status.replace('_', ' ')],
            ].map(([k, v]) => (
              <tr key={k}>
                <td className="w-2/5 border border-slate-200 bg-teal-light px-3 py-2 font-semibold text-primary">{k}</td>
                <td className="border border-slate-200 px-3 py-2 font-semibold text-slate-800">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 p-4">
        <p className="text-xs font-bold tracking-wide text-primary">CLIENT / SITE DETAILS</p>
        <p className="mt-1 font-bold text-slate-800">{workOrder.client?.name}</p>
        {workOrder.siteDetails && <p className="text-sm text-slate-600">{workOrder.siteDetails}</p>}
        {workOrder.client?.address && <p className="text-sm text-slate-600">{workOrder.client.address}</p>}
      </div>

      <table className="mt-5 w-full border-collapse text-sm">
        <thead>
          <tr className="bg-navy text-left text-white">
            <th className="px-3 py-3">#</th>
            <th className="px-3 py-3">TASK</th>
            <th className="px-3 py-3">DESCRIPTION</th>
            <th className="px-3 py-3">ASSIGNED TO</th>
            <th className="px-3 py-3 text-right">EST. HOURS</th>
          </tr>
        </thead>
        <tbody>
          {workOrder.tasks.map((t, i) => (
            <tr key={t.id ?? i} className="border-b border-slate-100 align-top">
              <td className="px-3 py-4 text-slate-500">{i + 1}</td>
              <td className="px-3 py-4 font-semibold text-slate-800">{t.task}</td>
              <td className="px-3 py-4 text-slate-600">{t.description || '—'}</td>
              <td className="px-3 py-4 text-slate-600">{t.assignedTo || '—'}</td>
              <td className="px-3 py-4 text-right text-slate-700">{formatNumber(t.estimatedHours)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} className="px-3 py-3 text-right font-semibold text-slate-700">
              Total Estimated Hours
            </td>
            <td className="bg-navy px-3 py-3 text-right font-bold text-white">{formatNumber(totalHours)}</td>
          </tr>
        </tfoot>
      </table>

      {workOrder.notes && (
        <div className="mt-6 rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-bold tracking-wide text-primary">NOTES</p>
          <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{workOrder.notes}</p>
        </div>
      )}

      <div className="mt-12">
        <div className="w-64 border-t-2 border-slate-800 pt-2 text-sm">
          Authorized By — <span className="font-bold">{workOrder.authorizedBy || '—'}</span>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-200 pt-3 text-center text-[10px] text-slate-400">
        <p>{COMPANY.addressShort} | KRA PIN: {COMPANY.kraPin} | {COMPANY.tagline}</p>
      </div>
    </div>
  );
}
