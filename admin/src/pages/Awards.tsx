import { useState } from 'react';
import { api } from '../api/api';
import DataTable from '../components/DataTable';
import FormModal, { FieldDef } from '../components/FormModal';
import PageHeader from '../components/PageHeader';
import Sidebar from '../components/Sidebar';
import { useResource } from '../hooks/useResource';

type AwardRow = Record<string, unknown>;

const FIELDS: FieldDef[] = [
  { key: 'title', label: 'Award Title', type: 'text' },
  { key: 'issuer', label: 'Issuer', type: 'text' },
  { key: 'year', label: 'Year', type: 'number' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'badgeText', label: 'Badge Text', type: 'text', hint: 'Short label displayed on badge' },
  { key: 'badgeColor', label: 'Badge Color', type: 'text', hint: 'e.g. #6366f1 or indigo' },
  { key: 'sortOrder', label: 'Sort Order', type: 'number' },
];

const COLUMNS = [
  { key: 'title', header: 'Award' },
  { key: 'issuer', header: 'Issuer' },
  { key: 'year', header: 'Year' },
  {
    key: 'badgeText',
    header: 'Badge',
    render: (row: AwardRow) =>
      row['badgeText'] ? (
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
          style={{ backgroundColor: String(row['badgeColor'] || '#6366f1') }}
        >
          {String(row['badgeText'])}
        </span>
      ) : (
        <span className="text-gray-600">—</span>
      ),
  },
  { key: 'sortOrder', header: 'Order' },
];

export default function AwardsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AwardRow | null>(null);
  const { data, total, page, limit, loading, setPage, handleSearch, refresh } =
    useResource<AwardRow>('/api/v1/admin/awards');

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (row: AwardRow) => {
    setEditing(row);
    setModalOpen(true);
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (editing?.id) {
      await api.put(`/api/v1/admin/awards/${editing.id}`, values);
    } else {
      await api.post('/api/v1/admin/awards', values);
    }
    refresh();
  };

  const handleDelete = async (row: AwardRow) => {
    if (!window.confirm('Delete this award?')) return;
    await api.delete(`/api/v1/admin/awards/${row['id']}`);
    refresh();
  };

  const handleArchive = async (row: AwardRow) => {
    await api.patch(`/api/v1/admin/awards/${row['id']}/archive`);
    refresh();
  };

  const handleRestore = async (row: AwardRow) => {
    await api.patch(`/api/v1/admin/awards/${row['id']}/restore`);
    refresh();
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <PageHeader
          title="Awards"
          description="Manage awards and recognition"
          action={
            <button
              onClick={openCreate}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              + Add Award
            </button>
          }
        />
        <DataTable
          columns={COLUMNS}
          data={data}
          total={total}
          page={page}
          limit={limit}
          loading={loading}
          onPageChange={setPage}
          onSearch={handleSearch}
          onEdit={openEdit}
          onDelete={handleDelete}
          onArchive={handleArchive}
          onRestore={handleRestore}
        />
        <FormModal
          open={modalOpen}
          title={editing ? 'Edit Award' : 'Add Award'}
          fields={FIELDS}
          initialValues={editing ?? {}}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
