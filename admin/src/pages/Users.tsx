import { useState } from 'react';
import { api } from '../api/api';
import FormModal, { FieldDef } from '../components/FormModal';
import PageHeader from '../components/PageHeader';
import Sidebar from '../components/Sidebar';
import { useResource } from '../hooks/useResource';

type UserRow = Record<string, unknown>;

const CREATE_FIELDS: FieldDef[] = [
  { key: 'email', label: 'Email', type: 'text', required: true },
  { key: 'displayName', label: 'Display Name', type: 'text', required: true },
  {
    key: 'role',
    label: 'Role',
    type: 'select',
    required: true,
    options: [
      { value: 'SUPER_ADMIN', label: 'Super Admin' },
      { value: 'ADMIN', label: 'Admin' },
      { value: 'VIEWER', label: 'Viewer' },
    ],
  },
  { key: 'password', label: 'Password', type: 'text', required: true },
];

const EDIT_FIELDS: FieldDef[] = [
  { key: 'displayName', label: 'Display Name', type: 'text' },
  {
    key: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { value: 'SUPER_ADMIN', label: 'Super Admin' },
      { value: 'ADMIN', label: 'Admin' },
      { value: 'VIEWER', label: 'Viewer' },
    ],
  },
  { key: 'password', label: 'New Password (leave blank to keep)', type: 'text' },
];

const COLUMNS = [
  { key: 'displayName', header: 'Name' },
  { key: 'email', header: 'Email' },
  {
    key: 'role',
    header: 'Role',
    render: (row: UserRow) => {
      const role = String(row['role'] ?? '');
      const colors: Record<string, string> = {
        SUPER_ADMIN: 'bg-red-900/50 text-red-400',
        ADMIN: 'bg-indigo-900/50 text-indigo-400',
        VIEWER: 'bg-gray-800 text-gray-400',
      };
      return (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            colors[role] ?? 'bg-gray-800 text-gray-400'
          }`}
        >
          {role}
        </span>
      );
    },
  },
  {
    key: 'isActive',
    header: 'Status',
    render: (row: UserRow) =>
      row['isActive'] ? (
        <span className="rounded-full bg-green-900/50 px-2 py-0.5 text-xs text-green-400">
          Active
        </span>
      ) : (
        <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-500">
          Inactive
        </span>
      ),
  },
  {
    key: 'lastLoginAt',
    header: 'Last Login',
    render: (row: UserRow) =>
      row['lastLoginAt'] ? (
        <span className="text-xs text-gray-500">
          {new Date(String(row['lastLoginAt'])).toLocaleDateString()}
        </span>
      ) : (
        <span className="text-gray-600">Never</span>
      ),
  },
  {
    key: 'createdAt',
    header: 'Created',
    render: (row: UserRow) =>
      row['createdAt'] ? (
        <span className="text-xs text-gray-500">
          {new Date(String(row['createdAt'])).toLocaleDateString()}
        </span>
      ) : (
        <span className="text-gray-600">—</span>
      ),
  },
];

export default function UsersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const { data, total, page, limit, loading, setPage, handleSearch, refresh } =
    useResource<UserRow>('/api/v1/admin/users');

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (row: UserRow) => {
    setEditing(row);
    setModalOpen(true);
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    // Remove empty password on edit
    const payload = { ...values };
    if (editing && !payload['password']) {
      delete payload['password'];
    }
    if (editing?.id) {
      await api.put(`/api/v1/admin/users/${editing.id}`, payload);
    } else {
      await api.post('/api/v1/admin/users', payload);
    }
    refresh();
  };

  const handleDelete = async (row: UserRow) => {
    if (!window.confirm(`Delete user "${row['displayName'] ?? row['email']}"?`)) return;
    await api.delete(`/api/v1/admin/users/${row['id']}`);
    refresh();
  };

  const handleToggleActive = async (row: UserRow) => {
    if (row['isActive']) {
      await api.patch(`/api/v1/admin/users/${row['id']}/deactivate`);
    } else {
      await api.patch(`/api/v1/admin/users/${row['id']}/activate`);
    }
    refresh();
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <PageHeader
          title="Users"
          description="Manage admin panel users (SUPER_ADMIN only)"
          action={
            <button
              onClick={openCreate}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              + Add User
            </button>
          }
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
                placeholder="Search users..."
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 pl-9 pr-3 py-2 text-sm text-gray-100 placeholder-gray-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <span className="text-sm text-gray-500">
              {total} user{total !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {COLUMNS.map((col) => (
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
                    <td colSpan={COLUMNS.length + 1} className="py-12 text-center">
                      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={COLUMNS.length + 1}
                      className="py-12 text-center text-gray-500"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  data.map((row, idx) => (
                    <tr
                      key={String(row['id'] ?? idx)}
                      className={`border-b border-gray-800 transition-colors hover:bg-gray-800/60 ${
                        idx % 2 === 0 ? 'bg-transparent' : 'bg-gray-900/40'
                      }`}
                    >
                      {COLUMNS.map((col) => (
                        <td key={col.key} className="px-4 py-3 text-gray-300">
                          {col.render ? col.render(row) : String(row[col.key] ?? '—')}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(row)}
                            className="rounded border border-gray-600 px-2.5 py-1 text-xs text-gray-300 transition-colors hover:border-gray-400 hover:text-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleActive(row)}
                            className={`rounded border px-2.5 py-1 text-xs transition-colors ${
                              row['isActive']
                                ? 'border-yellow-600 text-yellow-400 hover:border-yellow-400 hover:text-yellow-300'
                                : 'border-green-600 text-green-400 hover:border-green-400 hover:text-green-300'
                            }`}
                          >
                            {row['isActive'] ? 'Deactivate' : 'Activate'}
                          </button>
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
              Page {page} of {Math.max(1, Math.ceil(total / limit))}
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
                disabled={page >= Math.ceil(total / limit)}
                onClick={() => setPage((p) => p + 1)}
                className="rounded border border-gray-700 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-gray-500 hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        <FormModal
          open={modalOpen}
          title={editing ? 'Edit User' : 'Add User'}
          fields={editing ? EDIT_FIELDS : CREATE_FIELDS}
          initialValues={editing ? { displayName: editing['displayName'], role: editing['role'] } : {}}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
