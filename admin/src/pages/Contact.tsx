import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/api';
import PageHeader from '../components/PageHeader';
import Sidebar from '../components/Sidebar';

interface ContactMessage {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  subject?: string;
  message?: string;
  isRead?: boolean;
  createdAt?: string;
  deletedAt?: string | null;
  [key: string]: unknown;
}

interface ListResponse {
  items: ContactMessage[];
  total: number;
  page: number;
  limit: number;
}

const LIMIT = 20;

const COLUMNS = [
  {
    key: 'name',
    header: 'Name',
    render: (row: ContactMessage) => (
      <span className="font-medium text-gray-200">
        {[row.firstName, row.lastName].filter(Boolean).join(' ') || '—'}
      </span>
    ),
  },
  { key: 'email', header: 'Email' },
  {
    key: 'subject',
    header: 'Subject',
    render: (row: ContactMessage) => (
      <span className="max-w-xs truncate block">
        {row.subject || <span className="text-gray-600">—</span>}
      </span>
    ),
  },
  {
    key: 'message',
    header: 'Message',
    render: (row: ContactMessage) => (
      <span className="max-w-xs truncate block text-gray-400 text-xs">
        {row.message
          ? row.message.length > 80
            ? row.message.slice(0, 80) + '...'
            : row.message
          : '—'}
      </span>
    ),
  },
  {
    key: 'isRead',
    header: 'Status',
    render: (row: ContactMessage) =>
      row.isRead ? (
        <span className="text-xs text-gray-500">Read</span>
      ) : (
        <span className="flex items-center gap-1.5 text-xs font-medium text-indigo-400">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          Unread
        </span>
      ),
  },
  {
    key: 'createdAt',
    header: 'Date',
    render: (row: ContactMessage) =>
      row.createdAt ? (
        <span className="text-xs text-gray-500">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ) : (
        <span className="text-gray-600">—</span>
      ),
  },
];

export default function ContactPage() {
  const [data, setData] = useState<ContactMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(
    async (p: number, q: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(p),
          limit: String(LIMIT),
          ...(q ? { search: q } : {}),
        });
        const res = await api.get<ListResponse>(
          `/api/v1/admin/contact?${params.toString()}`
        );
        setData(res.items);
        setTotal(res.total);
      } catch {
        // silently handle
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchData(page, search);
  }, [fetchData, page, search]);

  const handleSearch = (q: string) => {
    setSearch(q);
    setPage(1);
  };

  const handleMarkRead = async (row: ContactMessage) => {
    await api.patch(`/api/v1/admin/contact/${row.id}/read`);
    fetchData(page, search);
  };

  const handleDelete = async (row: ContactMessage) => {
    if (!window.confirm('Permanently delete this message?')) return;
    await api.delete(`/api/v1/admin/contact/${row.id}`);
    fetchData(page, search);
  };

  // Build custom action buttons via onEdit (repurposed as "Mark Read")
  const customColumns = [
    ...COLUMNS,
  ];

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <PageHeader
          title="Contact Messages"
          description="View and manage incoming contact form submissions"
        />

        <div className="rounded-xl border border-gray-800 bg-gray-900">
          {/* Toolbar */}
          <div className="flex items-center gap-3 border-b border-gray-800 px-4 py-3">
            <div className="relative flex-1 max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search messages..."
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 pl-9 pr-3 py-2 text-sm text-gray-100 placeholder-gray-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <span className="text-sm text-gray-500">
              {total} message{total !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {customColumns.map((col) => (
                    <th
                      key={col.key}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {col.header}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={customColumns.length + 1} className="py-12 text-center">
                      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={customColumns.length + 1}
                      className="py-12 text-center text-gray-500"
                    >
                      No messages found.
                    </td>
                  </tr>
                ) : (
                  data.map((row, idx) => (
                    <tr
                      key={row.id}
                      className={`border-b border-gray-800 transition-colors hover:bg-gray-800/60 ${
                        idx % 2 === 0 ? 'bg-transparent' : 'bg-gray-900/40'
                      } ${!row.isRead ? 'border-l-2 border-l-indigo-500' : ''}`}
                    >
                      {customColumns.map((col) => (
                        <td key={col.key} className="px-4 py-3 text-gray-300">
                          {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '—')}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!row.isRead && (
                            <button
                              onClick={() => handleMarkRead(row)}
                              className="rounded border border-indigo-700 px-2.5 py-1 text-xs text-indigo-400 transition-colors hover:border-indigo-500 hover:text-indigo-300"
                            >
                              Mark Read
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(row)}
                            className="rounded border border-red-700 px-2.5 py-1 text-xs text-red-400 transition-colors hover:border-red-500 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-800 px-4 py-3">
            <span className="text-xs text-gray-500">
              Page {page} of {Math.max(1, Math.ceil(total / LIMIT))}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded border border-gray-700 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-gray-500 hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Prev
              </button>
              <button
                disabled={page >= Math.ceil(total / LIMIT)}
                onClick={() => setPage((p) => p + 1)}
                className="rounded border border-gray-700 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-gray-500 hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
