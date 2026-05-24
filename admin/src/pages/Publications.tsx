import { useState } from 'react';
import { api } from '../api/api';
import DataTable from '../components/DataTable';
import FormModal, { FieldDef } from '../components/FormModal';
import PageHeader from '../components/PageHeader';
import Sidebar from '../components/Sidebar';
import { useResource } from '../hooks/useResource';

type PublicationRow = Record<string, unknown>;

const FIELDS: FieldDef[] = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'venue', label: 'Venue', type: 'text' },
  { key: 'year', label: 'Year', type: 'number' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'url', label: 'URL', type: 'text' },
  { key: 'sortOrder', label: 'Sort Order', type: 'number' },
];

const COLUMNS = [
  {
    key: 'title',
    header: 'Title',
    render: (row: PublicationRow) => (
      <span className="line-clamp-2 max-w-xs text-sm">
        {String(row['title'] ?? '—')}
      </span>
    ),
  },
  { key: 'venue', header: 'Venue' },
  { key: 'year', header: 'Year' },
  { key: 'sortOrder', header: 'Order' },
];

export default function PublicationsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PublicationRow | null>(null);
  const { data, total, page, limit, loading, setPage, handleSearch, refresh } =
    useResource<PublicationRow>('/api/v1/admin/publications');

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (row: PublicationRow) => {
    setEditing(row);
    setModalOpen(true);
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (editing?.id) {
      await api.put(`/api/v1/admin/publications/${editing.id}`, values);
    } else {
      await api.post('/api/v1/admin/publications', values);
    }
    refresh();
  };

  const handleDelete = async (row: PublicationRow) => {
    if (!window.confirm('Delete this publication?')) return;
    await api.delete(`/api/v1/admin/publications/${row['id']}`);
    refresh();
  };

  const handleArchive = async (row: PublicationRow) => {
    await api.patch(`/api/v1/admin/publications/${row['id']}/archive`);
    refresh();
  };

  const handleRestore = async (row: PublicationRow) => {
    await api.patch(`/api/v1/admin/publications/${row['id']}/restore`);
    refresh();
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <PageHeader
          title="Publications"
          description="Manage academic publications"
          action={
            <button
              onClick={openCreate}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              + Add Publication
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
          title={editing ? 'Edit Publication' : 'Add Publication'}
          fields={FIELDS}
          initialValues={editing ?? {}}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
