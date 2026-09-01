import { Plus, Trash2 } from 'lucide-react';

export interface ItemColumn {
  key: string;
  label: string;
  type?: 'text' | 'number';
  width?: string;
  step?: string;
  placeholder?: string;
}

interface Props<T extends Record<string, any>> {
  columns: ItemColumn[];
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  computeRow?: (row: T) => string;
  rowLabel?: string;
}

export function LineItemsEditor<T extends Record<string, any>>({
  columns,
  items,
  onChange,
  newItem,
  computeRow,
  rowLabel = 'Line',
}: Props<T>) {
  const update = (index: number, key: string, value: string, type?: string) => {
    const next = items.map((it, i) =>
      i === index ? { ...it, [key]: type === 'number' ? (value === '' ? 0 : Number(value)) : value } : it,
    );
    onChange(next);
  };

  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));
  const add = () => onChange([...items, newItem()]);

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="w-10 px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                #
              </th>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                  style={c.width ? { width: c.width } : undefined}
                >
                  {c.label}
                </th>
              ))}
              {computeRow && (
                <th className="px-2 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Amount
                </th>
              )}
              <th className="w-10 px-2 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((row, i) => (
              <tr key={i}>
                <td className="px-2 py-1.5 text-slate-400">{i + 1}</td>
                {columns.map((c) => (
                  <td key={c.key} className="px-2 py-1.5">
                    <input
                      type={c.type === 'number' ? 'number' : 'text'}
                      step={c.step}
                      placeholder={c.placeholder}
                      value={row[c.key] ?? (c.type === 'number' ? 0 : '')}
                      onChange={(e) => update(i, c.key, e.target.value, c.type)}
                      className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </td>
                ))}
                {computeRow && (
                  <td className="px-2 py-1.5 text-right font-medium text-slate-700">{computeRow(row)}</td>
                )}
                <td className="px-2 py-1.5 text-right">
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    disabled={items.length === 1}
                    title="Remove"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-primary/50 px-3 py-1.5 text-sm font-medium text-primary hover:bg-teal-light/40"
      >
        <Plus size={15} /> Add {rowLabel}
      </button>
    </div>
  );
}
