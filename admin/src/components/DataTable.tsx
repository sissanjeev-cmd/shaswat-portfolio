import { ReactNode, useEffect, useRef, useState } from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onSearch?: (q: string) => void;
  loading?: boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onArchive?: (row: T) => void;
  onRestore?: (row: T) => void;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  total,
  page,
  limit,
  onPageChange,
  onSearch,
  loading = false,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
}: DataTableProps<T>) {
  const [searchVal, setSearchVal] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const hasActions = onEdit || onDelete || onArchive || onRestore;

  const handleSearch = (val: string) => {
    setSearchVal(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch?.(val);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const isArchived = (row: T) => row['isArchived'] === true;
  const isDeleted = (row: T) =>
    row['deletedAt'] !== null && row['deletedAt'] !== undefined;

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900">
      {/* Toolbar */}
      {onSearch && (
        <div className="flex items-center gap-3 border-b border-gray-800 px-4 py-3">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search..."
              value={searchVal}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 pl-9 pr-3 py-2 text-sm text-gray-100 placeholder-gray-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <span className="text-sm text-gray-500">
            {total} record{total !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  {col.header}
                </th>
              ))}
              {hasActions && (
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="py-12 text-center"
                >
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="py-12 text-center text-gray-500"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-gray-800 transition-colors hover:bg-gray-800/60 ${
                    idx % 2 === 0 ? 'bg-transparent' : 'bg-gray-900/40'
                  }`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-gray-300">
                      {col.render
                        ? col.render(row)
                        : String(row[col.key] ?? '—')}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="rounded border border-gray-600 px-2.5 py-1 text-xs text-gray-300 transition-colors hover:border-gray-400 hover:text-gray-100"
                          >
                            Edit
                          </button>
                        )}
                        {onArchive && !isArchived(row) && !isDeleted(row) && (
                          <button
                            onClick={() => onArchive(row)}
                            className="rounded border border-yellow-600 px-2.5 py-1 text-xs text-yellow-400 transition-colors hover:border-yellow-400 hover:text-yellow-300"
                          >
                            Archive
                          </button>
                        )}
                        {onRestore && (isArchived(row) || isDeleted(row)) && (
                          <button
                            onClick={() => onRestore(row)}
                            className="rounded border border-green-600 px-2.5 py-1 text-xs text-green-400 transition-colors hover:border-green-400 hover:text-green-300"
                          >
                            Restore
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="rounded border border-red-700 px-2.5 py-1 text-xs text-red-400 transition-colors hover:border-red-500 hover:text-red-300"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-800 px-4 py-3">
        <span className="text-xs text-gray-500">
          Page {page} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded border border-gray-700 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-gray-500 hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Prev
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded border border-gray-700 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-gray-500 hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
