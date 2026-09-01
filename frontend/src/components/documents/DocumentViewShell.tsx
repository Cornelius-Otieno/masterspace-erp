import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Printer, Pencil, Trash2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { api } from '@/lib/api';
import { GhostButton, PrimaryButton, Select } from '@/components/ui/Form';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DocumentPreview } from './DocumentPreview';

interface Props {
  type: 'invoice' | 'purchase-order' | 'quotation' | 'delivery-note' | 'receipt' | 'work-order';
  endpoint: string;
  statuses: string[];
  title: string;
}

export function DocumentViewShell({ type, endpoint, statuses, title }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get(`/${endpoint}/${id}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id, endpoint]);

  const onStatusChange = async (status: string) => {
    const res = await api.patch(`/${endpoint}/${id}/status`, { status });
    setData(res.data);
  };

  const onDelete = async () => {
    await api.delete(`/${endpoint}/${id}`);
    navigate(`/${endpoint}`);
  };

  const onDownloadPdf = async () => {
    const documentElement = document.querySelector<HTMLElement>('.print-area');
    if (!documentElement) return;

    setDownloading(true);
    try {
      await document.fonts.ready;
      await html2pdf()
        .set({
          margin: 0,
          filename: `${data.number}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(documentElement)
        .save();
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading…</div>;
  if (!data) return <div className="p-8 text-center text-slate-400">{title} not found.</div>;

  return (
    <div>
      {/* Toolbar (hidden on print) */}
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <GhostButton onClick={() => navigate(`/${endpoint}`)}>
          <ArrowLeft size={16} /> Back
        </GhostButton>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={data.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-40"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.replace('_', ' ')}
              </option>
            ))}
          </Select>
          <GhostButton onClick={() => navigate(`/${endpoint}/${id}/edit`)}>
            <Pencil size={16} /> Edit
          </GhostButton>
          <GhostButton onClick={() => setConfirmOpen(true)} className="text-red-600">
            <Trash2 size={16} /> Delete
          </GhostButton>
          <PrimaryButton onClick={onDownloadPdf} disabled={downloading}>
            <Printer size={16} /> {downloading ? 'Preparing PDF…' : 'Download PDF'}
          </PrimaryButton>
        </div>
      </div>

      <div className="overflow-x-auto pb-8">
        <DocumentPreview type={type} data={data} />
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={`Delete ${title}`}
        message={`Are you sure you want to delete ${data.number}? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={onDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
